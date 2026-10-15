import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createSidebarState } from './sidebar'

function setup(mobile = false, initialPreference = 'true') {
  const values = new Map([['test', initialPreference]])
  const isMobile = ref(mobile)
  const scope = effectScope()
  const state = scope.run(() =>
    createSidebarState(isMobile, {
      storage: {
        getItem: (key) => {
          const value = values.get(key)
          return value === undefined ? null : value
        },
        setItem: (key, value) => {
          values.set(key, value)
        },
      },
      storageKey: 'test',
    }),
  )
  if (state === undefined) throw new Error('无法建立测试作用域')
  return { state, isMobile, scope, values }
}

describe('跨断点时，桌面偏好与手机抽屉分别接管', () => {
  it('手机打开 → 桌面 → 手机：桌面收起偏好不被修改，手机打开状态保留', () => {
    const { state, isMobile, scope, values } = setup(true, 'false')
    state.toggle()
    expect(state.mobileOpen.value).toBe(true)
    isMobile.value = false
    expect(state.desktopOpen.value).toBe(false)
    expect(values.get('test')).toBe('false')
    isMobile.value = true
    expect(state.mobileOpen.value).toBe(true)
    scope.stop()
  })

  it('开启关闭策略后，进入桌面会关闭手机抽屉', () => {
    const { state, isMobile, scope } = setup(true)
    state.closeOnDesktop.value = true
    state.toggle()
    isMobile.value = false
    isMobile.value = true
    expect(state.mobileOpen.value).toBe(false)
    expect(state.desktopOpen.value).toBe(true)
    scope.stop()
  })

  it('桌面切换只持久化桌面状态；导航只关闭手机抽屉', async () => {
    const { state, isMobile, scope, values } = setup()
    state.toggle()
    expect(values.get('test')).toBe('false')
    isMobile.value = true
    state.toggle()
    state.closeMobileOnNavigate()
    await nextTick()
    expect(state.mobileOpen.value).toBe(false)
    expect(state.desktopOpen.value).toBe(false)
    expect(state.events.value.some((item) => item.message.includes('关闭'))).toBe(true)
    scope.stop()
  })
})
