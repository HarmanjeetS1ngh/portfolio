import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Pencil, Laptop } from 'lucide-react';
import Icon from './Icon.jsx';

/** Pill-in-a-line section divider ("Context & Problem", "Process"...) */
export function SectionDivider({ label }) {
  return (
    <div className="mb-6 flex items-center gap-2.5 md:mb-8 md:gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="rounded-full border border-line bg-main px-3.5 py-1.5 font-mono-ui text-xs font-bold tracking-[0.04em] whitespace-nowrap text-accent-dark uppercase md:px-5 md:py-2 md:text-sm">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export const H3 = ({ children }) => (
  <h3 className="content-col mt-8 mb-4 font-body text-lg leading-[1.3] font-semibold md:text-xl">
    {children}
  </h3>
);

export const P = ({ children }) => (
  <p className="content-col mb-6 font-body text-base leading-[1.6] text-ink-2 md:text-[18px]">{children}</p>
);

export const ImagePlaceholder = ({ icon, children }) => (
  <div className="mt-10 mb-4 flex aspect-video w-full flex-col items-center justify-center gap-2.5 rounded-xl bg-placeholder p-6 text-center font-mono-ui text-[13px] text-ink-2">
    <Icon name={icon} size={32} className="text-ink-3" />
    {children}
  </div>
);

/** Figure caption: "Fig N — short description" with a right-aligned media-type tag (IMG/VID/GIF) */
export const Caption = ({ n, type = 'IMG', children }) => (
  <div className="mb-10 flex items-start justify-end gap-3 text-right">
    <p className="font-mono-ui text-[11px] leading-normal tracking-[0.02em] text-ink-2 md:text-[13px]">
      <span className="font-bold text-ink">Fig {n}</span> — {children}
    </p>
    <span className="mt-px shrink-0 rounded bg-line px-1.5 py-0.5 font-mono-ui text-[10px] font-bold tracking-[0.06em] text-ink-2">
      {type}
    </span>
  </div>
);

/**
 * Figure caption used inside <figure>s: "Fig N — short description" + right-aligned media-type tag.
 * Shared by HighlightCard and HighlightVideoPair so every figure's caption looks and sits the same.
 * Pass `inverse` when the figure sits on a coloured background (white text instead of grey).
 */
function FigCaption({ n, type = 'IMG', inverse = false, children }) {
  return (
    <figcaption className="flex items-start justify-end gap-3 text-right">
      <p className={`font-mono-ui text-[11px] leading-normal tracking-[0.02em] md:text-[13px] ${inverse ? 'text-white/90' : 'text-ink-2'}`}>
        <span className={`font-bold ${inverse ? 'text-white' : 'text-ink'}`}>Fig {n}</span> — {children}
      </p>
      <span className={`mt-px shrink-0 rounded px-1.5 py-0.5 font-mono-ui text-[10px] font-bold tracking-[0.06em] ${inverse ? 'bg-white/20 text-white' : 'bg-line text-ink-2'}`}>
        {type}
      </span>
    </figcaption>
  );
}

/**
 * Looping, muted, inline video used inside a HighlightCard.
 * - Plays only while it is on screen (IntersectionObserver) and pauses when scrolled away,
 *   so three looping clips don't burn CPU/battery in the background.
 * - Respects prefers-reduced-motion: the clip stays paused on its poster frame and the
 *   native controls are shown so the visitor can start it deliberately.
 * - `poster` is shown while the file loads (and if autoplay is ever blocked).
 * - `fill`: the parent owns the box (fixed CSS aspect-ratio) and the video fills it, instead of the
 *   box following the media's own ratio. Browsers size a <video> from its poster until the first
 *   frame decodes and then switch to the video's ratio, so any layout that must stay put (like
 *   two clips of equal height) needs this.
 */
export function HighlightVideo({ src, poster, alt, width, height, fill = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return undefined;
    // React doesn't reliably write the `muted` attribute; without it browsers block autoplay.
    el.muted = true;
    el.load(); // (re)start loading now that the element is mounted and muted
    let inView = false;
    const tryPlay = () => { if (inView) el.play().catch(() => {}); };
    el.addEventListener('loadeddata', tryPlay);
    el.addEventListener('canplay', tryPlay);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting) {
          // play() returns a promise that rejects if the browser blocks autoplay; that's fine,
          // the poster stays visible.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => { io.disconnect(); el.removeEventListener('loadeddata', tryPlay); el.removeEventListener('canplay', tryPlay); };
  }, [reduce]);

  return (
    <video
      ref={ref}
      poster={poster ?? src.replace(/\.mp4$/, '-poster.webp')}
      aria-label={alt}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      controls={reduce}
      className={fill ? 'block h-full w-full rounded-lg border-0 object-cover' : 'block h-auto w-full rounded-lg border-0'}
      style={{ border: 'none', outline: 'none' }}
    >
      <source src={src.replace(/\.mp4$/, '.webm')} type="video/webm" />
      <source src={src} type="video/mp4" />
    </video>
  );
}

/**
 * Highlight figure: a full-width image OR video with its figure caption underneath.
 * Media is shown whole, never cropped: every card has the same width and the height
 * follows each file's own ratio (pass `width`/`height` = the file's pixel size so the
 * page doesn't jump while it loads). Set `video` (+ optional `poster`) to render a
 * looping muted clip instead of an <img loading="lazy" decoding="async">. Without `src` a 4:3 placeholder is shown.
 * Caption styling mirrors <Caption>; pass `inverse` when the card sits on a coloured
 * background (white caption text instead of grey).
 */
export function HighlightCard({ n, type = 'IMG', src, poster, video = false, alt = '', width, height, inverse = false, mediaClassName = '', children }) {
  const media =
    src && video ? (
      <HighlightVideo src={src} poster={poster} alt={alt} width={width} height={height} />
    ) : src ? (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-lg"
      />
    ) : (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2.5 rounded-xl bg-placeholder p-6 text-center font-mono-ui text-[13px] text-ink-2">
        <Icon name="Image" size={32} className="text-ink-3" />
        Highlight {n}
      </div>
    );

  return (
    <figure className="flex flex-col gap-5">
      {mediaClassName ? <div className={mediaClassName}>{media}</div> : media}
      <FigCaption n={n} type={type} inverse={inverse}>
        {children}
      </FigCaption>
    </figure>
  );
}

/**
 * Fig 2's specific problem: one combined diagram reads fine on desktop but its three flows
 * become unreadably small at mobile width. Below `md`, swap it for a swipeable strip of the
 * same three flows as separate images (reusing StepFilmstrip); at `md` and up, show the single
 * combined image as normal. Only one of the two ever renders (display:none unmounts nothing,
 * but the hidden image still needs to load) — acceptable here since these are a handful of
 * diagrams, not a heavy gallery.
 */
export function ResponsiveFlows({ n, combined, flows }) {
  return (
    <>
      <div className="md:hidden">
        <StepFilmstrip n={n} type="IMG" steps={flows} width={flows[0].width} height={flows[0].height}>
          {combined.caption}
        </StepFilmstrip>
      </div>
      <figure className="hidden flex-col gap-5 md:flex">
        <img
          src={combined.src}
          alt={combined.alt}
          width={combined.width}
          height={combined.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-lg"
        />
        <FigCaption n={n} type="IMG">
          {combined.caption}
        </FigCaption>
      </figure>
    </>
  );
}

/**
 * Horizontal, scroll-snapping filmstrip for a short screen-by-screen sequence (e.g. a 4-step
 * interaction flow). One portrait screen fills the frame at a time; swiping/scrolling moves
 * between them, and numbered dots above the frame both show and jump to the active step.
 * Works the same on mobile (native swipe) and desktop (drag or click a dot). A short caption
 * for the active step sits under the frame, so per-step text never has to fit inside the image.
 *
 * `steps`: [{ src, alt, caption }]. `width`/`height` = one step's real pixel size (all steps
 * should share the same crop/ratio) so the frame reserves its height up front.
 */
export function StepFilmstrip({ n, type = 'IMG', steps, width, height, inverse = false, children }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const clickScrollRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const slides = Array.from(track.children);
    const io = new IntersectionObserver(
      (entries) => {
        // Ignore intersection changes we caused ourselves by clicking a dot — otherwise the
        // slide we're scrolling *past* briefly reports the highest ratio and the dot flickers.
        if (clickScrollRef.current) return;
        const mostVisible = entries.reduce((best, e) => (e.intersectionRatio > (best?.intersectionRatio ?? 0) ? e : best), null);
        if (mostVisible && mostVisible.intersectionRatio > 0.5) {
          setActive(slides.indexOf(mostVisible.target));
        }
      },
      { root: track, threshold: [0.5, 0.75, 1] }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [steps.length]);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i];
    if (!slide) return;
    clickScrollRef.current = true;
    setActive(i);
    slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    window.clearTimeout(goTo._t);
    goTo._t = window.setTimeout(() => {
      clickScrollRef.current = false;
    }, 600);
  };

  return (
    <figure className="flex flex-col gap-5">
      {/* Step dots: numbered, active one filled + wider. Clicking jumps the strip. */}
      <div className="mx-auto flex items-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to step ${i + 1}`}
            aria-current={active === i}
            className={`flex items-center justify-center rounded-full font-mono-ui text-[11px] font-bold transition-all duration-300 ${
              active === i
                ? 'w-7 h-7 bg-accent text-white'
                : 'w-6 h-6 bg-line-soft text-ink-3 hover:bg-line'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Fills the available card width instead of capping at a small fixed size —
          on most phones that left a noticeable strip of unused space on both sides
          of the step image and made the step itself (a UI screenshot people need to
          actually read) smaller than it needed to be. */}
      <div className="relative mx-auto w-full max-w-[440px] sm:max-w-[520px]">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((step, i) => (
            <div key={i} className="w-full shrink-0 snap-center snap-always">
              <img
                src={step.src}
                alt={step.alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Per-step caption swaps under the frame instead of being baked into the image. */}
      <p className="mx-auto max-w-[320px] text-center font-body text-sm leading-[1.5] text-ink-2">
        {steps[active].caption}
      </p>

      <FigCaption n={n} type={type} inverse={inverse}>
        {children}
      </FigCaption>
    </figure>
  );
}

/**
 * Tiny icon used inside BeforeAfterToggle's tabs when variant="fidelity":
 * a pencil for the Lo-fi tab, a laptop for the Hi-fi tab — literal rather
 * than abstract, so the icon reads instantly without relying on the text
 * label. The active tab's icon fills in with its accent color and a small
 * scale pop; the inactive one sits flat in muted ink, matching the same
 * active/inactive treatment already used for the tab label text.
 *
 * Colors are shared with the tab labels themselves: the pencil matches the
 * Lo-fi label's active text color (--color-ink), and the laptop matches the
 * accent blue used for the Hi-fi label's active text below — so each icon
 * and its own label always read as one color, not two.
 */
const FIDELITY_COLORS = { lofi: '#18181b', hifi: '#0080ff' }; // lofi mirrors --color-ink; hifi is the shared accent blue

function FidelityIcon({ active, kind }) {
  const reduce = useReducedMotion();
  const color = FIDELITY_COLORS[kind];

  return (
    <motion.span
      className="inline-flex shrink-0 items-center justify-center"
      initial={false}
      animate={{
        color: active ? color : 'currentColor',
        scale: active ? 1.08 : 1,
        opacity: active ? 1 : 0.55,
      }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      aria-hidden="true"
    >
      {kind === 'lofi' ? (
        <Pencil size={14} strokeWidth={2} />
      ) : (
        <Laptop size={14} strokeWidth={2} />
      )}
    </motion.span>
  );
}

/**
 * Before/After comparison as a single image that swaps via a pill toggle (Before | After),
 * instead of showing both side by side. Matches the site's other toggle interactions.
 * Pass `width`/`height` (the file's real pixel size) on `before`/`after` so the frame's
 * box is reserved up front instead of collapsing/popping as each image loads or swaps.
 *
 * `variant="fidelity"` adds a small blueprint-block → colored-block swatch to each tab,
 * for lo-fi/hi-fi style comparisons specifically (see FidelityIcon above). Every other
 * usage of this component is unaffected — the swatch only renders when opted in.
 */
export function BeforeAfterToggle({ n, type = 'IMG', before, after, beforeLabel = 'Before', afterLabel = 'After', inverse = false, variant, children }) {
  const [showAfter, setShowAfter] = useState(false);
  const active = showAfter ? after : before;
  const isFidelity = variant === 'fidelity';

  return (
    <figure className="flex flex-col gap-4">
      <div className="mx-auto inline-flex items-center gap-0.5 rounded-full border border-line-soft bg-line/50 p-1.5 shadow-inner relative">
        <button
          type="button"
          onClick={() => setShowAfter(false)}
          aria-pressed={!showAfter}
          className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 font-body text-sm font-semibold transition-colors duration-300 ${
            !showAfter ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
          }`}
        >
          {isFidelity && <FidelityIcon active={!showAfter} kind="lofi" />}
          {beforeLabel}
        </button>
        <button
          type="button"
          onClick={() => setShowAfter(true)}
          aria-pressed={showAfter}
          className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 font-body text-sm font-semibold transition-colors duration-300 ${
            showAfter ? (isFidelity ? '' : 'text-ink') : 'text-ink-3 hover:text-ink-2'
          }`}
          style={showAfter && isFidelity ? { color: FIDELITY_COLORS.hifi } : undefined}
        >
          {isFidelity && <FidelityIcon active={showAfter} kind="hifi" />}
          {afterLabel}
        </button>
        <motion.div
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full border border-line-soft bg-white shadow-sm z-0"
          animate={{ left: showAfter ? 'calc(50% + 3px)' : '6px' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Height-capped box so a tall portrait shot (the hi-fi screenshot) can't blow up to
          an absurd height just because the card is wide — the cap is fluid (clamp + vw) so it
          scales continuously with the viewport instead of landing on one exact pixel width to
          visibly grow. The constraint lives on each <img> itself (max-height, with width auto)
          rather than on a fixed-height wrapper — a fixed wrapper height forces every image into
          the same box regardless of its own aspect ratio, which on mobile left a wide "before"
          screenshot rendering far shorter than a portrait "after" shot and leaving dead space
          around it. `object-contain` keeps every image whole and undistorted; background is
          transparent so exported assets with transparent edges blend with the card instead of
          showing a placeholder box.

          Both images stay mounted at all times and share one grid cell (`grid-area: 1 / 1`)
          instead of being swapped via AnimatePresence's `mode="wait"`. That previous approach
          fully removed the outgoing image before mounting the incoming one, so for one frame the
          wrapper had zero children and, having no size of its own, collapsed to ~0 height before
          popping back — the "shrink" when toggling back and forth. With both images always
          present, the wrapper's box is always driven by whichever image (or briefly both) is in
          that cell, so it never has nothing to size itself against. Toggling only animates
          opacity/position; the inactive image is inert (`pointer-events-none`, `aria-hidden`) so
          it can't be focused or read by assistive tech while hidden. */}
      <div className="relative mx-auto grid w-full place-items-center overflow-hidden rounded-lg bg-transparent">
        {[
          { key: 'before', img: before, isActive: !showAfter },
          { key: 'after', img: after, isActive: showAfter },
        ].map(({ key, img, isActive }) => (
          <motion.img
            key={key}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading="lazy"
            decoding="async"
            aria-hidden={!isActive}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : (showAfter ? 20 : -20) }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ maxHeight: 'clamp(220px, 58vw, 760px)', gridArea: '1 / 1' }}
            className={`block h-auto w-auto max-w-full rounded-lg object-contain ${
              isActive ? '' : 'pointer-events-none'
            }`}
          />
        ))}
      </div>

      <div className="mt-1">
        <FigCaption n={n} type={type} inverse={inverse}>
          {children}
        </FigCaption>
      </div>
    </figure>
  );
}

/**
 * Side-by-side "Before" (old site) / "After" (redesign) comparison, sharing one figure caption.
 * Each side is capped to the same fixed aspect box (object-cover from the top) so an old,
 * differently-proportioned screenshot and a new asset always line up at the same height —
 * stacks to one column on mobile. Pass `beforeLabel`/`afterLabel` to override the default chips.
 */
export function BeforeAfter({ n, type = 'IMG', before, after, beforeLabel = 'Before', afterLabel = 'After', inverse = false, children }) {
  const Side = ({ img, label, tone }) => (
    <div className="min-w-0 flex-1">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 font-mono-ui text-[10px] font-bold tracking-[0.06em] uppercase ${
            tone === 'before' ? 'bg-line text-ink-2' : 'bg-accent text-white'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-placeholder">
        <img
          src={img.src}
          alt={img.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full rounded-lg object-contain"
        />
      </div>
    </div>
  );

  return (
    <figure className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 md:gap-4">
        <Side img={before} label={beforeLabel} tone="before" />
        <Side img={after} label={afterLabel} tone="after" />
      </div>
      <FigCaption n={n} type={type} inverse={inverse}>
        {children}
      </FigCaption>
    </figure>
  );
}

/**
 * "Creative flow" substitute for a screen recording: a short horizontal sequence of static
 * screenshots (e.g. the old site's multi-step contact form) connected by arrows, each with a
 * one-line label. Wraps to a vertical stack on narrow screens, with the arrows rotating 90°.
 * `steps` = [{ src, alt, label }].
 */
export function BeforeFilmstrip({ n, type = 'IMG', steps, inverse = false, children }) {
  return (
    <figure className="flex flex-col gap-5">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-2">
        {steps.map((step, i) => (
          <div key={step.src} className="flex items-center gap-2 sm:contents">
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-lg bg-placeholder">
                <img
                  src={step.src}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-lg object-contain"
                />
              </div>
              <p className="mt-2 font-mono-ui text-[11px] leading-snug tracking-[0.02em] text-ink-2 md:text-xs">
                <span className="font-bold text-ink">{String(i + 1).padStart(2, '0')}</span> — {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <Icon
                name="ArrowRight"
                size={18}
                strokeWidth={2}
                className="mx-auto shrink-0 rotate-90 text-ink-3 sm:mx-0 sm:rotate-0"
              />
            )}
          </div>
        ))}
      </div>
      <FigCaption n={n} type={type} inverse={inverse}>
        {children}
      </FigCaption>
    </figure>
  );
}

/**
 * Interactive stepper: a connected node rail (numbered dots + progress line) above one large
 * frame. Clicking a node swaps the screenshot, so the rail both narrates the sequence and lets
 * the reader click through it like a real stepper UI, instead of showing every step side by side.
 * Deliberately unfilled/borderless (no bg of its own) — it sits inside the caller's own
 * `bg-accent-soft` wrapper, so adding a second fill here would double up that background.
 * Rail colors use the site's blue accent tokens (accent-dark for the active node, accent for
 * completed nodes/lines, a faint accent tint for upcoming ones) so the stepper matches the theme
 * without shouting. `steps` = [{ src, alt, label, width, height }].
 * `width`/`height` (each file's real pixel size) reserve the frame's box up front so it doesn't
 * collapse to 0 height on load or pop when a step is switched.
 */
export function RailStepper({ n, type = 'IMG', steps, inverse = false, children }) {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <figure className="flex flex-col gap-5">
      <div>
        <div className="mb-4 flex items-center px-1">
          {steps.map((step, i) => (
            <div key={step.src} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className="flex shrink-0 items-center gap-2 font-mono-ui"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors duration-200 ${
                    i === active
                      ? 'border-accent-dark bg-accent-dark text-main'
                      : i < active
                        ? 'border-accent bg-main text-accent-dark'
                        : 'border-accent/25 bg-main text-ink-2'
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`hidden text-[11px] whitespace-nowrap transition-colors duration-200 sm:inline ${
                    i === active ? 'font-bold text-accent-dark' : 'text-ink-2'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span className={`mx-2 h-0.5 min-w-[12px] flex-1 rounded-full ${i < active ? 'bg-accent' : 'bg-accent/20'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          layout
          className="relative w-full touch-pan-y overflow-hidden rounded-lg bg-placeholder"
          // Fixed aspect-ratio box, taken from whichever step is active, so the frame
          // never collapses to 0 height on first load and doesn't pop/jump when a step
          // (each screenshot can have a slightly different ratio) is switched.
          style={current.width && current.height ? { aspectRatio: `${current.width} / ${current.height}` } : undefined}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.06}
          onDragEnd={(_, info) => {
            const SWIPE_THRESHOLD = 50;
            if (info.offset.x < -SWIPE_THRESHOLD && active < steps.length - 1) {
              // swiped left -> next step
              setActive(active + 1);
            } else if (info.offset.x > SWIPE_THRESHOLD && active > 0) {
              // swiped right -> previous step
              setActive(active - 1);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-none block h-auto w-full rounded-lg"
            />
          </AnimatePresence>
        </motion.div>
      </div>

      <FigCaption n={n} type={type} inverse={inverse}>
        {children}
      </FigCaption>
    </figure>
  );
}

/**
 * Two clips side by side under ONE figure caption (e.g. the tablet + mobile drawer recordings).
 * - The figure uses the shared text column (`content-col`, 780px max), so both clips + the gap
 *   together span exactly the width of the running text above and below.
 * - Both clips are always the same height, at every viewport width: each cell has a fixed CSS
 *   aspect-ratio and a flex-grow equal to that ratio (basis 0), so the free space is split in
 *   proportion to the ratios and width ÷ ratio comes out identical for both.
 * - Caption spacing/alignment is the same <FigCaption> HighlightCard uses: 12px under the media,
 *   right-aligned to the media's right edge.
 * `items` = [{ src, poster, alt, width, height }]. Pass each clip's true DISPLAY ratio as
 * width/height. That isn't always the encoded pixel size: some screen recordings carry a non-square
 * pixel aspect ratio (check `ffprobe -show_entries stream=display_aspect_ratio`), and using the
 * encoded size would make the heights drift apart once the video's metadata loads.
 */
export function HighlightVideoPair({ n, type = 'VID', items, children }) {
  return (
    <figure className="content-col flex flex-col gap-5">
      <div className="flex items-start gap-3 md:gap-6">
        {items.map((item) => (
          <div
            key={item.src}
            className="min-w-0"
            style={{
              // x1000 keeps the grow factors summing well above 1 (a sum under 1 would leave free space unused)
              flex: `${(item.width / item.height) * 1000} 1 0%`,
              // the box has a fixed ratio; the clip fills it (see `fill`), so heights stay equal and
              // nothing shifts when a poster is swapped for the playing video
              aspectRatio: `${item.width} / ${item.height}`,
            }}
          >
            <HighlightVideo {...item} fill />
          </div>
        ))}
      </div>
      <FigCaption n={n} type={type}>
        {children}
      </FigCaption>
    </figure>
  );
}

/** Small uppercase chip (UX Audit, Progressive Disclosure...) */
export const TagChip = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1.5 rounded bg-line px-3 py-1.5 font-mono-ui text-[11px] leading-tight font-bold tracking-[0.06em] uppercase md:text-xs">
    <Icon name={icon} size={14} />
    {children}
  </span>
);

/**
 * Callout — 1:1 port of joshwcomeau.com's "aside" info-box component.
 * Structural markup and SVG hook match the reference exactly; colors come
 * from a `tone` so the same shape can be reused (accent for tips, purple
 * for pull-quotes, etc).
 */
const calloutTones = {
  // `line` is the exact color of the straight border-left AND the curved SVG
  // hook — they must always match. `icon` is only for the little badge icon
  // and is allowed to differ (e.g. cream uses a darker amber for contrast).
  accent: { border: 'border-l-accent', line: 'var(--color-accent)', bg: 'bg-accent-soft', icon: 'text-accent', title: 'text-ink', text: 'text-accent-dark' },
  purple: { border: 'border-l-[#7c3aed]', line: '#7c3aed', bg: 'bg-[#8b5cf6]/[0.08]', icon: 'text-[#7c3aed]', title: 'text-[#6d28d9]', text: 'text-[#6d28d9]' },
  // Cream: same amber hue as the cream card tone (cardTones[0]); text uses the darker amber for contrast on the tint
  cream: { border: 'border-l-[#f5b731]', line: '#f5b731', bg: 'bg-[#f5b731]/[0.12]', icon: 'text-[#d99a0b]', title: 'text-[#7a5407]', text: 'text-[#7a5407]' },
  // Green: same "good" hue as the green card tone (cardTones[3]), for consistency with the rest of the theme
  green: { border: 'border-l-good', line: 'var(--color-good)', bg: 'bg-good-bg', icon: 'text-good', title: 'text-good', text: 'text-good' },
};

export function Callout({ icon = 'Lightbulb', title, tone = 'accent', strokeWidth = 2, children }) {
  const t = calloutTones[tone] ?? calloutTones.accent;
  return (
    <aside className={`content-col relative mt-10 mb-10 ml-5 rounded-r border-l-[3px] ${t.border} ${t.bg} py-6 pr-6 pl-7 text-base md:ml-0 md:pl-9`}>
      {/* Decorative curved hook that curls the border out to meet the icon badge */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28.5"
        height="34.5"
        fill="none"
        viewBox="0 0 57 69"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-0 block -translate-x-[3px] overflow-visible"
      >
        <path fill="var(--color-main, #fffefc)" d="M54 0V0.716804C54 25.9434 35.0653 47.1517 10 50L0 57V0H54Z" />
        <path
          fill={t.line}
          d="M56.9961 4.15364C57.0809 2.49896 55.8083 1.08879 54.1536 1.00394C52.499 0.919082 51.0888 2.19168 51.0039 3.84636L56.9961 4.15364ZM9.09704 51.7557L8.49716 48.8163L9.09704 51.7557ZM6 69V59.2227H0V69H6ZM9.69692 54.6951L14.3373 53.7481L13.1375 47.8693L8.49716 48.8163L9.69692 54.6951ZM14.3373 53.7481C38.202 48.8777 55.7486 28.4783 56.9961 4.15364L51.0039 3.84636C49.8967 25.4384 34.3213 43.5461 13.1375 47.8693L14.3373 53.7481ZM6 59.2227C6 57.0268 7.54537 55.1342 9.69692 54.6951L8.49716 48.8163C3.55195 49.8255 0 54.1756 0 59.2227H6Z"
        />
      </svg>
      {/*
        Bridge: the curved hook (an anti-aliased SVG path) hands off to the
        plain CSS border-left right at the SVG's bottom edge. At non-integer
        device pixel ratios (e.g. 100% zoom on 125%/150% OS scaling) the two
        round to different sub-pixels and leave a hairline gap or double-up.
        This is a small solid-color rect, in the same `line` color, that
        overlaps a few px on both sides of that handoff point so there's
        never a visible seam regardless of how the SVG edge rounds.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 block w-[3px] -translate-x-[3px]"
        style={{ top: '31px', height: '8px', backgroundColor: t.line }}
      />
      <div className={`absolute top-0 left-0 -translate-x-[calc(50%+1.5px)] -translate-y-1/2 rounded-full ${t.bg} p-2 ${t.icon}`}>
        <Icon name={icon} size={22} strokeWidth={strokeWidth} />
      </div>

      {title && <strong className={`mb-2 block text-lg font-bold ${t.title}`}>{title}</strong>}
      <div className="grid">
        <span className={`font-body text-base leading-[1.6] ${t.text}`}>
          {children}
        </span>
      </div>
    </aside>
  );
}

/** Pull-quote — same shape as Callout, with a purple tone and the outline quote icon */
export function QuoteCallout({ children }) {
  return (
    <Callout icon="Quote" tone="purple" strokeWidth={1.75}>
      {children}
    </Callout>
  );
}

/** Design-challenge callout — same shape as Callout, cream tone, with a "Design challenge" label */
export function DesignChallenge({ children }) {
  return (
    <Callout icon="Compass" title="Design challenge" tone="cream">
      {children}
    </Callout>
  );
}

/**
 * Shared palette for every multi-colour card group on the page
 * (Problems/Solution/Results, interaction models, trust signals…).
 *
 * Cards pick their colour BY POSITION from this list, so the sequence is
 * always  cream → blue → purple → green  no matter which group they're in.
 * To reorder or recolour every card group at once, edit this array only.
 */
export const cardTones = [
  { name: 'cream', badge: 'bg-[#f5b731]/30 text-[#a5720b]', card: 'bg-[#f5b731]/[0.07]' },
  { name: 'blue', badge: 'bg-accent/15 text-accent-dark', card: 'bg-accent-soft' },
  { name: 'purple', badge: 'bg-[#8b5cf6]/15 text-[#6d28d9]', card: 'bg-[#8b5cf6]/[0.07]' },
  { name: 'green', badge: 'bg-good/15 text-good', card: 'bg-good-bg' },
];

/** Colour for the card at position `i` (wraps around after the 4th). */
export const toneAt = (i) => cardTones[i % cardTones.length];

/** Card used for the "problem facts" and the "interaction models" grids — matches the Problems/Solution/Results card style */
// Green is reserved for the "chosen" option, so rejected options cycle through the first three tones.
const chosenTone = cardTones[cardTones.length - 1];
const rejectedTones = cardTones.slice(0, -1);

export function DecisionCard({ icon, title, reason, status, chosen = false, stat, index = 0 }) {
  const tone = chosen ? chosenTone : rejectedTones[index % rejectedTones.length];
  const reasonParts = reason.split(/\*\*(.+?)\*\*/g);
  return (
    <div className={`flex flex-col gap-4 rounded-[10px] px-6 py-7 ${tone.card}`}>
      <div className="flex items-center justify-between">
        <span className={`flex size-10 items-center justify-center rounded-full ${tone.badge}`}>
          <Icon name={icon} size={20} strokeWidth={2.25} />
        </span>
        {chosen && status && (
          <span className="rounded bg-good px-2 py-1 font-mono-ui text-[10px] font-bold tracking-[0.08em] text-white uppercase">
            {status}
          </span>
        )}
      </div>
      <span className="font-display text-lg font-bold tracking-[-0.01em] text-ink">
        {stat && <span className="mr-1.5">{stat}</span>}
        {title}
      </span>
      <span className="font-body text-[15px] leading-[1.55] text-ink-2">
        {reasonParts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-bold">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    </div>
  );
}