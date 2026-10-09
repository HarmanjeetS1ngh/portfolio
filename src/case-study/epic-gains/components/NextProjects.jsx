import { motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon.jsx';
import { SectionDivider } from './ui.jsx';
import { nextProjects } from '../content.js';

/**
 * "Next projects" navigation: just the cartridge image, each one a real link.
 * Hover / keyboard focus lifts the cartridge like it's being pulled out of a console;
 * the lift is skipped for visitors who prefer reduced motion. Falls back to a plain
 * placeholder tile (with the project title) when a cartridge asset isn't ready yet.
 */
function ProjectCard({ project }) {
  const reduce = useReducedMotion();
  const { title, href, image } = project;

  return (
    <a
      href={href}
      aria-label={`Next project: ${title} case study`}
      className="flex justify-center rounded-2xl no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {image?.src ? (
        <motion.img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          whileHover={reduce ? undefined : { y: -10, rotate: -1.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="block h-auto w-full max-w-[340px]"
        />
      ) : (
        <motion.div
          whileHover={reduce ? undefined : { y: -10, rotate: -1.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex aspect-[682/724] w-full max-w-[340px] flex-col items-center justify-center gap-3 rounded-xl bg-placeholder p-6 text-center"
        >
          <Icon name="Image" size={32} className="text-ink-3" />
          <span className="font-mono-ui text-[13px] font-bold tracking-[0.02em] text-ink-2">{title}</span>
        </motion.div>
      )}
    </a>
  );
}

export default function NextProjects() {
  return (
    <div id="next-projects">
      <SectionDivider label="Next Projects" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {nextProjects.map((p) => (
          <ProjectCard key={p.title} project={p} />
        ))}
      </div>
    </div>
  );
}
