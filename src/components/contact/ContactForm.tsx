"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitState("sending");
    setFeedback("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Mesaj gönderilemedi.");
      }

      form.reset();
      setSubmitState("success");
      setFeedback(
        result.message ??
          "Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.",
      );
    } catch (error) {
      setSubmitState("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Mesaj gönderilirken bir hata oluştu.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            Ad Soyad *
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder="Adınız ve soyadınız"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            E-posta *
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder="ornek@mail.com"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            Telefon
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder="+90 5xx xxx xx xx"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            Firma
          </span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder="Firma adınız"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          Mesajınız *
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
          placeholder="Size nasıl yardımcı olabiliriz?"
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {submitState === "sending" ? "Gönderiliyor..." : "Mesaj Gönder"}
      </button>

      {feedback && (
        <p
          className={`text-sm font-medium ${
            submitState === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
