import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { observeVisualViewport, useVisualViewport, type ViewportSnapshot } from './visualViewport'

function setup(useViewport = true) {
  const viewport = Object.assign(new EventTarget(), {
    width: 390,
    height: 740,
    offsetTop: 0,
    offsetLeft: 0,
    scale: 1,
  })
  const frames = new Map<number, FrameRequestCallback>()
  let frameId = 0
  const target = Object.assign(new EventTarget(), {
    visualViewport: useViewport ? viewport : null,
    innerWidth: 390,
    innerHeight: 800,
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      frameId += 1
      frames.set(frameId, callback)
      return frameId
    }),
    cancelAnimationFrame: vi.fn((id: number) => frames.delete(id)),
  })
  const values: ViewportSnapshot[] = []
  const stop = observeVisualViewport(target as unknown as Window, (value) => values.push(value))
  const flush = () => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach((callback) => callback(0))
  }
  return { viewport, target, frames, values, stop, flush }
}

describe('可视视口测量', () => {
  it('高度和偏移变化每帧合并；直接发布可视高度，不重复扣键盘高度', () => {
    const { viewport, target, values, stop, flush } = setup()
    viewport.height = 420
    viewport.offsetTop = 36
    viewport.dispatchEvent(new Event('resize'))
    viewport.dispatchEvent(new Event('scroll'))
    expect(target.requestAnimationFrame).toHaveBeenCalledTimes(1)
    flush()
    expect(values[1]).toMatchObject({ height: 420, top: 36, source: 'visualViewport' })
    stop()
  })

  it('卸载时取消待执行帧并移除所有监听', () => {
    const { viewport, target, frames, values, stop } = setup()
    viewport.dispatchEvent(new Event('resize'))
    stop()
    expect(target.cancelAnimationFrame).toHaveBeenCalledTimes(1)
    expect(frames.size).toBe(0)
    viewport.dispatchEvent(new Event('resize'))
    viewport.dispatchEvent(new Event('scroll'))
    target.dispatchEvent(new Event('resize'))
    expect(target.requestAnimationFrame).toHaveBeenCalledTimes(1)
    expect(values).toHaveLength(1)
  })

  it('API 缺失时使用 innerHeight；零高度不覆盖上一次有效值', () => {
    const { target, values, stop, flush } = setup(false)
    expect(values[0]).toMatchObject({ height: 800, top: 0, source: 'window' })
    target.innerHeight = 480
    target.dispatchEvent(new Event('resize'))
    flush()
    expect(values[1].height).toBe(480)
    target.innerHeight = 0
    target.dispatchEvent(new Event('resize'))
    flush()
    expect(values).toHaveLength(2)
    stop()
  })

  it('捏合缩放继续更新测量，但保留聊天布局；恢复原比例后重新跟随', () => {
    const { target, viewport, stop, flush } = setup()
    stop()
    const probe = defineComponent({
      setup: () => useVisualViewport(target as unknown as Window),
      template: '<div />',
    })
    const wrapper = mount(probe)
    viewport.height = 370
    viewport.scale = 2
    viewport.dispatchEvent(new Event('resize'))
    flush()
    expect(wrapper.vm.metrics.height).toBe(370)
    expect(wrapper.vm.layout.height).toBe(740)
    viewport.scale = 1
    viewport.height = 420
    viewport.dispatchEvent(new Event('resize'))
    flush()
    expect(wrapper.vm.layout.height).toBe(420)
    wrapper.unmount()
  })
})
