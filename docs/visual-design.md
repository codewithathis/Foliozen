# Visual system

The October 2026 design uses warm ivory, cobalt construction lines, generous space, architectural illustration and a mix of Inter and Source Serif 4. Both fonts are bundled locally. Resume document typography is controlled separately by the existing layout settings.

Template cards use ticket proportions and a perforated divider. Decorative barcode strips have been removed. Primary actions are black pills. The footer keeps links and project details in one card. An oversized, faint sans-serif wordmark sits below the card on the page background, cropped at the bottom edge as the site’s final element. It scales with the footer’s width. Repeated closing calls-to-action, section numbers and side captions have been removed.

Page and footer widths follow the viewport with small adaptive gutters. Large screens use a viewport-height hero, larger template previews and proportional section spacing. Reading copy stays bounded, and navigation remains a compact floating pill on desktop and mobile.

## Hero illustration

- Final asset: `public/images/architecture.webp`, 1440 × 960, approximately 150 KB.
- The compressed WebP has explicit dimensions and a reserved hero area to avoid layout shifts.
- The art is decorative, excluded from the accessibility tree, and contains no interface text. Dark mode adapts it with CSS.

## Implementation

Copy uses short sentences, specific feature descriptions and clear action labels. Explain what a tool does before asking someone to use it. Keep hiring claims modest: resume scores describe local checks, not an employer’s decision. Make file storage and optional external services explicit where relevant.

The how-it-works section uses a bento grid with a central resume illustration and four supporting workflow cards. The cards link to the builder and ATS guide. On smaller screens the grid rearranges into two columns with a horizontal centre card, then stacks the supporting cards below 360 px. Mobile copy is shortened and the illustration reserves enough height to prevent clipping.

Below 1024 px, the navbar keeps a single appearance button alongside the build action and section menu. Touch devices retain that compact appearance control at wider sizes too. Header actions have at least 44 px touch targets, and the appearance and section menus close each other when opened. Short landscape screens can scroll the section menu.

Scroll reveals use a shared IntersectionObserver and run once with opacity and a small vertical movement. Content stays visible without scripts or animation support. Reduced-motion preferences, four or fewer CPU cores, limited reported memory and data-saving connections disable the reveals. The wordmark retains its own treatment. Below 1280 px, the resume preview mounts only when opened; wider screens use a deferred live preview. Heavy editor routes load when selected rather than being prefetched.

- Shared tokens and form controls: `src/app/globals.css`.
- Marketing, footer and scoped editor styles: `src/app/editorial.css`.
- How-it-works bento layout: `src/components/ui/WorkflowBento.tsx` and `src/app/workflow.css`.
- Existing navigation and disclosure controllers retain their scroll, focus and reduced-motion behavior.
- PDF and DOCX renderers use their document-specific styles; the website's visual treatment does not alter exported resume content.
