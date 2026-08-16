import React from 'react';
import { cn } from '../../lib/cn';
import { BarRule } from '../ui';

type Tone = 'paper' | 'vellum' | 'navy';

const GROUND: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  vellum: 'bg-vellum text-ink',
  navy: 'bg-navy-ink text-white',
};

/** Every band opens with a hairline, so the joins between them are drawn
    rather than merely implied by a change of colour. */
const EDGE: Record<Tone, string> = {
  paper: 'border-t border-rule',
  vellum: 'border-t border-rule',
  navy: 'border-t border-white/10',
};

interface BandProps {
  tone: Tone;
  children: React.ReactNode;
  id?: string;
  /** `tight` for sections that work better compressed than expansive. */
  size?: 'default' | 'tight';
  className?: string;
}

/**
 * A full-width tonal band.
 *
 * The landing page is a sequence of these rather than a stack of cards on one
 * ground: the page's structure is carried by tone, and the reader always knows
 * whether they are looking at something under examination (navy) or something
 * they can act on (paper and vellum).
 */
export const Band: React.FC<BandProps> = ({ tone, children, id, size = 'default', className }) => (
  <section
    id={id}
    className={cn(
      'relative',
      GROUND[tone],
      EDGE[tone],
      id && 'scroll-mt-24',
      className
    )}
  >
    {tone === 'navy' && (
      <div aria-hidden="true" className="gate-field pointer-events-none absolute inset-0" />
    )}
    <div
      className={cn(
        'shell relative',
        size === 'tight' ? 'py-14 sm:py-16 lg:py-20' : 'py-16 sm:py-20 lg:py-28'
      )}
    >
      {children}
    </div>
  </section>
);

interface SectionHeadProps {
  kicker: string;
  title: string;
  body?: string;
  /** Set on navy bands, where ink-side colours disappear. */
  onDark?: boolean;
  className?: string;
  /** `lg` for a section that opens a major movement of the page. */
  size?: 'default' | 'lg';
}

/**
 * The opening of a band. One shape, used everywhere, so the page reads as a
 * single document rather than a run of unrelated blocks.
 */
export const SectionHead: React.FC<SectionHeadProps> = ({
  kicker,
  title,
  body,
  onDark,
  className,
  size = 'default',
}) => (
  // The measures live on the children, not here: `cn` is a plain join with no
  // Tailwind conflict resolution, so a `max-w` on the root plus one passed in
  // via `className` would be settled by stylesheet order rather than by intent.
  <div className={className}>
    <div className="flex items-center gap-3">
      <BarRule theme={onDark ? 'dark' : 'light'} />
      <p
        className={cn(
          'font-mono text-label uppercase tracking-[0.14em]',
          onDark ? 'text-white/70' : 'text-navy'
        )}
      >
        {kicker}
      </p>
    </div>
    <h2
      className={cn(
        'mt-4 font-serif font-semibold',
        // A tighter measure on the larger size: the same character count sets
        // far wider at display sizes, and the rag falls apart past ~5 lines.
        size === 'lg' ? 'max-w-[19ch] text-section' : 'max-w-[26ch] text-display-m sm:text-display-l',
        onDark ? 'text-white' : 'text-ink'
      )}
    >
      {title}
    </h2>
    {body && (
      <p
        className={cn(
          'mt-4 max-w-[46ch] text-body-l',
          onDark ? 'text-white/70' : 'text-ink-muted'
        )}
      >
        {body}
      </p>
    )}
  </div>
);
