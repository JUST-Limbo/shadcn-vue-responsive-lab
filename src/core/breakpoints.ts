/** 与 styles.css 中 Tailwind md=48rem、sm=40rem 保持一致。 */
export const MOBILE_QUERY = '(width < 48rem)'
export const CHAT_QUERY = '(width < 40rem)'
export const WORKSPACE_QUERY = '(width >= 80rem)'

export const scenes = [
  { id: 'lab', title: '屏幕实验台', hint: '拖动宽度，观察切换', icon: 'monitor' },
  { id: 'sidebar', title: '侧栏与状态', hint: '抽屉、占位、生命周期', icon: 'panel' },
  { id: 'chat', title: '聊天列表与详情', hint: '双栏切换为单屏', icon: 'chat' },
  { id: 'container', title: '容器查询', hint: '跟随主区，而非屏幕', icon: 'grid' },
  { id: 'table', title: '数据表格', hint: '滚动、吸附、批量操作', icon: 'table' },
  { id: 'settings', title: '设置导航', hint: '下拉、横排、纵排', icon: 'settings' },
  { id: 'workspace', title: '产物工作台', hint: '右侧栏切换为全屏', icon: 'files' },
  { id: 'overlay', title: '弹层与输入', hint: '底部面板、焦点与滚动', icon: 'layers' },
  { id: 'keyboard', title: '聊天与软键盘', hint: '可视高度、输入与滚动', icon: 'phone' },
] as const

export type SceneId = (typeof scenes)[number]['id']

export function readScene(value: string | null): SceneId {
  const matched = scenes.find((scene) => scene.id === value)
  return matched === undefined ? 'lab' : matched.id
}
