import { describe, expect, it } from 'vitest'
import { createMessageScrollPolicy } from './messageScroll'

describe('聊天滚动位置', () => {
  it('在底部时，键盘压缩 / 恢复高度、输入栏增高和新消息都继续跟随', () => {
    const box = { scrollTop: 600, clientHeight: 400, scrollHeight: 1000 }
    const policy = createMessageScrollPolicy(box)
    box.clientHeight = 200
    expect(policy.onScroll()).toBe(true)
    expect(box.scrollTop).toBe(800)
    box.clientHeight = 160
    policy.restore()
    expect(box.scrollTop).toBe(840)
    box.scrollHeight = 1100
    policy.restore()
    expect(box.scrollTop).toBe(940)
    box.clientHeight = 400
    policy.restore()
    expect(box.scrollTop).toBe(700)
  })

  it('阅读历史时，键盘变化和追加消息保持原位置；主动发送才回到底部', () => {
    const box = { scrollTop: 100, clientHeight: 400, scrollHeight: 1000 }
    const policy = createMessageScrollPolicy(box)
    expect(policy.onScroll()).toBe(false)
    box.clientHeight = 200
    expect(policy.onScroll()).toBe(false)
    expect(box.scrollTop).toBe(100)
    box.scrollHeight = 1200
    policy.restore()
    expect(box.scrollTop).toBe(100)
    expect(policy.toLatest()).toBe(true)
    expect(box.scrollTop).toBe(1000)
  })
})
