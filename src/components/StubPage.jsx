import Appear from './Appear.jsx';

/** Placeholder for pages you haven't built yet. It exists so the page
 *  transition can be seen when you navigate from the dock. */
export default function StubPage({ title }) {
  return (
    <section className="hero-wash flex min-h-svh flex-col items-center justify-center px-6 pb-40 text-center">
      <Appear delay={0}>
        <span className="font-mono-ui text-xs font-bold tracking-[0.04em] text-ink-2 uppercase md:text-sm">
          {title}
        </span>
      </Appear>
      <Appear as="h1" delay={0.2} className="mt-4 font-display text-[clamp(40px,7vw,84px)] leading-[1.02] font-bold tracking-[-0.035em] text-ink-0">
        {title}
      </Appear>
      <Appear as="p" delay={0.4} className="mt-5 font-body text-lg text-ink-2 md:text-xl">
        This page is coming soon.
      </Appear>
      <Appear delay={0.6} className="mt-8">
        <a
          href="#/"
          className="font-mono-ui text-xs font-bold tracking-[0.04em] text-ink-0 uppercase underline underline-offset-4 md:text-sm"
        >
          Back home
        </a>
      </Appear>
    </section>
  );
}
