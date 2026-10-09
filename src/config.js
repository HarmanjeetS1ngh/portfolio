// ─────────────────────────────────────────────────────────────
// Everything you'll want to personalise lives in this one file.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Harman', // the boxy wordmark in the hero
  fullName: 'Harmanjeet Singh',
  initials: 'H',
  role: 'Product Designer',
  // Put a photo in /public (e.g. /public/avatar.jpg) and set this to '/avatar.jpg'.
  // While it is null, the initials above are shown in the avatar circle instead.
  avatar: null,
  location: 'Punjab, India',
  // Hero intro reads: "{fullName} is a {role}, {tagline}"
  tagline: 'making interfaces feel less like work and more like instinct',
};

// Hometown clock (hero, left side). `timeZone` is an IANA name, e.g. 'Asia/Kolkata',
// 'America/New_York', 'Europe/London'. `city` is what the hover tag shows.
export const hometown = {
  city: 'Punjab',
  timeZone: 'Asia/Kolkata',
};

// Dock links. Replace the placeholders with your real handles.
export const links = {
  email: 'mailto:harmanjeet.singh.ux@proton.me',
  linkedin: 'https://www.linkedin.com/in/harmanjeet-singh-52892824a?utm_source=share_via&utm_content=profile&utm_medium=member_android  ',
  medium: 'https://medium.com/@theharmonicone',
  telegram: 'https://t.me/theharmonicone',
};

// Selected work cards (row 1 = one full-width card, row 2 = wide + tall).
// `span` is how many of the 6 grid columns the card takes (6 = full, 4 = wide, 2 = tall).
export const workRange = '[2026]';
export const projects = [
  { slug: 'the-secure-lancer', title: 'TheSecureLancer', type: 'Contract', year: 2026, blurb: 'Simplifying cybersecurity through a clearer experience.', image: '/work/the-secure-lancer-bg.webp', mockup: '/work/the-secure-lancer-mockup.webp', span: 6, ratio: '1.54 / 1', href: '#/work/securelancer' },
  { slug: 'crunchyroll', title: 'Crunchyroll', type: 'Self Initiated', year: 2026, blurb: 'Making anime watching faster, clearer, effortless.', image: '/work/crunchyroll-background.webp', mockup: '/work/crunchyroll-mockup.webp', mockupWidth: '74%', span: 4, ratio: '1.27 / 1', href: '#/work/crunchyroll' },
  { slug: 'epic-gains', title: 'Epic Gains', type: 'Hackathon', year: 2026, blurb: 'Making fitness feel like your game.', image: '/work/epic-gains-background.webp', mockup: '/work/epic-gains-mockup.webp', mockupHeight: '76%', span: 2, ratio: '0.618 / 1', href: '#/work/epic-gains' },
];

export const lab = [
  { title: 'Quiz Poster', caption: 'Harry Potter trivia poster for my university media club', image: '/lab/potterhead-trivia.webp', ratio: 0.7073, keepRatio: true, w: 250, z: 3, pos: { top: 1058, left: 1968 } },
  { title: 'Bookclub Poster', caption: 'Poster for Bookscape, the book club I also founded', image: '/lab/bookscape.webp', ratio: 0.7067, keepRatio: true, w: 280, z: 1, pos: { top: 630, left: 1086 } },
  { title: 'GTA Vice City', caption: 'A shot outside my usual park, colour graded until it felt nostalgic', image: '/lab/palms.webp', ratio: 0.7729, w: 210, z: 8, pos: { top: 1214, left: 948 } },
  { title: 'Hemkund Sahib Hike', caption: 'Hiked to one of the highest pilgrimage sites in the world', image: '/lab/mountains.webp', ratio: 0.563, w: 190, z: 6, pos: { top: 548, left: 194 } },
  { title: 'Conjuring', caption: 'A little morning fog and a ton of colour grading can set any mood', image: '/lab/fog.webp', ratio: 0.7333, w: 210, z: 5, pos: { top: 407, left: 695 } },
  { title: 'Quora+ Redesign', caption: 'Redesigned the Quora+ subscription page for clarity', image: '/lab/ui-quora.webp', ratio: 1.4225, w: 260, z: 2, pos: { top: 476, left: 2076 } },
  { title: 'Moment after Rain', caption: 'Sometimes a random shot tells a deeper story than a book', image: '/lab/leaves.webp', ratio: 0.7498, w: 230, z: 7, pos: { top: 736, left: 1572 } },
  { title: 'Photo from Chamba', caption: 'A peaceful retreat with my folks', image: '/lab/plums.webp', ratio: 0.7512, w: 230, z: 9, pos: { top: 136, left: 1357 } },
  { title: 'Dashboard UI', caption: 'Dashboard redesigned to be friendlier for colour-blind users', image: '/lab/ui-dashboard.webp', ratio: 1.4225, w: 300, z: 4, pos: { top: 937, left: 505 } },
  { title: 'Kathlaur Wildlife Sanctuary', caption: 'The one picture that made the visit worth it', image: '/lab/leopard-arch.webp', ratio: 0.6885, w: 230, z: 1, pos: { top: 8, left: 72 } },
  { title: 'Vengeance', caption: 'My Funko Batman, shot once and later used as a wallpaper', image: '/lab/batman.webp', ratio: 0.6395, w: 230, z: 6, pos: { top: 1102, left: 115 } },
  { title: 'Checkout UI', caption: 'A checkout page designed around a clearer call to action', image: '/lab/ui-checkout.webp', ratio: 1.4225, w: 306, z: 9, pos: { top: 74, left: 1948 } },
  { title: 'What the Plum!', caption: 'The first time I ever saw a plum tree', image: '/lab/plums-2.webp', ratio: 0.7505, w: 210, z: 9, pos: { top: 143, left: 1026 } },
];


// About section (bento). Drop your own files in /public and they show up automatically:
//   /public/about/me.webp           your photo (already added)
//   /public/hobbies/movies-1..7.webp top-7 posters + movies-1..7.mp4 hover clips (all added)
//   /public/hobbies/gaming.webp     gaming still            /public/hobbies/gaming.mp4   hover clip
//   /public/hobbies/tech.webp       your tech photo
// Anything missing falls back to a soft gradient tile, so nothing looks broken meanwhile.
export const about = {
  photo: '/about/me.webp',
  pills: ['Product Designer', 'Punjab, India'],
  bio: 'Harmanjeet is a product designer who grew up designing alongside AI, turning tangled ideas into interfaces that feel effortless. As a freelancer, he takes projects from first sketch to final code.',
  tools: [
    { name: 'Notion', icon: '/tools/notion.png' },
    { name: 'Figma', icon: '/tools/figma.svg' },
    { name: 'Claude', icon: '/tools/claude.svg' },
    { name: 'ChatGPT', icon: '/tools/chatgpt.svg' },
    { name: 'Pinterest', icon: '/tools/pinterest.svg' },
    { name: 'Visual Studio Code', icon: '/tools/vscode.svg' },
    { name: 'GitHub', icon: '/tools/github.png' },
    { name: 'Canva', icon: '/tools/canva.svg' },
  ],
  education: [
    { title: 'Google UX Design Certificate', meta: 'Coursera · 2026' },
    { title: 'B.Tech, Computer Science & Engineering', meta: '2022 – 2026' },
  ],
  philosophy: { before: 'Research is a necessity, but its ', highlight: 'intensity can be checked', after: '.' },
  hobbies: [
    // Photography: auto-swiping like Movies. Photos are 760x1000 (2x the card) so they stay sharp.
    {
      key: 'photography',
      name: 'Photography',
      tint: ['#cfe3d4', '#e9f1ea'],
      slides: [
        { image: '/lab/leopard-arch.webp', pill: 'Kathlaur Wildlife Sanctuary', icon: 'paw' },
        { image: '/hobbies/photo-2.webp', pill: 'Christ Church, Shimla', icon: 'church' },
        { image: '/hobbies/photo-3.webp', pill: 'Tara Devi Temple, Mashobra', icon: 'temple' },
        { image: '/hobbies/photo-4.webp', pill: 'Dalhousie', icon: 'mountain' },
        { image: '/hobbies/photo-5.webp', pill: 'Hemkund Sahib, Uttarakhand', icon: 'flag' },
        { image: '/hobbies/photo-6.webp', pill: 'Akal Takht Sahib, Amritsar', icon: 'dome' },
        { image: '/hobbies/photo-7.webp', pill: 'H2O House, Chaminoo', icon: 'house' },
      ],
    },
    // Top 7 movies, auto-swiping (order = rank). Add `video: '/hobbies/xyz.mp4'` to any slide to
    // play a clip on hover; swap a poster/clip by replacing /public/hobbies/movies-N.webp / .mp4.
    {
      key: 'movies',
      name: 'Movies',
      tint: ['#f7c9c9', '#fbe7e7'],
      slides: [
        { title: 'Spider-Man', image: '/hobbies/movies-1.webp', pill: 'My favourite movie', icon: 'gold', video: '/hobbies/movies-1.mp4' },
        { title: 'Harry Potter and the Prisoner of Azkaban', image: '/hobbies/movies-2.webp', video: '/hobbies/movies-2.mp4', pill: '#2 · Prisoner of Azkaban', icon: 'silver' },
        { title: 'Obsession', image: '/hobbies/movies-3.webp', video: '/hobbies/movies-3.mp4', pill: '#3 · Obsession', icon: 'bronze' },
        { title: 'Spider-Man: No Way Home', image: '/hobbies/movies-4.webp', video: '/hobbies/movies-4.mp4', pill: '#4 · No Way Home' },
        { title: 'The Batman', image: '/hobbies/movies-5.webp', video: '/hobbies/movies-5.mp4', pill: '#5 · The Batman' },
        { title: 'The Sheep Detectives', image: '/hobbies/movies-6.webp', video: '/hobbies/movies-6.mp4', pill: '#6 · The Sheep Detectives' },
        { title: 'Blade Runner 2049', image: '/hobbies/movies-7.webp', video: '/hobbies/movies-7.mp4', pill: '#7 · Blade Runner 2049' },
      ],
    },
    { key: 'gaming', name: 'Gaming', image: '/hobbies/gaming.webp', video: '/hobbies/gaming.mp4', pill: 'Currently playing Days Gone', icon: 'gamepad', tint: ['#d8d3f5', '#ecebfb'] },
    { key: 'tech', name: 'Tech', image: '/hobbies/tech.webp', video: '/hobbies/tech.mp4', pill: 'I use Arch, BTW', icon: 'terminal', tint: ['#cfe6f7', '#e8f3fb'] },
    { key: 'reading', name: 'Reading', image: '/hobbies/reading.webp', video: '/hobbies/reading.mp4', pill: "Currently reading Can't Hurt Me", icon: 'book', tint: ['#f3e3c7', '#faf1e0'] },
  ],
};