import { computed, inject, provide, ref, watch } from 'vue'
import type { InjectionKey, Ref } from 'vue'

interface PreferenceStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

interface SidebarOptions {
  storage?: PreferenceStorage | null
  storageKey?: string
}

/**
 * 提取自 shadcn Sidebar 的状态分离思想，保留跨断点时的手机状态。
 * @example 手机打开 → 进入桌面：桌面仍使用自己的展开偏好。
 * @example 再回手机：默认恢复打开；开启 closeOnDesktop 后保持关闭。
 * @example 刷新：只恢复桌面偏好，手机抽屉始终从关闭开始。
 */
export function createSidebarState(isMobile: Ref<boolean>, options: SidebarOptions = {}) {
  const storage = options.storage === undefined ? null : options.storage
  const key = options.storageKey === undefined ? 'responsive-lab:sidebar' : options.storageKey
  let initialOpen = true
  try {
    if (storage !== null) initialOpen = storage.getItem(key) !== 'false'
  } catch {
    /* 禁用存储的浏览器仍能使用演示。 */
  }

  const desktopOpen = ref(initialOpen)
  const mobileOpen = ref(false)
  const closeOnDesktop = ref(false)
  const desktopMode = ref<'icon' | 'offcanvas'>('icon')
  const events = ref<{ id: number; time: string; message: string }[]>([])
  let eventId = 0

  function record(message: string) {
    eventId += 1
    events.value = [
      { id: eventId, time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), message },
      ...events.value,
    ].slice(0, 10)
  }

  watch(
    isMobile,
    (mobile) => {
      record(mobile ? '进入窄屏：选择 Sheet 分支' : '进入宽屏：选择桌面侧栏分支')
      if (!mobile && closeOnDesktop.value) mobileOpen.value = false
    },
    { flush: 'sync' },
  )

  watch(
    desktopOpen,
    (open) => {
      record(`桌面状态 → ${open ? '展开' : '收起'}（保存偏好）`)
      try {
        if (storage !== null) storage.setItem(key, String(open))
      } catch {
        /* 偏好写入失败不影响侧栏操作。 */
      }
    },
    { flush: 'sync' },
  )

  watch(mobileOpen, (open) => record(`手机状态 → ${open ? '打开' : '关闭'}（仅内存）`), {
    flush: 'sync',
  })

  function toggle() {
    if (isMobile.value) mobileOpen.value = !mobileOpen.value
    else desktopOpen.value = !desktopOpen.value
  }

  function closeMobileOnNavigate() {
    mobileOpen.value = false
  }

  const desktopState = computed(() => (desktopOpen.value ? 'expanded' : 'collapsed'))

  return {
    isMobile,
    desktopOpen,
    mobileOpen,
    closeOnDesktop,
    desktopMode,
    desktopState,
    events,
    record,
    toggle,
    closeMobileOnNavigate,
  }
}

export type SidebarState = ReturnType<typeof createSidebarState>
const sidebarKey: InjectionKey<SidebarState> = Symbol('responsive-sidebar')

export function provideSidebar(state: SidebarState) {
  provide(sidebarKey, state)
}

export function useSidebar() {
  const state = inject(sidebarKey)
  if (state === undefined) throw new Error('侧栏组件必须位于 provideSidebar 的子树中')
  return state
}
