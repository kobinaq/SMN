import { MessageCircle } from "@/components/ui/icons";
import { whatsappUpdatesLabel } from "@/lib/pages/join";
import { cn } from "@/lib/utils";

/** Secondary text link only. The free TSA account stays the primary action. */
export function WhatsAppUpdatesLink({ href, className }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-1 text-sm text-text-2 underline-offset-4 transition-colors hover:text-text-1 hover:underline",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      {whatsappUpdatesLabel}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
