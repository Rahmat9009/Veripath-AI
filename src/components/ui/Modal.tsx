import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  title: string;
  /** Set when the title is rendered inside the body instead of the header. */
  hideTitle?: boolean;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * A dialog that behaves like one: Escape closes it, focus moves inside and
 * cycles within it, and focus returns to whatever opened it.
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  hideTitle,
  closeLabel,
  children,
  className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  /**
   * Callers pass `onClose` as an inline arrow, so its identity changes on
   * every render of the page holding the dialog. With it in the dependency
   * array below, every one of those renders tore the effect down and set it
   * up again — and the teardown hands focus back to the trigger. The result
   * was a dialog that opened with focus on the button behind it, and pulled
   * focus back out there again whenever anything on the page re-rendered.
   *
   * Held in a ref instead: the handler always calls the current `onClose`,
   * and the effect runs once per open.
   */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // `a?.focus() ?? b?.focus()` was doing both: `focus()` returns undefined,
    // so the right-hand side always ran and the panel took the focus back off
    // the control that had just been given it. Stated as a choice instead.
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
    else panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const items = (Array.from(panel.querySelectorAll(FOCUSABLE)) as HTMLElement[]).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-navy-ink/70 p-4 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'mx-auto my-4 max-w-2xl rounded-record border border-rule bg-surface shadow-float',
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-rule px-5 py-4 sm:px-6">
          <h2 id={titleId} className={cn('font-serif text-title text-ink', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-2 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-navy-tint hover:text-navy"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
