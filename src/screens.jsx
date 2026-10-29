import { motion, AnimatePresence } from 'framer-motion'
import { forwardRef } from 'react'
import { Icon, AppIcon, StatusBar, SourceMark, Marked, clock } from './ui'
import { img, byId, NOODLES, fmtQ } from './data'

/* All screens are laid out at 390×844 (iPhone 14/15 logical points). */

export function TabBar({ active = 'Recipes', plusOpen }) {
  const tabs = [['Recipes', 'grid'], ['List', 'list'], ['Plan', 'cal'], ['Favorites', 'heart']]
  return (
    <div className="tabbar">
      <div className="tabs">
        {tabs.map(([t, ic]) => (
          <span key={t} className={`tab ${active === t ? 'on' : ''}`}>
            <Icon n={ic} size={26} sw={2.2} fill={ic === 'heart' || ic === 'grid' ? 'currentColor' : undefined} />
            <i>{t}</i>
          </span>
        ))}
      </div>
      <span className="fab"><Icon n={plusOpen ? 'x' : 'plus'} size={30} sw={2.4} /></span>
    </div>
  )
}

function TopRow({ title = 'Recipes', avatar = true }) {
  return (
    <div className="toprow">
      <span className="cbtn"><Icon n="sort" size={24} /></span>
      <span className="pillbtn">{title} <Icon n="chevd" size={18} sw={2.6} /></span>
      <span className="cbtn"><Icon n="sliders" size={24} /></span>
      {avatar && <span className="cbtn av"><AppIcon size={46} /></span>}
    </div>
  )
}

export function RecipeCard({ id, fresh, liked }) {
  const r = byId[id]
  return (
    <motion.div layout className={`rcard ${fresh ? 'fresh' : ''}`} initial={fresh ? { scale: 0.6, opacity: 0, y: -30 } : false}
      animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
      <div className="rimg"><img src={img(id)} alt="" draggable="false" /><span className={`hrt ${liked ? 'on' : ''}`}><Icon n="heart" size={22} sw={2.2} fill={liked ? 'currentColor' : undefined} /></span>
        <span className="srcb"><SourceMark src={r.src} size={13} />{r.src}</span></div>
      <b>{r.t}</b>
      <small>{r.min} min • {r.serv} servings • {r.lvl}</small>
    </motion.div>
  )
}

export function HomeScreen({ ids, freshId, liked = [], plusOpen }) {
  return (
    <div className="scr navy">
      <StatusBar />
      <TopRow />
      <div className="searchpill"><Icon n="search" size={22} />Search cookbooks and recipes</div>
      <div className="sechd"><h4>All recipes</h4><span>Organize</span></div>
      <motion.div layout className="rgrid">
        <AnimatePresence initial={false}>
          {ids.map((id) => <RecipeCard key={id} id={id} fresh={id === freshId} liked={liked.includes(id)} />)}
        </AnimatePresence>
      </motion.div>
      <TabBar plusOpen={plusOpen} />
    </div>
  )
}

/* ---------- Short-video app (generic, the way it looks when you find a recipe) ---------- */
export function ReelScreen({ liked, children, paused }) {
  return (
    <div className="scr reel">
      <div className={`reel-video ${paused ? 'paused' : ''}`}>
        <img src={img('reel1')} alt="" className="kb a" />
        <img src={img('reel2')} alt="" className="kb b" />
        <div className="reel-shade" />
        <div className="ost"><span>6 garlic cloves 🧄</span></div>
      </div>
      <StatusBar dark />
      <div className="reel-top"><span>Following</span><b>For You</b><Icon n="search" size={24} /></div>
      <div className="reel-rail">
        <span className="ava"><img src={img('noodles')} alt="" /><i>+</i></span>
        <span className={`ri ${liked ? 'liked' : ''}`}><Icon n="heart" size={36} fill="currentColor" sw={0} /><small>128.4K</small></span>
        <span className="ri"><Icon n="bubble" size={34} fill="currentColor" sw={0} /><small>2,341</small></span>
        <span className="ri"><Icon n="bookmark" size={32} fill="currentColor" sw={0} /><small>41.2K</small></span>
        <span className="ri share"><svg width="36" height="36" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 4.5v4C6 9 3.5 13.6 3 19.5c2.2-3.3 5.3-4.7 10.5-4.7v4.2L21 11.8z" /></svg><small>Share</small></span>
        <span className="disc"><img src={img('noodles')} alt="" /></span>
      </div>
      <div className="reel-cap">
        <b>@{NOODLES.creator}</b>
        <p>Crispy chilli garlic noodles in 20 minutes 🔥 you NEED this sauce <span>#noodletok #easydinner #chillioil</span></p>
        <small><Icon n="note" size={15} /> original sound · {NOODLES.creator}</small>
      </div>
      <div className="reel-bar"><i /></div>
      <div className="reel-nav"><span>Home</span><span>Friends</span><span className="plusb">+</span><span>Inbox</span><span>Profile</span></div>
      {children}
    </div>
  )
}

export const ShareSheet = forwardRef(function ShareSheet({ glowNasi, style }, ref) {
  const apps = [['AirDrop', '#3B82F6', 'share'], ['Messages', '#34C759', 'bubble'], ['Nasi', null], ['Notes', '#F5C518', 'pen'], ['Mail', '#2F80ED', 'file']]
  return (
    <motion.div className="sheet" ref={ref} style={style}>
      <div className="grab" />
      <div className="sh-head">
        <img src={img('reel1')} alt="" />
        <div><b>Crispy chilli garlic noodles…</b><small>{NOODLES.link}</small></div>
        <span className="cx"><Icon n="x" size={16} sw={2.6} /></span>
      </div>
      <div className="sh-apps">
        {apps.map(([n, c, ic]) => (
          <span key={n} className={`sa ${n === 'Nasi' ? 'nasi' : ''} ${n === 'Nasi' && glowNasi ? 'glow' : ''}`}>
            {c ? <i style={{ background: c }}><Icon n={ic} size={30} sw={2.2} /></i> : <AppIcon size={66} />}
            <small>{n}</small>
          </span>
        ))}
      </div>
      <div className="sh-acts">
        {[['Copy link', 'link'], ['Save video', 'down'], ['Add to Favorites', 'heart']].map(([t, ic]) => <span key={t}>{t}<Icon n={ic === 'down' ? 'share' : ic} size={22} /></span>)}
      </div>
    </motion.div>
  )
})

/* ---------- Nasi reading the reel ---------- */
export function ImportScreen({ stage = 0 }) {
  const rows = [['Watching the video', 'play'], ['Listening to the creator', 'mic'], ['Reading the caption', 'bubble'], ['Writing your recipe', 'sparkle']]
  return (
    <div className="scr navy imp">
      <StatusBar />
      <div className="imp-top"><span className="cbtn"><Icon n="back" size={24} /></span><b>Import queue</b><span className="cbtn av"><AppIcon size={46} /></span></div>
      <div className="imp-card">
        <div className="imp-thumb">
          <img src={img('reel1')} alt="" />
          <div className="scanline" />
          <div className="frames">{['reel1', 'reel2', 'noodles'].map((f) => <img key={f} src={img(f)} alt="" />)}</div>
        </div>
        <div className="imp-meta">
          <span className="srcchip"><Icon n="note" size={14} />TikTok · @{NOODLES.creator}</span>
          <b>Crispy chilli garlic noodles in 20 minutes</b>
          <div className="imp-prog"><motion.i animate={{ width: `${Math.min(100, stage * 25)}%` }} transition={{ duration: 0.6 }} /></div>
        </div>
      </div>
      <ul className="imp-steps">
        {rows.map(([t, ic], i) => {
          const st = stage > i ? 'done' : stage === i ? 'work' : ''
          return (
            <li key={t} className={st}>
              <span className="st-ic">{st === 'done' ? <Icon n="check" size={20} sw={3} /> : <Icon n={ic} size={20} />}</span>
              <span>{t}</span>
              {st === 'work' && <span className="dots"><i /><i /><i /></span>}
            </li>
          )
        })}
      </ul>
      <p className="imp-hint">You can keep scrolling. Nasi finishes in the background.</p>
      <TabBar />
    </div>
  )
}

/* ---------- Recipe detail (espresso), mirrors the app screen ---------- */
export function RecipeScreen({ serv = 2, onServ, checked = [], onCheck, focus, onAdd, added, scrollRef, now = new Date(), interactive }) {
  const k = serv / NOODLES.serv
  const ready = new Date(now.getTime() + (NOODLES.prep + NOODLES.cook) * 60000)
  return (
    <div className={`scr brown ${focus ? 'f-' + focus : ''}`}>
      <div className="rs-scroll" ref={scrollRef} data-lenis-prevent>
        <div className="rs-hero"><img src={img('noodles')} alt="" /><div className="rs-fade" /></div>
        <div className="rs-body">
          <h3>{NOODLES.t}</h3>
          <p className="rs-desc">{NOODLES.note}</p>
          <div className="rs-meta"><span><Icon n="clock" size={20} fill="currentColor" sw={0} />{NOODLES.prep + NOODLES.cook} min</span><i /><span><Icon n="gauge" size={20} />Easy</span><i /><span><Icon n="users" size={20} />{serv}</span></div>
          <section className="rs-card ing" data-k="ing">
            <header><h4>Ingredients</h4><Icon n="swap" size={22} /></header>
            <div className="serv" data-k="serv"><b>{serv} servings</b>
              <span className="stepper">
                <button type="button" tabIndex={interactive ? 0 : -1} aria-label="Fewer servings" onClick={() => onServ && onServ(Math.max(1, serv - 1))}><Icon n="minus" size={22} sw={2.4} /></button>
                <button type="button" tabIndex={interactive ? 0 : -1} aria-label="More servings" onClick={() => onServ && onServ(Math.min(12, serv + 1))}><Icon n="plus" size={22} sw={2.4} /></button>
              </span>
            </div>
            <ul>
              {NOODLES.ing.map((g, i) => (
                <li key={i} className={checked.includes(i) ? 'ck' : ''} onClick={() => onCheck && onCheck(i)}>
                  <span className="em">{g.e}</span>
                  <span><AnimatePresence mode="popLayout" initial={false}><motion.b key={serv} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>{fmtQ(g.q * k)}{g.u ? ' ' + g.u : ''}</motion.b></AnimatePresence> {g.n}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={`addlist ${added ? 'done' : ''}`} tabIndex={interactive ? 0 : -1} onClick={onAdd} data-k="add">
              <Icon n={added ? 'check' : 'basket'} size={24} />{added ? 'Added to your Tote' : 'Add to shopping list'}
            </button>
          </section>
          <section className="rs-card steps" data-k="steps">
            <header><h4>Instructions</h4><Icon n="menu" size={22} /></header>
            <ol>{NOODLES.steps.map((s, i) => <li key={i}><span className="n">{i + 1}</span><p><Marked t={s.t} /></p></li>)}</ol>
          </section>
          <section className="rs-card time" data-k="time">
            <header><h4>Cooking Time</h4><Icon n="menu" size={22} /></header>
            <div className="ct"><b>{NOODLES.prep + NOODLES.cook} min</b><span>Ready at {clock(ready)}</span></div>
            <div className="ctbar"><i style={{ flex: NOODLES.prep }} /><i style={{ flex: NOODLES.cook }} /></div>
            <div className="ctleg"><span><i className="o" />{NOODLES.prep}m preparation</span><span><i className="g" />{NOODLES.cook}m cooking time</span></div>
          </section>
          <section className="rs-card src" data-k="src">
            <h4>Source</h4>
            <div className="srow"><span className="sico"><Icon n="note" size={24} /></span><div><b>TikTok</b><small>{NOODLES.link}</small></div><Icon n="arrowout" size={24} /></div>
          </section>
          <section className="rs-card books"><h4>Cookbooks</h4><span>Weeknight wins <Icon n="chevd" size={18} /></span></section>
          <p className="edit"><Icon n="pen" size={20} /> Edit recipe</p>
        </div>
      </div>
      <div className="rs-tops"><span className="gbtn"><Icon n="back" size={24} /></span><span className="gbtn"><Icon n="heart" size={24} /></span><span className="gbtn dots3">•••</span></div>
      <span className="cookbtn" data-k="cook"><Icon n="flame" size={24} fill="currentColor" sw={0} />Cook</span>
    </div>
  )
}

/* ---------- Cook mode ---------- */
export function CookScreen({ step, left, total, listening, running }) {
  const s = NOODLES.steps[step]
  const pct = total ? left / total : 0
  return (
    <div className="scr brown cook">
      <StatusBar />
      <div className="ck-top"><span className="gbtn"><Icon n="x" size={22} /></span><b>Step {step + 1} of {NOODLES.steps.length}</b><span className={`awake ${running ? 'on' : ''}`}><Icon n="sun" size={18} /> Awake</span></div>
      <div className="ck-dots">{NOODLES.steps.map((_, i) => <i key={i} className={i <= step ? 'on' : ''} />)}</div>
      <AnimatePresence mode="wait">
        <motion.p key={step} className="ck-text" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <Marked t={s.t} />
        </motion.p>
      </AnimatePresence>
      <div className="ck-timer">
        {total ? (
          <>
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" className="tr-bg" /><circle cx="60" cy="60" r="52" className="tr-fg" style={{ strokeDasharray: 326.7, strokeDashoffset: 326.7 * (1 - pct) }} /></svg>
            <div className="tr-t"><b>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</b><small>{running ? 'timer running' : 'tap to start'}</small></div>
          </>
        ) : <div className="tr-none"><Icon n="flame" size={34} fill="currentColor" sw={0} /><small>No timer on this step</small></div>}
      </div>
      <div className={`ck-voice ${listening ? 'on' : ''}`}>
        <span className="wv">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 0.07}s` }} />)}</span>
        <small>{listening ? 'Listening… say “next” or “repeat”' : 'Hands-free is on'}</small>
      </div>
      <div className="ck-ctrl"><span className="gbtn lg"><Icon n="back" size={28} /></span><span className="gbtn lg pri"><Icon n="mic" size={28} /></span><span className="gbtn lg"><Icon n="chev" size={28} /></span></div>
    </div>
  )
}
