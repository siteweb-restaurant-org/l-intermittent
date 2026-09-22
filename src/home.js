import { gsap, ScrollTrigger, initReveals, initParallax, isReduced } from './common.js'
import './home.css'
import { SIGNATURES, EVENTS, euro } from './data.js'
import { fishPlate } from './fish.js'

/* ═════════ Enseigne : lettres qui s'allument ═════════ */
const sign = document.querySelector('.hero__sign')
const letters = [...sign.textContent].map((ch) => {
  const s = document.createElement('span')
  s.className = 'l'
  s.textContent = ch
  s.setAttribute('aria-hidden', 'true')
  return s
})
sign.textContent = ''
sign.append(...letters)

function fitSign() {
  sign.style.fontSize = '100px'
  const pad = parseFloat(getComputedStyle(sign).paddingLeft) * 2
  const inner = [...letters].reduce((w, l) => w + l.getBoundingClientRect().width, 0)
  const avail = document.documentElement.clientWidth - pad
  sign.style.fontSize = `${Math.floor((avail / inner) * 100 * 0.995)}px`
}
fitSign()
document.fonts?.ready.then(fitSign)
window.addEventListener('resize', fitSign)

if (isReduced) {
  letters.forEach((l) => l.classList.add('on'))
} else {
  // allumage : lettre par lettre, deux néons capricieux
  const tl = gsap.timeline({ delay: 0.45 })
  letters.forEach((l, i) => {
    const t = i * 0.055 + Math.random() * 0.08
    if (i === 4 || i === 10) {
      tl.call(() => l.classList.add('on'), null, t)
        .call(() => l.classList.remove('on'), null, t + 0.07)
        .call(() => l.classList.add('on'), null, t + 0.16)
        .call(() => l.classList.remove('on'), null, t + 0.22)
        .call(() => l.classList.add('on'), null, t + 0.5)
    } else {
      tl.call(() => l.classList.add('on'), null, t)
    }
  })
  // un grésillement de temps en temps
  const buzz = () => {
    const l = letters[4 + Math.floor(Math.random() * 7)]
    l.classList.remove('on')
    setTimeout(() => l.classList.add('on'), 60 + Math.random() * 80)
    setTimeout(buzz, 5000 + Math.random() * 7000)
  }
  setTimeout(buzz, 4500)

  gsap.from('.hero__store', { scaleY: 0, duration: 1.1, ease: 'expo.out', delay: 0.1 })
  gsap.from('.hero__meta', { opacity: 0, y: 12, duration: 1, delay: 0.3, ease: 'expo.out' })
  gsap.from('.hero__lead, .hero__cta', { opacity: 0, y: 30, duration: 1.3, delay: 1.2, stagger: 0.12, ease: 'expo.out' })
  gsap.fromTo('.hero__main', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, delay: 0.9, ease: 'expo.inOut' })
  gsap.from('.hero__small', { opacity: 0, y: 60, duration: 1.4, delay: 1.5, ease: 'expo.out' })
  gsap.from('.hero .cap', { opacity: 0, duration: 1, delay: 2 })
  // relief : l'enseigne s'éloigne, la petite photo remonte
  gsap.to('.hero__sign', { yPercent: 38, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.hero__small', { y: -90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
}

document.getElementById('maisonPlate').innerHTML = fishPlate('sardine', 'Pl. I')

/* ═════════ Signatures : défilement horizontal ═════════ */
const track = document.getElementById('sigTrack')
track.innerHTML =
  SIGNATURES.map(
    (d, i) => `
  <li class="dish">
    <div class="dish__img"><img src="/img/${d.img}.jpg" alt="${d.name}" loading="lazy"><span class="dish__no plaque">N° ${String(i + 1).padStart(2, '0')}</span></div>
    <div class="dish__row"><h3 class="dish__name">${d.name}</h3><span class="dish__price">${euro(d.price)}</span></div>
    <p class="dish__note">${d.note}</p>
  </li>`,
  ).join('') +
  `<li class="dish dish--end"><a href="/carte.html"><span class="kicker">La carte complète</span><span class="sign">Entrées,<br>viandes,<br>poissons →</span><span class="serif">et une belle carte des vins</span></a></li>`

const bar = document.getElementById('sigBar')
const count = document.getElementById('sigCount')
const setProgress = (p) => {
  bar.style.transform = `scaleX(${0.06 + p * 0.94})`
  count.textContent = String(Math.min(10, 1 + Math.floor(p * 10))).padStart(2, '0')
}

const mm = gsap.matchMedia()
mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
  const dist = () => track.scrollWidth - document.documentElement.clientWidth
  const tween = gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: '.sig',
      pin: '.sig__pin',
      start: 'top top',
      end: () => `+=${dist()}`,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (st) => setProgress(st.progress),
    },
  })
  // légère inclinaison des photos pendant le glissement
  gsap.utils.toArray('.dish__img img').forEach((img) => {
    gsap.fromTo(img, { xPercent: -6, scale: 1.12 }, {
      xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.closest('.dish'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    })
  })
})
mm.add('(max-width: 900px)', () => {
  const vp = document.querySelector('.sig__viewport')
  const onS = () => setProgress(vp.scrollLeft / Math.max(1, vp.scrollWidth - vp.clientWidth))
  vp.addEventListener('scroll', onS, { passive: true })
  return () => vp.removeEventListener('scroll', onS)
})

/* ═════════ Une journée : l'heure et la lumière changent ═════════ */
const day = document.querySelector('.day')
const clock = document.getElementById('dayClock')
const label = document.getElementById('dayLabel')
const sun = document.getElementById('daySun')
const panels = gsap.utils.toArray('.dp')
let clockVal = { m: 8 * 60 }

function toMin(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function showClock() {
  const m = Math.round(clockVal.m)
  clock.textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

panels.forEach((p, i) => {
  ScrollTrigger.create({
    trigger: p,
    start: 'top 60%',
    end: 'bottom 60%',
    onToggle: (st) => {
      if (!st.isActive) return
      gsap.to(clockVal, { m: toMin(p.dataset.time), duration: isReduced ? 0 : 0.9, ease: 'power3.out', onUpdate: showClock })
      gsap.to(day, { '--bg': p.dataset.bg, '--fg': p.dataset.fg, duration: isReduced ? 0 : 1.1, ease: 'power2.out' })
      gsap.to(sun, { left: `${(i / (panels.length - 1)) * 100}%`, xPercent: -(i / (panels.length - 1)) * 100, duration: 1, ease: 'power3.out' })
      if (label.textContent !== p.dataset.label) {
        gsap.to(label, {
          opacity: 0, y: -8, duration: 0.25,
          onComplete: () => { label.textContent = p.dataset.label; gsap.to(label, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }) },
        })
      }
    },
  })
})
// le footer suivant (soirées) reste dans la nuit
ScrollTrigger.create({ trigger: '.soirees', start: 'top bottom', onEnter: () => gsap.set(day, { '--bg': '#0c0c0c', '--fg': '#ffffff' }) })

/* ═════════ Tableau à palettes ═════════ */
const FLAP = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.:'
const pad = (s, n) => (s.length > n ? s.slice(0, n) : s + ' '.repeat(n - s.length))
const rowsEl = document.getElementById('boardRows')
const flapCells = []

EVENTS.forEach((ev) => {
  const [d, name, h] = ev.board
  const row = document.createElement('a')
  row.className = 'brow'
  row.setAttribute('role', 'row')
  row.href = `/reserver.html?date=${ev.date}&occasion=${ev.tag === 'Match' ? 'match' : 'soiree'}`
  row.setAttribute('aria-label', `${ev.title}, ${d}, ${h} — réserver`)
  const group = (txt, n, cls = '') => {
    const g = document.createElement('span')
    g.className = `brow__cells ${cls}`
    g.setAttribute('aria-hidden', 'true')
    ;[...pad(txt, n)].forEach((ch) => {
      const c = document.createElement('span')
      c.className = 'cell' + (cls.includes('time') ? ' cell--brass' : '')
      c.dataset.target = ch
      c.textContent = ' '
      if (ch === ' ') c.classList.add('is-space')
      flapCells.push(c)
      g.append(c)
    })
    return g
  }
  row.append(group(d, 9), group(name, 20, 'brow__cells--evt'), group(h, 5, 'brow__cells--time'))
  const go = document.createElement('span')
  go.className = 'brow__go'
  go.textContent = 'Réserver →'
  row.append(go)
  rowsEl.append(row)
})

function runFlaps() {
  flapCells.forEach((c, i) => {
    const target = c.dataset.target
    if (isReduced) { c.textContent = target; return }
    if (target === ' ') return
    let steps = 4 + Math.floor(Math.random() * 9)
    const delay = (i % 34) * 22 + Math.random() * 180
    setTimeout(function tick() {
      c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip')
      c.textContent = steps <= 0 ? target : FLAP[1 + Math.floor(Math.random() * (FLAP.length - 1))]
      if (steps-- > 0) setTimeout(tick, 70)
    }, delay)
  })
}
if (isReduced) runFlaps()
else ScrollTrigger.create({ trigger: '#board', start: 'top 75%', once: true, onEnter: runFlaps })

/* ═════════ Note : compteur ═════════ */
const scoreEl = document.getElementById('scoreNum')
ScrollTrigger.create({
  trigger: '.score', start: 'top 85%', once: true,
  onEnter: () => {
    const o = { v: 0 }
    gsap.to(o, { v: 9.3, duration: isReduced ? 0 : 2, ease: 'expo.out', onUpdate: () => (scoreEl.textContent = o.v.toFixed(1).replace('.', ',')) })
    gsap.fromTo('.score__bar i', { scaleX: 0 }, { scaleX: 0.93, duration: 2, ease: 'expo.out' })
  },
})

/* ═════════ Réservation rapide ═════════ */
const form = document.getElementById('qbook')
const out = document.getElementById('qCouverts')
const hidden = form.querySelector('[name=couverts]')
form.querySelectorAll('[data-step]').forEach((b) =>
  b.addEventListener('click', () => {
    const v = Math.min(8, Math.max(1, +hidden.value + +b.dataset.step))
    hidden.value = v
    out.textContent = v
  }),
)
const today = new Date()
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const qDate = document.getElementById('qDate')
qDate.min = iso(today)
qDate.value = iso(today)

initReveals()
initParallax()
