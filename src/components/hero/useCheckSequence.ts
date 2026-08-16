import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/** How long each check is shown before the sequence moves on. */
export const ADVANCE_MS = 3400;

interface Options {
  count: number;
  active: number;
  onChange: (index: number) => void;
}

/**
 * The hero's self-advancing check sequence.
 *
 * Hover and focus are tracked separately and OR'd together rather than sharing
 * one flag: a mouseleave fired during a layout shift could otherwise cancel a
 * pause that keyboard focus had set, and the sequence would move under a
 * reader mid-sentence.
 *
 * With reduced motion there is no timer at all — the sequence holds wherever
 * it is and the reader drives it themselves.
 */
export function useCheckSequence({ count, active, onChange }: Options) {
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const paused = hovering || focusWithin;

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setTimeout(() => onChange((active + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion, count, onChange]);

  return {
    paused,
    setFocusWithin,
    /** Spread onto whatever wraps the object and its cards. */
    hoverProps: {
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    },
  };
}
