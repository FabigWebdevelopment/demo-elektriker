import { sleep } from "workflow";
import {
  renderLeadConfirmation,
  renderFollowUp1,
  renderFollowUp2,
  renderFollowUp3,
  renderOwnerNotification,
  getEmailSender,
} from "@/emails/render";
import { brandConfig } from "@/emails/config/brand.config";

// Types
interface LeadContact {
  name: string;
  email: string;
  phone: string;
  plz?: string;
  address?: string;
}

interface LeadScoring {
  totalScore: number;
  classification: "hot" | "warm" | "potential" | "nurture";
  tags: string[];
}

interface LeadSubmission {
  funnelId: string;
  contact: LeadContact;
  data: Record<string, unknown>;
  scoring: LeadScoring;
  meta: {
    source: string;
    createdAt: string;
    gdprConsent: boolean;
  };
}

interface TwentyPerson {
  id: string;
  name: { firstName: string; lastName: string };
  emails: { primaryEmail: string };
}

interface TwentyOpportunity {
  id: string;
  name: string;
  stage: string;
}

// Environment variables
const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || "";
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || "thomas@fabig.website";

// Funnel display names
const FUNNEL_NAMES: Record<string, string> = {
  "smart-home-beratung": "Smart Home Beratung",
  "elektro-anfrage": "Elektroinstallation",
  "sicherheit-beratung": "Sicherheitstechnik",
  "wallbox-anfrage": "Wallbox Installation",
};

// Helper: Parse name
function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

// Helper: Format lead notes
function formatLeadNotes(submission: LeadSubmission): string {
  const lines: string[] = [
    `📊 Lead Score: ${submission.scoring.totalScore} (${submission.scoring.classification.toUpperCase()})`,
    `🏷️ Tags: ${submission.scoring.tags.join(", ")}`,
    "",
    "📋 Funnel-Daten:",
  ];

  for (const [key, value] of Object.entries(submission.data)) {
    if (["name", "email", "phone", "plz", "address"].includes(key)) continue;
    const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    lines.push(`• ${formattedKey}: ${Array.isArray(value) ? value.join(", ") : value}`);
  }

  lines.push("", `📍 Quelle: ${submission.meta.source}`, `📅 Erstellt: ${submission.meta.createdAt}`);
  return lines.join("\n");
}

// Helper: Get Twenty API URL with https
function getTwentyApiUrl(): string {
  let url = TWENTY_API_URL;
  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }
  // Ensure it ends with /rest
  if (url && !url.endsWith("/rest")) {
    url = url.replace(/\/$/, "") + "/rest";
  }
  return url;
}

/**
 * Main Lead Processing Workflow
 * Triggered when a user submits a funnel on the website
 */
export async function processLead(submission: LeadSubmission) {
  "use workflow";

  const funnelName = FUNNEL_NAMES[submission.funnelId] || submission.funnelId;
  const isHotLead = submission.scoring.classification === "hot";
  const { firstName } = parseName(submission.contact.name);

  // Step 1: Create Person in Twenty CRM
  const person = await createPersonInCRM(submission);

  // Step 2: Create Opportunity in Twenty CRM
  const opportunity = await createOpportunityInCRM(submission, person, funnelName);

  // Step 3: Add Note with funnel details
  await createNoteInCRM(submission, opportunity.id);

  // Step 4: Send confirmation email to customer (React Email)
  await sendCustomerConfirmationEmail(submission, funnelName);

  // Step 5: Notify owner (immediate for hot leads)
  await notifyOwner(submission, funnelName);

  // Step 6: Schedule follow-up check after 24 hours
  await sleep("24h");
  await sendFollowUp1(submission, funnelName, person, opportunity);

  // Step 7: Second follow-up after 3 more days (day 4 total)
  await sleep("3d");
  await sendFollowUp2(submission, funnelName, person, opportunity);

  // Step 8: Final follow-up after 3 more days (day 7 total)
  await sleep("3d");
  await sendFollowUp3(submission, funnelName, person, opportunity);

  return {
    success: true,
    personId: person.id,
    opportunityId: opportunity.id,
    classification: submission.scoring.classification,
  };
}

/**
 * Step: Create Person in Twenty CRM
 */
async function createPersonInCRM(submission: LeadSubmission): Promise<TwentyPerson> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log("Twenty CRM not configured, skipping person creation");
    return {
      id: `local_${Date.now()}`,
      name: parseName(submission.contact.name),
      emails: { primaryEmail: submission.contact.email },
    };
  }

  const { firstName, lastName } = parseName(submission.contact.name);

  const response = await fetch(`${apiUrl}/people`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: { firstName, lastName },
      emails: { primaryEmail: submission.contact.email },
      phones: { primaryPhoneNumber: submission.contact.phone },
      city: submission.contact.plz || "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create person: ${errorText}`);
    // Return local fallback
    return {
      id: `local_${Date.now()}`,
      name: { firstName, lastName },
      emails: { primaryEmail: submission.contact.email },
    };
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Step: Create Opportunity in Twenty CRM
 */
async function createOpportunityInCRM(
  submission: LeadSubmission,
  person: TwentyPerson,
  funnelName: string
): Promise<TwentyOpportunity> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log("Twenty CRM not configured, skipping opportunity creation");
    return {
      id: `local_opp_${Date.now()}`,
      name: `${funnelName} - ${person.name.lastName || person.name.firstName}`,
      stage: "NEW",
    };
  }

  const stage = submission.scoring.classification === "hot" ? "SCREENING" : "NEW";

  const response = await fetch(`${apiUrl}/opportunities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `${funnelName} - ${person.name.lastName || person.name.firstName}`,
      stage,
      pointOfContactId: person.id,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to create opportunity: ${errorText}`);
    return {
      id: `local_opp_${Date.now()}`,
      name: `${funnelName} - ${person.name.lastName || person.name.firstName}`,
      stage: "NEW",
    };
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Step: Create Note with funnel details
 */
async function createNoteInCRM(submission: LeadSubmission, opportunityId: string): Promise<void> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log("Twenty CRM not configured, skipping note creation");
    return;
  }

  const noteContent = formatLeadNotes(submission);

  await fetch(`${apiUrl}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: noteContent,
    }),
  });
}

/**
 * Step: Send confirmation email to customer (React Email)
 */
async function sendCustomerConfirmationEmail(
  submission: LeadSubmission,
  funnelName: string
): Promise<void> {
  "use step";

  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping customer email");
    return;
  }

  const { firstName } = parseName(submission.contact.name);
  const sender = getEmailSender();

  // Render React Email template (customer-facing - no internal scoring data)
  const { html, subject } = await renderLeadConfirmation(
    {
      firstName,
      email: submission.contact.email,
      phone: submission.contact.phone,
      plz: submission.contact.plz,
      address: submission.contact.address,
    },
    {
      funnelId: submission.funnelId,
      funnelName,
      selectedOptions: submission.data as Record<string, string | string[]>,
    }
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender.from,
      to: submission.contact.email,
      reply_to: sender.replyTo,
      subject,
      html,
    }),
  });
}

/**
 * Step: Notify owner about new lead (React Email)
 */
async function notifyOwner(
  submission: LeadSubmission,
  funnelName: string
): Promise<void> {
  "use step";

  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping owner notification");
    return;
  }

  const sender = getEmailSender();
  const crmLink = "https://crm.fabig-suite.de";

  // Render React Email template
  const { html, subject } = await renderOwnerNotification(
    {
      firstName: submission.contact.name, // Full name for owner
      email: submission.contact.email,
      phone: submission.contact.phone,
      plz: submission.contact.plz,
      address: submission.contact.address,
    },
    {
      funnelId: submission.funnelId,
      funnelName,
      selectedOptions: submission.data as Record<string, string | string[]>,
    },
    {
      score: submission.scoring.totalScore,
      classification: submission.scoring.classification,
      tags: submission.scoring.tags,
    },
    crmLink
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lead Notification <noreply@fabig.website>",
      to: OWNER_EMAIL,
      subject,
      html,
    }),
  });
}

/**
 * Step: Send Follow-Up Email #1 (Day 1)
 */
async function sendFollowUp1(
  submission: LeadSubmission,
  funnelName: string,
  person: TwentyPerson,
  opportunity: TwentyOpportunity
): Promise<void> {
  "use step";

  // TODO: Check CRM if opportunity has moved past NEW stage
  // If contacted, skip this follow-up
  const shouldSkip = await checkIfAlreadyContacted(opportunity.id);
  if (shouldSkip) {
    console.log(`Skipping follow-up 1 for ${person.id} - already contacted`);
    return;
  }

  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping follow-up 1");
    return;
  }

  const { firstName } = parseName(submission.contact.name);
  const sender = getEmailSender();

  const { html, subject } = await renderFollowUp1(
    {
      firstName,
      email: submission.contact.email,
      phone: submission.contact.phone,
    },
    {
      funnelId: submission.funnelId,
      funnelName,
      selectedOptions: submission.data as Record<string, string | string[]>,
    }
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender.from,
      to: submission.contact.email,
      reply_to: sender.replyTo,
      subject,
      html,
    }),
  });
}

/**
 * Step: Send Follow-Up Email #2 (Day 3)
 */
async function sendFollowUp2(
  submission: LeadSubmission,
  funnelName: string,
  person: TwentyPerson,
  opportunity: TwentyOpportunity
): Promise<void> {
  "use step";

  const shouldSkip = await checkIfAlreadyContacted(opportunity.id);
  if (shouldSkip) {
    console.log(`Skipping follow-up 2 for ${person.id} - already contacted`);
    return;
  }

  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping follow-up 2");
    return;
  }

  const { firstName } = parseName(submission.contact.name);
  const sender = getEmailSender();

  const { html, subject } = await renderFollowUp2(
    {
      firstName,
      email: submission.contact.email,
      phone: submission.contact.phone,
    },
    {
      funnelId: submission.funnelId,
      funnelName,
      selectedOptions: submission.data as Record<string, string | string[]>,
    }
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender.from,
      to: submission.contact.email,
      reply_to: sender.replyTo,
      subject,
      html,
    }),
  });
}

/**
 * Step: Send Follow-Up Email #3 (Day 7 - Final)
 */
async function sendFollowUp3(
  submission: LeadSubmission,
  funnelName: string,
  person: TwentyPerson,
  opportunity: TwentyOpportunity
): Promise<void> {
  "use step";

  const shouldSkip = await checkIfAlreadyContacted(opportunity.id);
  if (shouldSkip) {
    console.log(`Skipping follow-up 3 for ${person.id} - already contacted`);
    return;
  }

  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping follow-up 3");
    return;
  }

  const { firstName } = parseName(submission.contact.name);
  const sender = getEmailSender();

  const { html, subject } = await renderFollowUp3(
    {
      firstName,
      email: submission.contact.email,
      phone: submission.contact.phone,
    },
    {
      funnelId: submission.funnelId,
      funnelName,
      selectedOptions: submission.data as Record<string, string | string[]>,
    }
  );

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender.from,
      to: submission.contact.email,
      reply_to: sender.replyTo,
      subject,
      html,
    }),
  });
}

/**
 * Helper: Check if lead has already been contacted
 * Checks CRM opportunity stage - if moved past NEW, skip follow-up
 */
async function checkIfAlreadyContacted(opportunityId: string): Promise<boolean> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY || opportunityId.startsWith("local_")) {
    return false; // Can't check, assume not contacted
  }

  try {
    const response = await fetch(`${apiUrl}/opportunities/${opportunityId}`, {
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    const opportunity = data.data || data;

    // If stage is no longer NEW, lead has been contacted
    const contactedStages = ["SCREENING", "MEETING", "PROPOSAL", "CUSTOMER", "CLOSED_WON", "CLOSED_LOST"];
    return contactedStages.includes(opportunity.stage);
  } catch {
    return false;
  }
}
