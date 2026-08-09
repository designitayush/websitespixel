"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/config";
import { Button } from "@/components/system/Button";
import { Logo } from "@/components/system/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the mobile menu when navigation changes the route.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
    <motion.header
      initial={reducedMotion ? false : { opacity: 0.001, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 1.5, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-[9] h-[79px] bg-paper/80 backdrop-blur-[10px]"
    >
      <div className="flex h-full items-center justify-between px-6">
        <Logo />

        <nav
          className="hidden items-center gap-2 tab:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "o-small group relative px-5 py-2.5 text-ink",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink",
                    "opacity-0 transition-opacity duration-200 ease-out",
                    "group-hover:opacity-100 group-focus-visible:opacity-100",
                    active && "opacity-100"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden tab:block">
          <Button href="/#contact" variant="dark">
            Start a Project
          </Button>
        </div>

        <button
          type="button"
          className={cn(
            "relative z-[12] flex h-10 w-10 items-center justify-center rounded-full text-ink tab:hidden",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          )}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span
              className={cn(
                "block h-0.5 w-full bg-current transition-transform duration-300",
                menuOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-current transition-opacity duration-300",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-full bg-current transition-transform duration-300",
                menuOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </span>
        </button>
      </div>
    </motion.header>

    {/* Sibling of the header: a fixed overlay inside it would be clipped by
        the header's backdrop-filter containing block. */}
    <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
