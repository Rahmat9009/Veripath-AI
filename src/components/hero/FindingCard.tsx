import React from 'react';
import { motion, useReducedMotion, type MotionStyle } from 'motion/react';
import { Language } from '../../types';
import { useT } from '../../i18n/strings';
import { cn } from '../../lib/cn';
import { EASE_STATE } from '../landing/motion';
import { HeroCheck, OUTCOME, outcomeLabel } from './checks';

interface FindingCardProps {
  check: HeroCheck;
  lang: Language;
  id: string;
  /** Pointer parallax for this card's depth plane. */
  planeStyle?: MotionStyle;
  className?: string;
}

/**
 * What the selected check found.
 *
 * The panel holds a floor height. Findings differ in length and the five of
 * them cycle on their own, so without one the card would resize under a reader
 * every few seconds — and on desktop it floats over the object, where a
 * changing height would drag the composition with it.
 *
 * Nothing here is ever phrased as a result. The outcome labels are the six
 * approved ones and no other wording is used.
 */
export const FindingCard: React.FC<FindingCardProps> = ({
  check,
  lang,
  id,
  planeStyle,
  className,
}) => {
  const t = useT(lang);
  const reduceMotion = useReducedMotion();
  const style = OUTCOME[check.outcome];
  const OutcomeIcon = style.icon;

  // The sequence changes this card's contents every 3.4 seconds, so the
  // entrance starts part-way up rather than from nothing. Fading in from zero
  // left the card empty inside its own border for the length of the fade,
  // which on a card this size reads as a rendering fault rather than as a
  // transition. Beginning at 0.45 dips it instead of blanking it.
  const enter = reduceMotion
    ? {}
    : {
        initial: { opacity: 0.45, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: EASE_STATE },
      };

  return (
    <motion.div
      id={id}
      role="tabpanel"
      aria-live="polite"
      style={planeStyle}
      // Smaller and tighter than it was. At its old width it covered a third
      // of the instrument; the object is the subject of this viewport and the
      // card is a note pinned to its edge.
      className={cn(
        'min-h-[10rem] rounded-record border border-white/12 bg-navy-deep/92 p-3.5 shadow-lift backdrop-blur-[2px]',
        className
      )}
    >
      <motion.div key={check.id} {...enter}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-2.5 py-1',
              'font-mono text-label uppercase tracking-[0.06em]',
              style.chip
            )}
          >
            <OutcomeIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {outcomeLabel(t, check.outcome)}
          </span>
          <span className="font-mono text-label uppercase tracking-[0.08em] text-white/55">
            {check.name}
          </span>
        </div>

        <p className="mt-2.5 text-body-s leading-snug text-white">{check.finding}</p>

        {/* Two of the five checks are about something the message never says.
            Saying so is more useful than leaving a blank. */}
        {check.anchor === null && (
          <p className="mt-2 text-body-s leading-snug text-white/55">{t.home.lineNoAnchor}</p>
        )}

        {/* The per-check "what was compared" line used to sit here. At this
            card's width it ran three lines and made the card taller than the
            reduction it was supposed to deliver, so the evidence moved to the
            block below the fold, where it is stated once for all five checks
            and can actually be read. Nothing was dropped — see `sampleChecked`
            in the hero's closing block, and the full chain one band down. */}
      </motion.div>
    </motion.div>
  );
};
