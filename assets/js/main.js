import { initNyClock } from "./components/clock.js";
import { initNav } from "./components/nav.js";
import { initHeroParallax } from "./components/hero-parallax.js";
import { initWorksScale } from "./components/works-scale.js";
import { initCtaScale } from "./components/cta-scale.js";
import { initStatsCountUp } from "./components/stats.js";
import { initTestimonials } from "./components/carousel.js";
import { initProcessReveal } from "./components/process-reveal.js";
import { initContactForm } from "./components/contact-form.js";
import { initIndiaMarquee } from "./components/india-marquee.js";
import { initPublications } from "./components/publications.js";
import { initFaqFilter } from "./components/faq-filter.js";
import { initPricingEstimate } from "./components/pricing-estimate.js";

function createLenis() {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis not loaded; falling back to native scroll.");
    return null;
  }

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
  return lenis;
}

function initBackToTop(lenis) {
  const link = document.querySelector("[data-back-to-top]");
  if (!link) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function initAnchorScroll(lenis) {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#" || hash === "#top") return;

    const target = document.querySelector(hash);
    if (!target) return;

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -20, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const lenis = createLenis();

  initNyClock();
  initNav(lenis);
  initHeroParallax(lenis);
  initWorksScale(lenis);
  initCtaScale(lenis);
  initStatsCountUp();
  initTestimonials();
  initProcessReveal();
  initContactForm();
  initIndiaMarquee();
  initPublications();
  initFaqFilter();
  initPricingEstimate();
  initBackToTop(lenis);
  initAnchorScroll(lenis);
});
