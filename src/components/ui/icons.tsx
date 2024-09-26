import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
} from "lucide-react";

import { FaGoogle, FaGithub } from 'react-icons/fa';

// Define your Icon type as a string literal union based on the Icons object
export type Icon = keyof typeof Icons;

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: FaGithub,
  google: FaGoogle,
  check: Check,
  twitter: Twitter,
};

export const iconVariants = {
  default: "h-6 w-6",
  sm: "h-4 w-4",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export type IconProps = LucideProps & {
  name: Icon; // Use the Icon type here
  variant?: keyof typeof iconVariants;
};

export function Icon({ name, variant = "default", ...props }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent className={iconVariants[variant]} {...props} />;
}
