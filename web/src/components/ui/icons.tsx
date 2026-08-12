import type { ComponentType } from "react";
import type { Icon as PhosphorIcon, IconProps, IconWeight } from "@phosphor-icons/react";
import {
  ArrowLeft as PhosphorArrowLeft,
  ArrowRight as PhosphorArrowRight,
  ArrowSquareOut as PhosphorArrowSquareOut,
  ArrowUpRight as PhosphorArrowUpRight,
  BookOpen as PhosphorBookOpen,
  Briefcase as PhosphorBriefcase,
  Calendar as PhosphorCalendar,
  CalendarDots as PhosphorCalendarDots,
  CaretDown as PhosphorCaretDown,
  CaretRight as PhosphorCaretRight,
  CaretUpDown as PhosphorCaretUpDown,
  Certificate as PhosphorCertificate,
  ChatCircle as PhosphorChatCircle,
  Check as PhosphorCheck,
  CheckCircle as PhosphorCheckCircle,
  Circle as PhosphorCircle,
  Clock as PhosphorClock,
  Copy as PhosphorCopy,
  DownloadSimple as PhosphorDownloadSimple,
  EnvelopeSimple as PhosphorEnvelopeSimple,
  FileCode as PhosphorFileCode,
  FileText as PhosphorFileText,
  FolderOpen as PhosphorFolderOpen,
  Gear as PhosphorGear,
  Globe as PhosphorGlobe,
  Handshake as PhosphorHandshake,
  Image as PhosphorImage,
  Images as PhosphorImages,
  List as PhosphorList,
  ListChecks as PhosphorListChecks,
  ListPlus as PhosphorListPlus,
  Lock as PhosphorLock,
  MagnifyingGlass as PhosphorMagnifyingGlass,
  MapPin as PhosphorMapPin,
  Microphone as PhosphorMicrophone,
  PencilSimple as PhosphorPencilSimple,
  Play as PhosphorPlay,
  PlayCircle as PhosphorPlayCircle,
  Plus as PhosphorPlus,
  Pulse as PhosphorPulse,
  Scroll as PhosphorScroll,
  Shield as PhosphorShield,
  ShieldCheck as PhosphorShieldCheck,
  Sidebar as PhosphorSidebar,
  SidebarSimple as PhosphorSidebarSimple,
  SignOut as PhosphorSignOut,
  Sparkle as PhosphorSparkle,
  SquaresFour as PhosphorSquaresFour,
  Stack as PhosphorStack,
  Target as PhosphorTarget,
  Ticket as PhosphorTicket,
  Trash as PhosphorTrash,
  User as PhosphorUser,
  Users as PhosphorUsers,
  VideoCamera as PhosphorVideoCamera,
  Wrench as PhosphorWrench,
  X as PhosphorX,
} from "@phosphor-icons/react/ssr";

/**
 * Platform icon family: Phosphor Light.
 * Lucide names are kept so existing call sites stay readable.
 */
const WEIGHT: IconWeight = "light";

export type IconPropsCompat = IconProps & {
  /** Ignored. Phosphor uses `weight`, not stroke width. */
  strokeWidth?: number;
};

export type Icon = ComponentType<IconPropsCompat>;
/** @deprecated Use `Icon` */
export type LucideIcon = Icon;

function phosphor(Glyph: PhosphorIcon): Icon {
  function Wrapped({ strokeWidth: _strokeWidth, weight = WEIGHT, ...props }: IconPropsCompat) {
    return <Glyph weight={weight} {...props} />;
  }
  Wrapped.displayName = Glyph.displayName ?? "Icon";
  return Wrapped;
}

export const Activity = phosphor(PhosphorPulse);
export const ArrowLeft = phosphor(PhosphorArrowLeft);
export const ArrowRight = phosphor(PhosphorArrowRight);
export const ArrowUpRight = phosphor(PhosphorArrowUpRight);
export const Award = phosphor(PhosphorCertificate);
export const BookOpen = phosphor(PhosphorBookOpen);
export const Briefcase = phosphor(PhosphorBriefcase);
export const Calendar = phosphor(PhosphorCalendar);
export const CalendarDays = phosphor(PhosphorCalendarDots);
export const Check = phosphor(PhosphorCheck);
export const CheckCircle2 = phosphor(PhosphorCheckCircle);
export const ChevronDown = phosphor(PhosphorCaretDown);
export const ChevronRight = phosphor(PhosphorCaretRight);
export const ChevronsUpDown = phosphor(PhosphorCaretUpDown);
export const Circle = phosphor(PhosphorCircle);
export const Clock = phosphor(PhosphorClock);
export const Copy = phosphor(PhosphorCopy);
export const Download = phosphor(PhosphorDownloadSimple);
export const ExternalLink = phosphor(PhosphorArrowSquareOut);
export const FileJson = phosphor(PhosphorFileCode);
export const FileText = phosphor(PhosphorFileText);
export const FolderOpen = phosphor(PhosphorFolderOpen);
export const Globe = phosphor(PhosphorGlobe);
export const Handshake = phosphor(PhosphorHandshake);
export const Image = phosphor(PhosphorImage);
export const ImagePlus = phosphor(PhosphorImages);
export const Layers = phosphor(PhosphorStack);
export const LayoutDashboard = phosphor(PhosphorSquaresFour);
export const ListChecks = phosphor(PhosphorListChecks);
export const ListPlus = phosphor(PhosphorListPlus);
export const Lock = phosphor(PhosphorLock);
export const LogOut = phosphor(PhosphorSignOut);
export const Mail = phosphor(PhosphorEnvelopeSimple);
export const MapPin = phosphor(PhosphorMapPin);
export const Menu = phosphor(PhosphorList);
export const MessageCircle = phosphor(PhosphorChatCircle);
export const Mic2 = phosphor(PhosphorMicrophone);
export const PanelLeftClose = phosphor(PhosphorSidebar);
export const PanelLeftOpen = phosphor(PhosphorSidebarSimple);
export const Pencil = phosphor(PhosphorPencilSimple);
export const Play = phosphor(PhosphorPlay);
export const PlayCircle = phosphor(PhosphorPlayCircle);
export const Plus = phosphor(PhosphorPlus);
export const ScrollText = phosphor(PhosphorScroll);
export const Search = phosphor(PhosphorMagnifyingGlass);
export const Settings = phosphor(PhosphorGear);
export const Shield = phosphor(PhosphorShield);
export const ShieldCheck = phosphor(PhosphorShieldCheck);
export const Sparkles = phosphor(PhosphorSparkle);
export const Target = phosphor(PhosphorTarget);
export const Ticket = phosphor(PhosphorTicket);
export const Trash2 = phosphor(PhosphorTrash);
export const UserRound = phosphor(PhosphorUser);
export const Users = phosphor(PhosphorUsers);
export const Video = phosphor(PhosphorVideoCamera);
export const Wrench = phosphor(PhosphorWrench);
export const X = phosphor(PhosphorX);
