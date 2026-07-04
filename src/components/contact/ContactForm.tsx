"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact.form");
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
      const result = (await response.json()) as { code?: string };

      if (!response.ok) {
        if (response.status === 400) {
          if (result.code === "INVALID_EMAIL") {
            throw new Error(t("invalidEmail"));
          }
          throw new Error(t("validationError"));
        }
        throw new Error(t("errorMessage"));
      }

      form.reset();
      setSubmitState("success");
      setFeedback(t("successMessage"));
    } catch (error) {
      setSubmitState("error");
      setFeedback(
        error instanceof Error ? error.message : t("errorMessage"),
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            {t("nameLabel")}
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder={t("namePlaceholder")}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            {t("emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder={t("emailPlaceholder")}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            {t("phoneLabel")}
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder={t("phonePlaceholder")}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-800">
            {t("companyLabel")}
          </span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
            placeholder={t("companyPlaceholder")}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-800">
          {t("messageLabel")}
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-primary"
          placeholder={t("messagePlaceholder")}
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {submitState === "sending" ? t("submitting") : t("submit")}
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
