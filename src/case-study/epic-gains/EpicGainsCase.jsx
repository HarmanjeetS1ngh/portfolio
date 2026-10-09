import Hero from "./components/Hero.jsx";
import Reveal from "./components/Reveal.jsx";
import Icon from "./components/Icon.jsx";
import NextProjects from "./components/NextProjects.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import {
  SectionDivider,
  H3,
  P,
  HighlightCard,
  BeforeAfterToggle,
  AutoCarousel,
  TagChip,
  DecisionCard,
  QuoteCallout,
  DesignChallenge,
  toneAt,
} from "./components/ui.jsx";
import {
  meta,
  stats,
  processTags,
  painPoints,
  results,
  walkthrough,
} from "./content.js";

/** Soft blue figure wrapper + figure (placeholder until the real asset is dropped in via `src`). */
const Fig = ({ n, type = "IMG", wide = false, children, ...rest }) => (
  <div
    className={`${wide ? "breakout-lg " : ""}mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8`}
  >
    <HighlightCard n={n} type={type} video={type === "VID"} {...rest}>
      {children}
    </HighlightCard>
  </div>
);

const Cards = ({ items }) => (
  <div className="content-col mt-10 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
    {items.map((c, i) => (
      <DecisionCard
        key={c.title}
        icon={c.icon}
        title={c.title}
        reason={c.reason}
        stat={c.stat}
        index={i}
      />
    ))}
  </div>
);

export default function EpicGainsCase() {
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
              <span
                className={`flex size-10 items-center justify-center rounded-full ${tone.badge}`}
              >
                <Icon name={s.icon} size={20} strokeWidth={2.25} />
              </span>
              <span className="font-display text-[22px] font-bold tracking-[-0.01em] text-ink">
                {s.title}
              </span>
              <div className="flex flex-col gap-2 font-body text-[15px] leading-[1.55] text-ink-2">
                {s.body.map((sentence, si) => (
                  <p key={si}>
                    {sentence.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="font-bold">
                          {part}
                        </strong>
                      ) : (
                        part
                      ),
                    )}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </Reveal>

      {/* Context */}
      <Reveal>
        <SectionDivider label="Context" />
        <H3>It started with a confusing first walkthrough</H3>
        <P>
          ProtoThon 2026 was a <strong>28-hour hackathon</strong> by Dubstack
          and Design Buddies. I participated in the Classic Track with Sukhjeet,
          my junior from college, who has a software development background and
          a good sense of visual design. I led the{" "}
          <strong>UX/UI direction and presentation</strong>, while Sukhjeet
          helped structure the workout and ongoing-workout experiences and
          supported us with visual assets.
        </P>
        <P>
          Our challenge was to{" "}
          <strong>redesign Epic Gains for first-time gym goers</strong>. The
          product already had a Pokémon companion, but when we first tried using
          it, we spent{" "}
          <strong>
            around 30–40 minutes figuring out how the different parts connected
          </strong>
          , even with the explainer video.
        </P>
        <P>
          I had some familiarity with workouts, so I could connect some of the
          loose pieces. Sukhjeet had less gym experience, and his questions made
          the problem much clearer: there was{" "}
          <strong>a lot of information to process</strong> before we understood
          what mattered or what we were supposed to do next. That became our
          starting point:{" "}
          <strong>
            a beginner shouldn't have to understand the whole system before they
            can take the first step
          </strong>
          .
        </P>

        <DesignChallenge>
          Your task is to redesign the EpicGains app so that it is genuinely{" "}
          <strong>easy and motivating for a first-time gym goer</strong> to
          understand what they should do,{" "}
          <strong>log their workouts without it feeling tedious</strong>, and{" "}
          <strong>keep coming back over weeks and months</strong>.
        </DesignChallenge>

        <Fig
          n="1"
          wide
          src="/work/epic-gains/original-epic-gains.webp"
          alt="The original Epic Gains app: the first-day welcome screen, a workout log with sets and reps, and the profile screen in guest mode"
          width={1533}
          height={933}
        >
          The original Epic Gains.
        </Fig>
      </Reveal>

      {/* Problem */}
      <Reveal>
        <SectionDivider label="Problem" />
        <H3>Beginners didn't know where to start</H3>
        <P>
          The feedback provided with the challenge reinforced what we were
          seeing. Beginners <strong>didn't know where to start</strong>,
          struggled to identify exercises, found actions such as “Start Routine”
          unclear, and found repeated workout logging tedious. The brief also
          highlighted <strong>unfamiliar concepts</strong> such as sets, reps,
          muscle groups, and workout structures.
        </P>

        <img
          src="/work/epic-gains/review-quotes.webp"
          alt="Beginner feedback: never having gone to the gym and feeling lost, being unsure why the Pokémon exists, not knowing exercise names, and finding repeated set logging annoying"
          width={2540}
          height={1108}
          loading="lazy"
          decoding="async"
          className="mx-auto mb-10 block h-auto w-full max-w-[880px]"
        />

        <P>
          Rather than treating those as separate features to fix, we saw a{" "}
          <strong>common thread</strong>: too much to understand, too many
          decisions to make, and not enough guidance about what to do next.
        </P>

        <Cards items={painPoints} />

        <P>
          Because we only had 28 hours, we focused on making the beginning of
          the journey{" "}
          <strong>
            easier to enter, easier to follow, and worth returning to
          </strong>
          .
        </P>
      </Reveal>

      {/* Process */}
      <Reveal>
        <SectionDivider label="Process" />
        <div className="content-col mb-6 flex flex-wrap gap-2">
          {processTags.map((t) => (
            <TagChip key={t.label} icon={t.icon}>
              {t.label}
            </TagChip>
          ))}
        </div>

        <H3>We kept Pokémon, but changed what it meant</H3>
        <P>
          The brief gave us complete freedom to replace Pokémon with another
          companion, so we did consider whether we should start fresh. But the
          bigger question was: <strong>why have a companion at all?</strong>
        </P>
        <P>
          A progress tracker can tell a beginner that they earned XP. A
          companion can make that progress feel more personal. We hypothesised
          that <strong>seeing something grow alongside them</strong> could make
          an otherwise abstract fitness journey easier to understand and care
          about.
        </P>
        <P>
          Pokémon already gave us a familiar language of levels, evolution,
          types, and competition, so we decided to{" "}
          <strong>extend that idea</strong> rather than invent an entirely new
          companion system within the hackathon.
        </P>
        <P>
          The original experience kept the Pokémon somewhat separate from the
          workout journal. We brought it into the progress loop instead, making
          the connection between{" "}
          <strong>what the user does and what the companion gains</strong> much
          easier to see.
        </P>
        <P>
          The companion became more than a collectible. It became{" "}
          <strong>a visible representation of the user's consistency</strong>.
        </P>

        <Fig
          n="2"
          wide
          src="/work/epic-gains/fig2-onboarding-dashboard.webp"
          alt="Redesigned onboarding step 'Choose your partner' with Charmander, Squirtle and Bulbasaur, followed by the dashboard showing today's workout, daily streak, and Squirtle's level and XP"
          width={1880}
          height={1842}
          mediaClassName="mx-auto w-full max-w-[680px]"
        >
          The Pokémon in the progress loop.
        </Fig>

        <H3>We learned that the companion shouldn't be everywhere</H3>
        <P>
          Our first attempt placed the Pokémon inside the active workout, beside
          the exercise animation used to demonstrate form.
        </P>
        <P>
          It looked playful, but it{" "}
          <strong>
            competed with the thing the user needed to concentrate on
          </strong>
          . So we moved the Pokémon to the post-workout state, where it could
          react to the user's effort without competing with the exercise
          guidance. That gave us a clearer rule for the experience:
        </P>

        <QuoteCallout>
          The companion should support the workout, not compete with it.
        </QuoteCallout>

        <div className="breakout-lg mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <BeforeAfterToggle
            n="3"
            type="IMG"
            beforeLabel="First concept"
            afterLabel="Revised"
            before={{
              src: "/work/epic-gains/fig3-first-concept.webp",
              alt: "First concept: the workout session screen with Squirtle cheering beside the exercise animation",
              width: 1000,
              height: 2049,
            }}
            after={{
              src: "/work/epic-gains/fig3-revised.webp",
              alt: "Revised workout session screen with the exercise animation only, followed by the post-workout Workout Completed screen with Squirtle, +15 XP, and a workout summary",
              width: 1880,
              height: 1844,
            }}
          >
            First concept to revised post-workout state.
          </BeforeAfterToggle>
        </div>

        <H3>We turned the first few questions into a starting point</H3>
        <P>
          That first 30-minute walkthrough kept influencing our decisions. We
          didn't want a beginner to open the redesign and face another wall of
          information, so{" "}
          <strong>
            onboarding became the place where we removed some of that
            uncertainty
          </strong>
          .
        </P>
        <P>
          We asked for only the information needed to create a reasonable
          starting point:{" "}
          <strong>
            basic body information, current fitness level, goal, and how often
            the user could realistically train
          </strong>
          . Fitness level could influence starting difficulty, the goal could
          change the balance between strength, cardio, or endurance work, and
          training frequency could help distribute the workload.
        </P>
        <P>
          For the hackathon, this was a{" "}
          <strong>
            conceptual rules-based system, not a built recommendation engine
          </strong>
          . Different combinations of those inputs would map to different
          starting workout templates, giving a beginner a starting point without
          first requiring them to understand workout programming.
        </P>
        <P>
          We also kept onboarding optional for people who already knew what they
          wanted to do. The guided path was our priority because the challenge
          was specifically about helping beginners.
        </P>

        <Fig
          n="4"
          wide
          src="/work/epic-gains/fig4-onboarding.webp"
          alt="Onboarding step 2 of 5, 'Where are you starting from?' with Beginner, Intermediate and Returning options"
          width={900}
          height={1842}
          mediaClassName="mx-auto w-full max-w-[340px]"
        >
          Onboarding: questions to a starting plan.
        </Fig>

        <H3>We simplified the language before the workout library</H3>
        <P>
          Another lesson from our first walkthrough was that technical fitness
          language could become a barrier of its own. Instead of making a
          beginner navigate detailed exercise terminology immediately, we
          grouped the starting experience around{" "}
          <strong>
            familiar areas such as arms, shoulders, back, legs, and abs
          </strong>
          .
        </P>
        <P>
          The deeper exercise system could still exist underneath. We were
          simply changing the language the beginner encountered first. The same
          thinking shaped the home screen. I made{" "}
          <strong>Today's Workout the primary visual action</strong>, while
          streaks and Pokémon progress supported it.
        </P>

        <Fig
          n="5"
          wide
          src="/work/epic-gains/fig5-workout-page.webp"
          alt="Redesigned Workout page with Today's Workout (Biceps & Triceps), a Daily Challenge, and a Recommended for You card"
          width={900}
          height={1844}
          mediaClassName="mx-auto w-full max-w-[340px]"
        >
          Exercise groups and the home-screen hierarchy.
        </Fig>

        <H3>We wanted the workout to create the log</H3>
        <P>
          The supplied feedback showed that repeatedly entering sets, reps,
          weights, and other information could make journaling tedious.
        </P>
        <P>
          Our direction was to make{" "}
          <strong>the workout itself generate the daily record</strong> rather
          than asking the user to maintain a separate journal. A richer
          journaling system, such as editing different weights across sets, was
          left for V2 so we could focus the first version on the beginner
          journey.
        </P>

        <H3>The first UI pass also needed a reality check</H3>
        <P>
          Once the first version was in place, I ran the core interface through{" "}
          <strong>accessibility checks</strong>. Some workout-card metadata had
          ended up at 8px, so I increased it to 10px for better readability. I
          also used Figma's WCAG contrast checker and changed several
          low-contrast grey elements to white.
        </P>
        <P>
          The main Today's Workout CTA was initially around 28px high. I
          increased the visual button height to roughly 34px, with a wider 120px
          footprint, as a <strong>prototype-level improvement</strong> to
          readability and interaction clarity. I also increased contrast, added
          visual depth, and introduced an arrow cue to make the CTA easier to
          recognise.
        </P>
        <P>
          I gave Today's Workout a distinct background treatment so the primary
          action could stand apart from the supporting cards.
        </P>

        <div className="breakout-lg mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <BeforeAfterToggle
            n="6"
            type="IMG"
            before={{
              src: "/work/epic-gains/fig7-before.webp",
              alt: "Before: home screen with a plain Today's Workout card, a small 'Start now' button, and low-contrast grey metadata",
              width: 900,
              height: 1843,
            }}
            after={{
              src: "/work/epic-gains/fig7-after.webp",
              alt: "After: home screen with a distinct Today's Workout card, larger higher-contrast metadata, and a 'Train now' button with an arrow cue",
              width: 900,
              height: 1842,
            }}
          >
            Accessibility: before / after.
          </BeforeAfterToggle>
        </div>
      </Reveal>

      {/* Proposal */}
      <Reveal>
        <SectionDivider label="Proposal" />
        <H3>A progression system that grows with the user</H3>
        <P>
          The final experience connected the workout to{" "}
          <strong>a companion that could visibly grow with the user</strong>.
          The final submission was designed in Figma, with a lightweight
          prototype used to demonstrate the core flow.
        </P>

        <div className="breakout-lg mt-10 mb-10 overflow-hidden rounded-2xl bg-accent-soft py-4 md:py-8">
          <AutoCarousel n="7" slides={walkthrough}>
            Final prototype walkthrough, from welcome to re-engagement.
          </AutoCarousel>
        </div>

        <P>
          We deliberately paced progression:{" "}
          <strong>early levels were easier to reach</strong> so a beginner could
          quickly understand the relationship between showing up and making
          progress, while later levels required more XP and turned evolution
          into a longer-term milestone.
        </P>
        <P>
          We also explored <strong>optional quick challenges</strong> for days
          when a full workout wasn't realistic. A short activity, such as a
          10-minute ab or skipping challenge, could earn a smaller amount of XP.
          It wasn't meant to replace the planned workout; it gave the user a
          smaller way to keep the habit moving when time was limited.
        </P>

        <H3>Re-engagement was designed around recovery, not failure</H3>
        <P>The companion also had a role outside the workout.</P>
        <P>
          For instance, if a user usually trained later in the day, the Pokémon
          could <strong>send a workout-specific reminder</strong> beforehand
          based on that day's session. If the workout was missed, a later
          follow-up could{" "}
          <strong>
            check in rather than immediately framing the missed session as
            failure
          </strong>
          .
        </P>
        <P>
          Repeated inactivity could gradually change how the Pokémon looks and
          behaves:
        </P>

        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/work/epic-gains/moods-vertical.webp"
            width={732}
            height={2378}
          />
          <img
            src="/work/epic-gains/moods.webp"
            alt="Squirtle's three mood states: energetic and proud with fists raised, quiet and still sitting down, and back turned lying down with its shell facing up"
            width={1760}
            height={556}
            loading="lazy"
            decoding="async"
            className="mx-auto mt-10 mb-10 block h-auto w-full max-w-[880px] max-md:max-w-[366px]"
          />
        </picture>

        <P>
          That back-turned pose was meant to read as{" "}
          <strong>withdrawn rather than angry or reproachful</strong>: the
          companion is no longer energetic because the relationship has gone
          quiet. We deliberately paired that emotional signal with{" "}
          <strong>a way back in</strong>, such as a short skipping or core
          challenge, so the user could restore some of that connection through a
          manageable action.
        </P>
        <P>
          More severe ideas, such as the Pokémon physically weakening or losing
          levels, were discussed but deliberately left out of the submitted
          concept.
        </P>

        <Fig
          n="8"
          wide
          src="/work/epic-gains/fig10-notification.webp"
          alt="Phone lock screen showing an Epic Gains notification with Squirtle: 'Hey... we still training today? Squirtle's waiting for you to smash your biceps today'"
          width={900}
          height={1842}
          mediaClassName="mx-auto w-full max-w-[340px]"
        >
          A workout-specific reminder from Squirtle on the lock screen.
        </Fig>

        <H3>My role</H3>
        <P>
          I led the UX/UI design and presentation for the project. I{" "}
          <strong>designed the home screen from scratch</strong>, created the
          workout-card elements, shaped the onboarding and information
          hierarchy, ran the accessibility checks, and refined the interface as
          the different parts of the product came together.
        </P>
        <P>
          Sukhjeet helped structure the workout and ongoing-workout experiences
          and supported us with visual assets. We collaborated on the overall
          concept, while my main responsibility was{" "}
          <strong>
            turning that concept into a coherent interface and presentation
            story
          </strong>
          .
        </P>
      </Reveal>

      {/* Result */}
      <Reveal>
        <SectionDivider label="Result" />
        <H3>We placed 2nd in the Classic Track</H3>
        <P>
          We completed the prototype and presentation{" "}
          <strong>within the 28-hour hackathon</strong> and placed{" "}
          <strong>2nd in the Classic Track</strong>.
        </P>

        <Cards items={results} />

        <P>
          Their feedback specifically highlighted the{" "}
          <strong>storytelling and Pokémon progression</strong>, while asking{" "}
          <strong>
            what users could actually do as a result of levelling up
          </strong>
          .
        </P>
        <P>
          That gave us a clear V2 direction. For beginners, I'd explore{" "}
          <strong>small guided challenges before social competition</strong>,
          because they extend the core workout habit without introducing
          comparison too early. A deeper community layer could follow once the
          core habit feels comfortable.
        </P>

        <H3>What We'd Validate Next</H3>
        <P>
          The first usability study would test whether a beginner can{" "}
          <strong>
            complete onboarding, understand today's workout, and start
            exercising
          </strong>{" "}
          without help. I'd then check whether the{" "}
          <strong>
            link between completing a workout and progressing the Pokémon
          </strong>{" "}
          feels clear and meaningful.
        </P>
        <P>
          Next, I'd test the <strong>retention loop</strong>: whether spaced
          evolution milestones, quick challenges, and companion feedback give
          users <strong>a reason to return</strong> after the initial novelty
          fades. We designed these to address that risk, but{" "}
          <strong>didn't have time to validate them</strong>.
        </P>
        <P>
          I'd also test the <strong>companion's emotional side</strong>. The
          low-mood states should make inconsistency visible without becoming{" "}
          <strong>shame-inducing</strong>, so we'd need to see whether the
          recovery suggestions actually feel helpful.
        </P>
        <P>
          The <strong>social layer would come later</strong>, after
          understanding the core habit. I'd then explore whether leagues,
          recognition, and friendly competition can add{" "}
          <strong>motivation without adding pressure</strong>.
        </P>
      </Reveal>

      {/* Learnings */}
      <Reveal>
        <SectionDivider label="Learnings" />

        <img
          src="/work/epic-gains/learnings-notes.webp"
          alt="Three sticky notes: 'A fun mechanism becomes useful when it gives the user's actions a clear purpose', 'Limited time forces you to focus on the parts of the experience that matter most', and 'Removing unnecessary elements can make the remaining interaction clearer and more meaningful'"
          width={1064}
          height={894}
          loading="lazy"
          decoding="async"
          className="mx-auto mb-10 block h-auto w-full max-w-lg"
        />

        <H3>Separate a fun mechanic from a useful mechanic</H3>
        <P>
          Pokémon only became meaningful when{" "}
          <strong>its progression reflected the user's behaviour</strong>. The
          character was the vehicle; the real challenge was making{" "}
          <strong>progress feel visible and personal</strong>.
        </P>

        <H3>Prioritisation matters under pressure</H3>
        <P>
          With 28 hours, we couldn't build the whole ecosystem. We{" "}
          <strong>focused on the core beginner journey</strong> and left deeper
          journaling, social features, and advanced progression for later.
        </P>

        <H3>Less space can make a role clearer</H3>
        <P>
          We first placed the Pokémon inside the active workout, but{" "}
          <strong>removing it made the experience clearer</strong>. The user
          could focus on the exercise, while the companion had{" "}
          <strong>a stronger moment afterward</strong>.
        </P>

        <H3>Final Takeaway</H3>
        <P>
          We started with a fitness app where Pokémon sat beside the main
          experience. We redesigned that relationship so the companion became
          part of the user's <strong>progress and recovery loop</strong>, while
          keeping the workout{" "}
          <strong>simple enough for a beginner to follow</strong>.
        </P>
        <P>
          We couldn't prove long-term behaviour change in 28 hours, but we built{" "}
          <strong>a focused hypothesis ready to test</strong>.
        </P>
      </Reveal>

      <Reveal>
        <NextProjects />
      </Reveal>


      <ScrollToTop />
    </div>
  );
}
