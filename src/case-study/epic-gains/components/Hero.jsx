import { motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon.jsx';
import { meta } from '../content.js';
import useHideOnScrollDown from '../../../useHideOnScrollDown.js';

/** Back to the home page's Work section. */
function goBackToWork(e) {
  e.preventDefault();
  window.location.hash = '#/';
  setTimeout(() => document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

/** Overlapping tool icons (Figma / Claude), like the original stack */
function ToolStack() {
  const styles = [
    'shadow-[inset_0_0_0_2px_var(--color-line),0_2px_5px_rgba(0,0,0,0.06)]',
    'shadow-[inset_0_0_0_2px_var(--color-line),0_2px_5px_rgba(0,0,0,0.06)]',
  ];
  return (
    <div className="mt-1 flex items-center">
      {meta.tools.map((t, i) => (
        <div
          key={t.title}
          title={t.title}
          style={{ zIndex: meta.tools.length - i }}
          className={`relative -mr-3 flex size-11 items-center justify-center overflow-hidden rounded-xl border-2 border-main bg-white ${styles[i] ?? ''}`}
        >
          <img src={t.src} alt={`${t.title} logo`} className="size-6 object-contain" />
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [hideBack, revealBack] = useHideOnScrollDown();
  const reduce = useReducedMotion();

  return (
    <>
      {/* Sticky: the Back button stays pinned at its original spot while the page scrolls.
          It slides away when the visitor scrolls down and returns after a slight scroll up.
          The full-width nav ignores pointer events so it never blocks clicks on the content
          beneath it; only the button itself is clickable. */}
      <nav className="pointer-events-none sticky top-6 z-50 w-screen ml-[calc(50%-50vw)] px-6 md:top-10 md:px-12 lg:px-16">
        <motion.a
          href="#/"
          onClick={goBackToWork}
          animate={{ opacity: hideBack ? 0 : 1, y: hideBack ? -20 : 0 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: 'easeInOut' }}
          style={{ pointerEvents: hideBack ? 'none' : 'auto' }}
          onFocus={revealBack} // keyboard users tabbing onto the button always get to see it
          className="group pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 shadow-[0_4px_14px_rgba(15,28,46,0.22)] font-mono-ui text-xs leading-tight font-bold tracking-[0.04em] text-main uppercase no-underline transition-colors hover:bg-ink-0 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-sm"
        >
          <Icon
            name="ArrowLeft"
            size={16}
            strokeWidth={2.25}
            className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
          />
          {meta.breadcrumb.label}
        </motion.a>
      </nav>

      {/* Hero: the manga-collage background bleeds full-width behind the content column
          (same full-viewport-width technique as .hero-bleed), and the player mockup sits
          centered on top of it. width/height (the file's real pixel size) reserve the
          box up front so nothing collapses/jumps into place while it loads. */}
      <div className="epic-hero-bleed relative -mt-3 mb-6 flex items-end justify-center pt-10 pb-4 md:mt-8 md:mb-10 md:pt-4 md:pb-10">
        <motion.img
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          src="/work/epic-gains/hero-element.webp"
          alt={meta.heroImage.alt}
          width={800}
          height={1636}
          loading="eager"
          decoding="async"
          className="relative z-10 mx-auto block h-auto w-full max-w-[min(220px,28svh)] px-0 md:max-w-[320px]"
        />
      </div>

      <header>
        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="mb-6 font-display text-4xl leading-[1.1] font-extrabold tracking-[-0.02em] text-ink-0 md:text-[64px] md:leading-[1.05]"
        >
          {meta.title}
        </motion.h1>
        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="mb-12 font-body text-lg leading-[1.4] font-medium md:text-2xl"
        >
          {meta.subtitle}
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-3 md:gap-10"
        >
          {meta.rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-2">
              <span className="font-mono-ui text-xs leading-normal tracking-[0.04em] text-ink-2 uppercase md:text-sm">
                {row.label}
              </span>
              {row.values.map((v) => (
                <span key={v} className="font-mono-ui text-xs leading-normal tracking-[0.04em] md:text-sm">
                  {v}
                </span>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <span className="font-mono-ui text-xs leading-normal tracking-[0.04em] text-ink-2 uppercase md:text-sm">
              Tools
            </span>
            <ToolStack />
          </div>
        </motion.div>
      </header>
    </>
  );
}