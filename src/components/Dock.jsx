import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import Appear from './Appear.jsx';
import { links } from '../config.js';

/**
 * Spring taken from the Jotter site's own interactive components
 * (stiffness 500, damping 60, mass 1): quick, but with no bounce.
 */
const SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 };

// Only the hovered icon reacts. Each item owns its own hover state and uses
// transforms only, so neighbours never move, resize or reflow.
const iconVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.2, y: -8 },
  tap: { scale: 1.08, y: -4 },
};
const tipVariants = {
  rest: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0 },
  tap: { opacity: 1, y: 0 },
};

const INTERNAL = [
  { label: 'Work', icon: '/dock/work.webp', href: '#/', section: 'selected-work' }, // scrolls to the featured work on the home page
  { label: 'Lab', icon: '/dock/lab.webp', href: '#/lab', route: '/lab' },
  { label: 'Resume', icon: '/dock/resume.webp', href: '/resume.pdf' },
];

// Items with a `section` scroll to that part of the home page (going home first if needed).
function goToSection(e, id, delay = 0) {
  e.preventDefault();
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const h = window.location.hash;
  if (!h || h === '#/' || h === '#') {
    if (delay) setTimeout(scroll, delay);
    else scroll();
  } else {
    window.location.hash = '#/';
    setTimeout(scroll, Math.max(150, delay)); // after the home page has mounted
  }
}

const EXTERNAL = [
  { label: 'Medium', icon: '/dock/medium.webp', href: links.medium },
  { label: 'LinkedIn', icon: '/dock/linkedin.webp', href: links.linkedin },
  { label: 'Telegram', icon: '/dock/telegram.webp', href: links.telegram },
  { label: 'Email', icon: '/dock/email.webp', href: links.email },
];

function DockItem({ item, active }) {
  const isWeb = /^(https?:|\/.*\.pdf$)/.test(item.href);
  return (
    <motion.a
      href={item.href}
      onClick={item.section ? (e) => goToSection(e, item.section) : undefined}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      target={isWeb ? '_blank' : undefined}
      rel={isWeb ? 'noopener noreferrer' : undefined}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
      className="relative block rounded-[20%] no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{ width: 'var(--dock-size)', height: 'var(--dock-size)' }}
    >
      <motion.span variants={iconVariants} transition={SPRING} className="block size-full">
        <img
          src={item.icon}
          alt=""
          draggable={false}
          className="block size-full select-none"
        />
      </motion.span>

      {/* tooltip */}
      <motion.span
        variants={tipVariants}
        transition={{ duration: 0.2, ease: [0.12, 0.23, 0.38, 1] }}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+18px)] left-1/2 -translate-x-1/2 rounded-md border border-white/10 bg-ink-0 px-2.5 py-1 font-body text-xs font-semibold whitespace-nowrap text-main shadow-[0_6px_18px_rgba(9,9,11,0.3)]"
      >
        {item.label}
      </motion.span>

    </motion.a>
  );
}

function DesktopDock({ route }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 hidden justify-center px-3 md:flex"
      style={{ '--dock-size': '52px' }}
    >
      {/* Same entrance as every other block on the page (delay 0.6s). */}
      <Appear delay={0.6} className="pointer-events-auto">
        <nav
          aria-label="Primary"
          className="flex items-center gap-[clamp(6px,1.6vw,10px)] rounded-[24px] border border-white/10 bg-[#050506] p-[clamp(6px,1.4vw,10px)] shadow-[0_14px_40px_rgba(9,9,11,0.32),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl"
        >
          {INTERNAL.map((item) => (
            <DockItem key={item.label} item={item} active={route === item.route} />
          ))}
          <span aria-hidden="true" className="mx-0.5 h-7 w-px bg-white/15" />
          {EXTERNAL.map((item) => (
            <DockItem key={item.label} item={item} active={false} />
          ))}
        </nav>
      </Appear>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Mobile dock (< 768px): one round button that opens a small two-"folder" pager, like app folders.
 * Folder 1 = Explore (Work / Lab / Resume), folder 2 = Socials, side by side. Swipe left for Socials,
 * swipe right to come back; the ends rubber-band. Each folder is a 2 x 2 grid.
 * ---------------------------------------------------------------------------------------------- */
const FOLDERS = [
  { title: 'Explore', items: INTERNAL },
  { title: 'Socials', items: EXTERNAL },
];
const COLS = 2; // each folder is a COLS x ROWS grid (2 x 2 = 4 slots)
const ROWS = 2;
const ROW_H = 72; // px per grid row
const PANEL_SPRING = { type: 'spring', stiffness: 380, damping: 36, mass: 0.9 };
const PAGE_SPRING = { type: 'spring', stiffness: 320, damping: 38, mass: 1 };

/* PLACEHOLDER icons for the collapse button: swap these two for your custom icon */
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function FolderItem({ item, active, interactive, onPick, index = 0, reduce }) {
  const isWeb = /^(https?:|\/.*\.pdf$)/.test(item.href);
  return (
    <motion.a
      href={item.href}
      aria-current={active ? 'page' : undefined}
      target={isWeb ? '_blank' : undefined}
      rel={isWeb ? 'noopener noreferrer' : undefined}
      tabIndex={interactive ? 0 : -1}
      draggable={false}
      onClick={(e) => {
        onPick?.(e); // close the menu first...
        if (item.section) goToSection(e, item.section, 260); // ...then scroll once its exit animation has finished
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 32, delay: reduce ? 0 : 0.04 + index * 0.035 }}
      className="relative flex h-full w-full flex-col items-center justify-start gap-1 rounded-2xl py-1 no-underline outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <img src={item.icon} alt="" draggable={false} className="pointer-events-none block size-[clamp(46px,13vw,52px)] select-none" />
      <span className="font-body text-[11px] leading-none font-medium text-white/80">{item.label}</span>
    </motion.a>
  );
}

function MobileDock({ route }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0); // 0 = Explore, 1 = Socials
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const viewport = useRef(null);
  const btn = useRef(null);
  const dragged = useRef(false);
  const btnDown = useRef(false);
  const btnToggle = () => {
    // explicit open/close (not a blind toggle): if the backdrop already closed the menu on this same tap, don't reopen it
    if (open) setOpen(false);
    else if (performance.now() - closedAt.current > 400) setOpen(true);
  };
  const closedAt = useRef(0); // when the backdrop last closed the menu (guards against its pointerdown + the button's click racing)
  const last = FOLDERS.length - 1;

  // measure the pager (before paint) so each folder is exactly one viewport wide
  useLayoutEffect(() => {
    if (!open || !viewport.current) return;
    const measure = () => setWidth(viewport.current.offsetWidth); // layout width: unaffected by the panel's open scale animation
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport.current);
    return () => ro.disconnect();
  }, [open]);

  // keep the track glued to the current folder (initial open + width changes)
  useLayoutEffect(() => {
    x.stop();
    x.set(-page * width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const goTo = (next, velocity = 0) => {
    const p = Math.min(last, Math.max(0, next));
    setPage(p);
    if (reduce) x.set(-p * width);
    else animate(x, -p * width, { ...PAGE_SPRING, velocity });
  };

  // swipe left -> next folder, swipe right -> previous folder; a flick counts as distance
  const onDragEnd = (_, info) => {
    setTimeout(() => (dragged.current = false), 60);
    const power = info.offset.x + info.velocity.x * 0.2;
    if (power < -width * 0.15) goTo(page + 1, info.velocity.x);
    else if (power > width * 0.15) goTo(page - 1, info.velocity.x);
    else goTo(page, info.velocity.x);
  };

  // dismiss with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-end px-4 md:hidden"
    >
      {/* tap outside to close */}
      {open && <div aria-hidden="true" className="pointer-events-auto fixed inset-0" onPointerDown={() => { closedAt.current = performance.now(); setOpen(false); }} />}

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            id="dock-folders"
            role="dialog"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 14, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
            transition={PANEL_SPRING}
            style={{ transformOrigin: '100% 100%', willChange: 'transform, opacity' }}
            className="pointer-events-auto relative mb-2 w-[min(204px,calc(100vw-24px))] rounded-[24px] border border-white/10 bg-[#050506] px-2 pt-3 pb-0.5 shadow-[0_4px_14px_rgba(9,9,11,0.14),inset_0_1px_0_rgba(255,255,255,0.10)]"
          >
            {/* folder title */}
            <div className="relative mb-0.5 h-4 overflow-hidden text-center">
              {FOLDERS.map((f, i) => (
                <motion.span
                  key={f.title}
                  aria-hidden={i !== page}
                  animate={{ opacity: i === page ? 1 : 0, y: i === page ? 0 : 6 }}
                  transition={{ duration: 0.25, ease: [0.12, 0.23, 0.38, 1] }}
                  className="absolute inset-x-0 font-body text-[12px] leading-4 font-semibold tracking-wide text-white/55"
                >
                  {f.title}
                </motion.span>
              ))}
            </div>

            {/* pager: two fixed folders side by side, 2 x 2 grid each */}
            <div ref={viewport} className="relative overflow-hidden" style={{ height: ROWS * ROW_H }}>
              <motion.div
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ x }}
                drag="x"
                dragElastic={0.22}
                dragMomentum={false}
                dragConstraints={{ left: -last * width, right: 0 }}
                onPointerDownCapture={() => (dragged.current = false)} // every new touch starts clean, so a stale flag can never swallow a tap
                onPointerCancel={() => (dragged.current = false)}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={onDragEnd}
                onClickCapture={(e) => {
                  if (dragged.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                {FOLDERS.map((folder, i) => (
                  <div
                    key={folder.title}
                    aria-hidden={i !== page}
                    className="absolute top-0 grid h-full w-full content-start"
                    style={{ left: `${i * 100}%`, gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridAutoRows: ROW_H }}
                  >
                    {folder.items.map((item, n) => (
                      <FolderItem
                        key={item.label}
                        index={n}
                        reduce={reduce}
                        item={item}
                        active={route === item.route}
                        interactive={i === page}
                        onPick={() => setOpen(false)}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* pagination dots (each is 18 x 28px; width sets the gap between dots) */}
            <div className="flex items-center justify-center" role="tablist" aria-label="Folders">
              {FOLDERS.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  role="tab"
                  aria-selected={i === page}
                  aria-label={f.title}
                  onClick={() => goTo(i)}
                  className="grid h-7 w-[18px] place-items-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <motion.span
                    animate={{ opacity: i === page ? 1 : 0.35, scale: i === page ? 1 : 0.85 }}
                    transition={{ duration: 0.25 }}
                    className="block size-[7px] rounded-full bg-white"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* collapse button (same entrance as the desktop dock) */}
      <Appear delay={0.6} className="pointer-events-auto relative z-10">
        <motion.button
          ref={btn}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="dock-folders"
          onPointerDown={() => (btnDown.current = true)}
          onPointerCancel={() => (btnDown.current = false)}
          onPointerUp={() => {
            // act on pointer-up so the tap registers immediately, even right after a swipe
            if (!btnDown.current) return;
            btnDown.current = false;
            btnToggle();
          }}
          onClick={(e) => e.detail === 0 && btnToggle()} // keyboard activation only (Enter/Space)
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 520, damping: 30 }}
          className="grid size-14 touch-manipulation place-items-center rounded-full border border-white/10 bg-[#050506] text-white shadow-[0_4px_14px_rgba(9,9,11,0.14),inset_0_1px_0_rgba(255,255,255,0.10)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="relative grid size-6 place-items-center">
            <motion.span
              initial={false}
              animate={{ opacity: open ? 0 : 1, rotate: open ? 90 : 0, scale: open ? 0.5 : 1 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 34 }}
              className="absolute inset-0 grid place-items-center"
            >
              <MenuIcon />
            </motion.span>
            <motion.span
              initial={false}
              animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -90, scale: open ? 1 : 0.5 }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 460, damping: 34 }}
              className="absolute inset-0 grid place-items-center"
            >
              <CloseIcon />
            </motion.span>
          </span>
        </motion.button>
      </Appear>
    </div>
  );
}

/* The dock fades out as the footer curtain comes in, and back in as you scroll up. The fade is
 * SCROLL-LINKED: opacity = 1 - reveal progress, written straight to the DOM in the same frame as the
 * scroll (native scroll + Lenis tick). No direction logic, no React state, no CSS transition, so a fast
 * scroll in either direction can never make it flash or toggle. Opacity only: a transform here would
 * break the children's position:fixed. */
function useFooterFade(route) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const footer = document.getElementById('footer');
    const cover = footer?.previousElementSibling;
    if (!el) return undefined;
    el.style.opacity = '1';
    el.style.visibility = 'visible';
    if (!cover) return undefined;
    let shown = true;
    // cached cover bottom in document coords: no layout read per scroll tick (it forced a reflow after the footer's transform write)
    let coverBottom = 0;
    const measure = () => { coverBottom = cover.getBoundingClientRect().bottom + window.scrollY; };
    measure();
    const ro = new ResizeObserver(() => { measure(); apply(); });
    ro.observe(cover);
    ro.observe(document.body);
    const apply = () => {
      const vh = window.innerHeight;
      const start = vh * 0.85; // fade begins when the page's bottom edge passes here (same trigger as before)
      const range = Math.min(280, vh * 0.3); // ...and is fully gone after this much more scrolling
      const p = Math.min(1, Math.max(0, (start - (coverBottom - window.scrollY)) / range));
      el.style.opacity = String(1 - p);
      const vis = p < 1;
      if (vis !== shown) {
        shown = vis;
        el.style.visibility = vis ? 'visible' : 'hidden'; // keeps hidden icons out of tab order / clicks
        el.setAttribute('aria-hidden', vis ? 'false' : 'true');
      }
    };
    apply();
    const lenis = window.__lenis;
    // Lenis re-emits native scrolls too, so listen to one source only (no double work per frame)
    if (lenis) lenis.on('scroll', apply);
    else window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('resize', apply);
    return () => {
      if (!lenis) window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', measure);
      window.removeEventListener('resize', apply);
      ro.disconnect();
      lenis?.off('scroll', apply);
    };
  }, [route]);
  return ref;
}

export default function Dock({ route }) {
  const ref = useFooterFade(route);
  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      <DesktopDock route={route} />
      <MobileDock route={route} />
    </div>
  );
}