import { gsap, ScrollTrigger, initReveals, initParallax, lenis, isReduced } from './common.js'
import './carte.css'
import { MENU, WINES, euro } from './data.js'

/* ═════════ Rubriques ═════════ */
const menuEl = document.getElementById('menu')
menuEl.innerHTML = MENU.map((cat, ci) => {
  const imgs = [...new Set([cat.img, ...cat.items.filter((i) => i.img).map((i) => i.img)])]
  return `
  <section class="mcat" id="${cat.id}" data-parallax-root>
    <div class="wrap mcat__grid">
      <div class="mcat__side">
        <span class="mcat__no">${String(ci + 1).padStart(2, '0')}</span>
        <h2 class="mcat__title sign rv-line">${cat.title}</h2>
        <div class="frame mcat__media rv-img">
          ${imgs.map((im, k) => `<img src="/img/${im}.jpg" alt="" data-key="${im}" loading="lazy" class="${k === 0 ? 'is-on' : ''}">`).join('')}
        </div>
        ${imgs.length > 1 ? '<p class="mcat__hint"><i></i> Survolez un plat marqué pour le voir</p>' : ''}
      </div>
      <ul class="mlist">
        ${cat.items.map((it) => `
        <li class="mi rv" ${it.img ? `data-img="${it.img}"` : ''}>
          <div class="mi__main">
            <div class="mi__row">
              <h3 class="mi__name">${it.name}${it.img ? '<span class="mi__cam" aria-hidden="true"></span>' : ''}</h3>
              <span class="mi__dots" aria-hidden="true"></span>
              <span class="mi__price">${euro(it.price)}</span>
            </div>
            ${it.desc ? `<p class="mi__desc">${it.desc}</p>` : ''}
          </div>
          ${it.img ? `<img class="mi__thumb" src="/img/${it.img}.jpg" alt="" loading="lazy">` : ''}
        </li>`).join('')}
      </ul>
    </div>
  </section>`
}).join('')

// survol d'un plat → la photo de gauche change
menuEl.querySelectorAll('.mcat').forEach((sec) => {
  const imgs = sec.querySelectorAll('.mcat__media img')
  const show = (key) => imgs.forEach((im) => im.classList.toggle('is-on', im.dataset.key === key))
  const def = imgs[0]?.dataset.key
  sec.querySelectorAll('.mi[data-img]').forEach((li) => {
    li.addEventListener('mouseenter', () => { li.classList.add('is-hot'); show(li.dataset.img) })
    li.addEventListener('mouseleave', () => li.classList.remove('is-hot'))
  })
  sec.querySelector('.mlist').addEventListener('mouseleave', () => show(def))
})

/* ═════════ Vins ═════════ */
document.getElementById('wines').innerHTML = WINES.map((g) => `
  <div class="wgroup rv">
    <div class="wgroup__head"><h3 class="sign">${g.title}</h3><span class="kicker">${g.unit}</span></div>
    ${g.items.map(([ap, dom, p]) => `
      <div class="wi"><span class="wi__txt"><span class="wi__ap">${ap}</span>${dom ? `<span class="wi__dom">${dom}</span>` : ''}</span><span class="wi__price">${euro(p)}</span></div>`).join('')}
  </div>`).join('')

/* ═════════ Navigation des rubriques ═════════ */
const sections = [...MENU.map((c) => ({ id: c.id, title: c.title, n: c.items.length })), { id: 'vins', title: 'Vins', n: WINES.reduce((a, g) => a + g.items.length, 0) }]
const nav = document.getElementById('cnav')
nav.innerHTML = sections.map((s) => `<a href="#${s.id}" data-id="${s.id}">${s.title}<sup>${s.n}</sup></a>`).join('')
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById(a.dataset.id)
    const offset = -(document.querySelector('.cnav').offsetHeight + 70)
    if (lenis) lenis.scrollTo(target, { offset, duration: 1.4 })
    else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY + offset, behavior: 'smooth' })
  }),
)
const setActive = (id) => {
  nav.querySelectorAll('a').forEach((a) => {
    const on = a.dataset.id === id
    a.classList.toggle('is-active', on)
    if (on) nav.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' })
  })
}
sections.forEach((s) => {
  ScrollTrigger.create({
    trigger: `#${s.id}`, start: 'top 45%', end: 'bottom 45%',
    onToggle: (st) => st.isActive && setActive(s.id),
  })
})

/* ═════════ Guéridon : l'assiette tourne au défilement ═════════ */
if (!isReduced) {
  gsap.from('.table', { scale: 0.86, rotate: -20, opacity: 0, duration: 1.6, ease: 'expo.out', delay: 0.2 })
  gsap.from('.table__tag', { opacity: 0, y: 20, duration: 1, delay: 1.1, ease: 'expo.out' })
  gsap.to('.table__plate img', { rotate: 50, ease: 'none', scrollTrigger: { trigger: '.chero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.to('.table', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.chero', start: 'top top', end: 'bottom top', scrub: true } })
  gsap.from('.chero__store', { scaleY: 0, duration: 1.1, ease: 'expo.out' })
}

initReveals()
initParallax()
