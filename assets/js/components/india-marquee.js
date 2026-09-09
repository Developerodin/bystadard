export function initIndiaMarquee() {
  document.querySelectorAll(".marquee-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const paused = button.closest(".india-marquee").classList.toggle("is-paused");
      button.setAttribute("aria-pressed", String(paused));
      button.textContent = paused ? "Play scroller" : "Pause scroller";
    });
  });
}
