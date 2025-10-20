# Languages Feature

We want to support English and German with German as the default language. The site keeps a single HTML shell; locale-specific copy resides in JSON files that the client loads and applies at runtime via `toggleLanguage.js`.

## Folder Layout

```
vibeperform_landingpage/
  index.html
  styles.css
  scripts/
    toggleLanguage.js      # fetches locale JSON, applies strings, persists user choice
  locales/
    en/common.json         # English source copy (canonical key set)
    de/common.json         # German translation (mirrors English keys)
  docs/
    languages.md
```

## Implementation Checklist

1. **Extract copy into JSON**  
   - Inventory all user-facing strings (headings, paragraphs, buttons, aria labels) in `index.html`.  
   - Create `locales/en/common.json` with a nested structure reflecting the page sections.  
   - Duplicate the file to `locales/de/common.json` and translate values while keeping the same keys.

2. **Wire placeholders into HTML**  
   - Replace hardcoded text nodes in `index.html` with elements carrying `data-i18n` attributes (e.g. `<span data-i18n="nav.links.features"></span>`).  
   - Ensure attributes like `aria-label` and button text can also be populated via script (use `data-i18n-attr="aria-label:hero.visualAriaLabel"` conventions or similar).

3. **Implement `toggleLanguage.js`**  
   - On load, determine the active locale (`localStorage`, URL query, or browser default fallback to `de`).  
   - Fetch the matching JSON file from `/locales/{lang}/common.json`.  
   - Traverse DOM elements with `data-i18n` (and attribute hooks) to inject the localized strings.  
   - Handle fallback logic: if a key is missing, log a console warning and default to English.

4. **Add Language Toggle UI**  
   - Render the two-button toggle inside the header nav (`.language-toggle`) so it sits alongside the anchor links.  
   - Use `data-lang-option` attributes to wire each button to `toggleLanguage.js`; translations for labels live under `languageToggle.*` in the locale JSON.  
   - Persist the chosen language to `localStorage` and reflect the active choice via `aria-pressed` so assistive tech understands which language is live.

5. **Update Metadata & Accessibility**  
   - Let `toggleLanguage.js` set `<html lang="…">`, `<title>` (via the `meta.title` key), and keep the copyright year.
   - Keep aria labels and accessible names localized through `data-i18n-attr` hooks (e.g. hero SVG label, language toggle group label).  
   - Publish `<link rel="alternate" hreflang="…">` entries pointing at `?lang=de` / `?lang=en` for search engines; expand as needed if dedicated routes arrive.

6. **Quality Gates**  
   - Run `node scripts/checkLocales.js` to verify every locale mirrors the English key structure before merging.  
   - Manual QA checklist:  
     * Load `index.html?lang=de` and `?lang=en`; confirm headers, hero, cards, footer copy, and aria labels match the intended language.  
     * Flip the toggle in-browser and ensure the choice persists on reload (inspect `localStorage`).  
     * Sanity-check date/number formatting (e.g. `%` spacing) and mailto links for both locales.  
   - Run `node scripts/bootstrapLocales.js` after updating JSON files so `scripts/locales-inline.js` stays in sync.  
   - Regression note added to `docs/main.md` so releases include a bilingual smoke test.

## Maintenance Tips

- Treat English as the source of truth—update `locales/en/common.json` first, then sync translations.  
- Avoid embedding HTML tags inside JSON where possible; prefer splitting strings or using placeholders.  
- When new sections are added, extend the locale schema and re-run the key parity check before merging.
