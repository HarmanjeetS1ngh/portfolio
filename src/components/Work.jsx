import { motion, useReducedMotion } from 'framer-motion';
import { projects, workRange } from '../config.js';
import { APPEAR_EASE } from './Appear.jsx';

/**
 * "Selected work" — modelled on the td-royfolio Framer site:
 *  - 6-column grid, 20px gaps: row 1 = one full-width card (span 6, ratio 1.54),
 *    row 2 = wide (span 4, ratio 1.27) + tall (span 2, ratio .618), so both end up the same height.
 *  - Image starts zoomed (scale 1.15) and settles to 1 as the card scrolls into view
 *    (spring, stiffness 400 / damping 40).
 *  - Hover: image scale 1.02 + brightness 1.05, shadow deepens (spring bounce .2, .6s).
 *  - Frosted label tab (blur 10px) pinned bottom-left with a rounded top-right corner.
 *  - 2 columns at <=810px, 1 column at <=520px.
 */
const SPRING_IN = { type: 'spring', stiffness: 400, damping: 40, mass: 1 };
const SPRING_HOVER = { type: 'spring', bounce: 0.2, duration: 0.6 };

const SHADOW_REST =
  '0.24px 0.48px 0.97px -1.17px rgba(0,0,0,0.08), 0.92px 1.83px 3.68px -2.33px rgba(0,0,0,0.07), 4px 8px 16.1px -3.5px rgba(0,0,0,0.04)';
const SHADOW_HOVER =
  '0.24px 0.48px 1.62px 0px rgba(0,0,0,0.01), 0.92px 1.83px 6.14px 0px rgba(0,0,0,0.03), 4px 8px 26.83px 0px rgba(0,0,0,0.12)';

function Card({ project, index }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={project.href}
      aria-label={`${project.title} — ${project.blurb}`}
      className={`work-card group block no-underline ${project.span === 6 ? 'work-card--full' : project.span === 4 ? 'work-card--wide' : 'work-card--tall'}`}
      initial={reduce ? false : { opacity: 0.001, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: APPEAR_EASE, delay: index % 2 === 1 ? 0.15 : 0 }}
    >
      <motion.div
        className="work-media relative w-full overflow-hidden rounded-[12px] border-2 border-white"
        style={{ '--work-ratio': project.ratio, boxShadow: SHADOW_REST }}
        whileHover={{ boxShadow: SHADOW_HOVER }}
        transition={SPRING_HOVER}
      >
        {/* image: zoom-out on scroll-in, then a subtle zoom + brighten on hover */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="size-full"
            initial={reduce ? false : { scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={SPRING_IN}
          >
            <img
              src={project.image}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              className="work-img block size-full object-cover"
            />
          </motion.div>
          {/* optional hero mockup, a separate layer above the background so it can carry its own drop shadow */}
          {project.mockup && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <img
                src={project.mockup}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="work-mockup block select-none"
                style={project.mockupWidth ? { width: project.mockupWidth, height: 'auto' } : { height: project.mockupHeight || '78%', width: 'auto' }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* caption: description on the left, project · type year on the right */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1">
        <span data-cursor="text" className="font-display text-lg leading-snug font-semibold tracking-[-0.01em] text-ink-0 md:text-xl">
          {project.blurb}
        </span>
        <span data-cursor="text" className="font-body text-sm whitespace-nowrap text-ink-2/80 md:text-base">
          {project.title} · {project.type} {project.year}
        </span>
      </div>
    </motion.a>
  );
}

export default function Work({ className = 'pt-16 md:pt-32' }) {
  const reduce = useReducedMotion();
  const fade = (delay) => ({
    initial: reduce ? false : { opacity: 0.001, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 0.6, ease: APPEAR_EASE, delay },
  });

  return (
    <section id="selected-work" className={`relative mx-auto flex w-full max-w-[1000px] flex-col items-center gap-8 pb-44 ${className}`}>
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <motion.h2
          {...fade(0)}
          className="font-display text-[clamp(28px,3.4vw,36px)] leading-[1.3] font-semibold tracking-[-0.03em] text-ink-0"
        >
          Selected work
        </motion.h2>
        <motion.p {...fade(0.15)} className="font-body text-base text-ink-2">
          {workRange}
        </motion.p>
      </div>

      <div className="work-grid w-full p-6">
        {projects.map((p, i) => (
          <Card key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}