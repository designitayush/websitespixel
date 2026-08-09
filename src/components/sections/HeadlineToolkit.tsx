"use client";

import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/system/Reveal";
import { cn } from "@/lib/utils";

type Font = "serif" | "sans" | "mono";
type Color = "ink" | "violet" | "red" | "blue";

// Brand-approved headline colours; all hold contrast on the pastel card.
const COLORS: Record<Color, string> = {
  ink: "#141414",
  violet: "#6D5BFF",
  red: "#E42313",
  blue: "#2B4BD8",
};

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className={className} aria-hidden="true">
      <path
        d="M1 1l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToggleButton({
  pressed,
  onClick,
  label,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg font-inter text-[13px] text-ink",
        "transition-[opacity,background-color,transform] duration-150 active:scale-90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink",
        pressed ? "bg-black/[0.06] opacity-100" : "opacity-40 hover:opacity-75"
      )}
    >
      {children}
    </button>
  );
}

/**
 * The hero headline plus a working typography toolbar: font family, bold,
 * italic, underline, and colour all restyle the H1 live.
 */
export function HeadlineToolkit() {
  const [font, setFont] = useState<Font>("serif");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [color, setColor] = useState<Color>("ink");

  return (
    <>
      <Reveal mode="mount">
        <h1
          id="hero-heading"
          className={cn(
            "o-h1 text-center",
            font === "serif" && "tk-serif",
            font === "sans" && "tk-sans",
            font === "mono" && "tk-mono",
            bold && "tk-bold",
            italic && "tk-italic",
            underline && "tk-underline"
          )}
          style={{ "--o-heading-color": COLORS[color] } as React.CSSProperties}
        >
          Dream Shopify store?
          <br />
          <span className="rounded-toolbar bg-black/[0.06] px-2.5 [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
            Built by us.
          </span>
        </h1>
      </Reveal>

      <Reveal mode="mount" delay={0.08} className="relative z-[2] mt-4 scale-[0.85] tab:-mt-4 tab:scale-100">
        <div
          role="group"
          aria-label="Headline typography controls"
          className="flex h-[37px] items-center gap-1 rounded-toolbar bg-surface p-1 shadow-chip"
        >
          <span className="relative flex h-7 items-center">
            <select
              value={font}
              onChange={(e) => setFont(e.target.value as Font)}
              aria-label="Headline font"
              className={cn(
                "h-7 cursor-pointer appearance-none rounded-lg bg-transparent pl-2 pr-6",
                "font-inter text-[13px] font-medium text-ink",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
              )}
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans</option>
              <option value="mono">Mono</option>
            </select>
            <Chevron className="pointer-events-none absolute right-2 text-ink" />
          </span>

          <span className="h-[29px] w-px bg-line" aria-hidden="true" />

          <ToggleButton pressed={bold} onClick={() => setBold((v) => !v)} label="Bold headline">
            <span className="font-bold">B</span>
          </ToggleButton>
          <ToggleButton pressed={italic} onClick={() => setItalic((v) => !v)} label="Italic headline">
            <span className="italic">I</span>
          </ToggleButton>
          <ToggleButton
            pressed={underline}
            onClick={() => setUnderline((v) => !v)}
            label="Underline headline"
          >
            <span className="underline">U</span>
          </ToggleButton>

          <span className="h-[29px] w-px bg-line" aria-hidden="true" />

          <span
            className={cn(
              "relative flex h-7 w-[46px] cursor-pointer items-center justify-center gap-1.5 rounded-lg",
              "focus-within:outline focus-within:outline-2 focus-within:outline-ink"
            )}
          >
            <span
              aria-hidden="true"
              className="border-b-2 pb-px font-inter text-[13px] font-medium leading-none text-ink"
              style={{ borderColor: COLORS[color] }}
            >
              A
            </span>
            <Chevron className="text-ink opacity-40" />
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as Color)}
              aria-label="Headline colour"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              <option value="ink">Ink</option>
              <option value="violet">Violet</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
            </select>
          </span>
        </div>
      </Reveal>
    </>
  );
}
