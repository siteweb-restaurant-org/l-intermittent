/* Gravures de poissons, dessinées au trait — clin d'œil aux cadres
   accrochés dans la salle. Tracé généré pour garder trois silhouettes
   cohérentes (sardine élancée, dorade haute, maquereau rayé). */

const FISH = {
  sardine: { name: 'Sardine', latin: 'Sardina pilchardus', h: 24, stripes: 0, spots: 0 },
  dorade: { name: 'Dorade royale', latin: 'Sparus aurata', h: 40, stripes: 0, spots: 7 },
  maquereau: { name: 'Maquereau', latin: 'Scomber scombrus', h: 27, stripes: 6, spots: 0 },
}

function svg(kind) {
  const { h } = FISH[kind]
  const y = 55
  const n = (v) => Math.round(v * 10) / 10
  const p = []
  // corps
  p.push(`<path d="M14 ${y} C 46 ${n(y - h)}, 120 ${n(y - h * 1.12)}, 160 ${y} C 120 ${n(y + h * 1.08)}, 46 ${n(y + h * 0.94)}, 14 ${y} Z"/>`)
  // queue
  p.push(`<path d="M158 ${y} L 206 ${n(y - h * 0.8)} C 192 ${y}, 192 ${y}, 206 ${n(y + h * 0.8)} Z"/>`)
  // nageoire dorsale + ventrale
  p.push(`<path d="M 78 ${n(y - h * 0.92)} L 102 ${n(y - h * 1.75)} L 126 ${n(y - h * 0.7)}"/>`)
  p.push(`<path d="M 84 ${n(y + h * 0.88)} L 96 ${n(y + h * 1.5)} L 114 ${n(y + h * 0.78)}"/>`)
  // pectorale, ouïe, ligne latérale
  p.push(`<path d="M 58 ${n(y + h * 0.18)} q 14 ${n(h * 0.6)} 30 ${n(h * 0.3)}"/>`)
  p.push(`<path d="M 42 ${n(y - h * 0.62)} C 51 ${y}, 51 ${y}, 42 ${n(y + h * 0.66)}"/>`)
  p.push(`<path d="M 46 ${n(y - h * 0.04)} C 90 ${n(y - h * 0.24)}, 124 ${n(y - h * 0.12)}, 158 ${y}" stroke-dasharray="3 5"/>`)
  // bouche
  p.push(`<path d="M 14 ${y} l 11 ${n(-h * 0.14)}"/>`)
  // rayures du maquereau
  for (let i = 0; i < FISH[kind].stripes; i++) {
    const x = 56 + i * 17
    p.push(`<path d="M ${x} ${n(y - h * 0.86)} q ${n(h * 0.3)} ${n(h * 0.3)} ${n(-h * 0.1)} ${n(h * 0.62)}"/>`)
  }
  // écailles de la dorade
  for (let i = 0; i < FISH[kind].spots; i++) {
    const x = 60 + (i % 4) * 22
    const yy = y - h * 0.4 + Math.floor(i / 4) * h * 0.5
    p.push(`<path d="M ${x} ${n(yy)} a 7 7 0 0 1 12 0"/>`)
  }
  return `<svg viewBox="0 0 220 110" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
    ${p.join('\n    ')}
    <circle cx="31" cy="${n(y - h * 0.2)}" r="3.4" fill="currentColor" stroke="none"/>
  </svg>`
}

/** Une gravure encadrée, prête à accrocher au mur. */
export function fishPlate(kind, no = '') {
  const f = FISH[kind]
  return `<figure class="plate">
    <div class="plate__art">${svg(kind)}</div>
    <figcaption class="plate__cap"><span>${f.name}</span><span class="plate__latin">${f.latin}</span></figcaption>
    ${no ? `<span class="plate__no">${no}</span>` : ''}
  </figure>`
}

export function fishWall(kinds = ['sardine', 'dorade', 'maquereau']) {
  return `<div class="wall">${kinds.map((k, i) => fishPlate(k, `Pl. ${['I', 'II', 'III'][i] || i + 1}`)).join('')}</div>`
}
