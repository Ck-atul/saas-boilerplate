import { getAppUrl } from "@/lib/app-url";

const BRAND = process.env.APP_NAME ?? "SaaS Boilerplate";
const BRAND_COLOR = "#4f46e5";
const SUPPORT_EMAIL = process.env.FROM_EMAIL ?? "support@example.com";

type LayoutOptions = {
  preview: string;
  title: string;
  greeting?: string;
  paragraphs: string[];
  cta?: { label: string; url: string };
  footerNote?: string;
};

export function buildEmailHtml({
  preview,
  title,
  greeting,
  paragraphs,
  cta,
  footerNote,
}: LayoutOptions) {
  const appUrl = getAppUrl();
  const year = new Date().getFullYear();

  const bodyHtml = paragraphs.map((p) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">${p}</p>`).join("");

  const ctaHtml = cta
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
        <tr>
          <td style="border-radius:8px;background:${BRAND_COLOR};">
            <a href="${cta.url}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${cta.label}</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#9ca3af;">Or copy this link:</p>
      <p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:#6b7280;word-break:break-all;">${cta.url}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preview}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="background:${BRAND_COLOR};padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">${BRAND}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#111827;">${title}</h2>
              ${greeting ? `<p style="margin:0 0 20px;font-size:15px;color:#374151;">${greeting}</p>` : ""}
              ${bodyHtml}
              ${ctaHtml}
              ${footerNote ? `<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5e7eb;font-size:13px;line-height:1.5;color:#6b7280;">${footerNote}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f9fafb;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">© ${year} ${BRAND}. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                <a href="${appUrl}" style="color:${BRAND_COLOR};text-decoration:none;">${appUrl.replace(/^https?:\/\//, "")}</a>
                · <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};text-decoration:none;">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function verificationEmailHtml(name: string, verifyUrl: string) {
  return buildEmailHtml({
    preview: `Activate your ${BRAND} account — one click to get started.`,
    title: "Activate your account",
    greeting: `Hi ${name},`,
    paragraphs: [
      `Thank you for signing up for <strong>${BRAND}</strong>. We're glad to have you on board.`,
      `To complete your registration and secure your account, please verify your email address. Until activation is complete, sign-in will remain disabled.`,
      `This activation link is valid for <strong>24 hours</strong>.`,
    ],
    cta: { label: "Activate my account", url: verifyUrl },
    footerNote:
      "If you did not create this account, you can safely ignore this email. No action is required.",
  });
}

export function activationSuccessEmailHtml(name: string, loginUrl: string) {
  return buildEmailHtml({
    preview: `Your ${BRAND} account is now active. You can sign in.`,
    title: "Account activated successfully",
    greeting: `Hi ${name},`,
    paragraphs: [
      `Your email has been verified and your <strong>${BRAND}</strong> account is now <strong>fully active</strong>.`,
      `You can sign in anytime to access your dashboard, manage your profile, and use all available features.`,
      `<strong>What's next?</strong><br/>• Sign in with your registered email and password<br/>• Complete your profile from the dashboard<br/>• Explore your workspace`,
    ],
    cta: { label: "Sign in to your account", url: loginUrl },
    footerNote:
      "Welcome to the platform. If you need help, reply to this email or contact our support team.",
  });
}

export function passwordResetEmailHtml(resetUrl: string) {
  return buildEmailHtml({
    preview: `Reset your ${BRAND} password.`,
    title: "Reset your password",
    greeting: "Hello,",
    paragraphs: [
      `We received a request to reset the password for your <strong>${BRAND}</strong> account.`,
      `Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.`,
    ],
    cta: { label: "Reset password", url: resetUrl },
    footerNote:
      "If you did not request a password reset, please ignore this email. Your password will stay unchanged.",
  });
}
