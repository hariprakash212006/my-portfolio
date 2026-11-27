import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(payload: ContactNotificationPayload): Promise<{ success: boolean; error?: string }> {
  const targetEmail = process.env.CONTACT_NOTIFICATION_EMAIL || "owner@example.com";

  if (!resend) {
    console.log("📨 [Resend Email Notification (Dev Mode)]");
    console.log(`To: ${targetEmail}`);
    console.log(`From: ${payload.name} <${payload.email}>`);
    console.log(`Subject: [Portfolio Contact] ${payload.subject}`);
    console.log(`Message: ${payload.message}`);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: targetEmail,
      replyTo: payload.email,
      subject: `[Portfolio Contact] ${payload.subject}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send email notification";
    return { success: false, error: message };
  }
}
