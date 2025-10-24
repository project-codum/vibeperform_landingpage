document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".js-accordion-toggle");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      const panelId = toggle.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      toggle.setAttribute("aria-expanded", String(!expanded));

      if (panel) {
        if (expanded) {
          panel.setAttribute("hidden", "");
        } else {
          panel.removeAttribute("hidden");
        }
      }
    });
  });
});
