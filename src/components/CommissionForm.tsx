import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Mode = "package" | "custom";

type Props = {
  mode: Mode;
  packageSlug?: string;
  packageName?: string;
  /** Visual theme — "light" works on light bg, "dark" works on dark bg */
  theme?: "light" | "dark";
  onSuccess?: () => void;
};

const PROJECT_TYPES = ["Photography", "Design", "Print", "Other"] as const;
const BUDGETS = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000+",
] as const;

export function CommissionForm({
  mode,
  packageSlug,
  packageName,
  theme = "dark",
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState("");
  const [referencesUrl, setReferencesUrl] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLight = theme === "light";
  const fieldBase =
    "w-full bg-transparent border px-2 py-0.5 md:px-3 md:py-2 font-sans text-[11px] md:text-sm leading-tight focus:outline-none focus:ring-0 transition-colors";
  const fieldBorder = isLight
    ? "border-foreground/30 focus:border-foreground placeholder:text-foreground/40 text-foreground"
    : "border-background/30 focus:border-background placeholder:text-background/40 text-background";
  const labelClass = `block font-sans text-[8px] md:text-[10px] uppercase tracking-[0.25em] mb-0 md:mb-2 leading-tight ${
    isLight ? "text-foreground/70" : "text-background/70"
  }`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // basic client-side validation
    if (name.trim().length < 1 || name.trim().length > 100) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please share a bit more about your project (at least 10 characters).");
      return;
    }
    if (message.trim().length > 2000) {
      setError("Message is too long (2000 characters max).");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase
      .from("commission_requests")
      .insert({
        kind: mode,
        package_slug: mode === "package" ? packageSlug ?? null : null,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        project_type: projectType || null,
        budget_range: budget || null,
        timeline: timeline.trim() || null,
        references_url: referencesUrl.trim() || null,
        message: message.trim(),
      });
    setSubmitting(false);

    if (insertError) {
      setError("Couldn't send your request — please try again in a moment.");
      return;
    }
    setSubmitted(true);
    onSuccess?.();
  }

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <p
          className="font-display leading-tight"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
        >
          Request received.
        </p>
        <p
          className={`mt-4 font-sans text-sm ${
            isLight ? "text-foreground/70" : "text-background/70"
          }`}
        >
          I'll be in touch within a few days. Thanks for reaching out.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
      {mode === "package" && packageName && (
        <div
          className={`border-l-2 pl-4 py-1 ${
            isLight ? "border-foreground/40" : "border-background/40"
          }`}
        >
          <span
            className={`block font-sans text-[10px] uppercase tracking-[0.25em] ${
              isLight ? "text-foreground/60" : "text-background/60"
            }`}
          >
            Requesting
          </span>
          <span className="font-display text-lg">{packageName}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2">
        <div>
          <label className={`${labelClass} sr-only md:not-sr-only`} htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${fieldBase} ${fieldBorder}`}
            placeholder="Name"
          />
        </div>
        <div>
          <label className={`${labelClass} sr-only md:not-sr-only`} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${fieldBase} ${fieldBorder}`}
            placeholder="Email"
          />
        </div>

        <div className="md:col-span-2">
          <label className={`${labelClass} sr-only md:not-sr-only`} htmlFor="message">
            {mode === "package" ? "Anything I should know?" : "Tell me about your project"}
          </label>
          <textarea
            id="message"
            required
            rows={1}
            minLength={10}
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldBase} ${fieldBorder} resize-none md:!h-auto`}
            placeholder={
              mode === "package"
                ? "Dates, locations, anything else…"
                : "Tell me about your project…"
            }
          />
        </div>
      </div>

      {error && (
        <p className="font-sans text-sm text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`font-sans text-xs md:text-sm uppercase tracking-[0.3em] px-6 py-2 md:px-8 md:py-3 border transition disabled:opacity-50 ${
          isLight
            ? "border-foreground text-foreground hover:opacity-80"
            : "border-background text-background hover:opacity-80"
        }`}
      >
        {submitting ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
