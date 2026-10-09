// Warms the case-study hero assets so the banner is already cached when a card is opened.
// Purely additive: it only issues background fetches and never touches rendering or routing.
const ASSETS = {
  'epic-gains': ['/work/epic-gains/hero-banner.webp', '/work/epic-gains/hero-element.webp'],
  crunchyroll: ['/work/crunchyroll/hero-banner.webp', '/work/crunchyroll/hero-element.webp'],
  securelancer: ['/work/securelancer/hero_image.webp'],
};
const CHUNKS = {
  'epic-gains': () => import('./case-study/epic-gains/EpicGainsCase.jsx'),
  crunchyroll: () => import('./case-study/crunchyroll/CrunchyrollCase.jsx'),
  securelancer: () => import('./case-study/securelancer/SecurelancerCase.jsx'),
};
const done = new Set();

function warmImages(slug) {
  (ASSETS[slug] || []).forEach((u) => {
    const i = new Image();
    i.decoding = 'async';
    i.src = u;
  });
}

function warm(slug, withChunk) {
  if (!ASSETS[slug]) return;
  if (!done.has(slug)) { done.add(slug); warmImages(slug); }
  if (withChunk && !done.has('c:' + slug)) { done.add('c:' + slug); CHUNKS[slug]().catch(() => {}); }
}

export default function startWarmCaseStudy() {
  const onIntent = (e) => {
    const a = e.target && e.target.closest ? e.target.closest('a[href*="#/work/"]') : null;
    if (!a) return;
    const slug = (a.getAttribute('href').split('#/work/')[1] || '').replace(/\/$/, '');
    warm(slug, true);
  };
  ['pointerover', 'touchstart', 'focusin'].forEach((ev) => document.addEventListener(ev, onIntent, { passive: true, capture: true }));

  // After the page has fully loaded and gone quiet, quietly cache the banners (images only).
  const idle = () => setTimeout(() => Object.keys(ASSETS).forEach((s) => warm(s, false)), 3000);
  if (document.readyState === 'complete') idle();
  else addEventListener('load', idle, { once: true });
}
