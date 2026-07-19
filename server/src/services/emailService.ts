import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

function loadTemplate(templateName: string): HandlebarsTemplateDelegate | null {
  try {
    const templatePath = path.join(__dirname, '../../emails', `${templateName}.html`);
    const source = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(source);
  } catch (err) {
    console.warn(`[EMAIL] Template "${templateName}.html" not found at expected path — using inline fallback.`);
    return null;
  }
}

const welcomeTemplate = loadTemplate('welcome');
const bookingConfirmationTemplate = loadTemplate('booking-confirmation');

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const hasSmtpCredentials = !!(config.smtp.host && config.smtp.user && config.smtp.pass);
  if (!hasSmtpCredentials) {
    console.warn('[EMAIL] SMTP not configured — email not sent. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.');
    console.log(`[EMAIL] Would send to ${to}: ${subject}`);
    return;
  }
  await transporter.sendMail({
    from: config.emailFrom,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = welcomeTemplate
    ? welcomeTemplate({ name })
    : `<div style="font-family: Arial, sans-serif;"><h1 style="color: #d4a017;">Welcome to Ash2 Fitness, ${name}!</h1><p>We're excited to have you join our community.</p></div>`;
  await sendEmail({ to, subject: 'Welcome to Ash2 Fitness!', html });
}

export async function sendBookingConfirmation(to: string, name: string, date: string, time: string) {
  const html = bookingConfirmationTemplate
    ? bookingConfirmationTemplate({ name, date, time })
    : `<div style="font-family: Arial, sans-serif;"><h1 style="color: #d4a017;">Booking Confirmed!</h1><p>Hi ${name},</p><p>Your session on ${date} at ${time} has been booked.</p></div>`;
  await sendEmail({ to, subject: 'Booking Confirmed - Ash2 Fitness', html });
}

export async function sendContactNotification(to: string, name: string, email: string, subject: string, message: string) {
  await sendEmail({
    to,
    replyTo: email,
    subject: `New Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4a017;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <p>${message}</p>
        </div>
      </div>
    `,
  });
}

export async function sendTrainerApprovalEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: 'Your Trainer Application Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4a017;">Congratulations ${name}!</h1>
        <p>Your trainer application at <strong>Ash2 Fitness</strong> has been approved.</p>
        <p>You can now log in to your account and access your trainer dashboard to manage clients, schedules, and your profile.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${config.clientUrl}/login" style="display: inline-block; padding: 12px 24px; background: #d4a017; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Log In Now
          </a>
        </div>
        <p style="color: #666;">Welcome aboard, and we look forward to having you on the team!</p>
        <p style="color: #666;">- The Ash2 Fitness Team</p>
      </div>
    `,
  });
}

export async function sendTrainerRejectionEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: 'Update on Your Trainer Application',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4a017;">Application Update</h1>
        <p>Hi ${name},</p>
        <p>Thank you for your interest in joining <strong>Ash2 Fitness</strong> as a trainer.</p>
        <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
        <p>You are welcome to reapply in the future. If you have any questions, please contact the gym administration.</p>
        <p style="color: #666;">- The Ash2 Fitness Team</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
  await sendEmail({
    to,
    subject: 'Reset Your Ash2 Fitness Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d4a017;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the link below to set a new password. This link expires in 15 minutes.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #d4a017; color: #000; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p style="color: #666;">- The Ash2 Fitness Team</p>
      </div>
    `,
  });
}
