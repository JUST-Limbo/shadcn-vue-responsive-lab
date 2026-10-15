<script setup lang="ts">
import { computed, ref } from 'vue'
import { scenes, readScene } from '../core/breakpoints'
import AppIcon from '../components/AppIcon.vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'

const frameWidth = ref(1024)
const frameScene = ref('sidebar')
const reloadKey = ref(0)
const presets = [390, 640, 767, 768, 1024, 1280]
// src 不随宽度变化，拖动时只改变 iframe 视口，保留其中所有运行状态。
const frameSource = computed(() => `/?preview=1&scene=${readScene(frameScene.value)}`)
</script>

<template>
  <ScenarioIntro
    eyebrow="RESPONSIVE / PLAYGROUND"
    title="把窗口拖小，看看发生了什么。"
    description="一组可以操作的 Vue 3 适配案例。无需打开开发者工具，直接改变下面的独立视口，观察布局、交互与状态。"
  />
  <div class="lab-summary">
    <span><i class="live-dot" /> 7 个交互场景</span><span>1 套共享业务逻辑</span
    ><span>CSS + 响应式状态</span>
  </div>
  <section class="frame-panel">
    <div class="frame-toolbar">
      <div class="segmented" aria-label="预设视口宽度">
        <button
          v-for="size in presets"
          :key="size"
          :class="{ selected: frameWidth === size }"
          @click="frameWidth = size"
        >
          {{ size }}
        </button>
      </div>
      <select v-model="frameScene" aria-label="选择预览场景">
        <option
          v-for="scene in scenes.filter((item) => item.id !== 'lab')"
          :key="scene.id"
          :value="scene.id"
        >
          {{ scene.title }}
        </option>
      </select>
      <button
        class="icon-button"
        title="重新加载预览"
        aria-label="重新加载预览"
        @click="reloadKey += 1"
      >
        <AppIcon name="next" />
      </button>
    </div>
    <div class="width-control">
      <AppIcon name="phone" :size="16" /><input
        v-model.number="frameWidth"
        type="range"
        min="320"
        max="1440"
        aria-label="预览视口宽度"
      /><AppIcon name="monitor" :size="18" /><output>{{ frameWidth }}px</output>
    </div>
    <div class="frame-stage">
      <iframe
        :key="reloadKey"
        :src="frameSource"
        :style="{ width: `${frameWidth}px` }"
        title="可调整宽度的适配场景"
      />
    </div>
    <div class="frame-caption">
      <span>超过可用宽度时，预览区域可以横向滚动。</span
      ><span class="code-tag">iframe width ≠ CSS scale</span>
    </div>
  </section>
  <div class="learning-cards">
    <article>
      <span class="step-number">01</span>
      <h2>先看布局</h2>
      <p>侧栏如何占位，抽屉如何覆盖，聊天双栏如何变为单屏。</p>
    </article>
    <article>
      <span class="step-number">02</span>
      <h2>再看状态</h2>
      <p>窗口变化不等于业务重置。区分用户偏好和临时打开状态。</p>
    </article>
    <article>
      <span class="step-number">03</span>
      <h2>最后看边界</h2>
      <p>试试 767 / 768px，再展开侧栏，理解视口查询与容器查询。</p>
    </article>
  </div>
</template>
