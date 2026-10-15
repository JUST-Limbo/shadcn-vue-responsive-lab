<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { CHAT_QUERY } from '../core/breakpoints'
import AppIcon from '../components/AppIcon.vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'

// 示例数据：仅在当前页面内存中交互，不连接任何聊天服务。
const conversations = [
  {
    id: 1,
    name: '产品设计小组',
    initials: '设',
    color: '#e6f1ec',
    preview: '我们来讨论一下移动端的导航。',
    time: '10:24',
  },
  {
    id: 2,
    name: '林小雨',
    initials: '林',
    color: '#eee9f6',
    preview: '这份交互稿你看过了吗？',
    time: '09:52',
  },
  {
    id: 3,
    name: '前端学习伙伴',
    initials: '前',
    color: '#f6eedf',
    preview: '容器查询的例子很直观。',
    time: '昨天',
  },
  {
    id: 4,
    name: '适配实验室',
    initials: '适',
    color: '#e6edf7',
    preview: '欢迎来到你的响应式工作区。',
    time: '周一',
  },
]
const selectedId = ref<number | null>(null)
const mobileDetailOpen = ref(false)
const search = ref('')
const draft = ref('')
const isSinglePane = useMediaQuery(CHAT_QUERY)
const sent = ref<Record<number, string[]>>({})
const selected = computed(() => conversations.find((item) => item.id === selectedId.value))
const filtered = computed(() => conversations.filter((item) => item.name.includes(search.value)))
const messages = computed(() =>
  selectedId.value === null || sent.value[selectedId.value] === undefined
    ? []
    : sent.value[selectedId.value],
)

function open(id: number) {
  selectedId.value = id
  mobileDetailOpen.value = true
}

function send() {
  const text = draft.value.trim()
  if (text === '' || selectedId.value === null) return
  const id = selectedId.value
  const history = sent.value[id] === undefined ? [] : sent.value[id]
  sent.value = { ...sent.value, [id]: [...history, text] }
  draft.value = ''
}
</script>

<template>
  <ScenarioIntro
    eyebrow="02 / MASTER — DETAIL"
    title="大屏并排，小屏逐层进入。"
    description="共享同一份当前会话；手机返回只关闭详情，不清空业务选择。这里的单屏断点是 640px，与全局侧栏的 768px 不同。"
  />
  <div class="status-strip">
    <span>当前：{{ isSinglePane ? '单屏列表 / 详情' : '左右双栏' }}</span
    ><span>selectedId = {{ selectedId === null ? 'null' : selectedId }}</span
    ><span>detailOpen = {{ mobileDetailOpen }}</span>
  </div>
  <section class="chat-layout">
    <div class="conversation-list">
      <div class="chat-list-heading">
        <h2>收件箱 <span>04</span></h2>
        <AppIcon name="chat" />
      </div>
      <label class="search-box"
        ><AppIcon name="search" :size="16" /><input
          v-model="search"
          placeholder="搜索会话"
          aria-label="搜索会话"
      /></label>
      <div class="conversation-items">
        <button
          v-for="item in filtered"
          :key="item.id"
          class="conversation-item"
          :class="{ active: selectedId === item.id }"
          @click="open(item.id)"
        >
          <span class="avatar" :style="{ background: item.color }">{{ item.initials }}</span
          ><span class="conversation-copy"
            ><strong>{{ item.name }}</strong
            ><small>{{ item.preview }}</small></span
          ><time>{{ item.time }}</time>
        </button>
        <p v-if="filtered.length === 0" class="empty-note">没有匹配的会话</p>
      </div>
    </div>
    <div class="chat-details" :class="{ 'show-mobile': mobileDetailOpen }">
      <template v-if="selected !== undefined">
        <div class="chat-detail-header">
          <button
            class="icon-button sm:hidden"
            aria-label="返回会话列表"
            @click="mobileDetailOpen = false"
          >
            <AppIcon name="back" /></button
          ><span class="avatar" :style="{ background: selected.color }">{{
            selected.initials
          }}</span>
          <div>
            <strong>{{ selected.name }}</strong
            ><span class="muted block text-xs">本地演示会话</span>
          </div>
          <span class="badge ml-auto">同一组件</span>
        </div>
        <div class="chat-messages" aria-label="消息列表">
          <span class="message-date">今天</span>
          <div class="bubble">我们来讨论一下：同一份内容在手机和电脑上，应该怎样组织？</div>
          <div class="bubble mine">可以保留业务状态，把展示方式交给断点。</div>
          <div class="bubble">没错。试着返回列表，再把窗口拉宽，当前会话仍然在。</div>
          <div v-for="(message, index) in messages" :key="index" class="bubble mine">
            {{ message }}
          </div>
        </div>
        <form class="chat-composer" @submit.prevent="send">
          <button
            type="button"
            class="icon-button hidden lg:inline-flex"
            aria-label="演示附件入口"
            disabled
          >
            <AppIcon name="plus" /></button
          ><input v-model="draft" aria-label="消息内容" placeholder="输入一条本地消息…" /><button
            class="button primary"
            :disabled="draft.trim() === ''"
          >
            <AppIcon name="send" /><span class="hidden sm:inline">发送</span>
          </button>
        </form>
      </template>
      <div v-else class="chat-empty">
        <span class="empty-icon"><AppIcon name="chat" :size="30" /></span>
        <h2>从一个会话开始</h2>
        <p>选择左侧联系人，观察宽屏与窄屏的差异。</p>
      </div>
    </div>
  </section>
  <p class="source-note">
    阅读路径：scenarios/ChatScenario.vue · CSS 控制定位，selectedId 保存业务选择，mobileDetailOpen
    保存手机展示状态。演示发送只写入内存。
  </p>
</template>
