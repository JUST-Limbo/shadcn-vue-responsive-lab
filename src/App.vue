<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEventListener, useMediaQuery, useWindowSize } from '@vueuse/core'
import { MOBILE_QUERY, readScene, scenes } from './core/breakpoints'
import { createSidebarState, provideSidebar } from './core/sidebar'
import AppIcon from './components/AppIcon.vue'
import ResponsiveSidebar from './components/ResponsiveSidebar.vue'
import FramePlayground from './scenarios/FramePlayground.vue'
import SidebarScenario from './scenarios/SidebarScenario.vue'
import ChatScenario from './scenarios/ChatScenario.vue'
import ContainerScenario from './scenarios/ContainerScenario.vue'
import TableScenario from './scenarios/TableScenario.vue'
import SettingsScenario from './scenarios/SettingsScenario.vue'
import WorkspaceScenario from './scenarios/WorkspaceScenario.vue'
import OverlayScenario from './scenarios/OverlayScenario.vue'

const query = new URLSearchParams(window.location.search)
const preview = query.get('preview') === '1'
const active = ref(readScene(query.get('scene')))
if (preview && active.value === 'lab') active.value = 'sidebar'
const isMobile = useMediaQuery(MOBILE_QUERY)
const { width } = useWindowSize()
let storage: Storage | null = null
try {
  storage = window.localStorage
} catch {
  /* 隐私模式允许无存储使用。 */
}
const sidebar = createSidebarState(isMobile, {
  storage,
  storageKey: preview ? 'responsive-lab:preview-sidebar' : 'responsive-lab:sidebar',
})
provideSidebar(sidebar)
const current = computed(() => {
  const result = scenes.find((scene) => scene.id === active.value)
  return result === undefined ? scenes[0] : result
})
const page = computed(
  () =>
    ({
      lab: FramePlayground,
      sidebar: SidebarScenario,
      chat: ChatScenario,
      container: ContainerScenario,
      table: TableScenario,
      settings: SettingsScenario,
      workspace: WorkspaceScenario,
      overlay: OverlayScenario,
    })[active.value],
)
watch(active, (scene) => {
  const url = new URL(window.location.href)
  url.searchParams.set('scene', scene)
  window.history.replaceState(null, '', url)
})
useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
    event.preventDefault()
    sidebar.toggle()
  }
})
</script>

<template>
  <div class="app-shell" :class="{ 'is-preview': preview }">
    <a class="skip-link" href="#main-content">跳转到主要内容</a>
    <ResponsiveSidebar :active="active" :preview="preview" @navigate="active = $event" />
    <div class="app-inset">
      <header class="app-header">
        <button
          class="icon-button sidebar-trigger"
          :aria-label="isMobile ? '打开导航抽屉' : '切换桌面侧栏'"
          :aria-expanded="isMobile ? sidebar.mobileOpen.value : sidebar.desktopOpen.value"
          @click="sidebar.toggle()"
        >
          <AppIcon name="panel" :size="20" /></button
        ><span class="header-divider" /><span class="breadcrumb"
          >学习工作区 <span>/</span> <strong>{{ current.title }}</strong></span
        >
        <div class="header-right">
          <span class="viewport-indicator"
            ><AppIcon :name="isMobile ? 'phone' : 'monitor'" :size="14" />{{ width }}px</span
          ><span class="version-tag">VUE 3</span>
        </div>
      </header>
      <main id="main-content" class="main-content"><component :is="page" /></main>
      <footer class="app-footer">
        <span>屏幕适配实验室 <span class="muted">/</span> 从布局到交互</span
        ><a
          href="https://www.shadcn-vue.com/docs/components/sidebar"
          target="_blank"
          rel="noopener noreferrer"
          >shadcn-vue 设计参考 ↗</a
        >
      </footer>
    </div>
  </div>
</template>
