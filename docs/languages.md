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
   - Place a toggle control in the header (e.g. two-button switch or dropdown) and hook it to `toggleLanguage.js`.  
   - Persist the chosen language to `localStorage` and re-apply the locale immediately on switch.

5. **Update Metadata & Accessibility**  
   - Dynamically set `<html lang="...">` and `<title>` via the locale data.  
   - Confirm all aria labels and accessible names are localized.  
   - Provide `hreflang` links if a second URL per language is introduced later.

6. **Quality Gates**  
   - Create a simple lint script (Node or shell) to compare JSON keys between `en` and `de` to prevent missing translations.  
   - Add a manual QA checklist to verify both languages render correctly, including date/number formats and mailto subjects if added.  
   - Document regression steps in `docs/main.md` once the feature ships.

## Maintenance Tips

- Treat English as the source of truth—update `locales/en/common.json` first, then sync translations.  
- Avoid embedding HTML tags inside JSON where possible; prefer splitting strings or using placeholders.  
- When new sections are added, extend the locale schema and re-run the key parity check before merging.
