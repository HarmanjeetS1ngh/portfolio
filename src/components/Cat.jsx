import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { APPEAR_EASE } from './Appear.jsx';

/**
 * Lucky cat (looping video). Same three layers as Stamp, mirrored to the hero's left:
 *   1. SCROLL - tied to scrollY, smoothed by the shared spring; drifts left and up, fully reversible.
 *   2. APPEAR - opacity 0 -> 1, scale 1.2 -> 1, once the video can play (so it never pops in half-loaded).
 *   3. FLOAT  - mirror loop on y and rotate.
 * Mount inside the hero <section>: <Cat reduce={reduce} startAt={DRAG_DONE + 0.5} />
 */
const SCROLL_RANGE = 0.6;
const MAX_TRAVEL = 120;
const TUCK = 0.3;
const LIFT = 24;
const LIFT_RATIO = 0.2;
const LIFT_MAX = 72;
const REST_ROTATE = 6;
const SOFT = [0.44, 0, 0.56, 1];

export default function Cat({ reduce, startAt = 0.2 }) {
  const box = useRef(null);
  const mountedAt = useRef(performance.now());
  const [delay, setDelay] = useState(null);
  const vid = useRef(null);
  // stop decoding the video while the hero is off-screen (it kept eating frame time through About / footer)
  useEffect(() => {
    const el = box.current;
    if (!el || reduce) return undefined;
    const io = new IntersectionObserver(([e]) => {
      const v = vid.current;
      if (!v) return;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const onReady = () => {
    if (delay !== null) return;
    const elapsed = (performance.now() - mountedAt.current) / 1000;
    setDelay(Math.max(0, startAt - elapsed));
  };

  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (v) => Math.min(1, Math.max(0, v / (window.innerHeight * SCROLL_RANGE))));
  const progress = useSpring(raw, { stiffness: 400, damping: 40, mass: 0.1 });
  const tc = useRef(null); // cached travel distance: no layout read per scroll frame
  useEffect(() => {
    const inv = () => { tc.current = null; };
    const ro = new ResizeObserver(inv);
    if (box.current) ro.observe(box.current);
    addEventListener('resize', inv);
    return () => { ro.disconnect(); removeEventListener('resize', inv); };
  }, []);
  const travel = () => {
    if (tc.current != null) return tc.current;
    const r = box.current?.getBoundingClientRect();
    if (!r) return 0;
    return (tc.current = Math.min(MAX_TRAVEL, r.left + TUCK * r.width));
  };
  const x = useTransform(progress, (p) => p * -travel());
  const y = useTransform(progress, (p) => p * -Math.min(LIFT_MAX, Math.max(LIFT, travel() * LIFT_RATIO)));
  const spin = useTransform(progress, (p) => p * -10);

  const shown = delay !== null;
  const d = delay ?? 0;

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-32 left-[clamp(12px,4vw,72px)] z-0 size-[clamp(72px,13vw,150px)] md:top-[64%] md:bottom-auto md:left-auto md:right-[min(calc(50%_+_2.115*clamp(60px,16vw,200px)_+_64px),calc(75%_+_1.0575*clamp(60px,16vw,200px)_-_var(--s)/2))] md:[--s:clamp(72px,min(13vw,calc(16.16vw_-_32px)),150px)] md:size-[var(--s)] md:-translate-y-1/2"
    >
      <motion.div className="size-full" style={reduce ? { rotate: REST_ROTATE } : { x, y, rotate: spin }}>
        <motion.div
          className="size-full"
          initial={reduce ? false : { opacity: 0.001, scale: 1.2 }}
          animate={reduce || shown ? { opacity: 1, scale: 1 } : { opacity: 0.001, scale: 1.2 }}
          transition={{
            opacity: { delay: d, duration: 0.6, ease: APPEAR_EASE },
            scale: { delay: d, type: 'spring', bounce: 0.2, duration: 1.1 },
          }}
        >
          <motion.div
            className="size-full"
            initial={{ y: 0, rotate: REST_ROTATE }}
            animate={reduce || !shown ? { y: 0, rotate: REST_ROTATE } : { y: -12, rotate: 2 }}
            transition={{
              y: { delay: d + 0.7, duration: 3.5, ease: SOFT, repeat: Infinity, repeatType: 'mirror' },
              rotate: { delay: d + 1.0, duration: 5.2, ease: SOFT, repeat: Infinity, repeatType: 'mirror' },
            }}
          >
            <video
              ref={vid}
              muted
              loop
              playsInline
              autoPlay={!reduce}
              preload="metadata"
              onCanPlay={onReady}
              onLoadedData={onReady}
              className="size-full object-contain select-none"
            >
              <source src="/cat/cat.webm" type="video/webm" />
              <source src="/cat/cat.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}