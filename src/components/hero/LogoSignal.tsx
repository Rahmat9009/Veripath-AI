import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../lib/cn';

interface LogoSignalProps {
  /** Index of the check currently being shown, 0-based. */
  active: number;
  /** Total checks in the sequence. */
  total: number;
  className?: string;
}

/**
 * The five-bar mark, used as a verification signal.
 *
 * This is the *motif* — the mark's silhouette and colour pattern — not the
 * logo asset. The supplied logo is a flat PNG and cannot illuminate bar by
 * bar, which is the behaviour this element needs. `VeripathLogo.tsx` and the
 * logo files are untouched, and the navbar logo is unaffected.
 *
 * Bars light as checks are reached and then stay lit: once the sequence has
 * been through all five, the signal holds its finished state instead of
 * flashing back to empty every time the demo loops.
 */

/** Heights relative to the tallest bar, taken from the mark's proportions. */
const BAR_SCALE = [0.52, 0.74, 1, 0.74, 0.52];

/**
 * Lit colours follow the mark's pattern — bars 2 and 3 green, the rest navy.
 * The navy is lightened to the same tint the BarRule already uses on dark
 * grounds, because #153C6D on #0B2039 is invisible.
 */
const LIT = ['#7FA3D1', '#00C853', '#00C853', '#7FA3D1', '#7FA3D1'];

export const LogoSignal: React.FC<LogoSignalProps> = ({ active, total, className }) => {
  const reduceMotion = useReducedMotion();
  const [reached, setReached] = useState(0);

  // High-water mark: a bar never goes dark again once its check has been seen.
  useEffect(() => {
    setReached((current) => Math.max(current, active));
  }, [active]);

  // With reduced motion there is no sequence to follow, so show the resolved
  // state immediately rather than an empty signal that never fills.
  const litThrough = reduceMotion ? total - 1 : reached;

  return (
    <span className={cn('inline-flex items-end gap-[3px]', className)} aria-hidden="true">
      {BAR_SCALE.map((scale, index) => {
        const lit = index <= litThrough;
        return (
          <span
            key={index}
            className="block w-[4px] rounded-full transition-colors duration-500 ease-out"
            style={{
              height: `${Math.round(scale * 28)}px`,
              backgroundColor: lit ? LIT[index] : 'rgba(255,255,255,0.22)',
              opacity: lit ? 1 : 0.7,
            }}
          />
        );
      })}
    </span>
  );
};
