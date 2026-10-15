<script setup lang="ts">
import { computed, ref } from 'vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import AppIcon from '../components/AppIcon.vue'

const sections = [
  { id: 'profile', label: '个人资料', icon: 'panel', description: '管理工作区中展示的个人信息。' },
  { id: 'account', label: '账号设置', icon: 'settings', description: '这是账号设置的演示内容。' },
  { id: 'appearance', label: '外观偏好', icon: 'grid', description: '这是外观偏好的演示内容。' },
  { id: 'notifications', label: '通知设置', icon: 'chat', description: '这是通知设置的演示内容。' },
]
const activeId = ref('profile')
const active = computed(() => {
  const result = sections.find((item) => item.id === activeId.value)
  return result === undefined ? sections[0] : result
})
const displayName = ref('适配学习者')
const bio = ref('正在研究一套界面如何适配不同的屏幕。')
const feedback = ref('')
</script>

<template>
  <ScenarioIntro
    eyebrow="05 / ADAPTIVE NAVIGATION"
    title="相同的选项，三种导航形态。"
    description="手机使用下拉框，中屏使用横向导航，大屏使用左侧纵向导航。选中状态和右侧表单始终共用。"
  />
  <div class="status-strip">
    <span>&lt; 768：下拉</span><span>768–1023：横排</span><span>≥ 1024：纵排</span>
  </div>
  <div class="settings-layout">
    <select v-model="activeId" class="settings-select" aria-label="设置分类">
      <option v-for="section in sections" :key="section.id" :value="section.id">
        {{ section.label }}
      </option>
    </select>
    <nav class="settings-nav" aria-label="设置分类">
      <button
        v-for="section in sections"
        :key="section.id"
        :class="{ active: activeId === section.id }"
        :aria-current="activeId === section.id ? 'page' : undefined"
        @click="activeId = section.id"
      >
        <AppIcon :name="section.icon" /><span>{{ section.label }}</span>
      </button>
    </nav>
    <form
      class="settings-form panel"
      @submit.prevent="feedback = '已在当前页面保留演示输入，未提交到服务器。'"
    >
      <h2>{{ active.label }}</h2>
      <p class="muted">{{ active.description }}</p>
      <label
        >显示名称<input v-model="displayName" required maxlength="40" /><small
          >切换导航或屏幕宽度，内容不会丢失。</small
        ></label
      ><label>个人介绍<textarea v-model="bio" rows="4" maxlength="300" /></label
      ><label class="inline-check"><input type="checkbox" checked />接收工作区更新提醒</label
      ><button class="button primary">保存演示设置</button>
      <p class="feedback" role="status">{{ feedback }}</p>
    </form>
  </div>
  <p class="source-note">
    阅读路径：scenarios/SettingsScenario.vue · settings-select / settings-nav
    的显示和方向由媒体查询控制，表单没有重复渲染。
  </p>
</template>
