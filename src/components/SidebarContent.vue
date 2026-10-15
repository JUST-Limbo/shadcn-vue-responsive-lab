<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { scenes } from '../core/breakpoints'
import type { SceneId } from '../core/breakpoints'
import { useSidebar } from '../core/sidebar'
import AppIcon from './AppIcon.vue'

const props = defineProps<{ active: SceneId; surface: 'desktop' | 'mobile'; preview: boolean }>()
const emit = defineEmits<{ navigate: [id: SceneId] }>()
const sidebar = useSidebar()
onMounted(() => sidebar.record(`${props.surface === 'mobile' ? '手机' : '桌面'}菜单内容挂载`))
onUnmounted(() => sidebar.record(`${props.surface === 'mobile' ? '手机' : '桌面'}菜单内容卸载`))

function navigate(id: SceneId) {
  emit('navigate', id)
  sidebar.closeMobileOnNavigate()
}
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-brand">
      <span class="brand-mark"><AppIcon name="layers" :size="22" /></span>
      <div class="sidebar-label">
        <strong>适配实验室</strong><span>Vue 3 · SHADCN PATTERNS</span>
      </div>
      <button
        v-if="surface === 'mobile'"
        class="icon-button drawer-close"
        aria-label="关闭导航"
        @click="sidebar.mobileOpen.value = false"
      >
        <AppIcon name="close" />
      </button>
    </div>
    <div class="sidebar-group-label sidebar-label">学习场景</div>
    <nav class="sidebar-nav" aria-label="学习场景">
      <template v-for="scene in scenes" :key="scene.id">
        <button
          v-if="!preview || scene.id !== 'lab'"
          class="nav-item"
          :class="{ active: active === scene.id }"
          :title="scene.title"
          :aria-current="active === scene.id ? 'page' : undefined"
          @click="navigate(scene.id)"
        >
          <AppIcon :name="scene.icon" /><span class="sidebar-label">{{ scene.title }}</span
          ><span class="nav-dot sidebar-label" />
        </button>
      </template>
    </nav>
    <div class="sidebar-note sidebar-label">
      <span class="live-dot" /> 同一份菜单，两种容器<br /><span>拖动窗口，观察状态如何接力。</span>
    </div>
    <div class="sidebar-footer">
      <span class="avatar">V</span>
      <div class="sidebar-label">
        <strong>本地学习工作区</strong><span>演示数据 · 无需登录</span>
      </div>
    </div>
  </div>
</template>
