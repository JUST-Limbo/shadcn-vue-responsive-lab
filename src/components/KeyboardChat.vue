<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import { useMessageScroll } from '../core/messageScroll'

const props = withDefaults(
  defineProps<{ standalone?: boolean; viewportHeight: number; viewportSummary?: string }>(),
  { standalone: false, viewportSummary: '' },
)
// 本地教学数据，用来制造真实的消息滚动；不连接聊天服务。
const examples = [
  '点击输入框，观察消息区如何给键盘让出空间。',
  '标题和输入栏保持尺寸，中间的消息列表负责收缩。',
  '试着向上翻历史，再模拟收到消息，阅读位置应保持。',
  '主动发送消息会回到底部，草稿只在当前页面内存中保存。',
]
const messages = ref(
  Array.from({ length: 16 }, (_, index) => ({
    id: index + 1,
    mine: index % 3 === 1,
    text: examples[index % examples.length],
  })),
)
const draft = ref('')
const focused = ref(false)
const unread = ref(0)
const messageViewport = ref<HTMLElement | null>(null)
const messageContent = ref<HTMLElement | null>(null)
const input = ref<HTMLTextAreaElement | null>(null)
const { following, restore, onScroll, toLatest } = useMessageScroll(messageViewport, messageContent)

function resizeInput() {
  const element = input.value
  if (element === null) return
  element.style.height = 'auto'
  element.style.height = `${Math.min(128, element.scrollHeight)}px`
}

async function send() {
  const text = draft.value.trim()
  if (text === '') return
  messages.value.push({ id: messages.value.length + 1, mine: true, text })
  draft.value = ''
  unread.value = 0
  await nextTick()
  resizeInput()
  toLatest()
  // 触屏点发送后继续输入，避免键盘被按钮焦点意外收起；不在页面打开时自动聚焦。
  if (input.value !== null) input.value.focus({ preventScroll: true })
}

async function receive() {
  const wasFollowing = following.value
  messages.value.push({
    id: messages.value.length + 1,
    mine: false,
    text: '本地模拟收到新消息：翻历史时不会强制跳到底部。',
  })
  if (!wasFollowing) unread.value += 1
  await nextTick()
  restore()
}

function jumpToLatest() {
  unread.value = 0
  toLatest()
}

watch(following, (value) => {
  if (value) unread.value = 0
})
watch(draft, async () => {
  await nextTick()
  resizeInput()
  restore()
})
watch(
  () => props.viewportHeight,
  async () => {
    await nextTick()
    restore()
  },
)
onMounted(resizeInput)
</script>

<template>
  <section
    class="keyboard-chat"
    :style="{ '--keyboard-chat-height': `${viewportHeight}px` }"
    aria-label="软键盘适配聊天案例"
  >
    <header class="keyboard-chat-header">
      <div class="keyboard-chat-title">
        <a v-if="standalone" class="icon-button" href="/?scene=keyboard" aria-label="返回案例说明">
          <AppIcon name="back" />
        </a>
        <div>
          <h2>键盘与聊天布局</h2>
          <p>
            {{ focused ? '正在输入' : '本地演示会话' }} · {{ following ? '跟随底部' : '阅读历史' }}
          </p>
        </div>
      </div>
      <div class="keyboard-chat-actions">
        <button class="button" type="button" @click="receive">模拟来信</button>
        <button v-if="!following" class="button" type="button" @click="jumpToLatest">
          回到底部{{ unread > 0 ? ` · ${unread}` : '' }}
        </button>
      </div>
      <p v-if="viewportSummary" class="keyboard-live-metrics">{{ viewportSummary }}</p>
    </header>
    <div
      ref="messageViewport"
      class="keyboard-message-viewport"
      aria-label="消息列表"
      tabindex="0"
      @scroll="onScroll"
    >
      <div ref="messageContent" class="keyboard-message-content">
        <p class="keyboard-message-note">以下均为本地演示数据</p>
        <p
          v-for="message in messages"
          :key="message.id"
          class="keyboard-bubble"
          :class="{ mine: message.mine }"
        >
          {{ message.text }}
        </p>
      </div>
    </div>
    <form class="keyboard-composer" @submit.prevent="send">
      <label class="sr-only" for="keyboard-message">消息内容</label>
      <textarea
        id="keyboard-message"
        ref="input"
        v-model="draft"
        rows="1"
        placeholder="输入消息；换行观察输入框增高…"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button class="button primary" :disabled="draft.trim() === ''" aria-label="发送消息">
        <AppIcon name="send" />
      </button>
    </form>
  </section>
</template>
