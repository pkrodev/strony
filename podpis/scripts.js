(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Year
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());

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

  // Reveal
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Reduced motion: pause background video
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bgVideo = $("#bgVideo");
  if (prefersReducedMotion && bgVideo) {
    try { bgVideo.pause(); } catch (_) {}
  }

  const bg = document.getElementById("bgVideo");
if (bg) {
  bg.muted = true;
  bg.playsInline = true;
  const p = bg.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}


  // Form demo messages per language
  const MESSAGES = {
    pl: { missing: "Uzupełnij wymagane pola (imię, e-mail, rola, wiadomość).", ok: "Dzięki! To formularz demo — podepnij wysyłkę w scripts.js." },
    en: { missing: "Please fill required fields (name, email, role, message).", ok: "Thanks! Demo form — connect sending in scripts.js." },
    es: { missing: "Completa los campos obligatorios (nombre, email, rol, mensaje).", ok: "¡Gracias! Formulario demo — conecta el envío en scripts.js." },
    ru: { missing: "Заполните обязательные поля (имя, email, роль, сообщение).", ok: "Спасибо! Демо-форма — подключите отправку в scripts.js." }
  };

  const lang = (document.documentElement.getAttribute("lang") || "en").slice(0,2);
  const msg = MESSAGES[lang] || MESSAGES.en;

  const form = $("#leadForm");
  const hint = $("#formHint");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements["name"]?.value?.trim();
      const email = form.elements["email"]?.value?.trim();
      const role = form.elements["role"]?.value?.trim();
      const message = form.elements["message"]?.value?.trim();

      if (!name || !email || !role || !message) {
        if (hint) hint.textContent = msg.missing;
        return;
      }

      // TODO: fetch(...) do backendu / CRM / e-mail
      if (hint) hint.textContent = msg.ok;
      form.reset();
    });
  }
})();
