(function () {
  const PARTIAL_PATH = "partials/site-header.html";
  const FALLBACK_MARKUP = `
    <header class="site-header">
      <div class="layout site-header__inner">
        <a class="brand" href="index.html" data-i18n="nav.brand">Vibeperform</a>
        <nav class="site-nav">
          <a href="index.html#section-1" data-nav-page="index">Overview</a>
          <a href="workshops.html" data-nav-page="workshops">Workshops</a>
          <a href="about.html" data-nav-page="about">About</a>
          <div
            class="language-toggle"
            role="group"
            data-i18n-attr="aria-label:languageToggle.label"
            aria-label="Language"
          >
            <button
              type="button"
              class="language-toggle__button"
              data-lang-option="de"
              data-i18n="languageToggle.options.de"
              aria-pressed="false"
            >
              DE
            </button>
            <button
              type="button"
              class="language-toggle__button"
              data-lang-option="en"
              data-i18n="languageToggle.options.en"
              aria-pressed="false"
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;
  let cachedMarkup = null;

  function applyActiveNavState(root) {
    const activePage = document.body ? document.body.dataset.page : null;
    if (!activePage) return;
    root.querySelectorAll("[data-nav-page]").forEach((link) => {
      if (link.dataset.navPage === activePage) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function injectHeader(markup, placeholder) {
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    const header = template.content.firstElementChild
      ? template.content.firstElementChild.cloneNode(true)
      : null;

    if (!header) {
      console.error("Site header partial is empty or malformed.");
      return null;
    }

    applyActiveNavState(header);
    placeholder.replaceWith(header);
    return header;
  }

  async function loadPartialMarkup() {
    if (cachedMarkup !== null) {
      return cachedMarkup;
    }

    if (window.location.protocol === "file:") {
      cachedMarkup = FALLBACK_MARKUP;
      return cachedMarkup;
    }

    try {
      const response = await fetch(PARTIAL_PATH, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`Response not ok: ${response.status}`);
      }
      const markup = await response.text();
      cachedMarkup = markup && markup.trim().length ? markup : FALLBACK_MARKUP;
    } catch (error) {
      console.error("Failed to load site header partial:", error);
      cachedMarkup = FALLBACK_MARKUP;
    }

    return cachedMarkup;
  }

  async function loadSiteHeader() {
    const placeholders = Array.from(document.querySelectorAll('[data-component="site-header"]'));
    if (!placeholders.length) {
      return;
    }

    const markup = await loadPartialMarkup();

    const elements = placeholders
      .map((placeholder) => injectHeader(markup, placeholder))
      .filter(Boolean);

    if (elements.length) {
      document.dispatchEvent(
        new CustomEvent("component:site-header-ready", { detail: { elements } })
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSiteHeader);
  } else {
    loadSiteHeader();
  }
})();
