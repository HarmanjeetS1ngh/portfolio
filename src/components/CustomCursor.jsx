import { useEffect, useRef, useState } from 'react';
import cursorArrow from '../assets/cursors/cursor-arrow.svg';
import cursorPointer from '../assets/cursors/cursor-pointer.svg';
import cursorText from '../assets/cursors/cursor-text.svg';

// Hotspot = the point in the source art (as a 0-1 fraction of SIZE) that
// should sit exactly under the real mouse position (the "tip" of each
// icon). Each SVG has a 24x24 viewBox but the visible glyph doesn't fill
// it (there's padding for the drop-shadow filter), so hotspots are given
// as fractions of the rendered size rather than raw source pixels.
const CURSORS = {
  default: { src: cursorArrow, hotspotXFrac: 7 / 24, hotspotYFrac: 3 / 24 },
  pointer: { src: cursorPointer, hotspotXFrac: 9 / 24, hotspotYFrac: 5 / 24 },
  text: { src: cursorText, hotspotXFrac: 12 / 24, hotspotYFrac: 12 / 24 },
};

// The source SVGs have internal padding around the visible glyph (for a
// drop-shadow filter region), so rendering at 24px made the actual icon
// look noticeably smaller than a native OS cursor. 40px brings the visible
// glyph close to native size; tweak here if it still feels off.
const SIZE = 40;

// Block-level / inline text tags where the cursor should show as a text
// (I-beam) caret — i.e. content someone would plausibly select or read as
// running text, as opposed to a layout wrapper (div, section) or an image.
const TEXT_TAGS = new Set([
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'SPAN', 'STRONG', 'EM', 'B', 'I', 'SMALL', 'LI', 'BLOCKQUOTE', 'FIGCAPTION',
]);

// Walks up from `el` to find which cursor state applies.
//
// Deliberately does NOT read getComputedStyle(...).cursor: once the native
// cursor is force-hidden (cursor: none !important on every element, see
// index.css), computed cursor always reports "none", so it can't be used
// to detect intent. Detection instead uses explicit opt-in
// (data-cursor="pointer" | "text" on any element) plus real DOM semantics.
//
// Two passes over the same ancestor chain, not one: an interactive
// ancestor (e.g. an <a> wrapping a <strong>) must win even though the
// inner <strong> is reached first walking outward from el. A single
// combined pass would return "text" as soon as it hit the <strong>,
// before ever seeing the enclosing <a>. So pass 1 walks up looking only
// for an interactive match (or an explicit data-cursor override); only if
// that whole walk finds nothing does pass 2 walk the same chain again to
// find the nearest plain-text tag.
function resolveCursorType(el) {
  const chain = [];
  let node = el;
  while (node && node !== document.documentElement) {
    if (node.nodeType === 1) chain.push(node);
    node = node.parentElement;
  }

  // Pass 1: explicit override or interactive element, closest wins, but an
  // ancestor further up still beats no match at all — so scan the whole
  // chain for the first (closest) hit.
  for (const n of chain) {
    const explicit = n.dataset && n.dataset.cursor;
    if (explicit === 'pointer' || explicit === 'text' || explicit === 'default') {
      return explicit;
    }
    const tag = n.tagName;
    if (
      tag === 'A' ||
      tag === 'BUTTON' ||
      tag === 'SUMMARY' ||
      tag === 'LABEL' ||
      n.getAttribute('role') === 'button' ||
      n.getAttribute('role') === 'link' ||
      (n.tabIndex >= 0 && n.onclick != null)
    ) {
      return 'pointer';
    }
    if (tag === 'INPUT' || tag === 'TEXTAREA' || n.isContentEditable) {
      return 'text';
    }
  }

  // Pass 2: no interactive ancestor anywhere — fall back to the nearest
  // plain-text tag, if any.
  for (const n of chain) {
    if (TEXT_TAGS.has(n.tagName)) return 'text';
  }

  return 'default';
}

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const typeRef = useRef('default');
  const visibleRef = useRef(false);
  const wrapperRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Respect users who've asked for reduced motion / don't force a custom
    // cursor on touch-only devices (no real pointer to track).
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) return;

    document.documentElement.classList.add('custom-cursor-active');

    let target = null;
    const applyPosition = () => {
      const { x, y } = posRef.current;
      if (wrapperRef.current) wrapperRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafRef.current = null;
      // cursor-type resolution (ancestor walk) runs at most once per frame, not once per raw mouse event (1000Hz mice)
      if (target) {
        const tp = resolveCursorType(target);
        target = null;
        if (tp !== typeRef.current) {
          typeRef.current = tp;
          setCursorType(tp);
        }
      }
    };

    const handleMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      target = e.target;
      // position is written straight from the event (events already arrive once per frame): no extra frame of latency
      if (wrapperRef.current) wrapperRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(applyPosition);
      }
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleLeave = () => { visibleRef.current = false; setVisible(false); };
    const handleEnter = () => { visibleRef.current = true; setVisible(true); };
    const handleDown = () => wrapperRef.current?.classList.add('is-pressed');
    const handleUp = () => wrapperRef.current?.classList.remove('is-pressed');

    // mousemove only fires when the physical mouse moves. Scrolling while
    // the cursor sits still changes which element is underneath it, but
    // fires no mousemove — so without this, the cursor type goes stale
    // (e.g. stays "pointer" after a hovered button scrolls away) until the
    // next actual mouse jiggle. Re-resolve from the last known screen
    // position using elementFromPoint whenever the page scrolls.
    let scrollTimer = null;
    const handleScroll = () => {
      // debounce: resolve once scrolling settles instead of forcing a hit-test on every scroll tick
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const { x, y } = posRef.current;
        const elAtPoint = document.elementFromPoint(x, y);
        if (!elAtPoint) return;
        const tp = resolveCursorType(elAtPoint);
        if (tp !== typeRef.current) {
          typeRef.current = tp;
          setCursorType(tp);
        }
      }, 140);
    };

    document.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseenter', handleEnter);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    // capture:true + window so this fires for scrolling inside any nested
    // scroll container too, not just the page itself.
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseenter', handleEnter);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      clearTimeout(scrollTimer);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (window.matchMedia('(pointer: coarse)').matches) return null;

  const { src, hotspotXFrac, hotspotYFrac } = CURSORS[cursorType];

  return (
    <div
      ref={wrapperRef}
      className="custom-cursor"
      style={{
        opacity: visible ? 1 : 0,
        // translate3d positions the cursor at the raw mouse coords; the
        // margin then shifts it so the hotspot (not the top-left corner)
        // sits under the real cursor. Both live in this one React-owned
        // style object — previously transform was written directly to the
        // DOM node via the ref (bypassing React) while margin came from
        // this style object, so whenever cursorType changed and React
        // re-rendered, it overwrote the whole style attribute and
        // clobbered the imperatively-set transform for one frame, causing
        // a visible jump right as the icon swapped between states. Keeping
        // both in the same state-driven object means React always applies
        // them together, in one paint.
        marginLeft: `-${hotspotXFrac * SIZE}px`,
        marginTop: `-${hotspotYFrac * SIZE}px`,
      }}
      aria-hidden="true"
    >
      <img src={src} width={SIZE} height={SIZE} draggable={false} alt="" />
    </div>
  );
}