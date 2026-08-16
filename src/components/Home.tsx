import React, { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { PageTab, Language } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Hero, HeroStage, HeroAtmosphere } from './hero/Hero';
import { useHeroMotion } from './hero/useHeroMotion';
import { Band } from './landing/Band';
import { WorkedExample } from './landing/WorkedExample';
import { ScrollStory, type StoryScene } from './landing/ScrollStory';
import {
  AccessSection,
  ClosingSection,
  HeroFindings,
  PrinciplesSection,
  ProblemSection,
  ProcessSection,
  ResultsSection,
  ToolAuditorSection,
  ToolMatcherSection,
  TraceSection,
} from './landing/sections';

interface HomeProps {
  setActiveTab: (tab: PageTab) => void;
  lang: Language;
}

interface LandingProps extends HomeProps {
  /** The reader's own text-size preference, which the story cannot honour. */
  largeText?: boolean;
}

/**
 * The landing page, in one of two presentations.
 *
 * On a wide screen with motion allowed, the middle of the page is a single
 * sticky stage that scenes pass through — the page reads as one continuous
 * presentation rather than a stack of sections. Everywhere else the same
 * scenes are mounted as ordinary tonal bands in normal document flow.
 *
 * Both presentations render the same components from `landing/sections`, so
 * there is exactly one copy of every claim on this page. That is not a tidiness
 * preference: these paragraphs are the product's statement of what it can and
 * cannot tell someone, and two copies of them would eventually disagree.
 *
 * The choice is made synchronously on the first render, so the page never
 * mounts one presentation and then swaps to the other.
 */
export const Home: React.FC<LandingProps> = ({ setActiveTab, lang, largeText }) => {
  const reduceMotion = useReducedMotion();
  // 1024 is where the composition stops being a single column: below it the
  // hero already stacks, and pinning a stage under a reader who is holding a
  // phone would trade a page they can scan for one they have to sit through.
  const wideEnough = useMediaQuery('(min-width: 1024px)');
  // A pinned stage needs a viewport tall enough to hold a scene, and Bengali
  // needs more of it: the root size is 5% larger, the line height is 1.75, and
  // the same paragraphs run longer, so the tallest scenes come out around 15%
  // taller. Measured, Bengali crossed the stage frame on a 768- and an
  // 800-tall window while English cleared it at every size. Rather than
  // squeeze the type or clip the end of a sentence, those windows get the
  // page that can grow — the same call as the large-text fallback below.
  const tallEnough = useMediaQuery(`(min-height: ${lang === 'bn' ? 880 : 700}px)`);

  // Large text opts out, for the same reason reduced motion does. A scene is
  // one viewport and cannot grow; measured, Bengali at the large size on a
  // 1024×768 laptop pushed the worked example 35px past the bottom of the
  // stage, and a pinned stage clips rather than scrolls. Someone who has asked
  // for bigger type is the last reader who should lose the end of a paragraph
  // to a presentational effect, so they get the page that can grow instead.
  const storyOn = wideEnough && tallEnough && !reduceMotion && !largeText;

  return storyOn ? (
    <LandingStory lang={lang} setActiveTab={setActiveTab} />
  ) : (
    <LandingStack lang={lang} setActiveTab={setActiveTab} />
  );
};

/* ================================================================== */
/* The scroll story                                                    */
/* ================================================================== */

const LandingStory: React.FC<HomeProps> = ({ lang, setActiveTab }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // The pointer is measured against the stage, which is exactly the area the
  // reader can see. Measuring against a section taller than the window was
  // what made the old response imperceptible.
  const heroMotion = useHeroMotion(stageRef);

  // The hero's light belongs to the two scenes that share its ground, so it is
  // painted on their grounds rather than on the stage. It then arrives and
  // leaves exactly as they do, and there is no separate fade to keep in step
  // with the scenes it sits behind.
  const light = <HeroAtmosphere reduceMotion={!!reduceMotion} />;

  // The pacing of the story, authored here beside the scenes it applies to.
  //
  // A weight is how long a scene holds relative to the others, in units of
  // `--scene-scroll`. They are set by how much there is to read and how much
  // work the scene does, which is why they belong next to the content rather
  // than inside the animation code: the hero and the worked example are the
  // two things a visitor actually studies, the findings and the auditor are
  // short and follow scenes that have already set them up.
  const scenes: StoryScene[] = [
    {
      id: 'hero',
      tone: 'navy',
      weight: 1.3,
      container: 'stage',
      backdrop: light,
      render: () => <HeroStage lang={lang} setActiveTab={setActiveTab} motion={heroMotion} />,
    },
    {
      id: 'findings',
      tone: 'navy',
      weight: 0.75,
      backdrop: light,
      render: () => <HeroFindings lang={lang} setActiveTab={setActiveTab} />,
    },
    {
      id: 'example',
      tone: 'vellum',
      weight: 1.25,
      render: () => <WorkedExample lang={lang} onAudit={() => setActiveTab('auditor')} />,
    },
    { id: 'problem', tone: 'navy', weight: 0.95, render: () => <ProblemSection lang={lang} /> },
    {
      id: 'principles',
      tone: 'paper',
      weight: 0.95,
      anchor: 'how-it-works',
      render: () => <PrinciplesSection lang={lang} />,
    },
    { id: 'process', tone: 'paper', weight: 1.05, render: () => <ProcessSection lang={lang} /> },
    {
      id: 'tool-matcher',
      tone: 'vellum',
      weight: 1,
      render: () => <ToolMatcherSection lang={lang} setActiveTab={setActiveTab} />,
    },
    {
      id: 'tool-auditor',
      tone: 'vellum',
      weight: 0.9,
      render: () => <ToolAuditorSection lang={lang} setActiveTab={setActiveTab} />,
    },
    { id: 'results', tone: 'paper', weight: 1.2, render: () => <ResultsSection lang={lang} /> },
    { id: 'trace', tone: 'navy', weight: 1.1, render: () => <TraceSection lang={lang} /> },
    { id: 'access', tone: 'paper', weight: 0.95, render: () => <AccessSection lang={lang} /> },
    {
      id: 'closing',
      tone: 'navy',
      weight: 1.15,
      render: () => <ClosingSection lang={lang} setActiveTab={setActiveTab} />,
    },
  ];

  return <ScrollStory scenes={scenes} stageRef={stageRef} stageProps={heroMotion.pointerProps} />;
};

/* ================================================================== */
/* The stacked page — phones, short windows, and reduced motion        */
/* ================================================================== */

const LandingStack: React.FC<HomeProps> = ({ lang, setActiveTab }) => (
  // No trailing padding: the page is a sequence of bands, and the last one
  // meets the footer directly rather than across a strip of paper.
  <div>
    <Hero lang={lang} setActiveTab={setActiveTab} />

    <Band tone="vellum">
      <WorkedExample lang={lang} onAudit={() => setActiveTab('auditor')} />
    </Band>

    <Band tone="navy" size="tight">
      <ProblemSection lang={lang} />
    </Band>

    {/* Two movements in one band. They are the same question asked twice —
        the principles are why you should believe the steps, the steps are what
        the principles amount to — and splitting them across two bands made the
        page ask it twice with a tonal change in between. */}
    <Band tone="paper" id="how-it-works">
      <PrinciplesSection lang={lang} />
      <div className="mt-16 border-t border-rule pt-10 sm:mt-20 sm:pt-12">
        <ProcessSection lang={lang} />
      </div>
    </Band>

    <Band tone="vellum">
      <ToolMatcherSection lang={lang} setActiveTab={setActiveTab} />
      <div className="mt-16 border-t border-rule pt-16 lg:mt-20 lg:pt-20">
        <ToolAuditorSection lang={lang} setActiveTab={setActiveTab} />
      </div>
    </Band>

    <Band tone="paper">
      <ResultsSection lang={lang} />
    </Band>

    <Band tone="navy">
      <TraceSection lang={lang} />
    </Band>

    <Band tone="paper">
      <AccessSection lang={lang} />
    </Band>

    <Band tone="navy">
      <ClosingSection lang={lang} setActiveTab={setActiveTab} />
    </Band>
  </div>
);
