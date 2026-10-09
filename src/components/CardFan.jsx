import { motion } from 'framer-motion';

/**
 * Six project cards fanned out under the hero intro.
 *
 * Choreography: the top card rises from below to the fan's centre and, before it has fully stopped,
 * starts sliding to the right end. The cards beneath it follow immediately in a tight trail, each
 * spreading out to its own spot on the left, like a deck being flicked across a table.
 *
 * ---------------------------------------------------------------------------------------------
 *  TWEAK EACH CARD HERE  (order = left -> right; the LAST card is the top one that arrives first)
 *    rot : tilt in degrees (negative = counter-clockwise)
 *    y   : vertical offset in px (positive = lower)
 *    dx  : horizontal nudge as a fraction of the card width (0.1 = 10% of a card to the right)
 * ---------------------------------------------------------------------------------------------
 */
const CARDS = [
  { src: '/cards/c1.webp', alt: 'The Secure Lancer website', rot: -6.3, y: 22, dx: 0 },
  { src: '/cards/c2.webp', alt: 'Quora+ subscription flow', rot: -4, y: -2, dx: 0 },
  { src: '/cards/c3.webp', alt: 'Fitness app with Pokemon companions', rot: -1, y: 5, dx: 0 },
  { src: '/cards/c4.webp', alt: 'Crunchyroll mobile home', rot: 0, y: 0, dx: 0 },
  { src: '/cards/c5.webp', alt: 'Checkout flow', rot: 0, y: 7, dx: 0 },
  { src: '/cards/c6.webp', alt: 'Analytics dashboard', rot: 0, y: 38, dx: 0 },
];

const STEP = 0.74; // spacing between cards as a fraction of card width (1 = no overlap, lower = more overlap)

// timing (seconds)
const RISE = 0.95; // top card: bottom -> centre
const SLIDE_AT = 0.5; // top card starts sliding right this long after it starts rising (overlaps the rise's tail)
const SLIDE = 1.05; // duration of every slide / spread
const TRAIL_AT = 0.05; // first trailing card starts this long after the top card starts sliding
const TRAIL_GAP = 0.06; // stagger between trailing cards

const RISE_EASE = [0.22, 1, 0.36, 1];
const SPREAD_EASE = [0.16, 1, 0.3, 1]; // fast start, long soft landing

export default function CardFan({ reduce, startAt = 1.9 }) {
  const last = CARDS.length - 1;
  const slideStart = startAt + SLIDE_AT;

  return (
    <div
      aria-label="Selected work previews"
      className="relative mx-auto mt-14 md:mt-16"
      style={{
        '--w': 'min(210px, 18.5vw)',
        width: `calc(var(--w) * ${1 + last * STEP})`,
        height: 'calc(var(--w) / 1.4234 + 48px)',
      }}
    >
      {CARDS.map((c, i) => {
        const isTop = i === last;
        const order = last - 1 - i; // 0 = first card to trail the top one
        // start on the fan's centre line, whatever this card's final spot is
        const fromCentre = `${((last / 2) * STEP - i * STEP - c.dx) * 100}%`;

        const slide = (delay) => ({ delay, duration: SLIDE, ease: SPREAD_EASE });

        const initial = isTop
          ? { x: fromCentre, y: '140%', rotate: 0, opacity: 0 }
          : { x: fromCentre, y: '0%', rotate: 0, opacity: 0 };

        const animate = { x: '0%', y: '0%', rotate: c.rot, opacity: 1 };

        const transition = isTop
          ? {
              y: { delay: startAt, duration: RISE, ease: RISE_EASE },
              opacity: { delay: startAt, duration: 0.3, ease: 'linear' },
              x: slide(slideStart),
              rotate: slide(slideStart),
            }
          : (() => {
              const d = slideStart + TRAIL_AT + order * TRAIL_GAP;
              return { opacity: { delay: d, duration: 0.15, ease: 'linear' }, x: slide(d), rotate: slide(d), y: { duration: 0 } };
            })();

        return (
          <motion.img
            key={c.src}
            src={c.src}
            alt={c.alt}
            draggable={false}
            className="absolute w-[var(--w)] rounded-[10px] object-cover shadow-[0_1px_2px_rgba(15,28,46,0.12),0_10px_24px_-6px_rgba(15,28,46,0.28)] ring-1 ring-black/5 md:rounded-[14px]"
            style={{
              zIndex: i + 1,
              left: `calc(var(--w) * ${i * STEP + c.dx})`,
              top: c.y,
              aspectRatio: '1.4234',
              willChange: 'transform, opacity',
            }}
            initial={reduce ? false : initial}
            animate={animate}
            transition={transition}
          />
        );
      })}
    </div>
  );
}