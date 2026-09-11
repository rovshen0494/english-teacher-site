"use client";

import { useState } from "react";

const INTERESTS = [
  "Language centre teaching",
  "IELTS / TOEFL",
  "Children's English",
  "Teenager English",
  "Adult English",
  "Private lessons",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <h3 className="font-display text-lg font-semibold text-brand-700">Message sent</h3>
        <p className="mt-2 text-sm text-brand-700">
          Thank you for getting in touch — a reply will follow as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Name
          <input
            name="name"
            type="text"
            required
            className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Organisation <span className="font-normal normal-case text-ink-300">(optional)</span>
        <input
          name="organisation"
          type="text"
          className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        I&apos;m interested in
        <select
          name="interest"
          required
          className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
        >
          {INTERESTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink-700">
        Message
        <textarea
          name="message"
          rows={5}
          required
          className="rounded-lg border border-ink-100 px-4 py-2.5 text-sm font-normal text-ink-900 focus:border-brand-400 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong sending your message. Please try again or email directly.
        </p>
      )}
    </form>
  );
}
