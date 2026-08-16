import { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * The hero's motion: the breath, and the response to the pointer.
 *
 * Scroll is no longer here. The hero is scene one of the scroll story now, and
 * the story owns every scroll-linked transform on the page — including the
 * hero's exit. What is left is the part scroll cannot do: an object that
 * breathes, and a stage whose light answers where the reader is looking.
 *
 * Two rules decide the numbers below:
 *
 *   1. the planes must move by different amounts, or there is no depth — only
 *      a picture sliding around
 *   2. the light must move furthest and arrive last, because that is what
 *      reads as an environment responding rather than an object being dragged
 */

/**
 * Maximum travel per plane, in pixels, at full deflection to an edge of the
 * stage.
 *
 * These are roughly double what they were. The previous values were set
 * against the whole hero section — most of which sat below the fold — so a
 * pointer crossing the visible composition never got near full deflection and
 * the object moved about three pixels in practice. Measured, that was a 0.7px
 * response to a thousand pixels of mouse travel: correct in the DevTools
 * panel, invisible on the screen. The reference box is now the stage itself,
 * which is exactly what the reader can see, and the travel is set to be
 * noticeable when looked for and unremarkable when not.
 */
const TRAVEL = {
  objectX: 9,
  objectY: 7,
  bloomX: 24,
  bloomY: 20,
  nearX: 16,
  nearY: 13,
  backX: 4,
  backY: 3,
};

/**
 * Structure follows the cursor closely; light lags well behind it.
 *
 * The difference between these two is the effect. One spring for everything
 * moves the whole stage as a single sheet, which is precisely the flat result
 * this is meant to avoid.
 */
const SPRING_NEAR = { stiffness: 110, damping: 22, mass: 0.5 };
const SPRING_LIGHT = { stiffness: 38, damping: 17, mass: 1 };

/** One full breath. Long enough that it is felt rather than watched. */
const FLOAT_SECONDS = 14;
const FLOAT_PX = 10;

export function useHeroMotion(scopeRef: RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion();

  // Whether a mouse exists is a question about the pointer, not about how wide
  // the window is. The old condition also demanded 1280px, which silently
  // switched the whole effect off on every laptop between 1024 and 1279 — the
  // most common desktop widths there are. The width test that remains is only
  // about room: below 1024 the composition is a single column in normal flow,
  // where nudging a card reads as a layout fault rather than as depth.
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const wideEnough = useMediaQuery('(min-width: 1024px)');
  const pointerOn = finePointer && wideEnough && !reduceMotion;
  const floatOn = !reduceMotion;

  // Normalised pointer position, -1 to 1 from the centre of the stage.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Radial distance from the centre, 0 at the middle and 1 at a corner.
  const pr = useMotionValue(0);

  const nx = useSpring(px, SPRING_NEAR);
  const ny = useSpring(py, SPRING_NEAR);
  const lx = useSpring(px, SPRING_LIGHT);
  const ly = useSpring(py, SPRING_LIGHT);
  const nr = useSpring(pr, SPRING_NEAR);

  // Written out rather than produced by a helper: each of these is a hook
  // call, and hiding hook calls inside a function that merely looks like a
  // utility is how hook-order bugs get written.
  const objectX = useTransform(nx, (v) => v * TRAVEL.objectX);
  const objectY = useTransform(ny, (v) => v * TRAVEL.objectY);
  // Depth without rotation. The asset is a single-angle render, so turning it
  // would only prove there is no other side; a fraction of a percent of scale
  // as the pointer nears it reads as the object leaning into the room instead.
  const objectScale = useTransform(nr, (v) => 1 + (1 - v) * 0.008);
  const bloomX = useTransform(lx, (v) => v * TRAVEL.bloomX);
  const bloomY = useTransform(ly, (v) => v * TRAVEL.bloomY);
  const nearX = useTransform(nx, (v) => v * TRAVEL.nearX);
  const nearY = useTransform(ny, (v) => v * TRAVEL.nearY);
  const backX = useTransform(nx, (v) => v * TRAVEL.backX);
  const backY = useTransform(ny, (v) => v * TRAVEL.backY);

  const onPointerMove = (event: ReactPointerEvent) => {
    if (!pointerOn || event.pointerType !== 'mouse') return;
    const box = scopeRef.current?.getBoundingClientRect();
    if (!box || !box.width || !box.height) return;
    // Clamped, so a pointer entering from outside the box cannot push a plane
    // past its stated maximum travel.
    const x = Math.max(-1, Math.min(1, (event.clientX - (box.left + box.width / 2)) / (box.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - (box.top + box.height / 2)) / (box.height / 2)));
    px.set(x);
    py.set(y);
    pr.set(Math.min(1, Math.hypot(x, y)));
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
    pr.set(0);
  };

  return {
    pointerOn,
    /** Spread onto the element the coordinates are measured against. */
    pointerProps: { onPointerMove, onPointerLeave },
    objectPointerStyle: pointerOn ? { x: objectX, y: objectY, scale: objectScale } : undefined,
    bloomStyle: pointerOn ? { x: bloomX, y: bloomY } : undefined,
    nearStyle: pointerOn ? { x: nearX, y: nearY } : undefined,
    backStyle: pointerOn ? { x: backX, y: backY } : undefined,
    float: floatOn
      ? {
          animate: { y: [0, -FLOAT_PX, 0] },
          transition: { duration: FLOAT_SECONDS, repeat: Infinity, ease: 'easeInOut' as const },
        }
      : { animate: { y: 0 }, transition: { duration: 0 } },
  };
}
