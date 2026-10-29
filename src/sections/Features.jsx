import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup, useInView, useScroll, useMotionValueEvent } from 'framer-motion'
import { Phone, Icon, AppIcon, Title, Eyebrow, Reveal, SourceMark, useNow, StatusBar } from '../ui'
import { RecipeScreen, CookScreen, HomeScreen } from '../screens'
import { img, byId, RECIPES, BOOKS, NOODLES, GROCERY, AISLES, AISLE_E, PLAN0, SLOTS, fmtQ } from '../data'

/* ================= Save from anywhere (mirrors the app's + menu) ================= */
const METHODS = [
  { k: 'link', lbl: 'Import link', ic: 'link', out: 'lemak', src: 'Instagram', h: 'Paste a reel link', p: 'TikTok, Instagram Reels or Facebook videos. Paste the link and Nasi does the reading.' },
  { k: 'scan', lbl: 'Scan photo', ic: 'scan', out: 'shak', src: 'Photo scan', h: 'Scan Grandma’s handwriting', p: 'Point your camera at a cookbook page or a recipe card. Nasi types it up.' },
  { k: 'pdf', lbl: 'Upload PDF', ic: 'file', out: 'cookies', src: 'PDF', h: 'Upload a recipe PDF', p: 'Pick a PDF with one recipe in it, like a meal-kit card. Nasi turns it into a recipe.' },
  { k: 'paste', lbl: 'Paste text', ic: 'clip', out: 'tofu', src: 'Pasted text', h: 'Paste messy text', p: 'A friend’s message or your old notes. Nasi sorts it into ingredients and steps.' },
  { k: 'write', lbl: 'Write', ic: 'pen', out: 'paneer', src: 'Written', h: 'Write your own', p: 'Family specials and your own tweaks, kept forever.' }
]

/* ---------- in-app demo for each import method (390×844 screen) ---------- */
const MENU = [['paste', 'Paste text', 'clip'], ['pdf', 'Upload PDF', 'file'], ['scan', 'Scan photo', 'scan'], ['link', 'Import link', 'link'], ['write', 'Write', 'pen']]
const ingFor = (id) => (GROCERY[id] || []).map(([n, q, u, a]) => [AISLE_E[a], `${fmtQ(q)}${u ? ' ' + u : ''}`, n.toLowerCase()])

function MethodInput({ k }) {
  if (k === 'link') return (
    <div className="scr navy mi">
      <StatusBar />
      <div className="mi-top"><b>Import link</b><span className="cbtn sm2"><Icon n="x" size={20} /></span></div>
      <div className="mi-field"><Icon n="link" size={22} /><span className="typed">instagram.com/reel/C9xL2pTqNa</span></div>
      <p className="mi-hint">Works with TikTok, Instagram Reels and Facebook videos.</p>
      <div className="mi-reel"><img src={img('lemak')} alt="" /><span className="fr-play"><Icon n="play" size={26} fill="currentColor" sw={0} /></span><small>@makcik.kitchen · Nasi lemak, the real way</small></div>
      <span className="mi-btn tapped">Import recipe</span>
    </div>
  )
  if (k === 'scan') return (
    <div className="scr mi cam">
      <StatusBar dark />
      <div className="mi-top"><b>Scan photo</b><span className="cbtn sm2"><Icon n="x" size={20} /></span></div>
      <div className="vf">
        <div className="card-hand big">
          <h5>Grandma’s Shakshuka</h5>
          <p>4 eggs · 1 tin tomatoes</p><p>1 red onion, 3 garlic</p><p>cumin, paprika, feta!</p><p>simmer sauce 10 min, crack eggs, lid on ~6 min</p>
        </div>
        <span className="corner a" /><span className="corner b" /><span className="corner c" /><span className="corner d" /><span className="scanbeam" />
      </div>
      <span className="shutter tapped" />
    </div>
  )
  if (k === 'pdf') return (
    <div className="scr navy mi">
      <StatusBar />
      <div className="mi-top"><b>Choose a PDF</b><span className="cbtn sm2"><Icon n="x" size={20} /></span></div>
      <p className="mi-hint">One recipe per PDF.</p>
      <ul className="files">
        {[['meal-kit-week-12.pdf', 'Yesterday'], ['brown-butter-cookies.pdf', 'Today · 1 page'], ['lasagna-card.pdf', 'Oct 18'], ['banana-bread.pdf', 'Oct 2']].map(([f, d]) => (
          <li key={f} className={f.startsWith('brown') ? 'pick tapped' : ''}><span className="pdfi">PDF</span><div><b>{f}</b><small>{d}</small></div></li>
        ))}
      </ul>
    </div>
  )
  if (k === 'paste') return (
    <div className="scr navy mi">
      <StatusBar />
      <div className="mi-top"><b>Paste text</b><span className="cbtn sm2"><Icon n="x" size={20} /></span></div>
      <div className="mi-text">gochujang tofu bowl!! 🔥 press tofu 20min then cube it. sauce = 2 tbsp gochujang + honey + splash soy. air fry 15 min @200. rice + cucumber + sesame on top<i className="caret" /></div>
      <span className="mi-btn tapped">Import recipe</span>
    </div>
  )
  return (
    <div className="scr navy mi">
      <StatusBar />
      <div className="mi-top"><b>New recipe</b><span className="cbtn sm2"><Icon n="x" size={20} /></span></div>
      <label className="mi-f">Title<span className="typed">Paneer Tikka Skewers</span></label>
      <label className="mi-f">Ingredients<span>400 g paneer<br />150 g yoghurt<br />2 bell peppers<br />1 red onion</span></label>
      <label className="mi-f">Steps<span>1. Marinate 30 min<br />2. Thread onto skewers<br />3. Grill until charred</span></label>
      <span className="mi-btn tapped">Save recipe</span>
    </div>
  )
}

function MethodResult({ m }) {
  const r = byId[m.out]
  return (
    <div className="scr brown">
      <div className="rs-hero sm"><img src={img(m.out)} alt="" /><div className="rs-fade" /></div>
      <div className="rs-body">
        <h3>{r.t}</h3>
        <div className="rs-meta"><span><Icon n="clock" size={20} fill="currentColor" sw={0} />{r.min} min</span><i /><span><Icon n="gauge" size={20} />{r.lvl}</span><i /><span><Icon n="users" size={20} />{r.serv}</span></div>
        <section className="rs-card ing">
          <header><h4>Ingredients</h4><span className="srcchip"><SourceMark src={m.src} size={14} />{m.src}</span></header>
          <ul>{ingFor(m.out).map(([e, q, n]) => <li key={n}><span className="em">{e}</span><span><b>{q}</b> {n}</span></li>)}</ul>
        </section>
      </div>
      <div className="rs-tops"><span className="gbtn"><Icon n="back" size={24} /></span><span className="gbtn"><Icon n="heart" size={24} /></span></div>
      <span className="cookbtn"><Icon n="flame" size={24} fill="currentColor" sw={0} />Cook</span>
    </div>
  )
}

function MethodPhone({ m, active }) {
  const [st, setSt] = useState(0)
  useEffect(() => {
    setSt(0)
    if (!active) return
    const t = [setTimeout(() => setSt(1), 1100), setTimeout(() => setSt(2), 3300), setTimeout(() => setSt(3), 4700)]
    return () => t.forEach(clearTimeout)
  }, [m.k, active])
  const fade = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  return (
    <Phone className="rp">
      <HomeScreen ids={['noodles', 'salmon', 'marry', 'mango']} plusOpen={st === 0} />
      <AnimatePresence>
        {st === 0 && (
          <motion.div key="menu" className="fabdim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="fabstack">
              {MENU.map(([k, l, ic], j) => (
                <motion.span key={k} className={`fs-row ${k === m.k ? 'hit' : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (MENU.length - j) }}>
                  <i>{l}</i><b><Icon n={ic} size={26} /></b>
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        {st === 1 && <motion.div key="in" className="layer" {...fade}><MethodInput k={m.k} /></motion.div>}
        {st === 2 && (
          <motion.div key="read" className="layer" {...fade}>
            <div className="scr navy mread">
              <AppIcon size={96} />
              <b>Reading your recipe…</b>
              <small>{m.k === 'scan' ? 'Reading the handwriting' : m.k === 'pdf' ? 'Reading the PDF' : m.k === 'write' ? 'Tidying it up' : 'Finding ingredients and steps'}</small>
              <div className="imp-prog"><motion.i initial={{ width: '5%' }} animate={{ width: '100%' }} transition={{ duration: 1.3, ease: 'easeInOut' }} /></div>
            </div>
          </motion.div>
        )}
        {st === 3 && <motion.div key="out" className="layer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 24 }}><MethodResult m={m} /></motion.div>}
      </AnimatePresence>
    </Phone>
  )
}

export function Sources() {
  const wrap = useRef()
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const [i, setI] = useState(0)
  const [active, setActive] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => { setActive(v > 0 && v < 1); setI(Math.min(METHODS.length - 1, Math.max(0, Math.floor(v * METHODS.length * 0.999)))) })
  const jump = (j) => {
    const el = wrap.current
    const top = el.getBoundingClientRect().top + window.scrollY + ((el.offsetHeight - window.innerHeight) * (j + 0.5)) / METHODS.length
    window.scrollTo({ top, behavior: 'smooth' })
  }
  const m = METHODS[i]
  return (
    <section className="pinned src-pin" id="sources" data-mood="navy" ref={wrap}>
      <div className="rd-stick">
        <div className="wrap rd-in">
          <div className="rd-left">
            <div className="sh rd-sh">
              <Eyebrow icon="plus">Not just reels</Eyebrow>
              <Title>Every recipe you love, *in one place.*</Title>
            </div>
            <div className="rd-feats">
              {METHODS.map((x, j) => (
                <button key={x.k} className={i === j ? 'on' : j < i ? 'seen' : ''} onClick={() => jump(j)}>
                  <span className="fi"><Icon n={x.ic} size={20} /></span>
                  <span><b>{x.h}</b><small>{x.p}</small></span>
                </button>
              ))}
            </div>
            <div className="rd-cap">
              <div className="rd-dots">{METHODS.map((x, j) => <i key={x.k} className={j <= i ? 'on' : ''} />)}<small>{i + 1} / {METHODS.length}</small></div>
              <AnimatePresence mode="wait">
                <motion.div key={m.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <b>{m.h}</b><p>{m.p}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="rd-phone"><MethodPhone m={m} active={active} /></div>
        </div>
      </div>
    </section>
  )
}

/* ================= Interactive recipe ================= */
const FEATS = [
  { k: 'serv', ic: 'users', h: 'Scale any recipe', p: 'Cooking for four instead of two? Tap plus and every amount updates.' },
  { k: 'steps', ic: 'list', h: 'Ingredients called out in every step', p: 'No scrolling back up to check how much garlic. It is highlighted right in the step.' },
  { k: 'add', ic: 'basket', h: 'Shopping list in one tap', p: 'Send every ingredient to your Tote and shop from one list.' },
  { k: 'time', ic: 'clock', h: 'Know when dinner is ready', p: 'Prep and cook time at a glance, with the time it will be on the table.' },
  { k: 'src', ic: 'arrowout', h: 'Always credit the creator', p: 'Every recipe keeps a link back to the original reel or page.' }
]
export function RecipeDemo() {
  const [serv, setServ] = useState(2)
  const [checked, setChecked] = useState([])
  const [added, setAdded] = useState(false)
  const [idx, setIdx] = useState(0)
  const scroller = useRef(), wrap = useRef()
  const now = useNow()
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIdx(Math.min(FEATS.length - 1, Math.max(0, Math.floor(v * FEATS.length * 0.999)))))

  const focus = FEATS[idx].k
  useEffect(() => {
    const k = focus
    if (k === 'serv') setServ(4)
    if (k === 'add') setAdded(true)
    const sc = scroller.current
    const el = sc && sc.querySelector(`[data-k="${k}"]`)
    if (!el) return
    let top = 0, n = el
    while (n && n !== sc) { top += n.offsetTop; n = n.offsetParent }
    sc.scrollTo({ top: Math.max(0, top - 240), behavior: 'smooth' })
  }, [focus])

  const jump = (j) => {
    const el = wrap.current
    const top = el.getBoundingClientRect().top + window.scrollY + ((el.offsetHeight - window.innerHeight) * (j + 0.5)) / FEATS.length
    window.scrollTo({ top, behavior: 'smooth' })
  }
  const f = FEATS[idx]
  return (
    <section className="recipe pinned" id="recipe" data-mood="espresso" ref={wrap}>
      <div className="rd-stick">
        <div className="wrap rd-in">
          <div className="rd-left">
            <div className="sh rd-sh">
              <Eyebrow icon="sparkle">Inside every recipe</Eyebrow>
              <Title>Not a messy caption. *A recipe you can cook.*</Title>
            </div>
            <div className="rd-feats">
              {FEATS.map((x, j) => (
                <button key={x.k} className={idx === j ? 'on' : j < idx ? 'seen' : ''} onClick={() => jump(j)}>
                  <span className="fi"><Icon n={x.ic} size={20} /></span>
                  <span><b>{x.h}</b><small>{x.p}</small></span>
                </button>
              ))}
            </div>
            <div className="rd-cap">
              <div className="rd-dots">{FEATS.map((x, j) => <i key={x.k} className={j <= idx ? 'on' : ''} />)}<small>{idx + 1} / {FEATS.length}</small></div>
              <AnimatePresence mode="wait">
                <motion.div key={f.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <b>{f.h}</b><p>{f.p}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="rd-phone">
            <Phone className="rp">
              <RecipeScreen interactive serv={serv} onServ={setServ} checked={checked} now={now}
                onCheck={(i) => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                added={added} onAdd={() => setAdded((a) => !a)} focus={focus} scrollRef={scroller} />
            </Phone>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================= Plan + Tote ================= */
function weekOf(d) {
  const s = new Date(d); s.setHours(12, 0, 0, 0); s.setDate(s.getDate() - s.getDay())
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(s); x.setDate(s.getDate() + i); return x })
}
const md = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
export function PlanTote() {
  const today = useMemo(() => new Date(), [])
  const days = useMemo(() => weekOf(today), [today])
  const [plan, setPlan] = useState(PLAN0)
  const [sel, setSel] = useState(today.getDay())
  const [hot, setHot] = useState(null)
  const count = Object.values(plan).reduce((a, m) => a + m.length, 0)

  const addTo = (d, id) => setPlan((p) => {
    const cur = p[d] || []
    if (cur.some(([, x]) => x === id)) return p
    const used = cur.map(([s]) => s)
    const slot = ['Dinner', 'Lunch', 'Breakfast', 'Late snack'].find((s) => !used.includes(s)) || 'Dinner'
    return { ...p, [d]: [...cur, [slot, id]].sort((a, b) => SLOTS.indexOf(a[0]) - SLOTS.indexOf(b[0])) }
  })
  const remove = (d, id) => setPlan((p) => ({ ...p, [d]: (p[d] || []).filter(([, x]) => x !== id) }))
  const dayAt = (e) => {
    const pt = e.changedTouches ? e.changedTouches[0] : e
    const el = document.elementsFromPoint(pt.clientX, pt.clientY).find((n) => n.dataset && n.dataset.day)
    return el ? +el.dataset.day : null
  }


  return (
    <section className="band plan" id="plan" data-mood="navy">
      <div className="wrap">
        <div className="sh">
          <Eyebrow icon="cal">Meal plan</Eyebrow>
          <Title>Plan your *whole week.*</Title>
          <Reveal as="p" className="sub">Drag a recipe onto any day, or tap one to add it to the day you picked.</Reveal>
        </div>
        <div className="pt-grid">
          <Reveal className="app-panel planp">
            <div className="ap-head"><span className="cbtn sm"><Icon n="cal" size={18} /></span><span className="pillbtn sm">Plan</span><AppIcon size={34} /></div>
            <h4>This Week</h4>
            <p className="muted">{md(days[0])} – {md(days[6])} · <AnimatePresence mode="popLayout"><motion.span key={count} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{count} meals</motion.span></AnimatePresence></p>
            <div className="week">
              {days.map((d, i) => (
                <button key={i} data-day={i} className={`day ${sel === i ? 'sel' : ''} ${i === today.getDay() ? 'today' : ''} ${hot === i ? 'hot' : ''}`} onClick={() => setSel(i)} aria-label={d.toDateString()}>
                  <small data-day={i}>{'SMTWTFS'[i]}</small>
                  <b data-day={i}>{d.getDate()}</b>
                  <span className="pips" data-day={i}>{(plan[i] || []).map((_, j) => <i key={j} />)}</span>
                </button>
              ))}
            </div>
            <div className="dayhd"><h5>{sel === today.getDay() ? 'Today' : days[sel].toLocaleDateString('en-US', { weekday: 'long' })}</h5><span>{(plan[sel] || []).length} planned</span></div>
            <div className="meals">
              <AnimatePresence mode="popLayout" initial={false}>
                {(plan[sel] || []).map(([slot, id]) => (
                  <motion.div layout key={id} className="meal" initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.95 }}>
                    <img src={img(id)} alt="" /><div><small>{slot}</small><b>{byId[id].t}</b><span>{byId[id].min} min · {byId[id].serv} servings</span></div>
                    <button aria-label={`Remove ${byId[id].t}`} onClick={() => remove(sel, id)}><Icon n="x" size={16} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!(plan[sel] || []).length && <div className="addmeal"><Icon n="plus" size={22} /><b>Add a meal</b><small>Drag a recipe here, or tap one below.</small></div>}
            </div>
            <div className="tray">
              <small className="tray-l"><Icon n="drag" size={14} />Drag onto a day, or tap to add to {sel === today.getDay() ? 'today' : days[sel].toLocaleDateString('en-US', { weekday: 'short' })}</small>
              <div className="chips">
                {RECIPES.map((r) => (
                  <motion.button key={r.id} className="rchip" drag dragSnapToOrigin dragElastic={0.6} whileDrag={{ scale: 1.08, zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,.5)' }}
                    onDrag={(e) => setHot(dayAt(e))}
                    onDragEnd={(e) => { const d = dayAt(e); setHot(null); if (d != null) { addTo(d, r.id); setSel(d) } }}
                    onTap={() => addTo(sel, r.id)}>
                    <img src={img(r.id)} alt="" draggable="false" /><span>{r.t}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ================= Hands-free cook mode ================= */
export function CookMode() {
  const [step, setStep] = useState(0)
  const [left, setLeft] = useState(NOODLES.steps[0].tm)
  const [running, setRunning] = useState(false)
  const [listening, setListening] = useState(false)
  const [auto, setAuto] = useState(true)
  const ref = useRef()
  const inView = useInView(ref, { margin: '-25% 0px' })
  const total = NOODLES.steps[step].tm

  useEffect(() => { setLeft(NOODLES.steps[step].tm); setRunning(!!NOODLES.steps[step].tm && auto) }, [step])
  useEffect(() => {
    if (!running || !inView) return
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), auto ? 60 : 1000)
    return () => clearInterval(t)
  }, [running, inView, auto])
  useEffect(() => {
    if (!auto || !inView) return
    let a, b
    const t = setInterval(() => {
      setListening(true)
      a = setTimeout(() => { setStep((s) => (s + 1) % NOODLES.steps.length) }, 1400)
      b = setTimeout(() => setListening(false), 2200)
    }, 5200)
    return () => { clearInterval(t); clearTimeout(a); clearTimeout(b) }
  }, [auto, inView])
  const say = (dir) => {
    setAuto(false); setListening(true)
    setTimeout(() => { setStep((s) => Math.min(NOODLES.steps.length - 1, Math.max(0, s + dir))); setListening(false) }, 900)
  }
  return (
    <section className="band cook" id="cook" data-mood="espresso" ref={ref}>
      <div className="wrap cook-grid">
        <div>
          <Eyebrow icon="flame">Cook mode</Eyebrow>
          <Title>Floury hands? *Just say “next”.*</Title>
          <Reveal as="p" className="sub">One big step at a time, timers that start themselves and a screen that stays awake. Move on by voice, no touching.</Reveal>
          <Reveal className="ck-try">
            <button onClick={() => say(-1)}><Icon n="back" size={16} />Back</button>
            <button className="pri" onClick={() => say(1)}><Icon n="mic" size={16} />Say “next”</button>
            <button disabled={!total} onClick={() => { setAuto(false); setRunning((r) => !r) }}><Icon n={running ? 'pause' : 'play'} size={16} fill="currentColor" sw={0} />{running ? 'Pause' : 'Timer'}</button>
          </Reveal>
        </div>
        <Reveal className="ck-phone" delay={0.1}>
          <Phone className="cp"><CookScreen step={step} left={left} total={total} listening={listening} running={running} /></Phone>
          <motion.span className="speech" animate={{ opacity: listening ? 1 : 0, y: listening ? 0 : 10, scale: listening ? 1 : 0.9 }}>“Next”</motion.span>
        </Reveal>
      </div>
    </section>
  )
}
