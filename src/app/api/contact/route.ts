import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

interface ContactPayload {
  name?: string;
  email?: string;
  organisation?: string;
  interest?: string;
  message?: string;
}

// Resend's sandbox sender (no verified domain) can only deliver to the email
// address that owns the Resend account. Add bmammet09@gmail.com here once a
// custom domain is verified at resend.com/domains and the `from` address below
// is updated to use it.
const NOTIFY_EMAILS = ["rovshen0494@gmail.com"];

export async function POST(request: Request) {
  const body: ContactPayload = await request.json();

  if (!body.name || !body.email || !body.message || !body.interest) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("contact_submissions").insert({
    name: body.name,
    email: body.email,
    organisation: body.organisation || null,
    interest: body.interest,
    message: body.message,
  });

  if (insertError) {
    console.error("Failed to save contact submission:", insertError);
    return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
  }

  // The submission is already saved and visible in /admin/messages at this point,
  // so an email failure here shouldn't turn into a failed request for the visitor.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "English Teacher Site <onboarding@resend.dev>",
        to: NOTIFY_EMAILS,
        replyTo: body.email,
        subject: `New contact form message from ${body.name}`,
        text: [
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          `Organisation: ${body.organisation || "-"}`,
          `Interested in: ${body.interest}`,
          "",
          "Message:",
          body.message,
        ].join("\n"),
      });
    } catch (emailError) {
      console.error("Failed to send contact notification email:", emailError);
    }
  }

  return NextResponse.json({ success: true });
}
