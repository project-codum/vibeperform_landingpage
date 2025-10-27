document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("[data-chatbot-container]");
  const trigger = document.querySelector("[data-chatbot-trigger]");
  if (!container || !trigger) {
    return;
  }

  function injectIframe() {
    if (container.dataset.loaded === "true") {
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.src = "https://viebeperform-chatbot1-76728983516.europe-west4.run.app/";
    iframe.title = "Innovate AI Assistant";
    iframe.setAttribute("loading", "lazy");
    iframe.classList.add("chatbot-launcher__frame");

    container.appendChild(iframe);
    container.dataset.loaded = "true";
    trigger.remove();
  }

  trigger.addEventListener("click", injectIframe);
});
