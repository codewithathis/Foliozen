import Link from "next/link";
import { Disclosure } from "./Disclosure";
import { FloatingNav } from "./FloatingNav";
import { SiteFooter } from "./SiteFooter";
import { ROUTES } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** Shared frame for the guide pages: navigation, a hero, sections, FAQ and a closing call to action. */
export function ContentPage({ eyebrow, title, intro, cta, children }: { eyebrow: string; title: string; intro: string; cta: [string, string]; children: React.ReactNode }) {
  return (
    <div className="device-safe min-h-dvh">
      <FloatingNav
        brand={SITE.name}
        items={[
          { href: ROUTES.home, label: "Home" },
          { href: ROUTES.atsChecker, label: "ATS checker" },
          { href: ROUTES.latexTemplates, label: "LaTeX templates" },
          { href: ROUTES.changelog, label: "Changelog" },
        ]}
        cta={{ href: ROUTES.build, label: "Build my resume" }}
      />
      <main className="mx-auto max-w-[1100px] px-4 pt-[calc(80px+env(safe-area-inset-top))] sm:px-6 lg:pt-[76px]">
        <section className="tile mt-3 px-5 py-10 sm:mt-6 sm:px-10 sm:py-14 lg:px-16">
          <p className="text-sm font-medium text-signal">{eyebrow}</p>
          <h1 className="mt-3 max-w-[20ch] font-display text-xl font-bold leading-[1.1] sm:text-2xl lg:text-3xl lg:leading-[1.06]">{title}</h1>
          <p className="mt-5 max-w-[58ch] text-md text-ink-2">{intro}</p>
          <div className="mt-8 flex flex-col gap-3 min-[400px]:flex-row min-[400px]:flex-wrap">
            <Link href={cta[0]} className="btn btn-primary">{cta[1]}</Link>
            <Link href={ROUTES.home} className="btn btn-secondary">See all features</Link>
          </div>
        </section>
        {children}
        <section className="tile mt-12 px-5 py-10 text-center sm:mt-20 sm:px-8 sm:py-14">
          <h2 className="font-display text-xl font-bold md:text-2xl">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-ink-2">Free, no account, and your drafts stay in this browser.</p>
          <Link href={cta[0]} className="btn btn-primary mt-8">{cta[1]}</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function GuideSection({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="mt-12 grid gap-6 sm:mt-20 md:grid-cols-[1fr_2fr] md:gap-10">
      <div>
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {intro && <p className="mt-2 text-ink-2">{intro}</p>}
      </div>
      <div className="min-w-0 max-w-[68ch] space-y-4 text-ink-2">{children}</div>
    </section>
  );
}

export function CardGrid({ items }: { items: [string, string][] }) {
  return (
    <ul className="grid gap-x-8 sm:grid-cols-2">
      {items.map(([title, body]) => (
        <li key={title} className="border-t border-rule py-4">
          <h3 className="font-medium text-ink">{title}</h3>
          <p className="mt-1 text-sm">{body}</p>
        </li>
      ))}
    </ul>
  );
}

export function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="mt-12 grid gap-8 sm:mt-20 md:grid-cols-[1fr_2fr]">
      <h2 className="font-display text-xl font-bold">Common questions</h2>
      <div className="divide-y divide-rule">
        {faq.map((f) => (
          <Disclosure key={f.q} group="faq" className="py-2" summaryClassName="py-2 font-medium" bodyClassName="pb-3 pt-1" summary={f.q} summaryAs="h3">
            <p className="max-w-[60ch] text-sm text-ink-2">{f.a}</p>
          </Disclosure>
        ))}
      </div>
    </section>
  );
}
