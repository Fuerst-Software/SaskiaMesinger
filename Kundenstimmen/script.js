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
  }
];

// Elements
const grid = document.getElementById('testimonialsGrid');
const empty = document.getElementById('emptyState');
const countPill = document.getElementById('countPill');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function normalize(s){ return String(s ?? "").toLowerCase().trim(); }

function formatDate(iso){
  if(!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if(!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

function matches(t, q, cat){
  const hay = [t.name, t.company, t.category, t.project, t.quote].map(normalize).join(" ");
  const okQ = !q || hay.includes(q);
  const okC = !cat || normalize(t.category) === normalize(cat);
  return okQ && okC;
}

function starsHtml(rating = 5){
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  // 5-Sterne-String, ohne Icons (robust, sauber)
  const full = "★★★★★".slice(0, r);
  const empty = "☆☆☆☆☆".slice(0, 5 - r);
  return `<span class="stars" aria-label="${r} von 5 Sternen">${full}${empty}</span>`;
}

function render(list){
  if (!grid) return;

  grid.innerHTML = list.map(t => {
    const name = esc(t.name || "Anonym");
    const subParts = [t.company, t.project].filter(Boolean).map(esc);
    const sub = subParts.length ? subParts.join(" • ") : "—";
    const tag = t.category ? `<span class="tag">${esc(t.category)}</span>` : `<span class="tag">Feedback</span>`;
    const date = t.date ? esc(formatDate(t.date)) : "";
    const rating = starsHtml(t.rating ?? 5);

    const quoteHtml = String(t.quote || "")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(p => `<p>${esc(p)}</p>`)
      .join("");

    const href = t.reviewUrl ? esc(t.reviewUrl) : "";
    const clickableOpen = href ? `<a class="tcard__overlay" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="Google Rezension öffnen"></a>` : "";

    return `
      <article class="tcard ${href ? "tcard--clickable" : ""}">
        ${clickableOpen}

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

        <div class="tcard__quote">${quoteHtml}</div>

        <div class="tcard__foot">
          <span>${date}</span>
          ${href ? `<span class="tcard__hint">Google Rezension öffnen →</span>` : `<span></span>`}
        </div>
      </article>
    `;
  }).join("");

  const n = list.length;
  if (countPill) countPill.textContent = `${n} ${n === 1 ? "Eintrag" : "Einträge"}`;

  // Empty-State: nur anzeigen wenn insgesamt KEINE Testimonials existieren
  if (empty) empty.style.display = (TESTIMONIALS.length === 0) ? "block" : "none";
}

function applyFilters(){
  const q = normalize(searchInput?.value);
  const cat = categorySelect?.value || "";
  const filtered = TESTIMONIALS.filter(t => matches(t, q, cat));
  render(filtered);
}

if (searchInput) searchInput.addEventListener('input', applyFilters);
if (categorySelect) categorySelect.addEventListener('change', applyFilters);

// Initial
render(TESTIMONIALS);

// ================================
// Scrollbar + Year + Reveal
// ================================
const fill = document.getElementById('scrollFill');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function onScroll(){
  const h = document.documentElement;
  const max = (h.scrollHeight - h.clientHeight) || 1;
  const p = (h.scrollTop / max) * 100;
  if (fill) fill.style.width = p + "%";
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
