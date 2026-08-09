"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { navLinks, siteConfig } from "@/lib/config";
import { Button } from "@/components/system/Button";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Full-screen frosted overlay menu for viewports under 810px. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Keep Tab focus inside the open menu.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={cn(
        "fixed inset-0 z-[8] flex flex-col bg-paper/90 pt-[79px] backdrop-blur-[10px] tab:hidden",
        "transition-opacity duration-300 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <nav
        className="flex flex-1 flex-col justify-center gap-6 px-6"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            ref={i === 0 ? firstLinkRef : undefined}
            href={link.href}
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className={cn(
              "font-inter text-[20px] font-medium leading-none tracking-[-0.4px] text-ink",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-4 px-6 pb-8">
        <div className="o-small space-y-1.5 text-body">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            tabIndex={open ? 0 : -1}
            className="block break-all hover:text-ink"
          >
            {siteConfig.contactEmail}
          </a>
          <a
            href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
            tabIndex={open ? 0 : -1}
            className="block hover:text-ink"
          >
            {siteConfig.phone}
          </a>
        </div>
        <Button href="/#contact" variant="dark" className="w-full" onClick={onClose}>
          Start a Project
        </Button>
      </div>
    </div>
  );
}
