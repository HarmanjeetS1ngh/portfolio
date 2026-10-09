/** All case-study copy for Epic Gains. Icon names are lucide-react names (see components/Icon.jsx). */

export const meta = {
  breadcrumb: { label: 'Back', href: '#' },
  title: 'Making the Gym Feel Less Intimidating',
  subtitle:
    'A 28-hour hackathon project exploring how a fitness app could help first-time gym goers feel less lost, more guided, and more motivated to keep showing up.',
  heroImage: { alt: 'The redesigned Epic Gains home screen with Today\u2019s Workout and the Pokémon companion' },
  rows: [
    { label: 'Event', values: ['ProtoThon 2026'] },
    { label: 'Timeline', values: ['28 hours'] },
    { label: 'Role', values: ['UI/UX Designer'] },
  ],
  tools: [{ title: 'Figma', src: '/work/epic-gains/figma-logo.svg' }],
  credit: 'Designed & Built by Harmanjeet Singh',
};

export const stats = [
  {
    icon: 'Frown',
    title: 'Problem',
    body: [
      'First-time gym goers could feel **lost** before they even started, facing **too much information**, **unfamiliar fitness language**, **unclear actions**, and **disconnected workout progress**.',
    ],
  },
  {
    icon: 'Wrench',
    title: 'Solution',
    body: [
      'I redesigned the beginner journey around **guided onboarding**, **simpler workouts**, **visible progression**, and a **Pokémon companion** that makes consistency feel more personal.',
    ],
  },
  {
    icon: 'PartyPopper',
    title: 'Results',
    body: [
      'We built the prototype in **28 hours** and placed **2nd in the Classic Track**, with judges highlighting the **user journey**, **UI**, **problem solving**, **presentation**, and **Pokémon progression**.',
    ],
  },
];

export const processTags = [
  { icon: 'Compass', label: 'Problem Framing' },
  { icon: 'Zap', label: 'Rapid Prototyping' },
  { icon: 'Eye', label: 'Accessibility Checks' },
];

export const painPoints = [
  { icon: 'Layers', title: 'Too much to understand', reason: 'Sets, reps, muscle groups, and workout structures were **unfamiliar concepts** for beginners.' },
  { icon: 'CircleHelp', title: 'Too many decisions to make', reason: 'Beginners **didn\u2019t know where to start** and struggled to identify exercises.' },
  { icon: 'Compass', title: 'Not enough guidance', reason: 'Actions like **\u201cStart Routine\u201d** were unclear, and **repeated logging** felt tedious.' },
];

export const moods = [
  { icon: 'Smile', title: 'Energetic and proud', reason: 'When the user was consistent, it could **smile, dance, flex**, or look energetic.' },
  { icon: 'Meh', title: 'Quiet and still', reason: 'With longer inactivity, it could become **quieter and sit still**.' },
  { icon: 'Frown', title: 'Back turned', reason: 'At the lowest mood state, it could **lie down with its back turned**.' },
];

export const results = [
  { icon: 'Timer', stat: '28 hrs', title: 'Prototype and presentation', reason: 'Completed **within the hackathon**, with a lightweight Figma prototype for the core flow.' },
  { icon: 'Rocket', stat: '2nd', title: 'In the Classic Track', reason: 'Placed second in the **Classic Track** of ProtoThon 2026.' },
  { icon: 'ThumbsUp', title: 'Judges\u2019 ratings', reason: 'Positive on the **user journey, UI design, problem solving, and presentation**.' },
];

export const nextProjects = [
  {
    title: 'TheSecureLancer',
    href: '#/work/securelancer',
    image: { src: '/work/epic-gains/next-securelancer.webp', alt: 'TheSecureLancer case study, shown as a teal game cartridge', width: 1182, height: 1194 },
  },
  {
    title: 'Crunchyroll',
    href: '#/work/crunchyroll',
    image: { src: '/work/epic-gains/next-crunchyroll.webp', alt: 'Crunchyroll case study, shown as an orange game cartridge', width: 682, height: 724 },
  },
];

/** Fig 7: the final prototype screens, in flow order (welcome -> onboarding -> home -> workout -> re-engagement). */
export const walkthrough = [
  { src: '/work/epic-gains/fig8-1-welcome.webp', label: 'Welcome', alt: "Welcome screen with Machop over a gym background, the headline 'Level up your body. Evolve your companion.', and Get Started and Login buttons" },
  { src: '/work/epic-gains/fig8-2-onboarding-level.webp', label: 'Onboarding: where are you starting?', alt: "Onboarding step 2 of 5, 'Where are you starting from?' with Beginner, Intermediate and Returning options" },
  { src: '/work/epic-gains/fig8-3-onboarding-partner.webp', label: 'Onboarding: choose your partner', alt: "Onboarding step 5 of 5, 'Choose your partner' with Charmander, Squirtle (selected) and Bulbasaur" },
  { src: '/work/epic-gains/fig8-4-dashboard.webp', label: 'Home dashboard', alt: "Home dashboard with the Today's Workout card, the daily streak, and Squirtle's level and XP" },
  { src: '/work/epic-gains/fig8-5-workout.webp', label: 'Workout tab', alt: "Workout tab with Today's Workout, a Daily Challenge, and a Recommended for You card" },
  { src: '/work/epic-gains/fig8-6-todays-workout.webp', label: "Today's workout plan", alt: "Today's Workout list of biceps exercises, each with sets and XP, and a Let's Go button" },
  { src: '/work/epic-gains/fig8-7-session.webp', label: 'Workout session', alt: 'Workout session showing the Standing Barbell Curl animation, set targets, and a countdown' },
  { src: '/work/epic-gains/fig8-8-completed.webp', label: 'Workout completed', alt: 'Workout Completed screen with a celebrating Squirtle, +15 XP, and a workout summary' },
  { src: '/work/epic-gains/fig8-9-notification.webp', label: 'Re-engagement notification', alt: "Lock screen notification from Squirtle: 'Hey... we still training today?'" },
];