import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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
  const project = clean(body.project, 120);
  const details = clean(body.details, 5000);

  if (!name || !EMAIL_PATTERN.test(email) || !details) {
    return NextResponse.json({ error: "Please enter your name, a valid email address and a short description of the problem." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Syed Software <onboarding@resend.dev>";

  if (!apiKey || !toEmail) {
    console.error("Quote form is missing RESEND_API_KEY or QUOTE_TO_EMAIL.");
    return NextResponse.json({ error: "The quote form is temporarily unavailable. Please try again shortly." }, { status: 500 });
  }

  const text = [
    "New enquiry from the Syed Software website",
    "",
    `Name: ${name}`,
    `Business: ${business || "Not provided"}`,
    `Email: ${email}`,
    `Project: ${project || "Not specified"}`,
    "",
    "What they want to improve:",
    details,
  ].join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `New website enquiry from ${name}`,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    console.error("Resend quote delivery failed:", resendResponse.status, resendError);
    return NextResponse.json({ error: "We couldn’t send your enquiry. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
