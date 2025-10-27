# Product Requirements Document – SEO Foundation & Localization Enhancements

## 1. Overview
The current Vibeperform marketing site has strong visual content but lacks core SEO and localization infrastructure. Search engines receive duplicate titles, no descriptions, inconsistent language hints, and limited crawlable navigation. This initiative delivers a comprehensive SEO baseline across `index.html`, `workshops.html`, and `about.html`, while enhancing the existing language-toggle experience and structured data support. The goal is to increase organic discoverability, ensure accurate multilingual signals, and improve technical readiness for future content expansion.

## 2. Goals
- Provide unique, keyword-aware metadata (title, meta description, canonical, social tags) for each page.
- Correct and extend multilingual behaviour so German/English experiences render correctly without JS and translations stay in sync across locale JSON files.
- Establish SEO infrastructure: sitemap, robots.txt, favicons, structured data, sitemap references.
- Improve Core Web Vitals inputs by deferring non-critical assets and lazy-loading the chatbot iframe.
- Ensure search bots can crawl full navigation/content without JavaScript.

## 3. User Stories
- As a potential client searching for AI workshops, I want the workshops page to appear with accurate titles, descriptions, and pricing info so I can evaluate quickly.
- As a German-speaking visitor, I want German copy to load reliably and the page metadata to reflect German so search results respect my language.
- As the marketing team, we want Google Search Console to acknowledge hreflang/canonical signals so localized pages are indexed correctly.
- As a site maintainer, I want structured data validating for organization, FAQ, and service listings so we can earn richer SERP snippets.
- As a visitor on a slower device, I want the page to render quickly without being blocked by non-critical scripts or widgets.

## 4. Functional Requirements
1. **Per-Page Metadata**
   1.1 Each HTML page must define a unique `<title>` and `<meta name="description">` tailored to its content.  
   1.2 Add `<link rel="canonical">` pointing to the production URL pattern (e.g., `https://www.vibeperform.com/{page}`) and ensure canonical references align across languages.  
   1.3 Implement Open Graph (`og:title`, `og:description`, `og:url`, `og:image`) and Twitter card tags per page.
2. **Language & Localization**
   2.1 Default server-rendered HTML must reflect the page’s primary language (`lang` attribute, translated copy) without requiring JS.  
   2.2 Update `locales/en/common.json` and `locales/de/common.json` to include all visible copy from `index`, `workshops`, and `about`.  
   2.3 Enhance `toggleLanguage.js` to hydrate both language versions, persist selection, and update page metadata (title, description, lang attribute) on toggle.  
   2.4 Ensure hreflang tags reference language-specific URLs (e.g., `/en/`, `/de/`).  
   2.5 Provide server-accessible URLs (e.g., `/en/index.html`) or URL parameters that return translated HTML without JS execution. If parameters are used, ensure canonical/hreflang pairings are valid.
3. **Navigation & Crawlability**
   3.1 Render the site header navigation statically in each page so crawlers without JS can follow internal links. Keep progressive enhancement for JS partial loading if desired.  
   3.2 Ensure all on-page copy (including accordion answers) is visible to crawlers; avoid `hidden` attributes that prevent indexing.
4. **Structured Data**
   4.1 Add JSON-LD for `Organization` describing Vibeperform (name, logo, URL, contact).  
   4.2 Add `FAQPage` markup based on the “Typical requests” questions/answers.  
   4.3 Add `Service`/`Product` structured data for each workshop offering (name, description, price, URL).  
   4.4 Validate structured data via Google’s Rich Results Test prior to launch.
5. **Infrastructure Assets**
   5.1 Create `robots.txt` allowing crawl of necessary assets and referencing the sitemap.  
   5.2 Generate `sitemap.xml` listing all language variants of each page.  
   5.3 Add favicon(s) and, if applicable, a web manifest reference in the `<head>`.
6. **Performance Enhancements**
   6.1 Defer or preload fonts/styles appropriately (replace CSS `@import` with `<link>` + optional `preload`).  
   6.2 Lazy-load or defer non-critical scripts; `scripts/locales-inline.js` must not block HTML parsing.  
   6.3 Lazy-load the chatbot iframe; show a placeholder button/toast that loads the iframe on demand.  
   6.4 Set a target: Largest Contentful Paint < 2.5s on 75th percentile mobile (measurement documented post-release).
7. **Documentation & QA**
   7.1 Update `docs/languages.md` to reflect the new multilingual mechanics.  
   7.2 Document sitemap/robots locations and metadata guidelines.  
   7.3 Provide a QA checklist covering metadata, hreflang validation, structured data validation, and performance metrics.

## 5. Non-Goals
- Introducing new page content or major design rebrands beyond text translation and metadata updates.
- Back-end CMS integration; all changes apply to the static site.
- Automated deployment pipelines; manual upload/publishing remains.

## 6. Design Considerations
- Maintain current visual hierarchy and brand styling; only adjust headings as required for semantic structure (one `<h1>` per page).
- Provide fallback styles for new elements (e.g., chatbot placeholder, structured data script tags).
- Ensure language toggle UX mirrors the current design while reflecting active state accessibility (`aria-pressed`).

## 7. Technical Considerations
- Updating locale JSON files requires re-running `scripts/bootstrapLocales.js` to regenerate `locales-inline.js`.  
- If creating `/en/` and `/de/` directories, adjust asset paths (CSS/JS) to remain relative or use root-relative URLs.  
- Confirm hosting supports clean URLs or configure redirects/canonical mapping accordingly.  
- Structured data should be injected in `<head>` via `<script type="application/ld+json">`.

## 8. Success Metrics
- Unique metadata indexed by Google within four weeks (verify via Search Console).  
- Core Web Vitals field data (CrUX) shows LCP ≤ 2.5s and FID/INP within “Good” thresholds after launch.  
- Rich results eligibility confirmed for Organization, FAQ, and Service snippets via Search Console enhancements.  
- Hreflang coverage flagged as valid in Search Console with no errors or warnings.

## 9. Open Questions
- Confirm final production domain and URL scheme to set canonical/hreflang values.  
- Decide on fallback behaviour of the chatbot placeholder (e.g., load on hover vs. click).  
- Determine if additional languages beyond German/English are planned (future-proof sitemap/locale structure).  
- Clarify if price currency/localization should change per locale (e.g., `€` vs. alternate currency in other locales).
