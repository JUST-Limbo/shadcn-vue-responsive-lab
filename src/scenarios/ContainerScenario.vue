<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import AppIcon from '../components/AppIcon.vue'

const targetWidth = ref(900)
const container = ref<HTMLElement | null>(null)
const { width } = useElementSize(container)
// 示例指标，不是真实监控数据。
const metrics = [
  { title: '本月访问', value: '24,680', change: '+12.8%' },
  { title: '活跃用户', value: '1,284', change: '+8.2%' },
  { title: '平均时长', value: '4m 32s', change: '+16.4%' },
  { title: '完成率', value: '96.8%', change: '+2.1%' },
]
</script>

<template>
  <ScenarioIntro
    eyebrow="03 / CONTAINER QUERIES"
    title="窗口没变，组件也能适配。"
    description="拖动容器宽度，或者展开左侧栏。卡片与分页只观察自己的可用空间，不用额外写 JS 断点。"
  />
  <section class="panel container-controls">
    <label for="container-width"
      >目标宽度 <strong>{{ targetWidth }}px</strong></label
    ><input
      id="container-width"
      v-model.number="targetWidth"
      type="range"
      min="260"
      max="1100"
    /><span class="badge">实际 {{ Math.round(width) }}px</span>
  </section>
  <!-- max-width 保证目标宽度再大，也不会撑破真实可用空间。 -->
  <div ref="container" class="query-container" :style="{ width: `${targetWidth}px` }">
    <div class="query-header">
      <div>
        <span class="eyebrow">WORKSPACE ANALYTICS</span>
        <h2>你的工作概览</h2>
      </div>
      <button class="button" disabled><AppIcon name="files" />导出示例</button>
    </div>
    <div class="metric-grid">
      <article v-for="metric in metrics" :key="metric.title" class="metric-card">
        <span>{{ metric.title }}</span
        ><strong>{{ metric.value }}</strong
        ><small>{{ metric.change }} <span>较上月</span></small>
      </article>
    </div>
    <div class="query-chart">
      <div class="section-heading">
        <h3>访问趋势</h3>
        <span class="badge">演示数据</span>
      </div>
      <div class="bars" aria-label="示例访问趋势柱状图">
        <span
          v-for="(height, index) in [32, 56, 43, 78, 61, 93, 71, 58, 86, 64, 97, 80]"
          :key="index"
          :style="{ height: `${height}%` }"
        />
      </div>
      <div class="chart-labels">
        <span>第 1 周</span><span>第 2 周</span><span>第 3 周</span><span>第 4 周</span>
      </div>
    </div>
    <div class="query-pagination">
      <span class="muted">共 48 条 · 第 1 / 5 页</span>
      <div>
        <button class="button pagination-edge" disabled>首页</button
        ><button class="icon-button" disabled aria-label="上一页"><AppIcon name="back" /></button
        ><button class="button page-active" disabled>1</button
        ><button class="button" disabled>2</button
        ><button class="icon-button" disabled aria-label="下一页"><AppIcon name="next" /></button
        ><button class="button pagination-edge" disabled>末页</button>
      </div>
    </div>
  </div>
  <div class="callout">
    <strong>媒体查询与容器查询的区别</strong>
    <p>
      本例卡片：容器不足 480px 为 1 列，480–719px 为 2 列，720px 起为 4
      列。侧栏展开会减少主区空间，但浏览器窗口宽度并没有变化。
    </p>
    <code>container-type: inline-size; container-name: sample;</code>
  </div>
  <p class="source-note">
    阅读路径：scenarios/ContainerScenario.vue → styles.css 中 @container sample。宽度显示使用
    JS，布局切换完全由 CSS 完成。
  </p>
</template>
