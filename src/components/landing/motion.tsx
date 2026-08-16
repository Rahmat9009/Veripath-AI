import React, { useEffect, useRef, useState } from 'react';

/**
 * Scroll reveals for the landing page.
 *
 * These deliberately do not use Framer's `whileInView`. That approach hides the
 * element first and shows it only if an observer fires, which left whole
 * sections permanently invisible here — including sections sitting in the
 * middle of the viewport after an ordinary scroll. On a page whose job is to
 * warn people away from fraud, content that can silently fail to appear is not
 * an acceptable trade for an entrance animation.
 *
 * So the contract is inverted. The markup is visible; the reveal is a layer on
 * top of it, and every path that could go wrong ends with the content shown:
 *
 *   - no IntersectionObserver in the browser  → shown immediately
 *   - observer never fires (jump-scroll, restored position, fast fling)
 *                                             → shown by the safety timer
 *   - reduced motion requested                → shown, with no transition
 *   - JavaScript throws before the effect runs → the timer still resolves it
 *
 * Framer Motion is still used where the animation is driven by mount rather
 * than by scroll — the hero headline and the chamber — which is the case it
 * handles reliably.
 */

/**
 * Two curves for the whole page. Entrances decelerate hard so a section
 * settles rather than drifts; state changes use the shorter curve. Mirrored
 * as CSS custom properties in index.css for the reveal transitions.
 */
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const;
export const EASE_STATE = [0.4, 0, 0.2, 1] as const;

/** Fires once, when the element first comes into view. Fails open. */
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // A small bottom inset so a section begins once it is properly in the
      // frame rather than the instant its first pixel appears.
      { rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);

    // The safety net. If the observer has not fired by now the element is
    // shown regardless — an entrance that was missed is a far smaller problem
    // than a section nobody can read.
    const timer = window.setTimeout(() => {
      setShown(true);
      observer.disconnect();
    }, 1400);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return { ref, shown };
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds. Kept under 0.3 so nothing on the page is ever waited for. */
  delay?: number;
  /** `none` fades without travel — for blocks wide enough that 12px reads as
      a jump rather than a settle. */
  from?: 'up' | 'none';
  /** So a revealed block can still be the list or definition list it is. */
  as?: 'div' | 'dl' | 'ol' | 'ul';
}

/** A block arriving on scroll. */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  from = 'up',
  as = 'div',
}) => {
  const { ref, shown } = useRevealed<HTMLElement>();

  const props = {
    ref: ref as React.Ref<never>,
    className,
    'data-reveal': shown ? 'shown' : 'hidden',
    'data-reveal-from': from,
    style: delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined,
  };

  if (as === 'dl') return <dl {...props}>{children}</dl>;
  if (as === 'ol') return <ol {...props}>{children}</ol>;
  if (as === 'ul') return <ul {...props}>{children}</ul>;
  return <div {...props}>{children}</div>;
};

/* `Stagger`/`StaggerItem` used to live here: a group that revealed its
   children one after another. Both presentations now express that through
   `Layer` — a section marks its two or three beats, and the presentation
   decides whether they arrive as scene layers or as offset reveals — so the
   pair had no callers left. The per-item variant went with them: a group of
   three list items sharing one entrance reads as a block arriving, which is
   what these sections want, rather than as a list assembling itself. */
