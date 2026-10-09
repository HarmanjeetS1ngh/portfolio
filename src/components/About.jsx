import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { APPEAR_EASE } from './Appear.jsx';
import { about, profile } from '../config.js';

/**
 * About me, laid out on the page itself (no boxed bento), in the same language as the hero:
 *   intro  : photo next to the bio, then ONE dotted fact sheet (role, place, education, tools, belief)
 *   hobbies: ONE horizontal card strip (unchanged): starts as a stack, rises and fans out.
 */
const PHOTO_SHADOW = [
  '0.24px 0.48px 0.97px -1.17px rgba(0,0,0,0.08)',
  '0.92px 1.83px 3.68px -2.33px rgba(0,0,0,0.07)',
  '4px 8px 16.1px -3.5px rgba(0,0,0,0.04)',
  '12px 18px 40px -8px rgba(0,0,0,0.14)',
].join(', ');
const CARD_SHADOW = '0 18px 40px -12px rgba(0,0,0,0.28), 0 4px 10px rgba(0,0,0,0.08)';
// kept tight enough to fade out inside the strip's clip box (about 34px of room beside the outer cards), so no hard edge shows
const HOVER_SHADOW = '0 24px 36px -14px rgba(0,0,0,0.34), 0 8px 16px -4px rgba(0,0,0,0.1)';

function useReveal(delay = 0) {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? false : { opacity: 0.001, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, ease: APPEAR_EASE, delay },
  };
}

// highlight removed: renders the text plainly (kept as a component so the call sites don't change)
function Hl({ children }) {
  return <>{children}</>;
}

/* ───────── intro: photo as a selected layer + bio ───────── */
function PhotoLayer() {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div {...useReveal(0)} className="mx-auto w-full max-w-[280px] md:col-span-2 md:mx-0 md:max-w-none md:self-start">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] border-2 border-white bg-placeholder"
        style={{ boxShadow: PHOTO_SHADOW }}
      >
        {about.photo && !failed ? (
          <img loading="lazy" decoding="async" src={about.photo} alt={profile.fullName} draggable={false} onError={() => setFailed(true)} className="size-full select-none object-cover" style={{ objectPosition: 'center 25%' }} />
        ) : (
          <span className="flex size-full items-center justify-center font-groovy text-7xl text-ink-0">{profile.initials}</span>
        )}
      </div>
    </motion.div>
  );
}

/* ───────── bio + fact sheet: everything about me in one scannable block ───────── */
function Fact({ label, children }) {
  return (
    <div className="grid grid-cols-[88px_1fr] items-baseline gap-x-4 border-b border-dotted border-ink-3 py-3.5 first:pt-0 md:grid-cols-[112px_1fr]">
      <dt className="font-body text-[15px] text-ink-2">{label}</dt>
      <dd className="m-0 font-body text-[17px] leading-snug font-medium text-ink-0">{children}</dd>
    </div>
  );
}

function ToolItem({ tool }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex items-center" data-cursor="default" title={tool.name} aria-label={tool.name}>
      {failed ? (
        <span data-cursor="default" className="font-display text-base font-bold">{tool.name[0]}</span>
      ) : (
        <img loading="lazy" decoding="async" src={tool.icon} alt="" draggable={false} onError={() => setFailed(true)} className="size-6 select-none object-contain" />
      )}
    </span>
  );
}

function IntroClassic() {
  const phrase = 'interfaces that feel effortless';
  const i = about.bio.indexOf(phrase);
  const { before, highlight, after } = about.philosophy;
  const [role, place] = about.pills;
  return (
    <motion.div {...useReveal(0.12)} className="flex flex-col gap-8 pt-8 md:col-span-4 md:pt-1 md:pl-6">
      <p className="m-0 max-w-[24em] font-body text-[clamp(20px,2.3vw,28px)] leading-[1.35] font-normal tracking-[-0.01em] text-ink-0">
        {i < 0 ? about.bio : (
          <>
            {about.bio.slice(0, i)}
            <Hl>{phrase}</Hl>
            {about.bio.slice(i + phrase.length)}
          </>
        )}
      </p>

      <dl className="m-0">
        {role && <Fact label="Role">{role}</Fact>}
        {place && <Fact label="Based in">{place}</Fact>}
        <Fact label="Education">
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {about.education.map((e) => (
              <li key={e.title}>
                {e.title}
                <span className="block text-[15px] font-normal text-ink-2">{e.meta}</span>
              </li>
            ))}
          </ul>
        </Fact>
        <Fact label="Tools">
          <span data-cursor="default" className="flex flex-wrap gap-x-5 gap-y-3">
            {about.tools.map((tl) => (
              <ToolItem key={tl.name} tool={tl} />
            ))}
          </span>
        </Fact>
        <Fact label="I believe">
          <span className="font-normal text-ink-2">
            {before}
            <Hl>{highlight}</Hl>
            {after}
          </span>
        </Fact>
      </dl>
    </motion.div>
  );
}

/* Variant B: bio, then role/place chips, then two soft cards (education + belief), tools as a pill row */
function Label({ children }) {
  return <span className="font-body text-[13px] font-medium tracking-[0.06em] text-ink-2 uppercase">{children}</span>;
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-dotted border-ink-3 bg-white/70 px-3.5 py-1.5 font-body text-[15px] font-medium text-ink-0">
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

function IntroCards() {
  const phrase = 'interfaces that feel effortless';
  const i = about.bio.indexOf(phrase);
  const { before, highlight, after } = about.philosophy;
  const [role, place] = about.pills;
  return (
    <motion.div {...useReveal(0.12)} className="flex flex-col gap-6 pt-8 md:col-span-4 md:pt-1 md:pl-6">
      <p className="m-0 max-w-[24em] font-body text-[clamp(20px,2.3vw,28px)] leading-[1.35] font-normal tracking-[-0.01em] text-ink-0">
        {i < 0 ? about.bio : (
          <>
            {about.bio.slice(0, i)}
            <Hl>{phrase}</Hl>
            {about.bio.slice(i + phrase.length)}
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-2.5">
        {role && <Chip>{role}</Chip>}
        {place && <Chip>{place}</Chip>}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-[14px] border border-dotted border-ink-3 bg-white/60 p-4">
          <Label>Education</Label>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {about.education.map((e) => (
              <li key={e.title} className="font-body text-[16px] leading-snug font-medium text-ink-0">
                {e.title}
                <span className="block text-[14px] font-normal text-ink-2">{e.meta}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-[14px] border border-dotted border-ink-3 bg-white/60 p-4">
          <Label>I believe</Label>
          <p className="m-0 font-body text-[16px] leading-snug text-ink-2">
            {before}
            <Hl>{highlight}</Hl>
            {after}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Tools I use</Label>
        <span data-cursor="default" className="flex flex-wrap gap-2">
          {about.tools.map((tl) => (
            <span key={tl.name} className="rounded-full border border-dotted border-ink-3 bg-white/70 px-3 py-1.5">
              <ToolItem tool={tl} />
            </span>
          ))}
        </span>
      </div>
    </motion.div>
  );
}

/* Variant C: editorial / spec-sheet. Hairline dotted grid, small-caps labels, quote at the end. */
function Cell({ n, label, className = '', children }) {
  return (
    <div className={`flex flex-col gap-2 border-b border-dotted border-ink-3 py-5 ${className}`}>
      <span className="flex items-center gap-2 font-body text-[12px] font-medium tracking-[0.08em] text-ink-2 uppercase">
        <span className="tabular-nums">{n}</span>
        <span>{label}</span>
      </span>
      <div className="font-body text-[17px] leading-snug font-medium text-ink-0">{children}</div>
    </div>
  );
}

function IntroSpec() {
  const phrase = 'interfaces that feel effortless';
  const i = about.bio.indexOf(phrase);
  const { before, highlight, after } = about.philosophy;
  const [role, place] = about.pills;
  return (
    <motion.div {...useReveal(0.12)} className="flex flex-col gap-8 pt-8 md:col-span-4 md:pt-1 md:pl-6">
      <div className="grid grid-cols-2 gap-x-8 border-t border-dotted border-ink-3">
        <Cell n="01" label="About" className="col-span-2">
          {i < 0 ? about.bio : (
            <>
              {about.bio.slice(0, i)}
              <Hl>{phrase}</Hl>
              {about.bio.slice(i + phrase.length)}
            </>
          )}
        </Cell>
        <Cell n="02" label="Role">{role}</Cell>
        <Cell n="03" label="Based in">{place}</Cell>
        <Cell n="04" label="Education" className="col-span-2">
          <ul className="m-0 grid list-none gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
            {about.education.map((e) => (
              <li key={e.title}>
                {e.title}
                <span className="block text-[14px] font-normal text-ink-2">{e.meta}</span>
              </li>
            ))}
          </ul>
        </Cell>
        <Cell n="05" label="Tools" className="col-span-2">
          <span data-cursor="default" className="flex flex-wrap gap-x-5 gap-y-3">
            {about.tools.map((tl) => (
              <ToolItem key={tl.name} tool={tl} />
            ))}
          </span>
        </Cell>
        <Cell n="06" label="I believe" className="col-span-2">
          <span className="font-normal text-ink-2">
            {before}
            <Hl>{highlight}</Hl>
            {after}
          </span>
        </Cell>
      </div>
    </motion.div>
  );
}

/* Variant D: design-tool inspector. Photo + bio are "selected layers" (blue frame, corner handles, type tag),
   the facts are a Properties panel with mono keys. Same blue as the text highlight. */
const SEL = { image: '#0055B3', text: '#6D28D9', list: '#0E7A5F' };
function Selection({ tag, color, className = '' }) {
  const dot = 'absolute size-2 border bg-white';
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute border ${className}`} style={{ borderColor: color }}>
      <span className="absolute -top-[22px] -left-px rounded-[3px] px-1.5 py-[2px] font-body text-[11px] leading-none font-medium whitespace-nowrap text-white" style={{ background: color }}>{tag}</span>
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((c) => (
        <span key={c} className={`${dot} ${c}`} style={{ borderColor: color }} />
      ))}
    </span>
  );
}

function PhotoLayerSelected() {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div {...useReveal(0)} className="mx-auto w-full max-w-[280px] pt-9 md:col-span-2 md:mx-0 md:max-w-none md:self-start md:pt-6">
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[12px] border-2 border-white bg-placeholder" style={{ boxShadow: PHOTO_SHADOW }}>
          {about.photo && !failed ? (
            <img loading="lazy" decoding="async" src={about.photo} alt={profile.fullName} draggable={false} onError={() => setFailed(true)} className="size-full select-none object-cover" style={{ objectPosition: 'center 25%' }} />
          ) : (
            <span className="flex size-full items-center justify-center font-groovy text-7xl text-ink-0">{profile.initials}</span>
          )}
        </div>
        <Selection color={SEL.image} tag="Image · Profile" className="-inset-[6px] rounded-[2px]" />
      </div>
    </motion.div>
  );
}

function Prop({ k, children }) {
  return (
    <div data-cursor="text" className="grid grid-cols-[84px_1fr] items-start gap-x-4 border-b border-ink-3/40 py-3.5 last:border-b-0 md:grid-cols-[104px_1fr]">
      <dt className="pt-px font-body text-[13px] leading-[22px] text-ink-2">{k}</dt>
      <dd className="m-0 font-body text-[16px] leading-[22px] font-medium text-ink-0">{children}</dd>
    </div>
  );
}

function Intro() {
  const phrase = 'interfaces that feel effortless';
  const i = about.bio.indexOf(phrase);
  const { before, highlight, after } = about.philosophy;
  const [role, place] = about.pills;
  return (
    <motion.div {...useReveal(0.12)} className="flex flex-col gap-10 pt-8 md:col-span-4 md:pt-[18px] md:pl-6">
      <div data-cursor="text" className="relative px-3 py-2.5">
        <p className="m-0 w-full text-pretty font-display text-[clamp(18px,1.9vw,22px)] leading-[1.25] font-normal tracking-[-0.02em] text-ink-0">
          {i < 0 ? about.bio : (
            <>
              {about.bio.slice(0, i)}
              <Hl>{phrase}</Hl>
              {about.bio.slice(i + phrase.length)}
            </>
          )}
        </p>
        <Selection color={SEL.text} tag="Text · Bio" className="inset-0 rounded-[2px]" />
      </div>

      <div data-cursor="text" className="relative px-3 py-2.5">
        <Selection color={SEL.list} tag="List · Details" className="inset-0 rounded-[2px]" />
        <div data-cursor="text" className="flex items-center gap-2 border-b border-ink-3/40 pb-2.5 font-body text-[13px] font-medium text-ink-2">
          <span className="size-1.5 rounded-[1px]" style={{ background: SEL.list }} />
          At a glance
        </div>
        <dl className="m-0">
          <Prop k="role">{role}</Prop>
          <Prop k="location">{place}</Prop>
          <Prop k="education">
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {about.education.map((e) => (
                <li key={e.title}>
                  {e.title}
                  <span className="block text-[14px] font-normal text-ink-2">{e.meta}</span>
                </li>
              ))}
            </ul>
          </Prop>
          <Prop k="stack">
            <span data-cursor="default" className="flex flex-wrap gap-x-5 gap-y-3">
              {about.tools.map((tl) => (
                <ToolItem key={tl.name} tool={tl} />
              ))}
            </span>
          </Prop>
          <Prop k="belief">
            {before}
            <Hl>{highlight}</Hl>
            {after}
          </Prop>
        </dl>
      </div>
    </motion.div>
  );
}

/* ───────── hobbies strip ───────── */
// Design space of the strip (px). The whole stage is scaled down to fit narrower screens.
const STAGE_W = 1000;
const STAGE_H = 416; // top edge = top of the hover pills on the highest cards (card y 62 - 14 - 48 = 0), so no dead space above the strip
const CARD_W = 220;
const CARD_H = 290;
// where each card lands (left, top, tilt). Top wave + tilts give the loose "pinned on a wall" row.
const SLOTS = [
  { x: 14, y: 106, r: -5 },
  { x: 202, y: 62, r: 3 },
  { x: 390, y: 98, r: -2 },
  { x: 578, y: 62, r: 4 },
  { x: 766, y: 106, r: -5 },
];
// Hover without any z-index change (a z swap is what made the old version jerk): every card keeps
// its stacking order for good, and the card to the right of the hovered one, which would otherwise
// cover it, glides out of the way instead. At the right edge there is no room to glide, so the
// hovered card itself slides left. Everything is animated, so nothing ever "snaps" on or off top.
const CLEAR = 46;
function pushFor(active) {
  const next = SLOTS[active + 1];
  if (!next) return { self: 0, next: 0 };
  const room = Math.max(0, STAGE_W - 8 - (next.x + CARD_W));
  const n = Math.min(CLEAR, room);
  return { self: -(CLEAR - n), next: n };
}
const CENTER = { x: (STAGE_W - CARD_W) / 2, y: 86 };

// The fan's entrance (stack rises while straightening, cards peel into their slots, middle card first)
// is pure CSS now: see .hobby-stage / .hobby-card in index.css.
// Phones: no overlapping fan. The five cards sit in a 2-column grid and simply rise in.
const gridVariants = {
  out: { opacity: 0, y: 30, rotate: 0 },
  in: (i) => ({ opacity: 1, y: 0, rotate: SLOTS[i].r * 0.4, transition: { type: 'spring', stiffness: 90, damping: 16, delay: (i % 2) * 0.1 } }),
};

// Phones, deck mode: the wrapper (HobbyDeck) positions the card, so the card itself only fades up.
const deckVariants = {
  out: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16 } },
};

const SWIPE_MS = 3200;
// dir: 1 = next (slides in from the right), -1 = previous (from the left)
const swipe = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: '0%', transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] } },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] } }),
};
// softer than the old bounce: the card eases up, overlaps its neighbours and eases back
// min distance (px) from a pill's end to its pointer, so the pointer never sits on the rounded corner
const TAIL_MIN = 26;
const LIFT_SPRING = { type: 'spring', stiffness: 210, damping: 24, mass: 0.9 };

/** One poster / photo, with its own image fallback and optional hover video. */
function Slide({ slide, hobby, label, play }) {
  const videoRef = useRef(null);
  const [imgOk, setImgOk] = useState(true);
  const [videoOk, setVideoOk] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false); // the <video> only mounts (and downloads) after the first hover
  useEffect(() => {
    if (play) setArmed(true);
  }, [play]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (play) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  }, [play, armed]);

  return (
    <>
      {imgOk && (
        <img loading="lazy" decoding="async" src={slide.image} alt="" draggable={false} onError={() => setImgOk(false)} className="absolute inset-0 size-full select-none object-cover" />
      )}
      {slide.video && videoOk && armed && (
        <video
          ref={videoRef}
          src={slide.video}
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoOk(false)}
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 size-full object-cover transition-opacity duration-100"
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}
      {!imgOk && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold tracking-[-0.04em] text-white/70 select-none">
          {label ?? hobby.name}
        </span>
      )}
    </>
  );
}

/** Small stroke icons for the hover pills (trophies are tinted gold / silver / bronze). */
const PILL_ICONS = {
  gold: { color: '#E8A800', paths: 'trophy' },
  silver: { color: '#8D97A3', paths: 'trophy' },
  bronze: { color: '#C27A35', paths: 'trophy' },
  gamepad: { color: '#6B5CE7', paths: 'gamepad' },
  terminal: { color: '#1793D1', paths: 'terminal' },
  pin: { color: '#E5484D', paths: 'pin' },
  paw: { color: '#D98A1F', paths: 'paw' },
  church: { color: '#E0A100', paths: 'church' },
  temple: { color: '#D6453D', paths: 'temple' },
  mountain: { color: '#3E8E5A', paths: 'mountain' },
  flag: { color: '#F59E0B', paths: 'flag' },
  dome: { color: '#C99700', paths: 'dome' },
  house: { color: '#2F7DD1', paths: 'house' },
  book: { color: '#B8872E', paths: 'book' },
  web: { color: '#E23636', paths: 'web' },
  bat: { color: '#1F1F1F', paths: 'bat' },
  magnifier: { color: '#2E9E6B', paths: 'magnifier' },
  eye: { color: '#F26B1D', paths: 'eye' },
};
// movies #4 to #7 get their icon from the title, so config.js doesn't need to change
const TITLE_ICONS = {
  'Spider-Man: No Way Home': 'web',
  'The Batman': 'bat',
  'The Sheep Detectives': 'magnifier',
  'Blade Runner 2049': 'eye',
};
const ICON_SHAPES = {
  paw: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" fill="currentColor" fillOpacity="0.2" />
    </>
  ),
  church: (
    <>
      <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" />
      <path d="M14 22v-4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v4" />
      <path d="M18 22V5l-6-3-6 3v17" />
      <path d="M12 7v5M10 9h4" />
    </>
  ),
  temple: (
    <>
      <path d="M12 2v2.5" />
      <path d="M8 9c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5" />
      <path d="M6 13c0-2 1-4 2-4h8c1 0 2 2 2 4" />
      <path d="M4 22V13h16v9" />
      <path d="M10 22v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
  mountain: <path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="currentColor" fillOpacity="0.2" />,
  flag: (
    <>
      <path d="M5 22V2" />
      <path d="M5 3l14 5-14 5Z" fill="currentColor" fillOpacity="0.3" />
    </>
  ),
  dome: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21v-7h14v7" />
      <path d="M6 14a6 6 0 0 1 12 0" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 8V5" />
      <circle cx="12" cy="3.6" r="1" />
    </>
  ),
  house: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity="0.2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  book: (
    <>
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7Z" fill="currentColor" fillOpacity="0.2" />
    </>
  ),
  web: (
    <>
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="8" />
    </>
  ),
  bat: (
    <path
      d="M12 6.5 13.1 4.6l.5 2.3c1.6-.5 4-.8 7.4.4-1.2 1-1.6 2.4-1.3 4.2-1-.8-2.2-.8-3.2-.2-.6-.6-1.4-.7-2.2-.3L12 18l-2.3-6.9c-.8-.4-1.6-.3-2.2.3-1-.6-2.2-.6-3.2.2.3-1.8-.1-3.2-1.3-4.2 3.4-1.2 5.8-.9 7.4-.4l.5-2.3L12 6.5Z"
      fill="currentColor"
      strokeWidth="1"
    />
  ),
  magnifier: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" fill="currentColor" fillOpacity="0.2" />
      <path d="m21 21-5.2-5.2" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </>
  ),
  trophy: (
    <>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" fill="currentColor" fillOpacity="0.25" />
    </>
  ),
  gamepad: (
    <>
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </>
  ),
  terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </>
  ),
};

function PillIcon({ name }) {
  const def = PILL_ICONS[name];
  if (!def) return <span className="size-2 rounded-full bg-accent" />;
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: def.color }} className="shrink-0">
      {ICON_SHAPES[def.paths]}
    </svg>
  );
}

function Hobby({ hobby, index, inView, onScreen = true, active, setActive, overlay, grid = false, deck = false, deckTop = true }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef(null);
  const slot = SLOTS[index];
  const fan = !grid && !deck;
  const Wrap = fan ? 'div' : motion.div;
  const total = about.hobbies.length;
  const lastAlone = grid && !deck && index === total - 1 && total % 2 === 1; // odd card out sits centred on its own row
  const pillAlign = deck
    ? 'center'
    : grid
    ? lastAlone ? 'center' : index % 2 === 0 ? 'start' : 'end'
    : 'center'; // fan: always centred on the card, so the pointer is in the middle of every pill (the stage has a gutter, so long pills at the ends don't clip)
  // distance from the card edge to the card's centre (the pill's pointer sits there)
  const half = grid ? '50cqw' : `${CARD_W / 2}px`;
  // short pills (e.g. "Dalhousie") are narrower than that distance, which pushed the pointer onto the
  // rounded corner. Clamp it so it always stays on the pill's flat bottom edge, whatever the text length.
  const tailPos = `min(${half}, calc(100% - ${TAIL_MIN}px))`;
  // a hobby is either a single image or a list of slides (Movies: top 7, auto-swiping)
  const slides = hobby.slides ?? [{ image: hobby.image, video: hobby.video, pill: hobby.pill, icon: hobby.icon }];
  const multi = slides.length > 1;
  const current = slides[idx];
  const interactive = slides.some((s) => s.video || s.pill);

  const go = (d) => {
    setDir(d);
    setIdx((i) => (i + d + slides.length) % slides.length);
  };

  // auto swipe: only once the strip has landed, paused while hovered / focused.
  // idx is a dependency so the timer restarts after a manual swipe.
  useEffect(() => {
    if (!multi || !inView || !onScreen || hover || reduce || (deck && !deckTop)) return;
    const t = setInterval(() => go(1), SWIPE_MS);
    return () => clearInterval(t);
  }, [multi, inView, onScreen, hover, reduce, slides.length, idx, deck, deckTop]);

  const lift = (on) => {
    setHover(on);
    setActive((a) => (on ? index : a === index ? null : a));
  };

  useEffect(() => {
    if (grid && active !== index) setHover(false);
  }, [grid, active, index]);

  // deck: a card that was sent to the back drops its pill / video
  useEffect(() => {
    if (deck && !deckTop) {
      setHover(false);
      setActive((a) => (a === index ? null : a));
    }
  }, [deck, deckTop]);

  // how far this card slides sideways because of the hovered card (see pushFor)
  let shiftX = 0;
  if (!grid && active != null) {
    const { self, next } = pushFor(active);
    if (index === active) shiftX = self;
    else if (index === active + 1) shiftX = next;
  }
  // touch: horizontal swipe changes the slide, a plain tap toggles the hover state (pill / video)
  const onTouchDown = (e) => {
    if (e.pointerType === 'touch') touch.current = { x: e.clientX, y: e.clientY };
  };
  const onTouchUp = (e) => {
    if (e.pointerType !== 'touch' || !touch.current) return;
    const dx = e.clientX - touch.current.x;
    const dy = e.clientY - touch.current.y;
    touch.current = null;
    if (!deck && multi && Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
    else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) lift(!hover);
  };

  const pill = current.pill ? (
    <span
      aria-hidden={!hover}
      style={{
        opacity: hover ? 1 : 0,
        transform: hover ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0)',
        transformOrigin: `${pillAlign === 'start' ? tailPos : pillAlign === 'end' ? `max(calc(100% - ${half}), ${TAIL_MIN}px)` : '50%'} 100%`,
      }}
      className={`hobby-pill pointer-events-none absolute -top-12 z-10 flex items-center ${pillAlign === 'start' ? 'left-0' : pillAlign === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'} gap-2 rounded-full bg-white px-3.5 py-2 font-body text-sm leading-none font-semibold whitespace-nowrap text-ink-0 shadow-[0_6px_20px_rgba(0,0,0,0.14)]`}
    >
      <PillIcon name={current.icon ?? TITLE_ICONS[current.title]} />
      {current.pill}
      <span
        aria-hidden="true"
        className={`absolute top-full -mt-[5px] size-2.5 rotate-45 bg-white ${pillAlign === 'end' ? 'translate-x-1/2' : '-translate-x-1/2'}`}
        style={pillAlign === 'start' ? { left: tailPos } : pillAlign === 'end' ? { right: tailPos } : { left: '50%' }}
      />
    </span>
  ) : null;

  return (
    <Wrap
      {...(fan
        ? {
            className: 'hobby-card absolute',
            'data-in': inView ? '' : undefined,
            style: { left: slot.x, top: slot.y, width: CARD_W, height: CARD_H, zIndex: 10 + index, '--dx': `${CENTER.x - slot.x}px`, '--dy': `${CENTER.y - slot.y}px`, '--r': `${slot.r}deg`, '--k': Math.abs(index - 2) },
          }
        : {
            custom: index,
            variants: deck ? deckVariants : gridVariants,
            initial: reduce ? 'in' : 'out',
            animate: inView ? 'in' : 'out',
            className: deck ? 'relative size-full' : `relative ${lastAlone ? 'col-span-2 mx-auto w-[calc(50%-0.5rem)]' : ''}`,
            style: deck ? undefined : { aspectRatio: `${CARD_W} / ${CARD_H}`, zIndex: hover ? 5 : 1 },
          })}
    >
      <div
        tabIndex={interactive ? 0 : undefined}
        onPointerEnter={(e) => e.pointerType !== 'touch' && lift(true)}
        onPointerLeave={(e) => e.pointerType !== 'touch' && lift(false)}
        onPointerDown={onTouchDown}
        onPointerUp={onTouchUp}
        onPointerCancel={() => (touch.current = null)}
        onFocus={() => lift(true)}
        onBlur={() => lift(false)}
        style={{
          touchAction: multi ? 'pan-y' : 'auto',
          containerType: grid ? 'inline-size' : undefined,
          '--sx': `${reduce || grid ? 0 : shiftX}px`,
          '--ly': hover ? '-14px' : '0px',
          '--ls': hover ? 1.06 : 1,
          '--lr': hover ? `${-slot.r * 0.6}deg` : '0deg',
        }}
        className="hobby-lift relative size-full outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="hobby-shadow absolute inset-0 rounded-[18px]" style={{ boxShadow: CARD_SHADOW, opacity: hover ? 0 : 1 }} />
        <span aria-hidden="true" className="hobby-shadow absolute inset-0 rounded-[18px]" style={{ boxShadow: HOVER_SHADOW, opacity: hover ? 1 : 0 }} />
        <div
          className="absolute inset-0 overflow-hidden rounded-[18px] border-2 border-white"
          style={{ background: `linear-gradient(135deg, ${hobby.tint[0]}, ${hobby.tint[1]})` }}
        >
          <div className="hobby-lift absolute inset-0 overflow-hidden" style={{ '--sx': '0px', '--ly': '0px', '--lr': '0deg', '--ls': hover && !reduce ? 1.05 : 1 }}>
            {multi ? (
              <AnimatePresence initial={false} custom={dir}>
                <motion.div key={idx} custom={dir} variants={swipe} initial="enter" animate="center" exit="exit" className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hobby.tint[0]}, ${hobby.tint[1]})` }}>
                  <Slide slide={current} hobby={hobby} label={`#${idx + 1}`} play={hover} />
                </motion.div>
              </AnimatePresence>
            ) : (
              <Slide slide={current} hobby={hobby} play={hover} />
            )}
          </div>

          {/* swipe progress dots */}
          {multi && (
            <div aria-hidden="true" className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {slides.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-300 ${i === idx ? 'w-4 opacity-100' : 'w-1.5 opacity-60'}`} />
              ))}
            </div>
          )}

          {/* frosted label tab, like the Work cards */}
          {/* it overhangs the card edge by 2px (the card's overflow clip trims it flush), so no hairline
              of the border/background can show between the tab and the card edge when cards tilt */}
          <span
            className="absolute -bottom-[2px] -left-[2px] z-10 rounded-tr-[12px] bg-white/85 px-3.5 py-2 font-display text-[15px] font-semibold tracking-[-0.01em] text-ink-0"
            style={{ paddingLeft: 'calc(0.875rem + 2px)', paddingBottom: 'calc(0.5rem + 2px)' }}
          >
            {hobby.name}
          </span>
        </div>

        {/* Fan layout: the pill lives in a layer above ALL cards (see HobbyStrip), so a neighbouring card can
            never cover it and no card ever needs to change its stacking order. Grid layout: it sits on the card. */}
        {pill &&
          (grid
            ? pill
            : overlay &&
              createPortal(
                <div className="hobby-lift absolute" style={{ left: slot.x, top: slot.y - 14, width: CARD_W, height: 0, '--sx': `${reduce ? 0 : shiftX}px` }}>
                  {pill}
                </div>,
                overlay,
              ))}
      </div>
    </Wrap>
  );
}

/* ───────── phones: the hobbies as a swipeable deck ───────── */
/*
 * Same mechanics as the "Swipeable Card Stack" reference. The top card is dragged with framer's own
 * drag (elastic 0.6) and tilts in 3D (perspective on the deck). A flick or a long drag tosses it a
 * short way, it then slides BEHIND the stack while the others spring forward, and the order rotates.
 * Difference from the reference: the drag is horizontal only, so the page still scrolls
 * vertically over the deck. The stack peeks out above, as in the reference; `offset` sets how far.
 */
const DECK = { offset: 24, scaleStep: 0.05, perspective: 600, threshold: 100, velocity: 500, elastic: 0.6, maxRot: 15 };
const TOSS = { type: 'spring', stiffness: 500, damping: 30 };
const RETURN = { type: 'spring', stiffness: 150, damping: 20 };
const clamp = (v, m) => Math.max(-m, Math.min(m, v));

function DeckCard({ children, stackIndex, total, onSwipeComplete }) {
  const top = stackIndex === 0;
  const x = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  const [phase, setPhase] = useState('idle'); // idle | exiting | returning
  const busy = useRef(false);
  const timers = useRef([]);

  useEffect(() => {
    const off = x.on('change', (v) => {
      rotateY.set(clamp((v / 200) * DECK.maxRot, DECK.maxRot));
      rotateZ.set(clamp((v / 200) * DECK.maxRot * 0.5, DECK.maxRot * 0.5));
    });
    return () => {
      off();
      timers.current.forEach(clearTimeout);
    };
  }, [x, rotateY, rotateZ]);

  const settle = (spring) => {
    animate(x, 0, spring);
    animate(rotateY, 0, spring);
    animate(rotateZ, 0, spring);
  };

  const onDragEnd = (_, { offset, velocity }) => {
    if (!top || busy.current) return;
    if (Math.abs(offset.x) > DECK.threshold || Math.abs(velocity.x) > DECK.velocity) {
      busy.current = true;
      setPhase('exiting');
      const dir = Math.sign(offset.x) || Math.sign(velocity.x) || 1;
      animate(x, dir * 120, { ...TOSS, velocity: velocity.x * 0.5 });
      timers.current = [
        setTimeout(() => {
          setPhase('returning');
          settle(RETURN);
        }, 100),
        setTimeout(() => {
          setPhase('idle');
          busy.current = false;
          onSwipeComplete(); // the slide-back spring keeps running on its own, so nothing snaps
        }, 400),
      ];
    } else {
      settle(TOSS);
    }
  };

  const last = total - 1;
  let scale = 1 - stackIndex * DECK.scaleStep;
  let ty = -stackIndex * DECK.offset;
  if (top) {
    if (phase === 'returning') {
      scale = 1 - last * DECK.scaleStep;
      ty = -last * DECK.offset;
    } else {
      scale = 1;
      ty = 0;
    }
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotateY, rotateZ, zIndex: top && phase !== 'idle' ? 0 : total - stackIndex, cursor: top && phase === 'idle' ? 'grab' : 'default', userSelect: 'none', WebkitUserSelect: 'none' }}
      animate={{ scale, translateY: ty }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      drag={top && phase === 'idle' ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={DECK.elastic}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      {children}
    </motion.div>
  );
}

function HobbyDeck({ inView, active, setActive }) {
  const total = about.hobbies.length;
  const [order, setOrder] = useState(() => about.hobbies.map((_, i) => i)); // order[0] = card on top
  const rotate = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <div className="flex w-full flex-col items-center pb-2 md:col-span-6" style={{ paddingTop: 72 /* the stack peeks ~60px above the front card (tallest point); the tap pill sits inside that */ }}>
      <div
        className="relative w-[min(100%,270px)]"
        style={{ aspectRatio: '220 / 290', perspective: DECK.perspective, marginBottom: 24 }}
      >
        {about.hobbies.map((h, i) => {
          const pos = order.indexOf(i);
          return (
            <DeckCard key={h.key} stackIndex={pos} total={total} onSwipeComplete={rotate}>
              <Hobby hobby={h} index={i} inView={inView} active={active} setActive={setActive} grid deck deckTop={pos === 0} />
            </DeckCard>
          );
        })}
      </div>
    </div>
  );
}

function HobbyStrip() {
  const wrapRef = useRef(null);
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches);
  const inView = useInView(wrapRef, { once: true, amount: mobile ? 0.1 : 0.2, margin: '0px 0px 12% 0px' });
  const onScreen = useInView(wrapRef, { margin: '120px 0px 120px 0px' }); // live visibility: the Movies auto-swipe sleeps off-screen
  const [w, setW] = useState(STAGE_W);
  const [active, setActive] = useState(null);
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mobile]);

  // decode every hobby picture up front (idle time), so neither the reveal nor the Movies auto-swipe
  // has to decode a big image on the frame it first appears
  useEffect(() => {
    const urls = about.hobbies.flatMap((h) => (h.slides ?? [h]).map((x) => x.image)).filter(Boolean);
    const run = () =>
      urls.forEach((u) => {
        const im = new Image();
        im.src = u;
        im.decode?.().catch(() => {});
      });
    // only warm the pictures once the About section is close to the viewport, so they never
    // compete with the first screen on slow connections
    const el = wrapRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      const id = setTimeout(run, 4000);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1500 });
        else setTimeout(run, 100);
      },
      { rootMargin: '900px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // once the reveal is over, release the GPU layers (CSS: [data-done])
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => wrapRef.current?.setAttribute('data-done', ''), 2400);
    return () => clearTimeout(t);
  }, [inView]);

  // fit the 1000px stage to the column; on phones keep it readable and crop the outer cards instead
  const scale = Math.max(0.55, Math.min(1, w / STAGE_W));

  // phones: full-bleed (cancels the grid's px-6) and clipped sideways, so a tossed card can never widen the page
  if (mobile) {
    return (
      <div ref={wrapRef} className="-mx-6 mt-4 overflow-x-clip md:col-span-6" style={{ overflowAnchor: 'none' }}>
        <HobbyDeck inView={inView} active={active} setActive={setActive} />
      </div>
    );
  }

  return (
    <div className="-mx-6 mt-6 -mb-24 overflow-clip px-6 pt-4 pb-24 md:col-span-6">
    <div ref={wrapRef} className="relative w-full" style={{ height: STAGE_H * scale }}>
      <div className="absolute top-0 left-1/2" style={{ width: STAGE_W, height: STAGE_H, marginLeft: -STAGE_W / 2, transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        <div className="hobby-stage relative size-full" data-in={inView ? '' : undefined}>
          {about.hobbies.map((h, i) => (
            <Hobby key={h.key} hobby={h} index={i} inView={inView} onScreen={onScreen} active={active} setActive={setActive} overlay={overlay} />
          ))}
          <div ref={setOverlay} aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ zIndex: 100 }} />
        </div>
      </div>
    </div>
    </div>
  );
}

/* Inline image pill inside the hobbies heading. Click = soft crossfade to the next picture. */
const PILL_IMAGES = ['/about/pill-cinema.webp', '/about/pill-cables.webp', '/about/pill-waves.webp', '/about/pill-books.webp', '/about/pill-games.webp'];

function HeadingPill() {
  const [idx, setIdx] = useState(0);
  const [pop, setPop] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  // tap (touch has no hover): next picture + the pill swells for a moment, then settles back
  const onTap = () => {
    setIdx((n) => (n + 1) % PILL_IMAGES.length);
    setPop(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPop(false), 1000);
  };
  return (
    <span className="relative mx-[0.3em] inline-block h-[1.25em] w-[3.1em] align-middle [@media(hover:none)]:h-[1.4em] [@media(hover:none)]:w-[3.5em]" style={{ top: '-0.04em' }}>
    <button
      type="button"
      onClick={onTap}
      aria-label="Change picture"
      className={`relative block size-full ${pop ? 'z-10 -rotate-2 scale-[1.3]' : ''} cursor-pointer select-none overflow-hidden rounded-full border-0 bg-placeholder p-0 shadow-[0_0_0_1.5px_#fff,0_2px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.35] hover:-rotate-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0055B3] active:scale-95 motion-reduce:transition-none`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {PILL_IMAGES.map((src, n) => (
        <img loading="lazy" decoding="async"
          key={src}
          src={src}
          alt=""
          draggable={false}
          className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none ${n === idx ? 'scale-100 opacity-100' : 'scale-[1.15] opacity-0'}`}
        />
      ))}
    </button>
    </span>
  );
}

export default function About({ className = '' }) {
  const head = useReveal(0);
  const sub = useReveal(0.15);
  const hobbiesHead = useReveal(0);
  const divider = useReveal(0);

  return (
    <section id="about" className={`relative mx-auto flex w-full max-w-[1000px] scroll-mt-4 flex-col items-center gap-6 pb-10 md:pb-[max(8rem,calc(50svh_-_200px))] ${className}`}>
      <div className="flex flex-col items-center gap-2 px-6 text-center">
        <motion.h2 {...head} className="font-display text-[clamp(28px,3.4vw,36px)] leading-[1.3] font-semibold tracking-[-0.03em] text-ink-0">
          About me
        </motion.h2>
        <motion.p {...sub} className="font-body text-base text-ink-2">
          [The person behind the pixels]
        </motion.p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 px-6 md:grid-cols-6">
        <PhotoLayerSelected />
        <Intro />

        {/* the tidy "frame" ends here; below it is the unframed, messy side */}
        <motion.div {...divider} aria-hidden="true" className="relative mt-8 h-px border-t border-dotted border-ink-3 md:col-span-6 md:mt-10">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-main px-3 font-body text-[12px] font-medium tracking-[0.08em] whitespace-nowrap text-ink-2 uppercase">
            Outside the frame
          </span>
        </motion.div>

        <motion.div {...hobbiesHead} className="mt-6 flex flex-col items-center gap-1.5 text-center md:col-span-6 md:mt-8">
          <h3 className="m-0 font-display text-[clamp(24px,3vw,32px)] leading-[1.3] font-semibold tracking-[-0.02em] text-ink-0">Things that make<br className="md:hidden" /> me,<HeadingPill />me.</h3>
          <span className="max-w-[40em] font-body text-[15px] text-ink-2">Some of the things I enjoy when I’m not designing or staring at a screen for work.</span>
        </motion.div>
        <HobbyStrip />
      </div>
    </section>
  );
}