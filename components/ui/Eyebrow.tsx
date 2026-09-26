import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface EyebrowProps {
  children: ReactNode;
  /** Adds a softly pulsing accent dot, for "live" sections. */
  pulse?: boolean;
  className?: string;
}

/** Small uppercase label that sits above a screen's heading. */
export function Eyebrow({ children, pulse = false, className }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {pulse ? (
        <span
          aria-hidden
          className="bg-accent animate-pulse h-1.5 w-1.5 shrink-0 rounded-full"
        />
      ) : null}
      <p className="text-accent/90 text-[0.6rem] font-semibold tracking-[0.4em] uppercase sm:text-xs">
        {children}
      </p>
    </div>
  );
}
