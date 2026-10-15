import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { createSidebarState, provideSidebar } from '../core/sidebar'
import ResponsiveSidebar from './ResponsiveSidebar.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('侧栏容器切换', () => {
  it('切到桌面后移除 Portal 和遮罩，再缩回手机恢复抽屉', async () => {
    const mobile = ref(true)
    let state: ReturnType<typeof createSidebarState> | undefined
    const Harness = defineComponent({
      components: { ResponsiveSidebar },
      setup() {
        state = createSidebarState(mobile)
        provideSidebar(state)
        return {}
      },
      template: '<ResponsiveSidebar active="sidebar" :preview="true" />',
    })
    const wrapper = mount(Harness, { attachTo: document.body })
    if (state === undefined) throw new Error('状态初始化失败')
    state.mobileOpen.value = true
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.querySelector('.sheet-overlay')).not.toBeNull()
    mobile.value = false
    await nextTick()
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.querySelector('.sheet-overlay')).toBeNull()
    expect(wrapper.find('.sidebar-gap').exists()).toBe(true)
    mobile.value = true
    await flushPromises()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    state.mobileOpen.value = false
    await flushPromises()
    wrapper.unmount()
  })
})
