# Resume uploads and job matching

## Product choices

ResumeFold reads PDF, DOCX and UTF-8 TXT locally. PDF.js and JSZip load on demand, with no external parsing service or API key. The user reviews extracted text before creating a new draft. Existing drafts remain available.

PDF loading uses PDF.js's official legacy build and its matching worker. Both include compatibility support for JavaScript APIs missing from some mobile Safari versions. The worker has a separate filename so an older cached modern worker is not reused. File cancellation checks the signal directly without requiring `AbortSignal.throwIfAborted`.

Contact details and standard section headings are recognised with deterministic rules. Entries with clear date ranges become editable fields. Year-only or ambiguous dates are left blank instead of inventing months. Unsupported sections and unmapped text remain in Import notes and JSON backups. Users must place that text in the appropriate fields before exporting. Original formatting is not preserved.

Headings are matched after collapsing letter spacing ("W O R K E X P E R I E N C E") and accept extended names such as "Skills & Capabilities". PDF lines are rebuilt from text positions: wide gaps become tabs, and bullet glyphs stored after the page text are put back on the line beside them. Entry headings split on pipes, tabs and spaced dashes, except inside brackets.

The comparison can use the edited draft or the original extracted text. Uploads get two scores. The file score reads the extracted text the way a parser would: missing contact details, entries without dates, letter-spaced or renamed headings, link labels with no visible address, and text that fits no field. It skips the layout passes that only hold for ResumeFold's own exports. The draft score describes the formatted draft. Neither score certifies how a particular employer's system will read the file.

## Job-specific keywords

Paste the actual posting and optionally name the target role and company. Suggestions match a curated catalog of recognizable tools, skills and domain practices appearing in the posting. Repeated unknown words are never promoted automatically. This intentionally misses uncommon or emerging skills: users can add any relevant term or phrase manually, including nontechnical vocabulary. Whole-term matching prevents Java from matching JavaScript, SQL from matching PostgreSQL and C from matching C++. Common abbreviations such as AWS and Amazon Web Services are accepted.

Suggestion buttons select or deselect terms for comparison. Clearing all selections stays empty across navigation and reloads; Use suggestions restores automatic selection. Add keyword only changes the comparison list. Add to Skills explicitly inserts a missing term into an Additional skills group, switches comparison to the edited draft and offers undo. Existing skills are not removed by undo. Added terms are highlighted in the live preview and in an optional text inspection view, with no highlights in PDF, DOCX or LaTeX. Original uploaded text is never rewritten.

Coverage measures presence across the selected terms, equally weighted. It does not measure proficiency, years of experience, eligibility or interview likelihood. Different employers configure their systems differently. Missing terms should only be added where the candidate has relevant evidence. There is no automatic job-board scraping: pasting a posting keeps the static app independent of CORS restrictions, account access and external services.

Job descriptions, selected keywords and comparison preferences are part of each draft's metadata. They survive changing steps, switching drafts, duplication and JSON backup/restore. New blank drafts have a blank target. Session nicknames use sessionStorage and are separate from resume data and exports.

## Limits and handling

- Maximum upload: 5 MB; PDFs: 20 pages; extracted text: 100,000 characters.
- DOCX central-directory validation precedes decompression. Only document XML is read; streaming stops at 2 MB even if the archive lies about its size.
- Empty, damaged, encrypted or unsupported files report errors. PDF readers are destroyed after extraction; cancellation and a 30-second timeout stop pending reads.
- Scanned PDFs/images require selectable text; OCR is outside this version. DOCX headers, footers, styling, images and complex multi-column associations are not imported.
- Files are not uploaded or retained as binary blobs. Extracted personal data is stored with the draft on the device, so users should delete drafts or clear site data on shared computers.

## Research sources

- [Greenhouse: unsuccessful resume parsing](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse) documents failures caused by image resumes, complex layouts and contact details placed in headers, footers or text boxes. This supports editable extraction and explicit limitations.
- [Jobscan's matching guide](https://www.jobscan.co/jobscan-tutorial) describes comparisons against the job description, skills and keyword context. ResumeFold uses transparent local rules and does not reproduce its proprietary scoring.
- [PDF.js API](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html) provides browser PDF loading and text content extraction.
- [PDF.js browser support](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#faq-support) recommends the legacy build for browser compatibility.
- [JSZip loadAsync](https://stuk.github.io/jszip/documentation/api_jszip/load_async.html), [internalStream](https://stuk.github.io/jszip/documentation/api_zipobject/internal_stream.html) and [StreamHelper](https://stuk.github.io/jszip/documentation/api_streamhelper.html) document selective archive reading and pausable streams.
