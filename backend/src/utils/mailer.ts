import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function sendTwoFactorEmail(to: string, code: string) {
  await transporter.sendMail({
    from: `"Cursos" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Seu código de verificação",
    html: `
      <p>Use o código abaixo para concluir seu login:</p>
      <h2 style="letter-spacing: 4px;">${code}</h2>
      <p>Esse código expira em 10 minutos. Se não foi você que tentou entrar, ignore este email.</p>
    `
  })
}