import { useEffect, useState } from 'react';

/**
 * Returns `[hidden, reveal]`. `hidden` is true while something should be hidden: it hides as soon as the visitor
 * scrolls down, and comes back only after a slight scroll up (`showAfterUp` px).
 * Always visible near the top of the page (`topOffset` px). Reacts to real scroll
 * distance (an accumulator that resets when direction changes), so tiny jitters
 * from a trackpad or touch don't flip it back and forth. `reveal()` shows it right away
 * (e.g. when a keyboard user tabs onto it).
 */
export default function useHideOnScrollDown({ topOffset = 80, hideAfterDown = 4, showAfterUp = 8 } = {}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let travelled = 0; // signed distance scrolled in the current direction
    let queued = false;

    const update = () => {
      queued = false;
      // clamp to the real scroll range so iOS rubber-banding at the edges isn't read as a scroll
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(Math.max(0, window.scrollY), maxY);
      const delta = y - lastY;
      lastY = y;

      if (y <= topOffset) {
        travelled = 0;
        setHidden(false);
        return;
      }
      if (delta === 0) return;

      if (Math.sign(delta) !== Math.sign(travelled)) travelled = 0;
      travelled += delta;

      if (travelled > hideAfterDown) setHidden(true);
      else if (travelled < -showAfterUp) setHidden(false);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [topOffset, hideAfterDown, showAfterUp]);

  return [hidden, () => setHidden(false)];
}
