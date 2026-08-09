import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  children: ReactNode;
  className?: string;
}

/** White tag pill: Inter 14, 6x12 padding, chip shadow. */
export function Pill({ children, className }: PillProps) {
  return (
    <span
      className={cn(
        "o-small inline-flex items-center rounded-full bg-surface px-3 py-1.5 text-ink shadow-chip",
        className
      )}
    >
      {children}
    </span>
  );
}
