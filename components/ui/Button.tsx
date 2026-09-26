"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Readonly<Record<ButtonVariant, string>> = {
  primary:
    "bg-accent text-white shadow-glow hover:bg-accent-strong active:bg-accent-strong",
  secondary:
    "border border-white/12 bg-white/6 text-foreground hover:bg-white/12",
  ghost: "text-muted hover:bg-white/6 hover:text-foreground",
};

/** md/lg stay at or above a comfortable 44px mobile touch target. */
const SIZE_STYLES: Readonly<Record<ButtonSize, string>> = {
  sm: "min-h-9 px-4 text-sm",
  md: "min-h-11 px-5 text-sm sm:px-6 sm:text-base",
  lg: "min-h-12 px-6 text-base sm:px-8 sm:text-lg",
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const isDisabled = Boolean(disabled);
  const interactive = !reduceMotion && !isDisabled;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={cn(
        "font-display inline-flex touch-manipulation items-center justify-center gap-2 rounded-full font-semibold tracking-wide",
        "transition-colors duration-200 select-none",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
