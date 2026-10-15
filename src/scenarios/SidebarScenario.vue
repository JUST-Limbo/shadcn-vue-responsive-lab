<script setup lang="ts">
import { useSidebar } from '../core/sidebar'
import AppIcon from '../components/AppIcon.vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import StateInspector from '../components/StateInspector.vue'

const sidebar = useSidebar()
</script>

<template>
  <ScenarioIntro
    eyebrow="01 / SIDEBAR"
    title="菜单相同，容器不同。"
    description="宽屏为正文留出位置；窄屏通过抽屉覆盖正文。跨断点时切换组件，两个开关各自保存状态。"
  />
  <div class="demo-two-columns">
    <section class="panel">
      <div class="section-heading">
        <h2>侧栏控制</h2>
        <span class="badge">768px 切换</span>
      </div>
      <button class="button primary w-full" @click="sidebar.toggle()">
        <AppIcon name="panel" />{{
          sidebar.isMobile.value ? '打开 / 关闭手机抽屉' : '展开 / 收起桌面侧栏'
        }}
      </button>
      <label class="control-row"
        ><span><strong>桌面展开偏好</strong><small>手机中也能修改，用于验证状态独立</small></span
        ><input v-model="sidebar.desktopOpen.value" type="checkbox"
      /></label>
      <label class="control-row"
        ><span><strong>桌面收起模式</strong><small>icon 保留图标；offcanvas 完全收起</small></span
        ><select v-model="sidebar.desktopMode.value">
          <option value="icon">icon</option>
          <option value="offcanvas">offcanvas</option>
        </select></label
      >
      <label class="control-row"
        ><span
          ><strong>进入宽屏时关闭手机抽屉</strong
          ><small>默认关闭此策略，保留上游状态行为</small></span
        ><input v-model="sidebar.closeOnDesktop.value" type="checkbox"
      /></label>
      <div class="callout">
        <strong>试一试这条链路</strong>
        <p>窄屏打开菜单 → 拉到 1024px → 再缩回 390px。未启用关闭策略时，手机抽屉会重新打开。</p>
      </div>
    </section>
    <StateInspector />
  </div>
  <section class="panel anatomy-panel">
    <div class="section-heading">
      <h2>布局解剖</h2>
      <span class="code-tag">core/sidebar.ts → ResponsiveSidebar.vue</span>
    </div>
    <div class="anatomy-grid">
      <div>
        <span class="eyebrow">DESKTOP</span>
        <div class="anatomy desktop"><span>gap 占位</span><span>正文 flex: 1</span></div>
        <p>fixed 侧栏 + 正常流中的 gap。展开和收起时，宽度同步过渡。</p>
      </div>
      <div>
        <span class="eyebrow">MOBILE</span>
        <div class="anatomy mobile"><span>正文全宽</span><span>Sheet 覆盖层</span></div>
        <p>Portal + 遮罩，不占正文宽度。按 Escape、点击遮罩或导航可关闭。</p>
      </div>
    </div>
  </section>
</template>
