<template>
  <div class="equipment-detail-page page-container">
    <van-nav-bar
      title="装备详情"
      left-arrow
      @click-left="$router.back()"
      right-text="收藏"
      @click-right="toggleFavorite"
    />
    
    <div v-if="equipment" class="detail-content">
      <van-swipe class="image-swipe" :autoplay="3000" indicator-color="#2D5A27">
        <van-swipe-item>
          <van-image :src="equipment.image" fit="cover" class="detail-image" />
        </van-swipe-item>
        <van-swipe-item>
          <van-image :src="equipment.image" fit="cover" class="detail-image" />
        </van-swipe-item>
      </van-swipe>
      
      <div class="info-card card">
        <div class="equipment-name">{{ equipment.name }}</div>
        <div class="equipment-price">
          <span class="current-price">¥{{ equipment.price }}</span>
          <span class="original-price">¥{{ equipment.originalPrice }}</span>
        </div>
        <div class="equipment-tags">
          <van-tag v-for="tag in equipment.tags" :key="tag" type="primary" plain>
            {{ tag }}
          </van-tag>
        </div>
        <div class="equipment-meta">
          <div class="meta-item">
            <van-icon name="star" color="#FFD700" />
            <span class="meta-value">{{ equipment.rating }}</span>
            <span class="meta-label">评分</span>
          </div>
          <div class="meta-item">
            <span class="meta-value">{{ equipment.reviewCount }}</span>
            <span class="meta-label">评价</span>
          </div>
          <div class="meta-item">
            <span class="meta-value">{{ equipment.sales }}</span>
            <span class="meta-label">销量</span>
          </div>
        </div>
      </div>
      
      <div class="desc-card card">
        <div class="card-title">商品描述</div>
        <div class="desc-text">{{ equipment.description }}</div>
      </div>
      
      <div class="detail-card card">
        <div class="card-title">产品参数</div>
        <div class="detail-list">
          <div
            v-for="(value, key) in equipment.details"
            :key="key"
            class="detail-row flex-between"
          >
            <span class="detail-label">{{ key }}</span>
            <span class="detail-value">{{ value }}</span>
          </div>
        </div>
      </div>
      
      <div class="scenario-card card">
        <div class="card-title">适用场景</div>
        <div class="scenario-tags">
          <van-tag v-for="scenario in equipment.scenarios" :key="scenario" type="primary">
            {{ scenario }}
          </van-tag>
        </div>
      </div>
      
      <div class="recommend-card card">
        <div class="card-title">推荐理由</div>
        <div class="recommend-text">{{ equipment.recommendReason }}</div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="action-area">
        <div class="action-item" @click="toggleFavorite">
          <van-icon :name="isFavorite ? 'star' : 'star-o'" :color="isFavorite ? '#FFD700' : '#999999'" />
          <span>{{ isFavorite ? '已收藏' : '收藏' }}</span>
        </div>
        <div class="action-item">
          <van-icon name="shopping-cart-o" color="#999999" />
          <span>购物车</span>
        </div>
      </div>
      <van-button type="primary" block round>
        立即咨询
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const equipmentStore = useEquipmentStore()

const equipment = ref(null)
const isFavorite = ref(false)

onMounted(() => {
  const equipmentId = parseInt(route.params.id)
  const found = equipmentStore.equipmentList.find(eq => eq.id === equipmentId)
  if (found) {
    equipment.value = found
    isFavorite.value = equipmentStore.isFavorite(equipmentId)
  }
})

function toggleFavorite() {
  if (equipment.value) {
    equipmentStore.toggleFavorite(equipment.value.id)
    isFavorite.value = equipmentStore.isFavorite(equipment.value.id)
    showToast(isFavorite.value ? '已收藏' : '已取消收藏')
  }
}
</script>

<style lang="scss" scoped>
.equipment-detail-page {
  background: #FAF8F5;
  min-height: 100vh;
  padding-bottom: 70px;
}

.detail-content {
  padding-bottom: 80px;
}

.image-swipe {
  height: 300px;
}

.detail-image {
  width: 100%;
  height: 300px;
}

.info-card {
  margin: -20px 12px 0;
  position: relative;
}

.equipment-name {
  font-size: 17px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.equipment-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  
  .current-price {
    font-size: 22px;
    font-weight: 600;
    color: #E64340;
  }
  
  .original-price {
    font-size: 13px;
    color: #999999;
    text-decoration: line-through;
    margin-left: 8px;
  }
}

.equipment-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.equipment-meta {
  display: flex;
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.meta-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .van-icon {
    margin-right: 4px;
  }
  
  .meta-value {
    font-size: 14px;
    font-weight: 500;
    color: #1A1A1A;
  }
  
  .meta-label {
    font-size: 12px;
    color: #999999;
    margin-left: 4px;
  }
}

.desc-card,
.detail-card,
.scenario-card,
.recommend-card {
  margin: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 14px;
    background: linear-gradient(180deg, #2D5A27 0%, #4A7C43 100%);
    border-radius: 2px;
    margin-right: 8px;
    vertical-align: middle;
  }
}

.desc-text,
.recommend-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.6;
}

.detail-list {
  .detail-row {
    padding: 10px 0;
    
    & + & {
      border-top: 1px solid #F5F5F5;
    }
    
    .detail-label {
      font-size: 13px;
      color: #999999;
    }
    
    .detail-value {
      font-size: 13px;
      color: #1A1A1A;
    }
  }
}

.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--safe-area-bottom));
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.action-area {
  display: flex;
  gap: 24px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .van-icon {
    font-size: 20px;
    margin-bottom: 2px;
  }
  
  span {
    font-size: 11px;
    color: #666666;
  }
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  flex: 1;
  height: 44px;
  font-size: 15px;
}
</style>
