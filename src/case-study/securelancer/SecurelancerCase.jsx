import Hero from './components/Hero.jsx';
import Reveal from './components/Reveal.jsx';
import Icon from './components/Icon.jsx';
import ContactFlowToggle from './components/ContactFlowToggle.jsx';
import Recon from './components/Recon.jsx';
import NextProjects from './components/NextProjects.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { SectionDivider, H3, P, HighlightCard, HighlightVideoPair, BeforeAfterToggle, RailStepper, TagChip, DecisionCard, Callout, QuoteCallout, DesignChallenge, toneAt } from './components/ui.jsx';
import { meta, stats, highlights, processTags, interactionModels, trustSignals } from './content.js';

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
            </div>
          );
        })}
      </Reveal>

      {/* Highlights */}
      <Reveal>
        <SectionDivider label="Highlights" />
        <div className="flex flex-col gap-8 rounded-2xl bg-accent-soft p-4 md:gap-10 md:p-8">
          {highlights.map((h) => (
            <HighlightCard key={h.n} n={h.n} type={h.type} src={h.src} poster={h.poster} video={h.video} alt={h.alt} width={h.width} height={h.height}>
              {h.caption}
            </HighlightCard>
          ))}
        </div>
      </Reveal>

      {/* Context & Problem */}
      <Reveal>
        <SectionDivider label="Context & Problem" />
        <P>
          TheSecureLancer is a one-person cybersecurity consultancy. The owner wanted the website to become a direct
          way to reach clients instead of depending on freelance platforms. I redesigned and built the experience
          around one question: <strong>what does a visitor need at this exact moment, and what can wait?</strong>
        </P>
        <P>
          The existing website had the right ingredients, but the experience made it{' '}
          <strong>
            difficult for a potential client to understand what was relevant, decide what to do next, and reach the
            expert.
          </strong>{' '}
          Visually, the site communicated cybersecurity, but felt similar to many AI-generated technology websites
          rather than distinctly belonging to this particular consultant.
        </P>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <BeforeAfterToggle
            n={1}
            before={{ src: '/work/securelancer/before-homepage.webp', alt: 'The original TheSecureLancer homepage', width: 1949, height: 1150 }}
            after={{ src: '/work/securelancer/before-homepage-v2.webp', alt: 'The redesigned homepage', width: 1949, height: 1150 }}
          >
            Before and after: the homepage redesign.
          </BeforeAfterToggle>
        </div>
      </Reveal>

      {/* Process */}
      <Reveal>
        <SectionDivider label="Process" />
        <div className="content-col mb-6 flex flex-wrap gap-2">
          {processTags.map((t) => (
            <TagChip key={t.label} icon={t.icon}>{t.label}</TagChip>
          ))}
        </div>

        <H3>Finding the friction</H3>
        <P>
          Since the owner had <strong>limited availability</strong> and there was{' '}
          <strong>no existing audience available for research</strong>, I{' '}
          <strong>audited the existing product directly</strong> instead of presenting assumptions as findings. I used
          the site's <strong>content</strong>, <strong>business goals</strong>, and{' '}
          <strong>repeated structured walkthroughs</strong> of the experience to build a more holistic view of how the
          product worked.
        </P>
        <P>
          What I found was slightly different from what I expected. The problem wasn't a lack of relevant content; it
          was almost the opposite. There was{' '}
          <strong>too much information distributed across too many contexts</strong>, without enough consideration for{' '}
          <strong>what a visitor actually needed at each point in their journey</strong>.
        </P>
        <P>
          That shifted the problem from a <strong>general website redesign</strong> to a{' '}
          <strong>more specific question</strong>:
        </P>

        <DesignChallenge>
          How can the existing information be <strong>structured</strong> so visitors can{' '}
          <strong>understand, evaluate, and act</strong> without <strong>unnecessary effort</strong>?
        </DesignChallenge>

        <H3>Simplifying the information architecture</H3>
        <P>
          The information was distributed in a <strong>loosely connected structure</strong> where visitors had to explore
          specific pages to find specific information. That approach can make sense for an e-commerce website with
          millions of products, but it felt <strong>unnecessary for a single-person consultancy</strong> with a much
          smaller and more focused offering.
        </P>
        <P>
          I restructured the information architecture around a <strong>simpler, more linear content journey</strong>.
          Instead of asking visitors to figure out where each piece of information lived, the structure{' '}
          <strong>guides them through the questions they naturally have</strong>. This became the foundation for the
          rest of the redesign.
        </P>

        <H3>Structuring information without overwhelming visitors</H3>
        <P>
          The site still had a lot of information to communicate, especially within the service catalogue and case
          studies. Simply putting everything into a simpler structure wouldn't solve the problem if each section still
          felt like <strong>a wall of information</strong>.
        </P>
        <P>
          I therefore used <strong>chunking</strong> throughout the experience to break dense information into smaller,
          easier-to-process groups. This helped structure the <strong>service catalogue</strong>,{' '}
          <strong>service details</strong>, and separate pages for <strong>case studies</strong> without removing the depth that visitors
          might need.
        </P>

        <div className="mt-10 mb-10 flex flex-col gap-10 rounded-2xl bg-accent-soft p-4 md:gap-14 md:p-8">
          <HighlightCard
            n={2}
            type="IMG"
            src="/work/securelancer/before-services.webp"
            alt="The original service catalogue, a flat scrolling wall of 26 cards"
          >
            The original 26-service wall.
          </HighlightCard>

          <HighlightCard
            n={3}
            type="VID"
            video
            src="/work/securelancer/chunking-service-case-study.mp4"
            poster="/work/securelancer/chunking-service-case-study-poster.webp"
            width={1600}
            height={900}
            alt="Screen recording of the service catalogue, chunked into categories and cards, and the case studies section with each challenge summarised in a single card"
          >
            Chunked into categories and cards.
          </HighlightCard>
        </div>
        <P>
          For the <strong>FAQs</strong>, I looked at the kinds of questions people commonly ask during initial scope
          conversations and the general queries found on expert freelance profiles. I then used{' '}
          <strong>progressive disclosure</strong> so visitors could access the answers they needed without having to
          process every question at once.
        </P>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={4}
            type="VID"
            video
            src="/work/securelancer/chunking-faqs.mp4"
            poster="/work/securelancer/chunking-faqs-poster.webp"
            width={1600}
            height={900}
            alt="Screen recording of the Everything You Need to Know section with five numbered FAQ questions collapsed into single rows, opening to show progressive disclosure of answers"
          >
            FAQs collapsed by default.
          </HighlightCard>
        </div>

        <H3>Reducing the jargon</H3>
        <P>
          Cybersecurity naturally comes with a lot of technical language, and even someone familiar with technology can
          find an <strong>unfamiliar security term intimidating</strong>.
        </P>
        <P>
          I wanted to <strong>preserve the technical depth</strong> of the consultancy without making visitors work
          through unnecessary jargon. So I reframed the site's content in a{' '}
          <strong>more direct and approachable language</strong>, keeping the meaning intact while making the
          information easier to understand.
        </P>
        <P>
          I used <strong>Claude as a writing aid</strong> to review and improve the language across the site,
          particularly for <strong>readability, clarity, and consistency</strong>.
        </P>

        <H3>Exploring the interaction model</H3>
        <P>
          Once the information architecture and content structure were clearer, I explored how visitors should interact
          with the <strong>most information-heavy parts</strong> of the experience. For the service catalogue, I{' '}
          <strong>explored several approaches</strong> rather than jumping straight to a solution.
        </P>
        <div className="mt-10 mb-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {interactionModels.map((m, i) => (
            <DecisionCard key={m.title} {...m} index={i} />
          ))}
        </div>

        {/* width/height = each clip's true display ratio (the tablet clip has a non-square pixel
            aspect ratio, so it is 695:861, not its 1390x1080 encoded size) */}
        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightVideoPair
            n={5}
            type="VID"
            items={[
              {
                src: '/work/securelancer/drawer-tablet.mp4',
                poster: '/work/securelancer/drawer-tablet-poster.webp',
                width: 695,
                height: 861,
                alt: 'Screen recording of the service drawer interaction on tablet',
              },
              {
                src: '/work/securelancer/drawer-mobile.mp4',
                poster: '/work/securelancer/drawer-mobile-poster.webp',
                width: 267,
                height: 530,
                alt: 'Screen recording of the service drawer interaction on mobile',
              },
            ]}
          >
            Service drawer interaction on tablet and mobile.
          </HighlightVideoPair>
        </div>

        <P>
          I chose the <strong>side drawer</strong> because it allowed visitors to{' '}
          <strong>explore different services quickly</strong> while keeping the rest of the journey in context. They
          could <strong>move between services without repeatedly leaving one page</strong>, while the content hierarchy
          kept the amount of information shown at once manageable.
        </P>

        <H3>Rebuilding and testing the contact flow</H3>
        <P>
          The original contact flow focused more on <strong>understanding the situation</strong> than helping a
          potential client <strong>quickly reach the expert</strong>. I reframed it around a simpler question:{' '}
          <strong>what does the expert actually need to know before the first call?</strong> The goal was to collect
          enough context to make the conversation useful without asking visitors to prepare information they shouldn't
          need or <strong>diagnose their own cybersecurity problem</strong>.
        </P>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <RailStepper
            n={6}
            steps={[
              { src: '/work/securelancer/before-contact-1.webp', alt: 'Old contact flow step 1 of 4: basic contact details', label: 'Contact details', width: 913, height: 765 },
              { src: '/work/securelancer/before-contact-2.webp', alt: 'Old contact flow step 2 of 4: choose a service area', label: 'Service area', width: 939, height: 721 },
              { src: '/work/securelancer/before-contact-3.webp', alt: 'Old contact flow step 3 of 4: deep technical questions about an existing system', label: 'Technical questions', width: 806, height: 791 },
            ]}
          >
            The original 4-step contact flow.
          </RailStepper>
        </div>

        <Callout icon="Info" tone="green">
          The original step counter had a UI bug where it displayed <strong>"of 3"</strong> until the visitor
          reached step 3, only then correcting itself to <strong>"of 4"</strong> — the flow itself was always
          4 steps.
        </Callout>

        <P>
          The redesigned flow asks for <strong>only the essentials</strong>: basic information, a relevant service or
          "I need guidance," urgency, a short description, and availability.
        </P>

        <div className="mt-10 mb-10">
          <ContactFlowToggle />
        </div>

        <P>
          Before finalizing it, I ran an <strong>informal usability test</strong> with my sister and father, both
          uncomfortable with technology. Both testers got stuck at the same point: additional content continued below
          the fold, but <strong>neither realized they needed to scroll</strong>. The affordance technically existed, but
          it <strong>wasn't obvious</strong>.
        </P>
        <QuoteCallout>
          It was a good reminder that something can make sense to the designer and <strong>still fail in use</strong>.
        </QuoteCallout>
        <P>
          I added a <strong>false-bottom effect</strong> with a soft blur and downward arrow to make the continuation
          clear. It was a small change, but it came <strong>directly from watching people use the design</strong> rather
          than assuming they would understand it. In hindsight, the test was limited by their familiarity and my own
          assumptions, but it showed exactly where testing could reveal something my reasoning had missed.
        </P>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={7}
            type="VID"
            video
            src="/work/securelancer/form-scroll-affordance.mp4"
            poster="/work/securelancer/form-scroll-affordance-poster.webp"
            width={1600}
            height={900}
            alt="Screen recording of the contact form's service list scrolling, with a soft fade and a downward arrow at the bottom edge showing that more options continue below"
          >
            Blur and arrow signal more below.
          </HighlightCard>
        </div>


        <H3>Designing trust with what already existed</H3>
        <P>
          The owner wanted to keep personal information limited, so I couldn't rely heavily on personal credentials to
          establish trust. Instead, I worked with <strong>the trust signals the business already had</strong>, and made
          them easier to notice through clearer structure and hierarchy. The goal wasn't to manufacture additional
          proof — it was to <strong>make the existing proof more visible</strong> and easier to understand.
        </P>
        <div className="mt-10 mb-10 grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
          {trustSignals.map((t, i) => {
            const tone = toneAt(i);
            return (
              <div key={t.label} className={`flex flex-col gap-4 rounded-[10px] px-6 py-7 ${tone.card}`}>
                <span className={`flex size-10 items-center justify-center rounded-full ${tone.badge}`}>
                  <Icon name={t.icon} size={20} strokeWidth={2.25} />
                </span>
                <span className="font-body text-sm font-semibold text-ink">{t.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 mb-10 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={8}
            type="IMG"
            src="/work/securelancer/testimonials-section.webp"
            width={1921}
            height={1239}
            alt="What Our Clients Say section with five five-star client testimonials from the USA, Germany, Australia and Italy, placed over a dotted world map"
          >
            Testimonials on a dotted world map.
          </HighlightCard>
        </div>
      </Reveal>

      {/* Proposal */}
      <Reveal>
        <SectionDivider label="Proposal" />
        <H3>A website built around the complete journey</H3>
        <P>
          The final website brings the consultancy's <strong>identity, offering, proof, and contact experience</strong>{' '}
          into one connected journey. The visual system was designed to feel{' '}
          <strong>more credible and distinctive</strong>, while the content hierarchy keeps the experience easy to
          follow as visitors move from understanding the brand to evaluating its work.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={9}
            type="VID"
            video
            src="/work/securelancer/fig7-full-walkthrough.mp4"
            poster="/work/securelancer/fig7-poster.webp"
            width={1918}
            height={1080}
            alt="Full website walkthrough, moving through the consultancy's identity, offering, proof, and contact experience"
          >
            Full website walkthrough.
          </HighlightCard>
        </div>

        <H3>A low-effort path to the expert</H3>
        <P>
          The final contact experience is designed to make reaching the expert feel like{' '}
          <strong>a natural next step</strong> rather than another task to complete. Visitors can share only the
          context needed for the first conversation, choose <strong>"I need guidance"</strong> when they aren't sure
          what they need, and move directly toward availability.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={10}
            type="VID"
            video
            src="/work/securelancer/highlight-2.mp4"
            poster="/work/securelancer/highlight-2-poster.webp"
            width={1600}
            height={900}
            alt="Screen recording of the final contact experience, sharing context for the first conversation, choosing I need guidance, and moving toward live availability"
          >
            Final contact experience.
          </HighlightCard>
        </div>

        <H3>Making case studies easier to relate to</H3>
        <P>
          The consultancy works with clients across different countries, so I wanted the case studies to feel{' '}
          <strong>easier to approach</strong> for the people most likely to read them. I used the{' '}
          <strong>five most spoken languages</strong> across the client base to make key case-study content available
          in languages familiar to those audiences, while keeping the original content accessible.
        </P>
        <P>
          The goal wasn't to translate everything for the sake of translation. It was to{' '}
          <strong>remove a small barrier</strong> between the visitor and the proof they are trying to understand.
        </P>

        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={11}
            type="VID"
            video
            src="/work/securelancer/fig9-case-study.mp4"
            poster="/work/securelancer/fig9-poster.webp"
            width={1918}
            height={1080}
            alt="Multilingual case study experience, switching key case-study content into one of the five most spoken languages across the client base"
          >
            Multilingual case study experience.
          </HighlightCard>
        </div>

        <H3>Recon: a little help before the conversation</H3>
        <P>
          Not every visitor will know exactly what they need when they arrive. Recon is a{' '}
          <strong>pre-sales AI helper</strong> designed to give them some clarity before they contact the expert.
        </P>
        <P>
          Recon keeps the conversation <strong>deliberately narrow</strong>. It asks one or two focused questions,
          then uses the site's actual information to point the visitor toward{' '}
          <strong>one relevant case study and one relevant service</strong>. When they're ready, it can prepare a
          short summary for the booking flow.
        </P>
        <div className="mt-10 mb-4 rounded-2xl bg-accent-soft p-4 md:p-8">
          <HighlightCard
            n={12}
            type="VID"
            video
            src="/work/securelancer/fig10-recon-use.mp4"
            poster="/work/securelancer/fig10-poster.webp"
            width={1918}
            height={1080}
            alt="Screen recording of a Recon conversation, asking a focused question, then pointing the visitor toward one relevant case study and one relevant service"
          >
            Recon conversation.
          </HighlightCard>
        </div>

        <H3>Testing Recon before it met a visitor</H3>
        <P>
          Recon was the part of the site I trusted least without testing, so I tried to break it before anyone else
          could.
        </P>
        <P>
          I ran <strong>100 prompts across 7 categories</strong>, covering pricing, invented services, pasted
          credentials, personal details, prompt injection, off-topic requests, and other languages. I wrote the first
          set myself, then used AI to generate prompts targeting gaps I might have missed. The riskiest prompts were
          run three times because AI responses can vary.
        </P>
        <P>
          The first round exposed <strong>three real failures</strong>. Recon responded to a pasted API key without
          warning, implied it had saved someone's contact details, and compared security tools beyond its intended
          scope.
        </P>
        <QuoteCallout>
          A helpful-sounding reply can still create a false promise. “I've noted your details” could make someone
          believe their lead was saved.
        </QuoteCallout>
        <P>
          I tightened the rules around each failure, then re-ran all 100 prompts to make sure the fixes held.
        </P>

        <H3>Fresh eyes</H3>
        <P>
          Two developer friends then tried to break Recon without seeing the rules. One acted like an attacker, using
          role-play and emotional pressure; the other approached it as a stressed visitor with little security
          knowledge.
        </P>
        <P>
          They didn't find another meaningful failure, but they did surface <strong>two edge cases</strong>.
        </P>
        <P>
          The first was <strong>pricing</strong>. A tester kept asking whether a service cost more than a billion
          dollars, then a million, then lower. Recon initially responded that the cost would be a fraction of those
          amounts, but eventually stopped and explained that it couldn't provide quotes without project-specific
          scoping. Since Recon isn't designed to provide pricing and the values being tested were intentionally
          unrealistic, I treated this as an edge case rather than a failure.
        </P>
        <P>
          The second was <strong>repeated language switching</strong>. Recon could respond in different languages, but
          struggled when someone repeatedly switched between English, Hindi, and Spanish in the same conversation. I
          left this alone because it required an unusually mixed-language conversation that wasn't relevant to the
          intended use.
        </P>
        <P>
          The testing helped me separate real risks from technically possible edge cases, instead of trying to fix
          every unusual behaviour.
        </P>

        <H3>What this doesn't prove</H3>
        <P>
          This was informal testing with two developers, not security buyers or a security audit. The prompts came
          from me and AI, so real visitors could still behave differently.
        </P>
        <P>
          Most importantly, Recon hasn't been used by real visitors yet. After launch, I'd review{' '}
          <strong>real conversations</strong> to find failure patterns that synthetic testing can't predict.
        </P>

        <Recon />
      </Reveal>

      {/* Result */}
      <Reveal>
        <SectionDivider label="Result" />
        <P>
          The final website brings services, case studies, FAQs, contact, availability, and AI-assisted guidance into a{' '}
          <strong>more connected journey</strong>. I also carried the work beyond the UX and UI layer by{' '}
          <strong>building the frontend myself</strong>, turning the approved Figma work into the working product.
        </P>
        <P>
          The handoff revealed an unexpected issue. The owner responded positively to the Figma designs and approved
          development, but when I delivered the coded website, he <strong>initially wasn't satisfied</strong> even
          though it was functionally what he had approved. Walking through the Figma work alongside the built product,{' '}
          <strong>feature by feature</strong>, resolved the disconnect.
        </P>

        <Callout>
          A static mockup and a live interactive product <strong>can feel very different</strong> to someone without
          design fluency. That's partly a communication gap, but it's also{' '}
          <strong>something I'd own as the designer</strong>. Next time, I'd introduce{' '}
          <strong>an explicit step</strong> showing how the approved designs will translate into the final interactive
          experience.
        </Callout>

        <P>
          The site isn't live yet, so there is <strong>no post-launch data</strong>, and the previous version never had
          enough real traffic to establish a reliable baseline. My usability testing was also{' '}
          <strong>informal and limited to two people</strong> close to me — so I don't claim that the redesign has
          already improved conversion or usability at scale.
        </P>

        <P>
          Once the site launches, I'll validate the experience through <strong>booking completion</strong>, use of{' '}
          <strong>"I need guidance,"</strong> and whether <strong>Recon conversations</strong> lead to service views,
          case-study reads, or bookings. Those signals will show whether the redesign is actually helping someone with a
          live security problem reach the expert more efficiently.
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