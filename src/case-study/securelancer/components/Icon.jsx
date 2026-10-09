import {
  ArrowLeft, ArrowRight, ArrowUp, Ban, Banknote, Bot, BookOpen, BriefcaseBusiness, Check,
  ChevronsUpDown, CircleHelp, CircleX, ClipboardCheck, ClipboardList, Compass,
  ContactRound, Cpu, ExternalLink, Eye, FileText, Folder, Frown, Hand, Info, Layers, Lightbulb,
  ListChecks, MessageSquareQuote, NotebookPen, PanelLeft, PartyPopper, PenLine, PictureInPicture2, Quote, RefreshCw,
  Rocket, Smile, Sparkles, Split, ThumbsUp, TriangleAlert, Users, X, Play, RotateCcw,
  LayoutDashboard, ChevronDown, Wrench, Image as ImageIcon,
} from 'lucide-react';

// lucide has no "CompassOff", so use Compass for the "fragmented / lost" fact.
const icons = {
  ArrowLeft, ArrowRight, ArrowUp, Ban, Banknote, Bot, BookOpen, BriefcaseBusiness, Check,
  ChevronsUpDown, CircleHelp, CircleX, ClipboardCheck, ClipboardList,
  CompassOff: Compass, Compass, ContactRound, Cpu, ExternalLink, Eye, FileText, Folder,
  Frown, Hand, Info, Layers, Lightbulb, ListChecks, MessageSquareQuote, NotebookPen, PanelLeft, PartyPopper, PenLine,
  PictureInPicture2, Quote, RefreshCw, Rocket, Smile, Sparkles, Split, ThumbsUp, TriangleAlert,
  Users, X, Play, RotateCcw, LayoutDashboard, ChevronDown, Wrench, Image: ImageIcon,
};

export default function Icon({ name, size = 22, strokeWidth = 1.75, className = '' }) {
  const Cmp = icons[name];
  if (!Cmp) return null;
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}