import { onMounted, onUnmounted, ref } from 'vue'

export interface ViewportSnapshot {
  width: number
  height: number
  top: number
  left: number
  scale: number
  source: 'visualViewport' | 'window'
}

function measure(target: Window): ViewportSnapshot {
  const viewport = target.visualViewport
  if (viewport === null || viewport === undefined) {
    return {
      width: target.innerWidth,
      height: target.innerHeight,
      top: 0,
      left: 0,
      scale: 1,
      source: 'window',
    }
  }
  return {
    width: viewport.width,
    height: viewport.height,
    top: viewport.offsetTop,
    left: viewport.offsetLeft,
    scale: viewport.scale,
    source: 'visualViewport',
  }
}

/**
 * 观测当前窗口的可视区域，连续 resize / scroll 每帧合并一次。
 * 用例：键盘压缩可视区、浏览器平移视口、旋转设备；这些事件不等同于键盘检测。
 * 没有 VisualViewport 时降级到 innerHeight，不能保证识别覆盖式键盘。
 * 返回的清理函数同时取消监听和待执行帧，适合组件卸载时调用。
 */
export function observeVisualViewport(target: Window, publish: (value: ViewportSnapshot) => void) {
  const viewport = target.visualViewport
  let frame: number | null = null
  const update = () => {
    frame = null
    const next = measure(target)
    // 页面切后台等过程可能短暂返回零尺寸，保留最后一份可用测量。
    if (next.width > 0 && next.height > 0) publish(next)
  }
  const schedule = () => {
    if (frame === null) frame = target.requestAnimationFrame(update)
  }
  update()
  target.addEventListener('resize', schedule)
  if (viewport !== null && viewport !== undefined) {
    viewport.addEventListener('resize', schedule)
    viewport.addEventListener('scroll', schedule)
  }
  return () => {
    target.removeEventListener('resize', schedule)
    if (viewport !== null && viewport !== undefined) {
      viewport.removeEventListener('resize', schedule)
      viewport.removeEventListener('scroll', schedule)
    }
    if (frame !== null) target.cancelAnimationFrame(frame)
    frame = null
  }
}

export function useVisualViewport(target: Window = window) {
  const metrics = ref(measure(target))
  const layout = ref(
    Math.abs(metrics.value.scale - 1) < 0.01
      ? metrics.value
      : {
          ...metrics.value,
          width: target.innerWidth,
          height: target.innerHeight,
          top: 0,
          left: 0,
          scale: 1,
        },
  )
  let stop = () => {}
  onMounted(() => {
    stop = observeVisualViewport(target, (next) => {
      metrics.value = next
      // 捏合放大时允许浏览器自然缩放和平移，避免聊天框跟着缩小重排。
      if (Math.abs(next.scale - 1) < 0.01) layout.value = next
    })
  })
  onUnmounted(() => stop())
  return { metrics, layout }
}
