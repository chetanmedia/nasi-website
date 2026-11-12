/* Shared page chrome for the static pages (blog, legal, tools). */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
export const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'))
export const SITE = CFG.url.replace(/\/$/, '')
export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const ICON = (up) => `${up}img/nasi-icon.png`
export function head({ title, description, url, image, up, extra = '', css = [], type = 'article' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0B1220">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${up}favicon.ico" sizes="48x48">
<link rel="icon" href="${up}favicon-96.png" sizes="96x96" type="image/png">
<link rel="icon" href="${up}favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="${up}apple-touch-icon.png">
<script defer data-website-id="s4wg5uvb3mth" src="https://appsight.thisischetan-media.workers.dev/js/script.js"></script>
<link rel="alternate" type="application/rss+xml" title="Nasi Kitchen Journal" href="${SITE}/blog/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="${up}blog/blog.css">
${css.map((c) => `<link rel="stylesheet" href="${up}${c}">`).join('\n')}
${extra}
</head>
<body>`
}
export function nav(up, on = 'blog') {
  return `<header class="nav"><a class="brand" href="${up}"><img src="${ICON(up)}" width="34" height="34" alt=""><b>Nasi</b></a>
<nav><a href="${up}#how">How it works</a><a href="${up}#sources">Import</a><a href="${up}#pricing">Pricing</a><a href="${up}tools/"${on === 'tools' ? ' class="on"' : ''}>Tools</a><a href="${up}blog/"${on === 'blog' ? ' class="on"' : ''}>Blog</a></nav>
<a class="store" href="${CFG.appStore}"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.6-.75 3-.75s1.79.75 3.01.72c1.25-.02 2.04-1.13 2.8-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.48-3.71zM14.08 5.85c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.78-.97 2.83 1.02.08 2.07-.52 2.71-1.29z"/></svg><span><small>Download on the</small><b>App Store</b></span></a></header>`
}
export function appCard(up, cls = '') {
  return `<aside class="appcard ${cls}"><img src="${ICON(up)}" width="56" height="56" alt=""><b>Saw a recipe on a reel?</b><p>Share it to Nasi and get a clean recipe with exact amounts and steps. Free on iPhone.</p><a class="btn" href="${CFG.appStore}">Get Nasi free</a></aside>`
}
export function foot(up, scripts = []) {
  return `<footer class="foot"><div class="wrap"><a class="brand" href="${up}"><img src="${ICON(up)}" width="30" height="30" alt=""><b>Nasi</b></a><p>Recipe Saver for iPhone. Save recipes from reels, photos and PDFs, then plan and cook.</p><nav><a href="${up}">Home</a><a href="${up}tools/">Tools</a><a href="${up}blog/">Blog</a><a href="${up}#pricing">Pricing</a><a href="${up}privacy/">Privacy</a><a href="mailto:${CFG.email}">Contact</a></nav><small>© ${new Date().getFullYear()} Nasi</small></div></footer>
<script src="${up}blog/blog.js" defer></script>
${scripts.map((s) => `<script type="module" src="${up}${s}"></script>`).join('\n')}
</body></html>`
}

/* Promo for the free tools, dropped into related blog posts. */
export function toolCard(up, kind) {
  const T = {
    turkey: { href: 'tools/turkey-calculator/', e: '🦃', b: 'Free turkey calculator', p: 'Enter your guest count. Get the turkey size, thaw date, oven times and a timeline for the day.' },
    converter: { href: 'tools/kitchen-converter/', e: '🥄', b: 'Free kitchen converter', p: 'Cups, spoons, ounces, ml and grams in one place, plus exactly which measuring cups and spoons to use.' },
    substitute: { href: 'tools/substitute-finder/', e: '🔁', b: 'Free substitute finder', p: 'Out of an ingredient? Find a swap that works, scaled to exactly how much you need.' },
    scaler: { href: 'tools/recipe-scaler/', e: '⚖️', b: 'Free recipe scaler', p: 'Paste any ingredient list, pick your servings and every amount resizes into easy measurements.' }
  }
  const t = T[kind] || T.converter
  return `<a class="toolcard" href="${up}${t.href}"><i>${t.e}</i><span><b>${t.b}</b><small>${t.p}</small></span><em>Open</em></a>`
}
