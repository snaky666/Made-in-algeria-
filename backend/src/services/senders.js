import axios from 'axios'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function sendTelegramMessage(chatId, text){
  try{
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
    const res = await axios.post(url, { chat_id: chatId, text })
    return res.data
  }catch(e){
    console.error('Telegram send error', e?.response?.data || e.message)
    throw e
  }
}

export async function sendEmail(to, subject, plainText){
  try{
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })

    const info = await transporter.sendMail({
      from: `${process.env.COMPANY_NAME} <${process.env.FROM_EMAIL}>`,
      to, subject,
      text: plainText
    })
    return info
  }catch(e){
    console.error('Email send error', e?.response || e.message)
    throw e
  }
}

export async function sendMetaMessage(recipient, text, platform){
  // Placeholder: Meta Graph API messaging requires setup and Page access.
  // This function is a stub that logs the intended action.
  console.log(`(stub) send to ${platform} recipient ${recipient}: ${text}`)
  // If you have a token and proper recipient ids you can implement requests here.
  return { ok: true, stub: true }
}
