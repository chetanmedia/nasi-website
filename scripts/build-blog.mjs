/* Builds the Nasi Kitchen Journal from content/blog/*.md into dist/blog.
 * Runs after `vite build`. Posts dated in the future stay unpublished until their day,
 * so the daily writer can queue posts ahead of time. */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SRC = path.join(ROOT, 'content/blog')
const OUT = path.join(ROOT, 'dist')
const CFG = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'))
const SITE = CFG.url.replace(/\/$/, '')
const TODAY = process.env.BLOG_DATE || new Date().toISOString().slice(0, 10)

export const CLUSTERS = {
  APP: { name: 'Recipe apps', img: 'noodles' },
  SAVE: { name: 'Save recipes', img: 'reel1' },
  PLAN: { name: 'Meal planning', img: 'tofu' },
  REF: { name: 'Kitchen guides', img: 'cookies' },
  IDEAS: { name: 'Dinner ideas', img: 'marry' },
  SEAS: { name: 'Seasonal', img: 'lemak' },
  FAM: { name: 'Family recipes', img: 'shak' }
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/* ---------- read posts ---------- */
function readPosts() {
  if (!fs.existsSync(SRC)) return []
  return fs.readdirSync(SRC).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(SRC, f), 'utf8'))
    const slug = data.slug || f.replace(/\.md$/, '')
    const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date)
    const words = content.split(/\s+/).length
    const toc = []
    const renderer = new marked.Renderer()
    renderer.heading = (text, level) => {
      const id = slugify(text)
      if (level === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, '') })
      return `<h${level} id="${id}">${text}</h${level}>\n`
    }
    renderer.table = (header, body) => `<div class="tbl"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`
    renderer.link = (href, title, text) => {
      const ext = /^https?:/.test(href) && !href.startsWith(SITE)
      return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`
    }
    const html = marked.parse(content, { renderer })
    const cluster = CLUSTERS[data.cluster] ? data.cluster : 'SAVE'
    return {
      ...data, slug, date, cluster, html, toc,
      readTime: Math.max(2, Math.round(words / 220)),
      cover: data.cover || CLUSTERS[cluster].img,
      faq: data.faq || []
    }
  }).filter((p) => p.date <= TODAY && !p.draft).sort((a, b) => (a.date < b.date ? 1 : -1))
}

/* ---------- shared chrome (scripts/chrome.mjs) ---------- */
import { head, nav, appCard, foot, ICON, toolCard } from './chrome.mjs'

function card(p, up, big = false) {
  const c = CLUSTERS[p.cluster]
  return `<a class="card ${big ? 'big' : ''}" href="${up}blog/${p.slug}/" data-cluster="${p.cluster}">
<span class="cv"><img src="${up}img/${p.cover}.jpg" alt="" loading="${big ? 'eager' : 'lazy'}"></span>
<span class="cb"><span class="tag">${c.name}</span><b>${esc(p.title)}</b>${big ? `<span class="ex">${esc(p.description)}</span>` : ''}<span class="meta">${fmtDate(p.date)} · ${p.readTime} min read</span></span></a>`
}

/* ---------- pages ---------- */
function indexPage(posts) {
  const up = '../'
  const used = [...new Set(posts.map((p) => p.cluster))]
  const [feat, ...rest] = posts
  const ld = { '@context': 'https://schema.org', '@type': 'Blog', name: 'Nasi Kitchen Journal', url: `${SITE}/blog/`, publisher: { '@type': 'Organization', name: 'Nasi', logo: `${SITE}/img/nasi-icon.png` } }
  return head({ title: 'Nasi Kitchen Journal · Recipes, tips and kitchen know-how', description: 'Save recipes from reels, plan your week and cook with confidence. Guides, swaps and dinner ideas from the team behind Nasi: Recipe Saver.', url: `${SITE}/blog/`, image: `${SITE}/og.jpg`, up, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) + nav(up) + `
<main class="wrap idx">
  <section class="ihead"><p class="eyebrow">The Nasi Kitchen Journal</p><h1>Cook more of what you <em>save.</em></h1><p class="sub">Guides for saving recipes from reels, kitchen swaps and conversions, meal-planning help and dinner ideas.</p></section>
  ${posts.length ? `
  <div class="chips" role="tablist" aria-label="Filter by topic"><button class="on" data-f="all">All</button>${used.map((k) => `<button data-f="${k}">${CLUSTERS[k].name}</button>`).join('')}</div>
  <section class="feat">${card(feat, up, true)}</section>
  <section class="grid">${rest.map((p) => card(p, up)).join('\n')}</section>
  <p class="empty" hidden>No posts in this topic yet.</p>` : '<p class="empty">The first posts are on their way.</p>'}
  ${appCard(up, 'wide')}
</main>` + foot(up)
}

function postPage(p, posts) {
  const up = '../../'
  const url = `${SITE}/blog/${p.slug}/`
  const related = posts.filter((x) => x.slug !== p.slug && x.cluster === p.cluster).concat(posts.filter((x) => x.slug !== p.slug && x.cluster !== p.cluster)).slice(0, 3)
  const ld = [{
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.updated || p.date,
    image: `${SITE}/img/${p.cover}.jpg`, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Nasi Kitchen' }, publisher: { '@type': 'Organization', name: 'Nasi', logo: { '@type': 'ImageObject', url: `${SITE}/img/nasi-icon.png` } }, keywords: (p.keywords || []).join(', ')
  }, { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' }, { '@type': 'ListItem', position: 3, name: p.title, item: url }] }]
  if (p.faq.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })
  const toc = p.toc.length ? `<nav class="toc" aria-label="On this page"><b>On this page</b><ol>${p.toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}${p.faq.length ? '<li><a href="#faq">FAQ</a></li>' : ''}</ol></nav>` : ''
  return head({ title: `${p.title} · Nasi`, description: p.description, url, image: `${SITE}/img/${p.cover}.jpg`, up, extra: `<script type="application/ld+json">${JSON.stringify(ld)}</script>` }) + `<div class="progress"><i></i></div>` + nav(up) + `
<main class="wrap post">
  <header class="phead">
    <p class="crumbs"><a href="${up}blog/">Blog</a> <span>/</span> <a href="${up}blog/#${p.cluster}">${CLUSTERS[p.cluster].name}</a></p>
    <h1>${esc(p.title)}</h1>
    <p class="dek">${esc(p.description)}</p>
    <p class="meta"><img src="${ICON(up)}" width="28" height="28" alt=""><span>Nasi Kitchen</span><span>·</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span>·</span><span>${p.readTime} min read</span></p>
  </header>
  <figure class="pcover"><img src="${up}img/${p.cover}.jpg" alt=""></figure>
  <div class="pbody">
    <article class="prose">${p.toc.length ? `<details class="toc-m"><summary>On this page</summary>${toc}</details>` : ''}
${p.html}
${/thanksgiving|turkey/.test(p.slug) ? toolCard(up, 'turkey') : p.cluster === 'REF' ? toolCard(up, 'converter') : ''}
${p.faq.length ? `<section class="faq" id="faq"><h2>FAQ</h2>${p.faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>` : ''}
${appCard(up, 'inline')}
    </article>
    <aside class="side">${toc}${appCard(up)}</aside>
  </div>
  ${related.length ? `<section class="related"><h2>Keep reading</h2><div class="grid">${related.map((r) => card(r, up)).join('')}</div></section>` : ''}
</main>` + foot(up)
}


/* ---------- privacy policy ---------- */
function legalPage() {
  const file = path.join(ROOT, 'content/privacy.md')
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const toc = []
  const renderer = new marked.Renderer()
  renderer.heading = (text, level) => {
    const id = slugify(text)
    if (level === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, '') })
    return `<h${level} id="${id}">${level === 2 ? `<span class="num">${String(toc.length).padStart(2, '0')}</span>` : ''}${text}</h${level}>\n`
  }
  renderer.table = (header, body) => `<div class="tbl"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`
  const html = marked.parse(content, { renderer })
  const up = '../'
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated)
  const glance = [['🚫', 'No ads, no selling', 'We don’t sell your data, show ads or track you across apps.'], ['🎙️', 'Voice stays on your phone', 'Hands-free commands are recognised on your device.'], ['🔒', 'Private by default', 'Your library is yours. No public profiles or feed.'], ['🗑️', 'Delete anytime', 'Settings → Account → Delete Account removes it all.']]
  return head({ title: 'Privacy Policy · Nasi', description: 'How Nasi: Recipe Saver collects, uses and protects your information.', url: `${SITE}/privacy/`, image: `${SITE}/og.jpg`, up }) + nav(up) + `
<main class="wrap post legal">
  <header class="phead">
    <p class="crumbs"><a href="${up}">Nasi</a> <span>/</span> Legal</p>
    <h1>Privacy <em>Policy</em></h1>
    <p class="dek">What we collect, why we collect it and the choices you have. Written to be read, not skimmed past.</p>
    <p class="meta"><img src="${ICON(up)}" width="28" height="28" alt=""><span>Last updated ${fmtDate(updated)}</span></p>
  </header>
  <section class="glance">${glance.map(([e, h, t]) => `<div><i>${e}</i><b>${h}</b><p>${t}</p></div>`).join('')}</section>
  <div class="pbody">
    <article class="prose"><details class="toc-m"><summary>Contents</summary><nav class="toc"><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav></details>
${html}
    </article>
    <aside class="side"><nav class="toc" aria-label="Contents"><b>Contents</b><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>
      <div class="contact"><b>Questions?</b><p>Email us and a real person replies.</p><a class="btn" href="mailto:${CFG.email}">${CFG.email}</a></div></aside>
  </div>
</main>` + foot(up)
}

/* ---------- account deletion (Google Play "Delete account URL") ---------- */
function deletePage() {
  const file = path.join(ROOT, 'content/delete-account.md')
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const toc = []
  const renderer = new marked.Renderer()
  renderer.heading = (text, level) => {
    const id = slugify(text)
    if (level === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, '') })
    return `<h${level} id="${id}">${level === 2 ? `<span class="num">${String(toc.length).padStart(2, '0')}</span>` : ''}${text}</h${level}>\n`
  }
  const html = marked.parse(content, { renderer })
  const up = '../'
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated)
  const mail = `mailto:${CFG.email}?subject=${encodeURIComponent('Delete my Nasi account')}`
  const glance = [['📱', 'In the app', 'Settings → Account → Delete Account. Instant.'], ['✉️', 'By email', 'No app? Email us from your sign-in address.'], ['🗑️', 'Everything goes', 'Account, recipes, photos and cookbooks.'], ['⏱️', 'Within 30 days', 'Email requests are completed within 30 days.']]
  return head({ title: 'Delete your account · Nasi', description: 'How to delete your Nasi: Recipe Saver account and data, in the app or by email.', url: `${SITE}/delete-account/`, image: `${SITE}/og.jpg`, up }) + nav(up) + `
<main class="wrap post legal">
  <header class="phead">
    <p class="crumbs"><a href="${up}">Nasi</a> <span>/</span> Legal</p>
    <h1>Delete your <em>account</em></h1>
    <p class="dek">How to permanently delete your Nasi account and everything linked to it, on iPhone or Android.</p>
    <p class="meta"><img src="${ICON(up)}" width="28" height="28" alt=""><span>Last updated ${fmtDate(updated)}</span></p>
  </header>
  <section class="glance">${glance.map(([e, h, t]) => `<div><i>${e}</i><b>${h}</b><p>${t}</p></div>`).join('')}</section>
  <div class="pbody">
    <article class="prose"><details class="toc-m"><summary>Contents</summary><nav class="toc"><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav></details>
${html}
    </article>
    <aside class="side"><nav class="toc" aria-label="Contents"><b>Contents</b><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>
      <div class="contact"><b>Request deletion</b><p>Email us from the address you sign in with.</p><a class="btn" href="${mail}">Email a deletion request</a></div></aside>
  </div>
</main>` + foot(up)
}

/* ---------- write ---------- */
const posts = readPosts()
fs.mkdirSync(path.join(OUT, 'blog'), { recursive: true })
fs.copyFileSync(path.join(ROOT, 'scripts/blog.css'), path.join(OUT, 'blog/blog.css'))
fs.copyFileSync(path.join(ROOT, 'scripts/blog.js'), path.join(OUT, 'blog/blog.js'))
fs.writeFileSync(path.join(OUT, 'blog/index.html'), indexPage(posts))
for (const p of posts) {
  fs.mkdirSync(path.join(OUT, 'blog', p.slug), { recursive: true })
  fs.writeFileSync(path.join(OUT, 'blog', p.slug, 'index.html'), postPage(p, posts))
}
fs.writeFileSync(path.join(OUT, 'blog/posts.json'), JSON.stringify(posts.slice(0, 6).map(({ title, slug, cluster, date, cover, description, readTime }) => ({ title, slug, cluster, clusterName: CLUSTERS[cluster].name, date, cover, description, readTime }))))
const urls = [`${SITE}/`, `${SITE}/blog/`, ...posts.map((p) => `${SITE}/blog/${p.slug}/`), `${SITE}/privacy/`, `${SITE}/delete-account/`]
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u, i) => `<url><loc>${u}</loc>${i > 1 && posts[i - 2] ? `<lastmod>${posts[i - 2].updated || posts[i - 2].date}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`)
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
fs.writeFileSync(path.join(OUT, 'blog/rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Nasi Kitchen Journal</title><link>${SITE}/blog/</link><description>Recipes, tips and kitchen know-how from Nasi.</description>\n${posts.slice(0, 30).map((p) => `<item><title>${esc(p.title)}</title><link>${SITE}/blog/${p.slug}/</link><guid>${SITE}/blog/${p.slug}/</guid><pubDate>${new Date(p.date + 'T09:00:00Z').toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('\n')}\n</channel></rss>\n`)
const lp = legalPage()
if (lp) { fs.mkdirSync(path.join(OUT, 'privacy'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'privacy/index.html'), lp) }
const dp = deletePage()
if (dp) { fs.mkdirSync(path.join(OUT, 'delete-account'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'delete-account/index.html'), dp) }
console.log(`blog: ${posts.length} posts published (date ≤ ${TODAY})`)
