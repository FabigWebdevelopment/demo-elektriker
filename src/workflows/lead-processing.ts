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
// Default workspace member ID for task assignment
const DEFAULT_ASSIGNEE_ID = process.env.TWENTY_DEFAULT_ASSIGNEE_ID || "dc88ebed-29dc-4904-a745-37cd360af91b";

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

// Classification to CRM stage mapping (matches German CRM setup from OpenAPI)
// Valid stages: NEUE_ANFRAGE, IN_BEARBEITUNG, TERMIN_VEREINBART, ANGEBOT_GESENDET, KUNDE_GEWONNEN
const CLASSIFICATION_STAGE: Record<string, string> = {
  hot: "NEUE_ANFRAGE",       // Hot leads start as new, urgency field handles priority
  warm: "NEUE_ANFRAGE",      // Neue Anfrage
  potential: "NEUE_ANFRAGE", // Neue Anfrage
  nurture: "NEUE_ANFRAGE",   // Neue Anfrage
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

/**
 * Parse German phone number into Twenty CRM phone format
 * Twenty CRM requires: primaryPhoneNumber, primaryPhoneCallingCode, primaryPhoneCountryCode
 *
 * Examples:
 * - "015735387471" → { number: "15735387471", callingCode: "+49", countryCode: "DE" }
 * - "0157 3538 7471" → { number: "15735387471", callingCode: "+49", countryCode: "DE" }
 * - "+49 157 3538 7471" → { number: "15735387471", callingCode: "+49", countryCode: "DE" }
 */
function parseGermanPhone(phone: string): {
  primaryPhoneNumber: string;
  primaryPhoneCallingCode: string;
  primaryPhoneCountryCode: string;
} {
  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, "");

  let nationalNumber = "";

  // Already has country code with +49
  if (cleaned.startsWith("+49")) {
    nationalNumber = cleaned.slice(3);
  }
  // Already has country code without +
  else if (cleaned.startsWith("49") && cleaned.length > 10) {
    nationalNumber = cleaned.slice(2);
  }
  // German format starting with 0
  else if (cleaned.startsWith("0")) {
    nationalNumber = cleaned.slice(1);
  }
  // Just digits without country code (assume German)
  else if (/^\d{8,15}$/.test(cleaned)) {
    nationalNumber = cleaned;
  }
  // Fallback - use as-is
  else {
    nationalNumber = cleaned.replace(/\D/g, "");
  }

  return {
    primaryPhoneNumber: nationalNumber,
    primaryPhoneCallingCode: "+49",
    primaryPhoneCountryCode: "DE",
  };
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

    // Step 4: Create Task for owner (linked to opportunity AND person)
    await createTaskInCRM(submission, opportunity.id, funnelName, person.id);

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

  // Get opportunity ID for email tracking (may be local fallback)
  const oppIdForTracking = opportunity?.id && !opportunity.id.startsWith("local_")
    ? opportunity.id
    : undefined;

  // Step 5: Send customer confirmation email (ALWAYS)
  await sendCustomerConfirmationEmail(submission, funnelName, oppIdForTracking);

  // Step 6: Send owner notification with CRM link (if available)
  const opportunityLink = crmSuccess && opportunity
    ? `${CRM_BASE_URL}/object/opportunity/${opportunity.id}`
    : undefined;
  await notifyOwner(submission, funnelName, opportunityLink, oppIdForTracking);

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
 * Find or Create Person in Twenty CRM
 *
 * First searches for existing person by email. If found, returns that person.
 * If not found, creates a new person with all contact details.
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
  const email = submission.contact.email;

  // First, search for existing person by email
  console.log(`Searching for existing person with email: ${email}`);
  const searchUrl = `${apiUrl}/people?filter=emails.primaryEmail[eq]:"${encodeURIComponent(email)}"`;

  try {
    const searchResponse = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
      },
    });

    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      const existingPeople = searchResult.data?.people || searchResult.data || searchResult.people || [];

      if (Array.isArray(existingPeople) && existingPeople.length > 0) {
        const existingPerson = existingPeople[0];
        console.log(`✅ Found existing person: ${existingPerson.id} (${existingPerson.name?.firstName} ${existingPerson.name?.lastName})`);
        return existingPerson;
      }
    }
  } catch (searchError) {
    console.log(`Search failed, will try to create new person:`, searchError);
  }

  // Person not found - create new one
  console.log(`No existing person found, creating new...`);

  // Parse phone into Twenty CRM format with country code components
  const phoneData = submission.contact.phone
    ? parseGermanPhone(submission.contact.phone)
    : { primaryPhoneNumber: "", primaryPhoneCallingCode: "", primaryPhoneCountryCode: "" };

  const personData = {
    name: { firstName, lastName },
    emails: { primaryEmail: email },
    phones: phoneData,
    city: submission.contact.plz || "",
    // Custom fields
    gdprConsent: submission.meta.gdprConsent,
    preferredContact: getPreferredContact(submission.contact.phone),
  };

  console.log(`Creating person with data:`, JSON.stringify(personData, null, 2));

  const response = await fetch(`${apiUrl}/people`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(personData),
  });

  const responseText = await response.text();
  console.log(`Person API response (${response.status}):`, responseText);

  // Handle duplicate email error gracefully - search again
  if (response.status === 400 && responseText.includes("Duplicate")) {
    console.log(`Duplicate detected, searching for existing person...`);
    try {
      const retrySearch = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${TWENTY_API_KEY}` },
      });
      if (retrySearch.ok) {
        const retryResult = await retrySearch.json();
        const people = retryResult.data?.people || retryResult.data || retryResult.people || [];
        if (Array.isArray(people) && people.length > 0) {
          console.log(`✅ Found existing person on retry: ${people[0].id}`);
          return people[0];
        }
      }
    } catch (e) {
      console.error(`Retry search failed:`, e);
    }
  }

  if (!response.ok) {
    console.error(`❌ Failed to create person: Status ${response.status}`);
    console.error(`Response: ${responseText}`);
    throw new Error(`Person creation failed (${response.status}): ${responseText.slice(0, 200)}`);
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON response from CRM: ${responseText.slice(0, 200)}`);
  }

  const person = data.data || data;
  console.log(`✅ Person created with ID: ${person.id}`);
  return person;
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

  // Calculate estimated amount in micros (€1 = 1,000,000 micros)
  const estimatedAmountEuros = getEstimatedAmount(submission.funnelId, totalScore);
  const estimatedAmountMicros = estimatedAmountEuros * 1_000_000;

  // Map funnel ID to CRM funnelSource enum
  const funnelSourceMap: Record<string, string> = {
    "smart-home-beratung": "SMART_HOME",
    "elektro-anfrage": "ELEKTRO",
    "sicherheit-beratung": "SICHERHEIT",
    "wallbox-anfrage": "WALLBOX",
  };

  // Only include pointOfContactId if person was actually created in CRM (not local fallback)
  const hasRealPerson = person.id && !person.id.startsWith("local_");

  const opportunityData: Record<string, unknown> = {
    // Basic info
    name: `${funnelName} - ${personName}`,
    stage: CLASSIFICATION_STAGE[classification] || "NEUE_ANFRAGE",
    closeDate: getExpectedCloseDate(classification),

    // Link to person contact (only if real CRM person)
    ...(hasRealPerson && { pointOfContactId: person.id }),

    // Financial - estimatedValue is the custom field for projected value
    // amount is the standard field (we use estimatedValue for our estimates)
    estimatedValue: {
      amountMicros: estimatedAmountMicros,
      currencyCode: "EUR",
    },

    // Custom fields from German CRM setup
    leadScore: totalScore,
    leadClassification: classification.toUpperCase(), // HOT, WARM, POTENTIAL, NURTURE
    funnelSource: funnelSourceMap[submission.funnelId] || "OTHER",
    urgency: CLASSIFICATION_URGENCY[classification] || "PLANNED",
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
  };

  console.log(`Creating note for opportunity ${opportunityId}...`);

  const response = await fetch(`${apiUrl}/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });

  const responseText = await response.text();
  console.log(`Note API response (${response.status}):`, responseText.slice(0, 500));

  if (!response.ok) {
    console.error(`❌ Failed to create note: Status ${response.status}`);
    throw new Error(`Note creation failed: ${responseText.slice(0, 200)}`);
  }

  let noteResult;
  try {
    noteResult = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON from note API: ${responseText.slice(0, 200)}`);
  }
  const note = noteResult.data || noteResult;
  console.log(`✅ Note created with ID: ${note.id}`);

  // Link note to opportunity via noteTarget
  const noteTargetData = {
    noteId: note.id,
    opportunityId: opportunityId,
  };
  console.log(`Linking note to opportunity:`, JSON.stringify(noteTargetData));

  const linkResponse = await fetch(`${apiUrl}/noteTargets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteTargetData),
  });

  const linkResponseText = await linkResponse.text();
  console.log(`NoteTarget API response (${linkResponse.status}):`, linkResponseText.slice(0, 300));

  if (!linkResponse.ok) {
    console.error(`❌ Failed to link note to opportunity: ${linkResponseText}`);
  } else {
    console.log(`✅ Note ${note.id} linked to opportunity ${opportunityId}`);
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
  funnelName: string,
  personId?: string
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
    // Assign task to default workspace member
    assigneeId: DEFAULT_ASSIGNEE_ID,
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

  console.log(`Creating task for opportunity ${opportunityId} assigned to ${DEFAULT_ASSIGNEE_ID}...`);

  const response = await fetch(`${apiUrl}/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const responseText = await response.text();
  console.log(`Task API response (${response.status}):`, responseText.slice(0, 500));

  if (!response.ok) {
    console.error(`❌ Failed to create task: Status ${response.status}`);
    throw new Error(`Task creation failed: ${responseText.slice(0, 200)}`);
  }

  let taskResult;
  try {
    taskResult = JSON.parse(responseText);
  } catch {
    throw new Error(`Invalid JSON from task API: ${responseText.slice(0, 200)}`);
  }
  const task = taskResult.data || taskResult;
  console.log(`✅ Task created with ID: ${task.id}`);

  // Link task to opportunity via taskTarget
  const taskTargetOppData = {
    taskId: task.id,
    opportunityId: opportunityId,
  };
  console.log(`Linking task to opportunity:`, JSON.stringify(taskTargetOppData));

  const linkOppResponse = await fetch(`${apiUrl}/taskTargets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskTargetOppData),
  });

  const linkOppText = await linkOppResponse.text();
  console.log(`TaskTarget (opportunity) response (${linkOppResponse.status}):`, linkOppText.slice(0, 300));

  if (!linkOppResponse.ok) {
    console.error(`❌ Failed to link task to opportunity: ${linkOppText}`);
  } else {
    console.log(`✅ Task ${task.id} linked to opportunity ${opportunityId}`);
  }

  // Also link task to person if available
  if (personId && !personId.startsWith("local_")) {
    const taskTargetPersonData = {
      taskId: task.id,
      personId: personId,
    };
    console.log(`Linking task to person:`, JSON.stringify(taskTargetPersonData));

    const linkPersonResponse = await fetch(`${apiUrl}/taskTargets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskTargetPersonData),
    });

    const linkPersonText = await linkPersonResponse.text();
    if (linkPersonResponse.ok) {
      console.log(`✅ Task ${task.id} linked to person ${personId}`);
    } else {
      console.error(`Failed to link task to person (${linkPersonResponse.status}):`, linkPersonText.slice(0, 200));
    }
  }

  return task;
}

// =============================================================================
// EMAIL STEPS
// =============================================================================

/**
 * Create a timeline activity in CRM to track sent emails
 * Uses TimelineActivity API which shows directly in the opportunity timeline
 */
async function createEmailTrackingNote(
  opportunityId: string,
  emailType: string,
  recipient: string,
  subject: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY || opportunityId.startsWith("local_")) {
    console.log(`Skipping email tracking - no valid opportunity ID`);
    return;
  }

  const now = new Date().toISOString();

  // Create timeline activity for better visibility
  const activityData = {
    name: `📧 ${emailType}`,
    happensAt: now,
    opportunityId: opportunityId,
    properties: {
      type: "email_sent",
      emailType: emailType,
      recipient: recipient,
      subject: subject,
      sentAt: now,
    },
  };

  console.log(`Creating timeline activity for email: ${emailType}`);

  try {
    const response = await fetch(`${apiUrl}/timelineActivities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    const responseText = await response.text();

    if (response.ok) {
      console.log(`📧 Timeline activity created for: ${emailType}`);
    } else {
      console.error(`Failed to create timeline activity (${response.status}):`, responseText);

      // Fallback to creating a Note if timeline activity fails
      console.log(`Falling back to creating a Note...`);
      await createEmailTrackingNoteAsFallback(opportunityId, emailType, recipient, subject);
    }
  } catch (error) {
    console.error(`Failed to create email tracking:`, error);
  }
}

/**
 * Fallback: Create a Note in CRM if timeline activity fails
 */
async function createEmailTrackingNoteAsFallback(
  opportunityId: string,
  emailType: string,
  recipient: string,
  subject: string
): Promise<void> {
  const apiUrl = getTwentyApiUrl();
  if (!apiUrl || !TWENTY_API_KEY) return;

  const now = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  const noteData = {
    title: `📧 E-Mail: ${emailType}`,
    bodyV2: {
      markdown: [
        `## E-Mail gesendet`,
        `- **Typ:** ${emailType}`,
        `- **An:** ${recipient}`,
        `- **Betreff:** ${subject}`,
        `- **Gesendet:** ${now}`,
      ].join("\n"),
    },
  };

  try {
    const response = await fetch(`${apiUrl}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TWENTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
    });

    if (response.ok) {
      const noteResult = await response.json();
      const note = noteResult.data || noteResult;

      // Link note to opportunity via noteTarget
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

      if (linkResponse.ok) {
        console.log(`📧 Email note created and linked: ${emailType}`);
      } else {
        const linkError = await linkResponse.text();
        console.error(`Failed to link note (${linkResponse.status}):`, linkError);
      }
    } else {
      const errorText = await response.text();
      console.error(`Failed to create note (${response.status}):`, errorText);
    }
  } catch (error) {
    console.error(`Error creating email note:`, error);
  }
}

/**
 * Send confirmation email to customer
 *
 * IMPORTANT: Uses verified fabig.website domain, not brandConfig
 * brandConfig email domain may not be verified in Resend
 */
async function sendCustomerConfirmationEmail(
  submission: LeadSubmission,
  funnelName: string,
  opportunityId?: string
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

  // Track email in CRM
  if (opportunityId) {
    await createEmailTrackingNote(opportunityId, "Bestätigung", submission.contact.email, subject);
  }
}

/**
 * Send notification email to owner with CRM deep link
 */
async function notifyOwner(
  submission: LeadSubmission,
  funnelName: string,
  opportunityLink?: string,
  opportunityId?: string
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

  // Track email in CRM (owner notification)
  if (opportunityId) {
    await createEmailTrackingNote(opportunityId, "Inhaber-Benachrichtigung", OWNER_EMAIL, subject);
  }
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
    // Track email in CRM
    if (opportunity.id && !opportunity.id.startsWith("local_")) {
      await createEmailTrackingNote(opportunity.id, "Follow-up #1 (Tag 1)", submission.contact.email, subject);
    }
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
    // Track email in CRM
    if (opportunity.id && !opportunity.id.startsWith("local_")) {
      await createEmailTrackingNote(opportunity.id, "Follow-up #2 (Tag 4)", submission.contact.email, subject);
    }
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
    // Track email in CRM
    if (opportunity.id && !opportunity.id.startsWith("local_")) {
      await createEmailTrackingNote(opportunity.id, "Follow-up #3 (Tag 7 - Final)", submission.contact.email, subject);
    }
  }
}
