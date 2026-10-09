/**
 * All case-study copy lives here so you can edit text without touching JSX.
 * Icon names are lucide-react component names (see components/Icon.jsx).
 */

export const meta = {
  breadcrumb: { label: 'Back', href: '#' },
  title: 'Redesigning How Clients Reach a Cybersecurity Expert',
  subtitle:
    'A cybersecurity consultancy redesign built around one question: how fast can someone in a live security problem reach real help?',
  heroImage: { src: '/work/securelancer/hero_image.webp', alt: 'TheSecureLancer Final Website Showcase' },
  rows: [
    { label: 'Client', values: ['TheSecureLancer'] },
    { label: 'Timeline', values: ['~2 weeks'] },
    { label: 'Status', values: ['Shipped (2026)'] },
    { label: 'Role', values: ['Sole UI/UX Designer', 'Developer'] },
  ],
  tools: [
    { title: 'Figma', src: '/work/securelancer/figma-logo.svg' },
    { title: 'Claude', src: '/work/securelancer/claude-logo.webp' },
    { title: 'Notion', src: '/work/securelancer/notion-logo.svg' },
  ],
  credit: 'Designed & Built by [Your Name]',
  liveUrl: '#',
  nextUrl: '#',
};

// Card colour is set by POSITION (cream -> blue -> purple -> green), not by a
// field here. To change it, edit `cardTones` in components/ui.jsx.
export const stats = [
  {
    icon: 'Frown',
    title: 'Problems',
    body: [
      'The site made a high-stakes decision harder through **scattered information**, **technical jargon**, a **high-effort contact flow**, and **weak visual trust** that made the experience feel less credible.',
    ],
  },
  {
    icon: 'Wrench',
    title: 'Solution',
    body: [
      'I reshaped the journey around **how visitors seek clarity**: understand the brand, build trust, explore services, see proof, resolve questions, then **contact or ask Recon, an AI helper**.',
    ],
  },
  {
    icon: 'PartyPopper',
    title: 'Results',
    body: [
      'The experience now creates a **clearer path from discovery to evaluation and booking**, with **less navigation and fewer context switches**.',
      'Testing also **revealed and fixed a hidden contact-flow issue**.',
    ],
  },
];

// Highlights section (3 full-width figures stacked under Problem / Solution / Results).
// Replace each `caption` with your own text; `n` is the figure number, `type` is the
// media tag (IMG / GIF / VID). Media is shown whole (never cropped) at the shared
// container width, so its height follows its own ratio. `width`/`height` are the
// file's real pixel size; keep them in sync if you swap a file. Remove `src` to get
// the grey placeholder back.
// Videos (0.1, 0.2, 0.3): set `video: true` and `type: 'VID'`. They loop muted, play only
// while on screen, and use `poster` as the still shown while loading. To go back to a
// still image, drop `video`/`poster` and point `src` at the .webp.
export const highlights = [
  { n: '0.1', type: 'VID', video: true, src: '/work/securelancer/highlight-1.mp4', poster: '/work/securelancer/highlight-1-poster.webp', width: 1600, height: 900,
    alt: 'Screen recording of the service drawer: the Mobile Application Pentest panel slides over the blurred services page, showing focus areas and a 6-phase workflow that can be stepped through',
    caption: 'Service drawer interaction' },
  { n: '0.2', type: 'VID', video: true, src: '/work/securelancer/highlight-2.mp4', poster: '/work/securelancer/highlight-2-poster.webp', width: 1600, height: 900,
    alt: 'Screen recording of the three-step Get Started with Us contact form: filling in basic details, choosing services and a message, then scheduling a call',
    caption: 'Contact form interaction' },
  { n: '0.3', type: 'VID', video: true, src: '/work/securelancer/highlight-4.mp4', poster: '/work/securelancer/highlight-4-poster.webp', width: 1600, height: 572,
    alt: 'Animated green gradient banner with a hat-and-glasses icon and the line: A new breed of security partner',
    caption: 'About component' },
];

export const problemFacts = [
  {
    icon: 'Split',
    stat: '26',
    title: 'services, 5 categories',
    reason: 'Each on its own page — comparing two meant leaving the catalogue entirely.',
  },
  {
    icon: 'ClipboardList',
    stat: '5',
    title: 'fields upfront',
    reason: 'Plus a company-or-individual choice, before service selection even began.',
  },
  {
    icon: 'CompassOff',
    title: 'Fragmented experience',
    reason: 'Services, case studies, FAQs, and contact each lived in isolated spaces.',
  },
];

export const processTags = [
  { icon: 'ClipboardCheck', label: 'UX Audit' },
  { icon: 'Layers', label: 'Progressive Disclosure' },
  { icon: 'Users', label: 'Usability Testing' },
];

export const interactionModels = [
  {
    icon: 'FileText',
    title: 'Dedicated Page',
    reason: '**Preserved the existing context-switching problem** the redesign set out to fix.',
    status: 'Rejected',
  },
  {
    icon: 'PictureInPicture2',
    title: 'Modal',
    reason: 'Felt too much like a **pop-up interruption** for an experience where trust matters.',
    status: 'Rejected',
  },
  {
    icon: 'ChevronsUpDown',
    title: 'Accordion',
    reason: '**Too little room for a service to breathe**, particularly on mobile.',
    status: 'Rejected',
  },
  {
    icon: 'PanelLeft',
    title: 'Side Drawer',
    reason: '**Explains the service in full** while keeping the visitor anchored to the catalogue.',
    status: 'Chosen',
    chosen: true,
  },
];

export const trustSignals = [
  { icon: 'MessageSquareQuote', label: 'Testimonials' },
  { icon: 'BriefcaseBusiness', label: 'Past Work' },
  { icon: 'Cpu', label: 'Recognizable Technologies' },
  { icon: 'Eye', label: 'Process Transparency' },
];

/**
 * The Before / After contact-flow toggle.
 * Emojis are image files in public/work/securelancer/emoji (Microsoft Fluent Emoji 3D, MIT),
 * so they look identical on every device instead of depending on the OS emoji font.
 */
const emoji = (name) => `/work/securelancer/emoji/${name}.png`;

export const contactFlow = {
  before: {
    label: 'Before',
    steps: [
      { title: 'Personal & company details', extra: '(5 fields)' },
      { title: 'Unguided Service Selection' },
      { title: 'Have to answer more specific questions' },
      { title: "No clear sense of what's next" },
    ],
    emojis: [
      { src: emoji('neutral_face'), alt: 'Neutral face' },
      { src: emoji('confused_face'), alt: 'Confused face' },
      { src: emoji('tired_face'), alt: 'Tired face' },
      { src: emoji('exploding_head'), alt: 'Exploding head' },
    ],
  },
  after: {
    label: 'After',
    steps: [
      { title: 'Basic details' },
      { title: 'Pick a service — or select "I need guidance"' },
      { title: 'Short description & timeline' },
      { title: 'Straight into live availability' },
    ],
    emojis: [
      { src: emoji('slightly_smiling_face'), alt: 'Slightly smiling face' },
      { src: emoji('relieved_face'), alt: 'Relieved face' },
      { src: emoji('smiling_face_with_sunglasses'), alt: 'Face with sunglasses' },
      { src: emoji('partying_face'), alt: 'Partying face' },
    ],
  },
};

export const recon = {
  does: {
    title: 'What Recon Does',
    icon: 'Smile',
    items: [
      { icon: 'CircleHelp', text: 'Asks one or two focused questions' },
      { icon: 'BookOpen', text: 'References one relevant case study' },
      { icon: 'ThumbsUp', text: 'Suggests one relevant service' },
      { icon: 'PenLine', text: 'Drafts a short summary for booking' },
    ],
  },
  wont: {
    title: "What Recon Won't Do",
    icon: 'Hand',
    items: [
      { icon: 'Ban', text: "Invent a service that doesn't exist" },
      { icon: 'Banknote', text: 'Invent or guess pricing' },
      { icon: 'TriangleAlert', text: 'Force a recommendation with no match' },
      { icon: 'Folder', text: 'Draw from any source but the site itself' },
    ],
  },
};

export const chain = [
  { icon: 'ClipboardCheck', label: 'Audit' },
  { icon: 'ListChecks', label: 'Decision' },
  { icon: 'CircleX', label: 'Rejected Alt.' },
  { icon: 'Users', label: 'Testing', highlight: true },
  { icon: 'RefreshCw', label: 'Iteration' },
  { icon: 'Rocket', label: 'Build' },
];

// "Next projects" cards at the bottom of the page. Swap each `href` for the
// real case-study URL. Images live in public/work/securelancer/ (transparent webp).
export const nextProjects = [
  {
    title: 'Crunchyroll',
    href: '#/work/crunchyroll',
    image: { src: '/work/securelancer/next-crunchyroll.webp', alt: 'Crunchyroll case study, shown as an orange game cartridge', width: 682, height: 724 },
  },
  {
    title: 'Epic Gains',
    href: '#/work/epic-gains',
    image: { src: '/work/securelancer/next-epic-gains.webp', alt: 'Epic Gains case study, shown as a blue game cartridge', width: 693, height: 724 },
  },
];
