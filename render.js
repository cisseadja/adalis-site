(() => {
// Construit chaque page à partir des fichiers du dossier data/
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const btn = b => b && b.label ? `<a class="btn${b.style === 'alt' ? ' alt' : ''}" href="${esc(b.lien || '#')}">${esc(b.label)}</a>` : '';
const lead = (t, grand) => String(t || '').split(/\n\s*\n/).filter(p => p.trim()).map(p => `<p class="lead"${grand ? ' style="margin:0;font-size:20px"' : ''}>${esc(p.trim())}</p>`).join('');
const chiffres = l => l && l.length ? `<div class="big">${l.map(i => `<div><b>${esc(i.valeur)}</b><span>${esc(i.label)}</span></div>`).join('')}</div>` : '';
const liste = (l, une) => l && l.length ? `<ul class="plain"${une ? ' style="columns:1"' : ''}>${l.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
const note = t => t ? `<p class="note">${esc(t)}</p>` : '';
const carte = c => {
  const st = [c.format === 'carre' ? 'aspect-ratio:1/1' : '', c.cadrage ? 'object-position:' + esc(c.cadrage) : ''].filter(Boolean).join(';');
  const img = c.image ? `<img src="${esc(c.image)}" alt="${esc(c.alt)}" loading="lazy"${st ? ` style="${st}"` : ''}>` : '';
  return `<div class="card${c.image ? ' photo' : ''}">${img}<h3>${esc(c.titre)}</h3>${c.etiquette ? `<p class="etiquette">${esc(c.etiquette)}</p>` : ''}${c.texte ? `<p>${esc(c.texte)}</p>` : ''}</div>`;
};
const cartes = l => l && l.length ? `<div class="grid">${l.map(carte).join('')}</div>` : '';
const tableau = l => l && l.length ? `<div class="tablewrap"><table><thead><tr><th>Référence</th><th>Puissance</th><th>Cellules</th><th>Dimensions</th><th>Poids</th></tr></thead><tbody>${l.map(r => `<tr><td>${esc(r.reference)}</td><td>${esc(r.puissance)}</td><td>${esc(r.cellules)}</td><td>${esc(r.dimensions)}</td><td>${esc(r.poids)}</td></tr>`).join('')}</tbody></table></div><div style="height:20px"></div>` : '';

const types = {
  hero: s => `<div class="hero"><div class="slides" aria-hidden="true">${(s.images || []).map(i => `<div class="slide" style="background-image:url(${esc(i)})"></div>`).join('')}</div><div class="shade"></div><div class="wrap"><h1>${esc(s.titre)}</h1><p>${esc(s.texte)}</p>${(s.boutons || []).map(btn).join('')}</div></div>`,
  entete: s => `<div class="page-head"><div class="wrap"><h1>${esc(s.titre)}</h1><p>${esc(s.texte)}</p></div></div>`,
  section: s => `<section class="${s.fond === 'bande' ? 'band' : ''}"${s.serre ? ' style="padding-top:0"' : ''}><div class="wrap">${s.titre ? `<h2>${esc(s.titre)}</h2>` : ''}${lead(s.texte, s.grand)}${chiffres(s.chiffres)}${tableau(s.tableau)}${cartes(s.cartes)}${liste(s.liste)}${note(s.note)}${s.galerie && s.galerie.length ? `${s.galerie_titre ? `<h3 style="font-size:28px;margin:36px 0 16px">${esc(s.galerie_titre)}</h3>` : '<div style="height:28px"></div>'}${cartes(s.galerie.map(g => ({...g, format: 'carre'})))}` : ''}${btn(s.bouton)}</div></section>`,
  projet: s => `<section class="band"><div class="wrap split"><div><h2>${esc(s.titre)}</h2>${lead(s.texte)}${chiffres(s.chiffres)}${liste(s.liste, true)}${note(s.note)}</div><img class="fig" src="${esc(s.image)}" alt="${esc(s.alt)}" loading="lazy"></div></section>`,
  cta: s => `<section class="cta-band"><div class="wrap"><h2>${esc(s.titre)}</h2><p>${esc(s.texte)}</p>${btn(s.bouton)}</div></section>`,
  contact: (s, site) => `<section><div class="wrap contact-grid"><form id="devis"><label>Nom complet<input name="nom" required autocomplete="name"></label><label>Téléphone<input name="tel" type="tel" required autocomplete="tel"></label><label>Type de projet<select name="projet">${(site.types_projet || []).map(t => `<option>${esc(t)}</option>`).join('')}</select></label><label>Détails du projet<textarea name="details" rows="4"></textarea></label><button class="btn" type="submit">Envoyer sur WhatsApp</button></form><div><h2>Nous joindre</h2>${(site.telephones || []).map(t => `<a class="tel" href="tel:${esc(t.replace(/\s/g, ''))}">${esc(t)}</a>`).join('')}<p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p><p>${esc(site.adresse)}</p></div></div></section>`
};

(async () => {
  const main = document.querySelector('main[data-page]');
  try {
    const [site, page] = await Promise.all([
      fetch('data/site.json').then(r => r.json()),
      fetch('data/' + main.dataset.page + '.json').then(r => r.json())
    ]);
    window.WHATSAPP = site.whatsapp;
    document.title = page.titre_page + ' – ' + site.nom;
    main.innerHTML = page.sections.map(s => (types[s.type] || (() => ''))(s, site)).join('\n');
    const pied = document.querySelector('footer .wrap');
    if (pied) pied.textContent = `${site.nom.toUpperCase()} SARL · ${site.adresse} · NINEA ${site.ninea}`;
    const wa = document.querySelector('.wa');
    if (wa) wa.href = `https://wa.me/${site.whatsapp}?text=Bonjour%20Adalis%2C%20je%20souhaite%20un%20devis.`;
  } catch (e) {
    main.innerHTML = '<div class="wrap" style="padding:60px 20px"><p>Le contenu ne peut pas se charger. Ouvrez le site avec Live Server (ou en ligne), pas en double-cliquant sur le fichier.</p></div>';
  }
  window.__rendu = true;
  document.dispatchEvent(new Event('rendu'));
})();
})();
