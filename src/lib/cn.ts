/**
 * Join class names, dropping anything falsy.
 * Deliberately tiny — the project has no classnames dependency and does not need one.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
