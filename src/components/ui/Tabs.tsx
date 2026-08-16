import React from 'react';
import { cn } from '../../lib/cn';

export interface TabItem<T extends string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ElementType;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Names the filter group for screen readers. */
  label: string;
  variant?: 'underline' | 'pill';
  /**
   * `row` is the original single-line scroller and the default, so every
   * existing call site renders exactly the class strings it did before.
   *
   * `grid` exists for the Resources destination index, where fourteen options
   * have to be visible at once on a 320px screen rather than hidden inside a
   * scroller. It could not be done from `className`: `cn` is a plain join with
   * no conflict resolution, so a `grid` passed in would sit alongside the
   * root's `flex` and be settled by stylesheet order rather than by intent —
   * and `shrink-0`/`whitespace-nowrap` on the items are unreachable from the
   * root in any case. The root sets no `grid-cols-*`; the caller states the
   * column counts, because how many columns a page wants is a page's business.
   */
  layout?: 'row' | 'grid';
  className?: string;
}

/**
 * Layout owns exactly the properties that differ between a scroller and a
 * wrapping grid, and nothing else. Everything shared — the target height, the
 * type, the transition, and every variant colour — stays below, so the two
 * layouts can never drift into two different controls.
 */
const LAYOUT = {
  row: {
    root: 'flex min-w-0 max-w-full gap-1 overflow-x-auto',
    item: 'inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5',
  },
  grid: {
    root: 'grid min-w-0 max-w-full gap-2',
    item: 'inline-flex items-center justify-between gap-2 px-3 text-left',
  },
} as const;

/**
 * A group of filters, one of which is applied.
 *
 * This was declared as a `tablist` of `tab`s, and it is not one. A tab owns a
 * panel: `role="tab"` is a promise that `aria-controls` points at a
 * `tabpanel`, and none of the three places this is used had one — so the
 * markup claimed a relationship that did not exist, and a screen reader
 * announced "tab 3 of 8" for a control that has no tab to select.
 *
 * Nor would adding a panel have been honest. All three uses are category
 * filters over a list that several other controls also filter: the news feed
 * narrows by search box, region select and trending tag as well as by
 * category, and no single one of them "selects" the list.
 *
 * So they are stated as what they are — buttons that are on or off, in a
 * named group. `aria-pressed` carries the state, which is the same
 * information `aria-selected` was carrying, without the promise. Every button
 * is in the tab order, which is what a reader expects of a row of filters and
 * is why the roving tabindex and its arrow keys are gone: with Tab reaching
 * each one, arrow keys that also changed the filter would be a second,
 * conflicting way to move.
 *
 * Nothing about the appearance changes.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  variant = 'underline',
  layout = 'row',
  className,
}: TabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        // min-w-0/max-w-full: as a flex item the scroller would otherwise size
        // to its content and push the page wide instead of scrolling.
        LAYOUT[layout].root,
        variant === 'underline' && 'border-b border-rule',
        className
      )}
    >
      {items.map((item) => {
        const selected = item.id === value;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              LAYOUT[layout].item,
              'text-body-s font-medium transition-colors',
              'min-h-[2.75rem]',
              variant === 'underline' &&
                (selected
                  ? 'border-b-2 border-navy text-navy'
                  : 'border-b-2 border-transparent text-ink-muted hover:text-ink'),
              variant === 'pill' &&
                (selected
                  ? 'rounded-control border border-navy bg-navy text-white'
                  : 'rounded-control border border-rule bg-surface text-ink-muted hover:border-navy/50 hover:text-ink')
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {/* In `grid` the label carries the spread, so a caller can pass a
                two-part label — name and count — and have it sit at the two
                ends of the cell. In `row` the span keeps no class at all, so
                the existing call sites are untouched. */}
            <span
              className={
                layout === 'grid' ? 'flex min-w-0 flex-1 items-center justify-between gap-2' : undefined
              }
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
