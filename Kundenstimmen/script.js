// ================================
// Kundenstimmen – echte Stimmen
// ================================
// Data (NUR echte Stimmen)
const TESTIMONIALS = [
  {
    name: "Kadir Türker",
    company: "",
    project: "Lexware / Buchhaltung",
    category: "Lexware / Buchhaltung",
    date: "",
    rating: 5,
    reviewUrl: "https://share.google/G8rUGNiKHrwcYACcD",
    quote:
`Frau Mesinger beherrscht die Buchhaltungssoftware Lexware sehr gut und verfügt über fundierte Fachkenntnisse in der Buchhaltung.
Sie arbeitet äußerst kompetent, geduldig und erklärt jeden einzelnen Schritt ruhig und verständlich.

Die Zusammenarbeit mit ihr ist sehr angenehm und effektiv.
Ich bin sehr froh, mit ihr zusammenzuarbeiten, und kann sie uneingeschränkt weiterempfehlen.`
  },
  {
    name: "Lara Nasser",
    company: "",
    project: "Lexware Hilfe",
    category: "Lexware / Buchhaltung",
    date: "",
    rating: 5,
    reviewUrl: "https://share.google/4QRtwL7w1mq6kJU1R",
    quote:
`Sehr nette Dame – sie konnte mir bei Lexware gut weiterhelfen.
Jetzt kann ich endlich meine Rechnung schreiben.

Kann ich nur weiter empfehlen 👍`
  },
  {
    name: "Stefanie Gralewski",
    company: "",
    project: "Zusammenarbeit",
    category: "Zusammenarbeit",
    date: "",
    rating: 5,
    reviewUrl: "https://share.google/u45JkvuWLUjfOqjs1",
    quote:
`Wow! Das lief richtig gut!

Danke Saskia, für die tolle Zusammenarbeit.
Faires Angebot, super schnelle und qualitativ sehr hochwertige Arbeit, dazu unglaublich nett.

Wir melden uns ganz sicher mit weiteren Aufträgen.`
  },
  {
    name: "Cornelia Arndt",
    company: "",
    project: "Lexware Coaching",
    category: "Lexware / Buchhaltung",
    date: "",
    rating: 5,
    reviewUrl: "https://share.google/xeMKTFXhKKCRrWRke",
    quote:
`Moin, gestern hatte ich ein erstes Coaching in Sachen Lexware Office. Mir wurden die mir unklaren Abläufe sehr gut erklärt und gezeigt.

Auch wurde mir von Frau Mesinger angeboten, mein Lexware-Konto zu bereinigen (ich hatte etliches noch nicht gebucht). Sie war so zügig damit durch, wo ich sicher Tage dran gesessen hätte.

Bin rundum zufrieden. Vielen Dank und gern wieder, falls ich nochmal Hilfe brauche.`
  },
  {
    name: "Roland Dölker",
    company: "",
    project: "Zusammenarbeit",
    category: "Zusammenarbeit",
    date: "",
    rating: 5,
    reviewUrl: "https://maps.app.goo.gl/izjjFYudG7jHhkSm9",
    quote:
`Sehr netter Kontakt, kompetent und verwendet immer neueste Technik.

Fördert das Mitwirken und die Zuarbeitung der Abschlüsse.`
  },
  {
    name: "Mustafa Bayindir",
    company: "",
    project: "Zusammenarbeit",
    category: "Zusammenarbeit",
    date: "",
    rating: 5,
    reviewUrl: "https://maps.app.goo.gl/KgnqXwxHvNmJVH727",
    quote:
`Ich kann nur sagen: jederzeit freundlich und hilfsbereit.

Top Leistungen, schnell und zuverlässig.

Wer mit Profis arbeiten möchte, dem kann ich sie nur weiterempfehlen.`
  },
  {
    name: "Beate Oehlmann",
    company: "",
    project: "Zusammenarbeit",
    category: "Zusammenarbeit",
    date: "",
    rating: 5,
    reviewUrl: "https://www.facebook.com/share/1Jfg3Lcciz/?mibextid=wwXIfr",
    quote:
`Sorgfältige, kompetente Arbeit.

Vermittelt Sicherheit, auch im verlässlichen Umgang.

Klare Empfehlung. Auch ich bin Wiederholungstäter – nicht ohne Grund. 👍`
  }
];

// Elements
const grid = document.getElementById("testimonialsGrid");
const empty = document.getElementById("emptyState");
const countPill = document.getElementById("countPill");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(s) {
  return String(s ?? "").toLowerCase().trim();
}

function formatDate(iso) {
  if (!iso) return "";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);

  if (!match) return iso;

  return `${match[3]}.${match[2]}.${match[1]}`;
}

function matches(testimonial, query, category) {
  const searchableText = [
    testimonial.name,
    testimonial.company,
    testimonial.category,
    testimonial.project,
    testimonial.quote
  ]
    .map(normalize)
    .join(" ");

  const matchesQuery = !query || searchableText.includes(query);
  const matchesCategory =
    !category ||
    normalize(testimonial.category) === normalize(category);

  return matchesQuery && matchesCategory;
}

function starsHtml(rating = 5) {
  const normalizedRating = Math.max(
    0,
    Math.min(5, Math.round(Number(rating) || 0))
  );

  const fullStars = "★★★★★".slice(0, normalizedRating);
  const emptyStars = "☆☆☆☆☆".slice(0, 5 - normalizedRating);

  return `
    <span
      class="stars"
      aria-label="${normalizedRating} von 5 Sternen"
    >
      ${fullStars}${emptyStars}
    </span>
  `;
}

// Macht alle Karten mit einer reviewUrl vollständig klickbar.
function bindCardClicks() {
  if (!grid) return;

  grid.querySelectorAll(".tcard[data-href]").forEach((card) => {
    if (card.dataset.bound === "1") return;

    card.dataset.bound = "1";

    const url = card.getAttribute("data-href");

    if (!url) return;

    const openUrl = () => {
      window.open(url, "_blank", "noopener,noreferrer");
    };

    card.style.cursor = "pointer";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Kundenstimme öffnen");

    card.addEventListener("click", (event) => {
      const interactiveElement = event.target.closest(
        "a, button, input, textarea, select, label"
      );

      if (interactiveElement) return;

      openUrl();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openUrl();
      }
    });
  });
}

function render(list) {
  if (!grid) return;

  grid.innerHTML = list
    .map((testimonial) => {
      const name = esc(testimonial.name || "Anonym");

      const subParts = [
        testimonial.company,
        testimonial.project
      ]
        .filter(Boolean)
        .map(esc);

      const sub = subParts.length
        ? subParts.join(" • ")
        : "—";

      const tag = testimonial.category
        ? `<span class="tag">${esc(testimonial.category)}</span>`
        : `<span class="tag">Feedback</span>`;

      const date = testimonial.date
        ? esc(formatDate(testimonial.date))
        : "";

      const rating = starsHtml(testimonial.rating ?? 5);

      const quoteHtml = String(testimonial.quote || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((paragraph) => `<p>${esc(paragraph)}</p>`)
        .join("");

      const href = String(testimonial.reviewUrl || "").trim();
      const hrefAttr = esc(href);

      const clickableOverlay = href
        ? `
          <a
            class="tcard__overlay"
            href="${hrefAttr}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Kundenstimme öffnen"
          ></a>
        `
        : "";

      return `
        <article
          class="tcard ${href ? "tcard--clickable" : ""}"
          ${href ? `data-href="${hrefAttr}"` : ""}
        >
          ${clickableOverlay}

          <div class="tcard__top">
            <div class="tcard__meta">
              <h3 class="tcard__name">${name}</h3>
              <p class="tcard__sub">${sub}</p>
            </div>

            <div class="tcard__right">
              ${tag}
              ${rating}
            </div>
          </div>

          <div class="tcard__quote">
            ${quoteHtml}
          </div>

          <div class="tcard__foot">
            <span>${date}</span>

            ${
              href
                ? `<span class="tcard__hint">Kundenstimme öffnen →</span>`
                : `<span></span>`
            }
          </div>
        </article>
      `;
    })
    .join("");

  const count = list.length;

  if (countPill) {
    countPill.textContent =
      `${count} ${count === 1 ? "Eintrag" : "Einträge"}`;
  }

  if (empty) {
    empty.style.display =
      list.length === 0
        ? "block"
        : "none";
  }

  bindCardClicks();
}

function applyFilters() {
  const query = normalize(searchInput?.value);
  const category = categorySelect?.value || "";

  const filteredTestimonials = TESTIMONIALS.filter((testimonial) =>
    matches(testimonial, query, category)
  );

  render(filteredTestimonials);
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (categorySelect) {
  categorySelect.addEventListener("change", applyFilters);
}

// Initiale Darstellung
render(TESTIMONIALS);

// ================================
// Scrollbar + Year + Reveal
// ================================
const fill = document.getElementById("scrollFill");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function onScroll() {
  const documentElement = document.documentElement;
  const maxScroll =
    documentElement.scrollHeight - documentElement.clientHeight || 1;

  const progress =
    (documentElement.scrollTop / maxScroll) * 100;

  if (fill) {
    fill.style.width = `${progress}%`;
  }
}

window.addEventListener("scroll", onScroll, {
  passive: true
});

onScroll();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle(
          "in",
          entry.isIntersecting
        );
      });
    },
    {
      threshold: 0.14
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("in");
  });
}
