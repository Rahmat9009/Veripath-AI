import React, { useId, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';
import { EASE_STATE } from '../landing/motion';
import { HeroCheck, OUTCOME } from './checks';

interface CheckTablistProps {
  checks: HeroCheck[];
  index: number;
  onChange: (index: number) => void;
  /** Raised while any check holds focus, so the sequence stops advancing. */
  onFocusChange: (focused: boolean) => void;
  label: string;
  panelId: string;
  className?: string;
}

/**
 * The five checks, as a rail rather than a panel.
 *
 * This was a tall bordered block of uprights sitting beside the instrument,
 * and at that size it read as a second subject — a small dashboard competing
 * with the object for the first viewport. It is now a single ruled line: each
 * check is a segment of that line, and the rule above each segment carries the
 * progress that the uprights used to.
 *
 * Outcome colour appears only on the icon beside each name, always paired with
 * a shape, so the summary still survives being read without colour.
 */
export const CheckTablist: React.FC<CheckTablistProps> = ({
  checks,
  index,
  onChange,
  onFocusChange,
  label,
  panelId,
  className,
}) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion();
  // Scoped to this rail. A page holding two of them would otherwise have one
  // rule trying to glide between both.
  const ruleId = useId();

  const focusCheck = (next: number) => {
    const wrapped = (next + checks.length) % checks.length;
    onChange(wrapped);
    refs.current[wrapped]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, position: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusCheck(position + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusCheck(position - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusCheck(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusCheck(checks.length - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('grid grid-cols-5 gap-x-2 sm:gap-x-4', className)}
    >
      {checks.map((item, position) => {
        const selected = position === index;
        const reached = position <= index;
        const ItemIcon = OUTCOME[item.outcome].icon;

        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[position] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(position)}
            onKeyDown={(event) => onKeyDown(event, position)}
            // Bound per check rather than delegated to the wrapper: focus
            // delegation proved unreliable here, and a reader must never have
            // the sequence move under them.
            onFocus={() => onFocusChange(true)}
            onBlur={(event) => {
              const next = event.relatedTarget as HTMLElement | null;
              if (!next || !next.closest('[role="tablist"]')) onFocusChange(false);
            }}
            // The rule above each segment *is* the progress indicator, so the
            // rail keeps its full height whether or not a check has been
            // reached — nothing below it moves as the sequence advances.
            className={cn(
              'group relative flex min-h-[2.75rem] min-w-0 flex-col items-start gap-1.5 border-t-2 pt-2.5 text-left transition-colors',
              'focus-ring-inverse',
              reached ? 'border-white/45' : 'border-white/15 group-hover:border-white/30'
            )}
          >
            {/* The selected rule, and the only green on the rail.
                One element shared across the five segments rather than a
                colour swapped on each, so changing check moves the rule to
                the new segment instead of extinguishing it in one place and
                lighting it in another. `-top-0.5` puts it exactly over the
                2px border it replaces — the segment's own border stays
                underneath at the `reached` weight, so if this never renders
                the rail still reads as a progressed sequence.

                Selection does not depend on it either way: the label turns
                white, the outcome icon is beside it, and `aria-selected` is
                on the control itself. */}
            {selected && (
              <motion.span
                layoutId={ruleId}
                aria-hidden="true"
                className="absolute -top-0.5 left-0 right-0 h-0.5 bg-brand-green"
                transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE_STATE }}
              />
            )}

            {/* Allowed to wrap: at 320px "GUARANTEE" is wider than the fifth
                it gets, and the Bengali labels are longer still. */}
            <span
              className={cn(
                'w-full break-words font-mono text-[0.625rem] uppercase leading-[1.15] tracking-[0.04em] transition-colors sm:text-label sm:tracking-[0.06em]',
                selected ? 'text-white' : 'text-white/55 group-hover:text-white/80'
              )}
            >
              {item.name}
            </span>

            <ItemIcon
              className={cn('h-3 w-3 shrink-0', OUTCOME[item.outcome].dot)}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
};
