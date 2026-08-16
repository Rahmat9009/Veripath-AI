import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { BUTTON_SHAPE, BUTTON_SIZES } from '../ui/Button';

interface FlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Passed as a string rather than as children: the label is the thing that
      travels, so it needs to be the sole occupant of its own element. */
  label: string;
}

/**
 * The landing page's leading call to action, and only the landing page's.
 *
 * It is the same control as every other button on the site — `BUTTON_SHAPE`
 * and `BUTTON_SIZES` are the primitive's own, so the box, radius, type and
 * 44px target are shared and cannot drift. What is added here is a state
 * transition: the navy fills through the control from the leading edge, the
 * label steps aside, and the arrow that was resting at the end is replaced by
 * one arriving at the start.
 *
 * Deliberately not a `Button` variant. The inner routes use that primitive
 * everywhere and none of them should acquire this behaviour, so the behaviour
 * lives in the landing folder where it is used, not in the shared one where it
 * would be one prop away from leaking into the auditor.
 *
 * Three properties change and they are all cheap: `transform` on the fill and
 * on the two arrows, `color` on the label, `transform` on the control for the
 * press. No shadow, no filter, no layout property, nothing that resizes.
 *
 * Colour is the existing inverse pair and nothing new: white on navy-ink at
 * rest, navy-ink under white once filled. The fill is clipped by the control's
 * own `overflow-hidden`, so the radius is preserved and the shape never
 * changes — the control does not morph, it changes state.
 */
export const FlowButton: React.FC<FlowButtonProps> = ({ label, className, ...rest }) => (
  <button
    className={cn(
      BUTTON_SHAPE,
      BUTTON_SIZES.md,
      // `isolate` so the fill's negative z-index stays inside this control:
      // without it the fill would slide behind the band, not behind the label.
      'focus-ring-inverse group relative isolate overflow-hidden',
      'border-white bg-white text-navy-ink',
      'hover:text-white focus-visible:text-white',
      // The press. 0.97 and back, on the same curve as every other state
      // change on the page — felt as the control taking the click, not seen
      // as the control bouncing.
      //
      // `scale` and `translate` are named alongside `transform` in every
      // transition list in this file. Tailwind v4 compiles `scale-*` and
      // `translate-*` to the individual CSS properties rather than to a
      // `transform` function, so a list naming only `transform` transitions
      // nothing and the movement lands in a single frame. The `transition-*`
      // shorthands already cover all four; only these arbitrary lists have to
      // say so themselves.
      'transition-[color,transform,scale] duration-300 ease-[var(--ease-state)]',
      'active:scale-[0.97]',
      // The white ring comes from `focus-ring-inverse` above — the same class
      // the shared Button's navy-ground variants use, defined unlayered in
      // index.css because the utility form of it loses the cascade. The ring
      // is not optional and does not depend on motion running; the fill and
      // the arrows below are the part keyboard users may or may not see move.
      className
    )}
    {...rest}
  >
    {/* The fill. Scaled rather than sized, so it costs one compositor
        property and never touches layout. */}
    <span
      aria-hidden="true"
      className={cn(
        'absolute inset-0 -z-10 origin-left scale-x-0 bg-navy-ink',
        'transition-transform duration-[480ms] ease-[var(--ease-entrance)]',
        'group-hover:scale-x-100 group-focus-visible:scale-x-100'
      )}
    />

    <span className="relative flex items-center">
      {/* The arriving arrow, parked just outside the label in the control's
          own padding — `right-full` plus the 4px gap is exactly the 20px of
          padding it has to sit in, so it enters from the edge without ever
          widening the control or colliding with the label. */}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          'absolute right-full mr-1 h-4 w-4 opacity-0',
          'transition-[transform,translate,opacity] duration-[460ms] ease-[var(--ease-entrance)]',
          'motion-safe:-translate-x-2 motion-safe:group-hover:translate-x-0',
          'motion-safe:group-focus-visible:translate-x-0',
          'group-hover:opacity-100 group-focus-visible:opacity-100'
        )}
      />

      {/* 8px. Enough to read as the label making room, short of the distance
          at which it reads as the label sliding. */}
      <span
        className={cn(
          'transition-transform duration-[460ms] ease-[var(--ease-entrance)]',
          'motion-safe:group-hover:translate-x-2 motion-safe:group-focus-visible:translate-x-2'
        )}
      >
        {label}
      </span>

      {/* The resting arrow, leaving. */}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          'ml-2 h-4 w-4',
          'transition-[transform,translate,opacity] duration-[460ms] ease-[var(--ease-entrance)]',
          'motion-safe:group-hover:translate-x-2.5 motion-safe:group-focus-visible:translate-x-2.5',
          'group-hover:opacity-0 group-focus-visible:opacity-0'
        )}
      />
    </span>
  </button>
);
