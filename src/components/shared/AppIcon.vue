<script setup>
import { computed } from 'vue'
import linkedInIcon from '../../assets/linkedin.svg'
import {
  Archive,
  Bell,
  Bolt,
  BriefcaseBusiness,
  Building2,
  Calendar,
  ChartColumn,
  Check,
  CheckCircle,
  ChevronsRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheckBig,
  ClipboardCheck,
  CloudUpload,
  Copy,
  Ellipsis,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Gift,
  GitCompare,
  GitBranch,
  Grid2x2,
  Hash,
  Heart,
  House,
  Info,
  Link,
  List,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Pause,
  Pencil,
  Plus,
  RefreshCcw,
  QrCode,
  ScanFace,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Smile,
  Sparkles,
  Scale,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  Clock3,
  TrendingUp,
  TriangleAlert,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  X,
  Zap,
} from '@lucide/vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
  stroke: {
    type: Number,
    default: 1.8,
  },
})

const iconMap = {
  alert: TriangleAlert,
  archive: Archive,
  bell: Bell,
  bolt: Bolt,
  briefcase: BriefcaseBusiness,
  building: Building2,
  calendar: Calendar,
  'chart-bars': ChartColumn,
  check: Check,
  checkCircle: CircleCheckBig,
  'chevrons-right': ChevronsRight,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  'clipboard-check': ClipboardCheck,
  'cloud-upload': CloudUpload,
  close: X,
  clock: Clock3,
  compare: GitCompare,
  copy: Copy,
  document: FileText,
  edit: Pencil,
  eye: Eye,
  'external-link': ExternalLink,
  'file-description': FileText,
  filter: Filter,
  gift: Gift,
  'git-branch': GitBranch,
  grid: Grid2x2,
  hash: Hash,
  heart: Heart,
  home: House,
  info: Info,
  link: Link,
  list: List,
  lock: Lock,
  mail: Mail,
  mapPin: MapPin,
  megaphone: Megaphone,
  menu: Menu,
  more: Ellipsis,
  pause: Pause,
  plus: Plus,
  qr: QrCode,
  refresh: RefreshCcw,
  search: Search,
  scale: Scale,
  settings: Settings,
  share: Share2,
  shield: ShieldCheck,
  smile: Smile,
  spark: Zap,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  thumbsDown: ThumbsDown,
  thumbsUp: ThumbsUp,
  'team-gear': UserCog,
  'trend-up': TrendingUp,
  user: User,
  'user-check': UserCheck,
  userPlus: UserPlus,
  'user-scan': ScanFace,
  users: Users,
  wallet: Wallet,
}

const iconComponent = computed(() => iconMap[props.name] ?? Info)
const isLinkedIn = computed(() => props.name === 'linkedin')
</script>

<template>
  <img
    v-if="isLinkedIn"
    :src="linkedInIcon"
    alt=""
    aria-hidden="true"
    :width="size"
    :height="size"
  >
  <component
    :is="iconComponent"
    v-else
    :size="size"
    :stroke-width="stroke"
  />
</template>
