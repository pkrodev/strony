(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("is-open")) return;
      const target = e.target;
      if (target instanceof Element) {
        const inside = navMenu.contains(target) || navToggle.contains(target);
        if (!inside) closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close on menu click (mobile)
    navMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement) closeMenu();
    });
  }

  // Reveal animations
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Demo form
  const form = $("#leadForm");
  const hint = $("#formHint");
  const lang = (document.documentElement.lang || "en").toLowerCase();

  const messages = {
    pl: {
      ok: "Dzięki! Formularz jest demo. Napisz na kontakt@nightcode.pl lub zadzwoń: +48 519 096 947.",
      err: "Uzupełnij wymagane pola (imię, e-mail, typ, wiadomość).",
    },
    en: {
      ok: "Thanks! This is a demo form. Email us at kontakt@nightcode.pl or call +48 519 096 947.",
      err: "Please fill the required fields (name, email, type, message).",
    },
    es: {
      ok: "¡Gracias! Este formulario es demo. Escríbenos a kontakt@nightcode.pl o llama al +48 519 096 947.",
      err: "Completa los campos obligatorios (nombre, email, tipo, mensaje).",
    },
    ru: {
      ok: "Спасибо! Это демо‑форма. Пишите на kontakt@nightcode.pl или звоните: +48 519 096 947.",
      err: "Заполните обязательные поля (имя, email, тип, сообщение).",
    },
  };

  const t = messages[lang] || messages.en;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const required = ["name", "email", "type", "message"];
      const missing = required.some((k) => !String(fd.get(k) || "").trim());

      if (missing) {
        if (hint) hint.textContent = t.err;
        return;
      }

      // Demo: show success and reset
      if (hint) hint.textContent = t.ok;
      form.reset();
    });
  }
})();
