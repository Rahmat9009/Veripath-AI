# VeriPath Resources / Official Portals redesign — design spec

Date: 2026-08-15
Status: Approved
Scope: Frontend only. No backend file, route, prompt, or API contract is modified. `server.ts` untouched.

## 1. Problem

`src/components/OfficialPortals.tsx` renders 37 real government portals as a filterable
three-column card grid. It works, and two of its details are genuinely good — the visible
`domain` beside every link, and copy-link. Everything around them is generic.

Measured against the current source:

- **Hardcoded English helplines — since remediated, see §9.** `OfficialPortals.tsx` held a
  `HELPLINES` array of authority names and notes outside `strings.ts`. The concurrent pass moved
  them into the typed dictionary as flat `helpline1Authority` … `helpline4Note` keys in both
  languages, with the four numbers kept in a `HELPLINE_NUMBERS` constant. This spec adopts that
  key shape.
- **Fake tabs — since remediated app-wide, see §9.** `OfficialPortals.tsx` used the shared
  `Tabs`, which emitted `role="tab"` + `aria-selected` with no `tabpanel` and no `aria-controls`.
  A concurrent frontend-remediation pass rewrote `ui/Tabs.tsx` as `role="group"` +
  `<button aria-pressed>` and removed the roving `tabIndex`. This spec adopts that fix rather
  than introducing a second primitive.
- **37 identical bordered boxes** (`:156`). Card heights ripple with description length, so the
  grid rags. Scanning for "Qatar labour" is slow.
- **No grouping.** The page is a directory that renders in raw array order.
- **Two idioms for one kind of choice.** Country is a `<select>`, category is a pill row.
- **No counts.** Nothing warns that `Business & Trade` holds exactly 1 portal.
- **Blunt empty state.** One reset clears all three filters; the user is never told which filter
  killed the results.
- **Orphaned live region** (`:211`) sits after the whole list and says only "Link copied",
  never which link.
- **Silent copy failure** (`:56`): `if (!navigator.clipboard) return;` no-ops with no feedback.
- **Helplines are an afterthought** — a four-column `<dl>` at the bottom of a generic `Record`.
- **The page has no ending.** No guidance, no closing action, unlike Home and About.
- **Data defect:** `mockData.ts:414` — `id: 'res-[#res-uae-1]'` is malformed.

The genre is *filterable card grid*. Nothing in its form says government registry, while Home
and About have a specific, hard-won language — ruled lists, hairline rows, mono metadata,
`border-t-2 border-navy` blocks, the `dt`/`dd` evidence grid.

## 2. Direction

The Resources page becomes **a directory, in the same ink-on-paper language as About**: ruled
rows instead of cards, mono metadata columns, structure carried by hairlines and left rules
rather than by boxes. Calm, dense, fast to scan, and obviously a registry.

It stays inside the shared `shell` container. It is **not** added to `BANDED_PAGES` — banding is
editorial, and this is a utility page.

Rejected: a data table (excludes the phone-first audience this product targets), a dashboard
toolbar (wrong register), any card treatment (the current problem).

## 3. Content rules — binding

- Every existing URL, domain, phone number, authority name and description is preserved
  verbatim. The only data edit is the malformed id at `mockData.ts:414`.
- **No new official URLs, phone numbers, freshness claims, or authority metadata may be added.**
  Existing source data is authoritative for this pass.
- The helpline "country" marker is **derived**, not invented: `Qatar MOL labour centre` and
  `Saudi MHRSD centre` name their country in the existing label, and BMET / Probashi Kalyan are
  already mapped to the `Home Country` destination and `bmet.gov.bd` / `probashi.gov.bd` in
  `OFFICIAL_RESOURCES`.
- No "last verified", no status chip, no freshness date on any portal row. The `ResourceItem`
  type (`types.ts:214`) carries `id · title · country · countryFlag · description · officialUrl
  · domain · category` and nothing else may be implied.
- Portal titles, agency names, URLs and domains are never translated — they are the thing the
  reader compares against.

### Approved decisions

1. **Bengali helplines** — all descriptive copy translated. Official agency names and acronyms
   (`BMET`, `Probashi Kalyan`, `Qatar MOL`, `Saudi MHRSD`, `Qiwa`) stay in Latin script. No
   authority-name translations are invented.
2. **Emoji flags removed.** Country name only. The data has no country-code field and none is
   invented for presentation. `countryFlag` stays in the data, unrendered.
3. **Mobile destinations stay fully visible** in a compact two-column grid. No
   "Change destination" disclosure.
4. **Guidance copy is fixed and approved** (§4.6). The universal claim "official portals never
   ask you to pay a recruitment fee" is not used. Bengali preserves the meaning without
   strengthening it.
5. **One shared selection primitive.** The newly-fixed `ui/Tabs.tsx` is adopted for both filter
   groups. No `FilterGroup.tsx` is created. A layout variant may be added to `Tabs` if the
   destination grid needs one. `Tabs.tsx` is **not** renamed in this pass — the name no longer
   describes what it does, and that is acknowledged debt to be paid separately.
6. **Landed remediation is preserved**, not reverted, even where it differs from the original
   plan. The design adapts to the codebase.
7. **Bengali authority names** stay in their established Latin form unless an official Bengali
   rendering is already verified in the project. `helpline2Authority` is corrected from
   `প্রবাসী কল্যাণ হেল্পলাইন` to `Probashi Kalyan হেল্পলাইন`; `কাতার MOL` and `সৌদি MHRSD`
   stand, since they translate only the country word and keep the acronym Latin.

## 4. Page architecture

```
1  Utility header                 PageHeader: kicker · title · intro
                                  provenance stats · full-width search
2  Destination index              fieldset, visible legend, wrapping grid, live counts
3  Purpose filter + summary       fieldset, scroller/wrap, live counts
                                  role="status" result summary + clear controls
4  Directory grouped by purpose   h3 group heading + count, ruled rows
                                  — or — computed empty state
5  Urgent contacts                4 ruled contact blocks, destination-aware ordering
6  Using official sources         3 rules, About §5 marginal-note idiom
7  Close                          restated limit + one action → Document Auditor
```

### 4.1 Filter model

Three predicates, one result set, and no dead end without an explanation.

- **Search** — always applied; matches title, country, description, domain (existing haystack).
- **Destination** — single-select, exclusive, default `All`. Counts computed against *search
  only*, so the numbers do not move when the purpose changes.
- **Purpose** — single-select, exclusive, default `All`. Counts computed against *search +
  destination*.
- A zero-count purpose keeps its slot (no reflow while scanning) and is `disabled` — **unless it
  is the current value**, which keeps the group escapable in the degenerate case where every
  count is zero.
- **Grouping:** with purpose `All`, results render in fixed order — Visa & status, Labour &
  contracts, Government & ministries, Home country & clearance, Study & education, Business &
  trade. Within a group, sorted by destination then title. Group headings render even when one
  purpose is selected, so the heading outline never breaks.
- **Computed empty state:** re-run the filter with each predicate relaxed and report the one
  that helps — "4 portals match your search in other destinations" plus a *Clear destination*
  button, and *Clear all* last.

No URL state: the app has no router (`App.tsx:90` holds `activeTab` in `useState`).

### 4.2 Selection semantics — adopting the shared primitive

`ui/Tabs.tsx` now renders `role="group"` + `<button aria-pressed>`, with the roving `tabIndex`
and its arrow-key handler removed and every button in the tab order. Both Resources filter
groups use it as-is.

Its own comment states the reasoning: all three call sites are category filters over a list that
several other controls also narrow, so no one of them "selects" the list, and `aria-pressed`
carries the same state `aria-selected` did without promising a panel.

A radiogroup would be marginally more precise for an exclusive choice — arrow keys would move
between options for free. That precision is not worth a **second** filter primitive in a
codebase that has just consolidated on one, so it is declined. Consequence to accept: with
14 destination cells and 7 purpose segments, the directory carries 21 filter tab stops before
the first result. Mitigated by the `<h2>`/`<h3>` outline, which gives screen-reader users
heading navigation straight into the results.

Two changes to `Tabs` are permitted, both additive and both no-ops for the existing call sites
(`NewsFeed.tsx`, `landing/sections.tsx`):

- an optional `layout?: 'row' | 'grid'` — `row` keeps today's `flex … overflow-x-auto` exactly;
  `grid` gives the destination index its wrapping cells. Default `row`.
- an optional trailing `count` slot per item, rendered as mono tabular digits, with the
  accessible name supplied by the caller so it reads "Qatar, 3 portals" rather than "Qatar 3".

If the destination grid can be achieved by passing grid classes through the existing
`className` instead, `Tabs` is not touched at all. That is the preferred outcome and will be
tried first.

`min-w-0 max-w-full` on the scroller is already present (`Tabs.tsx:59`) and must survive — it is
the fix for the overflow documented at `OfficialPortals.tsx:121`.

### 4.3 Portal row

```
COUNTRY · PURPOSE                                        mono label line
Qatar Ministry of Labour (MOL)  ↗                        serif title, the link
Verify electronic employment contracts, lodge labour     body-s, ink-muted
complaints, and check Wage Protection System status.
────────────────────────────────────────────────────
mol.gov.qa                                 [ Copy link ] domain promoted to ink
```

- Hairline `border-t` between rows plus `border-l-2 border-l-transparent` that becomes navy on
  hover and `focus-within`. Every rule is coloured on its own side (`border-t-rule`,
  `border-l-navy`) — `cn` is a plain join with no conflict resolution.
- The title anchor carries `after:absolute after:inset-0`, making the whole row one target with
  **one** tab stop. The domain and the copy button are raised with `relative z-10` so the domain
  stays selectable — which matters, because the copy-failure fallback tells the user to select it.
- `break-words`, not `break-all`, so domains break at label boundaries.
- `target="_blank" rel="noopener noreferrer"`, `ExternalLink` icon `aria-hidden`, and an
  `sr-only` "(opens in a new tab)" inside the accessible name.
- No status chip, no freshness, no invented metadata.

### 4.4 Copy feedback

One page-level `role="status" aria-live="polite"` region carrying the full message — "Link
copied: Qatar Ministry of Labour" — replacing 37 possible regions and the anonymous "Link
copied". The inline visual confirmation beside the button is `aria-hidden`.

`navigator.clipboard` failure is caught and surfaced: "Could not copy. Select the address above
to copy it manually." Today it returns silently.

Borrowed idea (Uiverse, `Buttons/Galahhad_kind-cheetah-52.html`): one control whose label
carries both states. None of its CSS, palette, tooltip or overshoot easing is used.

### 4.5 Urgent contacts

Four ruled blocks, 1 col → `sm:2` → `lg:4`, keeping the existing `border-t-2 border-navy` device.

```
QATAR                        mono label   (+ "Matches your destination" when selected)
Qatar MOL labour centre      body, medium
16008                        mono, tabular, ink — plain selectable text
Worker rights line           mono label
[ Call ]  [ Copy number ]    two 44px actions, flex-1 each
```

The number is no longer itself a link; `Call` (a `tel:` `LinkButton`) and `Copy number` are
explicit. On a shared or desktop browser `tel:` does nothing useful and copy is the working path.

Blocks matching the selected destination sort first and gain a marker. Blocks are **never
hidden** — Italy has no helpline in the data, and an empty urgent-contacts section is worse than
four visible ones. The published-numbers caveat (`helplineNote`) is kept verbatim.

Labels are already in the dictionary as `t.portals.helpline{1..4}{Authority,Note}` and the
numbers in `HELPLINE_NUMBERS` (landed by the concurrent pass). That shape is kept. The country
marker is derived in the component from a parallel constant of destination ids, so the number,
its label and its destination stay in one place without adding authority metadata.

### 4.6 Guidance — approved copy

1. **Check the address.** Compare the website domain in your browser with the official source
   listed here before entering personal information or making a payment.
2. **A source is not a verdict.** Reaching an official portal does not by itself prove that a
   recruiter, offer, or document is genuine.
3. **Confirm before you pay.** If a fee, requirement, licence, or process is unclear, confirm it
   with the issuing authority or the official channel listed here before paying anyone.

Rendered in the About §5 marginal-note idiom: `dl`, `sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]`,
`border-t border-rule py-5 last:border-b`.

### 4.7 Close

A ruled block, not a band: restated limit plus one secondary action to the Document Auditor.
`OfficialPortals` gains a `setActiveTab` prop; `App.tsx` passes `goTo`, as it already does for
`About`.

## 5. External patterns — all borrow-idea-only

Nothing installed, nothing copied. No `react-aria-components`, no `@untitledui/icons`, no new
dependency. Untitled UI's component layer sits on React Aria and its own token names
(`bg-primary`, `ring-secondary`, `shadow-skeuomorphic`); adopting a file directly would import a
second design system into a project that has one.

| # | Source | Borrowed | Changed |
|---|---|---|---|
| 1 | UUI `application/filter-bar/filter-bar.tsx` | Three-slot layout: content grows (`min-w-0 flex-1`), actions shrink, `items-end` keeps a labelled input and an unlabelled button baseline-aligned when they wrap | Our tokens; `rounded-control` 2px; no `shadow-xs`; `size-9` → `min-h-[2.75rem]`; no react-aria |
| 2 | UUI `base/button-group/button-group.tsx` | Confirmation only: Untitled UI builds segmented filters on `ToggleButtonGroup`, **not** on `Tabs`, which is the same conclusion the landed `ui/Tabs.tsx` fix reached independently | Nothing is taken. The shared `Tabs` is adopted as-is; no `shadow-skeuomorphic`, no `ring-inset`, and zero-count options are marked by their count and `disabled`, never by `disabled:opacity-50` (opacity fails in high contrast — see `About.tsx:199`) |
| 3 | UUI `application/empty-state/empty-state.tsx` | `Footer` as a `flex gap-3` slot for **multiple** actions, which is what makes the computed empty state expressible | No `BackgroundPattern`, no `FeaturedIcon` ring, no illustrations. Our `EmptyState` gains an optional `actions` slot, source-compatible with every current call site |
| 4 | UUI `marketing/contact/contact-simple-icons-03.tsx` | Title → one-line qualifier → large tappable contact value; the 1→2→3 list rhythm | No `FeaturedIcon` circles, no `link-color` buttons; our `border-t-2 border-navy` block; mono tabular number; second action added; no invented purpose line |
| 5 | Uiverse `Buttons/Galahhad_kind-cheetah-52.html` (Galahhad) | One control whose label carries both states | No CSS tooltip, no dark palette, no overshoot easing, no circle button. Inline mono confirmation + a page-level live region + a real failure path |

Explicitly rejected from both sources: glassmorphism, neon, gradient cards, bento grids,
animated borders, cursor effects, `BackgroundPattern`, `FeaturedIcon` rings,
`shadow-skeuomorphic`, `progress-steps` (already borrowed once on About — reusing it would make
the two pages read as one), and every Uiverse card.

## 6. Mobile — 320 to 430px

- Search first, full width, 44px, `type="search" inputMode="search" enterKeyHint="search"`.
  Typing is the fastest path when the country name is already known.
- Destination index: two-column grid, all 14 cells visible, ~7 rows. Deliberately not a
  `<select>` — a native picker hides all 13 options behind a modal, and seeing thirteen named
  destinations *is* the international signal.
- Purpose: horizontal scroller with `-mx-4 px-4` bleed so segments touch the viewport edge and
  read as continuing; wraps instead of scrolling from `sm`.
- No sticky bar. At 320px it would permanently eat ~15% of the viewport; each group heading
  carries its own count instead.
- Rows full-bleed (`-mx-4` + interior `px-4`) so hairlines span the screen.
- Domain and copy share the bottom line; the copy label hides below 360px.
- Helplines one column; `+880 9610102030` measures ~13ch in IBM Plex Mono, safe at 320px.
- `min-w-0` on every flex/grid child; target zero horizontal page overflow at 320px, verified
  in-browser.

## 7. Accessibility and i18n

**Keyboard.** Both filter groups are native radios: Tab enters at the checked item, arrows move
and select, Tab leaves. One tab stop per portal row (stretched link) plus one for copy. Group
headings give screen-reader users `H`-key navigation across purposes.

**Focus.** Filter changes never move focus. The result summary is
`role="status" aria-live="polite" aria-atomic="true"` — one announcement per change, not a
per-row barrage. Clearing a filter from the empty state returns focus to the control that was
cleared. The global navy `:focus-visible` ring (`index.css:206`) applies; the ring is drawn on
the visible `<span>` via `peer-focus-visible:`, since the real input is `sr-only` and its own
outline would be clipped to 1px.

**Bengali.** Every string is in the typed dictionary, so a missing translation is a type error.
Purpose labels grow ~25% — the mobile scroller absorbs it and destination cells allow two-line
labels with `min-h` rather than `h`.

One global CSS addition: IBM Plex Mono carries no Bengali, so mono labels fall through to Noto
Sans Bengali, where the 0.06–0.14em tracking those labels carry separates conjuncts that must
stay joined. `html[lang='bn'] .font-mono { letter-spacing: normal; }` removes it, in the same
idiom as the existing `html[lang='bn'] .font-serif` rule. This is global, matching the existing
Bengali rules; it only ever removes harmful tracking from Bengali text.

Not in scope: translating the 37 English portal descriptions — a content task requiring approval.

**Large text** (112.5% / 118% bn): no fixed heights; `min-h` everywhere; numbers stay `tabular`.

**High contrast:** every distinction is structural or textual, never colour alone. Selected
destination = filled + `aria-checked`; hovered row = a left rule; zero-count purpose = the count
text plus `disabled`, not opacity; urgency = a rule and a heading.

## 8. Implementation phases

- **Phase 0 — i18n and data.** Extend the existing `portals` block in `en` then `bn` (type error
  until complete) with the ~30 new keys for stats, destination, summary, clear controls,
  external-link and copy semantics, computed empty states, guidance and close. Keep every
  landed key. Correct `helpline2Authority` (bn) per decision 7. Retire `countLabel` and
  `countryLabel` only if nothing else references them. Add the destination constant beside
  `HELPLINE_NUMBERS`. Fix `mockData.ts:414`. `tsc --noEmit` green.
- **Phase 1 — shared primitives.** `EmptyState` gains an `actions` slot and a
  `flex-wrap gap-3` footer, source-compatible with all current call sites. `Tabs` is touched
  only if the destination grid cannot be expressed through `className` (§4.2), and any change
  must leave `NewsFeed.tsx` and `landing/sections.tsx` rendering identically.
- **Phase 2 — page architecture.** Sections 1–4: header, destination index, filter + status,
  grouped directory, computed empty state.
- **Phase 3 — helplines, guidance, close.** Sections 5–7. `App.tsx` passes `setActiveTab`.
- **Phase 4 — interaction detail.** Copy feedback with failure path, stretched link with raised
  domain and copy, hover/focus rules.
- **Phase 5 — verification.** 320 / 375 / 430 / 768 / 1440, EN and BN, `textsize=large`,
  `contrast=high`: zero horizontal overflow, keyboard walk-through, and confirmation that no
  `role="tab"` remains on the page. Screenshots for review, then stop.

Out of scope: Bengali portal descriptions; any verification or freshness metadata; URL filter
state; renaming `Tabs.tsx`; the `role="tab"` usages in `hero/CheckTablist.tsx` and
`landing/WorkedExample.tsx`, which are genuine tab widgets on Home.

## 9. Baseline — concurrent remediation pass

A separate frontend-remediation pass modified eight files between 16:19 and 16:22 on 2026-08-15,
after this page was first assessed. `src/` has been unchanged for 28 minutes at time of writing
and is treated as the baseline. Files touched:

```
useA11ySettings.ts   lang moved into the hook; App.tsx now reads a11y.lang / a11y.setLang
App.tsx              rewired for the above; BANDED_PAGES and the shell class unchanged
useResultOutcome.ts  not Resources-relevant
ui/Tabs.tsx          role="tab" → role="group" + aria-pressed; roving tabIndex removed
VeripathLogo.tsx     not Resources-relevant
ProfileMatcher.tsx   not Resources-relevant
i18n/strings.ts      helpline labels moved into the typed dictionary, both languages
OfficialPortals.tsx  consumes those keys via a HELPLINE_NUMBERS constant
```

Verified still outstanding against this baseline, and therefore in scope for Phases 0–5:

| Item | State |
|---|---|
| Malformed `res-[#res-uae-1]` id | Present at `mockData.ts:414` |
| Resources i18n beyond helplines | Absent — no stats, summary, clear, guidance, close or copy-semantics keys |
| Destination grid | Absent — still a `<select>` with emoji flags |
| Active-filter summary | Absent — a bare count above the filter row |
| Contextual empty states | Absent — one all-or-nothing reset |
| Guidance section | Absent |
| Copy feedback | Present but anonymous, orphaned, and silent on failure |
| Closing section | Absent |

Only the helpline label extraction is done. `EmptyState` (`ui/States.tsx`) and `index.css` were
not touched by the pass and still need their Phase 1 changes.
