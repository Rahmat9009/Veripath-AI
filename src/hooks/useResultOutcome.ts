import { RefObject, useEffect, useRef } from 'react';

/**
 * Brings the reader to the answer once a request has finished, whichever way
 * it went.
 *
 * Both tools put their answer in a second column. On a wide screen that column
 * is beside the form and the change is visible; on a phone it is below a form
 * long enough that the result lands off-screen, so pressing the button
 * appeared to do nothing at all.
 *
 * This handles the eye. The ear is handled by the caller, which renders a
 * sentence into a polite live region — a screen-reader user was told the
 * request had started, because `SkeletonRecord` announces itself, and then
 * never told it had finished.
 *
 * The scroll only happens when the result is not already in view, so nothing
 * moves under a reader on a desktop where the answer was already beside them.
 *
 * Focus is deliberately not moved. The outcome arrives seconds after the
 * button was pressed, by which time the reader may have gone back to the form,
 * and pulling focus off a control someone is using is worse than the problem
 * this solves. The live region carries the news; the scroll carries the eye.
 */
export function useResultOutcome(ref: RefObject<HTMLElement | null>, settled: boolean) {
  // Distinguishes "a result arrived" from "this mounted with a result already
  // on it", so arriving at the page does not jump.
  const settledBefore = useRef(settled);

  useEffect(() => {
    const wasSettled = settledBefore.current;
    settledBefore.current = settled;
    if (!settled || wasSettled) return;

    const el = ref.current;
    if (!el) return;

    const box = el.getBoundingClientRect();
    const offScreen = box.top > window.innerHeight * 0.85 || box.bottom < 0;
    // `behavior: 'auto'` rather than 'smooth': this is a jump to something the
    // reader asked for, and a long animated scroll back past a form they have
    // just filled in is motion nobody requested.
    if (offScreen) el.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [settled, ref]);
}
