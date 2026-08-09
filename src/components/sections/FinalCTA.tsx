"use client";

import { useState, type FormEvent } from "react";
import { helpOptions, revenueRanges, siteConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import {
  FieldWrapper,
  Input,
  Select,
  Textarea,
  FormStatus,
} from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { validateContactForm, type ContactFormData } from "@/lib/validation";

const initialForm: ContactFormData = {
  name: "",
  email: "",
  company: "",
  website: "",
  revenue: "",
  helpWith: "",
  details: "",
  website_honeypot: "",
};

export function FinalCTA() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateContactForm(form);

    if (errors.length > 0) {
      const map: Record<string, string> = {};
      errors.forEach((err) => {
        map[err.field] = err.message;
      });
      setFieldErrors(map);
      return;
    }

    setFieldErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage(
        "Thank you — we've received your inquiry and will be in touch within one business day."
      );
      setForm(initialForm);
    } catch {
      setStatus("error");
      setStatusMessage("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <section
      id="contact"
      className="section-y section-padding bg-graphite/30"
      aria-labelledby="cta-heading"
    >
      <div className="container-canvas">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 id="cta-heading" className="section-heading text-balance">
              Your store should do more than look ready.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              Let&apos;s build the next version of your ecommerce business—one designed to be
              trusted, fast, memorable, and easy to buy from.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/#contact" variant="primary" size="lg" magnetic>
                Start a Project
              </Button>
              {siteConfig.bookingUrl ? (
                <Button href={siteConfig.bookingUrl} variant="secondary" size="lg">
                  Request a Growth Audit
                </Button>
              ) : (
                <Button href="/#contact-form" variant="secondary" size="lg">
                  Request a Growth Audit
                </Button>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              id="contact-form"
              className="rounded-2xl border border-graphite-200/30 bg-graphite/60 p-6 md:p-8"
            >
              <h3 className="font-display text-xl font-bold text-offwhite">Tell us about your project</h3>
              <p className="mt-2 text-sm text-muted">
                All fields are required. We respond within one business day.
              </p>

              {status === "success" ? (
                <div className="mt-8">
                  <FormStatus type="success" message={statusMessage} />
                  {siteConfig.bookingUrl && (
                    <div className="mt-6">
                      <p className="mb-3 text-sm text-muted">
                        Prefer to talk sooner? Book a strategy call directly.
                      </p>
                      <Button href={siteConfig.bookingUrl} variant="secondary" size="md">
                        Book a Strategy Call
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                  {/* Honeypot */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website_honeypot">Leave blank</label>
                    <input
                      id="website_honeypot"
                      name="website_honeypot"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website_honeypot}
                      onChange={(e) => updateField("website_honeypot", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FieldWrapper label="Name" htmlFor="name" error={fieldErrors.name} required>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        error={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? "name-error" : undefined}
                        disabled={status === "loading"}
                        autoComplete="name"
                      />
                    </FieldWrapper>

                    <FieldWrapper label="Work email" htmlFor="email" error={fieldErrors.email} required>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        error={Boolean(fieldErrors.email)}
                        disabled={status === "loading"}
                        autoComplete="email"
                      />
                    </FieldWrapper>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FieldWrapper label="Brand / company" htmlFor="company" error={fieldErrors.company} required>
                      <Input
                        id="company"
                        value={form.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        error={Boolean(fieldErrors.company)}
                        disabled={status === "loading"}
                        autoComplete="organization"
                      />
                    </FieldWrapper>

                    <FieldWrapper label="Website URL" htmlFor="website" error={fieldErrors.website} required>
                      <Input
                        id="website"
                        type="url"
                        value={form.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        placeholder="yourbrand.com"
                        error={Boolean(fieldErrors.website)}
                        disabled={status === "loading"}
                        autoComplete="url"
                      />
                    </FieldWrapper>
                  </div>

                  <FieldWrapper
                    label="Monthly store revenue range"
                    htmlFor="revenue"
                    error={fieldErrors.revenue}
                    required
                  >
                    <Select
                      id="revenue"
                      value={form.revenue}
                      onChange={(e) => updateField("revenue", e.target.value)}
                      error={Boolean(fieldErrors.revenue)}
                      disabled={status === "loading"}
                    >
                      <option value="">Select a range</option>
                      {revenueRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </Select>
                  </FieldWrapper>

                  <FieldWrapper
                    label="What do you need help with?"
                    htmlFor="helpWith"
                    error={fieldErrors.helpWith}
                    required
                  >
                    <Select
                      id="helpWith"
                      value={form.helpWith}
                      onChange={(e) => updateField("helpWith", e.target.value)}
                      error={Boolean(fieldErrors.helpWith)}
                      disabled={status === "loading"}
                    >
                      <option value="">Select an option</option>
                      {helpOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  </FieldWrapper>

                  <FieldWrapper
                    label="Project details"
                    htmlFor="details"
                    error={fieldErrors.details}
                    required
                  >
                    <Textarea
                      id="details"
                      value={form.details}
                      onChange={(e) => updateField("details", e.target.value)}
                      placeholder="Tell us about your goals, timeline, and current challenges..."
                      error={Boolean(fieldErrors.details)}
                      disabled={status === "loading"}
                    />
                  </FieldWrapper>

                  {status === "error" && <FormStatus type="error" message={statusMessage} />}
                  {status === "loading" && <FormStatus type="loading" message="Submitting..." />}

                  <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Submit inquiry"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
