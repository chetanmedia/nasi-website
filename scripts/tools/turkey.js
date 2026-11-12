/* Nasi turkey calculator */
import { turkeyPlan, sidesFor, fmt } from './core.js'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const root = document.querySelector('.tk-app')
const $ = (s) => root.querySelector(s)
const qs = new URLSearchParams(location.search)
const st = {
  guests: Math.min(40, Math.max(2, Number(qs.get('g')) || 10)),
  leftovers: qs.get('l') || '0',
  cut: qs.get('c') === 'breast' ? 'breast' : 'whole',
  frozen: qs.get('f') === '0' ? '0' : '1',
  stuffed: qs.get('s') === '1' ? '1' : '0',
  date: /^\d{4}-\d{2}-\d{2}$/.test(qs.get('d') || '') ? qs.get('d') : '2026-11-26',
  time: /^\d{2}:\d{2}$/.test(qs.get('t') || '') ? qs.get('t') : '16:00'
}
const ease = (t) => 1 - Math.pow(1 - t, 3)
function roll(el, to, f = (v) => fmt(Math.round(v * 2) / 2)) {
  const from = Number(el.dataset.v ?? to)
  el.dataset.v = to
  if (reduce || from === to) { el.textContent = f(to); return }
  const t0 = performance.now()
  cancelAnimationFrame(el._r)
  const step = (t) => { const k = Math.min(1, (t - t0) / 600); el.textContent = f(from + (to - from) * ease(k)); if (k < 1) el._r = requestAnimationFrame(step) }
  el._r = requestAnimationFrame(step)
}
const hrs = (h) => { const w = Math.floor(h), f = h - w; return `${w}${f === 0.25 ? '¼' : f === 0.5 ? '½' : f === 0.75 ? '¾' : ''}` }
const DAY = 864e5, HR = 36e5, MIN = 6e4
const fmtWhen = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const fmtTime = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const morning = (d) => { const x = new Date(d); x.setHours(9, 0, 0, 0); return x }

/* segmented controls */
function slide(seg) {
  const on = seg.querySelector('.on'), pill = seg.querySelector('.pill')
  if (!on) return
  pill.style.width = on.offsetWidth + 'px'
  pill.style.transform = `translateX(${on.offsetLeft - 4}px)`
}
root.querySelectorAll('.tk-opt').forEach((opt) => {
  const k = opt.dataset.k, seg = opt.querySelector('.seg')
  seg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === String(st[k])))
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return
    st[k] = b.dataset.v
    seg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b))
    slide(seg)
    render(true)
  })
})
const allSegs = () => root.querySelectorAll('.seg').forEach(slide)

/* guests */
const nOut = $('.tk-n'), range = $('.tk-range'), plates = $('.tk-plates')
function setGuests(n, bump) {
  st.guests = Math.min(40, Math.max(2, n))
  range.value = st.guests
  render(bump)
}
root.querySelectorAll('.tk-step').forEach((b) => b.addEventListener('click', () => setGuests(st.guests + Number(b.dataset.d), true)))
range.addEventListener('input', () => setGuests(Number(range.value), false))
$('.tk-date').value = st.date
$('.tk-time').value = st.time
$('.tk-date').addEventListener('change', (e) => { if (e.target.value) { st.date = e.target.value; render(true) } })
$('.tk-time').addEventListener('change', (e) => { if (e.target.value) { st.time = e.target.value; render(true) } })

let plan, events
/* phones: live summary while the controls are on screen */
const floatPill = document.createElement('button')
floatPill.className = 'tk-float'
floatPill.addEventListener('click', () => $('.tk-out').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }))
document.body.appendChild(floatPill)
if ('IntersectionObserver' in window) {
  let inCtl = false, inOut = false
  const upd = () => floatPill.classList.toggle('show', inCtl && !inOut)
  new IntersectionObserver(([e]) => { inCtl = e.isIntersecting; upd() }).observe(root.querySelector('.tk-in'))
  new IntersectionObserver(([e]) => { inOut = e.isIntersecting; upd() }, { threshold: 0.18 }).observe(root.querySelector('.tk-hero'))
}
function render(bump) {
  const stuffedSeg = root.querySelector('[data-k="stuffed"]')
  stuffedSeg.classList.toggle('off', st.cut === 'breast')
  stuffedSeg.querySelectorAll('button').forEach((b) => (b.disabled = st.cut === 'breast'))
  plan = turkeyPlan({ guests: st.guests, leftovers: st.leftovers === '1', cut: st.cut, stuffed: st.stuffed === '1' && st.cut === 'whole' })

  roll(nOut, st.guests, (v) => String(Math.round(v)))
  /* plates */
  const have = plates.children.length
  if (have < st.guests) for (let i = have; i < st.guests; i++) { const p = document.createElement('i'); p.style.setProperty('--d', `${(i - have) * 18}ms`); plates.appendChild(p) }
  else while (plates.children.length > st.guests) plates.lastChild.remove()

  /* bird */
  roll($('.tk-lb'), plan.lb)
  const scale = 0.72 + Math.min(1, (plan.each - 4) / 20) * 0.42
  root.style.setProperty('--bird', scale.toFixed(3))
  root.dataset.birds = plan.birds
  const what = st.cut === 'whole' ? 'turkey' : 'bone-in breast'
  $('.tk-range-txt').innerHTML = plan.birds > 1
    ? `<b>${plan.birds} × ${what}s</b> of about ${fmt(plan.each)} lb each`
    : `Look for a <b>${plan.buyRange[0]}–${plan.buyRange[1]} lb</b> ${what}`
  if (bump && !reduce) { const h = $('.tk-hero'); h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop') }

  /* timeline */
  const dinner = new Date(`${st.date}T${st.time}:00`)
  const out = new Date(dinner - 45 * MIN)
  const inOven = new Date(out - plan.roast.max * HR)
  const check = new Date(+inOven + Math.max(plan.roast.min * HR, plan.roast.max * HR - 30 * MIN) - (plan.roast.min < plan.roast.max ? 0 : 0))
  events = []
  const frozen = st.frozen === '1'
  if (frozen) {
    const thaw = morning(new Date(inOven - plan.fridgeDays * DAY))
    if (+thaw > +inOven - plan.fridgeDays * DAY) thaw.setDate(thaw.getDate() - 1)
    events.push({ t: new Date(+thaw - DAY), e: '🛒', h: 'Buy your frozen turkey', s: `Get it home by today: ${plan.birds > 1 ? `${plan.birds} birds, about ${fmt(plan.each)} lb each` : `${plan.buyRange[0]}–${plan.buyRange[1]} lb`}.` })
    events.push({ t: thaw, e: '🧊', h: 'Move it to the fridge to thaw', s: `About ${plan.fridgeDays} days at 40°F or below. Keep it on a tray.`, key: 'thaw' })
  } else {
    events.push({ t: morning(new Date(inOven - 2 * DAY)), e: '🛒', h: 'Pick up your fresh turkey', s: 'Buy it 1 to 2 days before cooking and keep it cold.' })
  }
  events.push({ t: new Date(inOven - 30 * MIN), e: '🔥', h: 'Preheat the oven to 325°F', s: 'Pat the turkey dry and season it.' })
  events.push({ t: inOven, e: '🦃', h: 'Turkey goes in the oven', s: `Plan on ${hrs(plan.roast.min)}–${hrs(plan.roast.max)} hours${st.stuffed === '1' && st.cut === 'whole' ? ', stuffed' : ''}.`, key: 'oven' })
  events.push({ t: new Date(+inOven + plan.roast.min * HR), e: '🌡️', h: 'Start checking the temperature', s: 'Done at 165°F in the thickest part of the breast, the inner thigh and the wing.' })
  events.push({ t: out, e: '⏳', h: 'Out of the oven, rest it', s: 'Tent loosely with foil for at least 20–30 minutes. Bake the stuffing and sides now.' })
  events.push({ t: new Date(dinner - 15 * MIN), e: '🔪', h: 'Make the gravy and carve', s: 'Whisk the pan drippings into your gravy base.' })
  events.push({ t: dinner, e: '🍽️', h: 'Dinner is served', s: `${st.guests} guests. Refrigerate leftovers within 2 hours.`, key: 'dinner' })
  void check

  const now = Date.now()
  const late = frozen && events.find((x) => x.key === 'thaw').t < now && dinner > now
  const tl = $('.tl')
  tl.innerHTML = events.map((ev, i) => {
    const past = ev.t < now
    return `<li style="--i:${i}" class="${past ? 'past' : ''}"><i>${ev.e}</i><div><p class="when">${fmtWhen(ev.t)} · ${fmtTime(ev.t)}</p><b>${ev.h}</b><p>${ev.s}</p></div></li>`
  }).join('') + (late ? `<li class="warn" style="--i:${events.length}"><i>⚡</i><div><b>Short on thawing time?</b><p>Use the cold-water method: keep it wrapped, submerge it in cold water and change the water every 30 minutes. Allow about ${plan.waterHours} hours, then cook it right away.</p></div></li>` : '')
  if (!reduce) { tl.classList.remove('draw'); void tl.offsetWidth; tl.classList.add('draw') }

  /* stats */
  $('.v-thaw').textContent = frozen ? `${plan.fridgeDays} days` : 'No thawing'
  $('.s-thaw').textContent = frozen ? `in the fridge, or about ${plan.waterHours} hours in cold water` : 'buy it 1 to 2 days before'
  $('.v-roast').textContent = `${hrs(plan.roast.min)}–${hrs(plan.roast.max)} hours`
  floatPill.innerHTML = `<span>🦃</span><b>${fmt(plan.lb)} lb</b><em>${frozen ? `thaw ${plan.fridgeDays} days · ` : ''}roast ${hrs(plan.roast.min)}–${hrs(plan.roast.max)} h</em><i>See plan ↓</i>`
  if (bump && !reduce) { floatPill.classList.remove('bump'); void floatPill.offsetWidth; floatPill.classList.add('bump') }

  /* sides */
  $('.tk-sides .grid').innerHTML = sidesFor(st.guests).map((s, i) => `<div style="--i:${i}"><i>${s.e}</i><b>${s.v}</b><span>${s.name}</span></div>`).join('')

  const q = new URLSearchParams({ g: st.guests, l: st.leftovers, c: st.cut, f: st.frozen, s: st.stuffed, d: st.date, t: st.time })
  history.replaceState(null, '', `${location.pathname}?${q}`)
}

/* calendar file */
const icsDate = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`
const icsEsc = (s) => s.replace(/[,;\\]/g, (m) => '\\' + m)
$('.tk-ics').addEventListener('click', (e) => {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nasi//Turkey Calculator//EN', 'CALSCALE:GREGORIAN']
  events.forEach((ev, i) => {
    const end = new Date(+ev.t + 30 * MIN)
    lines.push('BEGIN:VEVENT', `UID:nasi-turkey-${+ev.t}-${i}@getnasi.app`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(ev.t)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${icsEsc(ev.e + ' ' + ev.h)}`, `DESCRIPTION:${icsEsc(ev.s + ' Planned with getnasi.app/tools/turkey-calculator')}`, 'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', `DESCRIPTION:${icsEsc(ev.h)}`, 'END:VALARM', 'END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }))
  a.download = 'turkey-plan.ics'
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  confetti(e.currentTarget)
})
$('.tk-share').addEventListener('click', async (e) => {
  const text = `Our turkey plan: ${fmt(plan.lb)} lb of turkey for ${st.guests} guests, roast ${hrs(plan.roast.min)}–${hrs(plan.roast.max)} hours at 325°F.`
  const btn = e.currentTarget
  try {
    if (navigator.share) await navigator.share({ title: 'Turkey plan', text, url: location.href })
    else { await navigator.clipboard.writeText(location.href); const t = btn.querySelector('span'); t.textContent = 'Link copied'; setTimeout(() => (t.textContent = 'Share plan'), 1500) }
  } catch {}
})
$('.tk-print').addEventListener('click', () => print())

function confetti(from) {
  if (reduce) return
  const r = from.getBoundingClientRect()
  const colors = ['#F6A27C', '#FFD56A', '#F2B630', '#EC5A7A', '#7CC35F', '#fff']
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('i')
    p.className = 'confetti'
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 140 + Math.random() * 220
    p.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top}px;background:${colors[i % colors.length]};--x:${Math.cos(a) * v}px;--y:${Math.sin(a) * v}px;--r:${Math.random() * 720 - 360}deg`
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 1300)
  }
}

render(false)
allSegs()
root.classList.add('ready')
addEventListener('resize', allSegs)
document.fonts?.ready.then(allSegs)

const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' }) : null
document.querySelectorAll('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')))
