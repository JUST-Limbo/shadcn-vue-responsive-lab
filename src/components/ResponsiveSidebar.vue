<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'reka-ui'
import type { SceneId } from '../core/breakpoints'
import { useSidebar } from '../core/sidebar'
import SidebarContent from './SidebarContent.vue'

defineProps<{ active: SceneId; preview: boolean }>()
const emit = defineEmits<{ navigate: [id: SceneId] }>()
const sidebar = useSidebar()
</script>

<template>
  <!-- 分支互斥：跨断点时卸载旧容器并创建新容器，不是把抽屉变形成侧栏。 -->
  <DialogRoot v-if="sidebar.isMobile.value" v-model:open="sidebar.mobileOpen.value">
    <DialogPortal>
      <DialogOverlay class="sheet-overlay" />
      <DialogContent
        class="mobile-sidebar"
        aria-describedby="mobile-sidebar-description"
        @open-auto-focus="sidebar.record('手机抽屉获得焦点')"
      >
        <DialogTitle class="sr-only">学习场景导航</DialogTitle>
        <DialogDescription id="mobile-sidebar-description" class="sr-only"
          >选择场景后关闭抽屉，按 Escape 或点击遮罩也可关闭。</DialogDescription
        >
        <SidebarContent
          :active="active"
          :preview="preview"
          surface="mobile"
          @navigate="emit('navigate', $event)"
        />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
  <div
    v-else
    class="desktop-sidebar-root"
    :data-state="sidebar.desktopState.value"
    :data-mode="sidebar.desktopMode.value"
  >
    <!-- fixed 侧栏脱离文档流；gap 专门承担必要的布局占位职责。 -->
    <div class="sidebar-gap" aria-hidden="true" />
    <aside class="desktop-sidebar" aria-label="主导航">
      <SidebarContent
        :active="active"
        :preview="preview"
        surface="desktop"
        @navigate="emit('navigate', $event)"
      />
    </aside>
  </div>
</template>
