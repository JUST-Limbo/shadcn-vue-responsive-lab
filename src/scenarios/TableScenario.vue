<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ScenarioIntro from '../components/ScenarioIntro.vue'
import AppIcon from '../components/AppIcon.vue'

// 明确标注：下面全部为本地案例数据，提交为示例工程的一部分。
const rows = Array.from({ length: 18 }, (_, index) => ({
  id: index + 1,
  name: ['陈一', '林小雨', '周言', '王可', '许知', '苏禾'][index % 6],
  email: `member${index + 1}@example.com`,
  department: ['产品设计', '前端研发', '数据分析'][index % 3],
  status: index % 4 === 0 ? '待邀请' : '正常',
  role: index % 5 === 0 ? '管理员' : '成员',
  joined: `2026-10-${String(index + 1).padStart(2, '0')}`,
}))
const search = ref('')
const status = ref('全部状态')
const selected = ref<number[]>([])
const page = ref(1)
const toast = ref('')
const showEmail = ref(true)
const filtered = computed(() =>
  rows.filter(
    (row) =>
      `${row.name}${row.email}`.includes(search.value) &&
      (status.value === '全部状态' || row.status === status.value),
  ),
)
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / 6)))
const visible = computed(() => filtered.value.slice((page.value - 1) * 6, page.value * 6))
const allChecked = computed(
  () => visible.value.length > 0 && visible.value.every((row) => selected.value.includes(row.id)),
)
watch([search, status], () => {
  page.value = 1
})

function toggleRow(id: number) {
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

function togglePage() {
  const ids = visible.value.map((row) => row.id)
  selected.value = allChecked.value
    ? selected.value.filter((id) => !ids.includes(id))
    : [...new Set([...selected.value, ...ids])]
}
</script>

<template>
  <ScenarioIntro
    eyebrow="04 / DATA TABLE"
    title="让数据可读，而不是把表格缩小。"
    description="窄屏保留表格，局部横向滚动，关键列吸附。筛选控件换行，批量操作固定在底部。"
  />
  <div class="table-toolbar">
    <label class="search-box"
      ><AppIcon name="search" :size="16" /><input
        v-model="search"
        placeholder="搜索姓名或邮箱"
        aria-label="搜索成员" /></label
    ><select v-model="status" aria-label="成员状态">
      <option>全部状态</option>
      <option>正常</option>
      <option>待邀请</option></select
    ><label class="column-toggle"><input v-model="showEmail" type="checkbox" />显示邮箱</label
    ><span class="badge ml-auto">本地演示数据</span>
  </div>
  <div class="table-scroll" tabindex="0" aria-label="成员列表，可横向滚动">
    <table>
      <thead>
        <tr>
          <th class="sticky-check">
            <input
              type="checkbox"
              aria-label="选择当前页"
              :checked="allChecked"
              @change="togglePage"
            />
          </th>
          <th class="sticky-name">成员</th>
          <th v-if="showEmail">邮箱</th>
          <th>部门</th>
          <th>状态</th>
          <th>角色</th>
          <th>加入日期</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in visible"
          :key="row.id"
          :class="{ 'row-selected': selected.includes(row.id) }"
        >
          <td class="sticky-check">
            <input
              type="checkbox"
              :aria-label="`选择${row.name} ${row.id}`"
              :checked="selected.includes(row.id)"
              @change="toggleRow(row.id)"
            />
          </td>
          <td class="sticky-name">
            <span class="table-person"
              ><span class="mini-avatar">{{ row.name.slice(0, 1) }}</span
              >{{ row.name }}<small>#{{ row.id }}</small></span
            >
          </td>
          <td v-if="showEmail" class="muted">{{ row.email }}</td>
          <td>{{ row.department }}</td>
          <td>
            <span class="status-badge" :class="{ pending: row.status === '待邀请' }">{{
              row.status
            }}</span>
          </td>
          <td>{{ row.role }}</td>
          <td class="muted">{{ row.joined }}</td>
        </tr>
        <tr v-if="visible.length === 0">
          <td :colspan="showEmail ? 7 : 6" class="empty-note">没有匹配成员</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="table-pagination">
    <span>{{ filtered.length }} 条记录 · 已选 {{ selected.length }} 条</span>
    <div>
      <button class="button" :disabled="page <= 1" @click="page -= 1">上一页</button
      ><span>{{ page }} / {{ pageCount }}</span
      ><button class="button" :disabled="page >= pageCount" @click="page += 1">下一页</button>
    </div>
  </div>
  <div v-if="selected.length > 0" class="bulk-toolbar" role="toolbar" aria-label="批量操作">
    <span>已选 {{ selected.length }} 条</span
    ><button class="button" @click="toast = `已模拟导出 ${selected.length} 条记录`">模拟导出</button
    ><button class="icon-button" aria-label="清空选择" @click="selected = []">
      <AppIcon name="close" />
    </button>
  </div>
  <p class="feedback" role="status">{{ toast }}</p>
  <p class="source-note">
    阅读路径：scenarios/TableScenario.vue · 表格容器 overflow-x: auto，前两列 position:
    sticky，批量栏使用 fixed 和安全区间距。
  </p>
</template>
