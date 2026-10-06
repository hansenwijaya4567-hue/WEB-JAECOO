"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-[0_8px_20px_-8px_rgb(15_122_131/0.7)] hover:bg-brand-600 hover:shadow-[0_12px_28px_-10px_rgb(15_122_131/0.8)] active:scale-[0.98]",
  secondary:
    "bg-ink text-white hover:bg-ink-soft active:scale-[0.98]",
  outline:
    "border border-line bg-white text-ink hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.98]",
  ghost:
    "text-brand-700 hover:bg-brand-50 active:scale-[0.98]",
  whatsapp:
    "bg-wa text-white shadow-[0_8px_20px_-8px_rgb(37_211_102/0.8)] hover:bg-[#1eb856] active:scale-[0.98]",
  light:
    "bg-white text-brand-700 hover:bg-brand-50 active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3.5 text-base sm:text-[1.0625rem]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/** Tombol HTML untuk aksi on-click (submit, buka modal, dll). */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
});

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  external?: boolean;
}

/** Tombol berupa link, otomatis external bila `external`. */
export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  external,
  className,
  children,
  ...props
}: LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}