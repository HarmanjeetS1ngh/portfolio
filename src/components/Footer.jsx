import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profile, links } from '../config.js';

/**
 * Footer: the orchid garden is the ground of the page, not a widget on it.
 * Left-aligned sign-off in the sky (availability, headline, one email pill; the dock carries every
 * other link), full-bleed canvas below it (no overlap with the text), one quiet line underneath.
 *
 * Brush through the stems, click a bloom to scatter its petals, watch the bees.
 * The canvas pauses when off-screen.
 */


const FOOTER_LINKS = [
  { title: 'Links', items: [['Home', '#/', 'top'], ['Work', '#/', 'selected-work'], ['About', '#/', 'about'], ['Resume', '/resume.pdf']] },
  { title: 'Socials', items: [['LinkedIn', links.linkedin], ['Medium', links.medium], ['Telegram', links.telegram]] },
];

// Home scrolls to the top, About to its section (going home first if needed); everything else is a normal link.
function goHome(e, section) {
  e.preventDefault();
  const scroll = () => (section === 'top' ? window.scrollTo({ top: 0, behavior: 'smooth' }) : document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  const h = window.location.hash;
  if (!h || h === '#/' || h === '#') scroll();
  else { window.location.hash = '#/'; setTimeout(scroll, 200); }
}

// The About page's design-tool "selection" frame (outline + corner handles), in white for the dark footer.
// Hidden at rest; on hover (or keyboard focus) of the parent `group` the outline fades in. It must not scale or move:
// resampling a 1px border mid-transform is what made it shimmer. The corner handles pop in a beat after the outline.
const EASE = [0.22, 1, 0.36, 1];
function FrameSelection({ inset = '-inset-[6px]' }) {
  const dot = 'absolute size-2 border border-white bg-ink-0 scale-0 transition-transform duration-300 delay-100 ease-[cubic-bezier(0.34,1.4,0.64,1)] will-change-transform group-hover:scale-100 group-focus-visible:scale-100 group-has-[:focus-visible]:scale-100';
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute ${inset} rounded-[2px] border border-white opacity-0 will-change-[opacity] [transform:translateZ(0)] transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 group-has-[:focus-visible]:opacity-100`}
    >
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((c) => (
        <span key={c} className={`${dot} ${c}`} />
      ))}
    </span>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const cvRef = useRef(null);
  const footRef = useRef(null);
  // status dot: the reference flips between its "start" and "end" variants every 1300ms
  const [dotOn, setDotOn] = useState(true);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = footRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (reduce || !inView) return undefined;
    const id = setInterval(() => setDotOn((v) => !v), 1300);
    return () => clearInterval(id);
  }, [reduce, inView]);
  // CURTAIN REVEAL (copied from the reference footer): ONE scroll-linked slide on the footer itself.
  // The page above sits on top (z-10); the footer rides up from beneath it, y: -200 -> 0 (tablet/mobile: -100),
  // progress 0 when the footer's top meets the viewport bottom, 1 when its bottom does. Linear, no spring.
  // The transform is written SYNCHRONOUSLY from Lenis' own scroll tick (same frame the page moves), not through
  // a motion value (which lands one frame late and let the footer trail behind the page edge on fast scrolls).
  useEffect(() => {
    const el = footRef.current;
    if (!el || reduce) return undefined;
    // browsers with scroll-driven animations (Chrome, Edge, Safari 26+) run the reveal from CSS (.footer-rise): nothing to do here
    if (CSS.supports('animation-timeline', 'view()')) return undefined;
    const cover = el.previousElementSibling;
    const mq = matchMedia('(min-width: 810px)');
    let top = 0, h = 1, vh = innerHeight, off = 200;
    const apply = () => {
      const p = Math.min(1, Math.max(0, (scrollY + vh - top) / h));
      el.style.transform = `translate3d(0, ${-(1 - p) * off}px, 0)`;
    };
    const measure = () => {
      off = mq.matches ? 200 : 100;
      vh = innerHeight;
      h = el.offsetHeight || 1;
      top = cover ? cover.getBoundingClientRect().bottom + scrollY : el.offsetTop; // layout top: unaffected by our own transform
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (cover) ro.observe(cover); // images/fonts above change the page height
    addEventListener('resize', measure);
    const lenis = window.__lenis;
    if (lenis) lenis.on('scroll', apply); // smooth-scroll ticks: same frame as the page (Lenis also re-emits native scrolls)
    else addEventListener('scroll', apply, { passive: true });
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
      if (!lenis) removeEventListener('scroll', apply);
      lenis?.off('scroll', apply);
      el.style.transform = '';
    };
  }, [reduce]);

  // MAGNETIC PULL: once 90% of the footer is on screen (75% on phones) while scrolling down, glide the rest of the way so it is fully visible.
  // Touch: waits for the finger to lift (never fights a drag). Scrolling up releases it; it re-arms once you drop below 90%.
  useEffect(() => {
    const el = footRef.current;
    if (!el || reduce) return undefined;
    const phone = window.matchMedia('(max-width: 767px)');
    const threshold = () => (phone.matches ? 0.75 : 0.9); // phones pull in earlier
    let last = scrollY, armed = true, snapping = false, touching = false, pending = false, raf = 0;
    const samples = []; // recent {t, y} scroll positions, to read the user's current speed
    const lenis = () => window.__lenis;
    const progress = () => {
      const h = el.offsetHeight || 1;
      return (scrollY + innerHeight - el.offsetTop) / h; // offsetTop ignores our own translate
    };
    const velocity = () => { // px/ms over the last ~100ms
      const now = performance.now();
      while (samples.length && now - samples[0].t > 100) samples.shift();
      if (samples.length < 2) return 0;
      const f = samples[0], l = samples[samples.length - 1];
      return l.t > f.t ? (l.y - f.y) / (l.t - f.t) : 0;
    };
    const cancel = () => {
      if (!snapping) return;
      cancelAnimationFrame(raf);
      snapping = false;
      armed = true;
      last = scrollY;
    };
    // trackpad inertia keeps firing downward wheel events after the fingers stop: those must not cancel the glide (that caused stutter)
    const onWheel = (e) => { if (e.deltaY < 0) cancel(); };
    const setY = (y) => { const l = lenis(); if (l) l.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); };
    // Continue at the user's own speed, then settle like real momentum. easeOutQuint starts at slope 5d/T
    // (so T = 5d/v matches the incoming speed) and ends with zero velocity AND zero acceleration: no visible landing.
    const snap = () => {
      pending = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const from = scrollY, d = max - from;
      if (d < 2) return;
      const v = Math.min(4, Math.max(0.4, velocity()));
      const T = Math.min(1500, Math.max(300, (5 * d) / v));
      const t0 = performance.now();
      snapping = true;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / T);
        setY(from + d * (1 - Math.pow(1 - t, 5)));
        if (t < 1) raf = requestAnimationFrame(step);
        else { snapping = false; last = scrollY; }
      };
      raf = requestAnimationFrame(step);
    };
    const onScroll = () => {
      const y = scrollY, down = y > last;
      last = y;
      if (snapping) return;
      samples.push({ t: performance.now(), y });
      const p = progress();
      if (p < threshold()) { armed = true; pending = false; return; }
      if (p >= 0.999) { armed = false; return; } // fully visible: stay put
      if (!down || !armed) return;
      armed = false;
      if (touching) pending = true; else snap();
    };
    const down = () => { touching = true; cancel(); };
    const up = () => { touching = false; if (pending) snap(); };
    const l = lenis();
    if (l) l.on('scroll', onScroll); else addEventListener('scroll', onScroll, { passive: true });
    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('keydown', cancel);
    addEventListener('touchstart', down, { passive: true });
    addEventListener('touchend', up, { passive: true });
    addEventListener('touchcancel', up, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', cancel);
      if (l) l.off('scroll', onScroll); else removeEventListener('scroll', onScroll);
      removeEventListener('touchstart', down);
      removeEventListener('touchend', up);
      removeEventListener('touchcancel', up);
    };
  }, [reduce]);

  // the orchid engine, unchanged apart from abortable listeners + custom-cursor pointer on blooms
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions

        const ac = new AbortController();
        const stage = stageRef.current,
          cv = cvRef.current,
          ctx = cv.getContext("2d");
        const PIXEL = 4.3; // pixel-art look: the garden renders at 1/PIXEL resolution and is scaled up unsmoothed (2 = fine, 4 = chunky)
        const rm = matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0.25
          : 1;
        let W = 0,
          H = 0,
          S = 1,
          BS = 1,
          dpr = 1,
          plants = [],
          parts = [],
          heads = [],
          col = {},
          vis = true,
          pt = { x: -999, y: 0, vx: 0, in: false },
          infl = 0,
          revealing = false,
          lastScroll = 0,
          bees = [],
          baseDpr = 1,
          q = 1, // adaptive resolution scale (1 = full); drops when the canvas can't keep up with the display
          ready = false,
          near = false;
        const TINTS = [
          ["#7ea6ff", "#3f63e0", "#f0f4ff", "#2a2f9a"],
          ["#8c9dff", "#4350d8", "#eef0ff", "#2a2f9a"],
          ["#6fb6ff", "#2f7be0", "#eaf5ff", "#26358f"],
          ["#d2b4ff", "#8f62d9", "#f8f1ff", "#5a2a8f"],
          ["#e0c0f6", "#a366cc", "#fcf3ff", "#6a2a86"],
          ["#bfa8f5", "#7558cc", "#f4efff", "#4b2f9a"],
        ];
        const rng = (s) => () => {
          s = (s + 1831565813) >>> 0;
          let t = s;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        col = { stem: "#006611", leaf: "#00661a", leaf2: "#008b23" };
        const ALPHA = [0.7, 0.85, 1];
        /* leaf sprites (from the Framer footer), root-anchored like the original */
        const LEAF = [["/footer/leaf-1.webp", 0.7965006347325402], ["/footer/leaf-2.webp", 0.2554003641859923]].map(([u, root]) => {
          const image = new Image();
          image.src = u;
          return { image, root, tip: 0 };
        });
        // decode the leaf art now (not on the first visible frame) so the reveal never hitches on image decode
        LEAF.forEach((l) => l.image.decode?.().then(() => { if (W && ready && !vis) draw(0); }).catch(() => {}));
        LEAF[0].tip = -1;
        LEAF[1].tip = 1;

        /* flower sprites: drawn once, reused for every bloom */
        const spr = TINTS.map(([a, b, c, lip]) => {
          const cn = document.createElement("canvas");
          cn.width = cn.height = 32;
          const g = cn.getContext("2d");
          g.scale(0.5, 0.5);
          const gr = g.createRadialGradient(32, 32, 2, 32, 32, 28);
          gr.addColorStop(0, c);
          gr.addColorStop(0.45, a);
          gr.addColorStop(1, b);
          const el = (x, y, rx, ry, rot, fill) => {
            g.beginPath();
            g.ellipse(x, y, rx, ry, rot, 0, 6.283);
            g.fillStyle = fill;
            g.fill();
            g.strokeStyle = "rgba(15,25,100,.35)";
            g.lineWidth = 0.6;
            g.stroke();
          };
          el(21, 45, 7.5, 14, 0.55, gr);
          el(43, 45, 7.5, 14, -0.55, gr);
          el(32, 16, 8, 13, 0, gr);
          el(17, 30, 15, 12, 0.2, gr);
          el(47, 30, 15, 12, -0.2, gr);
          g.strokeStyle = "rgba(255,255,255,.32)";
          g.lineWidth = 0.7;
          g.beginPath();
          for (const s of [-1, 1])
            for (const dy of [-6, 0, 6]) {
              g.moveTo(32, 32);
              g.lineTo(32 + s * 27, 30 + dy);
            }
          g.stroke();
          el(32, 43, 6.5, 8, 0, lip);
          el(32, 40, 3, 4, 0, "#f3f0ff");
          g.beginPath();
          g.arc(32, 33, 3.2, 0, 6.283);
          g.fillStyle = "#fbfbff";
          g.fill();
          return cn;
        });

        /* bud sprite: same trick as the blooms, so buds are one drawImage instead of two live ellipses */
        const budSpr = (() => {
          const cn = document.createElement("canvas");
          cn.width = cn.height = 16;
          const g = cn.getContext("2d");
          g.scale(0.25, 0.25);
          g.fillStyle = "#9db8ff";
          g.beginPath();
          g.ellipse(32, 32, 14.08, 20.48, 0, 0, 6.283);
          g.fill();
          g.fillStyle = "#a8d4b4";
          g.beginPath();
          g.ellipse(32, 44.8, 7.68, 8.96, 0, 0, 6.283);
          g.fill();
          return cn;
        })();
        const headPool = []; // reused hit-test records, so drawing allocates nothing per frame

        const pos = (s, t) => [
          s.x + (s.arch + s.b) * t * t,
          H + 4 - s.h * t * (1.15 - 0.35 * t),
        ];

        function build() {
          const HR = H / 0.78;
          S = Math.min(1, Math.max(0.5, W / 1000));
          BS = 0.7 + 0.3 * S;
          const r = rng(5),
            n = Math.min(
              115,
              Math.max(26, Math.round(W / (17 * S * (1 + 0.3 * (1 - S))))),
            );
          plants = [];
          bees = [];
          heads.length = 0;
          for (let i = 0; i < n; i++) {
            const layer = Math.floor(r() * 3),
              sc = [0.7, 0.85, 1][layer] * (0.85 + r() * 0.3),
              h = (HR * ([0.32, 0.45, 0.58][layer] + r() * 0.13)) / 0.8;
            const v = r() < 0.5 ? 0 : 1,
              side = r() < 0.5 ? -1 : 1,
              m = 4 + Math.floor(r() * 3),
              fl = [],
              leaves = [];
            for (let j = 0; j < m; j++) {
              const bud = j >= m - 2;
              fl.push({
                t: 0.42 + (0.58 * j) / (m - 1),
                size: sc * 30 * S * (1 - (0.4 * j) / (m - 1)) * (bud ? 0.5 : 1),
                bud,
                ti: v * 3 + Math.floor(r() * 3),
                ph: r() * 6.28,
                fl: 0,
                pop: 0,
                pv: 0,
              });
            }
            for (const d of [-1, 1, r() < 0.5 ? -1 : 1]) {
              const L = HR * (0.15 + r() * 0.12) * (layer ? 1 : 0.8);
              leaves.push({ d, L, wd: L * 0.17 });
            }
            plants.push({
              x: ((i + 0.5) / n) * W + (((r() - 0.5) * W) / n) * 0.9,
              h,
              sc,
              layer,
              arch: side * h * (0.08 + r() * 0.14),
              side,
              fl,
              leaves,
              b: 0,
              v: 0,
              ph: r() * 6.28,
            });
          }
          plants.sort((a, b) => a.layer - b.layer || a.h - b.h);
        }

        function update(dt, t) {
          infl += ((pt.in ? 1 : 0) - infl) * Math.min(1, dt * 4);
          pt.vx *= Math.exp(-dt * 8);
          for (const s of plants) {
            const dx = s.x - pt.x,
              g = Math.exp((-dx * dx) / (150 * 150)) * infl;
            const wind =
              Math.sin(t * 1.1 - s.x * 0.004 + s.ph * 0.3) * 7 +
              Math.sin(t * 2.7 + s.ph) * 2.5;
            const target =
              (Math.sign(dx || 1) * g * 40 +
                Math.sin(t * 1.6 + s.ph) * 5 * infl +
                wind) *
              rm;
            s.v +=
              (90 * (target - s.b) - 10.4 * s.v) * dt +
              pt.vx * g * 0.5 * dt * 60 * rm;
            const lim = s.h * 0.3;
            s.b = Math.max(-lim, Math.min(lim, s.b + s.v * dt));
            const act = Math.max(g, Math.min(1, Math.abs(s.v) / 60));
            for (const f of s.fl) {
              f.fl += (act - f.fl) * Math.min(1, dt * 5);
              f.pv += (-140 * f.pop - 9 * f.pv) * dt;
              f.pop += f.pv * dt;
            }
          }
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.vy = Math.min(150, p.vy + 260 * dt);
            p.vx *= Math.exp(-dt * 1.2);
            p.x += (p.vx + Math.sin(t * 3 + p.ph) * 30) * dt;
            p.y += p.vy * dt;
            p.rot += p.vr * dt;
            if (p.y > H + 20) parts.splice(i, 1);
          }
          updateBees(dt, t);
        }
        const R = Math.random;
        const qb = (a, c, e, u) => {
          const m = 1 - u;
          return [
            m * m * a[0] + 2 * m * u * c[0] + u * u * e[0],
            m * m * a[1] + 2 * m * u * c[1] + u * u * e[1],
          ];
        };
        function pickHead(near, b, ex) {
          let c = heads.filter(
            (h) =>
              h.s.layer === 2 && // front row only: bees are hard to see on the back rows at pixel scale
              !h.f.bee &&
              h.f !== ex &&
              h.x > 24 &&
              h.x < W - 24 &&
              h.y > 16 &&
              h.y < H - 10,
          );
          if (near) {
            c.sort(
              (p, q) =>
                Math.hypot(p.x - b.x, p.y - b.y) -
                Math.hypot(q.x - b.x, q.y - b.y),
            );
            c = c.slice(0, 6);
          }
          return c.length ? c[Math.floor(R() * c.length)] : null;
        }
        function toFlower(b, h, dur) {
          b.tf = h.f;
          h.f.bee = b;
          b.p0 = [b.x, b.y];
          b.c = [
            (b.x + h.x) / 2 + (R() - 0.5) * 60,
            Math.min(b.y, h.y) - 40 - R() * 50,
          ];
          b.u = 0;
          b.dur = dur;
          b.state = "come";
        }
        function leave(b, hop) {
          const old = b.tf;
          if (old) {
            old.bee = null;
            b.tf = null;
          }
          if (hop) {
            const h = pickHead(true, b, old);
            if (h) {
              toFlower(b, h, 0.9 + R() * 0.6);
              return;
            }
          }
          const d = R() < 0.5 ? -1 : 1;
          b.p0 = [b.x, b.y];
          b.c = [b.x + d * 80, b.y - 90 - R() * 60];
          b.p2 = [d > 0 ? W + 80 : -80, b.y - 40 - R() * 120];
          b.u = 0;
          b.dur = 1.8 + R() * 0.8;
          b.state = "out";
        }
        function updateBees(dt, t) {
          if (!bees.length && heads.length) {
            const n = Math.max(2, Math.min(3, Math.round(W / 300)));
            for (let i = 0; i < n; i++) {
              const h = pickHead(false, null, null);
              if (!h) break;
              const b = {
                x: h.x,
                y: h.y,
                tf: h.f,
                state: "sit",
                t: 0.3 + R() * 1.7,
                u: 0,
                dur: 1,
                face: R() < 0.5 ? -1 : 1,
                pitch: 0,
                ph: R() * 6.28,
                sz: 1.15 + R() * 0.3,
              };
              h.f.bee = b;
              bees.push(b);
            }
          }
          for (const b of bees) {
            if (b.state === "sit") {
              const f = b.tf;
              b.x = f.hx + Math.sin(t * 2 + b.ph) * 0.5;
              b.y = f.hy - f.hr * 0.12;
              b.t -= dt;
              if (b.t <= 0) leave(b, R() < 0.45);
            } else if (b.state === "away") {
              b.t -= dt;
              if (b.t <= 0) {
                const h = pickHead(false, null, null);
                if (h) {
                  b.x = R() < 0.5 ? -60 : W + 60;
                  b.y = H * (0.1 + R() * 0.4);
                  toFlower(b, h, 2 + R());
                } else b.t = 1;
              }
            } else {
              b.u = Math.min(1, b.u + dt / b.dur);
              const come = b.state === "come",
                e = come ? [b.tf.hx, b.tf.hy - b.tf.hr * 0.12] : b.p2,
                ease = (u) => (come ? 1 - (1 - u) * (1 - u) : Math.pow(u, 1.4));
              const p = qb(b.p0, b.c, e, ease(b.u)),
                q = qb(b.p0, b.c, e, ease(Math.min(1, b.u + 0.04))),
                wob = come ? 1 - b.u : 1;
              b.x = p[0] + Math.sin(t * 9 + b.ph) * 3 * wob;
              b.y = p[1] + Math.cos(t * 7 + b.ph) * 2.5 * wob;
              const vx = q[0] - p[0],
                vy = q[1] - p[1];
              if (Math.abs(vx) > 0.3) b.face = vx > 0 ? 1 : -1;
              b.pitch = Math.max(
                -0.6,
                Math.min(0.6, Math.atan2(vy, Math.abs(vx) + 0.01) * 0.5),
              );
              if (b.u >= 1) {
                if (come) {
                  b.state = "sit";
                  b.t = 6 + R() * 4;
                  b.tf.pv += 2.5;
                  b.pitch = 0;
                } else {
                  b.state = "away";
                  b.t = 1 + R() * 3;
                }
              }
            }
          }
        }
        function drawBee(b, t) {
          const fly = b.state !== "sit";
          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.scale(b.face * b.sz * BS, b.sz * BS);
          if (fly) ctx.rotate(b.pitch);
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(0, 0, 5, 3.2, 0, 0, 6.283);
          ctx.fillStyle = "#f2b81c";
          ctx.fill();
          ctx.clip();
          ctx.fillStyle = "#2b1c08";
          ctx.fillRect(-2.9, -4, 1.3, 8);
          ctx.fillRect(-0.3, -4, 1.3, 8);
          ctx.fillRect(-5.5, -4, 1.4, 8);
          ctx.restore();
          ctx.beginPath();
          ctx.arc(5.1, -0.2, 2.2, 0, 6.283);
          ctx.fillStyle = "#2b1c08";
          ctx.fill();
          const fl = fly
            ? 0.35 + Math.abs(Math.sin(t * 70 + b.ph)) * 0.9
            : 0.25;
          ctx.fillStyle = "rgba(235,245,255,.8)";
          ctx.strokeStyle = "rgba(110,130,165,.55)";
          ctx.lineWidth = 0.35;
          ctx.beginPath();
          ctx.ellipse(
            -1.2,
            -3,
            3.4,
            1.5 * fl + 0.4,
            -0.5 - (fly ? 0 : 0.4),
            0,
            6.283,
          );
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(-0.2, -3.3, 2.8, 1.2 * fl + 0.3, -0.15, 0, 6.283);
          ctx.fill();
          ctx.restore();
        }
        function leaf(s, l, i) {
          const sp = LEAF[(i + (l.d > 0 ? 1 : 0)) % 2],
            im = sp.image;
          if (!im.complete || !im.naturalWidth) return;
          const tall = Math.min(1, Math.max(0, (s.h / H - 0.4) / 0.5)),
            vr = 0.8 + 0.4 * Math.abs(Math.sin(l.L * 12.9898 + i * 4.1 + s.x * 0.37)),
            hh = l.L * 1.12 * (0.7 + 0.3 * S) * (1.12 - 0.42 * tall) * vr,
            ww = (hh * im.naturalWidth) / im.naturalHeight,
            flip = sp.tip !== l.d;
          const a = l.d * 0.12 + s.b * 0.004 + Math.sin(l.L) * 0.1,
            c = Math.cos(a) * dpr,
            sn = Math.sin(a) * dpr,
            fx = flip ? -1 : 1;
          ctx.setTransform(c * fx, sn * fx, -sn, c, s.x * dpr, (H + 4) * dpr);
          ctx.drawImage(im, -ww * sp.root, -hh, ww, hh);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        /* procedural grass: tapered blades in the same palette as the leaves */
        let blades = null, bladeKey = "";
        const HASH = (e) => {
          const v = Math.sin(e * 127.1 + 73.4) * 43758.5453;
          return v - Math.floor(v);
        };
        function makeBlades() {
          const HR = H / 0.78;
          const base = Math.min(72, Math.max(40, HR * 0.15)) * S;
          blades = { back: [[], [], []], front: [[], [], []] };
          for (const [name, step0, hs, seed] of [
            ["back", 6.5, 1.55, 500],
            ["front", 5.5, 1, 0],
          ]) {
            const step = step0 * (0.6 + 0.4 * S),
              n = Math.ceil(W / step) + 4;
            for (let i = 0; i < n; i++) {
              const k = (j) => HASH(i * 7 + j + seed);
              const tone = Math.floor(k(6) * 3);
              blades[name][tone].push({
                x: i * step - 2 * step + (k(1) - 0.5) * step * 1.6,
                h: base * hs * (0.45 + k(2) * 0.75) * (k(9) > 0.9 ? 1.25 : 1),
                w: (2.6 + k(3) * 3.2) * (0.6 + 0.4 * S),
                lean: (k(4) - 0.5) * base * 0.9,
                ph: k(5) * 6.28,
              });
            }
          }
          bladeKey = W + "x" + H;
        }
        const GTONE = {
          back: [["#4a7324", "#7aa247"], ["#547d28", "#86ad4c"], ["#5c862e", "#8fb455"]],
          front: [["#628a35", "#98b956"], ["#6e9440", "#a2c05e"], ["#789c45", "#acc763"]],
        };
        function grass(t, isBack, ctx) {
          if (bladeKey !== W + "x" + H) makeBlades();
          const name = isBack ? "back" : "front",
            y0 = H + 6;
          const wk = t * 1.3, wk2 = t * 3.1;
          for (let ti = 0; ti < 3; ti++) {
            const list = blades[name][ti], c = GTONE[name][ti];
            ctx.beginPath();
            for (const b of list) {
              const w = (Math.sin(wk - b.x * 0.006 + b.ph * 0.3) * 0.16 + Math.sin(wk2 + b.ph) * 0.05) * rm * b.h,
                tx = b.x + b.lean + w, ty = y0 - b.h,
                cx = b.x + (b.lean + w) * 0.3, cy = y0 - b.h * 0.62, hw = b.w / 2;
              b.tx = tx; b.cx = cx; b.cy = cy; b.ty = ty;
              ctx.moveTo(b.x - hw, y0);
              ctx.quadraticCurveTo(cx - hw * 0.7, cy, tx, ty);
              ctx.quadraticCurveTo(cx + hw * 0.7, cy, b.x + hw, y0);
            }
            ctx.fillStyle = c[0];
            ctx.fill();
            ctx.beginPath();
            for (const b of list) {
              const hw = b.w / 2;
              ctx.moveTo(b.x - hw * 0.25, y0);
              ctx.quadraticCurveTo(b.cx - hw * 0.1, b.cy, b.tx, b.ty);
              ctx.quadraticCurveTo(b.cx + hw * 0.5, b.cy, b.x + hw * 0.3, y0);
            }
            ctx.fillStyle = c[1];
            ctx.globalAlpha = 0.55;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        function draw(t) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, W, H);
          let hn = 0;
          grass(t, true, ctx);
          for (const s of plants) {
            ctx.globalAlpha = ALPHA[s.layer];
            ctx.fillStyle = s.layer === 2 ? col.leaf2 : col.leaf;
            s.leaves.forEach((l, i) => leaf(s, l, i));
            ctx.strokeStyle = col.stem;
            ctx.lineWidth = 2.4 * s.sc * (0.6 + 0.4 * S);
            ctx.lineCap = "round";
            ctx.beginPath();
            for (let k = 0; k <= 6; k++) {
              const p = pos(s, k / 6);
              k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]);
            }
            ctx.stroke();
            for (let j = s.fl.length - 1; j >= 0; j--) {
              const f = s.fl[j],
                p = pos(s, f.t),
                dx = 2 * (s.arch + s.b) * f.t,
                dy = s.h * (1.15 - 0.7 * f.t),
                ang = Math.atan2(dx, dy);
              const px = p[0] + s.side * f.size * 0.3,
                py = p[1] - f.size * 0.1,
                w = f.size * 1.5 * (1 + f.pop * 0.2);
              f.hx = px;
              f.hy = py;
              f.hr = w * 0.5;
              const fl =
                Math.sin(t * 4 + f.ph) * 0.12 * f.fl * rm +
                Math.sin(t * 1.3 + f.ph) * 0.05 * rm;
              const rot = ang * 0.5 + fl,
                rc = Math.cos(rot) * dpr,
                rs = Math.sin(rot) * dpr;
              ctx.setTransform(rc, rs, -rs, rc, px * dpr, py * dpr);
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(f.bud ? budSpr : spr[f.ti], -w / 2, -w / 2, w, w);
              ctx.imageSmoothingEnabled = true;
              ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
              if (!f.bud) {
                const hd = headPool[hn] || (headPool[hn] = {});
                hd.x = px; hd.y = py; hd.r = w * 0.5; hd.f = f; hd.s = s; hd.ti = f.ti;
                heads[hn++] = hd;
              }
              if (f.bee && f.bee.state === "sit") drawBee(f.bee, t);
            }
          }
          heads.length = hn;
          ctx.globalAlpha = 1;
          grass(t, false, ctx);
          for (const b of bees)
            if (b.state === "out" || b.state === "come") drawBee(b, t);
          for (const p of parts) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            ctx.beginPath();
            ctx.ellipse(0, 0, 6 * p.k, 3.5 * p.k, 0, 0, 6.283);
            ctx.fill();
            ctx.restore();
          }
        }
        function hit(x, y) {
          for (let i = heads.length - 1; i >= 0; i--) {
            const h = heads[i];
            if ((x - h.x) ** 2 + (y - h.y) ** 2 < h.r * h.r) return h;
          }
          return null;
        }
        // bees: generous hit radius (finger-sized), tap one and it flies off
        function hitBee(x, y) {
          for (const b of bees) {
            if (b.state === "out" || b.state === "away") continue;
            const r = Math.max(16, 9 * b.sz * BS);
            if ((x - b.x) ** 2 + (y - b.y) ** 2 < r * r) return b;
          }
          return null;
        }
        function burst(h) {
          const T = TINTS[h.ti];
          h.f.pv -= 7;
          for (let i = 0; i < 24 && parts.length < 420; i++) {
            const a = Math.random() * 6.283,
              sp = 40 + Math.random() * 130;
            parts.push({
              x: h.x + Math.cos(a) * h.r * 0.4,
              y: h.y + Math.sin(a) * h.r * 0.4,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp - 70 - Math.random() * 60,
              rot: Math.random() * 6.283,
              vr: (Math.random() - 0.5) * 10,
              ph: Math.random() * 6.283,
              k: (h.r / 22) * (0.8 + Math.random() * 0.4),
              c: T[i % 2 ? 0 : 2],
            });
          }
        }
        let rect = null; // cached: a layout read on every pointermove forced reflows next to the footer's transform
        const dirty = () => { rect = null; };
        addEventListener("scroll", dirty, { passive: true, signal: ac.signal });
        addEventListener("resize", dirty, { signal: ac.signal });
        const loc = (e) => {
          const r = rect || (rect = cv.getBoundingClientRect());
          return [
            ((e.clientX - r.left) / r.width) * W,
            ((e.clientY - r.top) / r.height) * H,
          ];
        };
        stage.addEventListener("pointermove", (e) => {
          const [x, y] = loc(e);
          pt.vx = pt.vx * 0.5 + (x - pt.x) * 0.5;
          pt.x = x;
          pt.y = y;
          pt.in = true;
          if (hitBee(x, y) || hit(x, y)) { if (stage.dataset.cursor !== "pointer") stage.dataset.cursor = "pointer"; }
          else if (stage.dataset.cursor) delete stage.dataset.cursor;
        }, { signal: ac.signal });
        stage.addEventListener("pointerdown", (e) => {
          const [x, y] = loc(e);
          pt.x = x;
          pt.y = y;
          pt.in = true;
          const bee = hitBee(x, y);
          if (bee) { leave(bee, false); return; }
          const h = hit(x, y);
          if (h) {
            // any bee sitting on this plant (this bloom or a sibling) flies off
            for (const f2 of h.s.fl) if (f2.bee) leave(f2.bee, false);
            burst(h);
          }
        }, { signal: ac.signal });
        stage.addEventListener("pointerleave", () => {
          pt.in = false;
          delete stage.dataset.cursor;
        }, { signal: ac.signal });
        stage.addEventListener("pointerup", (e) => {
          if (e.pointerType !== "mouse") pt.in = false;
        }, { signal: ac.signal });

        const ro = new ResizeObserver(([e]) => {
          W = e.contentRect.width;
          H = e.contentRect.height;
          if (!W || !H) return;
          baseDpr = 1 / PIXEL;
          dpr = baseDpr * q;
          cv.width = Math.round(W * dpr);
          cv.height = Math.round(H * dpr);
          build();
          ready = false;
          initing = false;
          initTok++;
          if (near) init(); // otherwise deferred until the footer is about a screen away
        });
        // The 3s pre-roll (90 simulation steps) used to run in ONE block right as the footer came near,
        // which froze the page for a moment. Now it runs in small slices during idle time instead.
        let initTok = 0,
          initing = false;
        const later = (fn) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 120 }) : setTimeout(fn, 0));
        function init() {
          if (ready || initing || !W) return;
          initing = true;
          const tok = ++initTok;
          draw(0); // fills `heads` so bees can be placed
          let i = 1;
          const step = () => {
            if (tok !== initTok) return; // resized meanwhile: the newer init owns the state
            for (const end = Math.min(90, i + 7); i <= end; i++) update(1 / 30, i / 30);
            if (i <= 90) return later(step);
            draw(3);
            initing = false;
            ready = true;
          };
          later(step);
        }
        const nearIo = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          near = true;
          init();
          nearIo.disconnect();
        }, { rootMargin: "100% 0px 100% 0px" });
        nearIo.observe(stage);
        ro.observe(stage);
        addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true, signal: ac.signal });
        let raf = 0,
          last = 0;
        let rafPrev = 0, minI = 1e9, ema = 0, drawn = 0;
        function loop(now) {
          raf = requestAnimationFrame(loop);
          const itv = now - rafPrev;
          rafPrev = now;
          if (itv > 2 && itv < 100) minI = Math.min(minI, itv); // best interval seen ~ the display's refresh
          const dt = (now - last) / 1000;
          // 60fps+ while the pointer is brushing / petals are falling, ~48fps when only the wind moves
          const busy = now - lastScroll > 160 && (pt.in || infl > 0.02 || parts.length > 0);
          // while the page is scrolling fast, skip the canvas so it never competes with the scroll frame
          const lv = window.__lenis ? Math.abs(window.__lenis.velocity) : 0;
          const scrolling = window.__lenis ? lv > 2.5 : now - lastScroll < 160;
          if (scrolling || dt < (busy ? 0.012 : 0.0155) || !W || !ready) { if (scrolling) { last = now; drawn = 0; } return; }
          last = now;
          update(Math.min(0.05, dt), now / 1000);
          draw(now / 1000);
          // governor: if frames take far longer than the display's refresh while we draw every frame, the
          // canvas is the bottleneck (software raster / weak GPU): step the resolution down (min 50%).
          if (busy && itv < 100) {
            ema = drawn ? ema * 0.85 + itv * 0.15 : itv;
            if (++drawn > 30 && false && ema > Math.max(17, minI * 1.7) && q > 0.5) {
              q = Math.max(0.5, q - 0.125);
              dpr = baseDpr * q;
              cv.width = Math.round(W * dpr);
              cv.height = Math.round(H * dpr);
              drawn = 0;
              draw(now / 1000);
            }
          }
        }
        // run only while the footer is actually in the viewport; fully stopped otherwise
        const io = new IntersectionObserver(([e]) => {
          vis = e.isIntersecting;
          if (vis) init();
          if (vis && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          } else if (!vis && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        }, { rootMargin: "0px" });
        io.observe(stage);
        return () => {
          cancelAnimationFrame(raf);
          ac.abort();
          delete stage.dataset.cursor;
          ro.disconnect();
          io.disconnect();
          nearIo.disconnect();
        };
  }, []);

  const mail = links.email.replace(/^mailto:/, '');
  const [copied, setCopied] = useState(false);
  const resetRef = useRef(0);
  const copyMail = async () => {
    try { await navigator.clipboard.writeText(mail); } catch { window.location.href = links.email; return; }
    setCopied(true);
    clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer
      ref={footRef}
      id="footer"
      className="footer-rise relative z-0 flex w-full flex-col justify-end overflow-hidden min-h-[calc(100lvh+3px)] md:min-h-[calc(100svh+3px)]"
      style={{
        background: 'linear-gradient(142deg, var(--color-ink) 36%, var(--color-ink-0) 100%)',
        willChange: 'transform',
      }}
    >
      {/* sky: left-aligned, bottom-weighted, right side left open for the bees. Click-through so the garden stays brushable. */}
      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-[clamp(20px,4vw,56px)] pt-[clamp(48px,10svh,96px)] pb-[clamp(28px,5vw,64px)] md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col items-start gap-5 max-md:items-center max-md:text-center">
        <span className="inline-flex items-center gap-2 rounded-[40px] py-2 font-body text-[14px] leading-[1.4] font-normal whitespace-pre text-main/60 select-none">
          {/* reference "Pulser": bright glowing dot that fades to a dim dot and back (1.3s steps, spring 3s / bounce .2) */}
          <span aria-hidden="true" className="relative size-2 flex-none rounded-[10px] bg-[#52525b]">
            <span
              className="absolute inset-0 rounded-[10px] bg-[#fffefc] shadow-[0_0_20px_4px_#fffefc] transition-opacity duration-[1200ms] ease-out motion-reduce:transition-none"
              style={{ opacity: dotOn ? 1 : 0 }}
            />
          </span>
          Available for work
        </span>
        <h2 className="footer-glitch m-0 max-w-none font-display text-[clamp(22px,calc((100vw-48px)/10.8),36px)] md:max-w-[12em] md:text-[clamp(36px,6vw,84px)] leading-[1.02] font-semibold tracking-[-0.035em] text-main">
          Let&rsquo;s create something<br className="md:hidden" /> that grows with you.
        </h2>
        <div className="group pointer-events-none relative mt-2 w-fit">
          <button
            type="button"
            onClick={copyMail}
            aria-label={`Copy email address ${mail}`}
            className="pointer-events-auto relative inline-flex items-center gap-3 rounded-[2px] bg-white/[0.08] py-2.5 pr-3 pl-4 font-body text-[15px] text-main backdrop-blur-md outline-none transition-colors hover:bg-white/[0.14] focus-visible:bg-white/[0.14]"
          >
            <span className="relative">{mail}</span>
            <span className="relative flex h-4 w-[66px] shrink-0 items-center justify-end text-[12px] text-main/60" aria-live="polite">
              <AnimatePresence initial={false} mode="wait">
                {copied ? (
                  <motion.span
                    key="done"
                    className="flex items-center gap-1.5 text-main"
                    initial={{ opacity: 0, x: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -6, filter: 'blur(4px)' }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <motion.path d="M3 8.5 6.5 12 13 4.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.1, ease: EASE }} />
                    </svg>
                    Copied
                  </motion.span>
                ) : (
                  <motion.svg
                    key="copy"
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="currentColor"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.6, filter: 'blur(4px)' }}
                    transition={{ duration: 0.22, ease: EASE }}
                  >
                    <path d="M5 1.5h8.5V10H11V4H5V1.5Z" opacity=".55" />
                    <path d="M2.5 5h8.5v8.5H2.5V5Z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </button>
          <FrameSelection />
        </div>
      </div>

      {/* the dock fades out down here, so the footer carries the links like a normal footer */}
      <nav aria-label="Footer" className="pointer-events-auto flex gap-14 font-body max-md:w-full max-md:justify-center max-md:text-center md:mt-[55.6px] md:self-start md:pr-2">
        {FOOTER_LINKS.map((g) => (
          <div key={g.title} className="flex flex-col gap-3.5 max-md:items-center">
            <span className="text-[12px] leading-[18px] font-medium tracking-[0.08em] text-main/40 uppercase">{g.title}</span>
            {g.items.map(([label, href, section]) => {
              const web = /^(https?:|\/.*\.pdf$)/.test(href);
              return (
                <a
                  key={label}
                  href={href}
                  onClick={section ? (e) => goHome(e, section) : undefined}
                  target={web ? '_blank' : undefined}
                  rel={web ? 'noopener noreferrer' : undefined}
                  className="group relative w-fit text-[15px] leading-[22px] text-main/70 no-underline outline-none transition-colors hover:text-main focus-visible:text-main"
                >
                  {label}
                  <FrameSelection inset="-inset-x-2.5 -inset-y-1" />
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      </div>

      {/* the ground: full-bleed, no frame. Stems rise up behind the text above. */}
      <div
        ref={stageRef}
        className="relative z-0 -mt-[clamp(31px,3.8vw,55px)] h-[clamp(240px,min(32vw,44svh),460px)] w-full touch-pan-y"
      >
        <canvas
          ref={cvRef}
          aria-hidden="true"
          className="absolute inset-0 block size-full"
          style={{ touchAction: 'pan-y', imageRendering: 'pixelated' }}
        />
      </div>

      {/* sign-off: floats over the grass in two small pills, so the plants own the very bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-end justify-between px-[clamp(12px,2.5vw,28px)] font-body text-[13px] text-main/80 max-md:bottom-4">
        <span className="pointer-events-auto rounded-full bg-ink-0/20 border border-white/20 backdrop-blur-[6px] backdrop-saturate-125 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_14px_rgba(0,0,0,0.18)] [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] px-3 py-1.5 text-main/85">&copy; 2026 {profile.fullName}</span>
        <button
          type="button"
          onClick={() => (window.__lenis && !reduce ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }))}
          className="group pointer-events-auto relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-ink-0/20 border border-white/20 backdrop-blur-[6px] backdrop-saturate-125 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_14px_rgba(0,0,0,0.18)] [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] px-3 py-1.5 font-medium text-main/70 outline-none transition-[color,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/45 hover:bg-ink-0/50 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_22px_rgba(0,0,0,0.28)] focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-[18deg] will-change-transform bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[320%] group-hover:opacity-100" />
          <span className="relative z-10 [transform:translateZ(0)] [backface-visibility:hidden]">Back to top</span>
          <span aria-hidden="true" className="relative block size-3 overflow-hidden">
            {[0, 1].map((_, n) => (
              <svg key={n} viewBox="0 0 12 12" className={`absolute inset-0 size-3 will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${n ? 'translate-y-full group-hover:translate-y-0' : 'group-hover:-translate-y-full'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
              </svg>
            ))}
          </span>
        </button>
      </div>
    </footer>
  );
}