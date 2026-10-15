import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import KeyboardChat from './KeyboardChat.vue'

describe('高度变化保留聊天状态', () => {
  it('键盘开合保留草稿，发送后追加消息并清空草稿', async () => {
    const wrapper = mount(KeyboardChat, { props: { viewportHeight: 700 } })
    await wrapper.find('textarea').setValue('尚未发送的多行草稿\n第二行')
    await wrapper.setProps({ viewportHeight: 420 })
    await wrapper.setProps({ viewportHeight: 700 })
    expect(wrapper.find('textarea').element.value).toBe('尚未发送的多行草稿\n第二行')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(wrapper.findAll('.keyboard-bubble')).toHaveLength(17)
    expect(wrapper.findAll('.keyboard-bubble')[16].text()).toContain('第二行')
    expect(wrapper.find('textarea').element.value).toBe('')
    wrapper.unmount()
  })
})
