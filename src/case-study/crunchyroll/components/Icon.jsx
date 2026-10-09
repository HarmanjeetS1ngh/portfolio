import {
  ArrowLeft, ArrowRight, ArrowUp, Ban, Banknote, Bot, BookOpen, BriefcaseBusiness, Check,
  ChevronsUpDown, CircleHelp, CircleX, ClipboardCheck, ClipboardList, Compass,
  ContactRound, Cpu, ExternalLink, Eye, FileText, Folder, Frown, Hand, Info, Layers, Lightbulb,
  ListChecks, MessageSquareQuote, NotebookPen, PanelLeft, PartyPopper, PenLine, PictureInPicture2, Quote, RefreshCw,
  Rocket, Smile, Sparkles, Split, ThumbsUp, TriangleAlert, Users, X, Play, RotateCcw,
  LayoutDashboard, ChevronDown, Wrench, Image as ImageIcon,
  Zap, Sliders, Tv, ShoppingBag, Youtube, Scale, Timer, Gauge, ListX, Pencil, Laptop,
} from 'lucide-react';

// lucide has no "CompassOff", so use Compass for the "fragmented / lost" fact.
const icons = {
  ArrowLeft, ArrowRight, ArrowUp, Ban, Banknote, Bot, BookOpen, BriefcaseBusiness, Check,
  ChevronsUpDown, CircleHelp, CircleX, ClipboardCheck, ClipboardList,
  CompassOff: Compass, Compass, ContactRound, Cpu, ExternalLink, Eye, FileText, Folder,
  Frown, Hand, Info, Layers, Lightbulb, ListChecks, MessageSquareQuote, NotebookPen, PanelLeft, PartyPopper, PenLine,
  PictureInPicture2, Quote, RefreshCw, Rocket, Smile, Sparkles, Split, ThumbsUp, TriangleAlert,
  Users, X, Play, RotateCcw, LayoutDashboard, ChevronDown, Wrench, Image: ImageIcon,
  Zap, Sliders, Tv, ShoppingBag, Youtube, Scale, Timer, Gauge, ListX, Pencil, Laptop,
};

/**
 * Brand marks that aren't in lucide, drawn to sit alongside it.
 *
 * Every other icon on the page is a lucide glyph: a fixed-width *stroke*
 * (fill="none", stroke="currentColor") on a 24x24 grid, so its weight and
 * color both scale predictably off the `size` / `strokeWidth` props and the
 * badge's own `text-*` class. To keep a custom mark from sticking out next
 * to those, it has to follow the same two rules — colour via `currentColor`
 * (never a hard-coded brand colour) and a stroke-width that's converted from
 * the *lucide-equivalent* value the caller passes in, using each icon's own
 * viewBox width (`vb`) so a strokeWidth of e.g. 2.25 reads as the same
 * visual weight here as it does on a real lucide icon. THINNER knocks that
 * down a bit further for marks (like JioHotstar's) that read a touch heavy
 * at the full lucide-equivalent weight.
 *
 * JioHotstar's mark is a plain silhouette, so it converts to a stroke
 * outline cleanly — same treatment as every lucide icon here.
 */
const THINNER = 0.75;

function JioHotstarIcon({ size = 22, strokeWidth = 1.75, className = '' }) {
  const vb = 640;
  const sw = strokeWidth * (vb / 24) * THINNER;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} 474`} className={className} aria-hidden="true">
      <path
        d="M 580.00 0.00 L 358.56 154.42 Q 352.00 159.00 351.01 151.06 L 335.00 22.00 L 335.00 22.00 L 295.48 143.39 Q 293.00 151.00 286.02 147.09 L 209.00 104.00 L 209.00 104.00 L 244.39 173.86 Q 248.00 181.00 240.11 179.70 L 54.00 149.00 L 54.00 149.00 L 231.81 235.50 Q 239.00 239.00 232.74 243.98 L 141.00 317.00 L 141.00 317.00 L 268.23 285.90 Q 276.00 284.00 275.91 292.00 L 274.00 469.00 L 274.00 469.00 L 349.02 282.42 Q 352.00 275.00 359.92 276.15 L 503.00 297.00 L 503.00 297.00 L 393.51 218.66 Q 387.00 214.00 392.36 208.06 L 580.00 0.00 L 580.00 0.00 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Prime Video: unlike JioHotstar, the source file is the "primevideo"
 * wordmark tile, not a standalone symbol — stroking just the letterforms
 * hollows them out and the name stops reading (the "m" in particular
 * collapses). So instead of recreating it, this renders the real brand
 * SVG directly (public/work/crunchyroll/prime-video-logo.svg — its own blue tile,
 * full colour, same file used everywhere else Prime Video's logo appears),
 * the same way the Figma/Claude tool logos are used in the Hero's
 * ToolStack: as an actual asset, not a lucide-style recolourable stroke.
 */
function PrimeVideoIcon({ size = 22, className = '' }) {
  return (
    <img
      src="/work/crunchyroll/prime-video-logo.svg"
      alt="Prime Video"
      width={size}
      height={size}
      className={`block rounded-none ${className}`}
    />
  );
}

const brandIcons = {
  JioHotstar: JioHotstarIcon,
  PrimeVideo: PrimeVideoIcon,
};

export default function Icon({ name, size = 22, strokeWidth = 1.75, className = '' }) {
  const Brand = brandIcons[name];
  if (Brand) return <Brand size={size} strokeWidth={strokeWidth} className={className} />;

  const Cmp = icons[name];
  if (!Cmp) return null;
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}