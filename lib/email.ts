import "server-only"

import nodemailer from "nodemailer"

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !Number.isFinite(port)) return null

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = getTransport()
  if (!transport) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[email] SMTP is not configured. Password reset URL for ${to}: ${resetUrl}`)
      return
    }
    throw new Error("SMTP is not configured")
  }

  const from = process.env.EMAIL_FROM ?? "PatchPigeon <noreply@localhost>"
  await transport.sendMail({
    from,
    to,
    subject: "Reset your PatchPigeon password",
    text: `Reset your PatchPigeon password within one hour: ${resetUrl}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1f2937;">Reset your password</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          We received a request to reset your PatchPigeon password. This link expires in one hour.
        </p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #1f2937; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset password</a>
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          If you did not request this, you can ignore this email; your password will not change.
        </p>
      </div>
    `,
  })
}
