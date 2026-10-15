<script setup lang="ts">
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'reka-ui'
import { WORKSPACE_QUERY } from '../core/breakpoints'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import AppIcon from '../components/AppIcon.vue'
import ArtifactDocument from '../components/ArtifactDocument.vue'

const wide = useMediaQuery(WORKSPACE_QUERY)
const panelOpen = ref(true)
const mobileOpen = ref(false)
const selectedTab = ref('preview')
const draft = ref('')
const notes = ref<string[]>([])

function submit() {
  if (draft.value.trim() === '') return
  notes.value.push(draft.value.trim())
  draft.value = ''
}
</script>

<template>
  <ScenarioIntro
    eyebrow="06 / ARTIFACT WORKSPACE"
    title="把空间留给正在做的事。"
    description="1280px 起并排展示产物；空间不足时用全屏面板。右侧内容共用一个模板，主聊天始终只有一份。"
  />
  <section class="artifact-workspace">
    <div class="workspace-main">
      <div class="workspace-heading">
        <span><i class="live-dot" /> 正在整理一份方案</span
        ><button class="button" @click="wide ? (panelOpen = !panelOpen) : (mobileOpen = true)">
          <AppIcon name="files" />{{ wide && panelOpen ? '收起产物' : '查看产物' }}
        </button>
      </div>
      <div class="workspace-messages">
        <div class="bubble mine">帮我整理一份移动端适配方案。</div>
        <div class="bubble">
          已经整理好了。桌面可以一边对话一边查看右侧文档；手机通过顶部入口进入全屏预览。
        </div>
        <button class="artifact-card" @click="wide ? (panelOpen = true) : (mobileOpen = true)">
          <span class="file-icon"><AppIcon name="file" :size="24" /></span
          ><span><strong>移动端适配方案.md</strong><small>文档 · 本地演示产物</small></span
          ><AppIcon name="next" />
        </button>
        <div v-for="(note, index) in notes" :key="index" class="bubble mine">{{ note }}</div>
      </div>
      <form class="chat-composer" @submit.prevent="submit">
        <input v-model="draft" placeholder="继续补充你的想法…" aria-label="工作台消息" /><button
          class="button primary"
          :disabled="draft.trim() === ''"
        >
          <AppIcon name="send" />
        </button>
      </form>
    </div>
    <aside v-if="wide && panelOpen" class="desktop-artifact">
      <div class="artifact-header">
        <h2>产物预览</h2>
        <button class="icon-button" aria-label="关闭产物侧栏" @click="panelOpen = false">
          <AppIcon name="close" />
        </button>
      </div>
      <div class="artifact-tabs">
        <button :class="{ active: selectedTab === 'preview' }" @click="selectedTab = 'preview'">
          预览</button
        ><button :class="{ active: selectedTab === 'source' }" @click="selectedTab = 'source'">
          源码说明
        </button>
      </div>
      <ArtifactDocument :source="selectedTab === 'source'" />
    </aside>
  </section>
  <DialogRoot v-if="!wide" v-model:open="mobileOpen"
    ><DialogPortal
      ><DialogOverlay class="sheet-overlay" /><DialogContent class="artifact-fullscreen"
        ><div class="artifact-header">
          <DialogTitle>产物预览</DialogTitle
          ><button class="icon-button" aria-label="关闭全屏产物" @click="mobileOpen = false">
            <AppIcon name="close" />
          </button>
        </div>
        <DialogDescription class="sr-only">当前产物的全屏预览，关闭后回到原聊天。</DialogDescription
        ><ArtifactDocument /></DialogContent></DialogPortal
  ></DialogRoot>
  <p class="source-note">
    阅读路径：scenarios/WorkspaceScenario.vue · wide 决定容器；panelOpen 与 mobileOpen
    各自控制开关。主消息与草稿不会因预览切换而销毁。
  </p>
</template>
