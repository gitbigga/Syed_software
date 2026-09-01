import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "yahoo.com",
  "proton.me",
  "protonmail.com",
]);

const AIRTABLE_DEFAULTS = {
  baseId: "appH4B2WvCghTcroe",
  companiesTable: "tblNKmd9wIhv9oHEs",
  contactsTable: "tbliocRbhLARfbBG1",
  outreachTable: "tblpEhdVAp84YPwOC",
};

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function formulaString(value: string) {
  return JSON.stringify(value);
}

function getBusinessDomain(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return domain && !FREE_EMAIL_DOMAINS.has(domain) ? domain : "";
}

async function airtableRequest<T>(
  path: string,
  init: RequestInit,
  pat: string,
  baseId: string,
): Promise<T> {
  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

async function findRecord(
  tableId: string,
  formula: string,
  pat: string,
  baseId: string,
): Promise<AirtableRecord | null> {
  const params = new URLSearchParams({
    maxRecords: "1",
    filterByFormula: formula,
  });

  const result = await airtableRequest<{ records: AirtableRecord[] }>(
    `${tableId}?${params.toString()}`,
    { method: "GET" },
    pat,
    baseId,
  );

  return result.records[0] || null;
}

async function createRecord(
  tableId: string,
  fields: Record<string, unknown>,
  pat: string,
  baseId: string,
): Promise<AirtableRecord> {
  return airtableRequest<AirtableRecord>(
    `${tableId}?typecast=true`,
    {
      method: "POST",
      body: JSON.stringify({ fields }),
    },
    pat,
    baseId,
  );
}

async function updateRecord(
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>,
  pat: string,
  baseId: string,
): Promise<AirtableRecord> {
  return airtableRequest<AirtableRecord>(
    `${tableId}/${recordId}?typecast=true`,
    {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    },
    pat,
    baseId,
  );
}

async function syncInboundLead(input: {
  name: string;
  business: string;
  email: string;
  phone: string;
  details: string;
  sourceUrl: string;
}) {
  const pat = process.env.AIRTABLE_PAT;
  if (!pat) throw new Error("AIRTABLE_PAT is not configured.");

  const baseId = process.env.AIRTABLE_BASE_ID || AIRTABLE_DEFAULTS.baseId;
  const companiesTable = process.env.AIRTABLE_COMPANIES_TABLE_ID || AIRTABLE_DEFAULTS.companiesTable;
  const contactsTable = process.env.AIRTABLE_CONTACTS_TABLE_ID || AIRTABLE_DEFAULTS.contactsTable;
  const outreachTable = process.env.AIRTABLE_OUTREACH_TABLE_ID || AIRTABLE_DEFAULTS.outreachTable;

  const now = new Date().toISOString();
  const domain = getBusinessDomain(input.email);

  const contactByEmail = await findRecord(
    contactsTable,
    `LOWER({Email})=LOWER(${formulaString(input.email)})`,
    pat,
    baseId,
  );

  const linkedCompanies = Array.isArray(contactByEmail?.fields.Company)
    ? (contactByEmail?.fields.Company as string[])
    : [];

  let company: AirtableRecord | null = null;

  if (linkedCompanies[0]) {
    const result = await airtableRequest<AirtableRecord>(
      `${companiesTable}/${linkedCompanies[0]}`,
      { method: "GET" },
      pat,
      baseId,
    );
    company = result;
  }

  if (!company) {
    const companyChecks = [
      `LOWER({Company Name})=LOWER(${formulaString(input.business)})`,
      `LOWER({General Email})=LOWER(${formulaString(input.email)})`,
    ];
    if (domain) companyChecks.push(`LOWER({Domain})=LOWER(${formulaString(domain)})`);

    company = await findRecord(
      companiesTable,
      `OR(${companyChecks.join(",")})`,
      pat,
      baseId,
    );
  }

  const companyFields: Record<string, unknown> = {
    "Company Name": input.business,
    Status: "Interested",
    "Lead Source": "Inbound",
    "Outbound Paused": true,
    "Next Action At": null,
    "Last Contacted": now,
  };

  if (!company?.fields?.["General Email"]) companyFields["General Email"] = input.email;
  if (input.phone && !company?.fields?.Phone) companyFields.Phone = input.phone;
  if (domain && !company?.fields?.Domain) companyFields.Domain = domain;

  if (company) {
    company = await updateRecord(companiesTable, company.id, companyFields, pat, baseId);
  } else {
    company = await createRecord(
      companiesTable,
      {
        ...companyFields,
        "First Seen": now,
        "Source URLs": input.sourceUrl,
      },
      pat,
      baseId,
    );
  }

  let contact = contactByEmail;

  const contactFields: Record<string, unknown> = {
    Name: input.name,
    Email: input.email,
    Company: [company.id],
    "Last Verified": now,
  };
  if (input.phone) contactFields.Phone = input.phone;

  if (contact) {
    contact = await updateRecord(contactsTable, contact.id, contactFields, pat, baseId);
  } else {
    contact = await createRecord(
      contactsTable,
      {
        "Contact Key": `inbound:${input.email.toLowerCase()}`,
        ...contactFields,
      },
      pat,
      baseId,
    );
  }

  await createRecord(
    outreachTable,
    {
      "Outreach Key": `inbound:web:${randomUUID()}`,
      "Attempt Number": 0,
      Channel: "Other",
      Direction: "Inbound",
      "Occurred At": now,
      Outcome: "Interested",
      Subject: "Website workflow enquiry",
      "Message Or Notes": [
        `Website enquiry from ${input.name} at ${input.business}`,
        `Email: ${input.email}`,
        input.phone ? `Phone: ${input.phone}` : "Phone: not provided",
        "",
        "Workflow / bottleneck:",
        input.details,
      ].join("\n"),
      "Next Action": "Reply to inbound website enquiry",
      Actor: "Prospect",
      Company: [company.id],
      Contact: [contact.id],
    },
    pat,
    baseId,
  );

  return { companyId: company.id, contactId: contact.id };
}

async function sendInternalNotification(input: {
  name: string;
  business: string;
  email: string;
  phone: string;
  details: string;
  crmSynced: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Leverage Systems <onboarding@resend.dev>";

  if (!apiKey || !toEmail) throw new Error("Resend notification variables are not configured.");

  const text = [
    "New workflow enquiry — Leverage Systems",
    "",
    `Name: ${input.name}`,
    `Business: ${input.business}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `CRM sync: ${input.crmSynced ? "INBOUND lead saved and outbound paused" : "FAILED — check Airtable"}`,
    "",
    "What takes too much time:",
    input.details,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: input.email,
      subject: `Leverage Systems enquiry — ${input.business}`,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend ${response.status}: ${errorText}`);
  }

  return fromEmail;
}

async function sendVisitorConfirmation(
  to: string,
  name: string,
  business: string,
  fromEmail: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: "We received your workflow — Leverage Systems",
      text: [
        `Hi ${name},`,
        "",
        `Thanks for sending through the workflow at ${business}.`,
        "We’ll review the bottleneck you described and get back to you with the clearest practical next step.",
        "",
        "Leverage Systems",
        "Australia",
        "https://leveragesystems.tech",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("Visitor confirmation email failed:", response.status, await response.text());
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const business = clean(body.business, 160);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const details = clean(body.details, 5000);
  const website = clean(body.website, 300);

  // Honeypot: return success to bots without creating CRM or email noise.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !business || !EMAIL_PATTERN.test(email) || !details) {
    return NextResponse.json(
      { error: "Please enter your name, business, a valid email address and a short description of the workflow." },
      { status: 400 },
    );
  }

  const sourceUrl = request.headers.get("origin") || "https://leveragesystems.tech";

  let crmSynced = false;
  let crmError: unknown = null;

  try {
    await syncInboundLead({ name, business, email, phone, details, sourceUrl });
    crmSynced = true;
  } catch (error) {
    crmError = error;
    console.error("Inbound Airtable sync failed:", error);
  }

  let emailSent = false;
  let fromEmail = process.env.RESEND_FROM_EMAIL || "Leverage Systems <onboarding@resend.dev>";

  try {
    fromEmail = await sendInternalNotification({ name, business, email, phone, details, crmSynced });
    emailSent = true;
  } catch (error) {
    console.error("Internal Resend notification failed:", error);
  }

  if (emailSent) {
    void sendVisitorConfirmation(email, name, business, fromEmail);
  }

  if (!crmSynced && !emailSent) {
    console.error("Lead capture failed in both channels:", crmError);
    return NextResponse.json(
      { error: "We couldn’t submit your workflow right now. Please email hello@leveragesystems.tech instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
