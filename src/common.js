import './styles.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { INFO } from './data.js'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isReduced = reduced

/* ── défilement fluide ─────────────────── */
export let lenis = null
if (!reduced) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: -40 } })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

/* ── en-tête ─────────────────────────── */
const hdr = document.querySelector('.hdr')
const alwaysSolid = document.body.dataset.hdr === 'solid'
let lastY = 0
function onScroll() {
  const y = window.scrollY
  if (!hdr) return
  hdr.classList.toggle('is-solid', alwaysSolid || y > window.innerHeight * 0.6)
  const menuOpen = document.body.classList.contains('menu-open')
  const canHide = window.innerWidth > 860 // sur mobile il reste visible : des sections y sont collées
  hdr.classList.toggle('is-hidden', canHide && !menuOpen && y > 300 && y > lastY + 2)
  if (y < lastY - 2 || y < 300) hdr.classList.remove('is-hidden')
  lastY = y
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

const page = document.body.dataset.page
document.querySelectorAll(`[data-nav="${page}"]`).forEach((a) => a.setAttribute('aria-current', 'page'))

document.querySelector('.burger')?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open')
  document.querySelector('.burger').setAttribute('aria-expanded', String(open))
  open ? lenis?.stop() : lenis?.start()
})
document.querySelectorAll('.mnav a').forEach((a) =>
  a.addEventListener('click', () => {
    document.body.classList.remove('menu-open')
    lenis?.start()
  }),
)

/* ── ouvert / fermé, heure de Paris ────── */
export function parisHour() {
  const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
  const h = +parts.find((p) => p.type === 'hour').value
  const m = +parts.find((p) => p.type === 'minute').value
  return h + m / 60
}
document.querySelectorAll('.open-dot').forEach((el) => {
  const h = parisHour()
  const open = h >= INFO.open && h < INFO.close
  el.classList.toggle('is-closed', !open)
  el.querySelector('span').textContent = open ? 'Ouvert · jusqu’à minuit' : 'Fermé · ouvre à 8h'
})

/* ── découpe des titres en mots ────────── */
function splitWords(el) {
  const walk = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment()
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return
          if (/^\s+$/.test(part)) return frag.append(' ')
          // une ponctuation isolée reste collée au mot qui précède, même à travers un <em>
          if (/^[,.;:!?»)\]…]/.test(part)) {
            let prev = frag.lastChild
            if (!(prev && prev.nodeType === 1 && prev.classList.contains('ln'))) {
              const sib = child.previousSibling
              prev = sib && sib.nodeType === 1 ? [...sib.querySelectorAll('.ln')].pop() : null
            }
            if (prev) {
              prev.firstChild.textContent += part
              return
            }
          }
          const ln = document.createElement('span')
          ln.className = 'ln'
          const w = document.createElement('span')
          w.className = 'w'
          w.textContent = part
          ln.append(w)
          frag.append(ln)
        })
        child.replaceWith(frag)
      } else if (child.nodeType === 1 && !child.matches('img, .no-split')) {
        walk(child)
      }
    })
  }
  walk(el)
}

export function initReveals(root = document) {
  if (reduced) return
  root.querySelectorAll('.rv-line').forEach((el) => {
    splitWords(el)
    gsap.to(el.querySelectorAll('.w'), {
      y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035,
      scrollTrigger: { trigger: el, start: 'top 88%' },
    })
  })
  root.querySelectorAll('.rv').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: +(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    })
  })
  root.querySelectorAll('.rv-img').forEach((el) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' }, delay: +(el.dataset.delay || 0) })
    tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.inOut' })
    tl.to(el.querySelector('img'), { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.1)
  })
  root.querySelectorAll('.store[data-unroll]').forEach((el) => {
    gsap.from(el, { scaleY: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
  })
}

/* parallaxe : data-speed = fraction du défilement (négatif = monte plus vite) */
export function initParallax(root = document) {
  if (reduced) return
  root.querySelectorAll('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed)
    gsap.fromTo(el, { yPercent: -s * 50 }, {
      yPercent: s * 50, ease: 'none',
      scrollTrigger: { trigger: el.closest('[data-parallax-root]') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

/* ── rideau entre les pages ────────────── */
const curtain = document.querySelector('.curtain')
if (curtain && !reduced) {
  let arrived = false
  try { arrived = sessionStorage.getItem('curtain') === '1'; sessionStorage.removeItem('curtain') } catch (e) {}
  if (arrived) {
    gsap.set(curtain, { yPercent: 0 })
    gsap.to(curtain, { yPercent: -110, duration: 1.1, ease: 'expo.inOut', delay: 0.15 })
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]')
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin || url.pathname === location.pathname) return
    e.preventDefault()
    try { sessionStorage.setItem('curtain', '1') } catch (err) {}
    gsap.fromTo(curtain, { yPercent: -110 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut', onComplete: () => (location.href = url.href) })
  })
  // retour arrière depuis le cache : on relève le rideau
  window.addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(curtain, { yPercent: -110 }) })
}

/* ── toast ─────────────────────────────── */
export function toast(msg, ms = 5200) {
  let el = document.querySelector('.toast')
  if (!el) {
    el = document.createElement('div')
    el.className = 'toast'
    el.setAttribute('role', 'status')
    document.body.append(el)
  }
  el.textContent = msg
  requestAnimationFrame(() => el.classList.add('is-on'))
  clearTimeout(el._t)
  el._t = setTimeout(() => el.classList.remove('is-on'), ms)
}

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()))

window.addEventListener('load', () => ScrollTrigger.refresh())
