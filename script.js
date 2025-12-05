document.addEventListener("DOMContentLoaded", () => {
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  /* Jahr im Footer */
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Scroll-Bar */
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

  /* Overlay Navigation */
 /* Overlay Navigation */
const overlay = qs(".overlay");
const menuToggle = qs(".lux-menu-btn"); // <<< geändert
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
  qsa(".overlay__link").forEach((link) =>
    link.addEventListener("click", closeOverlay)
  );

  /* data-nav-target Buttons */
  qsa("[data-nav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-nav-target");
      if (target) window.location.href = target;
    });
  });

  /* Reveal-on-Scroll */
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
      { threshold: 0.2 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  /* Tilt-Effekt */
  const tiltEls = qsa("[data-tilt]");
  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouch && tiltEls.length) {
    tiltEls.forEach((el) => {
      const intensity = el.getAttribute("data-tilt-intensity");
      const maxTilt = intensity === "strong" ? 8 : 5;

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

  /* Fake Form Submit */
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
        form.reset();
      }, 2400);
    });
  }
});
