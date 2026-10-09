import { useEffect, useState } from 'react';

/* ───────────────────────────────────────────────────────────────────────────
   LOTTIE SUPPORT — read this before you drop in animated emoji.

   EmojiGlyph picks a renderer from the file extension, so switching a single
   path in content.js is all it takes to change format:

     '/work/securelancer/emoji/tired_face.png'    → <img>          (works today)
     '/work/securelancer/emoji/tired_face.webp'   → <img>          (animated WebP, no deps)
     '/work/securelancer/emoji/tired_face.gif'    → <img>          (animated GIF, no deps)
     '/work/securelancer/emoji/tired_face.json'   → Lottie         (needs the player below)
     '/work/securelancer/emoji/tired_face.lottie' → Lottie         (needs the player below)
     { char: '😫' }                    → plain text emoji

   Fluent Emoji ship as animated WebP as well as Lottie JSON. If you only want
   motion and not runtime control, use the .webp files and skip all of this —
   the <img> branch already handles them.

   To turn the Lottie branch on:
     1. npm i lottie-react
     2. uncomment the import on the next line
     3. delete the `const Lottie = null;` line under it
─────────────────────────────────────────────────────────────────────────── */

// import Lottie from 'lottie-react';
const Lottie = null;

const isLottie = (src = '') => /\.(json|lottie)(\?.*)?$/i.test(src);

/** Module-level cache so the same JSON is never fetched twice. */
const lottieCache = new Map();

export const loadLottie = (src) => {
  if (!lottieCache.has(src)) {
    lottieCache.set(
      src,
      fetch(src)
        .then((r) => {
          if (!r.ok) throw new Error(`${r.status} ${src}`);
          return r.json();
        })
        .catch((err) => {
          console.warn('[EmojiGlyph] could not load Lottie:', err);
          return null;
        }),
    );
  }
  return lottieCache.get(src);
};

/** Warm the cache for a whole set of emoji up front. */
export const preloadEmojis = (emojis) => {
  emojis.forEach((e) => {
    if (!e?.src) return;
    if (isLottie(e.src)) loadLottie(e.src);
    else {
      const img = new Image();
      img.src = e.src;
    }
  });
};

const useLottieData = (src, enabled) => {
  const [data, setData] = useState(() => null);

  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    loadLottie(src).then((json) => {
      if (alive) setData(json);
    });
    return () => {
      alive = false;
    };
  }, [src, enabled]);

  return data;
};

/**
 * One emoji, whatever format it happens to be in.
 *
 * @param emoji  { src, alt } or { char }
 * @param size   px — the glyph is square
 * @param reduce when true the Lottie holds on its first frame
 */
export default function EmojiGlyph({ emoji, size = 20, className = '', reduce = false }) {
  const src = emoji?.src;
  const lottie = isLottie(src);
  const data = useLottieData(src, lottie && !!Lottie);

  const box = { width: size, height: size };

  if (emoji?.char || !src) {
    return (
      <span className={className} style={{ ...box, fontSize: size, lineHeight: `${size}px` }}>
        {emoji?.char ?? ''}
      </span>
    );
  }

  if (lottie && Lottie && data) {
    return (
      <span className={className} style={box}>
        <Lottie
          animationData={data}
          loop
          autoplay={!reduce}
          style={box}
          rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
        />
      </span>
    );
  }

  // Covers png / webp / gif / svg, and is also the fallback while a Lottie
  // loads or if the player hasn't been installed yet.
  return (
    <img
      src={lottie ? src.replace(/\.(json|lottie)$/i, '.png') : src}
      alt=""
      aria-label={emoji?.alt || undefined}
      draggable={false}
      className={`select-none ${className}`}
      style={box}
    />
  );
}
