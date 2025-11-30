import { sleep } from "workflow";
import {
  renderLeadConfirmation,
  renderFollowUp1,
  renderFollowUp2,
  renderFollowUp3,
  renderOwnerNotification,
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

interface LeadSubmission {
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

interface TwentyTask {
  id: string;
  title: string;
  status: string;
}

interface TwentyNote {
  id: string;
  title: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const TWENTY_API_URL = process.env.TWENTY_CRM_API_URL || "";
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const OWNER_EMAIL = process.env.NOTIFICATION_EMAIL || "thomas@fabig.website";
const CRM_BASE_URL = process.env.TWENTY_CRM_BASE_URL || "https://crm.fabig-suite.de";

// Customer-facing email sender (configurable per demo)
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Kundenservice";
const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || "info@fabig.website";
const EMAIL_FROM = `${EMAIL_FROM_NAME} <${EMAIL_FROM_ADDRESS}>`;

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

// Classification to probability mapping
const CLASSIFICATION_PROBABILITY: Record<string, number> = {
  hot: 70,
  warm: 40,
  potential: 20,
  nurture: 10,
};

// Classification to CRM stage mapping (matches Twenty CRM German setup)
const CLASSIFICATION_STAGE: Record<string, string> = {
  hot: "SCREENING",      // In Bearbeitung
  warm: "NEW",           // Neue Anfrage
  potential: "NEW",      // Neue Anfrage
  nurture: "NEW",        // Neue Anfrage
};

// Classification to urgency mapping (custom field)
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
    case "hot": return addDays(today, 14);      // 2 weeks
    case "warm": return addDays(today, 30);     // 1 month
    case "potential": return addDays(today, 60); // 2 months
    default: return addDays(today, 90);          // 3 months
  }
}

function getTaskDueDate(classification: string): string {
  const now = new Date();
  switch (classification) {
    case "hot": return addDays(now, 0);   // Same day
    case "warm": return addDays(now, 1);  // Next day
    case "potential": return addDays(now, 3); // Within 3 days
    default: return addDays(now, 7);      // Within a week
  }
}

function getEstimatedAmount(funnelId: string, score: number): number {
  const config = FUNNEL_CONFIG[funnelId];
  if (!config) return 2000; // Default fallback

  const { min, avg, max } = config.estimatedValue;
  // Higher score = higher estimated value
  if (score >= 80) return max;
  if (score >= 60) return avg;
  if (score >= 40) return (min + avg) / 2;
  return min;
}

function getPreferredContact(phone?: string): string {
  // If phone provided, assume they prefer phone contact
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
// MAIN WORKFLOW
// =============================================================================

/**
 * Enterprise Lead Processing Workflow
 *
 * Complete automation for local business lead management:
 * 1. Create Person in CRM with all contact data + custom fields
 * 2. Create Opportunity with scoring, estimates, and timeline
 * 3. Create Note with full funnel details linked to Opportunity
 * 4. Create Task for owner with priority-based due date
 * 5. Send customer confirmation email
 * 6. Send owner notification with CRM deep link
 * 7. Automated follow-up sequence (Day 1, 4, 7)
 */
export async function processLead(submission: LeadSubmission) {
  "use workflow";

  const funnelConfig = FUNNEL_CONFIG[submission.funnelId];
  const funnelName = funnelConfig?.name || submission.funnelId;
  const { classification, totalScore } = submission.scoring;

  // Track CRM results (may fail, but emails should still be sent)
  let person: TwentyPerson | null = null;
  let opportunity: TwentyOpportunity | null = null;
  let crmSuccess = false;

  // ========================================
  // PHASE 1: CRM Operations (can fail gracefully)
  // ========================================
  try {
    // Step 1: Create Person in CRM
    person = await createPersonInCRM(submission);
    console.log(`✅ Person created: ${person.id}`);

    // Step 2: Create Opportunity with full data
    opportunity = await createOpportunityInCRM(submission, person, funnelName);
    console.log(`✅ Opportunity created: ${opportunity.id}`);

    // Step 3: Create Note linked to Opportunity
    await createNoteInCRM(submission, opportunity.id, funnelName);

    // Step 4: Create Task for owner
    await createTaskInCRM(submission, opportunity.id, funnelName);

    crmSuccess = true;
    console.log(`✅ CRM operations completed successfully`);
  } catch (crmError) {
    console.error(`❌ CRM operations failed:`, crmError);
    console.error(`Continuing with email notifications...`);
    // Create fallback person for email purposes
    if (!person) {
      const { firstName, lastName } = parseName(submission.contact.name);
      person = {
        id: `local_${Date.now()}`,
        name: { firstName, lastName },
        emails: { primaryEmail: submission.contact.email },
      };
    }
    if (!opportunity) {
      opportunity = {
        id: `local_opp_${Date.now()}`,
        name: `${funnelName} - ${submission.contact.name}`,
        stage: "NEW",
      };
    }
  }

  // ========================================
  // PHASE 2: Email Notifications (must succeed)
  // ========================================

  // Step 5: Send customer confirmation email (ALWAYS)
  await sendCustomerConfirmationEmail(submission, funnelName);

  // Step 6: Send owner notification with CRM link (if available)
  const opportunityLink = crmSuccess && opportunity
    ? `${CRM_BASE_URL}/object/opportunity/${opportunity.id}`
    : undefined;
  await notifyOwner(submission, funnelName, opportunityLink);

  // ========================================
  // PHASE 3: Follow-up Sequence
  // ========================================
  await sleep("24h");
  await sendFollowUp1(submission, funnelName, person, opportunity);

  await sleep("3d");
  await sendFollowUp2(submission, funnelName, person, opportunity);

  await sleep("3d");
  await sendFollowUp3(submission, funnelName, person, opportunity);

  return {
    success: true,
    crmSuccess,
    personId: person?.id,
    opportunityId: opportunity?.id,
    classification,
    score: totalScore,
  };
}

// =============================================================================
// CRM STEPS
// =============================================================================

/**
 * Create Person in Twenty CRM
 *
 * Includes:
 * - Full contact details (name, email, phone, city/PLZ)
 * - GDPR consent flag
 * - Preferred contact method
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

  const personData = {
    name: { firstName, lastName },
    emails: { primaryEmail: submission.contact.email },
    phones: { primaryPhoneNumber: submission.contact.phone },
    city: submission.contact.plz || "",
    // Custom fields
    gdprConsent: submission.meta.gdprConsent,
    preferredContact: getPreferredContact(submission.contact.phone),
  };

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
    console.error(`Failed to create person: ${errorText}`);
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
 * Create Opportunity in Twenty CRM
 *
 * Includes:
 * - Link to Person (pointOfContactId)
 * - Lead score and classification
 * - Funnel source
 * - Estimated value (based on service type + score)
 * - Expected close date
 * - Probability (based on classification)
 * - Urgency level
 * - Initial stage (based on classification)
 */
async function createOpportunityInCRM(
  submission: LeadSubmission,
  person: TwentyPerson,
  funnelName: string
): Promise<TwentyOpportunity> {
  "use step";

  // Safely get person name - handle different response structures
  const personName = person?.name?.lastName || person?.name?.firstName || submission.contact.name.split(" ").pop() || "Unbekannt";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) {
    console.log("Twenty CRM not configured, skipping opportunity creation");
    return {
      id: `local_opp_${Date.now()}`,
      name: `${funnelName} - ${personName}`,
      stage: "NEW",
    };
  }

  const { classification, totalScore } = submission.scoring;
  const funnelConfig = FUNNEL_CONFIG[submission.funnelId];

  // Twenty CRM REST API expects simple number for amount, NOT nested object
  const estimatedAmount = getEstimatedAmount(submission.funnelId, totalScore);

  const opportunityData = {
    // Basic info
    name: `${funnelName} - ${personName}`,
    stage: CLASSIFICATION_STAGE[classification] || "NEW",
    pointOfContactId: person.id,

    // Financial - Simple number format for REST API
    amount: estimatedAmount,
    probability: CLASSIFICATION_PROBABILITY[classification] || 20,
    closeDate: getExpectedCloseDate(classification),
  };

  console.log(`Creating opportunity with data:`, JSON.stringify(opportunityData, null, 2));

  const response = await fetch(`${apiUrl}/opportunities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opportunityData),
  });

  const responseText = await response.text();
  console.log(`Opportunity API response (${response.status}):`, responseText);

  if (!response.ok) {
    console.error(`❌ Failed to create opportunity: Status ${response.status}`);
    console.error(`Response: ${responseText}`);
    // Throw error so workflow knows CRM failed - emails will still be sent separately
    throw new Error(`Opportunity creation failed (${response.status}): ${responseText.slice(0, 200)}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON response from CRM: ${responseText.slice(0, 200)}`);
  }

  const opportunity = data.data || data;
  console.log(`✅ Opportunity created: ${opportunity.id}`);
  return opportunity;
}

/**
 * Create Note in Twenty CRM linked to Opportunity
 *
 * Contains full funnel data in markdown format
 */
async function createNoteInCRM(
  submission: LeadSubmission,
  opportunityId: string,
  funnelName: string
): Promise<TwentyNote | null> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY || opportunityId.startsWith("local_")) {
    console.log("Twenty CRM not configured or local opportunity, skipping note creation");
    return null;
  }

  const noteContent = formatLeadNotes(submission, funnelName);
  const emoji = getClassificationEmoji(submission.scoring.classification);

  const noteData = {
    title: `${emoji} Funnel-Daten: ${funnelName}`,
    bodyV2: {
      markdown: noteContent,
      blocknote: null,
    },
    // Link to opportunity via noteTargets
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
    console.error(`Failed to create note: ${errorText}`);
    return null;
  }

  const noteResult = await response.json();
  const note = noteResult.data || noteResult;

  // Link note to opportunity via noteTarget
  try {
    const linkResponse = await fetch(`${apiUrl}/noteTargets`, {
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

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text();
      console.error(`Failed to link note to opportunity: ${errorText}`);
      // Don't throw - note was created, linking is secondary
    } else {
      console.log(`✅ Note linked to opportunity ${opportunityId}`);
    }
  } catch (error) {
    console.error(`Error linking note to opportunity:`, error);
  }

  return note;
}

/**
 * Create Task in Twenty CRM for owner follow-up
 *
 * Priority and due date based on lead classification:
 * - HOT: Same day callback
 * - WARM: Next business day
 * - POTENTIAL: Within 3 days
 * - NURTURE: Within a week
 */
async function createTaskInCRM(
  submission: LeadSubmission,
  opportunityId: string,
  funnelName: string
): Promise<TwentyTask | null> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY || opportunityId.startsWith("local_")) {
    console.log("Twenty CRM not configured or local opportunity, skipping task creation");
    return null;
  }

  const { classification, totalScore } = submission.scoring;
  const { firstName, lastName } = parseName(submission.contact.name);
  const customerName = lastName ? `${firstName} ${lastName}` : firstName;
  const emoji = getClassificationEmoji(classification);

  const taskData = {
    title: `${emoji} Rückruf: ${customerName} - ${funnelName}`,
    status: "TODO",
    dueAt: getTaskDueDate(classification),
    bodyV2: {
      markdown: [
        `## Lead-Details`,
        `- **Name:** ${customerName}`,
        `- **Telefon:** ${submission.contact.phone}`,
        `- **E-Mail:** ${submission.contact.email}`,
        `- **Score:** ${totalScore}/100 (${classification.toUpperCase()})`,
        ``,
        `## Aktion`,
        classification === "hot"
          ? "🔥 **SOFORT anrufen!** Heißer Lead mit hohem Interesse."
          : classification === "warm"
          ? "📞 Innerhalb von 24h anrufen. Gutes Interesse vorhanden."
          : "📋 Lead kontaktieren und Interesse qualifizieren.",
      ].join("\n"),
      blocknote: null,
    },
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
    console.error(`Failed to create task: ${errorText}`);
    return null;
  }

  const taskResult = await response.json();
  const task = taskResult.data || taskResult;

  // Link task to opportunity via taskTarget
  try {
    const linkResponse = await fetch(`${apiUrl}/taskTargets`, {
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

    if (!linkResponse.ok) {
      const errorText = await linkResponse.text();
      console.error(`Failed to link task to opportunity: ${errorText}`);
      // Don't throw - task was created, linking is secondary
    } else {
      console.log(`✅ Task linked to opportunity ${opportunityId}`);
    }
  } catch (error) {
    console.error(`Error linking task to opportunity:`, error);
  }

  return task;
}

// =============================================================================
// EMAIL STEPS
// =============================================================================

/**
 * Send confirmation email to customer
 *
 * IMPORTANT: Uses verified fabig.website domain, not brandConfig
 * brandConfig email domain may not be verified in Resend
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

  // Use verified fabig.website domain - brandConfig domain may not be verified!
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: submission.contact.email,
      reply_to: EMAIL_FROM_ADDRESS,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send customer confirmation email: ${response.status} - ${errorText}`);
    throw new Error(`Email send failed: ${response.status}`);
  }

  console.log(`✅ Customer confirmation email sent to ${submission.contact.email} from ${EMAIL_FROM}`);
}

/**
 * Send notification email to owner with CRM deep link
 */
async function notifyOwner(
  submission: LeadSubmission,
  funnelName: string,
  opportunityLink?: string
): Promise<void> {
  "use step";

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
    console.error(`Failed to send owner notification: ${response.status} - ${errorText}`);
    throw new Error(`Owner notification failed: ${response.status}`);
  }

  console.log(`✅ Owner notification sent to ${OWNER_EMAIL}`);
}

// =============================================================================
// FOLLOW-UP STEPS
// =============================================================================

/**
 * Check if lead has already been contacted
 * Checks CRM opportunity stage - if moved past NEW, skip follow-up
 */
async function checkIfAlreadyContacted(opportunityId: string): Promise<boolean> {
  "use step";

  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY || opportunityId.startsWith("local_")) {
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/opportunities/${opportunityId}`, {
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
      },
    });

    if (!response.ok) return false;

    const data = await response.json();
    const opportunity = data.data || data;

    // If stage is past NEW/SCREENING, lead has been contacted
    const contactedStages = ["MEETING", "PROPOSAL", "CUSTOMER"];
    return contactedStages.includes(opportunity.stage);
  } catch {
    return false;
  }
}

/**
 * Send Follow-Up Email #1 (Day 1)
 */
async function sendFollowUp1(
  submission: LeadSubmission,
  funnelName: string,
  person: TwentyPerson,
  opportunity: TwentyOpportunity
): Promise<void> {
  "use step";

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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: submission.contact.email,
      reply_to: EMAIL_FROM_ADDRESS,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send follow-up 1: ${response.status} - ${errorText}`);
  } else {
    console.log(`✅ Follow-up 1 sent to ${submission.contact.email}`);
  }
}

/**
 * Send Follow-Up Email #2 (Day 4)
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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: submission.contact.email,
      reply_to: EMAIL_FROM_ADDRESS,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send follow-up 2: ${response.status} - ${errorText}`);
  } else {
    console.log(`✅ Follow-up 2 sent to ${submission.contact.email}`);
  }
}

/**
 * Send Follow-Up Email #3 (Day 7 - Final)
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

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: submission.contact.email,
      reply_to: EMAIL_FROM_ADDRESS,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to send follow-up 3: ${response.status} - ${errorText}`);
  } else {
    console.log(`✅ Follow-up 3 (final) sent to ${submission.contact.email}`);
  }
}
