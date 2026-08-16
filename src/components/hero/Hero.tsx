import React, { useId, useMemo, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, useTransform, motion } from 'motion/react';
import { PageTab, Language } from '../../types';
import { useT } from '../../i18n/strings';
import { Button } from '../ui';
import { EASE_ENTRANCE, Reveal } from '../landing/motion';
import { FlowButton } from '../landing/FlowButton';
import { useSceneContext } from '../landing/ScrollStory';
import { HeroFindings } from '../landing/sections';
import { LogoSignal } from './LogoSignal';
import { HeroObject } from './HeroObject';
import { CheckTablist } from './CheckTablist';
import { FindingCard } from './FindingCard';
import { buildChecks } from './checks';
import { useCheckSequence } from './useCheckSequence';
import { useHeroMotion } from './useHeroMotion';

export type HeroMotion = ReturnType<typeof useHeroMotion>;

/**
 * The headline, rising line by line out of its own clip.
 *
 * The clip wrapper holds the line box, so the rise happens inside it and
 * nothing else on the page moves. Under reduced motion the lines are simply
 * printed — there is no animation to shorten.
 */
const Headline: React.FC<{ lines: string[] }> = ({ lines }) => {
  const reduceMotion = useReducedMotion();

  return (
    <h1 className="font-serif text-hero font-semibold text-white">
      {lines.map((line, index) => (
        // Extra padding keeps descenders from being cut by the clip.
        <span key={line} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          {reduceMotion ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 + index * 0.09, ease: EASE_ENTRANCE }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </h1>
  );
};

interface HeroStageProps {
  lang: Language;
  setActiveTab: (tab: PageTab) => void;
  motion: HeroMotion;
}

/**
 * Scene one: one instrument on a lit stage, with the checks around it.
 *
 * Composition follows a single rule about priority: on a narrow screen a
 * visitor must know what VeriPath is and be able to act before they meet the
 * object, so the order is signal, headline, question, actions, object, checks.
 * From 1280px up the object and its cards occupy their own half of a wide
 * stage and the reading column sits beside them.
 *
 * The cards are the sequence made visible. None of the five sample outcomes is
 * a pass, because the sample offer is a fraudulent one — the hero shows the
 * product finding problems, never a verification it cannot perform.
 *
 * The scene's own exit is a crossfade owned by the story. What is added here
 * is the *order* of that exit: the reading column lifts first, the instrument
 * settles back, and the finding card — the nearest thing to the reader —
 * travels furthest. Outside the story there is no scene, the fallback value
 * never moves, and the composition simply sits there.
 */
export const HeroStage: React.FC<HeroStageProps> = ({ lang, setActiveTab, motion: heroMotion }) => {
  const t = useT(lang);
  const [active, setActive] = useState(0);
  const panelId = useId();

  const checks = useMemo(() => buildChecks(t), [t]);
  const { setFocusWithin, hoverProps } = useCheckSequence({
    count: checks.length,
    active,
    onChange: setActive,
  });

  // Scene-local scroll progress, or a value that is always 0 when this is
  // mounted as an ordinary section. Declared unconditionally either way.
  const scene = useSceneContext();
  const still = useMotionValue(0);
  const local = scene?.local ?? still;
  const columnY = useTransform(local, [0.7, 1], [0, -30]);
  const objectY = useTransform(local, [0.7, 1], [0, 26]);
  const objectScale = useTransform(local, [0.7, 1], [1, 0.97]);
  const cardY = useTransform(local, [0.7, 1], [0, 44]);
  const railY = useTransform(local, [0.7, 1], [0, 10]);

  // `active` is clamped rather than trusted: an out-of-range index would read
  // `.outcome` off undefined and take the hero down with it.
  const index = Math.min(Math.max(active, 0), checks.length - 1);
  const current = checks[index];

  return (
    <div className="relative">
      {/* The first viewport, in two rows: the reading column and the
          instrument share row one, and the check rail runs the full width of
          row two.

          Grid placement is independent of source order, which is what makes
          this work. The DOM runs word → instrument → rail → finding, so on
          one column a reader meets the object, then the five checks, then the
          finding one of them produced — and the tablist still precedes the
          tabpanel it owns. On desktop the finding is placed back up into row
          one, pinned to the right edge. */}
      <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14">
        {/* ---------------------------------------------------------- */}
        {/* 1–4. Signal, headline, question, actions                    */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          className="min-w-0 space-y-5 lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-center"
          style={{ y: columnY }}
        >
          <div className="flex items-center gap-3">
            <LogoSignal active={index} total={checks.length} />
            <p className="font-mono text-label uppercase tracking-[0.14em] text-white/70">
              {t.home.heroKicker}
            </p>
          </div>

          <Headline lines={[t.home.heroTitleA, t.home.heroTitleB]} />

          <p className="max-w-[36ch] text-lead text-white/85">{t.home.heroQuestion}</p>

          <div className="flex flex-wrap gap-3 pt-1">
            {/* The one action on this page that gets the flow treatment. The
                second stays an ordinary control: two of them side by side and
                neither would read as the primary. */}
            <FlowButton label={t.home.heroPrimary} onClick={() => setActiveTab('auditor')} />
            <Button
              variant="ghost-inverse"
              onClick={() =>
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {t.home.heroSecondary}
            </Button>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* 5–6. The instrument, and the checks around it               */}
        {/* ---------------------------------------------------------- */}
        <div
          className="relative min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:self-center"
          {...hoverProps}
        >
          {/* The one gradient on the stage, and the only thing larger than the
              object it lights. It travels more than twice as far as the object
              does and arrives late, so the light appears to shift across a
              body that is barely moving. The centring translate lives on an
              outer element because the animated one owns its own transform. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[128%] w-[132%] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div className="hero-bloom h-full w-full" style={heroMotion.bloomStyle} />
          </div>

          {/* Modest on a phone: the requirement is that a visitor reads the
              headline and reaches an action before meeting the object, so it
              is sized to enter the first viewport from below rather than to
              fill it. On the stage it takes the whole column. */}
          {/* 50vh rather than 52 at xl: on an 800px-tall window the extra 16px
              was the difference between the scene clearing its frame and
              touching it, and at 1440 and above the clamp's ceiling means the
              object is the same size either way. */}
          <div className="relative mx-auto w-[58%] max-w-[260px] sm:max-w-[290px] lg:h-[clamp(320px,44vh,460px)] lg:w-auto lg:max-w-none xl:h-[clamp(360px,50vh,540px)]">
            {/* One transform per element. Scene exit, pointer lean and the
                breath all animate `y`; composed on one element the last
                writer would win and the object would jitter. */}
            <motion.div className="h-full w-full" style={{ y: objectY, scale: objectScale }}>
              <motion.div className="h-full w-full" style={heroMotion.objectPointerStyle}>
                <motion.div
                  className="h-full w-full"
                  animate={heroMotion.float.animate}
                  transition={heroMotion.float.transition}
                >
                  <HeroObject />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Back plane. Factual sample metadata — the route this offer is for
              — not a claim about it. Deliberately the quietest thing on the
              stage: a hairline-ruled label rather than a pill, no surface, no
              shadow. Omitted on narrow screens, where the same string already
              appears in the tools section. */}
          <motion.div
            className="pointer-events-none absolute left-0 top-[2%] hidden xl:block"
            style={heroMotion.backStyle}
          >
            <p className="border-l border-white/20 py-0.5 pl-2.5 font-mono text-label uppercase tracking-[0.08em] text-white/45">
              {t.home.tool1PreviewRoute}
            </p>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* The check rail — row two                                    */}
        {/* ---------------------------------------------------------- */}
        {/* No surface, no border box, no shadow. It is a ruled line across the
            stage: each check is a segment, and the rule above the segment
            carries the state the tall uprights used to. */}
        <motion.div
          className="min-w-0 lg:col-span-12 lg:col-start-1 lg:row-start-2"
          style={{ y: railY }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-3">
            <p className="font-mono text-label uppercase tracking-[0.1em] text-white/55">
              {t.home.lineGateLabel}
            </p>
            <p className="font-mono text-label uppercase tracking-[0.08em] text-brand-green">
              {t.common.demoData}
            </p>
          </div>
          <CheckTablist
            checks={checks}
            index={index}
            onChange={setActive}
            onFocusChange={setFocusWithin}
            label={t.home.lineTrackLabel}
            panelId={panelId}
          />
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* What that control found — pinned to the outer right edge     */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          style={{ y: cardY }}
          className="min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-8 lg:w-[14rem] lg:justify-self-end lg:self-start xl:-mr-6"
        >
          <FindingCard
            check={current}
            lang={lang}
            id={panelId}
            planeStyle={heroMotion.nearStyle}
          />
        </motion.div>
      </div>
    </div>
  );
};

interface HeroProps {
  lang: Language;
  setActiveTab: (tab: PageTab) => void;
}

/**
 * The hero as an ordinary section, for the stacked page.
 *
 * This is what a phone gets, and what anyone who has asked for reduced motion
 * gets at any width. It owns its own pointer scope, because there is no story
 * stage above it to measure against.
 */
export const Hero: React.FC<HeroProps> = ({ lang, setActiveTab }) => {
  const t = useT(lang);
  const sectionRef = useRef<HTMLElement>(null);
  const heroMotion = useHeroMotion(sectionRef);
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-navy-ink text-white"
      {...heroMotion.pointerProps}
    >
      <HeroAtmosphere reduceMotion={!!reduceMotion} />
      {/* Structure, not texture: the column rhythm is the mark's own. On the
          stage this comes with the scene's navy ground; here the section is
          the ground, so it carries it. */}
      <div aria-hidden="true" className="gate-field pointer-events-none absolute inset-0" />

      <div className="stage relative py-10 sm:py-14 lg:py-16">
        <HeroStage lang={lang} setActiveTab={setActiveTab} motion={heroMotion} />

        <Reveal className="mt-12 border-t border-white/15 pt-8 sm:mt-16" delay={0.1} from="none">
          <HeroFindings lang={lang} setActiveTab={setActiveTab} />
        </Reveal>
      </div>
    </section>
  );
};

/**
 * The stage's light, and the hairline field over it.
 *
 * Both are full-bleed and neither belongs to any one element, so they are
 * mounted behind everything: by the section in stacked mode, by the story's
 * atmosphere slot on the stage. The horizon develops once, on arrival, and
 * then holds — the object's breath is the page's only loop and a horizon that
 * kept pulsing would be the second.
 *
 * Nothing about it is measured against the text: it is a layer behind the
 * column, not a mask over the letterforms, which is what lets the same values
 * hold for two lines of Latin and three of Bengali without knowing anything
 * about either.
 */
export const HeroAtmosphere: React.FC<{ reduceMotion: boolean }> = ({ reduceMotion }) => (
  <motion.div
    aria-hidden="true"
    className="hero-horizon pointer-events-none absolute inset-x-0 bottom-0 h-[78%] origin-bottom lg:w-[64%]"
    {...(reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26, scaleY: 0.9 },
          animate: { opacity: 1, y: 0, scaleY: 1 },
          transition: { duration: 1.15, ease: EASE_ENTRANCE },
        })}
  />
);
