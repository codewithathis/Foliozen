"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasLimitedResources } from "@/lib/device";

const TARGETS = [
  ".capability-intro",
  ".capability-cell",
  ".section-heading-row",
  ".resume-ticket",
  ".latex-window",
  ".latex-feature-copy",
  ".workflow-heading",
  ".workflow-grid > li",
  ".faq-section > div",
  ".footer-panel",
  ".guide-cards > li",
  ".changelog-entry",
].join(",");

export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const limited = hasLimitedResources();
    document.documentElement.dataset.performance = limited
      ? "limited"
      : "standard";
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const running = new Map<Element, Animation>();
    let observer: IntersectionObserver | null = null;

    const stop = () => {
      observer?.disconnect();
      observer = null;
      running.forEach((animation) => animation.cancel());
      running.clear();
    };
    const setup = () => {
      stop();
      if (
        limited ||
        motion.matches ||
        typeof IntersectionObserver === "undefined" ||
        typeof Element.prototype.animate !== "function"
      )
        return;
      const pending = new Set<Element>(
        [...document.querySelectorAll<HTMLElement>(TARGETS)].filter(
          (element) =>
            !seen.has(element) &&
            element.getBoundingClientRect().top >= window.innerHeight - 32,
        ),
      );
      if (!pending.size) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const element = entry.target;
            observer?.unobserve(element);
            pending.delete(element);
            seen.add(element);
            if (!document.hidden && !element.contains(document.activeElement)) {
              const animation = element.animate(
                [
                  { opacity: 0.55, transform: "translateY(12px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                { duration: 400, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
              );
              running.set(element, animation);
              animation.onfinish = animation.oncancel = () =>
                running.delete(element);
            }
          }
          if (!pending.size) observer?.disconnect();
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
      );
      pending.forEach((element) => observer?.observe(element));
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      for (const [element, animation] of running) {
        if (element.contains(event.target)) animation.cancel();
      }
    };
    setup();
    motion.addEventListener("change", setup);
    document.addEventListener("focusin", onFocus);
    return () => {
      stop();
      motion.removeEventListener("change", setup);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
