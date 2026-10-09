import Appear from './Appear.jsx';
import { profile } from '../config.js';

/** Wordmark in the top-left corner (no buttons, per the brief). */
export default function Header({ route }) {
  if (route === '/' || route.startsWith('/work/')) return null;
  return (
    <header className="pointer-events-none absolute top-5 left-5 z-40 md:top-7 md:left-8">
      <Appear delay={0}>
        <a
          href="#/"
          className="wordmark-stroke pointer-events-auto font-groovy text-2xl font-normal tracking-normal text-ink-0 no-underline"
          style={route === '/lab' ? { color: 'var(--lab-ink, #111)', WebkitTextStrokeColor: 'var(--lab-ink, #111)', transition: 'color 0.4s ease-out' } : undefined}
        >
          {profile.name}
        </a>
      </Appear>
    </header>
  );
}