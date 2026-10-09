import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { hometown } from '../config.js';

/**
 * Location pill, replicated from the td-royfolio reference ("my location" instance).
 *
 * Reference behaviour, layer by layer (outermost first):
 *  1. SCROLL  - "onScrollTarget": the pill glides from rest to x:-70 / y:-70 while scrollY crosses a
 *               270px window that starts when the hero's bottom edge reaches the viewport bottom
 *               (reference trigger box: 270px tall, sitting directly under the hero). Smoothed with
 *               spring { stiffness 400, damping 40, mass 0.1 }. Fully reversible.
 *  2. APPEAR  - initial opacity ~0 + scale 1.2 -> 1, spring { bounce .2, duration 1.1 }.
 *  3. FLOAT   - y: 0 <-> -10, tween 3.5s, ease [.44,0,.56,1], infinite mirror.
 *  4. PILL    - #2d2d3b, radius 8, padding 12. Hover/focus mounts the 24h time under the city and the
 *               pill's own layout spring (bounce .2, .4s) grows it; overflow hidden clips the time.
 *
 * Position: on desktop (>= 1024px) it sits just off the top-left corner of the HARMAN wordmark
 * (the pill's bottom-right corner touches that corner, and it grows leftwards/downwards on hover so it
 * never covers the text). Below 1024px it sits above the wordmark's top-left, left-aligned.
 */

const PILL_SPRING = { type: 'spring', bounce: 0.2, duration: 0.4 };
const SCROLL_SPRING = { stiffness: 400, damping: 40, mass: 0.1 };
const SCROLL_DX = -70;
const SCROLL_DY = -70;
const SCROLL_WINDOW = 270; // px of scroll over which the move plays out

function readTime(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
}

function useTime(timeZone) {
  const [t, setT] = useState(() => readTime(timeZone));
  useEffect(() => {
    let id;
    const tick = () => {
      setT(readTime(timeZone));
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 4);
    };
    tick();
    return () => clearTimeout(id);
  }, [timeZone]);
  return t;
}

/** offsetLeft/offsetTop of `el` inside `ancestor` (ignores transforms, so the intro's entrance scale doesn't matter) */
function offsetIn(el, ancestor) {
  let x = 0;
  let y = 0;
  for (let n = el; n && n !== ancestor; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

function useIntroCorner(root) {
  const [pos, setPos] = useState(null);
  useLayoutEffect(() => {
    const section = root.current?.closest('section');
    const intro = section?.querySelector('h1'); // the HARMAN wordmark
    if (!section || !intro) return;
    const measure = () => {
            const { x, y } = offsetIn(intro, section);
      const above = window.innerWidth < 1024; // small screens: no room on the left, so sit above the wordmark's top-left, left-aligned
      setPos(above ? { left: x, top: y - 36, above } : { left: x - 36, top: y - 36, above }); // pill's bottom-right corner sits just off the wordmark's top-left (selection frame is 12px out)
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(intro);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [root]);
  return pos;
}

export default function Clock({ reduce, startAt = 0.2 }) {
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false); // was the pill already open when this press began?
  const time = useTime(hometown.timeZone);
  const pos = useIntroCorner(root);

  // ---- 1. scroll: 0 -> 1 across the 270px window that starts when the hero's bottom hits the viewport bottom
  const heroBottomRef = useRef(null);
  const roRef = useRef(null);
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (v) => {
    const section = root.current?.closest('section');
    if (!section) return 0;
    // cached: reading layout every scroll frame forces a sync reflow; refreshed on resize / section size change
    let heroBottom = heroBottomRef.current;
    if (heroBottom == null) {
      heroBottom = section.getBoundingClientRect().bottom + window.scrollY;
      heroBottomRef.current = heroBottom;
      if (!roRef.current) {
        const inv = () => { heroBottomRef.current = null; };
        roRef.current = new ResizeObserver(inv);
        roRef.current.observe(section);
        roRef.current.observe(document.body);
        addEventListener('resize', inv);
      }
    }
    const c = heroBottom - window.innerHeight;
    const start = Math.max(c, 0);
    const end = Math.max(c + SCROLL_WINDOW, 0);
    if (end <= start) return v >= end ? 1 : 0;
    return Math.min(1, Math.max(0, (v - start) / (end - start)));
  });
  const smooth = useSpring(progress, SCROLL_SPRING);
  const x = useTransform(smooth, (p) => p * (pos?.above ? 0 : SCROLL_DX));
  const y = useTransform(smooth, (p) => p * SCROLL_DY);

  return (
    <div
      ref={root}
      className={`pointer-events-none absolute z-20 ${pos?.above ? '-translate-y-full' : pos ? '-translate-x-full -translate-y-full' : 'bottom-28 left-[31%] -translate-x-1/2'}`}
      style={pos ? { left: pos.left, top: pos.top } : undefined}
    >
      {/* 1. scroll */}
      <motion.div style={reduce ? undefined : { x, y }}>
        {/* 2. appear */}
        <motion.div
          initial={reduce ? false : { opacity: 0.001, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.1, delay: startAt }}
        >
          {/* 3. float */}
          <motion.div
            initial={{ y: 0 }}
            animate={reduce ? { y: 0 } : { y: -10 }}
            transition={{ y: { delay: startAt + 0.1, duration: 3.5, ease: [0.44, 0, 0.56, 1], repeat: Infinity, repeatType: 'mirror' } }}
          >
            {/* invisible copy of the resting pill: keeps the anchor box fixed while the real pill grows */}
            <div aria-hidden="true" className="invisible p-3 font-[Inter,system-ui,sans-serif] text-[12px] leading-[1.2] font-semibold whitespace-pre">
              {hometown.city}
            </div>

            {/* 4. pill */}
            <motion.div
              layout
              transition={PILL_SPRING}
              style={{ borderRadius: 8 }}
              role="group"
              aria-label={`${hometown.city} local time ${time}`}
              tabIndex={0}
              onHoverStart={() => setOpen(true)}
              onHoverEnd={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onPointerDown={(e) => (wasOpen.current = open && e.pointerType !== 'mouse')} // touch/pen only: mouse hover behaviour is untouched
              onClick={(e) => {
                // tapping the already-open pill collapses it (blur drops the focus that keeps it open on touch)
                if (wasOpen.current) {
                  setOpen(false);
                  e.currentTarget.blur();
                }
                wasOpen.current = false;
              }}
              className={`pointer-events-auto absolute top-0 ${pos?.above ? 'left-0' : 'right-0'} flex w-min cursor-pointer flex-col items-start justify-center gap-2 overflow-hidden bg-[#2d2d3b] p-3 font-[Inter,system-ui,sans-serif] text-white shadow-[0.3px_0.6px_0.7px_-0.8px_rgba(0,0,0,0.16),1px_1.9px_2.2px_-1.6px_rgba(0,0,0,0.15),2.6px_5.1px_5.7px_-2.4px_rgba(0,0,0,0.14),8px_16px_17.9px_-3.3px_rgba(0,0,0,0.09)] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-main`}
            >
              <motion.span layout transition={PILL_SPRING} className="text-[12px] leading-[1.2] font-semibold whitespace-pre">
                {hometown.city}
              </motion.span>
              {open && (
                <motion.span layout transition={PILL_SPRING} className="text-[13px] leading-none font-semibold whitespace-nowrap [font-variant-numeric:tabular-nums]">
                  {time}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}