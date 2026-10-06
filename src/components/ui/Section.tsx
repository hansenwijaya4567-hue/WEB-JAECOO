import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wrapper section dengan spacing vertikal yang konsisten.
 * Mobile-first: padding lebih kecil di layar kecil.
 */
export function Section({
  children,
  id,
  className,
  tone = "white",
  containerClassName,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: "white" | "mist" | "brand" | "dark";
  containerClassName?: string;
}) {
  const tones = {
    white: "bg-white",
    mist: "bg-mist",
    brand: "bg-brand-gradient text-white",
    dark: "bg-ink text-white",
  } as const;

  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-16 sm:py-20 lg:py-28", tones[tone], className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Judul section dengan eyebrow, judul, dan deskripsi. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  const isLight = tone === "light";
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={cn("max-w-3xl", alignClass, className)}>
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
            isLight
              ? "bg-white/10 text-brand-100 ring-1 ring-white/15"
              : "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
          )}
        >
          {eyebrow}
        </span>
      ) : null}

      <h2
        className={cn(
          "mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          isLight ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            isLight ? "text-white/75" : "text-ink/65",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Label kecil di atas judul section (alias-friendly). */
export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]",
        tone === "light"
          ? "bg-white/10 text-brand-100 ring-1 ring-white/15"
          : "bg-brand-50 text-brand-700 ring-1 ring-brand-100",
      )}
    >
      {children}
    </span>
  );
}