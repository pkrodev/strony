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

  // Lead form (deployment-ready)
  // 1) Jeśli masz backend/CRM: ustaw endpoint POST JSON:
  //    window.NIGHTCODE_LEAD_ENDPOINT = "https://twoj-backend.pl/api/lead";
  // 2) Jeśli nie — zadziała fallback przez mailto do adresu z <html data-lead-email="...">.

  const form = $("#leadForm");
  const hint = $("#formHint");

  const MESSAGES = {
    pl: {
      missing: "Uzupełnij wymagane pola (imię, e-mail, rola, wiadomość).",
      sending: "Wysyłam…",
      ok: "Dzięki! Zgłoszenie wysłane. Wrócimy do Ciebie najszybciej jak to możliwe.",
      fail: "Nie udało się wysłać automatycznie. Otwieram e-mail z gotową wiadomością…"
    },
    en: {
      missing: "Please fill in required fields (name, email, role, message).",
      sending: "Sending…",
      ok: "Thanks! Your request has been sent.",
      fail: "Couldn't send automatically. Opening an email draft…"
    },
    es: {
      missing: "Completa los campos obligatorios (nombre, correo, rol, mensaje).",
      sending: "Enviando…",
      ok: "¡Gracias! Tu solicitud ha sido enviada.",
      fail: "No se pudo enviar automáticamente. Abriendo un borrador de correo…"
    },
    ru: {
      missing: "Заполните обязательные поля (имя, email, роль, сообщение).",
      sending: "Отправляю…",
      ok: "Спасибо! Заявка отправлена.",
      fail: "Не удалось отправить автоматически. Открываю черновик письма…"
    }
  };

  const getMsg = () => {
    const lang = (document.documentElement.getAttribute("lang") || "pl").toLowerCase();
    return MESSAGES[lang] || MESSAGES.pl;
  };

  const buildPayload = (formEl) => {
    const v = (n) => formEl.elements[n]?.value?.trim() || "";
    return {
      product: "Cyfrowy Podpis",
      page: location.href,
      name: v("name"),
      email: v("email"),
      role: v("role"),
      phone: v("phone"),
      company: v("company"),
      lang: (document.documentElement.getAttribute("lang") || "pl").toLowerCase(),
      message: v("message"),
      createdAt: new Date().toISOString()
    };
  };

  const toMailto = (to, payload) => {
    const subject = "Prośba o demo – Cyfrowy Podpis";
    const body =
`Imię i nazwisko: ${payload.name}
E-mail: ${payload.email}
Telefon: ${payload.phone || "-"}
Firma: ${payload.company || "-"}
Rola: ${payload.role}

Wiadomość:
${payload.message}

Strona: ${payload.page}
`;
    const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  const postJSON = async (endpoint, payload) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = getMsg();

      const payload = buildPayload(form);

      if (!payload.name || !payload.email || !payload.role || !payload.message) {
        if (hint) hint.textContent = msg.missing;
        return;
      }

      const endpoint =
        document.documentElement.dataset.leadEndpoint ||
        window.NIGHTCODE_LEAD_ENDPOINT ||
        "";

      const leadEmail =
        document.documentElement.dataset.leadEmail ||
        "kontakt@nightcode.pl";

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (hint) hint.textContent = msg.sending;

      try {
        if (endpoint) {
          await postJSON(endpoint, payload);
          if (hint) hint.textContent = msg.ok;
          form.reset();
        } else {
          // No backend configured – fallback to mailto draft
          if (hint) hint.textContent = msg.ok;
          toMailto(leadEmail, payload);
          form.reset();
        }
      } catch (err) {
        if (hint) hint.textContent = msg.fail;
        toMailto(leadEmail, payload);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
