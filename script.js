(() => {
// Menu mobile
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
if (btn) btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
// Tout ce qui dépend du contenu démarre une fois la page construite par render.js
const demarrer = () => {
// Formulaire de devis : ouvre WhatsApp avec le message prérempli
const form = document.getElementById('devis');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const msg = `Bonjour Adalis, je souhaite un devis.\nNom : ${d.get('nom')}\nTéléphone : ${d.get('tel')}\nProjet : ${d.get('projet')}\nDétails : ${d.get('details')}`;
  window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank');
});

// ===== Animations =====
const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Titres : apparition mot par mot
document.querySelectorAll('.hero h1, .page-head h1').forEach(h => {
  const mots = h.textContent.trim().split(/\s+/);
  h.setAttribute('aria-label', h.textContent.trim());
  h.innerHTML = mots.map((m, i) => `<span class="w" style="--i:${i}" aria-hidden="true">${m}</span>`).join(' ');
});
// Texte et boutons du haut de page
document.querySelectorAll('.hero p, .hero .btn, .page-head p').forEach((el, i) => {
  el.classList.add('rise');
  el.style.animationDelay = (0.7 + i * 0.15) + 's';
});

// Diaporama de l’accueil
const slides = [...document.querySelectorAll('.slide')];
if (slides.length) {
  const hero = document.querySelector('.hero');
  const dots = document.createElement('div');
  dots.className = 'dots';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Image ' + (i + 1));
    b.onclick = () => { aller(i); relancer(); };
    dots.appendChild(b);
  });
  hero.appendChild(dots);
  let cur = 0, timer;
  function aller(i) {
    slides[cur].classList.remove('active');
    dots.children[cur].classList.remove('on');
    cur = i;
    slides[cur].classList.add('active');
    dots.children[cur].classList.add('on');
  }
  function relancer() { clearInterval(timer); timer = setInterval(() => aller((cur + 1) % slides.length), 5500); }
  aller(0); relancer();
}

// Apparition au défilement
const cibles = document.querySelectorAll('section h2, section .lead, section .card, .big > div, .tablewrap, ul.plain li, .note, .cta-band .btn, form, .contact-grid > div, .fig');
cibles.forEach(el => {
  el.classList.add('reveal');
  const frere = [...el.parentElement.children].indexOf(el);
  el.style.transitionDelay = Math.min(frere, 5) * 90 + 'ms';
});
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { const t = e.target; t.classList.add('in'); io.unobserve(t); compter(t); setTimeout(() => t.style.transitionDelay = '0ms', 1500); }
}), { threshold: 0.15 });
cibles.forEach(el => io.observe(el));

// Chiffres qui défilent
function compter(el) {
  const b = el.matches('.big > div') ? el.querySelector('b') : null;
  if (!b || reduit || b.dataset.ok) return;
  const txt = b.textContent;
  const m = txt.match(/^(\d[\d\s]*(?:,\d+)?)(.*)$/);
  if (!m || txt.includes('–')) return;
  b.dataset.ok = 1;
  const dec = (m[1].split(',')[1] || '').length;
  const fin = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'));
  const debut = performance.now();
  (function pas(t) {
    const p = Math.min((t - debut) / 1400, 1), v = fin * (1 - Math.pow(1 - p, 3));
    b.textContent = v.toLocaleString('fr-FR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[2];
    if (p < 1) requestAnimationFrame(pas); else b.textContent = txt;
  })(debut);
}

// Menu qui prend de l’ombre au défilement
const entete = document.querySelector('.site-header');
addEventListener('scroll', () => entete.classList.toggle('scrolled', scrollY > 20), { passive: true });

};
// Si render.js a déjà fini avant le chargement de ce fichier, on démarre tout de suite
if (window.__rendu) demarrer(); else document.addEventListener('rendu', demarrer);
})();
