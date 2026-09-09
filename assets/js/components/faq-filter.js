export function initFaqFilter() {
  document.querySelectorAll("[data-faq-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.parentElement.parentElement;
      section.querySelectorAll("[data-faq-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });
      section.querySelectorAll("[data-faq]").forEach((detail) => {
        detail.hidden =
          button.dataset.faqFilter !== "All" &&
          detail.dataset.faq !== button.dataset.faqFilter;
      });
    });
  });
}
