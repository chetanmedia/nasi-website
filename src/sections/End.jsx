import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Icon, AppIcon, AppStore, Title, Eyebrow, Reveal } from '../ui'
import { FAQ, APP_STORE_URL, img } from '../data'
import { useEffect } from 'react'

export function Pricing() {
  return (
    <section className="band pricing" id="pricing" data-mood="navy">
      <div className="wrap">
        <div className="sh center">
          <Eyebrow icon="sparkle">Pricing</Eyebrow>
          <Title>Start free. *Go Pro when you’re hooked.*</Title>
        </div>
        <div className="prices">
          <Reveal className="price">
            <h3>Free</h3>
            <div className="amt"><b>$0</b><span>forever</span></div>
            <p className="per">3 imports every week</p>
            <ul className="feat">
              {['3 imports a week from reels, links, photos, PDFs and text', 'Cookbooks, favorites and search', 'Meal plan and hands-free cook mode'].map((f) => <li key={f}><Icon n="check" size={18} sw={2.6} />{f}</li>)}
            </ul>
            <a className="go" href={APP_STORE_URL}>Download free</a>
          </Reveal>
          <Reveal className="price pro" delay={0.1}>
            <h3><span className="tagpro">Nasi Pro</span><span className="trial">3 days free</span></h3>
            <div className="amt"><b>$29.99</b><span>/ year</span></div>
            <p className="per">That’s $2.50 a month</p>
            <ul className="pfeat">
              {[['down', 'Unlimited imports', 'Reels, TikToks, links, photos'], ['scan', 'Smart scanning', 'Screenshots become recipes'], ['flame', 'Cook mode', 'Step-by-step with timers'], ['cloud', 'Sync & backup', 'Never lose a recipe again']].map(([ic, h, p]) => (
                <li key={h}><span className="pfi"><Icon n={ic} size={20} /></span><div><b>{h}</b><small>{p}</small></div></li>
              ))}
            </ul>
            <a className="go cta" href={APP_STORE_URL}>Start my 3-day free trial <Icon n="arrow" size={18} sw={2.4} /></a>
            <p className="nopay">No payment due today · Cancel anytime</p>
          </Reveal>
        </div>
        <p className="legal">Nasi Pro starts with a 3-day free trial, then renews at $29.99 a year through your Apple ID unless cancelled at least 24 hours before the trial or period ends. Manage or cancel any time in your App Store account settings.</p>
      </div>
    </section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="band faq" id="faq" data-mood="navy">
      <div className="wrap faq-grid">
        <div className="sh">
          <Eyebrow icon="bubble">Questions</Eyebrow>
          <Title>Good to *know.*</Title>
          <Reveal as="p" className="sub">Something else on your mind? Use “Contact Us” in the app’s settings and the developer reads every message.</Reveal>
        </div>
        <div className="qa">
          {FAQ.slice(0, 5).map(([q, a], i) => (
            <div key={q} className={`qi ${open === i ? 'open' : ''}`}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span><motion.i animate={{ rotate: open === i ? 45 : 0 }}><Icon n="plus" size={20} /></motion.i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                    <p>{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Journal() {
  const [posts, setPosts] = useState([])
  useEffect(() => { fetch('./blog/posts.json').then((r) => (r.ok ? r.json() : [])).then((d) => setPosts(Array.isArray(d) ? d.slice(0, 3) : [])).catch(() => {}) }, [])
  if (!posts.length) return null
  const fd = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  return (
    <section className="band journal" id="blog" data-mood="navy">
      <div className="wrap">
        <div className="jhead">
          <div className="sh"><Eyebrow icon="pen">From the journal</Eyebrow><Title>Kitchen know-how, *fresh every day.*</Title></div>
          <a className="jall" href="./blog/">All articles <Icon n="arrow" size={18} sw={2.4} /></a>
        </div>
        <div className="jgrid">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <a className="jcard" href={`./blog/${p.slug}/`}>
                <span className="jcv"><img src={img(p.cover)} alt="" loading="lazy" /></span>
                <span className="jtag">{p.clusterName}</span>
                <b>{p.title}</b>
                <small>{fd(p.date)} · {p.readTime} min read</small>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Final() {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 150, damping: 18 })
  return (
    <section className="final" id="download" data-mood="espresso"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1) }}>
      <div className="wrap final-in">
        <motion.div className="bigicon" style={{ rotateX: rx, rotateY: ry }} initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
          <AppIcon size={168} />
          <span className="shine" />
        </motion.div>
        <Title as="h2" className="center">Stop screenshotting recipes. *Start cooking them.*</Title>
        <Reveal as="p" className="sub center">Free on the App Store, for iPhone.</Reveal>
        <Reveal className="final-cta"><AppStore /></Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div className="fb"><span className="brand"><AppIcon size={34} /><b>Nasi</b></span><p>Recipe Saver for iPhone. Save recipes from reels, links, photos and PDFs, then plan, shop and cook.</p></div>
        <div><h6>Product</h6><ul><li><a href="#how">How it works</a></li><li><a href="#sources">Import methods</a></li><li><a href="#plan">Meal plan &amp; Tote</a></li><li><a href="#cook">Cook mode</a></li><li><a href="#pricing">Pricing</a></li></ul></div>
        
        <div><h6>Help</h6><ul><li><a href="#faq">FAQ</a></li><li><a href="./blog/">Blog</a></li><li><a href="./privacy/">Privacy Policy</a></li><li><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener">Terms of Use</a></li><li><a href="mailto:chetu699@gmail.com">chetu699@gmail.com</a></li></ul></div>
      </div>
      <div className="wrap foot-base"><span>© 2026 Nasi. All rights reserved.</span><span>For iPhone · Made by Chetan Nagaraja</span></div>
    </footer>
  )
}
