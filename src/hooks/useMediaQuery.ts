import { useEffect, useState } from 'react';

/**
 * A media query as a boolean, read synchronously on the first render.
 *
 * The initial read matters more than it looks. These queries decide which
 * presentation the landing page mounts — the scroll story or the stacked
 * bands — and a hook that starts `false` and corrects itself in an effect
 * would mount the wrong one first, then tear the whole page down and rebuild
 * it a frame later. That is a visible flash and, worse, it throws away any
 * state the first tree had already built.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return matches;
}
