import nodemailer from "nodemailer";
import { getAppUrl } from "@/lib/app-url";
import {
  activationSuccessEmailHtml,
  passwordResetEmailHtml,
  verificationEmailHtml,
} from "@/lib/email-templates";

const APP_NAME = process.env.APP_NAME ?? "SaaS Boilerplate";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL;

  if (!host || !port || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port: Number(port),
    user,
    pass,
    from: `"${APP_NAME}" <${from}>`,
  };
}

function createTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

/** Sends via Gmail SMTP when configured; otherwise logs to console (local dev). */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const config = getSmtpConfig();
  const transporter = createTransporter();

  if (!config || !transporter) {
    console.log("\n--- Email (SMTP not configured) ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    if (text) console.log("Text:", text);
    console.log(html);
    console.log("-----------------------------------\n");
    return { ok: true, mode: "console" as const };
  }

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
  });

  return { ok: true, mode: "smtp" as const };
}

/** Step 1 — after signup: ask user to activate account */
export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string
) {
  const verifyUrl = `${getAppUrl()}/verify-email?token=${token}`;
  const html = verificationEmailHtml(name, verifyUrl);

  await sendEmail({
    to: email,
    subject: `Activate your ${APP_NAME} account`,
    html,
    text: `Hi ${name},\n\nPlease activate your ${APP_NAME} account by opening this link:\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you did not sign up, ignore this email.`,
  });
}

/** Step 2 — after email verified: welcome + login CTA */
export async function sendActivationSuccessEmail(name: string, email: string) {
  const loginUrl = `${getAppUrl()}/login?verified=1`;
  const html = activationSuccessEmailHtml(name, loginUrl);

  await sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME} — your account is active`,
    html,
    text: `Hi ${name},\n\nYour ${APP_NAME} account is now active.\n\nSign in here: ${loginUrl}\n\nWelcome aboard!`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;
  const html = passwordResetEmailHtml(resetUrl);

  await sendEmail({
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html,
    text: `Reset your password using this link (expires in 1 hour):\n${resetUrl}`,
  });
}
