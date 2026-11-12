/* Nasi recipe scaler */
import { parseLine, scaleLine, fmt, parseAmount } from './core.js'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} } }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const root = document.querySelector('.rs-app')
const $ = (s) => root.querySelector(s)
const base = root.dataset.base || '../../'
const SAMPLE = $('.rs-text').value

/* which lines have a swap in the substitute finder */
const SWAP = [['heavy-cream', /heavy (whipping )?cream|whipping cream|double cream/], ['buttermilk', /buttermilk/], ['eggs', /\beggs?\b/], ['sour-cream', /sour cream/], ['cream-cheese', /cream cheese/], ['half-and-half', /half[- ]and[- ]half/], ['evaporated-milk', /evaporated milk/], ['brown-sugar', /brown sugar/], ['powdered-sugar', /powdered sugar|confectioners/], ['honey', /\bhoney\b/], ['maple-syrup', /maple syrup/], ['baking-powder', /baking powder/], ['baking-soda', /baking soda|bicarbonate/], ['self-rising-flour', /self[- ]rais|self[- ]rising/], ['cake-flour', /cake flour/], ['cornstarch', /cornstarch|corn starch|cornflour/], ['vanilla', /vanilla/], ['lemon-juice', /lemon juice/], ['white-wine-vinegar', /white wine vinegar/], ['white-wine', /white wine/], ['shaoxing-wine', /shaoxing/], ['mirin', /mirin/], ['rice-vinegar', /rice (wine )?vinegar/], ['apple-cider-vinegar', /cider vinegar/], ['worcestershire-sauce', /worcestershire/], ['soy-sauce', /soy sauce/], ['tamari', /tamari/], ['oyster-sauce', /oyster sauce/], ['hoisin-sauce', /hoisin/], ['sesame-oil', /sesame oil/], ['dijon-mustard', /dijon/], ['mayonnaise', /\bmayo/], ['tomato-paste', /tomato paste/], ['tomato-sauce', /tomato sauce/], ['chicken-stock', /chicken (stock|broth)/], ['coconut-milk', /coconut milk/], ['tahini', /tahini/], ['cilantro', /cilantro|coriander leaves/], ['thyme', /thyme/], ['cumin', /cumin/], ['paprika', /paprika/], ['allspice', /allspice/], ['nutmeg', /nutmeg/], ['cayenne', /cayenne/], ['gruyere', /gruy[eè]re/], ['parmesan', /parmesan|parmigiano/], ['cotija', /cotija/], ['ricotta', /ricotta/], ['breadcrumbs', /bread ?crumbs|panko/], ['shortening', /shortening/], ['garlic', /\bgarlic\b(?! powder)/], ['butter', /(?<!peanut |almond |nut |cashew )\bbutter\b(?!milk)/], ['milk', /(?<!condensed |evaporated |coconut |almond |oat |soy |rice )\bmilk\b/]]
const swapFor = (t) => { const l = t.toLowerCase(); const m = SWAP.find(([, re]) => re.test(l)); return m && m[0] }

/* state, restored from a share link or last visit */
const hash = new URLSearchParams(location.hash.slice(1))
const saved = store.get('nasi.rs', null)
const st = { from: 4, to: 8, tidy: true, metric: false, text: SAMPLE }
try {
  if (hash.get('r')) { st.text = decodeURIComponent(escape(atob(hash.get('r').replace(/-/g, '+').replace(/_/g, '/')))); st.from = Number(hash.get('f')) || 4; st.to = Number(hash.get('t')) || st.from * 2 }
  else if (saved && saved.text) Object.assign(st, saved)
} catch {}
const ta = $('.rs-text'), fromIn = $('.rs-from'), toOut = $('.rs-to'), list = $('.rs-list')
ta.value = st.text
fromIn.value = st.from

let prev = []
/* phones: live summary while editing */
const pill = document.createElement('button')
pill.className = 'tk-float'
pill.addEventListener('click', () => $('.rs-out').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }))
document.body.appendChild(pill)
if ('IntersectionObserver' in window) {
  let a = false, b = false
  const upd = () => pill.classList.toggle('show', a && !b)
  new IntersectionObserver(([e]) => { a = e.isIntersecting; upd() }).observe($('.rs-in'))
  new IntersectionObserver(([e]) => { b = e.isIntersecting; upd() }, { threshold: 0.15 }).observe($('.rs-out'))
}
const done = new Set()
function render(anim) {
  const k = st.to / st.from
  const lines = st.text.split('\n')
  const rows = []
  lines.forEach((raw) => {
    if (!raw.trim()) return
    const t = raw.trim()
    if (/:$/.test(t) || (/^[A-Z][A-Z\s&]{3,}$/.test(t))) { rows.push({ sec: t.replace(/:$/, '') }); return }
    const p = parseLine(raw)
    const s = scaleLine(p, k, { tidy: st.tidy, metric: st.metric })
    rows.push({ ...s, key: t })
  })
  list.innerHTML = rows.map((r, i) => {
    if (r.sec) return `<li class="sec">${esc(r.sec)}</li>`
    const sw = swapFor(r.text)
    const flash = anim && prev[i] !== undefined && prev[i] !== r.amount && r.amount ? ' flash' : ''
    return `<li class="row${done.has(r.key) ? ' done' : ''}${r.plain ? ' plain' : ''}" style="--i:${i}" data-key="${esc(r.key)}">
      <button class="chk" aria-label="Tick off"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <span class="txt">${r.amount ? `<b class="amt${flash}">${esc(r.amount)}</b> ` : ''}${esc(r.text)}${r.egg ? ' <small>(beat, then measure: 1 large egg ≈ 3 tbsp)</small>' : ''}</span>
      ${sw ? `<a class="swap" href="${base}tools/substitute/${sw}/" title="Out of it? See substitutes">Swap</a>` : ''}
    </li>`
  }).join('') || '<li class="empty">Paste an ingredient list on the left and it appears here, scaled.</li>'
  prev = rows.map((r) => r.amount)
  if (anim === 'all' && !reduce) { list.classList.remove('in'); void list.offsetWidth; list.classList.add('in') }

  const kTxt = Math.abs(k - Math.round(k * 4) / 4) < 0.01 ? fmt(k).replace('0.5', '½').replace('1.5', '1½').replace('2.5', '2½').replace('0.25', '¼').replace('0.75', '¾') : fmt(k)
  $('.rs-k').textContent = `${kTxt}×`
  $('.rs-serves').textContent = `Serves ${fmt(st.to)}`
  pill.innerHTML = `<span>⚖️</span><b>${kTxt}×</b><em>serves ${fmt(st.to)} · ${rows.filter((r) => r.amount).length} amounts</em><i>See list ↓</i>`
  toOut.value = fmt(st.to)
  root.querySelectorAll('.rs-mult button').forEach((b) => b.classList.toggle('on', Math.abs(Number(b.dataset.k) - k) < 1e-6))
  slide()
  root.querySelectorAll('.tog').forEach((b) => b.classList.toggle('on', !!st[b.dataset.o]))
  const tips = []
  if (k > 1.01) {
    tips.push(['🍲', 'Use a bigger pot or pan', 'Cooking can take longer in a larger batch, so check doneness rather than the clock.'])
    tips.push(['🧂', 'Season to taste', 'Salt, spices and chili don’t always scale evenly. Add about three quarters of the new amount, then taste and adjust.'])
    if (/flour|baking powder|baking soda|yeast/i.test(st.text)) tips.push(['🎂', 'Baking? Use more pans', 'Bake extra pans the same size as the original instead of one deeper pan, so it bakes evenly.'])
  } else if (k < 0.99) {
    tips.push(['🍳', 'Use a smaller pan', 'A smaller batch in a big pan spreads thin and can dry out or burn.'])
    tips.push(['⏱️', 'Start checking early', 'Smaller batches usually cook faster.'])
  }
  $('.rs-tips').innerHTML = tips.map(([e, b, p], i) => `<div style="--i:${i}"><i>${e}</i><span><b>${b}</b>${p}</span></div>`).join('')
  store.set('nasi.rs', { from: st.from, to: st.to, tidy: st.tidy, metric: st.metric, text: st.text })
}

/* sliding pill under multiplier chips */
function slide() {
  const g = $('.rs-mult'), on = g.querySelector('.on'), pill = g.querySelector('.pill')
  if (!on) { pill.style.opacity = 0; return }
  pill.style.opacity = 1
  pill.style.width = on.offsetWidth + 'px'
  pill.style.height = on.offsetHeight + 'px'
  pill.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`
}

/* events */
let tt
ta.addEventListener('input', () => { clearTimeout(tt); tt = setTimeout(() => { st.text = ta.value; render(false) }, 160) })
fromIn.addEventListener('input', () => { const v = parseAmount(fromIn.value); if (v > 0) { const k = st.to / st.from; st.from = v; st.to = Math.round(v * k * 100) / 100; render(true) } })
root.querySelectorAll('.rs-step').forEach((b) => b.addEventListener('click', () => {
  st.to = Math.max(1, Math.round(st.to) + Number(b.dataset.d))
  render(true)
  toOut.classList.remove('pop'); void toOut.offsetWidth; toOut.classList.add('pop')
}))
$('.rs-mult').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; st.to = Math.round(st.from * Number(b.dataset.k) * 100) / 100; render(true) })
root.querySelectorAll('.tog').forEach((b) => b.addEventListener('click', () => { st[b.dataset.o] = !st[b.dataset.o]; if (b.dataset.o === 'metric' && st.metric) st.tidy = true; render(true) }))
$('.rs-sample').addEventListener('click', () => { st.text = ta.value = SAMPLE; st.from = 4; fromIn.value = 4; st.to = 8; done.clear(); render('all') })
$('.rs-clear').addEventListener('click', () => { st.text = ta.value = ''; done.clear(); render(false); ta.focus() })
list.addEventListener('click', (e) => {
  const b = e.target.closest('.chk'); if (!b) return
  const li = b.closest('li'), key = li.dataset.key
  done.has(key) ? done.delete(key) : done.add(key)
  li.classList.toggle('done')
})
const listText = () => [...list.querySelectorAll('li')].map((li) => (li.classList.contains('sec') ? `\n${li.textContent.trim()}:` : li.querySelector('.txt')?.textContent.replace(/\s*\(beat.*\)$/, '').trim())).filter(Boolean).join('\n').trim()
async function flashBtn(btn, msg) { const t = btn.querySelector('span'), o = t.textContent; t.textContent = msg; btn.classList.add('ok'); setTimeout(() => { t.textContent = o; btn.classList.remove('ok') }, 1500) }
$('.rs-copy').addEventListener('click', async (e) => { const btn = e.currentTarget; try { await navigator.clipboard.writeText(`Serves ${fmt(st.to)}\n${listText()}`); flashBtn(btn, 'Copied') } catch {} })
$('.rs-share').addEventListener('click', async (e) => {
  const btn = e.currentTarget
  const r = btoa(unescape(encodeURIComponent(st.text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const url = `${location.origin}${location.pathname}#f=${st.from}&t=${st.to}&r=${r}`
  try { if (navigator.share) await navigator.share({ title: 'Scaled recipe', text: `Scaled to serve ${fmt(st.to)}`, url }); else { await navigator.clipboard.writeText(url); flashBtn(btn, 'Link copied') } } catch {}
})
$('.rs-print').addEventListener('click', () => print())

render('all')
root.classList.add('ready')
addEventListener('resize', slide)
document.fonts?.ready.then(slide)
const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' }) : null
document.querySelectorAll('.rv').forEach((el) => (io ? io.observe(el) : el.classList.add('in')))
