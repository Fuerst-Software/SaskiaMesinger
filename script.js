// script.js – Smooth Scroll, Overlay, Reveal, Tilt, Magnetic Buttons

document.addEventListener("DOMContentLoaded", () => {
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* ===== Jahr im Footer ===== */
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Scroll-Bar oben ===== */
  const scrollFill = qs(".scroll-bar__fill");
  const updateScrollBar = () => {
    if (!scrollFill) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    scrollFill.style.width = `${progress * 100}%`;
  };
  updateScrollBar();
  window.addEventListener("scroll", updateScrollBar);

  /* ===== Overlay Navigation ===== */
  const overlay = qs(".overlay");
  const menuToggle = qs(".menu-toggle");
  const overlayClose = qs(".overlay__close");

  const openOverlay = () => {
    if (!overlay) return;
    overlay.classList.add("overlay--open");
    document.body.style.overflow = "hidden";
  };
  const closeOverlay = () => {
    if (!overlay) return;
    overlay.classList.remove("overlay--open");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", openOverlay);
  overlayClose?.addEventListener("click", closeOverlay);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  /* ===== Smooth Scroll ===== */
  const smoothScrollTo = (target) => {
    if (!target) return;
    const offset = 72;
    const top =
      target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  qsa(".js-scroll").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      const dataTarget = el.dataset.target;
      const id = dataTarget || (href && href.startsWith("#") ? href : null);
      if (!id) return;

      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(target);
      closeOverlay();
    });
  });

  /* ===== Reveal on Scroll ===== */
  const revealEls = qsa(".reveal");
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* ===== Tilt-Effekt für Panel & Kontaktkarte ===== */
  const tiltEls = qsa("[data-tilt]");
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouch && tiltEls.length) {
    tiltEls.forEach((el) => {
      const maxTilt = 6;

      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateX = y * -maxTilt;
        const rotateY = x * maxTilt;

        el.style.transform =
          `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      };

      const reset = () => {
        el.style.transform =
          "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
      };

      el.addEventListener("mousemove", handleMove);
      el.addEventListener("mouseleave", reset);
    });
  }

  /* ===== Magnetic Buttons ===== */
  const magneticButtons = qsa(".btn-magnetic");
  if (!isTouch && magneticButtons.length) {
    magneticButtons.forEach((btn) => {
      const strength = 18;

      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      };

      const reset = () => {
        btn.style.transform = "translate(0, 0)";
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", reset);
    });
  }

  /* ===== Fake Form Submit (Design-Demo) ===== */
  const form = qs(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      if (!btn) return;
      const original = btn.textContent;

      btn.disabled = true;
      btn.textContent = "Danke, Anfrage erfasst.";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
      }, 2400);
    });
  }
});
