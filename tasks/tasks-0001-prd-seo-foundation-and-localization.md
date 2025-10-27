## Relevant Files

- `index.html` - Main landing page; needs metadata, structured data, static nav, and performance updates.
- `workshops.html` - Workshops landing page; requires unique metadata, service schema, localized copy, and static nav.
- `about.html` - About page with team info; needs distinct metadata, organization schema, localized copy, and nav adjustments.
- `partials/site-header.html` - Shared navigation markup; will be updated for static inclusion and localization attributes.
- `scripts/siteHeader.js` - Handles dynamic header injection; may require adjustments once nav is rendered server-side.
- `scripts/toggleLanguage.js` - Controls language switching; must preload translations, update metadata, and ensure no-JS fallbacks.
- `scripts/locales-inline.js` - Auto-generated bundle; regenerated after locale JSON updates.
- `scripts/bootstrapLocales.js` - Utility to rebuild inline locale script after JSON changes.
- `locales/en/common.json` - English localization source; expand to include all page copy.
- `locales/de/common.json` - German localization; sync with English keys and translations.
- `styles.css` - Global styles; adjust heading hierarchy styles and chatbot placeholder/lazy-load visuals.
- `scripts/accordion.js` - Accordion behavior; may need tweaks so content remains indexable without `hidden`.
- `docs/languages.md` - Documentation for localization; update to reflect new flow.
- `docs` (new files) - Add notes for sitemap/robots usage if separate doc is needed.
- `robots.txt` (new) - Allow crawl and reference sitemap.
- `sitemap.xml` (new) - Enumerate all localized URLs.
- `favicon.ico` / `site.webmanifest` (new) - Brand assets referenced by metadata.

### Notes

- Run `node scripts/bootstrapLocales.js` after editing locale JSON to regenerate `scripts/locales-inline.js`.
- When adding new static assets (favicons, manifest), place them at the project root and verify relative paths from subdirectories.

## Tasks

- [ ] 1.0 Implement page-level metadata and hreflang canonicals across index, workshops, and about
  - [ ] 1.1 Draft unique titles and descriptions per page aligned with target keywords and audience.
  - [ ] 1.2 Add `<meta>`/Open Graph/Twitter tags reflecting each page’s content.
  - [ ] 1.3 Define canonical URLs and hreflang tags referencing language-specific routes.
  - [ ] 1.4 Ensure metadata updates reflect active locale when toggled (JS upgrade plus server-rendered defaults).
- [ ] 2.0 Enhance localization flow and JSON content so German/English render correctly without JS
  - [ ] 2.1 Inventory all user-facing strings on `index`, `workshops`, and `about`; migrate into locale JSON files.
  - [ ] 2.2 Translate/update German entries to match English keys.
  - [ ] 2.3 Rework HTML to render default language server-side while keeping data attributes for toggling.
  - [ ] 2.4 Update `toggleLanguage.js` to load metadata text, handle non-JS fallbacks, and persist selection.
  - [ ] 2.5 Regenerate inline locale bundle and verify language toggle across pages.
- [ ] 3.0 Add structured data and ensure crawlable navigation/FAQ content
  - [ ] 3.1 Embed static header markup in each page for crawler visibility; adjust JS to progressively enhance only.
  - [ ] 3.2 Refactor accordion so FAQ content remains indexable (e.g., default open state or CSS-only disclosure).
  - [ ] 3.3 Implement `Organization` JSON-LD on all pages with consistent data.
  - [ ] 3.4 Add `FAQPage` schema for “Typical requests” section with localized question/answer text.
  - [ ] 3.5 Add `Service`/`Product` schema for each workshop offering including price and URL.
  - [ ] 3.6 Validate structured data via Rich Results Test and document results.
- [ ] 4.0 Ship SEO infrastructure assets (sitemap, robots, favicons, documentation updates)
  - [ ] 4.1 Generate `sitemap.xml` listing all localized URLs; hook into canonical/hreflang strategy.
  - [ ] 4.2 Create `robots.txt` referencing the sitemap and confirming crawl allowances.
  - [ ] 4.3 Add favicon set and optional manifest; link from each page.
  - [ ] 4.4 Update `docs/languages.md` and add SEO checklist doc covering new processes.
- [ ] 5.0 Deliver performance improvements including font loading adjustments and lazy-loaded chatbot iframe
  - [ ] 5.1 Replace CSS `@import` with optimal font loading (<link rel="preload"> + stylesheet).
  - [ ] 5.2 Mark non-critical scripts as `defer`/`async` or inline minimal bootstrap logic.
  - [ ] 5.3 Implement lazy-load interaction for chatbot iframe with accessible placeholder.
  - [ ] 5.4 Measure performance (LCP/INP) before & after; document metrics and regression guardrails.
