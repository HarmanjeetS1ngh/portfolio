import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { APPEAR_EASE } from './Appear.jsx';
import { lab } from '../config.js';

/**
 * Lab: a 1:1 port of the "Focus Carousel Pro" image strip (read from the reference's published source).
 * One focused card in the middle, five greyed / dimmed / blurred / fading cards each side.
 *   - layout   : slot s = pos - index; side cards are 52% size, 22px gap, opacity 0.86^(s-1), blur 2.5px per slot
 *   - physics  : free-spin with 0.955/frame friction, then a critically damped spring snaps to the nearest card
 *   - input    : drag (240px per card, release velocity throws it), wheel (110 per step; a hard flick throws),
 *                click a side card to go to it, arrow keys step one card
 *   - cue/text : caret under the focused card, title + caption rise in on every change (560ms)
 * Everything per-frame is written straight to the DOM (no React re-render) like the original.
 */
const P = {
  cardWidth: 400, cardRatio: 0.75, sideSize: 0.52, slotGap: 22, reach: 5,
  fade: 1, fadeStep: 0.86, blurStep: 2.5, blurMax: 12, grey: 1, dim: 0.92,
  stagePad: 24, dockReserve: 124, cueSize: 8, cueOffset: 16, cueFade: 1, cueTint: '#111111',
  rowGap: 10, labelGap: 26,
  wheelStep: 110, throwCutoff: 70, dragSpan: 240, snapRate: 6,
};
const FONT = 'var(--font-body)';
// every card shares one height. Images close to 3:4 are cropped to the standard 3:4 card so the strip looks uniform;
// the odd ones (clearly taller / much wider) keep their own proportions, i.e. the same height but a different width.
const STD = P.cardRatio;
const RATIOS = lab.map((it) => (!it.keepRatio && Math.abs(it.ratio - STD) / STD <= 0.18 ? STD : Math.min(1.5, Math.max(0.5, it.ratio))));
const mod = (e, t) => ((e % t) + t) % t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// per-slot look (size factor, opacity, grey, dim, blur, depth): the reference's maths, taper = 1
function slotLook(slot) {
  const s = Math.abs(slot);
  const near = P.sideSize;
  const d = clamp01(P.reach + 0.5 - s);
  const f = s <= 1 ? 1 + (P.fade - 1) * s : P.fade * P.fadeStep ** (s - 1);
  const p = Math.min(1, s);
  return {
    l: s <= 1 ? 1 + (near - 1) * s : near, alpha: clamp01(f * d), grey: P.grey * p, dim: 1 - (1 - P.dim) * p,
    haze: Math.min(P.blurMax, P.blurStep * Math.max(0, s - 1)), depth: 400 - Math.round(s * 12),
  };
}

const CSS = `
@keyframes lab-up { from { transform: translateY(105%); } to { transform: translateY(0); } }
.lab-rise { animation: lab-up 560ms cubic-bezier(0.19,0.8,0.24,1) both; }
.lab-cell img { -webkit-user-drag: none; }
/* desktop: reserve the dock's footprint (24px offset + ~52px icons + padding + hover lift) so the fit logic keeps card + caption clear of it at any height */
.lab-root { padding-bottom: ${P.stagePad}px !important; }
@media (min-width: 768px) { .lab-root { padding-bottom: ${P.dockReserve}px !important; } }
@media (prefers-reduced-motion: reduce) { .lab-rise { animation: none; } }
`;

export default function Lab() {
  const C = lab.length;
  const root = useRef(null);
  const stage = useRef(null);
  const cue = useRef(null);
  const label = useRef(null);
  const labelBox = useRef(null);
  const cells = useRef(new Map());
  const raf = useRef(0);
  const active = useRef(false);
  const reduced = useRef(false);
  const idxRef = useRef(0);
  const scaleRef = useRef(1);
  const stageW = useRef(1200);
  const geo = useRef(new Map()); // slot -> { x, w, alpha } for tap hit-testing
  const T = useRef({ pos: 0, vel: 0, aim: 0, stiff: 200, held: false, moved: false, grabX: 0, grabPos: 0, trail: [], clock: 0 });
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false); // true once the strip has measured itself, so the entrance never plays over a size jump
  const readyOnce = useRef(false);
  const [shown, setShown] = useState([0]); // background layers currently mounted: active + the ones fading out
    const [idx, setIdx] = useState(0);
  // per-image average brightness -> text / caret colour that stays readable on the blurred background
  const [lights, setLights] = useState(() => lab.map(() => false));
  useEffect(() => {
    let live = true, timer = 0;
    const read = (src) => new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        try {
          const c = document.createElement('canvas'); c.width = c.height = 24;
          const x = c.getContext('2d'); x.drawImage(im, 0, 0, 24, 24);
          const d = x.getImageData(0, 0, 24, 24).data; let sum = 0;
          for (let k = 0; k < d.length; k += 4) sum += 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2];
          res(sum / (d.length / 4) / 255 > 0.5);
        } catch { res(false); }
      };
      im.onerror = () => res(false);
      im.src = src;
    });
    // wait out the page entrance (0.6s) so none of this work lands mid-animation, then update once
    Promise.all(lab.map((it) => read(it.image))).then((r) => { if (live) timer = setTimeout(() => live && setLights(r), 700); });
    return () => { live = false; clearTimeout(timer); };
  }, []);
  const [scale, setScale] = useState(1);

  // base (focused) card width at the current fit: all cards share one height, widths follow their ratio (capped to the stage)
  const baseW = useCallback((e) => {
    const sc = scaleRef.current;
    const H = P.cardWidth / P.cardRatio;
    const cap = (stageW.current < 640 ? 0.86 : 1) * stageW.current / sc;
    return Math.min(H * RATIOS[mod(e, C)], cap) * sc;
  }, [C]);

  // write every card's geometry / filter straight to the DOM
  const apply = useCallback(() => {
    const sc = scaleRef.current;
    const gap = P.slotGap * sc;
    const pos = T.current.pos;
    const keys = [...cells.current.keys()].sort((a, b) => a - b);
    if (!keys.length) return;
    // chain the card centres outwards from floor(pos): spacing = half of each neighbour's drawn width + gap
    const look = new Map(keys.map((e) => [e, slotLook(e - pos)]));
    const dw = (e) => baseW(e) * look.get(e).l;
    const a0 = Math.min(keys[keys.length - 1], Math.max(keys[0], Math.floor(pos)));
    const X = new Map([[a0, 0]]);
    for (let e = a0 + 1; e <= keys[keys.length - 1]; e++) X.set(e, X.get(e - 1) + (dw(e - 1) + dw(e)) / 2 + gap);
    for (let e = a0 - 1; e >= keys[0]; e--) X.set(e, X.get(e + 1) - (dw(e) + dw(e + 1)) / 2 - gap);
    const fl = pos - a0;
    const Xp = X.get(a0) + (X.has(a0 + 1) ? (X.get(a0 + 1) - X.get(a0)) * fl : 0);
    geo.current.clear();
    cells.current.forEach((node, e) => {
      const i = look.get(e);
      const w = dw(e);
      const x = X.get(e) - Xp;
      geo.current.set(e, { x, w, alpha: i.alpha });
      node.style.width = w + 'px';
      node.style.height = (baseW(e) / RATIOS[mod(e, C)]) * i.l + 'px';
      node.style.opacity = String(i.alpha);
      node.style.zIndex = String(i.depth);
      const f = [];
      if (i.grey > 0.005) f.push(`grayscale(${i.grey.toFixed(3)})`);
      if (i.dim < 0.995) f.push(`brightness(${i.dim.toFixed(3)})`);
      if (i.haze > 0.05) f.push(`blur(${i.haze.toFixed(2)}px)`);
      node.style.filter = f.length ? f.join(' ') : 'none';
      node.style.transform = `translate3d(${x}px, 0, 0) translate(-50%, -50%)`;
      node.style.visibility = i.alpha <= 0.001 ? 'hidden' : 'visible';
    });
    const n = Math.abs(pos - Math.round(pos));
    if (cue.current) {
      cue.current.style.transform = `translate(-50%, -50%) scale(${1 - n * 0.3 * P.cueFade})`;
      cue.current.style.opacity = String(1 - n * 0.9 * P.cueFade);
    }
    if (label.current) label.current.style.opacity = String(1 - Math.min(1, n * 2.4));
  }, [baseW]);

  const step = useCallback((now) => {
    raf.current = 0;
    const t = T.current;
    if (!active.current) {
      t.vel = 0; t.held = false; t.trail.length = 0; t.aim = Math.round(t.pos); t.pos = t.aim;
      apply();
      return;
    }
    const dt = t.clock ? Math.min(0.05, (now - t.clock) / 1000) : 1 / 60;
    t.clock = now;
    if (!t.held) {
      if (reduced.current) {
        t.pos = t.aim === null ? Math.round(t.pos) : t.aim; t.aim = t.pos; t.vel = 0;
      } else if (t.aim === null) {
        // free spin: friction, then pick the card to settle on
        t.vel *= 0.955 ** (dt * 60);
        t.pos += t.vel * dt;
        if (Math.abs(t.vel) < 0.75) { t.aim = Math.round(t.pos + t.vel * 0.2); t.stiff = P.snapRate * 24 + 80; }
      } else {
        // critically damped spring toward the aimed card
        const c = 2 * Math.sqrt(t.stiff);
        const a = -t.stiff * (t.pos - t.aim) - c * t.vel;
        t.vel += a * dt;
        t.pos += t.vel * dt;
      }
    }
    const r = Math.round(t.pos);
    if (r !== idxRef.current) { idxRef.current = r; setIdx(r); }
    if (!t.held && t.aim !== null && Math.abs(t.vel) < 0.02 && Math.abs(t.pos - t.aim) < 0.0015) {
      t.pos = t.aim; t.vel = 0; t.clock = 0; apply();
      return;
    }
    apply();
    raf.current = requestAnimationFrame(step);
  }, [apply]);

  const kick = useCallback(() => {
    if (raf.current || !active.current) return;
    T.current.clock = 0;
    raf.current = requestAnimationFrame(step);
  }, [step]);

  const go = useCallback((aim, fast) => {
    const t = T.current;
    t.aim = aim;
    t.stiff = fast ? P.snapRate * 40 + 200 : 120;
    kick();
  }, [kick]);

  // run only while on screen + tab visible; honour reduced motion
  useEffect(() => {
    const el = root.current;
    let seen = false, vis = true;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current = mq.matches;
    const sync = () => {
      active.current = seen && vis;
      if (!active.current) {
        cancelAnimationFrame(raf.current); raf.current = 0;
        const t = T.current;
        t.vel = 0; t.held = false; t.trail.length = 0; t.aim = Math.round(t.pos); t.pos = t.aim;
        apply();
      } else kick();
    };
    const io = new IntersectionObserver((e) => { seen = e.some((x) => x.isIntersecting); sync(); }, { threshold: 0.01 });
    io.observe(el);
    const onVis = () => { vis = document.visibilityState !== 'hidden'; sync(); };
    const onMq = (e) => { reduced.current = e.matches; sync(); };
    document.addEventListener('visibilitychange', onVis);
    mq.addEventListener?.('change', onMq);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      mq.removeEventListener?.('change', onMq);
      cancelAnimationFrame(raf.current); raf.current = 0; active.current = false;
    };
  }, [apply, kick]);

  // fit: shrink the whole strip (never grow) so card + label always fit the stage
  useEffect(() => {
    const el = stage.current;
    const fit = () => {
      const n = el.clientWidth, r = el.clientHeight;
      if (!n || !r) return;
      if (Math.abs(n - stageW.current) > 0.5) { stageW.current = n; apply(); }
      const h = P.cardWidth / P.cardRatio;
      const a = labelBox.current?.offsetHeight || 0;
      const o = a > 0 ? a + P.labelGap : 0;
      const s = Math.max(60, r - 2 * o);
      const c = Math.max(0.2, Math.min(n < 640 ? 0.72 : 1, n / P.cardWidth, s / h));
      if (Math.abs(c - scaleRef.current) > 0.002) { scaleRef.current = c; setScale(c); apply(); }
      if (!readyOnce.current) { readyOnce.current = true; requestAnimationFrame(() => requestAnimationFrame(() => setReady(true))); }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [apply]);

  useLayoutEffect(() => { apply(); });

  // wheel: small ticks step one card per 110px; a hard flick (>= 70 in one event) throws it
  useEffect(() => {
    const el = stage.current;
    let acc = 0, throwing = false, timer = 0;
    const onWheel = (e) => {
      if (!active.current || C < 2) return;
      const m = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const c = e.deltaY * m;
      if (Math.abs(c) < 1) return;
      e.preventDefault();
      if (Math.abs(c) >= P.throwCutoff) {
        throwing = true;
        clearTimeout(timer);
        timer = setTimeout(() => { throwing = false; acc = 0; }, 320);
      }
      const t = T.current;
      if (throwing) {
        t.aim = null;
        t.vel = Math.max(-26, Math.min(26, t.vel + c * 0.06));
        kick();
      } else {
        acc += c;
        if (Math.abs(acc) >= P.wheelStep) {
          const d = acc > 0 ? 1 : -1;
          acc -= d * P.wheelStep;
          go((t.aim === null ? Math.round(t.pos) : t.aim) + d, true);
        }
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(timer); };
  }, [C, go, kick]);

  const onDown = (e) => {
    if ((e.pointerType === 'mouse' && e.button !== 0) || !active.current || C < 2) return;
    const t = T.current;
    t.held = true; t.moved = false; t.grabX = e.clientX; t.grabPos = t.pos; t.vel = 0; t.aim = null;
    t.trail = [{ x: e.clientX, t: e.timeStamp }];
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    kick();
  };
  const onMove = (e) => {
    const t = T.current;
    if (!t.held) return;
    const dx = e.clientX - t.grabX;
    if (!t.moved && Math.abs(dx) > 4) t.moved = true;
    const span = Math.max(40, P.dragSpan * scaleRef.current);
    t.pos = t.grabPos - dx / span;
    t.trail.push({ x: e.clientX, t: e.timeStamp });
    while (t.trail.length > 2 && e.timeStamp - t.trail[0].t > 110) t.trail.shift();
    kick();
  };
  const onUp = (e) => {
    const t = T.current;
    if (!t.held) return;
    t.held = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    if (!t.moved) {
      // a tap: jump to the side card under the pointer, otherwise settle where we are
      const r = stage.current.getBoundingClientRect();
      const px = e.clientX - (r.left + r.width / 2);
      const cur = Math.round(t.pos);
      let hit = null, best = Infinity;
      geo.current.forEach((g, k) => {
        if (g.alpha <= 0.02) return;
        const d = Math.abs(px - g.x);
        if (d <= g.w / 2 + 6 && d < best) { best = d; hit = k; }
      });
      if (hit !== null && hit !== cur) { go(hit, false); return; }
      t.aim = Math.round(t.pos);
      t.stiff = P.snapRate * 40 + 200;
      kick();
      return;
    }
    const tr = t.trail;
    let v = 0;
    if (tr.length >= 2) {
      const a = tr[0], b = tr[tr.length - 1], dt = b.t - a.t;
      if (dt > 0) v = -((b.x - a.x) / Math.max(40, P.dragSpan * scaleRef.current)) * (1000 / dt);
    }
    t.trail.length = 0;
    t.vel = Math.max(-26, Math.min(26, v));
    t.aim = Math.abs(t.vel) < 0.75 ? Math.round(t.pos) : null;
    if (t.aim !== null) t.stiff = P.snapRate * 40 + 200;
    kick();
  };
  const onKey = (e) => {
    if (C < 2) return;
    const t = T.current;
    const n = t.aim === null ? Math.round(t.pos) : t.aim;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(n + 1, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(n - 1, true); }
  };

  const slots = [];
  for (let e = idx - P.reach; e <= idx + P.reach; e++) slots.push(e);
  const piece = lab[mod(idx, C)];
  useEffect(() => {
    const a = mod(idx, C);
    setShown((p) => [a, ...p.filter((x) => x !== a)].slice(0, 3));
  }, [idx, C]);
  const [phone, setPhone] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)');
    const f = () => setPhone(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  // PHONE ONLY: soft pre-blurred bitmaps for the background (desktop keeps the original live blur untouched)
  const [bgs, setBgs] = useState(() => lab.map(() => null));
  useEffect(() => {
    if (!phone) return undefined;
    let live = true;
    lab.forEach((it, i) => {
      const im = new Image();
      im.onload = () => {
        try {
          const W = 256, H = Math.max(96, Math.min(512, Math.round((W * im.naturalHeight) / im.naturalWidth)));
          const c = document.createElement('canvas'); c.width = W; c.height = H;
          const x = c.getContext('2d');
          x.imageSmoothingQuality = 'high';
          x.filter = 'blur(12px)';
          x.drawImage(im, -W * 0.15, -H * 0.15, W * 1.3, H * 1.3);
          const url = c.toDataURL('image/jpeg', 0.88);
          if (live) setBgs((p) => p.map((v, k) => (k === i ? url : v)));
        } catch { /* keep the original live-blur layer */ }
      };
      im.src = it.image;
    });
    return () => { live = false; };
  }, [phone]);
  const autoInk = lights[mod(idx, C)] ? '#111' : '#fff'; // from the image's brightness: drives the home link
  // phones only, Conjuring card: arrow, title and caption are white while the home link stays black
  const conjuringPhone = phone && piece.title === 'Conjuring';
  const ink = conjuringPhone ? '#fff' : autoInk;
  const homeInk = conjuringPhone ? '#111' : autoInk;
  useEffect(() => {
    document.documentElement.style.setProperty('--lab-ink', homeInk);
    return () => document.documentElement.style.removeProperty('--lab-ink');
  }, [homeInk]);
  const cw = baseW(idx);
  const ch = cw / RATIOS[mod(idx, C)];
  // phones, poster cards: break the caption into evenly sized lines of at most 6 words
  const balance = (t) => {
    const w = t.split(' ');
    const lines = Math.ceil(w.length / 6), per = Math.ceil(w.length / lines);
    return Array.from({ length: lines }, (_, i) => w.slice(i * per, (i + 1) * per).join(' ')).join('\n');
  };
  const caption = phone && piece.keepRatio ? balance(piece.caption) : piece.caption;
  const rise = (text, n, size, lh) => (
    <span style={{ display: 'block', overflow: 'hidden', margin: 0, fontFamily: FONT, fontSize: size, fontWeight: 400, letterSpacing: 0, lineHeight: lh, color: ink, transition: 'color 0.4s ease-out' }}>
      <span className="lab-rise" style={{ display: 'block', whiteSpace: 'pre-line', animationDelay: n * 70 + 'ms' }}>{text}</span>
    </span>
  );

  return (
    <section
      ref={root}
      role="region"
      aria-label="Image strip"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKey}
      data-cursor="default"
      className="lab-root hero-wash fixed inset-0 flex w-full flex-col items-center justify-center overflow-hidden select-none"
      style={{ padding: P.stagePad, boxSizing: 'border-box', outline: 'none', isolation: 'isolate', zIndex: 0 }}
    >
      <style>{CSS}</style>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {shown.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i === mod(idx, C) ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={phone && bgs[i]
              ? { position: 'absolute', left: '-5%', top: '-5%', right: '-5%', bottom: '-5%', backgroundImage: `url(${bgs[i]})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', willChange: 'opacity' }
              : { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundImage: `url(${lab[i].image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px)', transform: 'scale(1.15)', willChange: 'opacity' }}
          />
        ))}
      </div>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0.001, y: 24 }}
        animate={ready || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 24 }}
        transition={{ duration: 0.6, ease: APPEAR_EASE, type: 'tween' }}
        ref={stage}
        data-lenis-prevent
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDragStart={(e) => e.preventDefault()}
        style={{ position: 'relative', width: '100%', flex: '1 1 auto', minHeight: 0, touchAction: 'pan-y', cursor: 'grab' }}
      >
        {slots.map((e) => {
          const s = lab[mod(e, C)];
          return (
            <div
              key={e}
              className="lab-cell"
              ref={(n) => (n ? cells.current.set(e, n) : cells.current.delete(e))}
              style={{ position: 'absolute', left: '50%', top: '50%', overflow: 'hidden', background: 'rgba(128,128,128,0.16)', willChange: 'transform, opacity, filter', transformOrigin: '50% 50%' }}
            >
              <img loading="lazy" decoding="async" src={s.image} alt={s.title} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
            </div>
          );
        })}

        {/* focus cue: the caret under the centred card */}
        <div ref={cue} style={{ position: 'absolute', left: '50%', top: '50%', width: cw, height: ch, transform: 'translate(-50%, -50%)', zIndex: 500, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', bottom: -P.cueOffset - P.cueSize, left: '50%', marginLeft: -P.cueSize / 2, width: 0, height: 0, borderLeft: `${P.cueSize / 2}px solid transparent`, borderRight: `${P.cueSize / 2}px solid transparent`, borderBottom: `${P.cueSize}px solid ${ink}`, transition: 'border-color 0.4s ease-out' }} />
        </div>

        {/* title + caption: rise in on every change, fade out while the strip is between cards */}
        <div ref={label} style={{ position: 'absolute', left: '50%', top: '50%', width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2, zIndex: 600, pointerEvents: 'none' }}>
          <div aria-live="polite" key={'lab' + idx} style={{ position: 'absolute', inset: 0 }}>
            <div ref={labelBox} style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: P.labelGap, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: P.rowGap }}>
              {rise(piece.title, 0, 16, '1.3em')}
              <div>{rise(caption, 1, 14, '1.6em')}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}