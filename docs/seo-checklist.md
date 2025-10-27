# SEO Checklist

Use this checklist when updating the marketing site:

- **Metadata**
  - Confirm every page sets unique `<title>` and `<meta name="description">`.
  - Update Open Graph/Twitter tags when page copy changes.
  - Keep canonical URLs pointing at the clean English routes; update hreflang links if paths change.
- **Localization**
  - Add new strings to `locales/en/common.json`, mirror in `locales/de/common.json`, then run `node scripts/bootstrapLocales.js`.
  - Verify language toggles, chatbot trigger text, and metadata translations in both locales.
- **Structured Data**
  - Validate `Organization`, `FAQPage`, and `Service` JSON-LD via Google’s Rich Results Test after copy or pricing changes.
  - Keep FAQ answers in HTML and JSON-LD in sync.
- **Infrastructure**
  - Regenerate `sitemap.xml` if URLs or locales change; ensure `robots.txt` references the sitemap.
  - Update favicon/manifest assets if branding changes.
- **Performance**
  - Check Core Web Vitals after large visual changes (Lighthouse or WebPageTest). Target <=2.5s LCP on mobile.
  - Ensure non-critical embeds (e.g. chatbot) remain lazy-loaded.

Tick these items during releases to keep search visibility healthy.
