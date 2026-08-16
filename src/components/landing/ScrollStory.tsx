import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { cn } from '../../lib/cn';
import { BarRule } from '../ui';
import { Reveal } from './motion';

/**
 * The landing page as one stage.
 *
 * The middle of the page is a single sticky viewport that scenes pass through,
 * rather than a stack of sections the reader scrolls past. The header sits
 * above it and the footer below it, both in ordinary flow.
 *
 * Nothing here touches the scroll itself. There is no wheel handler, no
 * `scrollTo`, no hijack: the track below is a real element with a real height,
 * `position: sticky` pins the stage while that height passes under it, and
 * `useScroll` reads how far through it the reader is. Momentum, keyboard
 * scrolling, find-in-page, scrollbar dragging and the browser's own scroll
 * restoration all behave exactly as they would on any other page — which is
 * the whole reason for doing it this way.
 *
 * The stage is only mounted on a wide screen with motion allowed. `Home` picks
 * the presentation; under reduced motion or on a phone the same scenes are
 * mounted as ordinary stacked bands, and this file is never involved.
 */

export type Tone = 'paper' | 'vellum' | 'navy';

/** The stage's ground per tone, matching the band tokens exactly. */
const TONE_BG: Record<Tone, string> = {
  paper: '#f6f6f3',
  vellum: '#edece6',
  navy: '#0b2039',
};

export interface StoryScene {
  id: string;
  tone: Tone;
  /**
   * How long this scene holds, relative to the others. 1 is one base unit of
   * `--scene-scroll`; the track is the sum of every weight.
   *
   * These are authored pacing values and they live with the scenes in `Home`,
   * not in here. A scene's length is a judgement about how much there is to
   * read, which is an editorial decision about that scene — not a constant
   * belonging to the animation system.
   */
  weight?: number;
  /** `stage` for the hero, which needs the wide instrument container. */
  container?: 'shell' | 'stage';
  /** An `id` to place at this scene's scroll offset, for in-page links. */
  anchor?: string;
  /** Painted on this scene's own ground, behind its content. */
  backdrop?: React.ReactNode;
  render: (ctx: SceneContext) => React.ReactNode;
}

export interface SceneContext {
  /** 0 → 1 across this scene's own share of the track. */
  local: MotionValue<number>;
  /** True while this is the scene the reader is on. */
  active: boolean;
}

/**
 * The handoff between two scenes.
 *
 * The first version of this fired them in sequence: a scene finished fading
 * out exactly where the next began fading in, so the two curves crossed at
 * zero. Measured across the track, that put a 150–180px hole at all eleven
 * boundaries where nothing on the stage was more than half visible — a fifth
 * of the whole story spent looking at an empty ground.
 *
 * So the ranges now overlap, and they are shaped rather than linear. Each
 * scene's fade covers 11% of its span, and adjacent fades share 6% of it:
 *
 *   ├──────── scene i hold ────────┤ 8% ╬ 3% ┤
 *                            ┤ 3% ╬ 8% ├──────── scene i+1 hold ────────┤
 *                                 ↑ the boundary
 *
 * The outgoing scene is already fading and lifting before the incoming one
 * starts to resolve, which is what makes it read as a handoff rather than as
 * two slides dissolved together.
 *
 * Linear fades over an overlap this short would still cross near 0.25 — a hole
 * again, just a narrower one. Cubic shaping holds the outgoing scene high and
 * brings the incoming one up fast, so the two cross at about 0.62: never an
 * empty stage, and never two scenes readable at once either, since 0.62 with
 * a 34px displacement is plainly a scene in motion rather than one to read.
 */
const FADE = 0.11;
const OVERLAP = 0.06;

/** Held high, then dropped late. The outgoing half of the handoff. */
const easeOutgoing = (t: number) => 1 - t * t * t;
/** Up fast, then settled. The incoming half. */
const easeIncoming = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);

/** Travel for the scene as a whole. Small: the handoff does the work. */
const ENTER_Y = 34;
const EXIT_Y = -34;

const SceneCtx = createContext<SceneContext | null>(null);

/**
 * The scene this component is inside, or `null` when it is not in the story at
 * all — which is the case for every one of these components in stacked mode.
 * Callers must cope with `null` without changing how many hooks they call.
 */
export const useSceneContext = () => useContext(SceneCtx);

interface LayerProps {
  children: React.ReactNode;
  className?: string;
  /** Position in the section's arrival order. 0 arrives first. */
  index?: number;
  as?: 'div' | 'dl' | 'ol' | 'ul';
}

/**
 * One beat within a section — a heading, then the panel it describes, then the
 * evidence line under it.
 *
 * The same mark means two things, because the same section is presented two
 * ways. Inside the story it is a scene layer: driven by the scene's active
 * state through a data attribute, so it is one CSS transition per beat rather
 * than a MotionValue per element on every frame. Outside the story there is no
 * scene above it, and it becomes an ordinary scroll reveal — the entrance the
 * stacked page has always used, and the one a phone still gets.
 *
 * That is the point of routing both through here: a section component states
 * where its beats are once, and neither presentation has to know about the
 * other.
 */
export const Layer: React.FC<LayerProps> = ({ children, className, index = 0, as = 'div' }) => {
  const scene = useContext(SceneCtx);

  if (!scene) {
    return (
      <Reveal as={as} className={className} delay={index * 0.08}>
        {children}
      </Reveal>
    );
  }

  const props = {
    className,
    'data-layer': '',
    style: { '--layer': index } as React.CSSProperties,
  };

  if (as === 'dl') return <dl {...props}>{children}</dl>;
  if (as === 'ol') return <ol {...props}>{children}</ol>;
  if (as === 'ul') return <ul {...props}>{children}</ul>;
  return <div {...props}>{children}</div>;
};

interface SceneLayerProps {
  scene: StoryScene;
  /** This scene's share of the track, as progress values. */
  start: number;
  end: number;
  first: boolean;
  last: boolean;
  progress: MotionValue<number>;
  active: boolean;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const SceneLayer: React.FC<SceneLayerProps> = ({
  scene,
  start,
  end,
  first,
  last,
  progress,
  active,
}) => {
  const span = end - start;
  // Both fades reach past this scene's own share of the track, by half the
  // overlap at each end. That is what makes them cross rather than queue.
  const lead = (OVERLAP / 2) * span;
  const enterFrom = start - lead;
  const enterTo = enterFrom + FADE * span;
  const exitTo = end + lead;
  const exitFrom = exitTo - FADE * span;

  /** How far through the entrance, and the exit, this progress value is. */
  const entering = (v: number) => clamp01((v - enterFrom) / (enterTo - enterFrom));
  const leaving = (v: number) => clamp01((v - exitFrom) / (exitTo - exitFrom));

  // The first scene is already on screen when the page loads, and the last one
  // has to still be there when the stage releases and the footer arrives, so
  // neither gets the transition on that side.

  /** 0 before the scene, 1 through its hold, 0 after it. */
  const shape = (v: number) => {
    if (!first && v < enterTo) return easeIncoming(entering(v));
    if (v < exitFrom) return 1;
    return last ? 1 : easeOutgoing(leaving(v));
  };

  /**
   * The ground arrives in half the time its content does, and leaves in the
   * second half of the exit.
   *
   * This is what stops the handoff reading as two slides dissolved together.
   * With ground and content on one curve, both scenes' type sat at about 60%
   * over each other and the two headlines were legible at the same time —
   * measured and plainly visible in a capture at the boundary. Running the
   * ground ahead means the incoming scene's colour is already around 90%
   * opaque as the two cross, so it covers the outgoing scene rather than
   * blending with it, and the only text resolving on that ground is the new
   * scene's. The stage is never empty, because a ground is always opaque, and
   * the outgoing scene is never competing, because it is behind one.
   */
  // Four tenths of the fade, not half: at half, the incoming ground reached
  // about 90% as the scenes crossed and the outgoing headline still read as a
  // ghost through the remaining tenth — dark serif on light vellum keeps
  // enough contrast to be legible at 10%. At four tenths it is around 97% and
  // the old scene is simply gone.
  const groundRamp = FADE * span * 0.4;
  const groundShape = (v: number) => {
    if (!first && v < enterFrom + groundRamp) {
      return easeIncoming(clamp01((v - enterFrom) / groundRamp));
    }
    if (v < exitTo - groundRamp) return 1;
    return last ? 1 : easeOutgoing(clamp01((v - (exitTo - groundRamp)) / groundRamp));
  };

  // Written as functions of progress rather than as input/output ranges, and
  // that is not a style choice.
  //
  // Given a plain range, this version of `motion` compiles the transform into
  // a native scroll-driven WAAPI animation. That animation is measured against
  // the browser's own timeline rather than against this story's offsets, so it
  // disagreed with the value the JS path was computing — and because a WAAPI
  // animation outranks an inline style, the disagreement won. Scene one sat at
  // 40% opacity over every scene that followed it, ghosting the instrument and
  // the headline across the whole page, while `transform` on the same element
  // tracked correctly. A transform expressed as a function cannot be reduced
  // to keyframes, so both properties are computed in one place from one value.
  const opacity = useTransform(progress, shape);
  const groundOpacity = useTransform(progress, groundShape);
  // The travel is shaped by the same two curves, so a scene's movement and its
  // fade are the same gesture rather than two that happen to overlap.
  const y = useTransform(progress, (v: number) => {
    if (!first && v < enterTo) return ENTER_Y * (1 - easeIncoming(entering(v)));
    if (v < exitFrom) return 0;
    return last ? 0 : EXIT_Y * (1 - easeOutgoing(leaving(v)));
  });
  const local = useTransform(progress, (v: number) => clamp01((v - start) / span));

  // Whether this scene is on the stage at all, which is not the same question
  // as whether it is the one being read.
  //
  // The layer stagger used to key off `active`, and `active` flips at the
  // logical boundary — in the middle of the handoff. So the incoming scene's
  // ground washed in while its text was still pinned at zero by the layer
  // rule, and the outgoing scene's text vanished in one frame while its own
  // ground was still at 62%. The handoff read as a ground swap followed by a
  // pop. This tracks the visual event instead: a scene's beats are present
  // from the first frame of its entrance to the last frame of its exit, and
  // `active` is left to do the one job it is right for, which is deciding
  // what can be clicked and focused.
  const [present, setPresent] = useState(first);
  const sync = (v: number) => {
    const next = v >= enterFrom && v < exitTo;
    setPresent((prev) => (prev === next ? prev : next));
  };
  useMotionValueEvent(progress, 'change', sync);
  // A page restored mid-story fires no change event until the reader moves, so
  // the first state has to be read rather than waited for.
  useEffect(() => sync(progress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  const ctx: SceneContext = { local, active };

  return (
    <SceneCtx.Provider value={ctx}>
      {/* The scene's own ground, and the reason it is a separate element.
          A single stage-wide colour interpolating between tones cannot serve
          two scenes at once: measured at a boundary, the ground had already
          turned navy for the incoming scene while the outgoing one was still
          at 62%, which left the worked example's dark type and light panel
          stranded on a dark ground — its headline was, briefly, unreadable.
          Each scene now carries the colour it was designed against, so a
          scene's type is never on another scene's ground. The incoming ground
          washes in over the outgoing scene, which is what gives the handoff
          its direction.
          It takes the opacity but not the travel: a ground that slid would
          show the stage behind its own edge. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: groundOpacity, backgroundColor: TONE_BG[scene.tone] }}
        // Never a pointer target. The grounds are siblings of the scene
        // layers rather than children, so `inert` on a scene does not reach
        // its ground — and a ground is full-bleed, so the last scene's,
        // sitting at opacity 0 on top of everything, silently swallowed every
        // click on the Five Checks twelve scenes above it.
        className={cn('pointer-events-none absolute inset-0', scene.tone === 'navy' && 'gate-field')}
      >
        {scene.backdrop}
      </motion.div>

      <motion.div
        style={{ opacity, y }}
        // Presentation state, for the layer stagger.
        data-scene={present ? 'active' : 'inactive'}
        // Interaction state. Exactly one scene carries this at a time, and it
        // changes at the logical boundary rather than with the fade.
        data-scene-live={active ? '' : undefined}
        // An inactive scene is still painted — it is mid-fade — but it must
        // not be reachable. `inert` takes it out of the tab order and the
        // accessibility tree and swallows pointer events in one attribute, so
        // there is never an invisible control layered over a visible one.
        inert={!active}
        className="absolute inset-0 flex items-center overflow-hidden"
      >
        {/* Deliberately not a scroll container. An `overflow-y-auto` here
            would swallow the wheel whenever the pointer was over a scene tall
            enough to scroll, and the story would simply stop advancing under
            the reader's hand — a scroll trap dressed up as a safety net. The
            scenes are sized to fit the stage instead. */}
        {/* The padding is the frame's: enough to clear the rule at the top of
            the panel and the one closing it at the bottom, so no scene ever
            sits on its own frame.
            Trimmed on a short window, where the allowance is the difference
            between a scene fitting and a scene touching its own frame —
            measured, Bengali on a 1024×768 laptop crossed the top rule by 7px
            at the full allowance. The frame stays; it just holds its content
            closer. */}
        <div
          className={cn(
            scene.container === 'stage' ? 'stage' : 'shell',
            'w-full pb-7 pt-10',
            '[@media(min-height:840px)]:pb-8 [@media(min-height:840px)]:pt-12'
          )}
        >
          {scene.render(ctx)}
        </div>
      </motion.div>
    </SceneCtx.Provider>
  );
};

/**
 * The panel every scene is presented in.
 *
 * Scenes fill between a third and two-thirds of the stage, and until now the
 * remainder read as a section adrift rather than as space someone chose. This
 * gives it two edges and a mark: the five-bar rule from the VeriPath shield at
 * the top left, the scene's position in the story at the top right, and a
 * hairline closing the panel at each end. Every scene is then framed
 * identically, at the same optical axis, whatever it contains — which is what
 * turns the emptiness into a margin.
 *
 * Deliberately not a progress bar, and deliberately carrying no scene label:
 * each scene already opens with its own kicker in the mark's own green, and a
 * second copy of that text on the same screen would read as a fault rather
 * than as structure.
 *
 * `aria-hidden`, because it is the frame around the content and not content —
 * the scene's own heading is what a screen reader should meet.
 */
const StageFrame: React.FC<{ index: number; count: number; tone: Tone }> = ({
  index,
  count,
  tone,
}) => {
  const dark = tone === 'navy';
  const rule = dark ? 'bg-white/12' : 'bg-ink/10';

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <div className="shell flex h-full flex-col">
        <div
          className={cn(
            'flex items-center gap-3 pt-5 transition-colors duration-500',
            dark ? 'text-white/45' : 'text-ink-faint'
          )}
        >
          <BarRule theme={dark ? 'dark' : 'light'} className="origin-left scale-[0.55]" />
          <span className="tabular ml-auto font-mono text-label tracking-[0.14em]">
            {String(index + 1).padStart(2, '0')} / {count}
          </span>
        </div>
        <div className={cn('mt-2.5 h-px w-full transition-colors duration-500', rule)} />
        <div className={cn('mb-5 mt-auto h-px w-full transition-colors duration-500', rule)} />
      </div>
    </div>
  );
};

interface ScrollStoryProps {
  scenes: StoryScene[];
  /** Bound to the stage so pointer response covers the whole composition. */
  stageProps?: React.HTMLAttributes<HTMLDivElement>;
  stageRef?: React.Ref<HTMLDivElement>;
}

export const ScrollStory: React.FC<ScrollStoryProps> = ({ scenes, stageProps, stageRef }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = scenes.length;

  // Every scene's share of the track, from its authored weight. `offsets[i]`
  // is where scene i begins as a fraction of the whole, and `units` is how
  // many base units of `--scene-scroll` the track is worth.
  const weights = scenes.map((scene) => scene.weight ?? 1);
  const units = weights.reduce((sum, w) => sum + w, 0);
  const offsets: number[] = [];
  let running = 0;
  for (const w of weights) {
    offsets.push(running / units);
    running += w;
  }
  offsets.push(1);

  // `end end` is the moment the track's bottom edge reaches the bottom of the
  // window, which is exactly when the sticky stage stops being sticky. So the
  // whole story is spent while the stage is pinned, and progress cannot still
  // be advancing after it has let go.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // The only thing on this page that turns scroll into React state, and it
  // changes once per scene rather than once per frame. Everything else —
  // opacity, travel, the ground colour, the pointer planes — stays on
  // MotionValues and never re-renders anything.
  // Exactly one scene is active at any progress, and it is the one whose own
  // share of the track this value falls in — not the one that happens to be
  // brightest. During a handoff both are on screen but only the scene being
  // arrived at is interactive, so the overlap stays a purely visual event and
  // the focus model is unchanged by it.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let next = count - 1;
    for (let i = 0; i < count; i += 1) {
      if (v < offsets[i + 1] - 1e-6) {
        next = i;
        break;
      }
    }
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <div
      ref={trackRef}
      className="relative"
      // The height is the story: one base unit of scroll per unit of weight,
      // and nothing arbitrary. `svh` so a phone browser's collapsing toolbar
      // cannot change how far through the story the reader is.
      style={{ height: `calc(${units.toFixed(3)} * var(--scene-scroll))` }}
    >
      {/* In-page links land on the scroll offset where a scene begins, not on
          the scene's markup — the markup is pinned and never moves, so it is
          not something a browser can scroll to. These are the only elements in
          the track that sit at a scene's actual position. */}
      {scenes.map((scene, index) =>
        scene.anchor ? (
          <div
            key={scene.anchor}
            id={scene.anchor}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              top: `calc(${(offsets[index] * units).toFixed(3)} * var(--scene-scroll))`,
              scrollMarginTop: 'var(--nav-h)',
            }}
          />
        ) : null
      )}

      <div
        ref={stageRef}
        className="sticky overflow-hidden"
        style={{ top: 'var(--nav-h)', height: 'calc(100svh - var(--nav-h))' }}
        {...stageProps}
      >
        {/* The floor under the scenes, in the tone the story opens on. Every
            scene paints its own ground over this, so it is only ever seen
            behind the first one — but without it the stage would be
            transparent for the width of a hairline at the very top of the
            track, and the page behind it would show through. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: TONE_BG[scenes[0].tone] }}
        />

        {scenes.map((scene, index) => (
          <SceneLayer
            key={scene.id}
            scene={scene}
            start={offsets[index]}
            end={offsets[index + 1]}
            first={index === 0}
            last={index === count - 1}
            progress={scrollYProgress}
            active={index === active}
          />
        ))}

        <StageFrame index={active} count={count} tone={scenes[active].tone} />
      </div>
    </div>
  );
};
