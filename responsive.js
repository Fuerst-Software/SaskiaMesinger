/* ===========================================================
   responsive.js
   Mobile-Fixes für Startseite + Unterseiten
   - Überschriften/WILLKOMMEN nicht abschneiden
   - saubere Zentrierung, Padding, Scroll-Margin
   - Overlay-Menü (3 Punkte) mobil angenehm
=========================================================== */

(() => {
  const BP = 900; // bei dir ist 900 ohnehin dein CSS breakpoint

  const qs  = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

  function isMobile() {
    return window.innerWidth <= BP;
  }

  function setStyle(el, styles) {
    if (!el) return;
    for (const k in styles) el.style[k] = styles[k];
  }

  /* -----------------------------------------------------------
     1) Lange Headlines sauber umbrechen (kein Abschneiden)
  ----------------------------------------------------------- */
  function fixHeadlines() {
    if (!isMobile()) return;

    const headlines = qsa('h1, h2, .welcome-title, .title, .title--xl, .section-title');

    headlines.forEach(h => {
      // Umbruch + kein Overflow-Cut
      setStyle(h, {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'clip',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        hyphens: 'auto',
        lineHeight: '1.12',
        textAlign: 'center'
      });
    });

    // Speziell: WILLKOMMEN auf Startseite – Letter-Spacing + Padding, damit es nie „abreißt“
    const welcome = qs('.welcome-title');
    if (welcome) {
      setStyle(welcome, {
        paddingLeft: '10px',
        paddingRight: '10px'
      });

      // Wenn ultra schmal, Letter-Spacing etwas reduzieren (abschneide-sicher)
      if (window.innerWidth <= 420) {
        setStyle(welcome, { letterSpacing: '.12em' });
      }
      if (window.innerWidth <= 360) {
        setStyle(welcome, { letterSpacing: '.10em' });
      }
    }
  }

  /* -----------------------------------------------------------
     2) Page Padding / Zentrierung mobile feintunen
  ----------------------------------------------------------- */
  function fixLayoutSpacing() {
    if (!isMobile()) return;

    // Startseite nutzt .page als wrapper
    const page = qs('.page');
    if (page) {
      // Seite auf Mobile angenehm schmal
      setStyle(page, {
        paddingLeft: '18px',
        paddingRight: '18px'
      });
    }

    // Unterseiten haben main.page auch, aber oft ohne fixed header
    // => sicherstellen, dass oben nichts „klebt“
    const mainPage = qs('main.page');
    if (mainPage) {
      setStyle(mainPage, {
        paddingLeft: '18px',
        paddingRight: '18px'
      });
    }

    // Cards/Blöcke zentrieren
    qsa('.hero, .hero__title, .hero__actions, .section__head, .block__head, .card, .stack').forEach(el => {
      setStyle(el, { marginLeft: 'auto', marginRight: 'auto' });
    });

    // Buttons/Aktionen sauber zentriert
    qsa('.hero__actions, .hero-back, .cta-row, .footer__links, .footer-links').forEach(el => {
      setStyle(el, {
        justifyContent: 'center',
        textAlign: 'center'
      });
    });
  }

  /* -----------------------------------------------------------
     3) Scroll-Margin für Anker (damit Header nichts verdeckt)
  ----------------------------------------------------------- */
  function fixAnchorScrollMargin() {
    // gilt auch auf Desktop, aber nur wenn fixed header existiert
    const header = qs('.site-header');
    if (!header) return;

    const headerH = header.getBoundingClientRect().height || 78;

    // Auf Startseite: Anker werden sonst hinter dem Header versteckt
    qsa('section[id], [id].content-block, .block[id]').forEach(el => {
      el.style.scrollMarginTop = `${Math.round(headerH + 14)}px`;
    });
  }

  /* -----------------------------------------------------------
     4) Overlay Menü mobile: angenehm, nicht gequetscht
  ----------------------------------------------------------- */
  function fixOverlayMenu() {
    if (!isMobile()) return;

    const overlayInner = qs('.overlay__inner');
    if (overlayInner) {
      setStyle(overlayInner, {
        paddingLeft: '18px',
        paddingRight: '18px'
      });
    }

    // Links nicht zu groß/zu breit auf sehr kleinen Phones
    qsa('.overlay__link').forEach(a => {
      setStyle(a, {
        maxWidth: '100%',
        display: 'inline-block',
        textAlign: 'center'
      });
    });

    // Close Button besser erreichbar
    const close = qs('.overlay__close');
    if (close) {
      setStyle(close, { padding: '10px 12px' });
    }
  }

  /* -----------------------------------------------------------
     5) Nav-Grids mobile: falls Texte umbrechen / Höhe
  ----------------------------------------------------------- */
  function fixNavGrids() {
    if (!isMobile()) return;

    // Startseite: .nav-grid .nav-btn
    qsa('.nav-btn').forEach(btn => {
      setStyle(btn, {
        height: 'auto',
        minHeight: '96px',
        padding: '16px 18px',
        lineHeight: '1.15'
      });
    });

    // Unterseiten: .navgrid__btn
    qsa('.navgrid__btn').forEach(btn => {
      setStyle(btn, {
        height: 'auto',
        minHeight: '64px',
        padding: '14px 16px',
        lineHeight: '1.15',
        whiteSpace: 'normal'
      });
    });
  }

  /* -----------------------------------------------------------
     6) Scrollbar oben: Klassen-Unterschiede abfangen
  ----------------------------------------------------------- */
  function normalizeScrollbar() {
    // bei dir gibt es .scroll-bar und .scrollbar
    const a = qs('.scroll-bar__fill');
    const b = qs('.scrollbar__fill');

    // Wenn beide existieren, alles ok. Wenn nur eins existiert, kein Problem.
    // Kein Style nötig – aber wir verhindern „0 height“ falls mobile zoom
    const bars = qsa('.scroll-bar, .scrollbar');
    bars.forEach(bar => setStyle(bar, { transform: 'translateZ(0)' }));
  }

  /* -----------------------------------------------------------
     APPLY + RESET on desktop
  ----------------------------------------------------------- */
  function resetInlineStylesOnDesktop() {
    if (isMobile()) return;

    // Wir entfernen nicht alles aggressiv, nur unsere typischen inline overrides
    const targets = qsa('h1, h2, .welcome-title, .title, .title--xl, .section-title, .nav-btn, .navgrid__btn');
    targets.forEach(el => {
      el.style.whiteSpace = '';
      el.style.overflow = '';
      el.style.textOverflow = '';
      el.style.wordBreak = '';
      el.style.overflowWrap = '';
      el.style.hyphens = '';
      el.style.lineHeight = '';
      el.style.textAlign = '';
      el.style.paddingLeft = '';
      el.style.paddingRight = '';
      el.style.letterSpacing = '';
      el.style.height = '';
      el.style.minHeight = '';
      el.style.padding = '';
    });

    const wrappers = qsa('.page, main.page, .overlay__inner, .hero__actions, .footer__links, .footer-links');
    wrappers.forEach(el => {
      el.style.paddingLeft = '';
      el.style.paddingRight = '';
      el.style.justifyContent = '';
      el.style.textAlign = '';
      el.style.marginLeft = '';
      el.style.marginRight = '';
    });
  }

  function apply() {
    normalizeScrollbar();
    fixAnchorScrollMargin();

    if (isMobile()) {
      fixHeadlines();
      fixLayoutSpacing();
      fixOverlayMenu();
      fixNavGrids();
    } else {
      resetInlineStylesOnDesktop();
    }
  }

  // Initial + Events
  apply();
  window.addEventListener('resize', apply, { passive: true });
  window.addEventListener('orientationchange', apply, { passive: true });
})();
/* ===========================================================
   MOBILE OVERLAY NAV – SCROLL & UX FIX
=========================================================== */
(function () {
  const BP = 900;

  function isMobile() {
    return window.innerWidth <= BP;
  }

  const overlay = document.querySelector('.overlay');
  const inner   = document.querySelector('.overlay__inner');

  if (!overlay || !inner) return;

  function enableOverlayScroll() {
    if (!isMobile()) return;

    // Overlay volle Höhe
    overlay.style.height = '100vh';
    overlay.style.overflow = 'hidden';

    // Innerer Bereich scrollbar
    inner.style.maxHeight = '100vh';
    inner.style.overflowY = 'auto';
    inner.style.webkitOverflowScrolling = 'touch'; // iOS smooth scroll
    inner.style.paddingBottom = '64px'; // Luft unten, damit letzter Punkt erreichbar ist

    // Body Scroll sperren, solange Overlay offen ist
    const observer = new MutationObserver(() => {
      if (overlay.classList.contains('overlay--open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    observer.observe(overlay, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Initial
  enableOverlayScroll();

  // Re-Init bei Resize / Rotation
  window.addEventListener('resize', enableOverlayScroll, { passive: true });
  window.addEventListener('orientationchange', enableOverlayScroll, { passive: true });
})();
/* ============================================================
   responsive.js — Mobile Worttrennung Fix (Saskia Mesinger + Willkommen)
   ============================================================ */

(function () {
  "use strict";

  function applyMobileFixes() {
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    // Elemente finden (bitte ggf. Selector anpassen, falls dein Logo anders heißt)
    const brand = document.querySelector(".brand, .logo, .site-brand, .nav-brand, .header-brand, .brandmark");
    const brandTitle = document.querySelector(".brand-title, .logo-title, .brand__title, .site-title");
    const heroTitle = document.getElementById("hero-title");

    // 1) Worttrennung generell verhindern (gegen Saskia Mesin-ger / Willkom-men)
    const targets = [brand, brandTitle, heroTitle].filter(Boolean);
    targets.forEach((el) => {
      el.style.hyphens = "none";
      el.style.webkitHyphens = "none";
      el.style.msHyphens = "none";
      el.style.wordBreak = "normal";
      el.style.overflowWrap = "normal";
      el.style.whiteSpace = "normal";
    });

    // 2) „Saskia Mesinger“ auf Mobile gezielt 2-zeilig machen
    //    (Nur wenn wir ein Brand-Element haben und es auch wirklich "Saskia Mesinger" enthält)
    if (isMobile && (brandTitle || brand)) {
      const el = brandTitle || brand;
      const text = (el.textContent || "").trim();

      // Nur eingreifen, wenn es wirklich um Saskia Mesinger geht
      if (/saskia\s+mesinger/i.test(text)) {
        // HTML sicher setzen (nur Text, kein fremder Input)
        el.innerHTML = "Saskia<br>Mesinger";
        el.style.lineHeight = "1.05";
      }
    }

    // 3) „WILLKOMMEN“ skalieren, sodass es auf Mobile nicht getrennt wird
    if (heroTitle) {
      // Kein Trennen, immer am Stück
      heroTitle.style.whiteSpace = "nowrap";
      heroTitle.style.wordBreak = "keep-all";

      // Font-size dynamisch klein genug halten (ohne abzuschneiden)
      // clamp(min, preferred, max)
      heroTitle.style.fontSize = isMobile ? "clamp(1.6rem, 10vw, 3.2rem)" : "";
      heroTitle.style.letterSpacing = isMobile ? "clamp(.14em, 1.6vw, .26em)" : "";
      heroTitle.style.maxWidth = "100%";
    }
  }

  // Initial + on resize/orientation
  window.addEventListener("DOMContentLoaded", applyMobileFixes);
  window.addEventListener("resize", applyMobileFixes, { passive: true });
})();
