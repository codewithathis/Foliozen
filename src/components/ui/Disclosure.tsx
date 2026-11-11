"use client";

import { useEffect, useId, useRef } from "react";

const OPEN_EVENT = "foliozen:disclosure-open";
const EASE_OPEN = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_CLOSE = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * A native <details> that opens and closes with a height and fade animation.
 * Items sharing a `group` behave like an accordion. Without JavaScript it is a plain <details>.
 */
export function Disclosure({
  summary,
  summaryAs: SummaryTag = "span",
  children,
  group,
  className = "",
  summaryClassName = "",
  bodyClassName = "",
}: {
  summary: string;
  /** Element wrapping the summary text, e.g. h3 when the questions belong in the page outline. */
  summaryAs?: "span" | "h3";
  children: React.ReactNode;
  group?: string;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
}) {
  const id = useId();
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const running = useRef<Animation[]>([]);

  const toggle = useRef((open: boolean) => {
    const el = details.current;
    const content = body.current;
    const heading = el?.querySelector("summary");
    if (!el || !content || !heading || el.dataset.state === (open ? "open" : "closed")) return;

    // Start from wherever an interrupted animation left off.
    const from = el.getBoundingClientRect().height;
    const opacity = running.current.length ? Number(getComputedStyle(content).opacity) : open ? 0 : 1;
    running.current.forEach((animation) => animation.cancel());
    running.current = [];
    el.dataset.state = open ? "open" : "closed";
    if (open) {
      el.open = true;
      if (group) document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { group, id } }));
    }
    if (typeof el.animate !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.open = open;
      return;
    }

    const style = getComputedStyle(el);
    const frame = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const to = open ? el.getBoundingClientRect().height : heading.getBoundingClientRect().height + frame;
    const duration = Math.round(Math.min(560, Math.max(260, 200 + Math.abs(to - from) * 0.9)) * (open ? 1 : 0.8));
    const easing = open ? EASE_OPEN : EASE_CLOSE;

    el.style.overflow = "hidden";
    const height = el.animate({ height: [`${from}px`, `${to}px`] }, { duration, easing });
    const fade = content.animate(
      open
        ? { opacity: [opacity, 1], transform: ["translateY(-6px)", "translateY(0)"] }
        : { opacity: [opacity, 0], transform: ["translateY(0)", "translateY(-4px)"] },
      { duration: open ? duration : duration * 0.7, easing, fill: "forwards" },
    );
    running.current = [height, fade];
    height.onfinish = () => {
      running.current.forEach((animation) => animation.cancel());
      running.current = [];
      el.style.overflow = "";
      if (!open) el.open = false;
    };
  });

  useEffect(() => {
    const el = details.current;
    if (el) el.dataset.state = el.open ? "open" : "closed";
    if (!group) return;
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ group: string; id: string }>).detail;
      if (detail.group === group && detail.id !== id) toggle.current(false);
    };
    document.addEventListener(OPEN_EVENT, onOpen);
    return () => document.removeEventListener(OPEN_EVENT, onOpen);
  }, [group, id]);

  return (
    <details
      ref={details}
      className={`group/disclosure ${className}`}
      onToggle={(event) => {
        // Keep state in sync when the browser opens it, e.g. find in page.
        const el = event.currentTarget;
        if (!running.current.length) el.dataset.state = el.open ? "open" : "closed";
      }}
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          toggle.current(details.current?.dataset.state !== "open");
        }}
        className={`group/summary flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden ${summaryClassName}`}
      >
        <SummaryTag>{summary}</SummaryTag>
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500 group-data-[state=open]/disclosure:rotate-180 [@media(hover:hover)]:group-hover/summary:bg-paper-3"
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div ref={body} className={bodyClassName}>
        {children}
      </div>
    </details>
  );
}
