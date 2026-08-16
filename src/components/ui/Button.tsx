import React from 'react';
import { cn } from '../../lib/cn';

/**
 * `inverse` exists because a button on a navy ground needs a light surface.
 * It is a real variant rather than a `className` override: passing
 * `bg-white text-navy-ink` alongside the primary variant put `bg-white` and
 * `text-white` in the same cascade layer, and the text won — rendering the
 * label white on a white surface. Variant-owned properties (background, text,
 * border, hover, focus, disabled) must never be set from the outside.
 */
type Variant = 'primary' | 'inverse' | 'secondary' | 'ghost-inverse' | 'quiet' | 'danger';
type Size = 'md' | 'sm';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-navy text-white border-navy hover:bg-navy-deep',
  inverse: 'bg-white text-navy-ink border-white hover:bg-paper hover:border-paper',
  secondary: 'bg-surface text-navy border-navy/40 hover:border-navy hover:bg-navy-tint',
  'ghost-inverse': 'bg-transparent text-white border-white/45 hover:border-white hover:bg-white/10',
  quiet: 'bg-transparent text-ink-muted border-transparent hover:bg-navy-tint hover:text-navy',
  danger: 'bg-surface text-alert border-alert/45 hover:bg-alert-surface',
};

/**
 * On navy grounds the default navy focus ring would disappear, so these two
 * variants ring in white instead.
 *
 * Not a `focus-visible:outline-*` utility, which is what this was and which
 * never took effect: the global `:focus-visible` rule in index.css is
 * unlayered and outranks anything in `@layer utilities`, so both variants
 * carried a white ring in their class list and painted a navy one. The class
 * below is defined unlayered alongside that rule. It sets colour and offset
 * under `:focus-visible` and nothing else, so no variant's resting appearance
 * is affected.
 */
const FOCUS: Partial<Record<Variant, string>> = {
  inverse: 'focus-ring-inverse',
  'ghost-inverse': 'focus-ring-inverse',
};

export const BUTTON_SIZES: Record<Size, string> = {
  /* Both sizes keep a 44px hit area — these pages are used on cheap phones,
     often one-handed. `sm` differs in padding and type size, not in target. */
  md: 'min-h-[2.75rem] px-5 text-body',
  sm: 'min-h-[2.75rem] px-3.5 text-body-s',
};

/**
 * Everything a control is before it has a colour or a transition: the box, the
 * radius, the type, the target, the disabled contract.
 *
 * Exported so a variant built elsewhere — the landing page's flow CTA — is the
 * same physical control as every other button on the site rather than a
 * lookalike that will drift from it. It carries no `transition` of its own, so
 * a caller can state which properties it animates without two
 * `transition-property` utilities landing in the same cascade.
 */
export const BUTTON_SHAPE = cn(
  'inline-flex items-center justify-center gap-2 rounded-control border font-medium',
  'cursor-pointer',
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-none'
);

const SIZES = BUTTON_SIZES;

const BASE = cn(BUTTON_SHAPE, 'transition-colors duration-200');

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}) => (
  <button
    className={cn(BASE, VARIANTS[variant], FOCUS[variant], SIZES[size], fullWidth && 'w-full', className)}
    {...rest}
  >
    {children}
  </button>
);

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/** Same shape for anchors, so an outbound official link matches a button. */
export const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}) => (
  <a
    className={cn(
      BASE,
      'no-underline',
      VARIANTS[variant],
      FOCUS[variant],
      SIZES[size],
      fullWidth && 'w-full',
      className
    )}
    {...rest}
  >
    {children}
  </a>
);
