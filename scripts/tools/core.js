/* Nasi kitchen math. Shared by the browser tools and the static page builder,
 * so every number on the site comes from one place.
 * Volumes are US customary. Ingredient weights per cup follow King Arthur Baking's
 * ingredient weight chart (water by definition). */

export const UNITS = {
  tsp: { kind: 'vol', base: 4.92892159375, one: 'teaspoon', many: 'teaspoons', short: 'tsp', frac: true },
  tbsp: { kind: 'vol', base: 14.78676478125, one: 'tablespoon', many: 'tablespoons', short: 'tbsp', frac: true },
  floz: { kind: 'vol', base: 29.5735295625, one: 'fluid ounce', many: 'fluid ounces', short: 'fl oz' },
  cup: { kind: 'vol', base: 236.5882365, one: 'cup', many: 'cups', short: 'cup', frac: true },
  pint: { kind: 'vol', base: 473.176473, one: 'pint', many: 'pints', short: 'pt' },
  quart: { kind: 'vol', base: 946.352946, one: 'quart', many: 'quarts', short: 'qt' },
  gallon: { kind: 'vol', base: 3785.411784, one: 'gallon', many: 'gallons', short: 'gal' },
  ml: { kind: 'vol', base: 1, one: 'milliliter', many: 'milliliters', short: 'ml' },
  l: { kind: 'vol', base: 1000, one: 'liter', many: 'liters', short: 'L' },
  g: { kind: 'wt', base: 1, one: 'gram', many: 'grams', short: 'g' },
  kg: { kind: 'wt', base: 1000, one: 'kilogram', many: 'kilograms', short: 'kg' },
  oz: { kind: 'wt', base: 28.349523125, one: 'ounce', many: 'ounces', short: 'oz' },
  lb: { kind: 'wt', base: 453.59237, one: 'pound', many: 'pounds', short: 'lb' }
}
export const VOL_UNITS = ['tsp', 'tbsp', 'floz', 'cup', 'pint', 'quart', 'gallon', 'ml', 'l']
export const WT_UNITS = ['g', 'oz', 'lb', 'kg']
export const CUP_ML = UNITS.cup.base

/* grams in one level US cup */
export const INGREDIENTS = [
  { id: 'water', name: 'Water', e: '💧', g: 236.6 , c: '#6EC6FF', liquid: true },
  { id: 'milk', name: 'Milk', e: '🥛', g: 227 , c: '#F4EFE6', liquid: true },
  { id: 'flour', name: 'All-purpose flour', e: '🌾', g: 120 , c: '#EFE4CC' },
  { id: 'bread-flour', name: 'Bread flour', e: '🍞', g: 120 , c: '#E6D6B4' },
  { id: 'almond-flour', name: 'Almond flour', e: '🌰', g: 96 , c: '#E2C9A0' },
  { id: 'sugar', name: 'Granulated sugar', e: '🍬', g: 198 , c: '#FBF8F2' },
  { id: 'brown-sugar', name: 'Brown sugar (packed)', e: '🟫', g: 213 , c: '#B47A45' },
  { id: 'powdered-sugar', name: 'Powdered sugar', e: '❄️', g: 113 , c: '#FFFFFF' },
  { id: 'butter', name: 'Butter', e: '🧈', g: 227 , c: '#F7D774' },
  { id: 'oil', name: 'Vegetable oil', e: '🫒', g: 198 , c: '#E2C25A', liquid: true },
  { id: 'cream', name: 'Heavy cream', e: '🍶', g: 227 , c: '#FFF4E0', liquid: true },
  { id: 'sour-cream', name: 'Sour cream', e: '🥣', g: 227 , c: '#FBF3E6' },
  { id: 'honey', name: 'Honey', e: '🍯', g: 336 , c: '#F0A63A', liquid: true },
  { id: 'maple', name: 'Maple syrup', e: '🍁', g: 312 , c: '#B9651F', liquid: true },
  { id: 'cocoa', name: 'Cocoa powder', e: '🍫', g: 84 , c: '#6B4430' },
  { id: 'choc-chips', name: 'Chocolate chips', e: '🍪', g: 170 , c: '#4E2E20' },
  { id: 'oats', name: 'Rolled oats', e: '🌾', g: 113 , c: '#D9C29A' },
  { id: 'rice', name: 'Rice (uncooked)', e: '🍚', g: 198 , c: '#F3EEE2' },
  { id: 'peanut-butter', name: 'Peanut butter', e: '🥜', g: 270 , c: '#C98B4B' },
  { id: 'cheese', name: 'Shredded cheese', e: '🧀', g: 113 , c: '#F4C24F' },
  { id: 'parmesan', name: 'Grated Parmesan', e: '🧀', g: 100 , c: '#EEDFAE' },
  { id: 'cornstarch', name: 'Cornstarch', e: '🌽', g: 112 , c: '#FBFAF5' },
  { id: 'salt', name: 'Table salt', e: '🧂', g: 288 , c: '#F5F5F5' }
]
export const ING = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]))

/* Parse "1 1/2", "3/4", "½", "1.5", "1,5" */
const VULGAR = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875 }
export function parseAmount(raw) {
  if (raw == null) return NaN
  let s = String(raw).trim().replace(',', '.')
  for (const [k, v] of Object.entries(VULGAR)) s = s.replace(k, ` ${v}`)
  s = s.trim()
  if (!s) return NaN
  let total = 0
  for (const part of s.split(/\s+/)) {
    const m = part.match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/)
    if (m) total += Number(m[1]) / Number(m[2])
    else if (/^\d*\.?\d+$/.test(part)) total += Number(part)
    else return NaN
  }
  return total
}

/* Convert between any two units. Crossing volume and weight needs an ingredient. */
export function convert(amount, from, to, ingId = 'water') {
  const f = UNITS[from], t = UNITS[to]
  if (!f || !t || !isFinite(amount)) return NaN
  if (f.kind === t.kind) return (amount * f.base) / t.base
  const gPerCup = (ING[ingId] || ING.water).g
  if (f.kind === 'vol') {
    const grams = ((amount * f.base) / CUP_ML) * gPerCup
    return grams / t.base
  }
  const ml = ((amount * f.base) / gPerCup) * CUP_ML
  return ml / t.base
}
export const toMl = (amount, unit, ingId) => (UNITS[unit].kind === 'vol' ? amount * UNITS[unit].base : convert(amount, unit, 'ml', ingId))

/* Friendly number: 64, 5.33, 0.13, 1,250 */
export function fmt(n) {
  if (!isFinite(n)) return '–'
  const a = Math.abs(n)
  let d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a >= 0.1 ? 2 : 3
  let s = n.toFixed(d)
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '')
  const [i, f] = s.split('.')
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f ? '.' + f : '')
}

/* Nearest kitchen fraction: 1.333 -> "1 ⅓" (only when it's genuinely close) */
const FR = [[1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'], [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞']]
export function niceFraction(n, tol = 0.025) {
  if (!isFinite(n) || n <= 0 || n > 999) return null
  const w = Math.floor(n), r = n - w
  if (r < tol) return w ? { text: String(w), exact: r < 1e-6 } : null
  if (1 - r < tol) return { text: String(w + 1), exact: 1 - r < 1e-6 }
  let best = null
  for (const [v, g] of FR) { const d = Math.abs(r - v); if (!best || d < best.d) best = { v, g, d } }
  if (best.d > tol) return null
  return { text: (w ? w + ' ' : '') + best.g, exact: best.d < 1e-6 }
}

/* Plain-text fraction for titles: 0.5 -> "1/2", 1.5 -> "1 1/2" */
export function asciiFraction(n) {
  const nf = niceFraction(n, 1e-6)
  if (!nf) return fmt(n)
  return nf.text.replace('⅛', '1/8').replace('¼', '1/4').replace('⅓', '1/3').replace('⅜', '3/8').replace('½', '1/2').replace('⅝', '5/8').replace('⅔', '2/3').replace('¾', '3/4').replace('⅞', '7/8')
}

/* Which measuring cups and spoons to use, fewest scoops first.
 * Works in 1/8-teaspoon steps; returns [{ k, label, n, kind }] */
const SET = [
  { k: 'c34', label: '¾ cup', u: 288, kind: 'cup' }, { k: 'c23', label: '⅔ cup', u: 256, kind: 'cup' },
  { k: 'c12', label: '½ cup', u: 192, kind: 'cup' }, { k: 'c13', label: '⅓ cup', u: 128, kind: 'cup' },
  { k: 'c14', label: '¼ cup', u: 96, kind: 'cup' }, { k: 'T', label: '1 tbsp', u: 24, kind: 'spoon' },
  { k: 't', label: '1 tsp', u: 8, kind: 'spoon' }, { k: 't12', label: '½ tsp', u: 4, kind: 'spoon' },
  { k: 't14', label: '¼ tsp', u: 2, kind: 'spoon' }, { k: 't18', label: '⅛ tsp', u: 1, kind: 'spoon' }
]
const N8 = 384
const [DP, COUNT] = (() => {
  const best = new Array(N8).fill(Infinity), pick = new Array(N8).fill(-1)
  best[0] = 0
  for (let v = 1; v < N8; v++) for (let i = 0; i < SET.length; i++) {
    const c = SET[i]
    if (c.u <= v && best[v - c.u] + 1 < best[v]) { best[v] = best[v - c.u] + 1; pick[v] = i }
  }
  return [pick, best]
})()
const pieces = (q) => Math.floor(q / N8) + COUNT[q % N8]
export function measureWith(ml) {
  if (!isFinite(ml) || ml <= 0) return { parts: [], approx: false, pinch: false }
  const eighths = (ml / UNITS.tsp.base) * 8
  const q = Math.round(eighths)
  if (q === 0) return { parts: [], approx: true, pinch: true }
  /* allow a 3% near-miss when it saves scoops */
  let pickQ = q
  const lo = Math.max(1, Math.ceil(eighths * 0.97)), hi = Math.floor(eighths * 1.03)
  for (let v = lo; v <= hi; v++) {
    const better = pieces(v) < pieces(pickQ) || (pieces(v) === pieces(pickQ) && Math.abs(v - eighths) < Math.abs(pickQ - eighths))
    if (better) pickQ = v
  }
  const approx = Math.abs(pickQ - eighths) / eighths > 0.01
  const cups = Math.floor(pickQ / N8)
  let rem = pickQ % N8
  const counts = new Map()
  while (rem > 0) { const i = DP[rem]; counts.set(i, (counts.get(i) || 0) + 1); rem -= SET[i].u }
  const parts = []
  if (cups) parts.push({ k: 'c1', label: '1 cup', n: cups, kind: 'cup' })
  ;[...counts.entries()].sort((a, b) => a[0] - b[0]).forEach(([i, n]) => parts.push({ ...SET[i], n }))
  return { parts, approx, pinch: false }
}
export function measureText(ml) {
  const m = measureWith(ml)
  if (m.pinch) return 'a pinch'
  return m.parts.map((p) => (p.n > 1 ? `${p.n} × ${p.label}` : p.label)).join(' + ')
}

/* ---------- Turkey (USDA FSIS figures) ---------- */
/* Hours at 325°F, [minLb, maxLb, minH, maxH] */
export const ROAST = {
  unstuffed: [[4, 8, 1.5, 3.25], [8, 12, 2.75, 3], [12, 14, 3, 3.75], [14, 18, 3.75, 4.25], [18, 20, 4.25, 4.5], [20, 24, 4.5, 5]],
  stuffed: [[6, 8, 2.5, 3.5], [8, 12, 3, 3.5], [12, 14, 3.5, 4], [14, 18, 4, 4.25], [18, 20, 4.25, 4.75], [20, 24, 4.75, 5.25]]
}
export function roastHours(lb, stuffed = false) {
  const t = ROAST[stuffed ? 'stuffed' : 'unstuffed']
  const w = Math.min(Math.max(lb, t[0][0]), 24)
  const row = t.find((r) => w >= r[0] && w < r[1]) || t[t.length - 1]
  return { min: row[2], max: row[3] }
}
/* USDA: whole bird 1 lb/person, bone-in breast 3/4 lb, boneless breast 1/2 lb */
export const PER_PERSON = { whole: 1, breast: 0.75 }
export function turkeyPlan({ guests = 10, leftovers = false, cut = 'whole', stuffed = false }) {
  const per = PER_PERSON[cut] * (leftovers ? 1.5 : 1)
  const raw = guests * per
  const lb = Math.max(cut === 'whole' ? 8 : 4, Math.round(raw * 2) / 2)
  /* whole birds top out around 24 lb; bone-in breasts around 8 lb */
  const birds = cut === 'whole' ? (lb > 24 ? Math.ceil(lb / 22) : 1) : Math.ceil(lb / 8)
  const each = Math.max(4, Math.round((lb / birds) * 2) / 2)
  const roast = cut === 'whole' ? roastHours(each, stuffed) : { min: 1.5, max: 3.25 }
  return {
    lb, birds, each,
    buyRange: [Math.floor(each), Math.ceil(each) + 2],
    fridgeDays: Math.max(1, Math.ceil(each / 4)),
    waterHours: Math.ceil(each * 0.5),
    roast
  }
}
/* Rule-of-thumb sides for a holiday table */
export function sidesFor(guests) {
  const g = Math.max(1, guests)
  return [
    { e: '🥔', name: 'Potatoes for mash', v: `${fmt(Math.ceil(g * 0.5 * 2) / 2)} lb` },
    { e: '🍞', name: 'Stuffing', v: `${fmt(Math.ceil(g * 0.75 * 4) / 4)} cups` },
    { e: '🫗', name: 'Gravy', v: `${fmt(Math.ceil((g / 3) * 4) / 4)} cups` },
    { e: '🫐', name: 'Cranberry sauce', v: `${fmt(Math.ceil((g / 4) * 4) / 4)} cups` },
    { e: '🫛', name: 'Green beans', v: `${fmt(Math.ceil(g * 0.25 * 2) / 2)} lb` },
    { e: '🥐', name: 'Dinner rolls', v: `${Math.ceil(g * 1.5)}` },
    { e: '🥧', name: 'Pies', v: `${Math.max(1, Math.ceil(g / 8))}` }
  ]
}
