const SUPPORTED_LOCALES = ["de", "en"];
const STORAGE_KEY = "vibeperform-lang";
const FALLBACK_LOCALE = "en";
const localeCache = new Map();

function normalizeLocale(value) {
  if (!value) return null;
  const short = value.toLowerCase().split("-")[0];
  return SUPPORTED_LOCALES.includes(short) ? short : null;
}

function detectInitialLocale() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = normalizeLocale(params.get("lang"));
  if (fromQuery) return fromQuery;

  const stored = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
  if (stored) return stored;

  const defaultLang = normalizeLocale(document.documentElement.dataset.defaultLang);
  if (defaultLang) return defaultLang;

  const browser = normalizeLocale(navigator.language || navigator.userLanguage);
  return browser || FALLBACK_LOCALE;
}

async function loadLocaleData(locale) {
  if (localeCache.has(locale)) {
    return localeCache.get(locale);
  }

  const request = fetch(`locales/${locale}/common.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load locale file for ${locale}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.warn(error.message);
      return null;
    });

  localeCache.set(locale, request);
  return request;
}

function getNestedValue(source, path) {
  if (!source) return undefined;
  return path.split(".").reduce((acc, segment) => {
    if (acc === undefined || acc === null) return undefined;
    const key = Number.isInteger(Number(segment)) ? Number(segment) : segment;
    return acc[key];
  }, source);
}

function resolveTranslation(key, primary, fallback) {
  const primaryValue = getNestedValue(primary, key);
  if (primaryValue !== undefined) {
    return primaryValue;
  }
  const fallbackValue = getNestedValue(fallback, key);
  if (fallbackValue !== undefined) {
    console.warn(`Missing translation for key "${key}" in primary locale. Using fallback.`);
    return fallbackValue;
  }
  console.warn(`Translation key "${key}" not found in primary or fallback locale.`);
  return null;
}

function applyText(node, value) {
  if (typeof value === "string") {
    node.textContent = value;
  }
}

function applyAttributes(node, valueMap, primary, fallback) {
  valueMap.split(",").forEach((entry) => {
    const [attribute, key] = entry.split(":").map((fragment) => fragment.trim());
    if (!attribute || !key) return;
    const translation = resolveTranslation(key, primary, fallback);
    if (translation !== null && translation !== undefined) {
      node.setAttribute(attribute, translation);
    }
  });
}

function setDocumentMetadata(locale) {
  document.documentElement.lang = locale;
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

async function applyLocale(locale) {
  const primaryData = await loadLocaleData(locale);
  const fallbackData =
    locale === FALLBACK_LOCALE ? primaryData : await loadLocaleData(FALLBACK_LOCALE);

  if (!primaryData && !fallbackData) {
    console.error("Unable to load any locale data. Aborting language setup.");
    return;
  }

  const translationSource = primaryData || fallbackData;
  const fallbackSource = locale === FALLBACK_LOCALE ? null : fallbackData;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const translation = resolveTranslation(key, translationSource, fallbackSource);
    if (translation !== null && typeof translation === "string") {
      applyText(node, translation);
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
    applyAttributes(node, node.dataset.i18nAttr, translationSource, fallbackSource);
  });

  setDocumentMetadata(locale);
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.body.dispatchEvent(
    new CustomEvent("locale:changed", { detail: { locale, data: translationSource } })
  );
}

async function initInternationalization() {
  const initialLocale = detectInitialLocale();
  await applyLocale(initialLocale);

  window.toggleLanguage = async function toggleLanguage(nextLocale) {
    const normalized = normalizeLocale(nextLocale);
    if (!normalized) {
      console.warn(`Requested locale "${nextLocale}" is not supported.`);
      return;
    }
    await applyLocale(normalized);
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInternationalization);
} else {
  initInternationalization();
}
