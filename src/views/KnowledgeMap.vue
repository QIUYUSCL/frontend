<template>
  <div class="knowledge-map-container">
    <el-card>
      <template #header>
        <div class="map-header">
          <h2>🗺️ 学科知识地图</h2>
          <p>探索课程关联，规划学习路径</p>
        </div>
      </template>

      <KnowledgeGraphVisualization />

      <div class="map-legend">
        <h4>图例说明</h4>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color" style="background-color: #409eff;"></div>
            <span>学科</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #67c23a;"></div>
            <span>课程</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #e6a23c;"></div>
            <span>教材</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #909399;"></div>
            <span>知识点</span>
          </div>
        </div>
      </div>

      <div class="map-features">
        <h4>功能特性</h4>
        <ul>
          <li>📌 点击教材节点可直接查看图书详情</li>
          <li>🔄 支持拖拽、缩放、平移操作</li>
          <li>🎨 不同颜色区分节点类型</li>
          <li>🔗 线条粗细表示关联强度</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import KnowledgeGraphVisualization from '../components/KnowledgeGraphVisualization.vue'
</script>

<style scoped>
.knowledge-map-container {
  max-width: 1200px;
  margin: 0 auto;
}

.map-header {
  text-align: center;
}

.map-header h2 {
  margin: 0 0 10px 0;
}

.map-header p {
  margin: 0;
  color: #909399;
}

.map-legend {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.map-legend h4 {
  margin-top: 0;
}

.legend-items {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.map-features {
  margin-top: 20px;
  padding: 20px;
  background-color: #f0f9ff;
  border-radius: 4px;
}

.map-features h4 {
  margin-top: 0;
}

.map-features ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.map-features li {
  margin-bottom: 8px;
  color: #606266;
}
</style>