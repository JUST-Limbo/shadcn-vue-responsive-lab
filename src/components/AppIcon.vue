<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  Files,
  Grid2X2,
  Layers,
  Menu,
  MessageSquare,
  Monitor,
  PanelLeft,
  Plus,
  Search,
  Send,
  Settings2,
  Smartphone,
  Table2,
  X,
} from '@lucide/vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 18 })
const icons: Record<string, typeof Menu> = {
  back: ArrowLeft,
  next: ArrowRight,
  check: Check,
  down: ChevronDown,
  file: FileText,
  files: Files,
  grid: Grid2X2,
  layers: Layers,
  menu: Menu,
  chat: MessageSquare,
  monitor: Monitor,
  panel: PanelLeft,
  plus: Plus,
  search: Search,
  send: Send,
  settings: Settings2,
  phone: Smartphone,
  table: Table2,
  close: X,
}
const icon = computed(() => (icons[props.name] === undefined ? Menu : icons[props.name]))
</script>

<template>
  <component :is="icon" :size="size" :stroke-width="1.7" aria-hidden="true" />
</template>
