<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'reka-ui'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import AppIcon from '../components/AppIcon.vue'

const open = ref(false)
const name = ref('')
const summary = ref('')
const feedback = ref('')

function save() {
  feedback.value = `已模拟创建「${name.value.trim()}」，未发送网络请求。`
  open.value = false
}
</script>

<template>
  <ScenarioIntro
    eyebrow="07 / OVERLAY & INPUT"
    title="桌面居中，手机从底部出现。"
    description="使用同一个 Reka Dialog，CSS 决定位置和动画。演示焦点管理、Escape、遮罩关闭和长内容滚动。"
  />
  <div class="demo-two-columns">
    <section class="panel overlay-example">
      <span class="empty-icon"><AppIcon name="layers" :size="28" /></span>
      <h2>新建一个学习项目</h2>
      <p>打开后试着按 Tab、Escape，再调整窗口宽度。这里始终是同一个弹层实例。</p>
      <button class="button primary" @click="open = true">
        <AppIcon name="plus" />打开自适应弹层
      </button>
      <p class="feedback" role="status">{{ feedback }}</p>
    </section>
    <section class="panel">
      <div class="section-heading">
        <h2>可以验证的细节</h2>
        <span class="badge">不依赖 UA</span>
      </div>
      <ul class="check-list">
        <li><AppIcon name="check" />桌面弹窗居中，手机底部 Sheet</li>
        <li><AppIcon name="check" />Portal 让弹层不受父级 overflow 裁切</li>
        <li><AppIcon name="check" />默认使用 Reka 的模态与焦点行为</li>
        <li><AppIcon name="check" />表单 16px 字号，保留页面缩放能力</li>
        <li><AppIcon name="check" />内部滚动与 env(safe-area-inset-bottom)</li>
      </ul>
      <div class="callout">
        <strong>软键盘不等于屏幕断点</strong>
        <p>
          dvh 处理动态视口高度，但不能保证所有浏览器的键盘行为一致。此案例没有注入 VisualViewport
          补丁，需要在实际手机上验证。
        </p>
      </div>
    </section>
  </div>
  <DialogRoot v-model:open="open"
    ><DialogPortal
      ><DialogOverlay class="sheet-overlay" /><DialogContent class="adaptive-dialog"
        ><div class="dialog-grip" aria-hidden="true" />
        <div class="dialog-heading">
          <div>
            <DialogTitle>新建学习项目</DialogTitle
            ><DialogDescription>本地表单演示，不会提交到服务器。</DialogDescription>
          </div>
          <button class="icon-button" aria-label="关闭新建项目" @click="open = false">
            <AppIcon name="close" />
          </button>
        </div>
        <form class="dialog-form" @submit.prevent="save">
          <label
            >项目名称<input
              v-model="name"
              required
              maxlength="50"
              placeholder="例如：响应式界面研究" /></label
          ><label
            >项目说明<textarea
              v-model="summary"
              rows="4"
              maxlength="400"
              placeholder="写下你想研究的内容…"
            />
          </label>
          <div class="callout">
            <strong>试试跨断点</strong>
            <p>保持表单打开，把视口从 390px 拉到 1024px。弹层布局会改变，你输入的内容保持不变。</p>
          </div>
          <label class="inline-check"><input type="checkbox" />加入学习提醒（仅演示）</label>
          <div class="dialog-actions">
            <button type="button" class="button" @click="open = false">取消</button
            ><button class="button primary" :disabled="name.trim() === ''">创建演示项目</button>
          </div>
        </form></DialogContent
      ></DialogPortal
    ></DialogRoot
  >
  <p class="source-note">
    阅读路径：scenarios/OverlayScenario.vue → styles.css 中
    adaptive-dialog。与侧栏互斥分支不同，本例只通过 CSS 改变同一个弹层的位置。
  </p>
</template>
