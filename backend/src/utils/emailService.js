import nodemailer from "nodemailer";
import config from "../config/env.js";

// Create reusable transporter
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!config.email.user || !config.email.pass) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: config.email.host || "smtp.gmail.com",
    port: config.email.port || 587,
    secure: (config.email.port || 587) === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
  return transporter;
};

// Send email helper
export const sendEmail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  if (!transport) {
    console.warn("⚠️  Email service not configured (EMAIL_USER/EMAIL_PASS missing). Skipping email send.");
    console.warn(`   Would have sent to: ${to} | Subject: ${subject}`);
    return { skipped: true };
  }

  const mailOptions = {
    from: `"AI Resume Builder" <${config.email.user}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, " "),
  };

  const info = await transport.sendMail(mailOptions);
  return info;
};

export default sendEmail;
