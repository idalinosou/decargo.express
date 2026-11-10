(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach((item) => observer.observe(item));
    }
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const waFloat = document.querySelector(".wa-float");
  if (waFloat) {
    const updateFloat = () => waFloat.classList.toggle("is-visible", window.scrollY > 420);
    updateFloat();
    window.addEventListener("scroll", updateFloat, { passive: true });
  }

  const bgVideos = document.querySelectorAll("[data-bg-video]");
  if (bgVideos.length) {
    const connection = navigator.connection;
    const saveData = Boolean(
      connection && (connection.saveData || /2g/.test(connection.effectiveType || ""))
    );

    if (!reduceMotion && !saveData) {
      const visible = new Set();

      const play = (video) => {
        const attempt = video.play();
        if (attempt) attempt.catch(() => {});
      };

      bgVideos.forEach((video) => {
        if (video.dataset.start) {
          video.addEventListener(
            "loadedmetadata",
            () => {
              video.currentTime = Number(video.dataset.start);
            },
            { once: true }
          );
        }

        video.src = video.dataset.src;
        video.addEventListener("playing", () => video.classList.add("is-playing"), {
          once: true,
        });
        play(video);

        if ("IntersectionObserver" in window) {
          new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                visible.add(video);
                play(video);
              } else {
                visible.delete(video);
                video.pause();
              }
            },
            { threshold: 0.05 }
          ).observe(video.parentElement);
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          bgVideos.forEach((video) => video.pause());
        } else {
          visible.forEach(play);
        }
      });
    }
  }

  const cookieBanner = document.querySelector("[data-cookie-banner]");
  const consentKey = "decargo-consent-v1";

  if (cookieBanner) {
    let stored = null;
    try {
      stored = window.localStorage.getItem(consentKey);
    } catch (error) {
      stored = null;
    }

    if (!stored) {
      window.setTimeout(() => {
        cookieBanner.hidden = false;
        document.body.classList.add("has-cookie");
      }, 900);
    }

    const saveConsent = (value) => {
      try {
        window.localStorage.setItem(consentKey, value);
      } catch (error) {

      }
      cookieBanner.hidden = true;
      document.body.classList.remove("has-cookie");
    };

    cookieBanner.addEventListener("click", (event) => {
      const action = event.target.closest("[data-consent]");
      if (action) saveConsent(action.getAttribute("data-consent"));
    });
  }

  const whatsappNumber = "5521996876862";

  const wireWhatsappForm = (form, buildLines) => {
    const status = form.querySelector("[data-form-status]");
    const fields = form.querySelectorAll("input, select, textarea");

    const setError = (field, hasError) => {
      field.setAttribute("aria-invalid", hasError ? "true" : "false");
      const wrapper = field.closest(".field");
      if (wrapper) wrapper.classList.toggle("has-error", hasError);
      const consent = field.closest(".consent");
      if (consent) consent.classList.toggle("has-error", hasError);
    };

    const validate = (field) => {
      if (field.type === "checkbox") {
        const ok = field.checked;
        setError(field, !ok);
        return ok;
      }
      if (field.required && !field.value.trim()) {
        setError(field, true);
        return false;
      }
      if (field.type === "email" && field.value.trim()) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
        setError(field, !ok);
        return ok;
      }
      setError(field, false);
      return true;
    };

    fields.forEach((field) => {
      field.addEventListener("blur", () => {
        if (field.value || field.required) validate(field);
      });
      field.addEventListener("input", () => {
        if (field.closest(".field")?.classList.contains("has-error")) validate(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach((field) => {
        if (!validate(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.textContent = "Confira os campos destacados antes de enviar.";
          status.classList.add("is-visible");
        }
        return;
      }

      const lines = buildLines(new FormData(form)).filter(Boolean);
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener");

      if (status) {
        status.textContent =
          "Mensagem preparada. Se a janela do WhatsApp não abrir, use o botão de WhatsApp ao lado.";
        status.classList.add("is-visible");
      }
    });
  };

  const quoteForm = document.querySelector("[data-quote-form]");
  if (quoteForm) {
    wireWhatsappForm(quoteForm, (data) => [
      "Olá, equipe Decargo Express!",
      "",
      `Nome: ${data.get("nome")}`,
      data.get("empresa") ? `Empresa: ${data.get("empresa")}` : null,
      `E-mail: ${data.get("email")}`,
      data.get("telefone") ? `Telefone: ${data.get("telefone")}` : null,
      `Origem: ${data.get("origem")}`,
      `Destino: ${data.get("destino")}`,
      `Tipo de carga: ${data.get("tipo")}`,
      data.get("volume") ? `Volume: ${data.get("volume")}` : null,
      data.get("mensagem") ? `Detalhes: ${data.get("mensagem")}` : null,
      "",
      "Enviado pelo formulário do site."
    ]);
  }

  const driverForm = document.querySelector("[data-driver-form]");
  if (driverForm) {
    wireWhatsappForm(driverForm, (data) => [
      "Olá, equipe Decargo Express!",
      "",
      "Tenho interesse em agregar meu veículo.",
      `Nome: ${data.get("nome")}`,
      `Cidade-base: ${data.get("cidade")}`,
      `WhatsApp: ${data.get("whatsapp")}`,
      `Veículo: ${data.get("veiculo")}`,
      data.get("rntrc") ? `RNTRC: ${data.get("rntrc")}` : null,
      data.get("rotas") ? `Rotas de interesse: ${data.get("rotas")}` : null,
      "",
      "Cadastro enviado pelo site."
    ]);
  }
})();
