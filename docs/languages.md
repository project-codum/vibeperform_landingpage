# Languages Feature

We ship English and German with English rendered as the default/static markup. Locale-specific copy now spans all three public pages (home, workshops, about) and metadata strings. Content lives in JSON files that `toggleLanguage.js` applies client-side.

## Folder Layout

```txt
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
   - Inventory user-facing strings (headings, paragraphs, buttons, aria labels) in `index.html`, `workshops.html`, and `about.html`.  
   - Populate `locales/en/common.json` using the established nested structure (`home`, `workshopsPage`, `aboutPage`, `meta`, `chatbot`, etc.).  
   - Mirror every key in `locales/de/common.json` with translated values.

2. **Wire placeholders into HTML**  
   - Ensure all three HTML pages use `data-i18n` or `data-i18n-html` hooks for text nodes. Use `data-i18n-html` when markup (e.g. `<strong>`) must be preserved.  
   - Keep attribute localisation via `data-i18n-attr` (example: the language toggle `aria-label`).  
   - Navigation is now rendered statically on each page (no JS fetch required) so crawlers see links without executing JavaScript.

3. **Implement `toggleLanguage.js`**  
   - Language detection order: `?lang=`, `localStorage`, document `data-default-lang`, browser language (fallback to English).  
   - The script now updates page-level metadata (`<title>`, `<meta name="description">`, Open Graph and Twitter tags) based on `meta.{page}` keys.  
   - `data-i18n-html` nodes are rewritten via `innerHTML`, while `data-i18n` nodes still use textContent to avoid accidental markup injection.  
   - Fallback logic still warns and reuses English if a key is missing.

4. **Language Toggle UI**  
   - The toggle is duplicated statically in each page header and upgraded by `toggleLanguage.js`.  
   - Buttons carry `data-lang-option` values and update `aria-pressed` automatically.  
   - The chatbot trigger button also receives a `chatbot.trigger` key so both languages can customise the call-to-action.

5. **Metadata & Accessibility**  
   - `toggleLanguage.js` sets `<html lang>` plus the canonical title/description/OG/Twitter strings per page.  
   - `<link rel="alternate" hreflang="…">` entries point at query-parameter variants until dedicated routes exist.  
   - Accordion answers render visible by default (no `hidden` attribute) so crawlers index the copy even without JavaScript; the script re-applies hiding for interactive sessions.

6. **Quality Gates**  
   - Run `node scripts/checkLocales.js` to verify parity before merging.  
   - Manual QA checklist:  
     * Load each page with `?lang=de`/`?lang=en`; confirm copy, CTA buttons, chat trigger, and metadata reflect the locale.  
     * Flip the toggle and reload to verify persistence.  
     * Validate sitemap/robots entries still reference the correct URLs.  
   - Run `node scripts/bootstrapLocales.js` after updating JSON so `scripts/locales-inline.js` stays current.

## Maintenance Tips

- Treat English as the source of truth—update `locales/en/common.json` first, then sync translations.  
- Avoid embedding HTML tags inside JSON where possible; prefer splitting strings or using placeholders.  
- When new sections are added, extend the locale schema and re-run the key parity check before merging.
