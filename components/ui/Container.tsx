import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Horizontal rhythm of the whole experience. */
export type ContainerSize = "narrow" | "default" | "wide";

const SIZE_STYLES: Readonly<Record<ContainerSize, string>> = {
  narrow: "max-w-xl",
  default: "max-w-3xl",
  wide: "max-w-5xl",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
  /** Removes the mobile gutters for edge-to-edge content. */
  bleed?: boolean;
}

/**
 * Centres content and applies the shared gutter scale. Every stage should sit
 * inside one of these so spacing stays consistent across screens.
 */
export function Container({
  children,
  size = "default",
  bleed = false,
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        !bleed && "px-5 sm:px-8",
        SIZE_STYLES[size],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
