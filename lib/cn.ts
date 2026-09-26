/** Join class names, skipping falsy values. Avoids a clsx dependency. */
export function cn(
  ...classes: ReadonlyArray<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
