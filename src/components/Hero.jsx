import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Appear from './Appear.jsx';
import Stamp from './Stamp.jsx';
import Clock from './Clock.jsx';
import Cat from './Cat.jsx';
import { profile } from '../config.js';

/**
 * Hero: the name is laid out like a layer in a design tool (selection frame,
 * handles, live W × H).
 */
// frame is "dragged out" like a Figma marquee: cursor goes top-left -> bottom-right, then it's selected
const DRAG_AT = 0.75; // s: right after the letters have landed
const DRAG_DUR = 0.65;
const DRAG_DONE = DRAG_AT + DRAG_DUR;
const DRAG_EASE = [0.65, 0, 0.35, 1];
const HANDLES = [[0, 0], [50, 0], [100, 0], [0, 50], [100, 50], [0, 100], [50, 100], [100, 100]];

export default function Hero() {
  const reduce = useReducedMotion();
  const frameRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // real, live dimensions in the label
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Groovy's glyphs run from the baseline up to 0.708em with nothing below, but its line box
  // reserves 0.25em of descender space. leading-[0.708] makes the h1 exactly as tall as the ink,
  // and top-[0.104em] on each letter slides the ink down into that box, so the selection
  // frame has the same padding above and below.
  return (
    <section className="hero-wash relative min-h-[86svh] overflow-hidden md:min-h-svh">
      <div aria-hidden="true" className="hero-grid absolute inset-0" />

      {/* the red seal: floats at the hero's right side; lands together with the intro text below */}
      <Stamp reduce={reduce} startAt={DRAG_DONE + 0.2} />

      {/* hometown clock: the seal's counterpart on the left; lands a beat after it */}
      <Clock reduce={reduce} startAt={DRAG_DONE + 0.35} />

      {/* lucky cat: the seal's mirror on the lower left; lands last */}
      <Cat reduce={reduce} startAt={DRAG_DONE + 0.5} />

      <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-[1100px] flex-col items-center justify-center px-6 pt-16 pb-32 text-center md:min-h-svh md:pb-44">
        {/* name as a selected layer */}
        <div className="relative">
          <h1
            ref={frameRef}
            aria-label={profile.name}
            className="wordmark-stroke m-0 font-groovy text-[clamp(60px,16vw,200px)] leading-[0.708] font-normal text-ink-0"
          >
            {[...profile.name].map((ch, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="relative top-[0.104em] inline-block"
                initial={reduce ? false : { y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24, delay: 0.1 + i * 0.05 }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>

          {/* selection frame: dragged out from the top-left corner by a cursor, then handles appear */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-3">
            <motion.div
              className="absolute top-0 left-0 border border-[#0055B3]"
              initial={reduce ? false : { width: '0%', height: '0%', backgroundColor: 'rgba(0,85,179,0.08)' }}
              animate={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,85,179,0)' }}
              transition={{
                width: { delay: DRAG_AT, duration: DRAG_DUR, ease: DRAG_EASE },
                height: { delay: DRAG_AT, duration: DRAG_DUR, ease: DRAG_EASE },
                backgroundColor: { delay: DRAG_DONE, duration: 0.3 },
              }}
            >
              {HANDLES.map(([l, t], i) => (
                <motion.span
                  key={i}
                  className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-[#0055B3] bg-white"
                  style={{ left: `${l}%`, top: `${t}%` }}
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: DRAG_DONE + i * 0.03, type: 'spring', stiffness: 500, damping: 20 }}
                />
              ))}

              {/* the cursor rides the bottom-right corner while dragging, then lets go */}
              {!reduce && (
                <motion.svg
                  viewBox="0 0 24 24"
                  className="absolute top-full left-full size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ delay: DRAG_AT - 0.05, duration: DRAG_DUR + 0.45, times: [0, 0.04, DRAG_DUR / (DRAG_DUR + 0.45), 1] }}
                >
                  <path d="M3 2 L3 18 L7.2 14 L10 20.5 L12.6 19.4 L9.9 13 L15.5 13 Z" fill="#09090b" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
                </motion.svg>
              )}
            </motion.div>
          </div>

          <Appear delay={DRAG_DONE + 0.1} className="absolute top-full left-1/2 mt-6 -translate-x-1/2 rounded-[4px] bg-[#0055B3] px-2 py-1 font-mono-ui text-[11px] leading-none whitespace-nowrap text-white">
            {size.w} × {size.h}
          </Appear>
        </div>

        {/* intro: the role is "selected" like text in an editor, once the frame has landed */}
        <Appear
          as="p"
          delay={DRAG_DONE + 0.2}
          className="mt-20 max-w-[30em] font-body text-[clamp(16px,2.05vw,23px)] leading-snug text-ink-2 md:mt-24"
        >
          <span className="font-semibold text-ink-0">{profile.fullName}</span> is a{' '}
          {/* the comma lives in the same no-wrap box as the role, so it never gets orphaned onto the next line */}
          <span className="whitespace-nowrap">
            <span className="relative isolate inline-block font-semibold text-ink-0">
              <motion.span
                aria-hidden="true"
                className="absolute -inset-x-1 inset-y-0 -z-10 rounded-[3px] bg-accent/20"
                style={{ originX: 0 }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: DRAG_DONE + 0.9, duration: 0.5, ease: DRAG_EASE }}
              />
              {profile.role}
            </span>
            ,
          </span>{' '}
          {profile.tagline}
        </Appear>
      </div>
    </section>
  );
}