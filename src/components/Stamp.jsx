import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { APPEAR_EASE } from './Appear.jsx';

/**
 * The red seal (picture only). Behaviour is modelled on the floating 3D pieces in the
 * td-royfolio Framer reference, which are built from three layered effects:
 *
 *   1. APPEAR  – opacity 0 -> 1 and scale 1.2 -> 1 (spring, bounce .2, 1.1s). Here it starts at
 *                `startAt`, the same moment as the intro paragraph, so the two arrive together.
 *   2. FLOAT   – a "mirror" loop: it eases out to an offset and back again, forever
 *                (3.5s for the lift, 5.2s for the tilt, ease [.44,0,.56,1]).
 *   3. SCROLL  – position is tied to scrollY (linear, not time-based) and run through the same
 *                stiff spring the reference uses (stiffness 400, damping 40, mass .1). Scrolling
 *                down carries the seal to the right edge; scrolling up returns it to its spot.
 *
 * Mount it directly inside the hero <section> (position: relative):
 *   <Stamp reduce={reduce} startAt={DRAG_DONE + 0.2} />
 */
const SRC = '/stamp/stamp-final.webp';
const SCROLL_RANGE = 0.6; // the move completes after this fraction of a viewport of scrolling
const MAX_TRAVEL = 120; // px, the most the seal slides sideways on scroll (it stops at the edge if that is nearer)
const TUCK = 0.3; // fraction of the seal that slides past the right edge when scrolled away
const LIFT = 24; // px the seal also drifts upward while scrolling away (minimum)
const LIFT_RATIO = 0.2; // ...and it grows to this fraction of the horizontal trip
const LIFT_MAX = 72; // px cap
const REST_ROTATE = -6; // deg, resting tilt
const SOFT = [0.44, 0, 0.56, 1]; // the reference's loop easing

export default function Stamp({ reduce, startAt = 0.2 }) {
  const box = useRef(null);
  const mountedAt = useRef(performance.now());
  // null until the picture is decoded; then the time left until `startAt`, so it never pops in
  // half-loaded and still lands exactly with the text.
  const [delay, setDelay] = useState(null);

  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = SRC;
    const done = () => {
      if (!alive) return;
      const elapsed = (performance.now() - mountedAt.current) / 1000;
      setDelay(Math.max(0, startAt - elapsed));
    };
    (img.decode ? img.decode() : new Promise((r) => (img.onload = r))).then(done, done);
    return () => {
      alive = false;
    };
  }, [startAt]);

  // ---- scroll-linked position (reversible) -------------------------------------------------
  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (v) => Math.min(1, Math.max(0, v / (window.innerHeight * SCROLL_RANGE))));
  const progress = useSpring(raw, { stiffness: 400, damping: 40, mass: 0.1 });
  // distance to the right edge, measured from the resting box (the outer box is never transformed)
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
    return (tc.current = Math.min(MAX_TRAVEL, document.documentElement.clientWidth - r.right + TUCK * r.width));
  };
  const x = useTransform(progress, (p) => p * travel());
  // the upward drift scales with the trip, so the arc keeps the same shape wherever the seal rests
  const y = useTransform(progress, (p) => p * -Math.min(LIFT_MAX, Math.max(LIFT, travel() * LIFT_RATIO)));
  const spin = useTransform(progress, (p) => p * 10);

  const shown = delay !== null;
  const d = delay ?? 0;

  return (
    // blend on the outer wrapper so the picture's white multiplies away against the page
    <div
      ref={box}
      aria-hidden="true"
      className="pointer-events-none absolute right-[clamp(12px,4vw,72px)] bottom-32 z-0 size-[clamp(72px,13vw,150px)] md:top-[46%] md:right-auto md:bottom-auto md:left-[min(calc(50%_+_2.115*clamp(60px,16vw,200px)_+_64px),calc(75%_+_1.0575*clamp(60px,16vw,200px)_-_var(--s)/2))] md:[--s:clamp(72px,min(13vw,calc(16.16vw_-_32px)),150px)] md:size-[var(--s)] md:-translate-y-1/2"
    >
      {/* 3. scroll */}
      <motion.div className="size-full" style={reduce ? { rotate: REST_ROTATE } : { x, y, rotate: spin }}>
        {/* 1. appear (lands together with the intro text) */}
        <motion.div
          className="size-full"
          initial={reduce ? false : { opacity: 0.001, scale: 1.2 }}
          animate={reduce || shown ? { opacity: 1, scale: 1 } : { opacity: 0.001, scale: 1.2 }}
          transition={{
            opacity: { delay: d, duration: 0.6, ease: APPEAR_EASE },
            scale: { delay: d, type: 'spring', bounce: 0.2, duration: 1.1 },
          }}
        >
          {/* 2. float (mirror loop, starts once the appear has settled) */}
          <motion.div
            className="size-full"
            initial={{ y: 0, rotate: REST_ROTATE }}
            animate={reduce || !shown ? { y: 0, rotate: REST_ROTATE } : { y: -12, rotate: -2 }}
            transition={{
              y: { delay: d + 0.7, duration: 3.5, ease: SOFT, repeat: Infinity, repeatType: 'mirror' },
              rotate: { delay: d + 1.0, duration: 5.2, ease: SOFT, repeat: Infinity, repeatType: 'mirror' },
            }}
          >
            <img src={SRC} alt="" draggable="false" decoding="async" className="size-full object-contain select-none" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}