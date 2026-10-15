<script setup lang="ts">
withDefaults(defineProps<{ source?: boolean }>(), { source: false })
</script>

<template>
  <article class="artifact-document">
    <span class="eyebrow">DESIGN NOTE / 001</span>
    <h3>{{ source ? '实现说明' : '移动端适配方案' }}</h3>
    <template v-if="source"
      ><p>父组件根据断点选择 aside 或 Dialog；两者渲染相同的 ArtifactDocument。</p>
      <h4>业务状态放在共同父级</h4>
      <p>notes 和 draft 位于 WorkspaceScenario，产物预览切换不会销毁主聊天。</p>
      <h4>视图状态各自保存</h4>
      <p>panelOpen 管桌面分栏，mobileOpen 管手机弹层。这个例子保留跨断点的打开状态。</p></template
    >
    <template v-else
      ><p>共享一套业务状态，根据可用空间调整布局和交互。</p>
      <h4>01 / 导航</h4>
      <p>窄屏默认关闭侧栏，以覆盖式抽屉打开。</p>
      <h4>02 / 对话与产物</h4>
      <p>宽屏并排展示，小屏切换全屏面板；主聊天实例保持挂载。</p>
      <h4>03 / 输入体验</h4>
      <p>内容自然换行，操作入口按重要性重新排列。</p></template
    >
    <div class="document-note">
      桌面分栏偏好与手机打开状态相互独立。跨断点切换的是容器，没有额外的变形动画。
    </div>
  </article>
</template>
