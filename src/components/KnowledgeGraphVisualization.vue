<template>
  <div class="kg-container">
    <div ref="graphContainer" class="graph-container"></div>
    <div class="kg-toolbar">
      <el-button-group>
        <el-button size="small" @click="resetGraph">重置视图</el-button>
        <el-button size="small" @click="exportGraph">导出图片</el-button>
      </el-button-group>
      <el-select
          v-model="selectedDiscipline"
          size="small"
          style="width: 150px; margin-left: 10px;"
          @change="loadGraph"
      >
        <el-option label="计算机科学与技术" value="计算机科学与技术" />
        <el-option label="软件工程" value="软件工程" />
        <el-option label="电子信息工程" value="电子信息工程" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { kgApi } from '../api/kg'

const graphContainer = ref()
const selectedDiscipline = ref('计算机科学与技术')
let chart = null

const loadGraph = async () => {
  try {
    const res = await kgApi.getKnowledgeGraphData(selectedDiscipline.value)
    const { nodes, links } = res.data

    const option = {
      title: {
        text: `${selectedDiscipline.value}知识图谱`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (params.dataType === 'node') {
            return `${params.data.name}<br/>类型: ${params.data.category}`
          }
          return `${params.data.source} → ${params.data.target}`
        }
      },
      legend: {
        data: ['学科', '课程', '教材', '知识点'],
        bottom: 10
      },
      series: [{
        type: 'graph',
        layout: 'force',
        data: nodes.map(node => ({
          id: node.id,
          name: node.name,
          category: node.category,
          symbolSize: getSymbolSize(node.category),
          itemStyle: { color: getNodeColor(node.category) },
          ...node
        })),
        links: links.map(link => ({
          source: link.source,
          target: link.target,
          value: link.type,
          label: { show: true, formatter: link.type }
        })),
        categories: [
          { name: '学科' },
          { name: '课程' },
          { name: '教材' },
          { name: '知识点' }
        ],
        roam: true,
        focusNodeAdjacency: true,
        force: {
          repulsion: 2000,
          gravity: 0.1,
          edgeLength: 150,
          layoutAnimation: true
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 3 }
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        }
      }]
    }

    chart.setOption(option)
  } catch (error) {
    console.error('加载图谱失败:', error)
  }
}

const getSymbolSize = (category) => {
  const sizes = { '学科': 50, '课程': 30, '教材': 25, '知识点': 20 }
  return sizes[category] || 20
}

const getNodeColor = (category) => {
  const colors = { '学科': '#409eff', '课程': '#67c23a', '教材': '#e6a23c', '知识点': '#909399' }
  return colors[category] || '#909399'
}

const resetGraph = () => {
  if (chart) {
    chart.dispatchAction({ type: 'restore' })
  }
}

const exportGraph = () => {
  if (chart) {
    const url = chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    const link = document.createElement('a')
    link.download = `${selectedDiscipline.value}_知识图谱.png`
    link.href = url
    link.click()
  }
}

onMounted(() => {
  chart = echarts.init(graphContainer.value)
  loadGraph()

  // 响应式调整
  const resizeHandler = () => chart.resize()
  window.addEventListener('resize', resizeHandler)

  // 点击事件
  chart.on('click', (params) => {
    if (params.dataType === 'node' && params.data.category === '教材') {
      // 跳转到图书详情
      const bookId = params.data.book_id || params.data.id
      if (bookId) {
        window.location.href = `/book/detail/${bookId}`
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    chart.dispose()
  })
})
</script>

<style scoped>
.kg-container {
  width: 100%;
  height: 600px;
  position: relative;
}

.graph-container {
  width: 100%;
  height: 100%;
}

.kg-toolbar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>