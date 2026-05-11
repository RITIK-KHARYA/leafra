import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

type WelcomeEmailInput = {
  email: string;
  name?: string | null;
};

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "Leafra <onboarding@resend.dev>";

function getFirstName(name?: string | null): string {
  const trimmedName = name?.trim();
  if (!trimmedName) return "there";
  return trimmedName.split(/\s+/)[0];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildWelcomeEmail(input: WelcomeEmailInput) {
  const firstName = getFirstName(input.name);
  const escapedFirstName = escapeHtml(firstName);
  const dashboardUrl = `${env.NEXT_PUBLIC_BASE_URL}/dashboard`;

  return {
    subject: "Welcome to Leafra",
    text: `Hi ${firstName},

Welcome to Leafra. Your account is ready, and you can now start asking questions, organizing PDFs, and building cleaner study sessions.

Open Leafra: ${dashboardUrl}

Thanks,
The Leafra team`,
    html: `<!doctype html>
<html>
  <body style="margin:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px;">
                <h1 style="margin:0;font-size:28px;line-height:36px;color:#111827;">Welcome to Leafra</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px;font-size:16px;line-height:26px;color:#374151;">
                <p style="margin:0 0 16px;">Hi ${escapedFirstName},</p>
                <p style="margin:0 0 16px;">Your account is ready. You can now start asking questions, organizing PDFs, and building cleaner study sessions in Leafra.</p>
                <p style="margin:0;">We are glad you are here.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <a href="${dashboardUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;padding:12px 18px;font-size:14px;font-weight:600;">Open Leafra</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  };
}

export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<void> {
  if (!env.RESEND_API_KEY) {
    logger.warn("Skipping welcome email because RESEND_API_KEY is not set", {
      email: input.email,
    });
    return;
  }

  const email = buildWelcomeEmail(input);
  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL,
      to: input.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text().catch(() => "");
    throw new Error(
      `Resend welcome email failed with ${response.status}: ${responseBody}`
    );
  }
}
