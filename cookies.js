(() => {
  "use strict";

  // =========================
  // KONFIG
  // =========================
  const API_BASE = "https://saskia-analytics-api.florianfloki1.workers.dev";

  // pro Tab/Session gültig (site-intern ok, aber nicht "für immer")
  const CONSENT_SESSION_KEY = "SM_COOKIE_CONSENT_SESSION_V1"; // sessionStorage

  // optional mirror (für Debug / Pills)
  const CONSENT_MIRROR_LOCAL_KEY = "SM_COOKIE_CONSENT_V1"; // localStorage

  // =========================
  // Helpers
  // =========================
  const $ = (sel, root = document) => root.querySelector(sel);

  const safeJson = (obj) => {
    try { return JSON.stringify(obj); } catch { return "{}"; }
  };

  const track = async (type, page) => {
    try {
      await fetch(`${API_BASE}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeJson({ type, page })
      });
    } catch {
      // silent
    }
  };

  const getConsent = () => sessionStorage.getItem(CONSENT_SESSION_KEY);
  const setConsent = (val) => {
    sessionStorage.setItem(CONSENT_SESSION_KEY, val);
    try { localStorage.setItem(CONSENT_MIRROR_LOCAL_KEY, val); } catch {}
  };
  const clearConsent = () => {
    sessionStorage.removeItem(CONSENT_SESSION_KEY);
    try { localStorage.removeItem(CONSENT_MIRROR_LOCAL_KEY); } catch {}
  };

  // Startseite erkennen: / oder /index.html oder /index.htm
  const isHomePath = () => {
    const p = (location.pathname || "/").toLowerCase();
    return p === "/" || p.endsWith("/index.html") || p.endsWith("/index.htm");
  };

  // Reload erkennen (modern + fallback + hard fallback)
  const isReload = () => {
    // 1) modern
    try {
      const nav = performance.getEntriesByType?.("navigation")?.[0];
      if (nav?.type) return nav.type === "reload";
    } catch {}

    // 2) deprecated
    try {
      if (performance.navigation) return performance.navigation.type === 1;
    } catch {}

    // 3) hard fallback: reload flag aus session vergleichen
    //    Idee: bei jedem Load speichern wir loadId; wenn es schon existiert und wir sind HOME,
    //    dann behandeln wir es als "Reload/Return within tab"
    return false;
  };

  const injectBannerIfMissing = () => {
    if ($("#cookieBanner")) return;

    const div = document.createElement("div");
    div.id = "cookieBanner";
    div.setAttribute("style", `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      max-width: 960px;
      width: calc(100% - 32px);
      background: rgba(5,7,12,.95);
      border: 1px solid rgba(214,178,94,.28);
      border-radius: 18px;
      padding: 18px 22px;
      z-index: 999999;
      display: none;
      box-shadow: 0 22px 60px rgba(0,0,0,.82);
    `);

    div.innerHTML = `
      <p style="margin:0 0 14px;font-size:.9rem;opacity:.92;color:#f7f2eb;line-height:1.5;">
        Diese Website verwendet Cookies für statistische Analysezwecke.
        Weitere Informationen finden Sie in der
        <a href="cookies.html" style="color:#ffd979;text-decoration:none;">Cookie-Richtlinie</a>.
      </p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button id="cookieAccept" style="
          position:relative;display:inline-flex;align-items:center;justify-content:center;
          padding:10px 26px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;
          color:#fdf5ee;border-radius:999px;border:1px solid rgba(255,211,106,.68);
          background: linear-gradient(145deg, rgba(0,0,0,.5), rgba(0,0,0,.9));
          cursor:pointer;box-shadow:0 16px 34px rgba(0,0,0,.8);
        ">Akzeptieren</button>

        <button id="cookieDecline" style="
          position:relative;display:inline-flex;align-items:center;justify-content:center;
          padding:10px 26px;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;
          color:#fdf5ee;border-radius:999px;border:1px solid rgba(255,211,106,.35);
          background: rgba(8,10,14,.35);
          cursor:pointer;box-shadow:0 12px 24px rgba(0,0,0,.7);
        ">Ablehnen</button>
      </div>
    `;

    document.body.appendChild(div);
  };

  const showBanner = () => { const b = $("#cookieBanner"); if (b) b.style.display = "block"; };
  const hideBanner = () => { const b = $("#cookieBanner"); if (b) b.style.display = "none"; };

  // =========================
  // BOOT (DOM READY)
  // =========================
  const boot = async () => {
    const page = location.pathname || "/";

    // immer pageview
    track("pageview", page);

    // Banner garantieren (falls HTML fehlt/ID falsch ist)
    injectBannerIfMissing();

    // *** DAS ist der Knackpunkt ***
    // Bei HOME: wenn wirklich Reload -> Consent reset
    // Zusätzlich: wenn wir HOME sind und sessionStorage schon einen "homeSeen" Marker hat,
    // dann behandeln wir "neuer Aufruf der Startseite im gleichen Tab" ebenfalls wie Reload.
    const HOME_SEEN_KEY = "SM_HOME_SEEN_V1";
    const homeSeen = sessionStorage.getItem(HOME_SEEN_KEY);

    if (isHomePath()) {
      // Marker setzen
      sessionStorage.setItem(HOME_SEEN_KEY, "1");

      // echte reload detection
      if (isReload()) {
        clearConsent();
      } else if (homeSeen) {
        // Fallback: wenn Startseite in diesem Tab schonmal offen war,
        // und wir sind wieder hier -> neu abfragen.
        // Das triggert zuverlässig bei Ctrl+R/F5, aber NICHT wenn du per interner Nav
        // zurückkommst (weil dann normalerweise ein Referrer vorhanden ist).
        const ref = document.referrer || "";
        const sameOrigin = ref && ref.startsWith(location.origin);
        if (!sameOrigin) {
          clearConsent();
        }
      }
    }

    // Consent schon da?
    const c = getConsent();
    if (c === "accepted" || c === "declined") {
      hideBanner();
      return;
    }

    // sonst anzeigen + Buttons
    showBanner();

    const btnAccept = $("#cookieAccept");
    const btnDecline = $("#cookieDecline");
    if (!btnAccept || !btnDecline) return;

    btnAccept.onclick = null;
    btnDecline.onclick = null;

    btnAccept.addEventListener("click", async () => {
      setConsent("accepted");
      hideBanner();
      await track("accept", page);
      window.dispatchEvent(new CustomEvent("sm:cookie-consent", { detail: { value: "accepted" } }));
    });

    btnDecline.addEventListener("click", async () => {
      setConsent("declined");
      hideBanner();
      await track("decline", page);
      window.dispatchEvent(new CustomEvent("sm:cookie-consent", { detail: { value: "declined" } }));
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
