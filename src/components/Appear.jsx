import { motion, useReducedMotion } from 'framer-motion';

/**
 * The page transition used by jotter.framer.website, read straight out of its
 * published appear-animation data:
 *   initial  { opacity: 0.001, y: 24 }
 *   animate  { opacity: 1, y: 0 }
 *   tween    duration 0.6s, ease cubic-bezier(0.12, 0.23, 0.38, 1)
 *   stagger  delay 0 → 0.2 → 0.4 → 0.6 between blocks
 * Decorative pieces on the site settle into a small rotation (-3° / 2° / 3°)
 * with durations of 0.6–0.8s; pass `rotate` to get the same effect.
 *
 * Like the original there is no exit animation: a new page simply mounts and
 * plays this entrance again.
 */
export const APPEAR_EASE = [0.12, 0.23, 0.38, 1];

export default function Appear({
  as = 'div',
  delay = 0,
  duration = 0.6,
  rotate = 0,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? false : { opacity: 0.001, y: 24, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration, ease: APPEAR_EASE, type: 'tween' }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
