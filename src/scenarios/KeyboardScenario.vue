<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import KeyboardChat from '../components/KeyboardChat.vue'
import { useVisualViewport } from '../core/visualViewport'

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false })
const { metrics, layout } = useVisualViewport()
const screenHeight = ref(700)
const keyboardHeight = ref(0)
const availableHeight = computed(() => screenHeight.value - keyboardHeight.value)
const isEmbedded = window.self !== window.top
const standaloneUrl = '/?scene=keyboard&standalone=1'
const liveSummary = computed(
  () =>
    `可视区 ${Math.round(metrics.value.width)} × ${Math.round(metrics.value.height)} · top ${Math.round(metrics.value.top)} · scale ${metrics.value.scale.toFixed(2)}`,
)
const fullscreenStyle = computed(() => ({
  width: `${layout.value.width}px`,
  height: `${layout.value.height}px`,
  top: `${layout.value.top}px`,
  left: `${layout.value.left}px`,
}))
let previousBodyOverflow = ''
let previousRootOverflow = ''
onMounted(() => {
  if (!props.standalone) return
  previousBodyOverflow = document.body.style.overflow
  previousRootOverflow = document.documentElement.style.overflow
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
})
onUnmounted(() => {
  if (!props.standalone) return
  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousRootOverflow
})
</script>

<template>
  <main v-if="standalone" class="keyboard-fullscreen" :style="fullscreenStyle">
    <KeyboardChat standalone :viewport-height="layout.height" :viewport-summary="liveSummary" />
  </main>
  <template v-else>
    <ScenarioIntro
      eyebrow="08 / KEYBOARD & VIEWPORT"
      title="键盘升起，让消息区让出空间。"
      description="标题和输入栏保持可用，中间消息区收缩。在底部就继续跟随，翻历史时保持阅读位置，草稿不因高度变化而重置。"
    />
    <section class="panel keyboard-controls" aria-label="可视高度模拟设置">
      <div class="keyboard-control-heading">
        <div>
          <h2>先模拟高度，再用手机验证</h2>
          <p>滑块只模拟空间变化，不会调起系统键盘。</p>
        </div>
        <a class="button primary" :href="standaloneUrl" target="_blank" rel="noopener"
          >打开独立聊天页 ↗</a
        >
      </div>
      <label for="keyboard-screen-height"
        >模拟屏幕高度 <output>{{ screenHeight }}px</output></label
      >
      <input
        id="keyboard-screen-height"
        v-model.number="screenHeight"
        type="range"
        min="560"
        max="840"
        step="10"
      />
      <label for="keyboard-sim-height"
        >模拟键盘占用 <output>{{ keyboardHeight }}px</output></label
      >
      <input
        id="keyboard-sim-height"
        v-model.number="keyboardHeight"
        type="range"
        min="0"
        max="320"
        step="10"
      />
      <div class="keyboard-presets">
        <button class="button" @click="keyboardHeight = 0">收起键盘</button>
        <button class="button" @click="keyboardHeight = 280">拉起键盘</button>
        <span class="badge">聊天可用高度 {{ availableHeight }}px</span>
      </div>
    </section>
    <div class="keyboard-lab-layout">
      <div class="keyboard-device" :style="{ height: `${screenHeight}px` }">
        <KeyboardChat
          :style="{ height: `${availableHeight}px` }"
          :viewport-height="availableHeight"
        />
        <div
          v-if="keyboardHeight > 0"
          class="keyboard-placeholder"
          :style="{ height: `${keyboardHeight}px` }"
          aria-label="模拟键盘占位"
        >
          <strong>系统键盘占位</strong><span>{{ keyboardHeight }}px · 仅用于模拟</span>
        </div>
      </div>
      <aside class="keyboard-guide" aria-label="观察步骤与实时数据">
        <section class="panel">
          <h2>按这个顺序观察</h2>
          <ol>
            <li>在消息底部，拉起 / 收起模拟键盘，最新消息应始终可见。</li>
            <li>向上翻历史，点“模拟来信”，阅读位置保持，显示未读数量。</li>
            <li>输入多行文字，消息区进一步收缩；发送后回到底部。</li>
            <li>保留草稿，反复调整高度，确认输入内容不丢失。</li>
            <li>手机直接打开独立页，观察真正的键盘、旋转和地址栏变化。</li>
          </ol>
        </section>
        <section class="panel">
          <h2>当前窗口测量</h2>
          <dl class="keyboard-metrics">
            <dt>数据来源</dt>
            <dd>{{ metrics.source }}</dd>
            <dt>可视高度</dt>
            <dd>{{ Math.round(metrics.height) }}px</dd>
            <dt>顶部偏移</dt>
            <dd>{{ Math.round(metrics.top) }}px</dd>
            <dt>缩放比例</dt>
            <dd>{{ metrics.scale.toFixed(2) }}</dd>
            <dt>窗口类型</dt>
            <dd>{{ isEmbedded ? 'iframe' : '顶层页面' }}</dd>
          </dl>
          <p>高度变化不等于键盘检测；缩放也会改变可视区域。</p>
        </section>
        <div class="callout">
          <strong>实机入口需要顶层页面</strong>
          <p>
            iframe 适合宽度和高度模拟。手机上请直接打开独立聊天页，iframe
            数据不能代表顶层页面的键盘行为。
          </p>
          <p>本机地址 127.0.0.1 只能在本机访问；手机接入方式见研究文档。</p>
        </div>
      </aside>
    </div>
    <p class="source-note">
      阅读路径：KeyboardScenario.vue → KeyboardChat.vue →
      core/visualViewport.ts、core/messageScroll.ts；完整资料见 docs/聊天软键盘适配.md。
    </p>
  </template>
</template>
