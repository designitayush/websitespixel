"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { insights } from "@/data/insights";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/ui/Reveal";
import { FieldWrapper, Input, FormStatus } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { validateLeadMagnetEmail } from "@/lib/validation";

export function Insights() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationError = validateLeadMagnetEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage("Check your inbox — the Shopify Growth Audit checklist is on its way.");
      setEmail("");
    } catch {
      setStatus("error");
      setStatusMessage("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <section className="section-y section-padding" aria-labelledby="insights-heading">
      <div className="container-canvas">
        <Reveal>
          <p className="eyebrow mb-4">Insights</p>
          <h2 id="insights-heading" className="section-heading">
            Ecommerce intelligence, without the fluff.
          </h2>
        </Reveal>

        <StaggerReveal className="mt-14 grid gap-6 md:grid-cols-3">
          {insights.map((article) => (
            <StaggerItem key={article.slug}>
              <Link
                href={`/insights/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-graphite-200/30 bg-graphite/40 p-6 transition-colors duration-300 hover:border-lime/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
              >
                <span className="text-xs uppercase tracking-wider text-lime">{article.category}</span>
                <h3 className="mt-3 flex-1 font-display text-xl font-semibold text-offwhite transition-colors group-hover:text-lime">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm text-muted">{article.excerpt}</p>
                <p className="mt-4 text-xs text-muted">{article.readTime}</p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal className="mt-16">
          <div className="rounded-2xl border border-lime/20 bg-gradient-to-br from-lime/5 to-violet-glow/5 p-8 md:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-offwhite">
                  Get the Shopify Growth Audit checklist.
                </h3>
                <p className="mt-2 text-sm text-muted">
                  A practical framework for evaluating your store&apos;s conversion potential—free,
                  no fluff.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <FieldWrapper label="Email address" htmlFor="lead-email" error={error ?? undefined} required>
                  <Input
                    id="lead-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="you@yourbrand.com"
                    error={Boolean(error)}
                    aria-describedby={error ? "lead-email-error" : undefined}
                    disabled={status === "loading" || status === "success"}
                    autoComplete="email"
                  />
                </FieldWrapper>

                {status === "success" && <FormStatus type="success" message={statusMessage} />}
                {status === "error" && <FormStatus type="error" message={statusMessage} />}
                {status === "loading" && <FormStatus type="loading" message="Submitting..." />}

                {status !== "success" && (
                  <Button type="submit" variant="primary" size="md" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Get the checklist"}
                  </Button>
                )}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
