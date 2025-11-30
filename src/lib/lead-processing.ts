/**
 * Direct Lead Processing (No Workflow Library)
 *
 * Handles immediate CRM and email operations synchronously.
 * For follow-up sequences, use a separate scheduled job or webhook.
 */

import {
  renderLeadConfirmation,
  renderOwnerNotification,
  getEmailSender,
} from "@/emails/render";

// =============================================================================
// TYPES
// =============================================================================

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

export interface LeadSubmission {
  funnelId: string;
  contact: LeadContact;
  data: Record<string, unknown>;
  scoring: LeadScoring;
  meta: {
    source: string;
    createdAt: string;
    gdprConsent: boolean;
    userAgent?: string;
    referrer?: string;
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

// =============================================================================
// CONFIGURATION
// =============================================================================

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || "";
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || "thomas@fabig.website";
const CRM_BASE_URL = "https://crm.fabig-suite.de";

// Funnel display names and configuration
const FUNNEL_CONFIG: Record<string, {
  name: string;
  source: string;
  estimatedValue: { min: number; avg: number; max: number };
}> = {
  "smart-home-beratung": {
    name: "Smart Home Beratung",
    source: "SMART_HOME",
    estimatedValue: { min: 5000, avg: 15000, max: 50000 },
  },
  "elektro-anfrage": {
    name: "Elektroinstallation",
    source: "ELEKTRO",
    estimatedValue: { min: 500, avg: 3000, max: 15000 },
  },
  "sicherheit-beratung": {
    name: "Sicherheitstechnik",
    source: "SICHERHEIT",
    estimatedValue: { min: 2000, avg: 8000, max: 25000 },
  },
  "wallbox-anfrage": {
    name: "Wallbox Installation",
    source: "WALLBOX",
    estimatedValue: { min: 1500, avg: 3500, max: 8000 },
  },
};

// Classification mappings
const CLASSIFICATION_PROBABILITY: Record<string, number> = {
  hot: 70,
  warm: 40,
  potential: 20,
  nurture: 10,
};

const CLASSIFICATION_STAGE: Record<string, string> = {
  hot: "SCREENING",
  warm: "NEW",
  potential: "NEW",
  nurture: "NEW",
};

const CLASSIFICATION_URGENCY: Record<string, string> = {
  hot: "URGENT",
  warm: "SOON",
  potential: "PLANNED",
  nurture: "FLEXIBLE",
};

// =============================================================================
// HELPERS
// =============================================================================

function getTwentyApiUrl(): string {
  let url = TWENTY_API_URL;
  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }
  if (url && !url.endsWith("/rest")) {
    url = url.replace(/\/$/, "") + "/rest";
  }
  return url;
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
}

function getExpectedCloseDate(classification: string): string {
  const today = new Date();
  switch (classification) {
    case "hot": return addDays(today, 14);
    case "warm": return addDays(today, 30);
    case "potential": return addDays(today, 60);
    default: return addDays(today, 90);
  }
}

function getTaskDueDate(classification: string): string {
  const now = new Date();
  switch (classification) {
    case "hot": return addDays(now, 0);
    case "warm": return addDays(now, 1);
    case "potential": return addDays(now, 3);
    default: return addDays(now, 7);
  }
}

function getEstimatedAmount(funnelId: string, score: number): number {
  const config = FUNNEL_CONFIG[funnelId];
  if (!config) return 2000;

  const { min, avg, max } = config.estimatedValue;
  if (score >= 80) return max;
  if (score >= 60) return avg;
  if (score >= 40) return (min + avg) / 2;
  return min;
}

function getPreferredContact(phone?: string): string {
  return phone ? "PHONE" : "EMAIL";
}

function formatLeadNotes(submission: LeadSubmission, funnelName: string): string {
  const lines: string[] = [
    `# Lead Details`,
    ``,
    `## Scoring`,
    `- **Score:** ${submission.scoring.totalScore}/100`,
    `- **Klassifizierung:** ${submission.scoring.classification.toUpperCase()}`,
    `- **Tags:** ${submission.scoring.tags.join(", ") || "keine"}`,
    ``,
    `## Funnel-Daten`,
    `- **Funnel:** ${funnelName}`,
    `- **Quelle:** ${submission.meta.source}`,
    `- **Erstellt:** ${submission.meta.createdAt}`,
    ``,
    `## Antworten`,
  ];

  for (const [key, value] of Object.entries(submission.data)) {
    if (["name", "email", "phone", "plz", "address"].includes(key)) continue;
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());
    const formattedValue = Array.isArray(value) ? value.join(", ") : String(value);
    lines.push(`- **${formattedKey}:** ${formattedValue}`);
  }

  lines.push(
    ``,
    `## Kontakt`,
    `- **Name:** ${submission.contact.name}`,
    `- **E-Mail:** ${submission.contact.email}`,
    `- **Telefon:** ${submission.contact.phone}`,
  );

  if (submission.contact.plz) {
    lines.push(`- **PLZ:** ${submission.contact.plz}`);
  }
  if (submission.contact.address) {
    lines.push(`- **Adresse:** ${submission.contact.address}`);
  }

  lines.push(
    ``,
    `## Meta`,
    `- **DSGVO-Einwilligung:** ${submission.meta.gdprConsent ? "Ja" : "Nein"}`,
  );

  if (submission.meta.referrer) {
    lines.push(`- **Referrer:** ${submission.meta.referrer}`);
  }

  return lines.join("\n");
}

function getClassificationEmoji(classification: string): string {
  const emojis: Record<string, string> = {
    hot: "🔥",
    warm: "🌡️",
    potential: "📊",
    nurture: "🌱",
  };
  return emojis[classification] || "📋";
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export interface ProcessLeadResult {
  success: boolean;
  personId?: string;
  opportunityId?: string;
  errors: string[];
}

/**
 * Process a lead submission directly (no workflow library)
 */
export async function processLeadDirect(submission: LeadSubmission): Promise<ProcessLeadResult> {
  const errors: string[] = [];
  const funnelConfig = FUNNEL_CONFIG[submission.funnelId];
  const funnelName = funnelConfig?.name || submission.funnelId;

  let person: TwentyPerson | null = null;
  let opportunity: TwentyOpportunity | null = null;

  // Step 1: Create Person in CRM
  try {
    person = await createPersonInCRM(submission);
    console.log(`✅ Person created: ${person.id}`);
  } catch (error) {
    const msg = `Failed to create person: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // Step 2: Create Opportunity
  if (person) {
    try {
      opportunity = await createOpportunityInCRM(submission, person, funnelName);
      console.log(`✅ Opportunity created: ${opportunity.id}`);
    } catch (error) {
      const msg = `Failed to create opportunity: ${error}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // Step 3: Create Note linked to Opportunity
  if (opportunity && !opportunity.id.startsWith("local_")) {
    try {
      await createNoteInCRM(submission, opportunity.id, funnelName);
      console.log(`✅ Note created and linked`);
    } catch (error) {
      const msg = `Failed to create note: ${error}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // Step 4: Create Task for owner
  if (opportunity && !opportunity.id.startsWith("local_")) {
    try {
      await createTaskInCRM(submission, opportunity.id, funnelName);
      console.log(`✅ Task created`);
    } catch (error) {
      const msg = `Failed to create task: ${error}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  // Step 5: Send customer confirmation email
  try {
    await sendCustomerConfirmationEmail(submission, funnelName);
    console.log(`✅ Customer email sent`);
  } catch (error) {
    const msg = `Failed to send customer email: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // Step 6: Send owner notification
  try {
    const opportunityLink = opportunity
      ? `${CRM_BASE_URL}/object/opportunity/${opportunity.id}`
      : CRM_BASE_URL;
    await notifyOwner(submission, funnelName, opportunityLink);
    console.log(`✅ Owner notification sent`);
  } catch (error) {
    const msg = `Failed to send owner notification: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  return {
    success: errors.length === 0,
    personId: person?.id,
    opportunityId: opportunity?.id,
    errors,
  };
}

// =============================================================================
// CRM FUNCTIONS
// =============================================================================

async function createPersonInCRM(submission: LeadSubmission): Promise<TwentyPerson> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log("Twenty CRM not configured, using local ID");
    const { firstName, lastName } = parseName(submission.contact.name);
    return {
      id: `local_${Date.now()}`,
      name: { firstName, lastName },
      emails: { primaryEmail: submission.contact.email },
    };
  }

  const { firstName, lastName } = parseName(submission.contact.name);

  const personData = {
    name: { firstName, lastName },
    emails: { primaryEmail: submission.contact.email },
    phones: { primaryPhoneNumber: submission.contact.phone },
    city: submission.contact.plz || "",
  };

  console.log(`Creating person at ${apiUrl}/people`);

  const response = await fetch(`${apiUrl}/people`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(personData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CRM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.data || data;
}

async function createOpportunityInCRM(
  submission: LeadSubmission,
  person: TwentyPerson,
  funnelName: string
): Promise<TwentyOpportunity> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    return {
      id: `local_opp_${Date.now()}`,
      name: `${funnelName} - ${person.name.lastName || person.name.firstName}`,
      stage: "NEW",
    };
  }

  const { classification, totalScore } = submission.scoring;

  const opportunityData = {
    name: `${funnelName} - ${person.name.lastName || person.name.firstName}`,
    stage: CLASSIFICATION_STAGE[classification] || "NEW",
    pointOfContactId: person.id,
    amount: {
      amountMicros: getEstimatedAmount(submission.funnelId, totalScore) * 1000000,
      currencyCode: "EUR",
    },
    probability: CLASSIFICATION_PROBABILITY[classification] || 20,
    closeDate: getExpectedCloseDate(classification),
  };

  console.log(`Creating opportunity at ${apiUrl}/opportunities`);

  const response = await fetch(`${apiUrl}/opportunities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opportunityData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CRM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.data || data;
}

async function createNoteInCRM(
  submission: LeadSubmission,
  opportunityId: string,
  funnelName: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) return;

  const noteContent = formatLeadNotes(submission, funnelName);
  const emoji = getClassificationEmoji(submission.scoring.classification);

  const noteData = {
    title: `${emoji} Funnel-Daten: ${funnelName}`,
    body: noteContent,
  };

  const response = await fetch(`${apiUrl}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Note creation failed: ${errorText}`);
  }

  const noteResult = await response.json();
  const note = noteResult.data || noteResult;

  // Link note to opportunity
  await fetch(`${apiUrl}/noteTargets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      noteId: note.id,
      opportunityId: opportunityId,
    }),
  });
}

async function createTaskInCRM(
  submission: LeadSubmission,
  opportunityId: string,
  funnelName: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) return;

  const { classification, totalScore } = submission.scoring;
  const { firstName, lastName } = parseName(submission.contact.name);
  const customerName = lastName ? `${firstName} ${lastName}` : firstName;
  const emoji = getClassificationEmoji(classification);

  const taskData = {
    title: `${emoji} Rückruf: ${customerName} - ${funnelName}`,
    status: "TODO",
    dueAt: getTaskDueDate(classification),
  };

  const response = await fetch(`${apiUrl}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Task creation failed: ${errorText}`);
  }

  const taskResult = await response.json();
  const task = taskResult.data || taskResult;

  // Link task to opportunity
  await fetch(`${apiUrl}/taskTargets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskId: task.id,
      opportunityId: opportunityId,
    }),
  });
}

// =============================================================================
// EMAIL FUNCTIONS
// =============================================================================

async function sendCustomerConfirmationEmail(
  submission: LeadSubmission,
  funnelName: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping customer email");
    return;
  }

  const { firstName } = parseName(submission.contact.name);
  const sender = getEmailSender();

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

  const response = await fetch("https://api.resend.com/emails", {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email send failed: ${errorText}`);
  }
}

async function notifyOwner(
  submission: LeadSubmission,
  funnelName: string,
  opportunityLink: string
): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log("Resend not configured, skipping owner notification");
    return;
  }

  const { html, subject } = await renderOwnerNotification(
    {
      firstName: submission.contact.name,
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
    opportunityLink
  );

  const response = await fetch("https://api.resend.com/emails", {
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Owner notification failed: ${errorText}`);
  }
}
