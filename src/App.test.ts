import { afterEach, describe, expect, it } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from './App.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('学习场景可从共享导航访问', () => {
  it('初始实验台使用真实 iframe，所有案例可切换且没有嵌套实验台', async () => {
    window.history.replaceState(null, '', '/')
    // 不接入文档，避免 DOM 模拟器尝试加载真实 iframe；Portal 在专门的集成测试中验证。
    const wrapper = mount(App)
    await flushPromises()
    const frame = wrapper.find('iframe')
    expect(frame.attributes('src')).toBe('/?preview=1&scene=sidebar')
    const titles = [
      '菜单相同，容器不同。',
      '大屏并排，小屏逐层进入。',
      '窗口没变，组件也能适配。',
      '让数据可读，而不是把表格缩小。',
      '相同的选项，三种导航形态。',
      '把空间留给正在做的事。',
      '桌面居中，手机从底部出现。',
      '键盘升起，让消息区让出空间。',
    ]
    for (let index = 0; index < titles.length; index += 1) {
      await wrapper.findAll('.nav-item')[index + 1].trigger('click')
      await flushPromises()
      expect(wrapper.find('h1').text()).toBe(titles[index])
      expect(wrapper.find('iframe').exists()).toBe(false)
    }
    wrapper.unmount()
  })

  it('独立聊天入口移除实验台布局，卸载后恢复页面原滚动设置', async () => {
    window.history.replaceState(null, '', '/?scene=keyboard&standalone=1')
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    const wrapper = mount(App)
    await flushPromises()
    expect(wrapper.find('.keyboard-fullscreen').exists()).toBe(true)
    expect(wrapper.find('.app-shell').exists()).toBe(false)
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe(bodyOverflow)
    expect(document.documentElement.style.overflow).toBe(rootOverflow)
    window.history.replaceState(null, '', '/')
  })
})
