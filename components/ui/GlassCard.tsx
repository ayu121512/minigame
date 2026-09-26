import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export type GlassCardPadding = "sm" | "md" | "lg";

const PADDING_STYLES: Readonly<Record<GlassCardPadding, string>> = {
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-7",
  lg: "p-6 sm:p-10",
};

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: GlassCardPadding;
  /** Adds a soft accent bloom behind the top edge of the card. */
  glow?: boolean;
}

export function GlassCard({
  children,
  padding = "md",
  glow = false,
  className,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10",
        "bg-white/4 backdrop-blur-xl",
        "shadow-[0_24px_70px_-40px_rgba(255,61,127,0.55)]",
        PADDING_STYLES[padding],
        className,
      )}
      {...rest}
    >
      {glow ? (
        <span
          aria-hidden
          className="bg-accent/20 pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
