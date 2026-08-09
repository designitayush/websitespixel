"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light";

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
  > {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
}

const MotionLink = motion.create(Link);

const variantClasses: Record<Variant, string> = {
  dark: "bg-ink text-white shadow-btn hover:bg-black",
  light: "bg-surface text-ink shadow-chip",
};

const pillVariants = {
  rest: { scale: 1 },
  hover: { scale: 0.95 },
};

const stackVariants = {
  rest: { y: 0 },
  hover: { y: -40 },
};

const spring = { type: "spring", bounce: 0, duration: 0.6 } as const;

/**
 * System button: pill, 10x20 padding, Inter 14/500. On hover the pill scales
 * to 0.95 while two stacked copies of the label roll up -40px inside a 20px
 * overflow-clip window. Static under prefers-reduced-motion.
 */
export function Button({
  variant = "dark",
  href,
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const reducedMotion = useReducedMotion();

  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5",
    "o-small font-medium",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    "transition-colors duration-300",
    variantClasses[variant],
    className
  );

  const label = reducedMotion ? (
    <span className="block">{children}</span>
  ) : (
    <span className="block h-5 overflow-clip">
      <motion.span
        variants={stackVariants}
        transition={spring}
        className="flex flex-col items-center gap-5"
      >
        <span className="block h-5">{children}</span>
        <span className="block h-5" aria-hidden="true">
          {children}
        </span>
      </motion.span>
    </span>
  );

  const motionProps = reducedMotion
    ? {}
    : ({
        initial: "rest",
        animate: "rest",
        whileHover: "hover",
        variants: pillVariants,
        transition: spring,
      } as const);

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        {...motionProps}
      >
        {label}
      </MotionLink>
    );
  }

  return (
    <motion.button className={classes} onClick={onClick} {...motionProps} {...props}>
      {label}
    </motion.button>
  );
}
