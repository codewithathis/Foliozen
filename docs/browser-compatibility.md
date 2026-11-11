# Browser and device compatibility

The same static build runs on Windows, macOS, iOS/iPadOS and Android. Fonts, PDF workers and the TeX engine are bundled locally. No operating-system detection changes the resume content or typography.

## Supported browser baseline

| Feature | Browser baseline |
| --- | --- |
| Resume editor, TXT/DOCX import, keyword matching and exports | Next.js's baseline: Chrome/Edge/Firefox 111+, Safari 16.4+ |
| PDF text extraction and studio preview | PDF.js's legacy baseline: Chrome/Edge 125+, maintained Firefox ESR/current, Safari 18+ |
| Browser TeX compile | WebAssembly and module workers; manual recompile by default on mobile and devices with limited resources |

Current Chrome on Android and Windows/macOS, current Safari on iPhone/iPad/macOS, and current Edge/Firefox are the intended full-feature targets. Foliozen also supplies the promise and buffer APIs missing in Safari 16.4–17.3, extending compatibility beyond PDF.js's official baseline. This extension is regression-tested with missing APIs, but has not been verified on a physical device running those Safari versions. DOCX, TXT and pasted text remain alternatives. Native print/save dialogs and file pickers differ across operating systems.

## Compatibility measures

- The official PDF.js legacy reader supplies iterator and other compatibility support, but still assumes native `Promise.withResolvers` and `ArrayBuffer.transferToFixedLength`. An application bootstrap installs these when missing, before importing PDF.js in both the page and the worker. Native implementations are preserved. Worker and compatibility assets use versioned filenames and load only when needed.
- Native `FileReader` reads support cancellation and files chosen from mobile file providers. Unavailable provider files get guidance to download locally. An optional error-details disclosure retains the failure stage and original error; it is not sent anywhere. Pasted resume text uses the same review and analysis flow.
- PDF import consumes `streamTextContent()` using `getReader()` and explicit `read()` calls. It does not call PDF.js's `getTextContent()`, which relies on `ReadableStream` async iteration absent in Safari before 26.4, including Safari 26.3. Text is bounded as chunks arrive; cancelling releases the stream reader and destroys the PDF task. The compact upload card shows file/page progress, then a separate text-review step. Existing drafts and job targets are preserved.
- File reading checks cancellation without requiring `AbortSignal.throwIfAborted`. PDF/file size limits and DOCX decompression limits prevent excessive input processing.
- Blocked, full or malformed browser storage switches drafts to memory. A persistent notice offers a JSON backup. Original unreadable storage is not overwritten; in-memory changes do not survive refreshing or closing the tab.
- PDF documents and render tasks are destroyed on replacement/unmount. Only pages within or near the PDF pane are rendered, and offscreen canvas buffers are released. Resize handling reuses page dimensions.
- Touch controls use at least 44 px targets where compact buttons appear. Fields and the editor use 16 px text on phones and coarse-pointer devices, including tablets.
- Choosing a template advances directly to Basics on phones and coarse-pointer devices, including landscape touch layouts.
- Landscape safe-area insets protect controls from notches. Text size adjustment is stable across rotation; page zoom remains enabled.
- Downloads keep their object URL alive for 30 seconds. Browsers that display a file instead of downloading it open a separate tab, preserving the editor.
- Direct PDFs are built locally with static embedded Source font faces and no browser print APIs. The PDF module and font files load only on export. Unsupported font characters report an actionable Print fallback rather than silently losing text; browser Print also preserves custom CSS. Native print metadata is controlled by the browser, so use direct download for editable document properties.
- Section scrolling, preview navigation and animations respect reduced-motion preferences.
- Scroll reveals run once through a shared observer. They are skipped when motion is reduced, memory or CPU resources are limited, or data saving is enabled. Content is visible by default, including when scripts or animation APIs are unavailable. The fixed header does not use background blur.
- Below 1280 px, the builder uses a horizontal step list and opens the preview on demand. Hidden previews are unmounted; desktop preview updates are deferred while typing. Template previews skip offscreen painting, and heavy routes are not prefetched.
- Coarse-pointer devices, including large iPads, default to manual LaTeX compilation. Reported resource limits and data-saving connections do the same on laptops and desktops. Limited-resource PDF previews cap canvas density at 1× to reduce memory use.

## Verification

Automated tests cover import validation, bounded DOCX decompression, actual PDF upload extraction without native iterator helpers, promise resolvers, buffer transfers, URL parsing or stream async iteration, plus bootstrap execution in an isolated worker. The stream test first reproduces the failure with the library's old method, then extracts the same file through explicit readers. Tests also cover chunk boundaries, early text limits, cancelling pending reads, native file reads, provider errors, keyword matching, metadata persistence/export separation, blocked/full/corrupt storage and editor hydration with storage access denied.

Local Chromium checks cover phone/tablet/desktop layouts, portrait/landscape sizes, file imports, template selection, section tracking and studio rendering. These checks simulate viewport sizes and missing JavaScript features; they do not substitute for physical iPhone/Android devices or Safari/Firefox engine testing. The current session has no connected Safari, macOS or Android test browser.

The October 2026 final pass checked 18 viewports from 320 × 568 to 2560 × 1440, including iPad portrait/landscape and common MacBook and Windows laptop sizes. Phone and basic Windows profiles also ran with 6× CPU throttling. Checks covered navigation targets and section tracking, editable fields, preview mounting and bento overflow. Scroll reveals were verified with normal/reduced motion, limited resources, a missing observer API and scripts disabled. The production export was checked under `/Foliozen/`, including route changes, deferred tool loading and a constrained-connection phone profile. All 32 import, analysis, export and static-routing regression tests passed.

## Sources

- [Next.js browser support](https://nextjs.org/docs/architecture/supported-browsers)
- [PDF.js browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#faq-support)
- [WebKit: Safari 18.4 iterator helper support](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/)
- [WebKit: Safari 17.4 promise resolvers and buffer transfer support](https://webkit.org/blog/15063/webkit-features-in-safari-17-4/)
- [PDF.js Safari text extraction issue](https://github.com/mozilla/pdf.js/issues/20973)
- [WebKit: Safari 26.4 stream async iteration support](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/)
