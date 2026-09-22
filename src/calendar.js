/* Calendrier maison — celui du navigateur ne se laisse pas habiller.
   Utilisé par la réservation et par le bloc « une table ce soir ? ». */
import { EVENTS } from './data.js'

const pad2 = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
export const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const eventOn = (s) => EVENTS.find((e) => e.date === s)

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

export class Calendar {
  constructor(root, { min, max, value = null, onPick, legend = true } = {}) {
    this.root = root
    this.min = min
    this.max = max
    this.value = value
    this.onPick = onPick
    this.view = new Date((value ? fromIso(value) : min).getFullYear(), (value ? fromIso(value) : min).getMonth(), 1)
    root.classList.add('cal')
    root.innerHTML = `
      <div class="cal__head">
        <button type="button" class="cal__nav" data-m="-1" aria-label="Mois précédent">←</button>
        <span class="cal__month sign"></span>
        <button type="button" class="cal__nav" data-m="1" aria-label="Mois suivant">→</button>
      </div>
      <div class="cal__dow"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
      <div class="cal__grid" role="grid"></div>
      ${legend ? '<p class="cal__legend"><i></i> Soirée ou match à l\'affiche</p>' : ''}`
    this.monthEl = root.querySelector('.cal__month')
    this.gridEl = root.querySelector('.cal__grid')
    root.querySelectorAll('.cal__nav').forEach((b) =>
      b.addEventListener('click', () => {
        this.view = new Date(this.view.getFullYear(), this.view.getMonth() + +b.dataset.m, 1)
        this.render()
        this.onMonth?.()
      }),
    )
    this.gridEl.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-d]')
      if (!b || b.disabled) return
      this.select(b.dataset.d)
      this.onPick?.(b.dataset.d)
    })
    this.render()
  }

  select(d) {
    this.value = d
    this.gridEl.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.d === d)))
  }

  goTo(d) {
    const dt = fromIso(d)
    this.view = new Date(dt.getFullYear(), dt.getMonth(), 1)
    this.value = d
    this.render()
  }

  render() {
    const { view, min, max } = this
    this.monthEl.textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`
    const first = (view.getDay() + 6) % 7 // la semaine commence lundi
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const todayIso = iso(min)
    let html = '<span></span>'.repeat(first)
    for (let d = 1; d <= days; d++) {
      const dt = new Date(view.getFullYear(), view.getMonth(), d)
      const s = iso(dt)
      const ev = eventOn(s)
      const off = dt < min || dt > max
      const cls = [s === todayIso && 'is-today', ev && 'is-evt'].filter(Boolean).join(' ')
      const label = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + (ev ? ` — ${ev.title}` : '')
      html += `<button type="button" data-d="${s}" class="${cls}" ${off ? 'disabled' : ''} aria-pressed="${this.value === s}" aria-label="${label}">${d}</button>`
    }
    this.gridEl.innerHTML = html
    this.root.querySelector('[data-m="-1"]').disabled = view <= new Date(min.getFullYear(), min.getMonth(), 1)
    this.root.querySelector('[data-m="1"]').disabled = view >= new Date(max.getFullYear(), max.getMonth(), 1)
  }
}
