import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/** White chip with a red dot and a mono uppercase label. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-ink shadow-chip",
        "o-label",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  );
}
