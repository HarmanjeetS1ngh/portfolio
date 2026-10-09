import { useEffect, useState } from 'react';

const read = () => (window.location.hash.replace(/^#/, '') || '/').replace(/\/+$/, '') || '/';

// Never let the browser restore an old scroll position: every page opens at its top.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

/** Jump to the top instantly, including Lenis' own internal scroll target. */
const toTop = () => {
  window.__lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
};

/** Tiny hash router: returns the current path ('/', '/lab'). */
export default function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      toTop();
      requestAnimationFrame(toTop); // once the new page has mounted
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}