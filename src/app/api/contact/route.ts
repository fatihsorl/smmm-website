import dns from "node:dns";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

const CONTACT_TO = process.env.CONTACT_TO_EMAIL ?? "info@soraldanismanlik.com";

let cachedTransporter: Mail | null = null;
let cachedTransporterKey = "";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const configKey = `${host}:${port}:${user}`;
  if (cachedTransporter && cachedTransporterKey === configKey) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    requireTLS: port === 587,
    tls: {
      minVersion: "TLSv1.2",
    },
    lookup: (
      hostname: string,
      options: dns.LookupOptions,
      callback: (
        err: NodeJS.ErrnoException | null,
        address: string | dns.LookupAddress[],
        family?: number,
      ) => void,
    ) => {
      dns.lookup(hostname, { ...options, family: 4 }, callback);
    },
  } as SMTPTransport.Options);
  cachedTransporterKey = configKey;

  return cachedTransporter;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const company = body.company?.trim() ?? "";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Ad soyad, e-posta ve mesaj alanları zorunludur." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Lütfen geçerli bir e-posta adresi girin." },
        { status: 400 },
      );
    }

    const transporter = getTransporter();

    if (!transporter) {
      return NextResponse.json(
        {
          message:
            "Mail gönderimi için SMTP_HOST, SMTP_USER ve SMTP_PASS ortam değişkenleri tanımlanmalıdır.",
        },
        { status: 500 },
      );
    }

    const user = process.env.SMTP_USER!;

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? user,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Soral Danışmanlık iletişim formu - ${name}`,
      text: [
        `Ad Soyad: ${name}`,
        `E-posta: ${email}`,
        `Telefon: ${phone || "-"}`,
        `Firma: ${company || "-"}`,
        "",
        "Mesaj:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 16px;">Soral Danışmanlık İletişim Formu</h2>
          <p><strong>Ad Soyad:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone || "-")}</p>
          <p><strong>Firma:</strong> ${escapeHtml(company || "-")}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p><strong>Mesaj:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({
      message:
        "Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { message: "Mesaj gönderilirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
