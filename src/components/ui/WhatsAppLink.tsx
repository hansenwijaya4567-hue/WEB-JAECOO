"use client";

import { MessageCircle } from "lucide-react";
import { useCallback } from "react";
import { buildWhatsAppLink } from "@/lib/utils";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";

/**
 * Tombol WhatsApp yang selalu mengirim event analytics saat diklik.
 *
 * Membungkus <a> biasa (bukan button) supaya tetap bisa di-middle-click
 * dan di-navigate seperti link pada umumnya.
 */
export function WhatsAppLink({
  message,
  children,
  className,
  variant = "link",
  ariaLabel,
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: "link" | "floating" | "stacked";
  ariaLabel?: string;
}) {
  const href = buildWhatsAppLink(message);

  const handleClick = useCallback(() => {
    trackEvent(GA_EVENTS.waClick, {
      placement: variant,
      message_preview: message.slice(0, 80),
    });
  }, [message, variant]);

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label={ariaLabel ?? "Chat WhatsApp sales JAECOO J5 Medan"}
        className={className}
      >
        <MessageCircle className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}