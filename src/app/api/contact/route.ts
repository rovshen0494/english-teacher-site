import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  organisation?: string;
  interest?: string;
  message?: string;
}

export async function POST(request: Request) {
  const body: ContactPayload = await request.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Placeholder handler: this environment has no email service configured yet.
  // Connect a provider (e.g. Resend, SendGrid, SMTP) here before going live.
  console.log("New contact form submission:", body);

  return NextResponse.json({ success: true });
}
