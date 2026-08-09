import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * WebsitesPixel wordmark: a 2x2 "pixel" cluster (one cell in accent red)
 * plus the name set in Fraunces. Total height 32px to match the nav spec.
 */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="WebsitesPixel home"
      className={cn(
        "flex h-8 items-center gap-2.5 text-ink",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
        className
      )}
    >
      <svg width="26" height="26" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="1" y="1" width="12" height="12" rx="3.5" fill="currentColor" />
        <rect x="15" y="1" width="12" height="12" rx="3.5" fill="#FF0000" />
        <rect x="1" y="15" width="12" height="12" rx="3.5" fill="currentColor" />
        <rect x="15" y="15" width="12" height="12" rx="3.5" fill="currentColor" />
      </svg>
      <span className="o-wordmark">websitespixel</span>
    </Link>
  );
}
