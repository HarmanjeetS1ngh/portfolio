/**
 * All case-study copy lives here so you can edit text without touching JSX.
 * Icon names are lucide-react component names (see components/Icon.jsx).
 */

export const meta = {
  breadcrumb: { label: 'Back', href: '#' },
  title: 'Making Anime Streaming Feel Effortless Again',
  subtitle:
    'A self-initiated redesign exploring how small interaction problems make resuming, controlling, and managing content harder than it needs to be.',
  heroImage: { alt: 'The redesigned Crunchyroll player showing Dragon Ball Super, with faster playback and viewing controls surfaced directly in the player' },
  rows: [
    { label: 'Client', values: ['Self-initiated'] },
    { label: 'Timeline', values: ['~3 weeks'] },
    { label: 'Role', values: ['UI/UX Designer'] },
  ],
  tools: [
    { title: 'Figma', src: '/work/crunchyroll/figma-logo.svg' },
    { title: 'Claude', src: '/work/crunchyroll/claude-logo.webp' },
  ],
  credit: 'Designed & Built by [Your Name]',
  liveUrl: '#',
  nextUrl: '#',
};

// Card colour is set by POSITION (cream -> blue -> purple -> green), not by a
// field here. To change it, edit `cardTones` in components/ui.jsx.
// Left empty for now — fill in `body` (array of sentences, **wrap** for bold) later.
export const stats = [
  {
    icon: 'Frown',
    title: 'Problem',
    body: [
      'Viewers struggled to **resume**, **control**, and **manage** anime smoothly, with **hidden playback options**, **unclear queue actions**, and a **less visible path back to ongoing shows**.',
    ],
  },
  {
    icon: 'Wrench',
    title: 'Solution',
    body: [
      'I redesigned three key moments — **Resume**, **Control**, and **Manage** — bringing **ongoing shows into view**, placing **playback controls where viewers watch**, and **separating queue actions by intent**.',
    ],
  },
  {
    icon: 'PartyPopper',
    title: 'Results',
    body: [
     "In testing with two groups of five, **everyone removed a show in under 10 seconds** on the redesign, against **1 of 5** on the original, where four cleared their whole history by mistake. Changing playback speed took **under 4 seconds**, adding a faster speed option that wasn't available before.",
    ],
  },
];

// Highlights section (3 full-width figures stacked under 01 — Context).
// Replace each `caption` with your own text; `n` is the figure number, `type` is the
// media tag (IMG / GIF / VID). Media is shown whole (never cropped) at the shared
// container width, so its height follows its own ratio. `width`/`height` are the
// file's real pixel size; keep them in sync if you swap a file. Remove `src` (or
// leave it empty) to keep the grey placeholder shown below.
export const highlights = [
  { n: '0.1', type: 'VID', src: '/work/crunchyroll/deleting-crunchyroll.mp4', caption: 'Deleting Crunchyroll' },
];

// Review-research breakdown (02 — Problem). Percentages from the 496 relevant reviews.
export const reviewThemes = [
  { icon: 'Play', stat: '49%', title: 'Playback & Controls', reason: 'The largest share of complaints, centered on **missing or hard-to-reach controls** during playback.' },
  { icon: 'RefreshCw', stat: '31%', title: 'Queue & Syncing', reason: 'Frustration with **Continue Watching** not behaving the way viewers expected it to.' },
  { icon: 'LayoutDashboard', stat: '20%', title: 'UI & Navigation', reason: 'Friction in **finding an ongoing show** and moving around the app.' },
];

export const processTags = [
  { icon: 'ClipboardCheck', label: 'Review Mining' },
  { icon: 'Users', label: 'Usability Testing' },
  { icon: 'Layers', label: 'Competitive Analysis' },
];

// Two broad viewing behaviours identified during the journey-mapping stage (03 — Process).
export const viewerProfiles = [
  {
    icon: 'Zap',
    title: 'The Intentional Watcher',
    reason: 'Already knows what they want to watch and mainly wants to **get there quickly**.',
  },
  {
    icon: 'Sliders',
    title: 'The Customization-Oriented Watcher',
    reason: 'Spends more time **adjusting playback and viewing settings** to match how they prefer to watch.',
  },
];

// Competitive analysis (03 — Process): how Crunchyroll compared to JioHotstar, Prime Video, and YouTube.
export const competitors = [
  {
    icon: 'JioHotstar',
    title: 'JioHotstar',
    reason: 'Supported **faster and slower playback**, allowed removal from Continue Watching **directly from its menu**, and kept ongoing shows visible within the initial viewport.',
  },
  {
    icon: 'PrimeVideo',
    title: 'Prime Video',
    reason: 'Followed a similar pattern for **queue management** and kept playback settings within an **overlay** without interrupting the content.',
  },
  {
    icon: 'Youtube',
    title: 'YouTube',
    reason: 'Provided a **familiar reference** for playback controls and speed adjustment.',
  },
];

export const chain = [
  { icon: 'ClipboardCheck', label: 'Review Mining' },
  { icon: 'ListChecks', label: 'Journey Map' },
  { icon: 'Scale', label: 'Competitive Analysis' },
  { icon: 'Users', label: 'Testing', highlight: true },
  { icon: 'RefreshCw', label: 'Iteration' },
  { icon: 'Rocket', label: 'Proposal' },
];

// Usability-testing results (05 — Result).
export const testingResults = [
  {
    icon: 'ListX',
    stat: '<10 s',
    title: 'To remove a show',
    reason: '5/5 finished with **0 wrong taps**. On the original, only **1/5** did it right and **4/5** cleared their whole history.',
  },
  {
    icon: 'Gauge',
    stat: '<4 s',
    title: 'To change playback speed',
    reason: '5/5 did it with **0 wrong taps**. The original has **no faster speeds**, so 0/5 could go faster.',
  },
  {
    icon: 'ListX',
    stat: '0/5',
    title: 'Asked "did I do it right?"',
    reason:  'On the original, **5/5** looked to me for confirmation if they did the right thing but the redesigned flow showed **full confidence** on completion.',
  },
];

// "Next projects" cards at the bottom of the page. Swap each `href` for the
// real case-study URL. Images live in public/work/crunchyroll/ (transparent webp).
export const nextProjects = [
  {
    title: 'TheSecureLancer',
    href: '#/work/securelancer',
    image: { src: '/work/crunchyroll/next-securelancer.webp', alt: 'TheSecureLancer case study, shown as a teal game cartridge', width: 1256, height: 1256 },
  },
  {
    title: 'Epic Gains',
    href: '#/work/epic-gains',
    image: { src: '/work/crunchyroll/next-epic-gains.webp', alt: 'Epic Gains case study, shown as a blue game cartridge', width: 693, height: 724 },
  },
];