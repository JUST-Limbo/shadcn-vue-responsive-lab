<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useSidebar } from '../core/sidebar'

const sidebar = useSidebar()
const { width } = useWindowSize()
</script>

<template>
  <section class="inspector" aria-label="侧栏状态观测">
    <div class="section-heading">
      <h2>实时状态</h2>
      <span class="code-tag">provide / inject</span>
    </div>
    <div class="state-grid">
      <div>
        <span>视口宽度</span><strong>{{ width }}<small> px</small></strong>
      </div>
      <div>
        <span>当前分支</span
        ><strong>{{ sidebar.isMobile.value ? '手机 Sheet' : '桌面 Sidebar' }}</strong>
      </div>
      <div>
        <span>desktopOpen · 持久化</span
        ><strong :class="{ 'text-teal': sidebar.desktopOpen.value }">{{
          sidebar.desktopOpen.value
        }}</strong>
      </div>
      <div>
        <span>mobileOpen · 仅内存</span
        ><strong :class="{ 'text-teal': sidebar.mobileOpen.value }">{{
          sidebar.mobileOpen.value
        }}</strong>
      </div>
    </div>
    <div class="event-heading"><span>状态与生命周期</span><span>最近 10 条</span></div>
    <ol class="event-log" aria-label="生命周期日志">
      <li v-for="event in sidebar.events.value" :key="event.id">
        <time>{{ event.time }}</time
        ><span>{{ event.message }}</span>
      </li>
    </ol>
  </section>
</template>
