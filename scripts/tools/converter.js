/* Nasi kitchen converter: hydrates every .cv-app on the page. */
import { UNITS, VOL_UNITS, WT_UNITS, INGREDIENTS, ING, convert, toMl, parseAmount, fmt, niceFraction, measureWith } from './core.js'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
}
const ease = (t) => 1 - Math.pow(1 - t, 3)
const name = (u, n) => (Math.abs(n - 1) < 1e-9 ? UNITS[u].one : UNITS[u].many)
const shortName = (u) => UNITS[u].short

/* number that rolls to its new value */
function roll(el, to, fmtFn) {
  const from = Number(el.dataset.v ?? to)
  el.dataset.v = to
  if (reduce || !isFinite(from) || !isFinite(to) || from === to) { el.textContent = fmtFn(to); return }
  const t0 = performance.now(), dur = 520
  cancelAnimationFrame(el._raf)
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur)
    el.textContent = fmtFn(from + (to - from) * ease(k))
    if (k < 1) el._raf = requestAnimationFrame(step)
  }
  el._raf = requestAnimationFrame(step)
}

/* measuring cup / spoon glyphs, sized by how big the scoop is */
const SCOOP_SVG = {
  cup: (fill) => `<svg viewBox="0 0 64 56" aria-hidden="true"><path d="M8 10h40l-4 38a6 6 0 0 1-6 5H18a6 6 0 0 1-6-5z" fill="rgba(255,255,255,.08)" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M48 18h6a5 5 0 0 1 0 10h-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><clipPath id="cl${fill}"><path d="M8 10h40l-4 38a6 6 0 0 1-6 5H18a6 6 0 0 1-6-5z"/></clipPath><rect clip-path="url(#cl${fill})" x="0" y="${10 + 43 * (1 - fill / 100)}" width="64" height="56" fill="currentColor" opacity=".55"/></svg>`,
  spoon: () => `<svg viewBox="0 0 64 56" aria-hidden="true"><ellipse cx="20" cy="28" rx="15" ry="11" fill="currentColor" opacity=".55" stroke="currentColor" stroke-width="3"/><path d="M34 28h24" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`
}
const CUP_FILL = { c1: 100, c34: 75, c23: 67, c12: 50, c13: 33, c14: 25 }

function jugSvg(id) {
  return `<svg class="jug" viewBox="0 0 220 250" aria-hidden="true">
  <defs><clipPath id="jc${id}"><path d="M40 30h130l-10 190a14 14 0 0 1-14 13H64a14 14 0 0 1-14-13z"/></clipPath>
  <linearGradient id="jg${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <g clip-path="url(#jc${id})">
    <g class="liq"><path class="w1" d="M-220 0 Q -192 -10 -165 0 T -110 0 T -55 0 T 0 0 T 55 0 T 110 0 T 165 0 T 220 0 T 275 0 T 330 0 T 385 0 T 440 0 V 260 H -220 Z"/>
    <path class="w2" d="M-220 4 Q -192 12 -165 4 T -110 4 T -55 4 T 0 4 T 55 4 T 110 4 T 165 4 T 220 4 T 275 4 T 330 4 T 385 4 T 440 4 V 260 H -220 Z"/></g>
    <rect x="40" y="30" width="40" height="210" fill="url(#jg${id})" opacity=".35"/>
  </g>
  <path d="M40 30h130l-10 190a14 14 0 0 1-14 13H64a14 14 0 0 1-14-13z" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-linejoin="round"/>
  <path d="M170 64h18a20 20 0 0 1 20 20v48a20 20 0 0 1-20 20h-24" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-linecap="round"/>
  <path d="M30 30h150" stroke="rgba(255,255,255,.75)" stroke-width="4" stroke-linecap="round"/>
  <g class="ticks"></g>
  </svg>`
}
/* jug capacities in ml with their tick labels */
const JUGS = [  /* tick labels are cups */
  { ml: UNITS.cup.base, ticks: [['¼', .25], ['½', .5], ['¾', .75], ['1 cup', 1]] },
  { ml: UNITS.cup.base * 2, ticks: [['½', .25], ['1', .5], ['1½', .75], ['2 cups', 1]] },
  { ml: UNITS.quart.base, ticks: [['1', .25], ['2', .5], ['3', .75], ['4 cups', 1]] },
  { ml: UNITS.cup.base * 8, ticks: [['2', .25], ['4', .5], ['6', .75], ['8 cups', 1]] },
  { ml: UNITS.gallon.base, ticks: [['4', .25], ['8', .5], ['12', .75], ['16 cups', 1]] }
]

let uid = 0
function hydrate(root) {
  const id = ++uid
  const $ = (s) => root.querySelector(s)
  const qs = new URLSearchParams(location.search)
  const useUrl = root.hasAttribute('data-main')
  const st = {
    a: parseAmount((useUrl && qs.get('a')) || root.dataset.a || '1') || 1,
    from: (useUrl && UNITS[qs.get('from')] && qs.get('from')) || root.dataset.from || 'cup',
    to: (useUrl && UNITS[qs.get('to')] && qs.get('to')) || root.dataset.to || 'tbsp',
    ing: (useUrl && ING[qs.get('i')] && qs.get('i')) || root.dataset.ing || 'water'
  }
  const num = $('.cv-num'), res = $('.cv-res'), resU = $('.cv-res-u'), badge = $('.cv-badge'), eqTxt = $('.cv-from-txt')
  const vis = $('.cv-vis')
  vis.insertAdjacentHTML('afterbegin', jugSvg(id))
  const jug = vis.querySelector('.jug'), liq = jug.querySelector('.liq'), ticksG = jug.querySelector('.ticks'), jugCap = $('.cv-jugcap')
  num.value = fmtIn(st.a)

  function fmtIn(n) { const f = niceFraction(n, 1e-6); return f ? f.text.replace('⅛', '1/8').replace('¼', '1/4').replace('⅓', '1/3').replace('⅜', '3/8').replace('½', '1/2').replace('⅝', '5/8').replace('⅔', '2/3').replace('¾', '3/4').replace('⅞', '7/8') : fmt(n).replace(/,/g, '') }

  /* sliding pill behind the active chip */
  function slide(group) {
    const on = group.querySelector('.on'), pill = group.querySelector('.pill')
    if (!on || !pill) return
    pill.style.width = on.offsetWidth + 'px'
    pill.style.height = on.offsetHeight + 'px'
    pill.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`
    const sc = group.closest('.scroll')
    if (sc && (on.offsetLeft < sc.scrollLeft || on.offsetLeft + on.offsetWidth > sc.scrollLeft + sc.clientWidth)) sc.scrollTo({ left: on.offsetLeft - 24, behavior: reduce ? 'auto' : 'smooth' })
  }
  function mark(group, val) {
    group.querySelectorAll('button[data-v]').forEach((b) => b.classList.toggle('on', b.dataset.v === val))
    slide(group)
  }

  let saveT
  function render(bump) {
    const { a, from, to, ing } = st
    const out = convert(a, from, to, ing)
    const crosses = UNITS[from].kind !== UNITS[to].kind
    root.classList.toggle('cross', crosses)
    roll(res, out, fmt)
    resU.textContent = name(to, out)
    eqTxt.textContent = `${fmtIn(a)} ${name(from, a)}${crosses ? ` of ${ING[ing].name.toLowerCase()}` : ''}`
    const nf = UNITS[to].frac ? niceFraction(out) : null
    badge.innerHTML = nf ? `<span class="${nf.exact ? 'exact' : ''}">${nf.exact ? 'Exactly' : 'About'} ${nf.text} ${shortName(to)}</span>` : ''
    badge.classList.toggle('show', !!nf)
    if (bump && !reduce) { res.parentElement.classList.remove('pop'); void res.offsetWidth; res.parentElement.classList.add('pop') }
    if (nf && nf.exact && bump) sparkle(badge)

    /* jug */
    const ml = toMl(a, from, ing)
    const ingc = ING[ing]
    root.style.setProperty('--liq', ingc.c)
    root.classList.toggle('solid', !ingc.liquid)
    const jg = JUGS.find((j) => ml <= j.ml * 1.0001) || JUGS[JUGS.length - 1]
    const over = ml > jg.ml * 1.0001 ? Math.ceil(ml / jg.ml) : 1
    const level = Math.min(1, ml / (jg.ml * over))
    ticksG.innerHTML = jg.ticks.map(([l, f]) => { const y = 233 - f * 203, x = 40 + (1 - f) * 10; return `<line x1="${x}" x2="${x + 18}" y1="${y}" y2="${y}"/><text x="${x - 8}" y="${y + 6}" text-anchor="end">${l.replace(/ cups?/, '')}</text>` }).join('')
    liq.style.transform = `translateY(${233 - level * 203}px)`
    jugCap.textContent = `${jg.ticks[3][0].replace(/ cups?/, '')}-cup jug${over > 1 ? ` × ${over}` : ''}`

    /* scoops */
    const m = measureWith(ml)
    const sc = $('.cv-scoops'), mh = $('.cv-measure b')
    mh.textContent = m.pinch ? 'Just a pinch' : m.parts.length ? `Measure it with${m.approx ? ' (close enough)' : ''}` : ''
    sc.innerHTML = m.parts.slice(0, 6).map((p, i) => `<span class="sc ${p.kind}" style="--i:${i}">${p.kind === 'cup' ? SCOOP_SVG.cup(CUP_FILL[p.k]) : SCOOP_SVG.spoon()}<em>${p.label}</em>${p.n > 1 ? `<i>×${p.n}</i>` : ''}</span>`).join('')
    sc.classList.toggle('many', m.parts.length > 0 && ml > UNITS.cup.base * 6)

    /* all-units grid */
    root.querySelectorAll('.cv-all [data-u]').forEach((cell) => {
      const u = cell.dataset.u
      const v = convert(a, from, u, ing)
      roll(cell.querySelector('b'), v, fmt)
      cell.classList.toggle('on', u === to)
      cell.classList.toggle('self', u === from)
    })
    if (useUrl) {
      const q = new URLSearchParams({ a: fmtIn(a), from, to, i: ing })
      history.replaceState(null, '', `${location.pathname}?${q}`)
    }
    clearTimeout(saveT)
    saveT = setTimeout(remember, 1400)
  }

  function remember() {
    const r = store.get('nasi.cv.recent', []).filter((x) => !(x.a === st.a && x.from === st.from && x.to === st.to && x.ing === st.ing))
    r.unshift({ ...st })
    store.set('nasi.cv.recent', r.slice(0, 6))
    drawRecent()
  }
  function drawRecent() {
    const box = $('.cv-recent')
    if (!box) return
    const r = store.get('nasi.cv.recent', [])
    box.hidden = !r.length
    box.querySelector('.list').innerHTML = r.map((x, i) => `<button data-r="${i}">${fmtIn(x.a)} ${shortName(x.from)} → ${shortName(x.to)}${UNITS[x.from].kind !== UNITS[x.to].kind ? ` <small>${ING[x.ing].e}</small>` : ''}</button>`).join('')
  }

  /* --- events --- */
  num.addEventListener('input', () => {
    const v = parseAmount(num.value)
    root.classList.toggle('bad', !(v >= 0) && num.value.trim() !== '')
    if (v >= 0) { st.a = v; render(false) }
  })
  num.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); nudge(e.key === 'ArrowUp' ? 1 : -1) }
  })
  num.addEventListener('blur', () => { if (!(parseAmount(num.value) >= 0)) { num.value = fmtIn(st.a); root.classList.remove('bad') } })
  function nudge(d) {
    const stepMap = { tsp: 0.25, tbsp: 0.5, cup: 0.25, floz: 1, ml: 25, l: 0.25, g: 25, kg: 0.25, oz: 1, lb: 0.5, pint: 0.5, quart: 0.5, gallon: 0.5 }
    const s = stepMap[st.from] || 1
    st.a = Math.max(0, Math.round((st.a + d * s) / s) * s)
    num.value = fmtIn(st.a)
    render(true)
  }
  root.querySelectorAll('.cv-step').forEach((b) => b.addEventListener('click', () => nudge(Number(b.dataset.d))))
  root.querySelectorAll('.cv-fr button').forEach((b) => b.addEventListener('click', () => {
    st.a = parseAmount(b.dataset.v); num.value = fmtIn(st.a); render(true)
    b.classList.remove('tap'); void b.offsetWidth; b.classList.add('tap')
  }))
  const gFrom = $('[data-role="from"] .chips'), gTo = $('[data-role="to"] .chips'), gIng = $('.cv-ings .chips')
  gFrom.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; st.from = b.dataset.v; if (st.from === st.to) st.to = st.from === 'cup' ? 'tbsp' : 'cup'; mark(gFrom, st.from); mark(gTo, st.to); render(true) })
  gTo.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; st.to = b.dataset.v; mark(gTo, st.to); render(true) })
  gIng.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; st.ing = b.dataset.v; mark(gIng, st.ing); render(true) })
  root.querySelectorAll('.cv-all [data-u]').forEach((cell) => cell.addEventListener('click', () => { if (cell.dataset.u === st.from) return; st.to = cell.dataset.u; mark(gTo, st.to); render(true); if (innerWidth < 900) $('.cv-out').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }) }))
  $('.cv-swap').addEventListener('click', (e) => {
    const out = convert(st.a, st.from, st.to, st.ing)
    ;[st.from, st.to] = [st.to, st.from]
    st.a = Math.round(out * 1000) / 1000
    num.value = fmtIn(st.a)
    mark(gFrom, st.from); mark(gTo, st.to)
    e.currentTarget.classList.remove('spin'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('spin')
    render(true)
  })
  $('.cv-copy').addEventListener('click', async (e) => {
    const out = convert(st.a, st.from, st.to, st.ing)
    const text = `${eqTxt.textContent} = ${fmt(out)} ${name(st.to, out)}`
    try { await navigator.clipboard.writeText(text); flash(e.currentTarget, 'Copied') } catch { flash(e.currentTarget, 'Copy failed') }
  })
  $('.cv-share').addEventListener('click', async (e) => {
    const q = new URLSearchParams({ a: fmtIn(st.a), from: st.from, to: st.to, i: st.ing })
    const url = `${location.origin}${root.dataset.home || location.pathname}?${q}`
    const out = convert(st.a, st.from, st.to, st.ing)
    const text = `${eqTxt.textContent} = ${fmt(out)} ${name(st.to, out)}`
    try {
      if (navigator.share) await navigator.share({ title: 'Nasi kitchen converter', text, url })
      else { await navigator.clipboard.writeText(url); flash(e.currentTarget, 'Link copied') }
    } catch {}
  })
  const recentBox = $('.cv-recent')
  if (recentBox) {
    recentBox.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-r]')
      if (b) { Object.assign(st, store.get('nasi.cv.recent', [])[Number(b.dataset.r)]); num.value = fmtIn(st.a); mark(gFrom, st.from); mark(gTo, st.to); mark(gIng, st.ing); render(true) }
      if (e.target.closest('.clear')) { store.set('nasi.cv.recent', []); drawRecent() }
    })
    drawRecent()
  }

  function flash(btn, msg) {
    const t = btn.querySelector('span'), old = t.textContent
    t.textContent = msg; btn.classList.add('ok')
    setTimeout(() => { t.textContent = old; btn.classList.remove('ok') }, 1500)
  }
  function sparkle(el) {
    if (reduce) return
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('i')
      s.className = 'spark'
      const a = (Math.PI * 2 * i) / 10, r = 34 + Math.random() * 26
      s.style.setProperty('--x', Math.cos(a) * r + 'px')
      s.style.setProperty('--y', Math.sin(a) * r + 'px')
      el.appendChild(s)
      setTimeout(() => s.remove(), 750)
    }
  }

  mark(gFrom, st.from); mark(gTo, st.to); mark(gIng, st.ing)
  render(false)
  root.classList.add('ready')
  addEventListener('resize', () => { slide(gFrom); slide(gTo); slide(gIng) })
  document.fonts?.ready.then(() => { slide(gFrom); slide(gTo); slide(gIng) })
}

document.querySelectorAll('.cv-app').forEach(hydrate)

/* gentle reveal for content blocks */
const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' }) : null
document.querySelectorAll('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')))
