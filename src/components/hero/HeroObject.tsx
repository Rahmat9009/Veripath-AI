import React from 'react';
import { cn } from '../../lib/cn';
import obj400 from '../../../media/veripath-3d-object-400.webp';
import obj640 from '../../../media/veripath-3d-object-640.webp';
import obj900 from '../../../media/veripath-3d-object-900.webp';
import obj1205 from '../../../media/veripath-3d-object-1205.webp';
import objFallback from '../../../media/veripath-3d-object.png.png';

/** Intrinsic size of the supplied artwork, for the aspect box. */
const NATURAL_W = 1205;
const NATURAL_H = 1305;

interface HeroObjectProps {
  className?: string;
}

/**
 * The VeriPath instrument — the hero's one dimensional object.
 *
 * The shield holds five illuminated uprights in the mark's own rhythm: one
 * tall centre, two mid, two short. `BarRule`, `LogoSignal` and the check
 * uprights are flat abstractions of this shape, so the object is not a
 * decoration added to the page — it is the page's structural motif at full
 * size.
 *
 * The supplied PNG is 1.2MB, which is real money on a metered connection in
 * the places this product is used. WebP derivatives sit beside it at four
 * widths and the browser takes the smallest one that fits; the original is
 * untouched and serves as the fallback for anything that cannot read WebP.
 *
 * Marked decorative. Everything it communicates is already carried in words by
 * the headline beside it, and a screen reader gains nothing from a description
 * of a rendered shield.
 */
export const HeroObject: React.FC<HeroObjectProps> = ({ className }) => (
  // `picture` is inline by default, so a percentage height on the image inside
  // it resolves against an auto-height box and collapses. It has to become a
  // block that fills the stage before `h-full` on the image means anything.
  <picture className={cn('block h-full w-full', className)}>
    <source
      type="image/webp"
      srcSet={`${obj400} 400w, ${obj640} 640w, ${obj900} 900w, ${obj1205} 1205w`}
      // These describe the width the artwork is actually *painted* at, which
      // is narrower than the box holding it: `object-contain` inside a
      // height-capped stage is constrained by height, so the image ends up
      // about 0.92 of the stage height rather than its full width. Quoting the
      // box width instead pulled the 900w file down on a 1440px screen where
      // the object paints at 427px, for 34KB of nothing.
      sizes="(min-width: 1280px) 600px, (min-width: 1024px) 380px, (min-width: 640px) 300px, 62vw"
    />
    <img
      src={objFallback}
      alt=""
      aria-hidden="true"
      width={NATURAL_W}
      height={NATURAL_H}
      decoding="async"
      // The largest thing above the fold, so it is fetched at high priority
      // rather than queued behind the fonts.
      fetchPriority="high"
      className="hero-object block h-full w-full object-contain"
    />
  </picture>
);
