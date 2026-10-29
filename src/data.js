export const asset = (p) => `${import.meta.env.BASE_URL}${p}`
export const img = (id) => asset(`img/${id}.jpg`)
export const ICON = asset('img/nasi-icon.png')

export const APP_STORE_URL = 'https://apps.apple.com/us/app/nasi-recipe-saver/id6809348987'

/* Source glyphs mirror the app: TikTok shows a music note, the rest get their own mark. */
export const SRC = {
  TikTok: { glyph: 'note', tone: '#FF4F6D' },
  Instagram: { glyph: 'camera', tone: '#E1306C' },
  Facebook: { glyph: 'fb', tone: '#4A8BF5' },
  Website: { glyph: 'link', tone: '#F6A27C' },
  'Photo scan': { glyph: 'scan', tone: '#F2B630' },
  PDF: { glyph: 'file', tone: '#E85D4A' },
  'Pasted text': { glyph: 'clip', tone: '#9AA7BD' },
  Written: { glyph: 'pen', tone: '#34D058' }
}

export const RECIPES = [
  { id: 'noodles', t: 'Crispy Chilli Garlic Noodles', src: 'TikTok', min: 20, lvl: 'Easy', serv: 2, cuisine: 'Chinese', books: ['weeknight', 'spicy'] },
  { id: 'lemak', t: 'Nasi Lemak with Sambal', src: 'Instagram', min: 50, lvl: 'Medium', serv: 4, cuisine: 'Malaysian', books: ['grandma', 'weekend'] },
  { id: 'marry', t: 'Marry Me Chicken', src: 'Facebook', min: 35, lvl: 'Easy', serv: 4, cuisine: 'Italian', books: ['date', 'weeknight'] },
  { id: 'salmon', t: 'Miso Butter Salmon', src: 'TikTok', min: 25, lvl: 'Easy', serv: 2, cuisine: 'Japanese', books: ['weeknight', 'date'] },
  { id: 'paneer', t: 'Paneer Tikka Skewers', src: 'Instagram', min: 40, lvl: 'Medium', serv: 4, cuisine: 'Indian', books: ['weekend', 'spicy'] },
  { id: 'shak', t: "Grandma's Shakshuka", src: 'Photo scan', min: 30, lvl: 'Easy', serv: 3, cuisine: 'Middle Eastern', books: ['grandma'] },
  { id: 'burrata', t: 'Burrata & Grilled Peach', src: 'Instagram', min: 15, lvl: 'Easy', serv: 2, cuisine: 'Italian', books: ['date'] },
  { id: 'cookies', t: 'Brown Butter Cookies', src: 'PDF', min: 25, lvl: 'Easy', serv: 12, cuisine: 'Baking', books: ['sweet'] },
  { id: 'mango', t: 'Mango Sticky Rice', src: 'TikTok', min: 35, lvl: 'Medium', serv: 4, cuisine: 'Thai', books: ['sweet', 'weekend'] },
  { id: 'tofu', t: 'Gochujang Tofu Bowl', src: 'Pasted text', min: 20, lvl: 'Easy', serv: 2, cuisine: 'Korean', books: ['weeknight', 'spicy'] }
]
export const byId = Object.fromEntries(RECIPES.map((r) => [r.id, r]))

export const BOOKS = [
  { id: 'all', t: 'All recipes' },
  { id: 'weeknight', t: 'Weeknight wins' },
  { id: 'date', t: 'Date night' },
  { id: 'spicy', t: 'Bring the heat' },
  { id: 'grandma', t: "From Grandma" },
  { id: 'weekend', t: 'Weekend projects' },
  { id: 'sweet', t: 'Sweet tooth' }
]

/* The hero recipe used in the reel story and the interactive recipe demo. */
export const NOODLES = {
  t: 'Crispy Chilli Garlic Noodles',
  note: 'Pour the oil while it is still sizzling. That is where the crunch comes from.',
  creator: 'wokwithmei',
  link: 'tiktok.com/t/ZNdq8Kp2',
  prep: 5, cook: 15, serv: 2,
  ing: [
    { e: '🍜', q: 200, u: 'g', n: 'dried wheat noodles', aisle: 'Pantry' },
    { e: '🧄', q: 6, u: '', n: 'garlic cloves, thinly sliced', aisle: 'Produce' },
    { e: '🌶️', q: 2, u: 'tbsp', n: 'chilli crisp', aisle: 'Pantry' },
    { e: '🥢', q: 1.5, u: 'tbsp', n: 'light soy sauce', aisle: 'Pantry' },
    { e: '🍶', q: 1, u: 'tsp', n: 'black vinegar', aisle: 'Pantry' },
    { e: '🍯', q: 1, u: 'tsp', n: 'sugar', aisle: 'Pantry' },
    { e: '🫒', q: 3, u: 'tbsp', n: 'neutral oil', aisle: 'Pantry' },
    { e: '🌱', q: 2, u: '', n: 'spring onions', aisle: 'Produce' },
    { e: '⚪', q: 1, u: 'tbsp', n: 'toasted sesame seeds', aisle: 'Pantry' }
  ],
  // [[word]] marks an ingredient, highlighted in the app's orange
  steps: [
    { t: 'Boil the [[noodles]] for a minute less than the packet says. Drain and keep a splash of the water.', tm: 240 },
    { t: 'Stir the [[chilli crisp]], [[soy sauce]], [[black vinegar]] and [[sugar]] together in a big bowl.', tm: 0 },
    { t: 'Heat the [[oil]] until it shimmers. Add the [[garlic]] and [[spring onion]] whites for 30 seconds.', tm: 30 },
    { t: 'Pour the sizzling [[oil]] straight over the sauce. Stand back, it hisses.', tm: 0 },
    { t: 'Toss in the [[noodles]] with a little cooking water. Finish with [[sesame seeds]] and greens.', tm: 0 }
  ]
}

/* What the creator says, shows and writes, and what Nasi turns each piece into. */
export const HEARD = [
  { kind: 'audio', raw: '“…a nest of wheat noodles, like two hundred grams”', clean: '200 g wheat noodles', e: '🍜', to: 'ing' },
  { kind: 'video', raw: 'On screen: 6 garlic cloves 🧄', clean: '6 garlic cloves, sliced', e: '🧄', to: 'ing' },
  { kind: 'audio', raw: '“two big spoons of chilli crisp”', clean: '2 tbsp chilli crisp', e: '🌶️', to: 'ing' },
  { kind: 'caption', raw: 'splash of soy + black vinegar!!', clean: '1½ tbsp soy · 1 tsp vinegar', e: '🥢', to: 'ing' },
  { kind: 'caption', raw: 'spring onions on top 🌱', clean: '2 spring onions', e: '🌱', to: 'ing' },
  { kind: 'audio', raw: '“boil them one minute less than the packet”', clean: 'Boil noodles 1 min under packet time', to: 'step' },
  { kind: 'audio', raw: '“get that oil properly hot”', clean: 'Heat oil until it shimmers', to: 'step' },
  { kind: 'video', raw: 'Clip 0:21 · oil poured over garlic', clean: 'Pour sizzling oil over the sauce', to: 'step' },
  { kind: 'caption', raw: 'toss toss toss + noodle water', clean: 'Toss with noodles and a splash of water', to: 'step' }
]

export const GROCERY = {
  noodles: [['Wheat noodles', 200, 'g', 'Pantry'], ['Garlic', 6, 'cloves', 'Produce'], ['Spring onions', 2, '', 'Produce'], ['Chilli crisp', 2, 'tbsp', 'Pantry']],
  lemak: [['Jasmine rice', 300, 'g', 'Pantry'], ['Coconut milk', 1, 'can', 'Pantry'], ['Eggs', 2, '', 'Dairy & eggs'], ['Cucumber', 1, '', 'Produce']],
  marry: [['Chicken thighs', 600, 'g', 'Meat & fish'], ['Garlic', 4, 'cloves', 'Produce'], ['Cream', 200, 'ml', 'Dairy & eggs'], ['Parmesan', 40, 'g', 'Dairy & eggs']],
  salmon: [['Salmon fillets', 2, '', 'Meat & fish'], ['White miso', 2, 'tbsp', 'Pantry'], ['Butter', 30, 'g', 'Dairy & eggs'], ['Bok choy', 2, '', 'Produce']],
  paneer: [['Paneer', 400, 'g', 'Dairy & eggs'], ['Yoghurt', 150, 'g', 'Dairy & eggs'], ['Red onion', 1, '', 'Produce'], ['Bell peppers', 2, '', 'Produce']],
  shak: [['Eggs', 4, '', 'Dairy & eggs'], ['Chopped tomatoes', 1, 'can', 'Pantry'], ['Red onion', 1, '', 'Produce'], ['Garlic', 3, 'cloves', 'Produce']],
  burrata: [['Burrata', 1, '', 'Dairy & eggs'], ['Peaches', 3, '', 'Produce'], ['Basil', 1, 'bunch', 'Produce']],
  cookies: [['Butter', 170, 'g', 'Dairy & eggs'], ['Brown sugar', 150, 'g', 'Pantry'], ['Dark chocolate', 150, 'g', 'Pantry']],
  mango: [['Mangoes', 2, '', 'Produce'], ['Sticky rice', 200, 'g', 'Pantry'], ['Coconut milk', 1, 'can', 'Pantry']],
  tofu: [['Firm tofu', 400, 'g', 'Pantry'], ['Gochujang', 2, 'tbsp', 'Pantry'], ['Cucumber', 1, '', 'Produce'], ['Jasmine rice', 200, 'g', 'Pantry']]
}
export const AISLES = ['Produce', 'Meat & fish', 'Dairy & eggs', 'Pantry']
export const AISLE_E = { Produce: '🥬', 'Meat & fish': '🐟', 'Dairy & eggs': '🥚', Pantry: '🫙' }

export const SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Late snack']
/* Plan keyed by weekday index (0 = Sunday). */
export const PLAN0 = {
  0: [['Breakfast', 'shak'], ['Dinner', 'lemak']],
  1: [['Dinner', 'salmon']],
  2: [['Dinner', 'marry']],
  3: [['Lunch', 'tofu'], ['Dinner', 'noodles']],
  4: [['Dinner', 'paneer']],
  5: [['Dinner', 'burrata']],
  6: [['Breakfast', 'mango'], ['Late snack', 'cookies']]
}

export const FAQ = [
  ['How does Nasi turn a video into a recipe?', 'Share the post to Nasi, or paste its link. Nasi watches the video, listens to what the creator says and reads the caption, then writes the ingredient list with amounts, step-by-step instructions, servings and cook time. You can edit anything before you cook.'],
  ['Which apps can I save from?', 'TikTok, Instagram Reels and Facebook videos. You can also scan a photo of a cookbook page or a handwritten card, upload a PDF with one recipe in it, paste text, or write a recipe yourself.'],
  ['What if the creator never says exact amounts?', 'Nasi works from what the creator shows, says and writes. When an amount is vague, like “a splash”, it suggests a sensible one. Give the list a quick look before you start and adjust anything you like.'],
  ['Is Nasi free?', 'Yes. Nasi is free to download and includes 3 imports every week. Nasi Pro unlocks unlimited imports, smart scanning, cook mode and sync & backup. It starts with a 3-day free trial, then costs $29.99 a year.'],
  ['Can I plan meals and shop from my recipes?', 'Yes. Drop recipes onto your week in Plan, then pin them to your Tote. Ingredients from every recipe land on one list you can tick off in the store.'],
  ['Can I use it while I cook?', 'Yes. Cook mode shows one big step at a time, runs the timers for you and works hands-free, so you never touch the screen with floury fingers.'],
]

export const fmtQ = (q) => {
  if (q === 0) return ''
  const w = Math.floor(q), f = Math.round((q - w) * 4) / 4
  const frac = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[f] || ''
  if (f === 1) return String(w + 1)
  return (w ? String(w) : '') + frac || String(+q.toFixed(1))
}
