/* Builds the free tools into dist/tools: the kitchen converter, one page per popular
 * exact amount ("8 cups to ounces"), the turkey calculator and a hub page.
 * Runs after build-blog.mjs and appends its URLs to the sitemap. */
import fs from 'node:fs'
import path from 'node:path'
import { head, nav, appCard, foot, esc, SITE, CFG } from './chrome.mjs'
import { UNITS, VOL_UNITS, WT_UNITS, INGREDIENTS, ING, convert, fmt, niceFraction, asciiFraction, measureText, toMl, ROAST, sidesFor } from './tools/core.js'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const OUT = path.join(ROOT, 'dist/tools')
const urls = []
const write = (rel, html) => {
  const dir = path.join(OUT, rel)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  urls.push(`${SITE}/tools/${rel ? rel + '/' : ''}`)
}
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`
const faqLd = (faq) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
const crumbLd = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: u })) })
const appLd = (name, url, desc) => ({ '@context': 'https://schema.org', '@type': 'WebApplication', name, url, description: desc, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: 'Nasi' } })
const faqHtml = (faq) => `<section class="faq tfaq rv" id="faq"><h2>Questions people ask</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</section>`
const uName = (u, n) => (Math.abs(n - 1) < 1e-9 ? UNITS[u].one : UNITS[u].many)
const pretty = (n) => { const f = niceFraction(n, 1e-6); return f ? f.text : fmt(n) }
const slugAmt = (n) => asciiFraction(n).replace(/[ /]/g, '-')

/* ---------- converter widget markup (hydrated by converter.js) ---------- */
const FRACTIONS = [['¼', '1/4'], ['⅓', '1/3'], ['½', '1/2'], ['⅔', '2/3'], ['¾', '3/4'], ['1', '1'], ['1½', '1 1/2'], ['2', '2'], ['4', '4']]
const unitChips = () => `<div class="scroll"><div class="chips">
  <span class="pill"></span>
  ${VOL_UNITS.map((u) => `<button data-v="${u}">${UNITS[u].short}</button>`).join('')}
  <span class="sep"></span>
  ${WT_UNITS.map((u) => `<button data-v="${u}" class="wt">${UNITS[u].short}${u === 'oz' ? ' <small>wt</small>' : ''}</button>`).join('')}
</div></div>`
function widget({ a = 1, from = 'cup', to = 'tbsp', ing = 'water', main = false, home = '' }) {
  const out = convert(a, from, to, ing)
  const crosses = UNITS[from].kind !== UNITS[to].kind
  return `<section class="cv-app" data-a="${a}" data-from="${from}" data-to="${to}" data-ing="${ing}"${main ? ' data-main' : ''}${home ? ` data-home="${home}"` : ''}>
  <div class="cv-in">
    <div class="cv-row"><span class="lbl">Amount</span><span class="hint">Try 1 1/2 or 3/4. Use ↑ ↓ to nudge.</span></div>
    <div class="cv-amt">
      <button class="cv-step" data-d="-1" aria-label="Less">−</button>
      <input class="cv-num" inputmode="decimal" autocomplete="off" spellcheck="false" value="${asciiFraction(a)}" aria-label="Amount">
      <button class="cv-step" data-d="1" aria-label="More">+</button>
    </div>
    <div class="cv-fr">${FRACTIONS.map(([l, v]) => `<button data-v="${v}">${l}</button>`).join('')}</div>
    <div class="cv-row"><span class="lbl">From</span></div>
    <div class="cv-units" data-role="from">${unitChips()}</div>
    <div class="cv-ings"><div class="cv-row"><span class="lbl">Ingredient</span><span class="hint">Matters when you go between cups and grams</span></div>
      <div class="scroll"><div class="chips"><span class="pill"></span>${INGREDIENTS.map((i) => `<button data-v="${i.id}"><i>${i.e}</i>${esc(i.name)}</button>`).join('')}</div></div></div>
  </div>
  <div class="cv-out">
    <p class="cv-eq"><span class="cv-from-txt">${pretty(a)} ${uName(from, a)}${crosses ? ` of ${ING[ing].name.toLowerCase()}` : ''}</span> equals</p>
    <div class="cv-big"><b class="cv-res">${fmt(out)}</b> <span class="cv-res-u">${uName(to, out)}</span></div>
    <div class="cv-badge"></div>
    <div class="cv-units" data-role="to"><div class="cv-row"><span class="lbl">To</span></div>${unitChips()}</div>
    <div class="cv-vis"><span class="cv-jugcap"></span><div class="cv-measure"><b></b><div class="cv-scoops"></div></div></div>
    <div class="cv-actions">
      <button class="cv-swap" aria-label="Swap units"><svg viewBox="0 0 24 24"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Swap</span></button>
      <button class="cv-copy"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>Copy</span></button>
      <button class="cv-share"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Share</span></button>
    </div>
  </div>
  <div class="cv-all"><p class="lbl">Everything at once <span class="hint">Tap one to make it your answer</span></p><div class="grid">
    ${[...VOL_UNITS, ...WT_UNITS].map((u) => `<button data-u="${u}" class="${UNITS[u].kind}"><b>${fmt(convert(a, from, u, ing))}</b><span>${UNITS[u].many}</span></button>`).join('')}
  </div></div>
  ${main ? '<div class="cv-recent" hidden><p class="lbl">Your recent conversions <button class="clear">Clear</button></p><div class="list"></div></div>' : ''}
</section>`
}

/* ---------- exact-amount pages ---------- */
const CUPS_OZ = [1 / 8, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8]
const TBSP_IN = [1 / 8, 2 / 3, 3 / 4, 1.5, 2]
const GRAMS = [10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 113, 120, 125, 130, 140, 150, 160, 170, 175, 180, 200, 220, 225, 240, 250, 270, 300, 340, 350, 375, 400, 450, 500, 600, 700, 750, 800]
const G_TABLE = ['flour', 'bread-flour', 'almond-flour', 'sugar', 'brown-sugar', 'powdered-sugar', 'butter', 'water', 'milk', 'oil', 'oats', 'rice', 'cocoa', 'choc-chips', 'cheese']
const pages = []
for (const c of CUPS_OZ) {
  const word = c <= 1 ? 'Cup' : 'Cups'
  const t = asciiFraction(c)
  pages.push({ kind: 'cups-oz', a: c, slug: `${slugAmt(c)}-${c <= 1 ? 'cup' : 'cups'}-to-ounces`, title: `${t} ${word} to Ounces`, short: `${t} ${word.toLowerCase()} → oz`, from: 'cup', to: 'floz' })
}
for (const c of TBSP_IN) {
  const t = asciiFraction(c)
  pages.push({ kind: 'tbsp-in', a: c, slug: `tablespoons-in-${slugAmt(c)}-${c <= 1 ? 'cup' : 'cups'}`, title: `How Many Tablespoons in ${t} ${c <= 1 ? 'Cup' : 'Cups'}?`, short: `Tbsp in ${t} cup${c > 1 ? 's' : ''}`, from: 'cup', to: 'tbsp' })
}
for (const g of GRAMS) pages.push({ kind: 'g-cups', a: g, slug: `${g}-grams-to-cups`, title: `${g} Grams to Cups`, short: `${g} g → cups`, from: 'g', to: 'cup', ing: 'flour' })

function nearby(p) {
  const same = pages.filter((x) => x.kind === p.kind && x.slug !== p.slug)
  const i = pages.filter((x) => x.kind === p.kind).findIndex((x) => x.slug === p.slug)
  const around = same.slice(Math.max(0, i - 4), Math.max(0, i - 4) + 8)
  const other = pages.filter((x) => x.kind !== p.kind).filter((_, k) => k % 7 === 0).slice(0, 4)
  return [...around, ...other]
}

function amountPage(p) {
  const up = '../../../'
  const url = `${SITE}/tools/convert/${p.slug}/`
  let answer, sub, body, faq, desc
  if (p.kind === 'cups-oz') {
    const oz = convert(p.a, 'cup', 'floz'), tb = convert(p.a, 'cup', 'tbsp'), ml = convert(p.a, 'cup', 'ml')
    const t = asciiFraction(p.a), cw = p.a <= 1 ? 'cup' : 'cups'
    answer = `${pretty(p.a)} ${cw} = <em>${fmt(oz)} fl oz</em>`
    sub = `That’s ${fmt(tb)} tablespoons or about ${fmt(ml)} ml. One US cup holds 8 fluid ounces, so multiply cups by 8.`
    desc = `${t} ${cw} equals ${fmt(oz)} fluid ounces (${fmt(tb)} tablespoons, ${fmt(ml)} ml). See the dry weight for flour, sugar and butter, plus a live converter.`
    body = `<h2>How many ounces are in ${t} ${cw}?</h2>
<p>${t} ${cw} is <strong>${fmt(oz)} fluid ounces</strong>. A US cup is 8 fluid ounces, so ${t} × 8 = ${fmt(oz)}. Fluid ounces measure <em>volume</em>, which is what you want for water, milk, broth and other liquids.</p>
<p>To measure it, use ${measureText(ml)}.</p>
<h2>What does ${t} ${cw} weigh in ounces?</h2>
<p>Dry ingredients are different. Weight ounces depend on what’s in the cup, because a cup of flour is much lighter than a cup of honey. Here is ${t} ${cw} by weight:</p>
<div class="tbl"><table><thead><tr><th>Ingredient</th><th>${t} ${cw} weighs</th><th>In grams</th></tr></thead><tbody>
${['flour', 'sugar', 'brown-sugar', 'butter', 'water', 'milk', 'honey', 'oats', 'rice', 'choc-chips'].map((i) => `<tr><td>${ING[i].e} ${ING[i].name}</td><td>${fmt(convert(p.a, 'cup', 'oz', i))} oz</td><td>${fmt(convert(p.a, 'cup', 'g', i))} g</td></tr>`).join('')}
</tbody></table></div>
<h2>Cups to ounces chart</h2>
<div class="tbl"><table><thead><tr><th>Cups</th><th>Fluid ounces</th><th>Tablespoons</th><th>Milliliters</th></tr></thead><tbody>
${CUPS_OZ.map((c) => `<tr${c === p.a ? ' class="hl"' : ''}><td>${pretty(c)} ${c <= 1 ? 'cup' : 'cups'}</td><td>${fmt(c * 8)} fl oz</td><td>${fmt(c * 16)} tbsp</td><td>${fmt(convert(c, 'cup', 'ml'))} ml</td></tr>`).join('')}
</tbody></table></div>`
    faq = [
      [`How many ounces in ${t} ${cw}?`, `${t} ${cw} equals ${fmt(oz)} US fluid ounces. Multiply the number of cups by 8 to get fluid ounces.`],
      [`Is ${t} ${cw} ${fmt(oz)} ounces dry or liquid?`, `${fmt(oz)} ounces is the liquid (fluid ounce) measure. Dry ingredients are measured by weight, so ${t} ${cw} of flour weighs about ${fmt(convert(p.a, 'cup', 'oz', 'flour'))} oz, while the same volume of sugar weighs about ${fmt(convert(p.a, 'cup', 'oz', 'sugar'))} oz.`],
      [`How many tablespoons are in ${t} ${cw}?`, `There are ${fmt(tb)} tablespoons in ${t} ${cw}, because one cup holds 16 tablespoons.`]
    ]
  } else if (p.kind === 'tbsp-in') {
    const tb = convert(p.a, 'cup', 'tbsp'), tsp = convert(p.a, 'cup', 'tsp'), ml = convert(p.a, 'cup', 'ml')
    const t = asciiFraction(p.a), cw = p.a <= 1 ? 'cup' : 'cups'
    const nf = niceFraction(tb)
    answer = `${pretty(p.a)} ${cw} = <em>${nf ? nf.text : fmt(tb)} tbsp</em>`
    sub = `That’s ${fmt(tsp)} teaspoons, ${fmt(p.a * 8)} fl oz or about ${fmt(ml)} ml. One cup holds 16 tablespoons.`
    desc = `There are ${fmt(tb)} tablespoons in ${t} ${cw} (${fmt(tsp)} teaspoons). Get the fastest way to measure it, a full chart and a live converter.`
    body = `<h2>How many tablespoons are in ${t} ${cw}?</h2>
<p>There are <strong>${fmt(tb)} tablespoons</strong> in ${t} ${cw}. A cup holds 16 tablespoons, so ${t} × 16 = ${fmt(tb)}.${tb % 1 ? ` The leftover ${pretty(tb % 1)} tablespoon is ${fmt((tb % 1) * 3)} teaspoon${Math.abs((tb % 1) * 3 - 1) < 1e-9 ? '' : 's'}.` : ''}</p>
<p>Fastest way to measure it: ${measureText(ml)}.</p>
<h2>Tablespoons in a cup chart</h2>
<div class="tbl"><table><thead><tr><th>Cups</th><th>Tablespoons</th><th>Teaspoons</th><th>Fluid ounces</th></tr></thead><tbody>
${[1 / 16, 1 / 8, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 1.5, 2, 3, 4].map((c) => `<tr${c === p.a ? ' class="hl"' : ''}><td>${pretty(c)} cup${c > 1 ? 's' : ''}</td><td>${pretty(c * 16)} tbsp</td><td>${fmt(c * 48)} tsp</td><td>${fmt(c * 8)} fl oz</td></tr>`).join('')}
</tbody></table></div>`
    faq = [
      [`How many tablespoons in ${t} ${cw}?`, `${t} ${cw} equals ${fmt(tb)} tablespoons. One US cup holds 16 tablespoons.`],
      [`How many teaspoons in ${t} ${cw}?`, `${t} ${cw} equals ${fmt(tsp)} teaspoons, because one tablespoon is 3 teaspoons and one cup is 48 teaspoons.`],
      [`What is the easiest way to measure ${t} ${cw}?`, `Use ${measureText(ml)}. Level each scoop with a straight edge for dry ingredients.`]
    ]
  } else {
    const g = p.a
    const rows = G_TABLE.map((i) => { const c = convert(g, 'g', 'cup', i); const nf = niceFraction(c, 0.04); return { i, c, nf, how: measureText(toMl(g, 'g', i)) } })
    const fl = rows.find((r) => r.i === 'flour'), su = rows.find((r) => r.i === 'sugar'), wa = rows.find((r) => r.i === 'water')
    answer = `${g} g flour ≈ <em>${fl.nf ? fl.nf.text : fmt(fl.c)} cup</em>`
    sub = `${g} grams depends on the ingredient: about ${fmt(su.c)} cup of sugar, ${fmt(wa.c)} cup of water, ${fmt(fl.c)} cup of flour.`
    desc = `${g} grams to cups for flour (${fmt(fl.c)} cup), sugar (${fmt(su.c)} cup), butter, water and more, with the exact measuring cups to use.`
    body = `<h2>How many cups is ${g} grams?</h2>
<p>It depends on what you’re measuring, because grams are weight and cups are volume. <strong>${g} grams of all-purpose flour is about ${fmt(fl.c)} cup</strong>, while ${g} grams of granulated sugar is about ${fmt(su.c)} cup and ${g} grams of water is about ${fmt(wa.c)} cup. Pick your ingredient in the converter above for an exact answer.</p>
<div class="tbl"><table><thead><tr><th>Ingredient</th><th>${g} grams in cups</th><th>Measure it with</th></tr></thead><tbody>
${rows.map((r) => `<tr><td>${ING[r.i].e} ${ING[r.i].name}</td><td>${fmt(r.c)} cup${r.nf ? ` <small>(${r.nf.text})</small>` : ''}</td><td>${r.how}</td></tr>`).join('')}
</tbody></table></div>
<h2>Why do grams to cups change by ingredient?</h2>
<p>A cup is a fixed volume, but ingredients pack differently. Flour is light and airy, sugar crystals are dense and honey is heavier still. That’s why bakers prefer a scale: ${g} grams is always ${g} grams, but a cup can vary by 10% or more depending on how you scoop. If you’re using cups, spoon flour into the cup and level it off instead of scooping straight from the bag.</p>
<p class="src">Weights per cup follow King Arthur Baking’s ingredient weight chart.</p>`
    faq = [
      [`How many cups is ${g} grams of flour?`, `${g} grams of all-purpose flour is about ${fmt(fl.c)} cup, using 120 grams per cup. Spoon the flour into the cup and level it for the most accurate result.`],
      [`How many cups is ${g} grams of sugar?`, `${g} grams of granulated sugar is about ${fmt(su.c)} cup, using 198 grams per cup.`],
      [`How many cups is ${g} grams of water?`, `${g} grams of water is about ${fmt(wa.c)} cup, since one cup of water weighs about 237 grams.`]
    ]
  }
  const rel = nearby(p)
  return head({ title: `${p.title} · Nasi Kitchen Converter`, description: desc, url, image: `${SITE}/og.jpg`, up, css: ['tools/tools.css'], type: 'website', extra: ld(faqLd(faq)) + ld(crumbLd([['Home', SITE + '/'], ['Tools', SITE + '/tools/'], ['Kitchen converter', SITE + '/tools/kitchen-converter/'], [p.title, url]])) }) + nav(up, 'tools') + `
<main class="wrap tool">
  <header class="thead small">
    <p class="crumbs"><a href="${up}tools/">Tools</a> <span>/</span> <a href="${up}tools/kitchen-converter/">Kitchen converter</a></p>
    <h1>${esc(p.title)}</h1>
    <p class="answer">${answer}</p>
    <p class="sub">${sub}</p>
  </header>
  ${widget({ a: p.a, from: p.from, to: p.to, ing: p.ing || 'water', home: '/tools/kitchen-converter/' })}
  <div class="tbody">
    <article class="prose rv">${body}</article>
    <aside class="tside">${appCard(up)}</aside>
  </div>
  ${faqHtml(faq)}
  <section class="more rv"><h2>More conversions</h2><div class="links">${rel.map((r) => `<a href="${up}tools/convert/${r.slug}/">${esc(r.short)}</a>`).join('')}<a class="all" href="${up}tools/kitchen-converter/">Open the full converter →</a></div></section>
</main>` + foot(up, ['tools/converter.js'])
}

/* ---------- main converter page ---------- */
function converterPage() {
  const up = '../../'
  const url = `${SITE}/tools/kitchen-converter/`
  const faq = [
    ['How many tablespoons are in a cup?', 'There are 16 tablespoons in one US cup, 8 in half a cup and 4 in a quarter cup. One tablespoon is 3 teaspoons.'],
    ['Are fluid ounces the same as ounces?', 'No. Fluid ounces measure volume and ounces measure weight. One cup is always 8 fluid ounces, but a cup of flour weighs about 4.2 ounces while a cup of water weighs about 8.3 ounces.'],
    ['Why does grams to cups depend on the ingredient?', 'Grams measure weight and cups measure volume. A cup of all-purpose flour weighs about 120 grams, a cup of sugar about 198 grams and a cup of honey about 336 grams, so pick the ingredient for an accurate answer.'],
    ['How many ml is a US cup?', 'One US cup is about 236.6 ml. Recipes often round it to 240 ml. A metric cup used in Australia and elsewhere is 250 ml.'],
    ['How do I measure flour accurately with cups?', 'Spoon the flour into the cup until it mounds, then level it with the back of a knife. Scooping straight from the bag packs the flour and can add 20% or more.']
  ]
  const desc = 'Free kitchen converter: cups, tablespoons, teaspoons, fluid ounces, ml, grams and ounces, with ingredient-aware grams to cups and the exact measuring cups to use.'
  const popular = pages.filter((p) => ['8-cups-to-ounces', '4-cups-to-ounces', '1-2-cup-to-ounces', '6-cups-to-ounces', '3-4-cup-to-ounces', '1-3-cup-to-ounces', '100-grams-to-cups', '200-grams-to-cups', '150-grams-to-cups', '250-grams-to-cups', 'tablespoons-in-1-1-2-cups', 'tablespoons-in-3-4-cup'].includes(p.slug))
  return head({ title: 'Kitchen Converter: Cups, Tablespoons, Ounces, Grams · Nasi', description: desc, url, image: `${SITE}/og.jpg`, up, css: ['tools/tools.css'], type: 'website', extra: ld(appLd('Nasi Kitchen Converter', url, desc)) + ld(faqLd(faq)) + ld(crumbLd([['Home', SITE + '/'], ['Tools', SITE + '/tools/'], ['Kitchen converter', url]])) }) + nav(up, 'tools') + `
<main class="wrap tool">
  <header class="thead">
    <p class="eyebrow">Free kitchen tool</p>
    <h1>Kitchen <em>converter</em></h1>
    <p class="sub">Type an amount once and see it in every unit. Switch the ingredient for grams, and get the exact cups and spoons to grab from the drawer.</p>
  </header>
  ${widget({ a: 1, from: 'cup', to: 'tbsp', ing: 'water', main: true })}
  <section class="pop rv"><h2>Popular conversions</h2><div class="links">${popular.map((r) => `<a href="${up}tools/convert/${r.slug}/">${esc(r.short)}</a>`).join('')}</div></section>
  <div class="tbody">
    <article class="prose rv">
<h2>How do kitchen conversions work?</h2>
<p>US recipes measure by <strong>volume</strong> (cups, tablespoons, teaspoons, fluid ounces), while most of the world uses <strong>weight</strong> (grams). Volume to volume is simple math. Volume to weight needs one more thing: the ingredient. A cup of flour and a cup of sugar take up the same space but weigh very different amounts.</p>
<h2>Cooking measurement cheat sheet</h2>
<div class="tbl"><table><thead><tr><th>Amount</th><th>Tablespoons</th><th>Teaspoons</th><th>Fluid ounces</th><th>Milliliters</th></tr></thead><tbody>
${[1, 3 / 4, 2 / 3, 1 / 2, 1 / 3, 1 / 4, 1 / 8].map((c) => `<tr><td>${pretty(c)} cup</td><td>${pretty(c * 16)} tbsp</td><td>${fmt(c * 48)} tsp</td><td>${fmt(c * 8)} fl oz</td><td>${fmt(convert(c, 'cup', 'ml'))} ml</td></tr>`).join('')}
<tr><td>1 tablespoon</td><td>1 tbsp</td><td>3 tsp</td><td>½ fl oz</td><td>${fmt(UNITS.tbsp.base)} ml</td></tr>
<tr><td>1 teaspoon</td><td>⅓ tbsp</td><td>1 tsp</td><td>⅙ fl oz</td><td>${fmt(UNITS.tsp.base)} ml</td></tr>
</tbody></table></div>
<h2>How much does a cup weigh?</h2>
<p>Grams in one level US cup for common ingredients. Use these when a recipe gives cups and you’d rather weigh.</p>
<div class="tbl"><table><thead><tr><th>Ingredient</th><th>1 cup</th><th>½ cup</th><th>1 tbsp</th></tr></thead><tbody>
${INGREDIENTS.map((i) => `<tr><td>${i.e} ${i.name}</td><td>${fmt(i.g)} g</td><td>${fmt(i.g / 2)} g</td><td>${fmt(i.g / 16)} g</td></tr>`).join('')}
</tbody></table></div>
<p class="src">Ingredient weights follow King Arthur Baking’s ingredient weight chart. US customary units throughout.</p>
    </article>
    <aside class="tside">${appCard(up)}</aside>
  </div>
  ${faqHtml(faq)}
</main>` + foot(up, ['tools/converter.js'])
}

/* ---------- turkey calculator ---------- */
function turkeyPage() {
  const up = '../../'
  const url = `${SITE}/tools/turkey-calculator/`
  const desc = 'Free Thanksgiving turkey calculator: how big a turkey to buy for your guests, when to start thawing, how long to roast at 325°F, plus a timeline and side dish amounts.'
  const faq = [
    ['How much turkey do I need per person?', 'Plan about 1 pound of whole turkey per person, or 1½ pounds if you want leftovers. For a bone-in turkey breast, plan about ¾ pound per person.'],
    ['How long does a turkey take to thaw in the fridge?', 'Allow about 24 hours for every 4 to 5 pounds in a refrigerator at 40°F or below. A 16-pound turkey needs about 4 days, so it should go in the fridge the Sunday before Thanksgiving.'],
    ['Can I thaw a turkey in cold water?', 'Yes. Keep it in its wrapping, submerge it in cold tap water and change the water every 30 minutes. Allow about 30 minutes per pound, then cook it right away.'],
    ['How long do I roast a turkey at 325°F?', 'An unstuffed 12 to 14 pound turkey takes about 3 to 3¾ hours at 325°F. Times are a guide: the turkey is done when a thermometer reads 165°F in the thickest part of the breast, the innermost thigh and the wing.'],
    ['How long should a turkey rest before carving?', 'Let it rest at least 20 minutes, loosely covered with foil. Resting lets the juices settle and makes carving easier.']
  ]
  const thawRows = [['4 to 12', '1 to 3 days', '2 to 6 hours'], ['12 to 16', '3 to 4 days', '6 to 8 hours'], ['16 to 20', '4 to 5 days', '8 to 10 hours'], ['20 to 24', '5 to 6 days', '10 to 12 hours']].map(([w, f, c]) => `<tr><td>${w} lb</td><td>${f}</td><td>${c}</td></tr>`).join('')
  const roastRows = ROAST.unstuffed.slice(1).map((r, i) => { const s = ROAST.stuffed[i + 1]; const h = (x) => { const w = Math.floor(x), f = x - w; return `${w}${f === 0.25 ? '¼' : f === 0.5 ? '½' : f === 0.75 ? '¾' : ''}` }; return `<tr><td>${r[0]} to ${r[1]} lb</td><td>${h(r[2])} to ${h(r[3])} hours</td><td>${h(s[2])} to ${h(s[3])} hours</td></tr>` }).join('')
  return head({ title: 'Turkey Calculator: Size, Thaw Time and Roast Time · Nasi', description: desc, url, image: `${SITE}/og.jpg`, up, css: ['tools/tools.css'], type: 'website', extra: ld(appLd('Nasi Turkey Calculator', url, desc)) + ld(faqLd(faq)) + ld(crumbLd([['Home', SITE + '/'], ['Tools', SITE + '/tools/'], ['Turkey calculator', url]])) }) + nav(up, 'tools') + `
<main class="wrap tool turkey">
  <header class="thead">
    <p class="eyebrow">Free Thanksgiving tool</p>
    <h1>Turkey <em>calculator</em></h1>
    <p class="sub">Tell us who’s coming. We’ll tell you what size turkey to buy, when it has to go in the fridge, when it goes in the oven and what to cook alongside it.</p>
  </header>
  <section class="tk-app">
    <div class="tk-in">
      <div class="tk-guests">
        <span class="lbl">Guests</span>
        <div class="tk-count"><button class="tk-step" data-d="-1" aria-label="Fewer guests">−</button><output class="tk-n">10</output><button class="tk-step" data-d="1" aria-label="More guests">+</button></div>
        <input class="tk-range" type="range" min="2" max="40" value="10" aria-label="Guests">
        <div class="tk-plates" aria-hidden="true"></div>
      </div>
      <div class="tk-opt" data-k="leftovers"><span class="lbl">Appetite</span><div class="seg"><span class="pill"></span><button data-v="0" class="on">Just dinner</button><button data-v="1">Plenty of leftovers</button></div></div>
      <div class="tk-opt" data-k="cut"><span class="lbl">Turkey</span><div class="seg"><span class="pill"></span><button data-v="whole" class="on">Whole bird</button><button data-v="breast">Bone-in breast</button></div></div>
      <div class="tk-opt" data-k="frozen"><span class="lbl">Buying it</span><div class="seg"><span class="pill"></span><button data-v="1" class="on">Frozen</button><button data-v="0">Fresh</button></div></div>
      <div class="tk-opt" data-k="stuffed"><span class="lbl">Stuffing</span><div class="seg"><span class="pill"></span><button data-v="0" class="on">In a dish</button><button data-v="1">Inside the bird</button></div></div>
      <div class="tk-when"><label><span class="lbl">Dinner day</span><input type="date" class="tk-date" value="2026-11-26"></label><label><span class="lbl">Dinner time</span><input type="time" class="tk-time" value="16:00" step="900"></label></div>
    </div>
    <div class="tk-out">
      <div class="tk-hero">
        <div class="tk-bird" aria-hidden="true"><svg viewBox="0 0 260 190">
          <defs><radialGradient id="tkb" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#F3B562"/><stop offset=".55" stop-color="#C9732E"/><stop offset="1" stop-color="#7A3A12"/></radialGradient>
          <radialGradient id="tkl" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#EDA65A"/><stop offset="1" stop-color="#8E4515"/></radialGradient></defs>
          <g class="steam"><path d="M100 40c-8-12 8-18 0-30"/><path d="M130 34c-8-12 8-18 0-30"/><path d="M160 40c-8-12 8-18 0-30"/></g>
          <ellipse cx="130" cy="166" rx="120" ry="20" fill="#EDE6DA"/><ellipse cx="130" cy="162" rx="104" ry="14" fill="#fff" opacity=".9"/>
          <g class="body">
            <path d="M58 150c-14-34 4-82 72-86s92 48 74 86z" fill="url(#tkb)"/>
            <path d="M84 96c18-14 70-16 90 2" stroke="#FFD9A0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
            <g class="leg l"><path d="M70 128c-26-6-44 6-40 22 4 14 26 12 40 0z" fill="url(#tkl)"/><path d="M34 140l-12-6" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="20" cy="133" r="6" fill="#fff"/></g>
            <g class="leg r"><path d="M190 128c26-6 44 6 40 22-4 14-26 12-40 0z" fill="url(#tkl)"/><path d="M226 140l12-6" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="240" cy="133" r="6" fill="#fff"/></g>
          </g>
          <g class="herbs"><circle cx="70" cy="160" r="6" fill="#5DAA4A"/><circle cx="82" cy="164" r="5" fill="#7CC35F"/><circle cx="186" cy="161" r="6" fill="#5DAA4A"/><circle cx="198" cy="163" r="5" fill="#D9473B"/><circle cx="60" cy="163" r="4" fill="#D9473B"/></g>
        </svg></div>
        <div class="tk-buy"><p class="lbl">Buy</p><p class="tk-w"><b class="tk-lb">10</b><span>lb</span></p><p class="tk-range-txt"></p></div>
      </div>
      <div class="tk-stats">
        <div class="st thaw"><i>🧊</i><b class="v-thaw"></b><span class="s-thaw"></span></div>
        <div class="st roast"><i>🔥</i><b class="v-roast"></b><span>at 325°F, until 165°F inside</span></div>
        <div class="st rest"><i>⏳</i><b>30 min</b><span>rest before carving</span></div>
      </div>
      <div class="tk-tl"><p class="lbl">Your timeline</p><ol class="tl"></ol></div>
      <div class="tk-sides"><p class="lbl">On the side <span class="hint">Rule-of-thumb amounts for your table</span></p><div class="grid"></div></div>
      <div class="cv-actions tk-actions">
        <button class="tk-ics"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Add to calendar</span></button>
        <button class="tk-share"><svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Share plan</span></button>
        <button class="tk-print"><svg viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span>Print</span></button>
      </div>
    </div>
  </section>
  <div class="tbody">
    <article class="prose rv">
<h2>How big a turkey do I need?</h2>
<p>Plan about <strong>1 pound of whole turkey per person</strong>, or 1½ pounds if you want leftovers for sandwiches. A bone-in turkey breast needs about ¾ pound per person. Much of a whole bird’s weight is bone, which is why the numbers look generous.</p>
<p>Above about 24 pounds, two smaller birds are easier. They thaw faster, cook more evenly and fit in a normal oven side by side.</p>
<h2>How long does a turkey take to thaw?</h2>
<p>Thaw in the fridge, never on the counter. Allow about 24 hours for every 4 to 5 pounds. In a pinch, use cold water: keep the bird wrapped, submerge it and change the water every 30 minutes. Cook a water-thawed turkey right away.</p>
<div class="tbl"><table><thead><tr><th>Turkey weight</th><th>In the fridge</th><th>In cold water</th></tr></thead><tbody>${thawRows}</tbody></table></div>
<h2>How long do I roast a turkey at 325°F?</h2>
<div class="tbl"><table><thead><tr><th>Turkey weight</th><th>Unstuffed</th><th>Stuffed</th></tr></thead><tbody>${roastRows}</tbody></table></div>
<p>Times are a starting point. The turkey is done when a food thermometer reads <strong>165°F</strong> in the thickest part of the breast, the innermost part of the thigh and the wing. If you stuff the bird, the center of the stuffing must reach 165°F too, which is why many cooks bake stuffing in a separate dish.</p>
<p>Planning the rest of the meal? Our guide to <a href="${up}blog/thanksgiving-recipes-menu/">planning a Thanksgiving menu with a cooking timeline</a> covers the sides, desserts and the week-by-week plan.</p>
<p class="src">Per-person amounts, thawing and roasting times follow USDA Food Safety and Inspection Service guidance. Side dish amounts are our rule-of-thumb estimates.</p>
    </article>
    <aside class="tside">${appCard(up)}</aside>
  </div>
  ${faqHtml(faq)}
</main>` + foot(up, ['tools/turkey.js'])
}

/* ---------- hub ---------- */
function hubPage() {
  const up = '../'
  const url = `${SITE}/tools/`
  const cards = [
    ['kitchen-converter/', '🥄', 'Kitchen converter', 'Cups, spoons, fluid ounces, ml and grams, with ingredient-aware weights and the exact scoops to use.', 'conv'],
    ['turkey-calculator/', '🦃', 'Turkey calculator', 'Turkey size for your guests, thaw date, oven times and a full timeline you can add to your calendar.', 'turk']
  ]
  return head({ title: 'Free Kitchen Tools · Nasi', description: 'Free kitchen tools from Nasi: a kitchen measurement converter and a Thanksgiving turkey calculator. No sign-up, works on your phone.', url, image: `${SITE}/og.jpg`, up, css: ['tools/tools.css'], type: 'website' }) + nav(up, 'tools') + `
<main class="wrap tool hub">
  <header class="thead"><p class="eyebrow">Free kitchen tools</p><h1>Little tools for <em>busy kitchens</em></h1><p class="sub">Quick answers while your hands are covered in flour. No sign-up, works great on your phone.</p></header>
  <section class="hubgrid">
    ${cards.map(([h, e, b, p, c]) => `<a class="hcard ${c}" href="${up}tools/${h}"><i>${e}</i><b>${b}</b><p>${p}</p><em>Open tool →</em></a>`).join('')}
    <div class="hcard soon"><i>🔁</i><b>Substitute finder</b><p>Out of buttermilk? Find a swap with the right ratio.</p><em>Coming soon</em></div>
    <div class="hcard soon"><i>⚖️</i><b>Recipe scaler</b><p>Paste a recipe, pick your servings and every amount adjusts.</p><em>Coming soon</em></div>
  </section>
  <section class="pop rv"><h2>Quick conversions</h2><div class="links">${pages.filter((_, i) => i % 3 === 0).slice(0, 18).map((r) => `<a href="${up}tools/convert/${r.slug}/">${esc(r.short)}</a>`).join('')}</div></section>
  ${appCard(up, 'wide')}
</main>` + foot(up, ['tools/converter.js'])
}

/* ---------- write ---------- */
fs.mkdirSync(OUT, { recursive: true })
for (const f of ['core.js', 'converter.js', 'turkey.js', 'tools.css']) fs.copyFileSync(path.join(ROOT, 'scripts/tools', f), path.join(OUT, f))
write('', hubPage())
write('kitchen-converter', converterPage())
write('turkey-calculator', turkeyPage())
for (const p of pages) write(`convert/${p.slug}`, amountPage(p))

/* sitemap: add tool URLs */
const sm = path.join(ROOT, 'dist/sitemap.xml')
if (fs.existsSync(sm)) {
  const xml = fs.readFileSync(sm, 'utf8').replace('</urlset>', urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>')
  fs.writeFileSync(sm, xml)
}
console.log(`tools: ${urls.length} pages`)
