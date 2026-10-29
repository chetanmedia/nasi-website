import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useSpring } from 'framer-motion'
import { Phone, Icon, AppIcon } from '../ui'
import { ReelScreen, ShareSheet, ImportScreen, RecipeScreen } from '../screens'
import { HEARD, NOODLES } from '../data'

const PHASES = [
  { k: 'See it', h: 'Spot dinner while you scroll', p: 'A cooking reel on TikTok, Instagram or Facebook stops you mid-scroll. Instead of saving it to a folder you will never open, tap Share.' },
  { k: 'Share it', h: 'Send it to Nasi in one tap', p: 'Nasi sits in your share sheet next to Messages and Notes. Tap it and go straight back to scrolling.' },
  { k: 'Nasi reads it', h: 'Nasi watches, listens and reads', p: 'It watches the video, hears what the creator says and reads the caption. Every vague “splash” and “two big spoons” becomes an exact amount and a clear step.' },
  { k: 'Cook it', h: 'A clean recipe, ready tonight', p: 'Ingredients with amounts, numbered steps, cook time and a link back to the creator, saved in your cookbook and ready to cook.' }
]
const KIND = { audio: ['mic', 'Heard'], video: ['play', 'Seen'], caption: ['bubble', 'Read'] }

// timeline (fractions of the section's scroll)
const T = { shareIn: [0.17, 0.23], tapNasi: 0.29, sheetOut: [0.31, 0.35], impIn: [0.33, 0.37], tok0: 0.4, tokGap: 0.031, tokLen: 0.1, collapse: [0.76, 0.84], recipeIn: [0.77, 0.83], scroll: [0.85, 0.985] }
const phaseOf = (v) => (v < 0.17 ? 0 : v < 0.34 ? 1 : v < 0.76 ? 2 : 3)
const PH_EDGES = [0, 0.17, 0.34, 0.76, 1]

const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function offsetIn(el, root) {
  let x = 0, y = 0, n = el
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function useMedia(q) {
  const [m, set] = useState(() => typeof window !== 'undefined' && matchMedia(q).matches)
  useEffect(() => { const mm = matchMedia(q); const f = () => set(mm.matches); mm.addEventListener('change', f); return () => mm.removeEventListener('change', f) }, [q])
  return m
}

export function Story() {
  const wrap = useRef(), stage = useRef(), layer = useRef(), phoneBox = useRef(), lanes = useRef(), recipeScroll = useRef()
  const slots = useRef([]), toks = useRef([])
  const geo = useRef(null)
  const mobile = useMedia('(max-width: 900px)')
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const [phase, setPhase] = useState(0)
  const [imp, setImp] = useState(0)
  const [liked, setLiked] = useState(false)
  const [found, setFound] = useState([0, 0])
  const [origin, setOrigin] = useState('50% 50%')
  const [tick, setTick] = useState(0)

  const ingItems = HEARD.filter((h) => h.to === 'ing')
  const stepItems = HEARD.filter((h) => h.to === 'step')

  /* measure geometry (offset-based, so transforms never skew it) */
  useLayoutEffect(() => {
    const m = () => {
      const root = stage.current
      if (!root) return
      const ph = offsetIn(phoneBox.current, root), ln = offsetIn(lanes.current, root)
      geo.current = { ph, ln, slots: slots.current.map((s) => s && offsetIn(s, root)) }
      setOrigin(`${ph.x + ph.w / 2}px ${ph.y + ph.h / 2}px`)
      paint(p.get())
    }
    m()
    const ro = new ResizeObserver(m)
    ro.observe(stage.current)
    window.addEventListener('resize', m)
    return () => { ro.disconnect(); window.removeEventListener('resize', m) }
  }, [mobile])

  /* imperative token choreography: raw bubble pops out of the reel, then crosses the phone and lands clean */
  function paint(v) {
    const g = geo.current
    if (!g) return
    const { ph, ln } = g
    const P0 = { x: ph.x + ph.w * 0.5, y: ph.y + ph.h * 0.28 }
    HEARD.forEach((h, i) => {
      const el = toks.current[i], slot = g.slots[i]
      if (!el || !slot) return
      const t0 = T.tok0 + i * T.tokGap
      const e = cl((v - t0) / T.tokLen)
      const lane = i % 3
      const P1 = mobile
        ? { x: lane === 1 ? ln.x + ln.w - el.offsetWidth * 0.98 : ln.x, y: ln.y + lane * (ln.h / 3) }
        : { x: ln.x, y: ln.y + lane * (ln.h / 3) }
      const P2 = { x: slot.x, y: slot.y }
      let x, y, s = 1, o = 1, raw = 1, clean = 0
      if (e <= 0) { o = 0; x = P0.x; y = P0.y; s = 0.3 }
      else if (e < 0.28) { const u = easeOut(e / 0.28); x = P0.x + (P1.x - P0.x) * u; y = P0.y + (P1.y - P0.y) * u; s = 0.35 + 0.65 * u; o = cl(u * 2) }
      else if (e < 0.5) { x = P1.x; y = P1.y + Math.sin(e * 30) * 1.5 }
      else {
        const u = inOut((e - 0.5) / 0.5)
        const C = { x: ph.x + ph.w * 0.5, y: Math.min(P1.y, P2.y) - (mobile ? 30 : 90) }
        const a = 1 - u
        x = a * a * P1.x + 2 * a * u * C.x + u * u * P2.x
        y = a * a * P1.y + 2 * a * u * C.y + u * u * P2.y
        raw = 1 - cl((u - 0.3) / 0.3); clean = cl((u - 0.4) / 0.3)
        s = 1 - Math.sin(u * Math.PI) * 0.08
      }
      el.style.opacity = o
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`
      el.children[0].style.opacity = raw
      el.children[1].style.opacity = clean
    })
    if (recipeScroll.current) {
      const sc = recipeScroll.current
      const u = cl((v - T.scroll[0]) / (T.scroll[1] - T.scroll[0]))
      sc.scrollTop = inOut(u) * Math.max(0, sc.scrollHeight - sc.clientHeight - 40)
    }
  }

  useMotionValueEvent(p, 'change', (v) => {
    paint(v)
    setPhase(phaseOf(v))
    setLiked(v > 0.06)
    setTick(Math.max(0, Math.min(HEARD.length - 1, Math.floor((v - T.tok0 + 0.01) / (T.tokGap * 1.15)))))
    setImp(v < 0.4 ? 0 : v < 0.5 ? 1 : v < 0.6 ? 2 : v < 0.71 ? 3 : 4)
    const arrived = (arr) => arr.filter((h) => v > T.tok0 + HEARD.indexOf(h) * T.tokGap + T.tokLen * 0.85).length
    const f = [arrived(ingItems), arrived(stepItems)]
    setFound((o) => (o[0] === f[0] && o[1] === f[1] ? o : f))
  })

  /* declarative motion values */
  const sheetY = useTransform(p, [T.shareIn[0], T.shareIn[1], T.sheetOut[0], T.sheetOut[1]], ['105%', '0%', '0%', '105%'])
  const dim = useTransform(p, [T.shareIn[0], T.shareIn[1], T.sheetOut[0], T.sheetOut[1]], [0, 0.45, 0.45, 0])
  const reelO = useTransform(p, T.impIn, [1, 0])
  const impO = useTransform(p, [T.impIn[0], T.impIn[1], T.recipeIn[1], T.recipeIn[1] + 0.01], [0, 1, 1, 0])
  const recO = useTransform(p, [T.recipeIn[0] - 0.002, T.recipeIn[0]], [0, 1])
  const recY = useTransform(p, T.recipeIn, ['100%', '0%'])
  const layerS = useTransform(p, T.collapse, [1, 0.12])
  const layerO = useTransform(p, [T.collapse[0], T.collapse[1] - 0.02], [1, 0])
  const cardsO = useTransform(p, [0.37, 0.41], [0, 1])
  const lanesO = useTransform(p, [0.37, 0.41, 0.72, 0.76], [0, 1, 1, 0])
  const doneO = useTransform(p, [0.84, 0.88], [0, 1])
  const doneY = useTransform(p, [0.84, 0.88], [30, 0])
  const rotY = useSpring(useTransform(p, [0, 0.15, 0.76, 0.84, 1], [-16, 0, 0, -8, 0]), { stiffness: 120, damping: 24 })
  const phoneS = useTransform(p, [0.76, 0.81, 0.86], [1, 1.05, 1])
  const glow = useTransform(p, [0, 0.3, 0.4, 0.75, 0.85], ['rgba(255,80,120,.35)', 'rgba(255,80,120,.35)', 'rgba(90,150,255,.45)', 'rgba(90,150,255,.45)', 'rgba(255,170,60,.45)'])
  // finger: to share button, tap, then to Nasi in the sheet, tap
  const fx = useTransform(p, [0.08, 0.13, 0.24, 0.28], [250, 356, 356, 195])
  const fy = useTransform(p, [0.08, 0.13, 0.24, 0.28], [760, 610, 610, 546])
  const fo = useTransform(p, [0.07, 0.09, 0.3, 0.32], [0, 1, 1, 0])
  const fs = useTransform(p, [0.13, 0.145, 0.16, 0.28, 0.295, 0.31], [1, 0.75, 1, 1, 0.75, 1])
  const ring1 = useTransform(p, [0.14, 0.17], [0, 1])
  const ring2 = useTransform(p, [0.29, 0.32], [0, 1])
  const ring1S = useTransform(ring1, [0, 1], [0.5, 2.2]), ring1O = useTransform(ring1, [0, 0.2, 1], [0, 0.8, 0])
  const ring2S = useTransform(ring2, [0, 1], [0.5, 2.2]), ring2O = useTransform(ring2, [0, 0.2, 1], [0, 0.8, 0])

  const seg = (i) => useTransform(p, [PH_EDGES[i], PH_EDGES[i + 1]], ['0%', '100%'])
  const segs = [seg(0), seg(1), seg(2), seg(3)]

  return (
    <section className="story" id="how" ref={wrap} data-mood="navy">
      <div className="story-stage" ref={stage}>
        <div className="story-copy">
          <p className="eyebrow"><Icon n="sparkle" size={14} />How Nasi works</p>
          <div className="story-rail">
            {PHASES.map((ph, i) => (
              <span key={ph.k} className={i === phase ? 'on' : i < phase ? 'past' : ''}>
                <i><motion.b style={{ width: segs[i] }} /></i><small>{i + 1}. {ph.k}</small>
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={phase} className="story-text" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <h3>{PHASES[phase].h}</h3>
              <p>{PHASES[phase].p}</p>
            </motion.div>
          </AnimatePresence>
          {phase === 2 && (
            <div className="ticker" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.div key={tick} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <span className={`raw k-${HEARD[tick].kind}`}><b><Icon n={KIND[HEARD[tick].kind][0]} size={11} sw={2.4} />{KIND[HEARD[tick].kind][1]}</b>{HEARD[tick].raw}</span>
                  <Icon n="chevd" size={16} />
                  <span className="clean">{HEARD[tick].e || '📝'} {HEARD[tick].clean}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>

        <motion.div className="lanes" ref={lanes} style={{ opacity: lanesO }}>
          <span className="lane-lbl"><Icon n="note" size={13} />Straight from the reel</span>
        </motion.div>

        <motion.div className="story-phone" ref={phoneBox} style={{ rotateY: rotY, scale: phoneS }}>
          <Phone glow={undefined} className="sp">
            <motion.div className="layer" style={{ opacity: reelO }}>
              <ReelScreen liked={liked} paused={phase > 1}>
                <motion.div className="dim" style={{ opacity: dim }} />
                <ShareSheet glowNasi={phase === 1} style={{ y: sheetY }} />
                <motion.div className="finger" style={{ x: fx, y: fy, opacity: fo, scale: fs }}>
                  <motion.i style={{ scale: ring1S, opacity: ring1O }} /><motion.i style={{ scale: ring2S, opacity: ring2O }} />
                </motion.div>
              </ReelScreen>
            </motion.div>
            <motion.div className="layer" style={{ opacity: impO }}><ImportScreen stage={imp} /></motion.div>
            <motion.div className="layer" style={{ opacity: recO, y: recY }}><RecipeScreen scrollRef={recipeScroll} /></motion.div>
          </Phone>
          <motion.div className="phone-halo" style={{ background: glow }} />
        </motion.div>

        <motion.div className="story-layer" ref={layer} style={{ scale: layerS, opacity: layerO, transformOrigin: origin }}>
          <motion.div className="xcards" style={{ opacity: cardsO }}>
            <div className="xcard">
              <header><span className="xh"><i>🧺</i>Ingredients</span><em>{found[0]} found</em></header>
              <ul>{ingItems.map((h) => <li key={h.clean} ref={(el) => (slots.current[HEARD.indexOf(h)] = el)} />)}</ul>
              <motion.small className="more" animate={{ opacity: found[0] === ingItems.length ? 1 : 0 }}>+ 4 more from the video</motion.small>
            </div>
            <div className="xcard">
              <header><span className="xh"><i>📝</i>Steps</span><em>{found[1]} written</em></header>
              <ul>{stepItems.map((h) => <li key={h.clean} ref={(el) => (slots.current[HEARD.indexOf(h)] = el)} />)}</ul>
              <motion.small className="more" animate={{ opacity: found[1] === stepItems.length ? 1 : 0 }}>+ cook time, servings and source</motion.small>
            </div>
          </motion.div>
          {HEARD.map((h, i) => {
            const [ic, lbl] = KIND[h.kind]
            const n = h.to === 'step' ? stepItems.indexOf(h) + 1 : null
            return (
              <div key={i} className={`tok ${h.to}`} ref={(el) => (toks.current[i] = el)}>
                <span className={`raw k-${h.kind}`}><b><Icon n={ic} size={12} sw={2.4} />{lbl}</b>{h.raw}</span>
                <span className="clean">{n ? <i className="num">{n}</i> : <i className="em">{h.e}</i>}{h.clean}</span>
              </div>
            )
          })}
        </motion.div>

        <motion.div className="story-done" style={{ opacity: doneO, y: doneY }}>
          <div className="dn-top"><AppIcon size={44} /><div><b>Saved to Weeknight wins</b><small>Imported from TikTok · @{NOODLES.creator}</small></div><span className="ok"><Icon n="check" size={18} sw={3} /></span></div>
          <div className="dn-chips"><span>🧺 9 ingredients</span><span>📝 5 steps</span><span>⏱ 20 min</span><span>🔗 Source linked</span></div>
        </motion.div>
      </div>
    </section>
  )
}
