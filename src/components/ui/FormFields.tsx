"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FieldWrapper({ label, htmlFor, error, children, required }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-offwhite">
        {label}
        {required && (
          <span className="ml-1 text-lime" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldClasses =
  "w-full rounded-xl border border-graphite-200/50 bg-graphite/60 px-4 py-3 text-offwhite placeholder:text-muted transition-colors duration-200 focus:border-lime/50 focus:outline-none focus:ring-1 focus:ring-lime/30 disabled:opacity-50";

export function Input({
  className,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(fieldClasses, error && "border-red-400/60 focus:border-red-400 focus:ring-red-400/30", className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      className={cn(fieldClasses, "cursor-pointer appearance-none", error && "border-red-400/60", className)}
      aria-invalid={error || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({
  className,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      className={cn(fieldClasses, "min-h-[120px] resize-y", error && "border-red-400/60", className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}

export function FormStatus({
  type,
  message,
}: {
  type: "success" | "error" | "loading";
  message: string;
}) {
  const styles = {
    success: "border-lime/30 bg-lime/10 text-lime",
    error: "border-red-400/30 bg-red-400/10 text-red-300",
    loading: "border-blue-glow/30 bg-blue-glow/10 text-blue-glow",
  };

  return (
    <div
      className={cn("rounded-xl border px-4 py-3 text-sm", styles[type])}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
