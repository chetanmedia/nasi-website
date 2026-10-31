// Blocks visitors from selected countries at Netlify's edge, before any page loads.
// Owner bypass: set GEO_BYPASS_KEY in Netlify (Site configuration → Environment variables),
// then open https://getnasi.app/?bypass=<that key> once per browser. It sets a cookie for a year.

const BLOCKED = new Set(['IN', 'PK', 'BD', 'NP']) // India, Pakistan, Bangladesh, Nepal
const COOKIE = 'nasi_bypass'

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Nasi is not available in your region</title>
<style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#0B1220;color:#e8ecf4;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;text-align:center;padding:24px}h1{font-size:22px;margin:0 0 8px}p{margin:0;color:#9aa6bd}</style>
</head><body><main><h1>Nasi is not available in your region</h1><p>Sorry, this site can't be viewed from your country.</p></main></body></html>`

export default async (request, context) => {
  const country = context.geo?.country?.code
  if (!country || !BLOCKED.has(country)) return context.next()

  const key = globalThis.Netlify?.env?.get('GEO_BYPASS_KEY')
  if (key) {
    const url = new URL(request.url)
    if (url.searchParams.get('bypass') === key) {
      url.searchParams.delete('bypass')
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': `${COOKIE}=${encodeURIComponent(key)}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`,
          'Cache-Control': 'no-store'
        }
      })
    }
    const cookie = request.headers.get('cookie') || ''
    if (cookie.split(/;\s*/).includes(`${COOKIE}=${encodeURIComponent(key)}`)) return context.next()
  }

  return new Response(page, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  })
}

export const config = { path: '/*' }
