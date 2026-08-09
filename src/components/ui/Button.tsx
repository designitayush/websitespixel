"use client";

import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCanHover, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  magnetic?: boolean;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-lime text-canvas hover:bg-lime-dim border border-lime/20 shadow-accent-soft",
  secondary:
    "bg-transparent text-offwhite border border-graphite-200/60 hover:border-lime/40 hover:text-lime",
  ghost: "bg-transparent text-muted hover:text-offwhite border border-transparent",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  magnetic = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const canHover = useCanHover();
  const reducedMotion = useReducedMotion();
  const isMagnetic = magnetic && canHover && !reducedMotion;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 400, damping: 25 });
  const y = useSpring(my, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMagnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 8);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 8);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-body font-medium",
    "transition-[color,background-color,border-color,transform] duration-300",
    "active:scale-[0.98]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime",
    "disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <motion.span
      style={isMagnetic ? { x, y } : undefined}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 transition-transform duration-300", className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
