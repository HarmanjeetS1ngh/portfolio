import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon.jsx';

/**
 * Floating "back to top" button, pinned to the bottom-right of the viewport.
 * Appears only once the visitor reaches the Next Projects section, and scrolls
 * smoothly to the very top of the case study (instantly for visitors who
 * prefer reduced motion).
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // visible once the top of the Next Projects section has entered the viewport
    // (and stays visible below it, e.g. over the footer)
    const check = () => {
      const section = document.getElementById('next-projects');
      setVisible(!!section && section.getBoundingClientRect().top < window.innerHeight);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => (window.__lenis && !reduce ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }))}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex size-11 items-center justify-center rounded-full bg-ink text-main shadow-[0_4px_14px_rgba(15,28,46,0.22)] transition-colors hover:bg-ink-0 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:right-8 md:bottom-8 md:size-12"
        >
          <Icon name="ArrowUp" size={20} strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
