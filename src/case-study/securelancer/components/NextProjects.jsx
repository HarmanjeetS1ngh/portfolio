import { motion, useReducedMotion } from 'framer-motion';
import { SectionDivider } from './ui.jsx';
import { nextProjects } from '../content.js';

/**
 * "Next projects" navigation: just the cartridge image, each one a real link.
 * Hover / keyboard focus lifts the cartridge like it's being pulled out of a console;
 * the lift is skipped for visitors who prefer reduced motion.
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
