# Vue 3 屏幕适配实验室

独立的学习工程，用可操作案例解释 shadcn Sidebar 和 Shadcn Admin 的响应式思路。无需账号、后端或外部 API。

这是对核心机制的教学重写，不是把 React 工程直接转换为 Vue，也没有安装整套 shadcn 生成组件。基础弹层使用 Reka UI，样式使用 Tailwind CSS 4 和普通 CSS。

## 启动

本项目创建和验证环境：Windows PowerShell，本机 Node `22.22.0`，npm `10.9.4`。

```powershell
cd C:\code\shadcn-vue-responsive-lab
npm install
npm run dev
```

浏览器访问 `http://127.0.0.1:5178`。端口固定；占用时会报错，不会悄悄更换端口。

```powershell
npm test
npm run build
```

## 推荐学习顺序

1. 打开首页「屏幕实验台」，选择「侧栏与状态」。
2. 把预览宽度切为 `390px`，打开左上角菜单。
3. 保持抽屉打开，点击实验台的 `1024px`，再切回 `390px`。
4. 看状态日志：手机容器退出、桌面菜单挂载；手机与桌面的开关各自保存。
5. 在侧栏案例中启用「进入宽屏时关闭手机抽屉」，重复实验，对比结果。
6. 切到容器查询案例，保持窗口宽度不变，拖动组件宽度或展开左侧栏。
7. 依次观察聊天页、表格、设置页、产物面板和弹层的适配方式。
8. 打开「聊天与软键盘」，模拟键盘高度、翻阅历史和接收消息，再用手机直接打开独立聊天页验证。

实验台使用独立 iframe。宽度滑块修改 iframe 的实际视口宽度，**不会重新加载页面，也没有使用 transform 缩放伪装屏幕尺寸**。更换场景会导航 iframe，状态按新页面初始化；拖动宽度则保留当前状态。

大于实验台可用空间的预览可以横向滚动。想单独打开案例，可访问 `http://127.0.0.1:5178/?scene=sidebar`，用浏览器调整窗口宽度。

## 案例目录

| 案例           | 观察重点                                                        | 源码                                                                    |
| -------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 侧栏与状态     | 桌面 fixed + gap，手机 Dialog；两端状态独立；跨断点生命周期日志 | `src/core/sidebar.ts`、`src/components/ResponsiveSidebar.vue`           |
| 聊天列表与详情 | 640px 以下列表 / 详情单屏；宽屏双栏；返回不清空当前会话         | `src/scenarios/ChatScenario.vue`                                        |
| 容器查询       | 只改变容器，不改变窗口；卡片按 480 / 720px 切列                 | `src/scenarios/ContainerScenario.vue`                                   |
| 数据表格       | 局部横向滚动、关键列吸附、筛选换行、跨页选择和底部操作栏        | `src/scenarios/TableScenario.vue`                                       |
| 设置导航       | 手机下拉、中屏横排、宽屏纵排；表单始终只有一份                  | `src/scenarios/SettingsScenario.vue`                                    |
| 产物工作台     | 1280px 以下全屏产物，宽屏右侧预览；复用产物内容，保留聊天草稿   | `src/scenarios/WorkspaceScenario.vue`                                   |
| 弹层与输入     | 同一个 Dialog，小屏底部、大屏居中；焦点、遮罩、Escape、内部滚动 | `src/scenarios/OverlayScenario.vue`                                     |
| 聊天与软键盘   | 高度模拟、VisualViewport 实测、草稿保留、跟随底部与历史阅读     | `src/scenarios/KeyboardScenario.vue`、`src/components/KeyboardChat.vue` |

完整原理见 [实现导读](docs/实现导读.md)。

软键盘专题见 [聊天软键盘适配](docs/聊天软键盘适配.md)，包含方案比较、源码链路、降级边界、手机接入方式和待验证清单。

- 案例说明与高度模拟：`http://127.0.0.1:5178/?scene=keyboard`
- 独立聊天页：`http://127.0.0.1:5178/?scene=keyboard&standalone=1`

独立页使用当前窗口的可视高度与偏移，脱离实验台外壳。iframe 模拟不能替代顶层页面的系统键盘验证；手机不能使用电脑的 `127.0.0.1`，局域网启动方法见专题文档。

## 对照上游

- [shadcn-vue Sidebar 文档](https://www.shadcn-vue.com/docs/components/sidebar)
- [Shadcn Admin](https://github.com/satnaing/shadcn-admin)
- [React 版侧栏源码（固定参考版本）](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/components/ui/sidebar.tsx)
- [React 版聊天页源码（固定参考版本）](https://github.com/satnaing/shadcn-admin/blob/e16c87f213a5ba5e45964e9b67c792105ec74d26/src/features/chats/index.tsx)
- [社区 Vue 移植版](https://github.com/Whbbit1999/shadcn-vue-admin)
- [Reka Dialog 文档](https://reka-ui.com/docs/components/dialog)

本工程未逐行复制上游源码；保留设计思想并增加状态观测与实验案例。为明确边界，侧栏统一使用 `<48rem`（默认 768px）和 Tailwind `md` 对齐，不沿用社区 Vue 版的 `max-width: 768px` 边界差异。持久化使用 localStorage，而上游 React 示例使用 Cookie。

## 范围与限制

- 所有联系人、指标、成员、产物都是**明确标注的本地演示数据**；没有伪装成真实网络接口。
- 目前已加入桌面 / 手机状态转换和真实 Dialog Portal 切换的自动化测试；不把组件测试等同于手机实机验证。
- 页面保留浏览器缩放，手机输入框至少采用 16px；使用 `svh` / `dvh` 和安全区间距。独立软键盘案例使用 VisualViewport，不向其他场景注入全局高度补丁。
- 主案例切换保留在 URL 查询参数，使用 replaceState，不实现浏览器历史路由。
- 容器切换会销毁旧分支下的菜单实例；用户偏好、临时开关和日志放在父级，因此不会随菜单卸载而丢失。
- 跨断点不编排「抽屉逐渐变形成侧栏」的动画；同一桌面侧栏的展开 / 收起有 200ms CSS 过渡。
- 宽屏支持现代浏览器；旧版 WebView 兼容性没有验证。
