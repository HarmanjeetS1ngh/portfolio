import Hero from './components/Hero.jsx';
import Reveal from './components/Reveal.jsx';
import Icon from './components/Icon.jsx';
import NextProjects from './components/NextProjects.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { SectionDivider, H3, P, HighlightCard, BeforeAfterToggle, ResponsiveFlows, TagChip, DecisionCard, Callout, QuoteCallout, DesignChallenge, toneAt } from './components/ui.jsx';
import { stats, highlights, reviewThemes, processTags, competitors, testingResults } from './content.js';

export default function App() {
  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-10 px-4 py-6 md:gap-[60px] md:px-5 md:py-10">
      <Hero />

      {/* Problem / Solution / Results */}
      <Reveal className="my-2 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {stats.map((s, ci) => {
          const tone = toneAt(ci);
          return (
            <div
              key={s.title}
              className={`flex flex-col gap-4 rounded-[10px] px-6 py-7 ${tone.card}`}
            >
              <span className={`flex size-10 items-center justify-center rounded-full ${tone.badge}`}>
                <Icon name={s.icon} size={20} strokeWidth={2.25} />
              </span>
              <span className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">
                {s.title}
              </span>
              {s.body.length > 0 && (
                <div className="flex flex-col gap-2 font-body text-[15px] leading-[1.55] text-ink-2">
                  {s.body.map((sentence, si) => {
                    const parts = sentence.split(/\*\*(.+?)\*\*/g);
                    return (
                      <p key={si}>
                        {parts.map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="font-bold">
                              {part}
                            </strong>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </Reveal>

      {/* 01 — Context */}
      <Reveal>
        <SectionDivider label="Context" />
        <H3>It started with one small frustration</H3>
        <P>
          I bought a year-long Crunchyroll subscription and gave it to my sister. While watching anime, she wanted to
          increase the playback speed as usual but <strong>couldn't find the option because it wasn't available</strong>.
          She saw this as a serious red flag and deleted the app.
        </P>
        <P>
          At first, I thought this was simply a missing feature. But after using Crunchyroll more myself, I started
          noticing other moments that felt unnecessarily difficult. Finding an ongoing show, managing what was left in
          Continue Watching, and reaching some playback controls all felt like <strong>they could be smoother</strong>.
        </P>
        <P>
          That made me wonder whether the playback-speed issue was just one small sign of a bigger problem. Instead of
          assuming my experience represented everyone, I decided to{' '}
          <strong>look at what other viewers were actually saying</strong>.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n={highlights[0].n} type={highlights[0].type} src={highlights[0].src} video={highlights[0].type === 'VID'}>
            {highlights[0].caption}
          </HighlightCard>
        </div>
      </Reveal>

      {/* 02 — Problem */}
      <Reveal>
        <SectionDivider label="Problem" />
        <H3>The problem wasn't a lack of content. It was the friction around using it.</H3>
        <P>
          I wanted to understand whether the problems I was noticing were actually common. So I built a{' '}
          <strong>custom review scraper</strong> and collected <strong>900+ Google Play reviews</strong> from April
          2025 to April 2026.
        </P>
       <P>
  I exported the reviews into a CSV and used an AI agent to group them into recurring themes. Of the 900+,{' '}
  <strong>496 were about three problems</strong>: playback controls, managing shows, and resuming a show. I{' '}
  <strong>read all 496 myself</strong> and checked that each one belonged in its theme.
</P>

        <img
          src="/work/crunchyroll/review-quotes.webp"
          alt="Sample user reviews highlighting playback speed, Continue Watching removal, and resume issues"
          width={2359}
          height={1049}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto w-full max-w-[880px]"
        />

        <div className="content-col mt-10 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {reviewThemes.map((r, i) => (
            <DecisionCard key={r.title} icon={r.icon} title={r.title} reason={r.reason} stat={r.stat} index={i} />
          ))}
        </div>

        <P>
          The research changed the question I was trying to answer. I started with{' '}
          <em>"Why can't I change playback speed?"</em>, but the reviews pointed to a wider problem in how people
          resumed, controlled, and managed their viewing. So I reframed the problem:
        </P>

        <DesignChallenge>
          How might Crunchyroll make it easier for viewers to <strong>resume, control, and manage</strong> what
          they're watching?
        </DesignChallenge>
      </Reveal>

      {/* 03 — Process */}
      <Reveal>
        <SectionDivider label="Process" />
        <div className="content-col mb-6 flex flex-wrap gap-2">
          {processTags.map((t) => (
            <TagChip key={t.label} icon={t.icon}>{t.label}</TagChip>
          ))}
        </div>

        <H3>Finding where the friction came from</H3>
        <P>
          The reviews showed what people were frustrated with, but they didn't show{' '}
          <strong>how those problems connected</strong> during a viewing session. So I mapped the journey — from
          finding something to watch, to returning to an unfinished show, controlling playback, and managing the
          queue.
        </P>
        <P>
          Three areas stood out: <strong>Playback & Controls, Resume Watching, and Queue Management.</strong> The
          first focused on making common playback actions easier to access. The second was about helping returning
          viewers quickly get back to an ongoing show. The third was about making queue actions clearer.
        </P>

        <div className="breakout-lg mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="1" type="IMG" src="/work/crunchyroll/user-journey.webp" width={2400} height={1219}>
            Journey map and the three opportunity areas.
          </HighlightCard>
        </div>

        <H3>Not everyone watches in the same way</H3>
        <P>
          I also found two broad viewing behaviours. These weren't meant to be strict user types — they helped me
          think about the <strong>different reasons someone might interact with the same feature</strong>.
        </P>

        <div className="breakout-personas mt-10 mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <img
            src="/work/crunchyroll/persona-intentional-watcher.webp"
            alt="Persona: The Intentional Watcher — already knows what they want to watch and mainly wants to get there quickly"
            width={1185}
            height={570}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-2xl"
          />
          <img
            src="/work/crunchyroll/persona-customization-watcher.webp"
            alt="Persona: The Customization-Oriented Watcher — spends more time adjusting playback and viewing settings to match how they prefer to watch"
            width={1185}
            height={570}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full rounded-2xl"
          />
        </div>

        <H3>I looked at how other streaming apps handled the same problems</H3>
        <P>
          I compared Crunchyroll with <strong>JioHotstar, Prime Video, and YouTube</strong> across the interactions I
          was investigating. Crunchyroll differed in several key moments — faster playback wasn't available, Continue
          Watching was less prominent, and some settings created stronger interruptions because the content was fully
          covered and playback paused.
        </P>

        <div className="content-col mt-10 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {competitors.map((c, i) => (
            <DecisionCard key={c.title} icon={c.icon} title={c.title} reason={c.reason} index={i} />
          ))}
        </div>

        <P>
          I wasn't looking for another platform to copy. I was looking for{' '}
          <strong>patterns that could make the experience feel more natural</strong>. That gave me three principles to
          work with:
        </P>

        <QuoteCallout>
          Reduce interruption. Increase visibility. Clarify intent.
        </QuoteCallout>

        <H3>Exploring the interactions</H3>
        <P>
          Once I had the problem areas, I started exploring how each interaction should behave through user flows and
          wireframes. The question wasn't just where a feature should live. I wanted to understand{' '}
          <strong>what should happen when someone actually used it</strong>.
        </P>

        <div className="breakout-lg mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <ResponsiveFlows
            n="2"
            combined={{
              src: '/work/crunchyroll/user-flows.webp',
              alt: 'User flows for Playback Control, Resume Watching, and Queue Management',
              width: 2400,
              height: 2255,
              caption: 'User flows for Playback, Resume, and Queue.',
            }}
            flows={[
              { src: '/work/crunchyroll/user-flows/playback-control.webp', alt: 'Playback Control user flow', width: 1594, height: 4368, caption: 'Playback Control flow.' },
              { src: '/work/crunchyroll/user-flows/resume-watching.webp', alt: 'Resume Watching user flow', width: 1594, height: 4458, caption: 'Resume Watching flow.' },
              { src: '/work/crunchyroll/user-flows/queue-management.webp', alt: 'Queue Management user flow', width: 1594, height: 4458, caption: 'Queue Management flow.' },
            ]}
          />
        </div>

        <H3>Playback controls</H3>
        <P>
          I explored keeping frequently used playback actions within the player instead of sending viewers through
          separate settings screens. This led to <strong>faster playback, combined audio and subtitle settings,
          sleep timer, screen lock, fullscreen, and playback-issue reporting</strong>.
        </P>

        <H3>Queue management</H3>
        <P>
          The queue needed a clearer distinction between two actions: finishing something and simply removing it
          from Continue Watching. I separated <strong>Mark as watched</strong> from{' '}
          <strong>Remove from Continue Watching</strong>, so each action had a different outcome.
        </P>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="3" type="VID" src="/work/crunchyroll/queue-flow-walkthrough.mp4" video width={1080} height={1920} mediaClassName="mx-auto max-w-[280px] sm:max-w-[320px]">
            Queue interaction flow.
          </HighlightCard>
        </div>

        <H3>The home screen didn't work the first time</H3>
        <P>
          My first low-fi version made the promotional banner much smaller so Continue Watching could appear higher in
          the viewport. It looked fine until I moved into high-fidelity and introduced actual anime artwork. The
          smaller banner <strong>didn't leave enough room</strong> for the poster, title, and supporting information,
          and the overlays started covering important parts of the artwork.
        </P>
        <P>
          I had to balance giving returning viewers quick access to their shows with giving featured anime enough
          space to communicate properly. I increased the promotional area to a safer size while keeping Continue
          Watching visible within the initial viewport.
        </P>
        <P>
          This was one of the more useful moments in the project because it showed me that a layout can work with
          boxes in a wireframe and still fail when real content is introduced.
        </P>

        <Callout icon="Layers" tone="accent">
          The design had to work with the content, not just the layout.
        </Callout>

        <div className="breakout-lg mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <BeforeAfterToggle
            n="4"
            type="IMG"
            variant="fidelity"
            beforeLabel="Lo-fi"
            afterLabel="Hi-fi"
            before={{
              src: '/work/crunchyroll/Group 74.webp',
              alt: 'Low-fidelity wireframes comparing Direction A and the selected Direction B for the home screen banner',
              width: 2400,
              height: 1203,
            }}
            after={{
              src: '/work/crunchyroll/HomeScreen Redesign-1 2.webp',
              alt: 'High-fidelity redesigned Crunchyroll home screen with Continue Watching visible in the initial viewport',
              width: 1245,
              height: 2694,
            }}
          >
            Low-fi to high-fi: the banner iteration.
          </BeforeAfterToggle>
        </div>
      </Reveal>

      {/* 04 — Proposal */}
      <Reveal>
        <SectionDivider label="Proposal" />
        <H3>A viewing experience built around getting back to watching</H3>
        <P>
          The final direction focused on the three moments that came out of the research:{' '}
          <strong>Resume → Control → Manage</strong>. Instead of redesigning the entire product, I focused on making
          those parts of the experience work together more naturally.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="5" type="VID" src="/work/crunchyroll/full-walkthrough.mp4" video width={1080} height={1920} mediaClassName="mx-auto max-w-[280px] sm:max-w-[320px]">
            Final product walkthrough.
          </HighlightCard>
        </div>

        <H3>A clearer path back to ongoing shows</H3>
        <P>
          The redesigned home screen brings <strong>Continue Watching into the initial viewport</strong>, while
          keeping the promotional banner large enough to present featured anime properly. The rest of the content
          follows below it, including the watchlist and discovery sections.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="6" type="IMG" src="/work/crunchyroll/home-screen-before-after.webp" width={3048} height={1710} alt="Before and after comparison of the Crunchyroll home screen, showing Continue Watching moved above the fold with a reduced banner height">
            Before / after: the home screen.
          </HighlightCard>
        </div>

        <H3>Playback controls without leaving the content</H3>
        <P>
          The redesigned player brings faster playback and the most relevant viewing controls directly into the
          player. Audio and subtitle settings are combined, while sleep timer, screen lock, fullscreen, and
          playback-issue reporting are also available from the viewing interface. The controls follow{' '}
          <strong>familiar media-player patterns</strong>, so the interaction doesn't require viewers to learn a new
          system.
        </P>

        <div className="mt-10 mb-4 flex flex-col gap-8 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="7" type="IMG" src="/work/crunchyroll/player-before-after.webp" width={3000} height={2140} alt="Before and after comparison of the player settings panel, showing a compact panel that keeps video context visible and groups audio and subtitle options">
            Before / after: the player.
          </HighlightCard>
          <HighlightCard n="8" type="VID" src="/work/crunchyroll/player-walkthrough.mp4" video width={1920} height={1080} mediaClassName="mx-auto w-full max-w-[860px]">
            Player walkthrough.
          </HighlightCard>
        </div>

        <H3>Queue actions that say what they mean</H3>
        <P>
          The redesigned quick-action menu separates <strong>Remove from Continue Watching</strong> from{' '}
          <strong>Mark as watched</strong>. Marking something as watched lets the series move forward, while removing
          it simply takes the show out of the queue without adding the next episode. A share option is also available
          from the same menu.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="9" type="IMG" src="/work/crunchyroll/three-dot-menu-before-after.webp" width={3042} height={1710} alt="Before and after comparison of the three-dot quick-action menu, showing direct removal from Continue Watching with optimistic UI feedback and undo">
            Before / after: the three-dot menu.
          </HighlightCard>
        </div>
      </Reveal>

      {/* 05 — Result */}
      <Reveal>
        <SectionDivider label="Result" />
        <H3>Testing the original experience and the redesign</H3>
       <P>
  I tested the original app and the figma prototype of the redesign with <strong>two separate groups of five participants</strong>,
  and nobody had seen either version before. Each group had four people aged 18–27 and one older participant
  (45yo on the original, 50yo on the redesign). I recruited them from my <strong>personal connections and
  relatives</strong>. I told them what to do, not how, and used a stopwatch where timing mattered.
</P>
      
        <div className="content-col mt-10 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {testingResults.map((r, i) => (
            <DecisionCard key={r.title} icon={r.icon} title={r.title} reason={r.reason} stat={r.stat} index={i} />
          ))}
        </div>

       <H3>The original app</H3>
<P>
  Continue Watching was harder to find than it needed to be. Everyone looked near the top of the home screen,
  and one participant pointed out that other apps show it as soon as they open. The bigger issue came when they
  tried to remove a show. The three-dot menu had no remove option, so most tried <strong>Mark as watched</strong>,
  which added the next episode in the queue instead of removing the show permanently. Only <strong>1 of 5</strong> figured out that the episode had to be
  removed from history. The other four <strong>cleared their entire history and lost the whole row</strong>.
  The 45-year-old participant took the longest and said the process could be easier. All five looked to me for
  confirmation before moving on.
</P>
<P>
  Before the speed task, everyone said they preferred 1.5× or 2× speeds for watching content in a casual talk prior testing. But <strong>none could increase the speed</strong>,
  because the original only offered slower playback. One participant laughed when that was all the menu showed.
</P>
<H3>The redesign</H3>
<P>
  I separated <strong>Remove from Continue Watching</strong> from <strong>Mark as watched</strong>, so the two
  actions matched two different intentions. All five removed a show in <strong>under 10 seconds</strong> and
  changed playback speed in <strong>under 4 seconds</strong>, with <strong>0 wrong taps</strong>. The
  50-year-old participant finished in under 10 seconds too. This time, nobody looked to me for confirmation.
</P>
        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard n="10" type="IMG" src="/work/crunchyroll/result-metrics.webp" width={1974} height={1320} alt="Table comparing before and after results for resuming a show, adjusting playback speed, and clearing the continue watching queue" mediaClassName="[&>img]:rounded-none">
            Testing results: before / after.
          </HighlightCard>
        </div>

   
<P>
  The redesigned interactions worked for the scenarios I tested. I only had one older participant in each group,
  so I can't say yet whether these changes work better for older viewers. <strong>That needs more testing.</strong>
</P>
        <P>
          Playback and queue friction were also the two largest complaint categories in the review data. If that
          friction is what pushes viewers to leave the app the way my sister did, <strong>closing it isn't just a
          usability fix — it's a retention lever</strong>.
        </P>

        <H3>What I would validate next</H3>
    <P>
  I tested two groups of five because this was a self-initiated project with limited time. That was enough to
  see clear interaction problems, but <strong>not enough to make broader claims</strong> about Crunchyroll's
  wider audience. The theme percentages are shares of the 496 relevant reviews, not of all 900+. I coded them
  alone, and reviews only come from people who chose to write one.
</P>
        <P>
          My first priority would be testing the <strong>home-screen hierarchy with a larger group</strong>. There
          are still two goals to balance: making Continue Watching easy to reach while giving featured anime enough
          space to be discovered. I'd first look at whether people notice the featured content without losing sight
          of their ongoing shows. Then I'd look at whether the position of the Watchlist and other discovery sections
          changes what people actually use.
        </P>
      </Reveal>

      {/* Learnings */}
      <Reveal>
        <SectionDivider label="Learnings" />

        <img
          src="/work/crunchyroll/learnings-notebook.webp"
          alt="Handwritten notebook page of learnings from the project"
          width={3330}
          height={2594}
          loading="lazy"
          decoding="async"
          className="mb-10 block h-auto w-full max-w-lg mx-auto"
        />

        <H3>Start with the frustration</H3>
        <P>
          My sister's issue started the project. Reviews showed it was part of a wider pattern.
        </P>

        <H3>Feature ≠ experience</H3>
        <P>
          A feature only works when people can find it, understand it, and use it as expected.
        </P>

        <H3>Balance, don't sacrifice</H3>
        <P>
          The home screen had to support both returning and discovering content.
        </P>

        <H3>Real content tests the design</H3>
        <P>
          Real anime artwork exposed problems that placeholders hid.
        </P>
      </Reveal>

      {/* Next projects */}
      <Reveal>
        <NextProjects />
      </Reveal>

      <ScrollToTop />
    </div>
  );
}