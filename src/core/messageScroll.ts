import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface ScrollBox {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

/**
 * 消息区滚动策略。默认跟随底部，距离底部超过 40px 后保留阅读位置。
 * 用例：键盘开合、输入框增高、接收新消息均 restore；主动发送 / 回到底部用 toLatest。
 * 仅支持追加消息；向顶部加载历史需要另行记录消息锚点或 scrollHeight 差值。
 */
export function createMessageScrollPolicy(box: ScrollBox) {
  let following = true
  let readingTop = box.scrollTop
  let previousHeight = box.clientHeight
  const restore = () => {
    box.scrollTop = following ? Math.max(0, box.scrollHeight - box.clientHeight) : readingTop
    readingTop = box.scrollTop
    previousHeight = box.clientHeight
    return following
  }
  return {
    restore,
    onScroll() {
      // 高度变化引发的 scroll 不能误判为用户主动离开底部。
      if (box.clientHeight !== previousHeight) return restore()
      following = box.scrollHeight - box.clientHeight - box.scrollTop <= 40
      readingTop = box.scrollTop
      return following
    },
    toLatest() {
      following = true
      return restore()
    },
  }
}

export function useMessageScroll(
  viewport: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
) {
  const following = ref(true)
  let policy: ReturnType<typeof createMessageScrollPolicy> | null = null
  let observer: ResizeObserver | null = null
  const restore = () => {
    if (policy !== null) following.value = policy.restore()
  }
  const onScroll = () => {
    if (policy !== null) following.value = policy.onScroll()
  }
  const toLatest = () => {
    if (policy !== null) following.value = policy.toLatest()
  }
  onMounted(() => {
    if (viewport.value === null) return
    policy = createMessageScrollPolicy(viewport.value)
    toLatest()
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(restore)
      observer.observe(viewport.value)
      if (content.value !== null) observer.observe(content.value)
    }
  })
  onUnmounted(() => {
    if (observer !== null) observer.disconnect()
    policy = null
  })
  return { following, restore, onScroll, toLatest }
}
