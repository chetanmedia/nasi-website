import { Suspense, lazy, useRef, useState, useEffect, useLayoutEffect, Fragment } from 'react'
import { motion, useInView } from 'framer-motion'
import { APP_STORE_URL, ICON, SRC } from './data'
import { hasWebGL } from './three/common'

/* ---------- icons (24px grid, stroke) ---------- */
const P = {
  link: 'M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1',
  scan: 'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M8.5 9.5h1.2l.9-1.5h2.8l.9 1.5h1.2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM12 14a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
  clip: 'M9 4h6v3H9zM15 5.5h2a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h2',
  pen: 'M4 20h7M14.5 5.5l3 3L9 17H6v-3z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  x: 'M6 6l12 12M18 6L6 18',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z',
  search: 'M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.2-4.2',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  sort: 'M8 4v16M8 4l-4 4M8 4l4 4M16 20V4M16 20l-4-4M16 20l4-4',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01',
  chev: 'M9 6l6 6-6 6',
  chevd: 'M6 9l6 6 6-6',
  back: 'M15 6l-6 6 6 6',
  share: 'M12 15V3M7 8l5-5 5 5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',
  arrowout: 'M7 17L17 7M9 7h8v8',
  bubble: 'M4 5h16v11H9l-5 4z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  basket: 'M3 10h18l-2 10H5zM7 10l4-6M17 10l-4-6M8 14v3M12 14v3M16 14v3',
  play: 'M7 4.5v15l12-7.5z',
  pause: 'M8 5v14M16 5v14',
  mic: 'M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3',
  hand: 'M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1.5a6 6 0 0 1-4.6-2.2L4 16.3a1.6 1.6 0 0 1 2.4-2.1L8 15.6',
  flame: 'M12 22c4 0 7-2.8 7-6.8 0-3.6-2.6-6.4-4.4-8.6-.4 2.2-1.6 3.6-3 4.4C11.8 7.8 10.4 4.6 7.6 2.6 7.8 6.4 5 9 5 15.2 5 19.2 8 22 12 22z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  wave: 'M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 13.5a6.5 6.5 0 0 1 3.5 6',
  gauge: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 12l3.5-3.5M7 12h.01M12 7h.01M17 12h.01',
  menu: 'M4 8h16M4 16h16',
  down: 'M12 4v12M6 11l6 6 6-6M5 20h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  cloud: 'M7 18h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z',
  drag: 'M8 12h8M5 9l-3 3 3 3M19 9l3 3-3 3M12 4v4M12 16v4',
  swap: 'M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4',
  camera: 'M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  note: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  fb: 'M14 21v-8h3l.5-3.5H14V7.7c0-1 .3-1.7 1.8-1.7H18V3a24 24 0 0 0-2.7-.1C12.6 2.9 11 4.5 11 7.5v2H8V13h3v8'
}
export function Icon({ n, size = 18, sw = 2, fill, ...p }) {
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...p}>
      <path d={P[n]} fill={fill || 'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SourceMark({ src, size = 16 }) {
  const s = SRC[src] || SRC.Website
  return <Icon n={s.glyph} size={size} />
}

export function AppIcon({ size = 40, className = '', ...p }) {
  return <img className={`appicon ${className}`} src={ICON} width={size} height={size} alt="" draggable="false" {...p} />
}

export function AppStore({ small }) {
  return (
    <a className={`store ${small ? 'sm' : ''}`} href={APP_STORE_URL} aria-label="Download Nasi on the App Store">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3.01-.79-1.55.02-2.98.9-3.78 2.29-1.61 2.8-.41 6.94 1.16 9.21.77 1.11 1.68 2.36 2.88 2.31 1.16-.05 1.6-.75 3-.75s1.79.75 3.01.72c1.25-.02 2.04-1.13 2.8-2.25.88-1.29 1.24-2.54 1.26-2.6-.03-.01-2.42-.93-2.48-3.71zM14.08 5.85c.64-.77 1.07-1.85.95-2.92-.92.04-2.03.61-2.69 1.38-.59.68-1.11 1.78-.97 2.83 1.02.08 2.07-.52 2.71-1.29z" /></svg>
      <span><small>Download on the</small><b>App Store</b></span>
    </a>
  )
}

/* ---------- iPhone frame. Screens are authored at 390×844 and scaled to fit, so the UI stays sharp. ---------- */
export function Phone({ children, className = '', glow, style, screenRef }) {
  const ref = useRef()
  const [s, setS] = useState(0.75)
  useLayoutEffect(() => {
    const el = ref.current
    const fit = () => setS(el.clientWidth / 390)
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className={`phone ${className}`} style={style}>
      {glow && <div className="phone-glow" style={{ background: glow }} />}
      <div className="phone-body">
        <div className="phone-screen" ref={ref}>
          <div className="phone-ui" ref={screenRef} style={{ transform: `scale(${s})` }}>{children}</div>
        </div>
        <div className="island" />
      </div>
    </div>
  )
}

export function StatusBar({ time = '9:41', dark }) {
  return (
    <div className={`sbar ${dark ? 'dk' : ''}`}>
      <b>{time}</b>
      <span className="sb-r">
        <svg width="19" height="12" viewBox="0 0 19 12"><g fill="currentColor"><rect x="0" y="8" width="3.2" height="4" rx="1" /><rect x="5" y="5.5" width="3.2" height="6.5" rx="1" /><rect x="10" y="3" width="3.2" height="9" rx="1" /><rect x="15" y="0" width="3.2" height="12" rx="1" /></g></svg>
        <svg width="17" height="12" viewBox="0 0 17 12"><path fill="currentColor" d="M8.5 2.6c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8.5.9 10.4 10.4 0 0 0 1.1 3.9l1.2 1.2a8.7 8.7 0 0 1 6.2-2.5zm0 3.4c1.5 0 2.8.6 3.8 1.5l1.2-1.2a7 7 0 0 0-10 0l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zm0 3.4c.6 0 1.1.2 1.5.6L8.5 11.5 7 10c.4-.4.9-.6 1.5-.6z" /></svg>
        <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" /><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".45" /></svg>
      </span>
    </div>
  )
}

/* ---------- motion helpers ---------- */
const ease = [0.22, 1, 0.36, 1]
export function Reveal({ children, delay = 0, y = 30, as = 'div', className, ...p }) {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease, delay }} {...p}>{children}</M>
  )
}

/* Headline that rises word by word. *word* renders as the gold accent. */
export function Title({ children, as = 'h2', className = '' }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const T = as
  const parts = String(children).split(/(\*[^*]+\*)/).filter(Boolean)
  let i = 0
  return (
    <T ref={ref} className={`title ${className}`}>
      {parts.map((part, pi) => {
        const accent = part.startsWith('*')
        const words = part.replace(/\*/g, '').split(' ').filter(Boolean)
        const inner = words.map((w, wi) => {
          const d = i++ * 0.055
          return (
            <Fragment key={wi}>
              <span className="wm"><motion.span className="wd" initial={{ y: '110%' }} animate={inView ? { y: '0%' } : {}} transition={{ duration: 0.8, ease, delay: d }}>{w}</motion.span></span>{' '}
            </Fragment>
          )
        })
        return accent ? <em key={pi}>{inner}</em> : <span key={pi}>{inner}</span>
      })}
    </T>
  )
}

export function Eyebrow({ children, icon }) {
  return <Reveal as="p" className="eyebrow" y={14}>{icon && <Icon n={icon} size={14} />}{children}</Reveal>
}

/* Mounts a WebGL scene only near the viewport; pauses it off-screen. */
export function Scene({ load, className, fallback = null }) {
  const ref = useRef()
  const near = useInView(ref, { margin: '400px 0px 400px 0px' })
  const visible = useInView(ref, { margin: '80px 0px 80px 0px' })
  const [C, setC] = useState(null)
  const [ok] = useState(() => typeof window !== 'undefined' && hasWebGL())
  useEffect(() => {
    if (near && ok && !C) setC(() => lazy(load))
  }, [near, ok])
  return (
    <div ref={ref} className={className}>
      {C ? <Suspense fallback={fallback}><C active={visible} /></Suspense> : fallback}
    </div>
  )
}

export function useNow(ms = 1000 * 20) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), ms); return () => clearInterval(id) }, [ms])
  return now
}
export const clock = (d) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

/** Renders "Boil the [[noodles]]" with the app's orange ingredient highlight. */
export function Marked({ t }) {
  return t.split(/(\[\[[^\]]+\]\])/).map((s, i) => s.startsWith('[[') ? <mark key={i}>{s.slice(2, -2)}</mark> : <span key={i}>{s}</span>)
}
