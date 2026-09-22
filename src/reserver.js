import { gsap, isReduced, lenis } from './common.js'
import './reserver.css'
import { EVENTS, INFO } from './data.js'

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]

const state = { step: 1, couverts: null, date: null, heure: null, service: 'diner', place: 'Sans préférence', occasion: null }

const pad2 = (n) => String(n).padStart(2, '0')
const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const fmtDate = (s) => fromIso(s).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
const today = new Date(); today.setHours(0, 0, 0, 0)
const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth() + 5)
const eventOn = (s) => EVENTS.find((e) => e.date === s)

/* ═════════ Ticket récapitulatif ═════════ */
const mRecap = document.createElement('p')
mRecap.className = 'mrecap'
$('.actions').before(mRecap)

function setTicket(key, val) {
  const el = $(`[data-t="${key}"]`)
  if (!el || el.textContent === val) return
  el.textContent = val
  el.classList.remove('is-new'); void el.offsetWidth; el.classList.add('is-new')
}
function renderTicket() {
  setTicket('couverts', state.couverts ? `${state.couverts} ${state.couverts > 1 ? 'personnes' : 'personne'}` : '—')
  setTicket('date', state.date ? fmtDate(state.date) : '—')
  setTicket('heure', state.heure ? state.heure.replace(':', 'h') : '—')
  setTicket('place', state.place)
  mRecap.textContent = [state.couverts && `${state.couverts} pers.`, state.date && fmtDate(state.date), state.heure && state.heure.replace(':', 'h')].filter(Boolean).join(' · ')
}

/* ═════════ 1 · couverts ═════════ */
const pax = $('#pax')
pax.innerHTML = Array.from({ length: 8 }, (_, i) => `<button type="button" aria-pressed="false" data-n="${i + 1}">${i + 1}</button>`).join('')
pax.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return
  state.couverts = +b.dataset.n
  $$('button', pax).forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  update()
  if (!isReduced) setTimeout(() => state.step === 1 && go(2), 380)
})
$$('#occasion input').forEach((r) => r.addEventListener('change', () => { state.occasion = r.value }))

/* ═════════ 2 · calendrier ═════════ */
let view = new Date(today.getFullYear(), today.getMonth(), 1)
function renderCal() {
  $('#calMonth').textContent = view.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const first = (view.getDay() + 6) % 7 // lundi = 0
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
  let html = '<span></span>'.repeat(first)
  for (let d = 1; d <= days; d++) {
    const dt = new Date(view.getFullYear(), view.getMonth(), d)
    const s = iso(dt)
    const ev = eventOn(s)
    const off = dt < today || dt > maxDate
    const cls = [s === iso(today) && 'is-today', ev && 'is-evt'].filter(Boolean).join(' ')
    const label = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + (ev ? ` — ${ev.title}` : '')
    html += `<button type="button" data-d="${s}" class="${cls}" ${off ? 'disabled' : ''} aria-pressed="${state.date === s}" aria-label="${label}">${d}</button>`
  }
  $('#calGrid').innerHTML = html
  $('[data-m="-1"]').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1)
  $('[data-m="1"]').disabled = view >= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
}
$$('.cal__nav').forEach((b) => b.addEventListener('click', () => {
  view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.m, 1)
  renderCal()
  if (!isReduced) gsap.from('#calGrid button', { opacity: 0, y: 8, duration: 0.5, stagger: 0.006, ease: 'expo.out' })
}))
$('#calGrid').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-d]'); if (!b || b.disabled) return
  state.date = b.dataset.d
  state.heure = null
  $$('#calGrid button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  showEvt()
  update()
})
function showEvt() {
  const ev = state.date && eventOn(state.date)
  const n = $('#evtNote')
  n.hidden = !ev
  if (ev) {
    n.innerHTML = `<span class="sign">${ev.tag}</span><div><strong>${ev.title}</strong><p>${ev.detail}. Réservation conseillée.</p></div>`
    if (ev.tag === 'Match' && !state.occasion) { state.occasion = 'match'; const r = $('#occasion input[value=match]'); if (r) r.checked = true }
  }
}

/* ═════════ 3 · créneaux ═════════ */
const SERVICES = { dejeuner: [12, 0, 14, 30], diner: [19, 0, 22, 45] }
// pseudo-aléatoire stable : un même créneau reste « complet » d'une visite à l'autre
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

function renderSlots() {
  const [h0, m0, h1, m1] = SERVICES[state.service]
  const isToday = state.date === iso(today)
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes() + 45
  const out = []
  for (let t = h0 * 60 + m0; t <= h1 * 60 + m1; t += 15) {
    if (isToday && t < nowMin) continue
    const label = `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`
    const r = hash(`${state.date}${label}${state.couverts}`) % 10
    const full = r < 2
    const few = r === 2 || r === 3
    out.push(`<button type="button" data-h="${label}" ${full ? 'disabled' : ''} class="${few ? 'is-few' : ''}" aria-pressed="${state.heure === label}" ${few ? 'title="Plus que quelques tables"' : ''}>${label.replace(':', 'h')}</button>`)
  }
  $('#slots').innerHTML = out.join('')
  $('#slotsEmpty').hidden = out.length > 0
  if (!isReduced) gsap.from('#slots button', { opacity: 0, y: 10, duration: 0.5, stagger: 0.02, ease: 'expo.out' })
}
$$('#service input').forEach((r) => r.addEventListener('change', () => { state.service = r.value; state.heure = null; renderSlots(); update() }))
$('#slots').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-h]'); if (!b || b.disabled) return
  state.heure = b.dataset.h
  $$('#slots button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)))
  update()
})
$$('#place input').forEach((r) => r.addEventListener('change', () => { state.place = r.value; update() }))

/* ═════════ 4 · coordonnées ═════════ */
const form = $('#resaForm')
const fieldsOk = () => ['prenom', 'nom', 'tel', 'email'].every((n) => form.elements[n].checkValidity())
form.addEventListener('input', (e) => { e.target.closest('.f')?.classList.remove('is-bad'); update() })

/* ═════════ Navigation entre étapes ═════════ */
const valid = { 1: () => !!state.couverts, 2: () => !!state.date, 3: () => !!state.heure, 4: fieldsOk }
const next = $('#next'), back = $('#back')

function update() {
  renderTicket()
  next.disabled = state.step < 4 && !valid[state.step]()
  $$('#steps li').forEach((li) => {
    const s = +li.dataset.s
    li.classList.toggle('is-current', s === state.step)
    li.classList.toggle('is-done', s < state.step || (s !== state.step && valid[s]() && s < 4))
  })
}

function go(n) {
  if (n > state.step) for (let s = 1; s < n; s++) if (!valid[s]()) { n = s; break }
  const cur = $(`[data-panel="${state.step}"]`)
  const nxt = $(`[data-panel="${n}"]`)
  const dir = n > state.step ? 1 : -1
  state.step = n
  if (n === 2) renderCal()
  if (n === 3) renderSlots()
  const swap = () => {
    cur.hidden = true
    nxt.hidden = false
    if (!isReduced) gsap.fromTo(nxt, { opacity: 0, x: 40 * dir }, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' })
    if (n === 4) setTimeout(() => form.elements.prenom.focus({ preventScroll: true }), 300)
  }
  if (cur !== nxt && !isReduced) gsap.to(cur, { opacity: 0, x: -30 * dir, duration: 0.25, ease: 'power2.in', onComplete: swap })
  else swap()
  $('#stepsBar').style.width = `${n * 25}%`
  back.hidden = n === 1
  next.innerHTML = n === 4 ? 'Confirmer la réservation <span class="arr">→</span>' : 'Continuer <span class="arr">→</span>'
  const top = $('.resa__main').getBoundingClientRect().top + scrollY - 100
  if (scrollY > top) lenis ? lenis.scrollTo(top) : scrollTo({ top, behavior: 'smooth' })
  update()
}

next.addEventListener('click', () => {
  if (state.step < 4) return go(state.step + 1)
  if (!fieldsOk()) {
    ;['prenom', 'nom', 'tel', 'email'].forEach((n) => form.elements[n].closest('.f').classList.toggle('is-bad', !form.elements[n].checkValidity()))
    return
  }
  confirmBooking()
})
// Entrée dans un champ = étape suivante
form.addEventListener('submit', (e) => { e.preventDefault(); next.click() })
back.addEventListener('click', () => go(state.step - 1))
$$('#steps button').forEach((b) => b.addEventListener('click', () => {
  const s = +b.closest('li').dataset.s
  if (s < state.step || b.closest('li').classList.contains('is-done')) go(s)
}))

/* ═════════ Confirmation ═════════ */
let code = ''
function confirmBooking() {
  code = 'INT-' + Array.from({ length: 5 }, () => 'ACDEFHJKMNPRTUVWXY3479'[Math.floor(Math.random() * 22)]).join('')
  const f = form.elements
  $('#dName').textContent = f.prenom.value.trim()
  $('#dCode').textContent = code
  const ev = eventOn(state.date)
  const rows = [
    ['Date', fmtDate(state.date)],
    ['Heure', state.heure.replace(':', 'h')],
    ['Couverts', `${state.couverts} ${state.couverts > 1 ? 'personnes' : 'personne'}`],
    ['Table', state.place],
    ['Au nom de', `${f.prenom.value.trim()} ${f.nom.value.trim()}`],
    ['Contact', f.tel.value.trim()],
  ]
  if (ev) rows.push(['Ce soir-là', ev.title])
  $('#dGrid').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v.replace(/</g, '&lt;')}</dd></div>`).join('')

  const hide = [$('#steps'), $('.steps__bar'), form]
  const show = () => {
    hide.forEach((el) => (el.hidden = true))
    $('#done').hidden = false
    if (!isReduced) {
      gsap.from('.done__card', { y: 80, opacity: 0, rotate: -2, duration: 1.2, ease: 'expo.out' })
      gsap.from('.done__card .store', { scaleY: 0, duration: 1, delay: 0.3, ease: 'expo.out' })
      gsap.from('.done__grid div', { opacity: 0, y: 14, duration: 0.8, stagger: 0.06, delay: 0.5, ease: 'expo.out' })
    }
    const top = $('.resa__main').getBoundingClientRect().top + scrollY - 100
    lenis ? lenis.scrollTo(Math.max(0, top)) : scrollTo({ top: Math.max(0, top) })
  }
  isReduced ? show() : gsap.to(hide, { opacity: 0, y: -20, duration: 0.4, onComplete: show })
}

// fichier agenda (.ics) généré sur place
$('#ics').addEventListener('click', () => {
  const [y, m, d] = state.date.split('-')
  const [hh, mm] = state.heure.split(':')
  const start = `${y}${m}${d}T${hh}${mm}00`
  const endH = pad2((+hh + 2) % 24)
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//L Intermittent//Reservation//FR', 'BEGIN:VEVENT',
    `UID:${code}@lintermittent`, `DTSTART;TZID=Europe/Paris:${start}`, `DTEND;TZID=Europe/Paris:${y}${m}${d}T${endH}${mm}00`,
    `SUMMARY:${state.service === 'dejeuner' ? 'Déjeuner' : 'Dîner'} à L'Intermittent (${state.couverts} pers.)`,
    `LOCATION:${INFO.address}\\, ${INFO.city}`, `DESCRIPTION:Réservation ${code} — ${INFO.phone}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = `lintermittent-${state.date}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
})

/* ═════════ Pré-remplissage depuis l'accueil ═════════ */
const q = new URLSearchParams(location.search)
const qc = +q.get('couverts'), qd = q.get('date'), qs = q.get('service'), qo = q.get('occasion')
if (qc >= 1 && qc <= 8) { state.couverts = qc; $(`#pax [data-n="${qc}"]`).setAttribute('aria-pressed', 'true') }
if (qo) { const r = $(`#occasion input[value="${qo}"]`); if (r) { r.checked = true; state.occasion = qo } }
if (qs && SERVICES[qs]) { state.service = qs; $(`#service input[value="${qs}"]`).checked = true }
if (qd && /^\d{4}-\d{2}-\d{2}$/.test(qd) && fromIso(qd) >= today && fromIso(qd) <= maxDate) {
  state.date = qd
  view = new Date(fromIso(qd).getFullYear(), fromIso(qd).getMonth(), 1)
  showEvt()
}
renderCal()
back.hidden = true
update()
if (state.couverts && state.date) go(3)
else if (state.date && !state.couverts) go(1)

if (!isReduced) {
  gsap.from('.resa__title', { y: 40, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 })
  gsap.from('.ticket', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', delay: 0.4 })
  gsap.from('.resa__store', { scaleY: 0, duration: 1, ease: 'expo.out' })
  gsap.from('.panel:not([hidden]), .steps', { opacity: 0, y: 20, duration: 1, ease: 'expo.out', delay: 0.3, stagger: 0.1 })
}
