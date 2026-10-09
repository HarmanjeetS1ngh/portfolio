import { useRef } from 'react';
import { motion } from 'framer-motion';
import { APPEAR_EASE } from './Appear.jsx';
import { projects } from '../config.js';

/**
 * Card look taken from the Jotter "Work" cards: 4px-radius image, the same
 * stacked soft shadow, a slight tilt, and the title with a small pill beside it.
 */
const JOTTER_SHADOW = [
  '0.7px 0.8px 1.9px -0.19px rgba(0,0,0,0.02)',
  '1.6px 2px 4.6px -0.38px rgba(0,0,0,0.03)',
  '2.9px 3.6px 8.4px -0.56px rgba(0,0,0,0.03)',
  '4.8px 6px 13.9px -0.75px rgba(0,0,0,0.03)',
  '7.8px 9.7px 22.5px -0.94px rgba(0,0,0,0.03)',
  '12.8px 16px 36.8px -1.13px rgba(0,0,0,0.03)',
  '22px 27.5px 63.3px -1.31px rgba(0,0,0,0.04)',
  '40px 50px 115px -1.5px rgba(0,0,0,0.06)',
].join(', ');

const SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 };

function Cover({ project }) {
  const [from, to] = project.tint;
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[4px] bg-placeholder"
      style={{ boxShadow: JOTTER_SHADOW }}
    >
      {project.image ? (
        <img loading="lazy" decoding="async"
          src={project.image}
          alt=""
          draggable={false}
          className="block size-full select-none object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex size-full items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          <span className="font-display text-[clamp(56px,8vw,96px)] leading-none font-extrabold tracking-[-0.04em] text-white/85 select-none">
            {project.title.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}

function WorkCard({ project, index, className = '' }) {
  // Lets the card be dragged around like on Jotter without the drop
  // counting as a click on the link underneath.
  const dragged = useRef(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.12}
      whileDrag={{ scale: 1.04, zIndex: 20 }}
      onDragStart={() => (dragged.current = true)}
      onDragEnd={() => setTimeout(() => (dragged.current = false), 0)}
      className={`relative w-[min(86vw,340px)] touch-pan-y md:w-full md:max-w-[340px] ${className}`}
    >
      <motion.a
        href={project.href}
        draggable={false}
        onClick={(e) => dragged.current && e.preventDefault()}
        initial={{ opacity: 0.001, y: 24, rotate: 0 }}
        whileInView={{ opacity: 1, y: 0, rotate: project.rotate }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ delay: index * 0.2, duration: 0.6, ease: APPEAR_EASE, type: 'tween' }}
        whileHover={{ y: -6, transition: SPRING }}
        className="group block no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-tools-blue"
      >
        <Cover project={project} />
        <span className="mt-4 flex items-center gap-2.5">
          <span className="font-display text-xl font-bold tracking-[-0.01em] text-ink-0">
            {project.title}
          </span>
          <span className="rounded-full border border-line bg-surface-1 px-2.5 py-1 font-body text-xs leading-none font-semibold text-ink-2">
            {project.tag}
          </span>
        </span>
      </motion.a>
    </motion.div>
  );
}

// Staggered offsets so the cards feel scattered across a desk, not in a grid.
const OFFSETS = ['md:mt-0 md:justify-self-start', 'md:mt-20 md:justify-self-center', 'md:mt-6 md:justify-self-end'];

export default function SelectedWork() {
  return (
    <section id="work" className="work-grid relative scroll-mt-4 overflow-hidden px-6 pt-12 pb-44 md:pt-32 md:pb-52">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: APPEAR_EASE, type: 'tween' }}
            className="font-mono-ui text-xs font-bold tracking-[0.04em] text-ink-2 uppercase md:text-sm"
          >
            Selected work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: APPEAR_EASE, type: 'tween' }}
            className="mt-4 max-w-[12em] font-display text-[clamp(34px,5.6vw,68px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance text-ink-0"
          >
            A few things I&rsquo;ve designed and built.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0.001, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6, ease: APPEAR_EASE, type: 'tween' }}
            className="mt-4 font-body text-base text-ink-2 md:text-lg"
          >
            Open whatever catches your eye. Or drag things around, they move.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 justify-items-center gap-14 md:mt-24 md:grid-cols-3 md:items-start md:gap-8">
          {projects.map((project, i) => (
            <WorkCard key={project.title} project={project} index={i} className={OFFSETS[i % OFFSETS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}