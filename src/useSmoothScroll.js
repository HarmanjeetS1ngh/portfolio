import Lenis from 'lenis';
import { frame, cancelFrame } from 'framer-motion';

/**
 * Smooth scrolling (Lenis), driven from Framer Motion's own frame loop instead of a second rAF:
 * Lenis moves the page first, then the scroll-linked springs (cat, stamp, clock) read that same
 * position in the same frame, so nothing trails the page by a frame. Touch stays native.
 * To switch it off, remove the call in main.jsx.
 */
export default function startSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
  window.__lenis = lenis; // used by the footer's "Back to top" and the scroll-linked components
  // hysteresis: lock hover work only while scrolling fast (see .fast-scroll in index.css)
  let fast = false;
  lenis.on('scroll', ({ velocity }) => {
    const v = Math.abs(velocity);
    if (!fast && v > 9) { fast = true; document.documentElement.classList.add('fast-scroll'); }
    else if (fast && v < 4) { fast = false; document.documentElement.classList.remove('fast-scroll'); }
  });
  const tick = ({ timestamp }) => lenis.raf(timestamp);
  frame.update(tick, true); // keepAlive, runs first in the frame
  return () => cancelFrame(tick);
}
