import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * System section shell: max-width 1560px, padding 80/64 -> 72/24 -> 48/12
 * (defined by the .o-section class in globals.css).
 */
export function Section({ children, className, ...rest }: SectionProps) {
  return (
    <section className={cn("o-section", className)} {...rest}>
      {children}
    </section>
  );
}
