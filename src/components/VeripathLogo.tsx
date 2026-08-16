import React from 'react';
import markSrc from '../assets/brand/veripath-mark-120.webp';
import lockupSrc from '../assets/brand/veripath-lockup-192.webp';

interface VeripathLogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  /** Accepted for API compatibility. The supplied artwork is fixed, so the
      logo is never recoloured for dark grounds. */
  theme?: 'light' | 'dark';
}

/**
 * The approved VeriPath AI logo, rendered from the supplied artwork.
 *
 * Nothing here redraws, recolours or reproportions the mark. The source file
 * is a 2048×2048 PNG in which the artwork occupies a smaller region centred in
 * transparent padding. Each lockup used to be produced by *cropping* to a
 * region of that exact image with CSS — correct pixels, but it meant fetching
 * all 1.04MB of the original to paint a 40px mark in the masthead, on every
 * page, of a product whose own copy is about metered connections and cheap
 * phones. It was the largest single download on the site, larger than the
 * whole JavaScript bundle.
 *
 * The crops are now taken once, ahead of time, from those same pixels: the
 * measured regions below were cut out of the untouched original and saved as
 * lossless WebP at three times the largest size either lockup is rendered at.
 * Nothing is resampled on the way in, the two files come to 31KB together,
 * and the original file is unchanged and still in the repository.
 *
 * Rendering at a third of the stored size also means the mark stays sharp on
 * 2x and 3x displays, which the CSS crop only managed by virtue of being
 * enormous.
 */

/** Measured from the supplied file: the opaque bounds of each lockup. */
const CROPS = {
  /** Shield, wordmark and tagline — everything above the transparent margin. */
  full: { w: 1188, h: 1096, src: lockupSrc },
  /** The shield alone, for places too small to read a wordmark. */
  mark: { w: 646, h: 797, src: markSrc },
} as const;

/** Rendered height of the lockup, in pixels. */
const HEIGHTS: Record<NonNullable<VeripathLogoProps['size']>, number> = {
  xs: 26,
  sm: 32,
  md: 40,
  lg: 64,
  xl: 88,
  hero: 132,
};

export const VeripathLogo: React.FC<VeripathLogoProps> = ({
  className = '',
  variant = 'vertical',
  size = 'md',
  showText = true,
  theme,
}) => {
  // Without room for the wordmark, show the shield rather than shrink the
  // whole lockup until the name is unreadable.
  const crop = variant === 'mark' || !showText ? CROPS.mark : CROPS.full;
  const height = HEIGHTS[size];
  // The aspect ratio is the artwork's own, so the rendered box is identical to
  // what the CSS crop produced at every size.
  const width = Math.round((crop.w / crop.h) * height);

  return (
    <span className={`block shrink-0 ${className}`} data-theme={theme}>
      <img
        src={crop.src}
        alt="VeriPath AI"
        width={width}
        height={height}
        decoding="async"
        style={{ width, height, display: 'block' }}
      />
    </span>
  );
};
