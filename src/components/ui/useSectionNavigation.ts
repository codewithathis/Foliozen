"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "./NavPill";

/** Solves a CSS cubic-bezier for progress `t`, so scrolling can use the same curves as the UI. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const curve = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  const slope = (a: number, b: number, s: number) => 3 * a * (1 - s) ** 2 + 6 * (b - a) * s * (1 - s) + 3 * (1 - b) * s * s;
  return (t: number) => {
    if (t <= 0 || t >= 1) return Math.min(1, Math.max(0, t));
    let s = t;
    for (let i = 0; i < 6; i++) {
      const d = slope(x1, x2, s);
      if (Math.abs(d) < 1e-6) break;
      s = Math.min(1, Math.max(0, s - (curve(x1, x2, s) - t) / d));
    }
    return curve(y1, y2, s);
  };
}

/** Eases in gently, then settles slowly, which reads as smooth on long jumps. */
const fromRest = bezier(0.37, 0, 0.2, 1);
/** Starts at speed, for a second click while the page is still moving. */
const inMotion = bezier(0.2, 0.35, 0.25, 1);

export function useSectionNavigation(items: NavItem[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const sectionKey = JSON.stringify(items.filter((item) => item.href.startsWith("#")).map((item) => item.href));

  useEffect(() => {
    const hrefs: string[] = JSON.parse(sectionKey);
    const sections = hrefs
      .map((href) => ({ href, element: document.getElementById(href.slice(1)) }))
      .filter((section): section is { href: string; element: HTMLElement } => Boolean(section.element));
    if (!sections.length) return;

    let pending: string | null = null;
    let frame = 0;
    let animation = 0;
    let stoppedAt = -Infinity;
    let needsMeasure = true;
    let activationTop = 112;
    let maxScroll = 0;
    let positions: { href: string; top: number; margin: number }[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const y = window.scrollY;
      positions = sections.map(({ href, element }) => ({
        href,
        top: element.getBoundingClientRect().top + y,
        margin: parseFloat(getComputedStyle(element).scrollMarginTop) || 96,
      })).sort((a, b) => a.top - b.top);
      const margin = positions[0].margin;
      activationTop = margin + Math.min(240, (window.innerHeight - margin) * 0.25);
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      needsMeasure = false;
    };
    const updateActive = () => {
      frame = 0;
      if (needsMeasure) measure();
      if (pending) return;
      const y = Math.max(0, window.scrollY);
      let current: string | null = null;
      let previousTop: number | null = null;
      const margin = positions[0].margin;
      // Read live bounds so expanded content and font loading cannot stale the tracker.
      for (const section of sections) {
        const top = section.element.getBoundingClientRect().top;
        const threshold = previousTop === null ? activationTop : margin + Math.min(activationTop - margin, Math.max(0, top - previousTop) / 2);
        if (top <= threshold) current = section.href;
        previousTop = top;
      }
      if (maxScroll > 0 && y >= maxScroll - 2) current = positions.at(-1)!.href;
      setActiveHref(current);
    };
    const onScroll = () => {
      if (!pending && !frame) frame = requestAnimationFrame(updateActive);
    };
    const onLayout = () => {
      needsMeasure = true;
      if (!frame) frame = requestAnimationFrame(updateActive);
    };
    const cancelMotion = () => {
      if (animation) stoppedAt = performance.now();
      cancelAnimationFrame(animation);
      animation = 0;
      pending = null;
    };
    const interrupt = () => {
      if (!pending) return;
      cancelMotion();
      onScroll();
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      const href = link?.getAttribute("href");
      if (!href?.startsWith("#") || link?.hasAttribute("download") || (link?.target && link.target !== "_self")) return;
      const section = sections.find((section) => section.href === href);
      if (!section) return;

      event.preventDefault();
      cancelMotion();
      // The pointerdown for this click may already have stopped a running scroll.
      const moving = performance.now() - stoppedAt < 250;
      measure();
      pending = href;
      setActiveHref(href);
      if (window.location.hash !== href) window.history.pushState(null, "", href);
      const start = Math.max(0, window.scrollY);
      const destination = () => {
        if (needsMeasure) measure();
        const position = positions.find((position) => position.href === href)!;
        return Math.max(0, Math.min(maxScroll, position.top - position.margin));
      };
      const target = destination();
      const duration = Math.min(1300, 480 + Math.sqrt(Math.abs(target - start)) * 11);
      const ease = moving ? inMotion : fromRest;
      const finish = () => {
        animation = 0;
        cancelAnimationFrame(frame);
        pending = null;
        updateActive();
        if (event.detail === 0) {
          if (!section.element.hasAttribute("tabindex")) {
            section.element.setAttribute("tabindex", "-1");
            section.element.addEventListener("blur", () => section.element.removeAttribute("tabindex"), { once: true });
          }
          section.element.focus({ preventScroll: true });
        }
      };

      // Instant writes avoid a second browser animation competing with this one.
      window.scrollTo({ top: start, behavior: "instant" });
      if (reducedMotion.matches || Math.abs(target - start) < 1) {
        window.scrollTo({ top: target, behavior: "instant" });
        finish();
        return;
      }
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = ease(progress);
        window.scrollTo({ top: start + (destination() - start) * eased, behavior: "instant" });
        if (progress < 1) animation = requestAnimationFrame(tick);
        else finish();
      };
      animation = requestAnimationFrame(tick);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape"].includes(event.key)) interrupt();
    };

    const resize = new ResizeObserver(onLayout);
    resize.observe(document.body);
    sections.forEach(({ element }) => resize.observe(element));
    frame = requestAnimationFrame(updateActive);
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    const onHistory = () => { cancelMotion(); onLayout(); };
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("popstate", onHistory);
    window.addEventListener("hashchange", onHistory);
    reducedMotion.addEventListener("change", interrupt);
    return () => {
      cancelAnimationFrame(frame);
      cancelMotion();
      resize.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayout);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("popstate", onHistory);
      window.removeEventListener("hashchange", onHistory);
      reducedMotion.removeEventListener("change", interrupt);
    };
  }, [sectionKey]);

  return { activeHref };
}
