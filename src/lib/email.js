import nodemailer from "nodemailer";

// ─── Transporter ──────────────────────────────────────────────────────────────
function createTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const rawPass = process.env.GMAIL_APP_PASSWORD;
  const pass = rawPass ? rawPass.replace(/\s+/g, "").trim() : "";

  if (!user || !pass) {
    console.error("❌ Gmail SMTP Error: GMAIL_USER or GMAIL_APP_PASSWORD is not configured properly.", { user: !!user, pass: !!pass });
    throw new Error("Gmail SMTP credentials are not configured in environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ─── Brand HTML wrapper ───────────────────────────────────────────────────────
function brandedEmail(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #f8f5ef; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8dfd0; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 28px 32px; text-align: center; }
    .header-logo { font-size: 22px; font-weight: 800; color: #d4a843; letter-spacing: 0.5px; }
    .header-sub { font-size: 12px; color: #a89070; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 32px; }
    .title { font-size: 20px; font-weight: 700; color: #2c2c2c; margin: 0 0 8px; }
    .subtitle { font-size: 13px; color: #888; margin: 0 0 24px; }
    .card { background: #faf8f4; border: 1px solid #e8dfd0; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #a89070; letter-spacing: 1px; margin-bottom: 4px; }
    .value { font-size: 14px; color: #3a3a3a; line-height: 1.6; white-space: pre-wrap; }
    .response-card { background: #f0f9f4; border: 1px solid #b8dfc8; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .response-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #2d7a4f; letter-spacing: 1px; margin-bottom: 8px; }
    .badge { display: inline-block; background: #d4a843; color: #ffffff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
    .footer { background: #f8f5ef; border-top: 1px solid #e8dfd0; padding: 20px 32px; text-align: center; font-size: 11px; color: #aaa; }
    .footer a { color: #d4a843; text-decoration: none; }
    hr { border: none; border-top: 1px solid #e8dfd0; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">🕌 TaseesCircle</div>
      <div class="header-sub">Support Notification</div>
    </div>
    <div class="body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>This email was sent by TaseesCircle — <a href="mailto:taseescircle@gmail.com">taseescircle@gmail.com</a></p>
      <p style="margin-top:4px;">© ${new Date().getFullYear()} TaseesCircle. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

// ─── 1. Alert: new query received → sent to admin ─────────────────────────────
/**
 * @param {{ id: string, subject: string, message: string, priority: string, recipient: string, created_at: string }} ticket
 * @param {{ full_name: string, email: string }} user
 */
export async function sendNewQueryAlert(ticket, user) {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || "taseescircle@gmail.com";

  const recipientLabel = ticket.recipient === "tasees_admin"
    ? "TaseesCircle Admin"
    : "Circle Moderator";

  const bodyHtml = `
    <p class="title">📨 New Support Query Received</p>
    <p class="subtitle">A user has submitted a query to <strong>${recipientLabel}</strong>.</p>

    <div class="card">
      <div class="label">From</div>
      <div class="value">${user.full_name || "Unknown User"} &lt;${user.email}&gt;</div>
    </div>

    <div class="card">
      <div class="label">Subject</div>
      <div class="value">${ticket.subject}</div>
    </div>

    <div class="card">
      <div class="label">Message</div>
      <div class="value">${ticket.message}</div>
    </div>

    <div style="margin-top:8px;">
      <span class="badge">${ticket.priority?.toUpperCase() || "MEDIUM"} Priority</span>
    </div>

    <hr />
    <p style="font-size:13px; color:#666;">
      Log in to your admin dashboard to view and respond to this query.
    </p>
  `;

  const plainText = `
New Support Query Received

From: ${user.full_name || "Unknown User"} (${user.email})
Subject: ${ticket.subject}
Message: ${ticket.message}
Priority: ${ticket.priority?.toUpperCase() || "MEDIUM"}

Log in to your admin dashboard to view and respond.
  `.trim();

  await transporter.sendMail({
    from: `"TaseesCircle Support" <${process.env.GMAIL_USER}>`,
    replyTo: user.email || process.env.GMAIL_USER,
    to: adminEmail,
    subject: `[New Query] ${ticket.subject} — from ${user.full_name || user.email}`,
    text: plainText,
    html: brandedEmail(`New Query: ${ticket.subject}`, bodyHtml),
    headers: {
      "X-Auto-Response-Suppress": "OOF, AutoReply",
    },
  });
}

// ─── 2. Response: admin replied → sent to user ────────────────────────────────
/**
 * @param {{ subject: string }} ticket
 * @param {{ response_message: string, created_at: string }} response
 * @param {string} userEmail
 * @param {string} userName
 */
export async function sendQueryResponse(ticket, response, userEmail, userName) {
  const transporter = createTransporter();

  const bodyHtml = `
    <p class="title">✅ Response to Your Query</p>
    <p class="subtitle">The TaseesCircle team has responded to your support query.</p>

    <div class="card">
      <div class="label">Your Query</div>
      <div class="value">${ticket.subject}</div>
    </div>

    <div class="response-card">
      <div class="response-label">🌿 Response from TaseesCircle Admin</div>
      <div class="value" style="color:#2c2c2c;">${response.response_message}</div>
    </div>

    <hr />
    <p style="font-size:13px; color:#666;">
      You can also view this response in the <strong>"My Queries"</strong> section of your TaseesCircle dashboard.
    </p>
    <p style="font-size:13px; color:#666; margin-top:4px;">
      If you have a follow-up question, please submit a new query from your dashboard.
    </p>
  `;

  const plainText = `
Response to Your Query: ${ticket.subject}

Dear ${userName || "Valued Member"},

The TaseesCircle team has responded to your support query:

"${response.response_message}"

You can also view this response in the "My Queries" section of your TaseesCircle dashboard.

Regards,
TaseesCircle Team
  `.trim();

  await transporter.sendMail({
    from: `"TaseesCircle Support" <${process.env.GMAIL_USER}>`,
    replyTo: process.env.GMAIL_USER,
    to: userEmail,
    subject: `Re: ${ticket.subject} — TaseesCircle Support`,
    text: plainText,
    html: brandedEmail(`Response to your query: ${ticket.subject}`, bodyHtml),
    headers: {
      "X-Auto-Response-Suppress": "OOF, AutoReply",
    },
  });
}
