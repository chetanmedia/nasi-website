/* Nasi substitute finder */
import { SUBS, SUB, CATS, swapParts, baseLabel, FIT, TAGS } from './subs.js'
import { parseAmount } from './core.js'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} } }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const root = document.querySelector('.sb-app')
const $ = (s) => root.querySelector(s)
const main = root.hasAttribute('data-main')
const base = root.dataset.base || '../'
const qs = new URLSearchParams(location.search)
const st = { id: (main && SUB[qs.get('i')] && qs.get('i')) || root.dataset.ing || 'eggs', amount: null, tags: new Set(store.get('nasi.sb.tags', [])) }
st.amount = (main && parseAmount(qs.get('a'))) || SUB[st.id].per[0]

/* ---------- search ---------- */
const input = $('.sb-q'), list = $('.sb-list')
let hits = [], cur = -1
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
function search(q) {
  q = norm(q.trim())
  if (!q) return []
  return SUBS.map((s) => {
    const n = norm(s.name), k = norm(s.kw)
    const score = n.startsWith(q) ? 3 : n.includes(q) ? 2 : k.includes(q) || s.id.includes(q.replace(/\s+/g, '-')) ? 1 : 0
    return { s, score }
  }).filter((x) => x.score).sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name)).slice(0, 7).map((x) => x.s)
}
function drawList() {
  list.hidden = !hits.length && !input.value.trim()
  list.innerHTML = hits.length
    ? hits.map((s, i) => `<li role="option" data-id="${s.id}" class="${i === cur ? 'on' : ''}" aria-selected="${i === cur}"><i>${s.e}</i><span>${esc(s.name)}</span><small>${s.swaps.length} swap${s.swaps.length > 1 ? 's' : ''}</small></li>`).join('')
    : `<li class="none">No match yet. Try “cream”, “egg” or “vinegar”.</li>`
}
input.addEventListener('input', () => { hits = search(input.value); cur = hits.length ? 0 : -1; drawList() })
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); cur = Math.min(hits.length - 1, cur + 1); drawList() }
  else if (e.key === 'ArrowUp') { e.preventDefault(); cur = Math.max(0, cur - 1); drawList() }
  else if (e.key === 'Enter' && hits[cur]) { e.preventDefault(); pick(hits[cur].id) }
  else if (e.key === 'Escape') { list.hidden = true; input.blur() }
})
input.addEventListener('blur', () => setTimeout(() => (list.hidden = true), 150))
input.addEventListener('focus', () => { if (input.value.trim()) { hits = search(input.value); drawList() } })
list.addEventListener('mousedown', (e) => { const li = e.target.closest('li[data-id]'); if (li) { e.preventDefault(); pick(li.dataset.id) } })

/* typewriter placeholder */
if (!reduce) {
  const words = ['buttermilk', 'eggs', 'heavy cream', 'brown sugar', 'soy sauce', 'baking powder', 'sour cream', 'Dijon mustard']
  let w = 0, c = 0, dir = 1
  setInterval(() => {
    if (document.activeElement === input || input.value) return
    const word = words[w]
    c += dir
    if (c > word.length + 6) { dir = -1 }
    if (c <= 0) { dir = 1; w = (w + 1) % words.length }
    input.placeholder = `Out of ${word.slice(0, Math.max(0, Math.min(c, word.length)))}${c <= word.length ? '|' : ''}`
  }, 85)
}

/* ---------- pick + render ---------- */
function pick(id, push = true) {
  if (!SUB[id]) return
  const changed = id !== st.id
  st.id = id
  if (changed) st.amount = SUB[id].per[0]
  input.value = ''; list.hidden = true; hits = []
  render(true)
  const r = store.get('nasi.sb.recent', []).filter((x) => x !== id)
  r.unshift(id); store.set('nasi.sb.recent', r.slice(0, 6)); drawRecent()
  if (main && push) history.replaceState(null, '', `${location.pathname}?i=${id}`)
  if (changed && innerWidth < 900) $('.sb-head').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
const amtIn = $('.sb-amt input')
function render(anim) {
  const s = SUB[st.id]
  root.dataset.cat = s.cat
  $('.sb-emoji').textContent = s.e
  $('.sb-name').textContent = s.name.toLowerCase().replace(/\s*\(.*\)/, '')
  const u = s.per[1], many = st.amount > 1 + 1e-9
  const counted = !!s.unitName
  $('.sb-unit').textContent = counted ? s.unitName[many ? 1 : 0] : u === 'cup' ? (many ? 'cups' : 'cup') : u
  $('.sb-name').hidden = counted
  if (document.activeElement !== amtIn) amtIn.value = fmtIn(st.amount)
  $('.sb-role').textContent = s.role
  const shown = s.swaps.filter((w) => [...st.tags].every((t) => (w.tags || []).includes(t)))
  const box = $('.sb-cards')
  box.innerHTML = shown.length ? shown.map((w, i) => card(s, w, i)).join('') : `<div class="sb-empty"><i>🤔</i><b>No ${[...st.tags].map((t) => TAGS[t].toLowerCase()).join(' + ')} swap for ${esc(s.name.toLowerCase())}</b><p>Try turning off a filter. Some ingredients don’t have a good swap for every diet.</p></div>`
  if (anim && !reduce) { box.classList.remove('in'); void box.offsetWidth; box.classList.add('in') }
  $('.sb-avoid').hidden = !s.avoid
  $('.sb-avoid').textContent = s.avoid || ''
  $('.sb-more').href = `${base}tools/substitute/${s.id}/`
  $('.sb-more').hidden = !main
  root.querySelectorAll('.sb-filters button').forEach((b) => b.classList.toggle('on', st.tags.has(b.dataset.t)))
  root.querySelectorAll('.sb-pop button, .sb-browse a').forEach((b) => b.classList.toggle('on', b.dataset.id === st.id))
}
function card(s, w, i) {
  const parts = swapParts(s, w, st.amount)
  return `<article class="sb-card fit${w.fit}" style="--i:${i}">
    <header><b>${esc(w.name)}</b><span class="fit"><i></i><i></i><i></i>${FIT[w.fit]}</span></header>
    <ul>${parts.map((p) => `<li>${p.fill ? `${esc(p.what)} <em>to make ${p.amt}</em>` : `<em>${p.amt}</em> ${esc(p.what)}`}</li>`).join('')}</ul>
    <p class="how">${esc(w.how)}</p>
    <footer><span class="best">Best for: ${esc(w.best)}</span>${(w.tags || []).map((t) => `<span class="tag">${TAGS[t]}</span>`).join('')}
    <button class="copy" data-copy="${esc(`${baseLabel(s, st.amount)}${s.unitName ? '' : ' ' + s.name.toLowerCase().replace(/\s*\(.*\)/, '')} → ${parts.map((p) => p.text).join(' + ')}`)}" aria-label="Copy this swap"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg></button></footer>
  </article>`
}
function fmtIn(n) {
  const w = Math.floor(n), r = n - w
  const fr = [[0.25, '1/4'], [1 / 3, '1/3'], [0.5, '1/2'], [2 / 3, '2/3'], [0.75, '3/4'], [0.125, '1/8']].find(([v]) => Math.abs(v - r) < 0.01)
  if (r < 0.01) return String(w)
  return fr ? (w ? `${w} ${fr[1]}` : fr[1]) : String(Math.round(n * 100) / 100)
}

/* amount controls */
amtIn.addEventListener('input', () => { const v = parseAmount(amtIn.value); if (v > 0) { st.amount = v; render(false) } })
amtIn.addEventListener('blur', () => { amtIn.value = fmtIn(st.amount) })
root.querySelectorAll('.sb-amt button').forEach((b) => b.addEventListener('click', () => {
  const s = SUB[st.id], step = s.per[1] === 'cup' ? 0.25 : s.per[1] === 'tsp' ? 0.25 : s.per[1] === 'tbsp' ? 0.5 : 1
  st.amount = Math.max(step, Math.round((st.amount + Number(b.dataset.d) * step) / step) * step)
  amtIn.value = fmtIn(st.amount)
  render(false)
  root.querySelectorAll('.sb-card ul').forEach((u) => { u.classList.remove('flash'); void u.offsetWidth; u.classList.add('flash') })
}))
/* filters */
root.querySelectorAll('.sb-filters button').forEach((b) => b.addEventListener('click', () => {
  st.tags.has(b.dataset.t) ? st.tags.delete(b.dataset.t) : st.tags.add(b.dataset.t)
  store.set('nasi.sb.tags', [...st.tags])
  render(true)
}))
/* chips + browse */
root.querySelectorAll('.sb-pop button').forEach((b) => b.addEventListener('click', () => pick(b.dataset.id)))
if (main) root.querySelectorAll('.sb-browse a').forEach((a) => a.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); pick(a.dataset.id); $('.sb-head').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }) }))
/* copy */
root.addEventListener('click', async (e) => {
  const b = e.target.closest('.copy'); if (!b) return
  try { await navigator.clipboard.writeText(b.dataset.copy); b.classList.add('ok'); setTimeout(() => b.classList.remove('ok'), 1300) } catch {}
})
/* recent */
function drawRecent() {
  const box = $('.sb-recent'); if (!box) return
  const r = store.get('nasi.sb.recent', []).filter((id) => SUB[id])
  box.hidden = r.length < 2
  box.querySelector('div').innerHTML = r.map((id) => `<button data-id="${id}">${SUB[id].e} ${esc(SUB[id].name)}</button>`).join('')
}
$('.sb-recent')?.addEventListener('click', (e) => { const b = e.target.closest('button[data-id]'); if (b) pick(b.dataset.id) })

render(false)
drawRecent()
root.classList.add('ready')
const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' }) : null
document.querySelectorAll('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')))
void CATS
