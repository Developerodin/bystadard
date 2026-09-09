export function initNav(lenis) {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const hero = document.querySelector(".hero, .about-hero");
  const menuBtn = document.querySelector(".nav__menu");
  const drawer = document.querySelector(".nav__drawer");
  const closeBtn = document.querySelector(".nav__drawer-close");
  const drawerLinks = drawer?.querySelectorAll("a") ?? [];
  const darkSections = document.querySelectorAll(
    ".services, .cta, .about-hero"
  );
  const SOLID_AFTER = 16;

  const getScrollY = () =>
    lenis ? lenis.scroll : window.scrollY || window.pageYOffset || 0;

  const isOverDarkSurface = () => {
    const navMid = nav.offsetHeight / 2;
    const sampleX = Math.min(120, window.innerWidth / 2);

    if (document.body.classList.contains("page--dark")) {
      const footer = document.querySelector(".footer");
      if (!footer) return true;
      return footer.getBoundingClientRect().top > navMid;
    }

    for (const section of darkSections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navMid && rect.bottom >= navMid) {
        return true;
      }
    }

    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom > nav.offsetHeight + 8) {
        return true;
      }
    }

    const el = document.elementFromPoint(sampleX, navMid);
    if (!el) return false;
    let node = el;
    while (node && node !== document.body) {
      if (
        node.classList?.contains("services") ||
        node.classList?.contains("cta") ||
        node.classList?.contains("hero") ||
        node.classList?.contains("about-hero")
      ) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  };

  const updateTheme = () => {
    const isSolid = getScrollY() > SOLID_AFTER;
    nav.classList.toggle("is-solid", isSolid);

    if (isSolid) {
      nav.classList.remove("is-dark");
      return;
    }

    const onDark = isOverDarkSurface();
    nav.classList.toggle("is-dark", !onDark);
  };

  const openDrawer = () => {
    drawer?.classList.add("is-open");
    drawer?.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("lenis-stopped");
    lenis?.stop();
  };

  const closeDrawer = () => {
    drawer?.classList.remove("is-open");
    drawer?.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("lenis-stopped");
    lenis?.start();
  };

  menuBtn?.addEventListener("click", openDrawer);
  closeBtn?.addEventListener("click", closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  if (lenis) {
    lenis.on("scroll", updateTheme);
  } else {
    window.addEventListener("scroll", updateTheme, { passive: true });
  }

  window.addEventListener("resize", updateTheme, { passive: true });
  updateTheme();
}
