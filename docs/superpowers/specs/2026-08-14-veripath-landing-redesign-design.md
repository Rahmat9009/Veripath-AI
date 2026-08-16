# VeriPath-AI landing page redesign — design spec

Date: 2026-08-14
Status: Approved
Scope: Frontend only. No backend file, route, prompt, or API contract is modified.

## 1. Problem

The landing page works but reads as a standard SaaS prototype. Measured in-browser at
320 / 375 / 768 / 1440:

- The hero is a `rounded-record` card inset inside `shell`, below `main`'s `py-10`. The page
  opens with a gap and then a rounded rectangle. Nothing owns the viewport.
- Nine sections share one rhythm: full width, `space-y-24`, each opening with the identical
  `BarRule` + mono kicker + serif title unit.
- One tonal value carries ~85% of the page (paper `#f6f6f3`), with two navy blocks bookending.
- The five hero bars read as a saturated red/amber/grey bar chart, inverting the brand — the
  logo's shield is navy and green.
- The logo's wordmark never appears above the fold; the navbar shows only the 40px shield crop.
- **Bug:** the Accessibility section's left column renders 66.7px wide inside a 1328px section.
  `Home.tsx:372` is missing `lg:col-span-5` while its sibling carries `lg:col-span-7`.
- `--text-display-l` is 2.125rem. The hero bypasses the scale with an inline
  `clamp(2.5rem,5vw,4rem)`, so it is the only element with typographic authority.
- Mobile is compressed rather than designed: 11,449px tall at 320px; the nav is a native
  scrollbar strip; the product visual sits ~1.5 screens down.
- `motion@12.23.24` is installed but only `useReducedMotion` is imported. All animation is
  CSS entrance-only, with no continuity between sections.
- Profile Matcher and Document Auditor share one generic two-up grid of identical `Record`
  cards. Neither feature is demonstrated.

No console errors. No page-level horizontal overflow at 320px.

## 2. Direction — "The Gate"

The logo's five-bar shield becomes the page's structural grid rather than an applied mark.
A five-track measure that sections align to, and a recurring gate motif where a claim passes
between navy uprights. Deep navy becomes a primary ground; cream is the relief. Dark and light
carry narrative meaning: dark is *under examination*, light is *what you can act on*.

Colour stays honest. Navy and green carry structure. Amber and coral appear only where there
is an actual finding, never as decoration.

Rejected: "The Dossier" (editorial/archival — its restraint is folded in as typographic
discipline) and "The Ledger" (forensic/tabular — its density would exclude migrant workers and
families, though its evidence discipline is kept).

## 3. Design system

- **Container.** `shell` stays for content. A `bleed` band system lets sections own the full
  viewport width. `App.tsx` gains a one-line conditional so Home opts out of `main`'s
  `shell py-10`; the other five pages render byte-identically.
- **Grid.** 12 columns, with paired asymmetric 5/7 and 7/5 splits, plus a `--gate` five-track
  sub-grid using the logo's bar rhythm (0.52, 0.74, 1, 0.74, 0.52).
- **Bands.** `band-paper`, `band-vellum` (new mid-tone), `band-navy`; each with a hairline top
  rule. No two consecutive bands repeat.
- **Depth.** Hairline borders plus the existing `--shadow-float`. One new `--shadow-lift`,
  reserved for the hero object alone. No glassmorphism.
- **Texture.** A single 1px navy hairline grid at 4% opacity, on navy bands only.

## 4. Typography

Public Sans (body/UI) and IBM Plex Mono (metadata, status, source labels only) are unchanged.
Source Serif 4 is retained for display and loaded at weights 600 and 700, used at 3–6rem. Its
present lack of authority is a sizing problem, not a typeface problem; a fourth family would
cost first paint on the low-end phones this product targets.

New tokens `--text-display-xl` and `--text-hero` are **added**. `--text-display-l` and
`--text-display-m` keep their current values so inner pages do not shift.

Bengali: Source Serif 4 has no Bengali coverage. An explicit `:lang(bn)` display rule pairs
Noto Sans Bengali at a deliberate weight and size, rather than letting it fall back by accident.

## 5. Colour

Every existing token is retained. Added:

| Token | Value | Purpose |
|---|---|---|
| `--color-vellum` | `#efeee8` | mid warm ground, the relief tone |
| `--color-navy-veil` | `rgba(21,60,109,.06)` | hairline grid |
| `--color-navy-lift` | `#1d4d86` | one step up from navy, structure on dark |
| `--color-brand-green-deep` | `#059f45` | AA-passing green for text |

The logo green `#00C853` measures 1.9:1 on cream. It remains a graphic accent and never
carries text.

## 6. Narrative and section order

1. Navbar
2. Hero — the verification chamber
3. Product demonstration — an offer moving through the auditor
4. Problem — dark band, compressed
5. How VeriPath works
6. Profile Matcher — asymmetric feature
7. Document Auditor — mirrored asymmetric feature
8. Trust and official confirmation
9. Accessibility and language — live and interactive
10. Final CTA
11. Footer

## 7. Motion

One easing family: `cubic-bezier(.16,1,.3,1)` for entrances, `cubic-bezier(.4,0,.2,1)` for
state changes.

- `useReducedMotion()` gates every motion component. The static fallback is always the
  *finished* state, never a hidden one.
- Scroll reveals use `whileInView` with `once: true` and a 12px maximum translate. Initial
  state is expressed so content stays readable if JS never runs.
- The hero uses `useScroll`/`useTransform`, capped so it never consumes more than 100vh of
  scroll.
- Buttons animate border and background only. No scale on touch targets.
- No infinite loops beyond the existing skeleton pulse.

## 8. Hero interaction

A navy chamber with five hairline gates. An offer fragment enters at the top; as it descends
past each gate, that gate's rule illuminates and a finding docks into the right margin. At the
bottom, the accumulated findings resolve into a preliminary assessment carrying the evidence
strip and a *requires official confirmation* chip.

It auto-advances, pauses on hover and focus, and is fully keyboard-reachable through the
existing tablist pattern. The static state shows all five gates lit, all findings docked, and
the assessment visible — completely readable with no JS and no motion.

Every sample element keeps its existing *Sample demonstration · Illustrative data* labelling.
No sample data is ever presented as government-verified.

## 9. Honesty constraints

Only the approved labels are used for AI conclusions: preliminary AI assessment, requires
official confirmation, insufficient evidence, needs human review, potential warning, next
verification step. The page never claims VeriPath can approve a visa, prove authenticity, or
guarantee a migration pathway. Risk is never signalled by colour alone — icon and word always
accompany it.

## 10. Brand constraint

The approved logo is used unmodified. `VeripathLogo.tsx` and both logo assets are untouched:
the mark is not redrawn, recoloured, reproportioned, stretched, or replaced. The five-bar
motif used structurally (`BarRule`, `LogoSignal`, the gates) is a derived rhythm at rule scale,
not a second logo, and this is already the established pattern in the codebase.

## 11. Files

**Changed:** `index.html` (font weights) · `src/index.css` (additive tokens, band and gate
utilities) · `src/App.tsx` (one line) · `src/components/Home.tsx` (rewrite) ·
`src/components/Navbar.tsx` · `src/components/Footer.tsx` · `src/components/hero/*` (rewrite) ·
new `src/components/landing/*` · `src/i18n/strings.ts` (new keys in both `en` and `bn`; no
existing key removed or renamed).

Navbar and Footer are shared chrome; those two changes are visible on all six pages by design.

**Untouched:** `server.ts` · `package.json` · `vite.config.ts` · `tsconfig.json` ·
`ProfileMatcher.tsx` · `DocumentAuditor.tsx` · `NewsFeed.tsx` · `OfficialPortals.tsx` ·
`About.tsx` · all of `src/lib`, `src/hooks`, `src/data` · `src/types.ts` ·
`src/i18n/options.ts` (its values are sent to `/api/match-pathway`) · `VeripathLogo.tsx` and
both logo assets.

## 12. Backend

No backend file is modified. `server.ts` and its routes — `/api/audit-document`,
`/api/match-profile` + `/api/match-pathway`, `/api/summarize-policy`, `/api/news-feed` — are
unchanged, as are all Gemini prompts and configuration, request and response formats, and
environment variables. The three `fetch` call sites live in files that are not touched.

## 13. Phases

1. **Foundation + hero.** Tokens, band/gate utilities, motion primitives, `App.tsx` container,
   Navbar, and the verification chamber hero.
2. **Product demonstration and problem.** Sections 3 and 4.
3. **How it works, Profile Matcher, Document Auditor.** Sections 5–7.
4. **Trust, accessibility, final CTA, footer.** Sections 8–11.
5. **Verification.** Type-check, production build, responsive passes at 320/375/768/1024/1440
   and wide, Bengali rendering, reduced-motion, high-contrast, large-text, keyboard traversal,
   console and overflow checks.

Browser verification runs after every phase.

## 14. Verification criteria

- `npm run lint` (tsc --noEmit) passes.
- `npm run build` succeeds.
- No console errors; no page-level horizontal overflow at 320px.
- Accessibility section renders at full width (regression check on the `col-span` bug).
- Every sample block carries its provenance label.
- `prefers-reduced-motion` yields a complete, readable static page.
- Keyboard traversal reaches every interactive element with a visible focus ring.
- Bengali renders without clipping or overflow at every breakpoint.
