"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

/** The studio's home timezone (matches our US phone number). */
const TIME_ZONE = "America/Chicago";

export function HeroClock({ className }: { className?: string }) {
  const [time, setTime] = useState("");
  const [offset, setOffset] = useState("GMT");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now)
      );
      const zonePart = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        timeZoneName: "shortOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName");
      if (zonePart) setOffset(zonePart.value);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={cn("o-label", className)}>
      <span className="text-body">{offset}</span>{" "}
      <span className="text-ink">{time || "--:--"}</span>
    </p>
  );
}

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const email = siteConfig.contactEmail;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email address copied" : `Copy email address ${email}`}
      aria-live="polite"
      className={cn(
        "break-all font-mono text-[12px] leading-4 tracking-[0.36px] text-ink",
        "transition-colors duration-200 hover:text-body",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className
      )}
    >
      {copied ? "Copied!" : email}
    </button>
  );
}
