(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    $$("#navMenu a").forEach(a => a.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }));

    document.addEventListener("click", (e) => {
      const inside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!inside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal on scroll
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Form stub
  const form = $("#contactForm");
  const notice = $("#formNotice");
  if (form && notice) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      notice.style.display = "block";
      notice.focus?.();
      form.reset();
    });
  }

  // Video fallback when mp4 files are missing
  $$(".js-video").forEach((video) => {
    const wrap = video.closest(".videoBox__body");
    const fallback = wrap?.querySelector(".videoFallback");
    const showFallback = () => {
      if (fallback) fallback.style.display = "flex";
      video.style.display = "none";
    };
    const hideFallback = () => {
      if (fallback) fallback.style.display = "none";
      video.style.display = "block";
    };

    // If the file doesn't load on GitHub Pages (not uploaded), show fallback.
    video.addEventListener("error", showFallback);
    video.addEventListener("loadeddata", hideFallback);

    // If the browser decides not to load immediately, keep fallback visible
    // until we have enough data to play.
    video.addEventListener("canplay", hideFallback);

    // Initial state: show fallback, then hide if the video loads.
    if (fallback) fallback.style.display = "flex";
  });
})();
