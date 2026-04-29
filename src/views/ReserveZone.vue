<template>
  <div class="zone-detail-page page-container">
    <van-nav-bar
      title="分区详情"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div v-if="zone" class="zone-detail-content">
      <van-image :src="zone.image" fit="cover" class="zone-detail-image" />
      
      <div class="zone-info-card card">
        <div class="zone-detail-name">{{ zone.name }}</div>
        <div class="zone-detail-tags">
          <van-tag v-for="tag in zone.tags" :key="tag" type="primary" plain>
            {{ tag }}
          </van-tag>
        </div>
        <div class="zone-detail-desc">{{ zone.description }}</div>
        
        <div class="zone-meta-grid">
          <div class="meta-item">
            <div class="meta-icon">
              <van-icon name="friends-o" />
            </div>
            <div class="meta-text">
              <div class="meta-value">{{ zone.capacity }}人</div>
              <div class="meta-label">容纳人数</div>
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-icon">
              <van-icon name="shopping-cart-o" />
            </div>
            <div class="meta-text">
              <div class="meta-value">{{ zone.remainingSlots }}位</div>
              <div class="meta-label">剩余档期</div>
            </div>
          </div>
          <div class="meta-item">
            <div class="meta-icon">
              <van-icon name="price-tag-o" />
            </div>
            <div class="meta-text">
              <div class="meta-value">¥{{ zone.price }}</div>
              <div class="meta-label">单价/天</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="facilities-card card">
        <div class="card-title">配套设施</div>
        <div class="facilities-list">
          <div v-for="facility in zone.facilities" :key="facility" class="facility-item">
            <van-icon name="success" color="#2D5A27" />
            <span>{{ facility }}</span>
          </div>
        </div>
      </div>
      
      <div class="notice-card card">
        <div class="notice-title">
          <van-icon name="info-o" color="#D4A574" />
          <span>温馨提示</span>
        </div>
        <ul class="notice-list">
          <li>· 请提前1天预约，避免临时到场无空位</li>
          <li>· 请勿携带易燃易爆物品进入营地</li>
          <li>· 请爱护环境，离开时带走垃圾</li>
          <li>· 夜间请保持安静，避免影响他人休息</li>
        </ul>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="price-area">
        <span class="price-label">起步价</span>
        <span class="price-symbol">¥</span>
        <span class="price-value">{{ zone?.price || 0 }}</span>
        <span class="price-unit">/天</span>
      </div>
      <van-button type="primary" block round @click="goToSelectDate">
        立即预约
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const campStore = useCampStore()

const zone = computed(() => {
  const zoneId = parseInt(route.params.id)
  return campStore.zoneList.find(z => z.id === zoneId)
})

onMounted(() => {
  if (zone.value) {
    campStore.setCurrentZone(zone.value)
  }
})

function goToSelectDate() {
  if (zone.value) {
    router.push(`/reserve/date/${zone.value.id}`)
  }
}
</script>

<style lang="scss" scoped>
.zone-detail-page {
  padding-bottom: 70px;
  background: #FAF8F5;
}

.zone-detail-content {
  padding-bottom: 80px;
}

.zone-detail-image {
  width: 100%;
  height: 220px;
}

.zone-info-card {
  margin-top: -20px;
  position: relative;
  margin-left: 12px;
  margin-right: 12px;
}

.zone-detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 10px;
}

.zone-detail-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.zone-detail-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.zone-meta-grid {
  display: flex;
  padding-top: 14px;
  border-top: 1px solid #F0F0F0;
}

.meta-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .meta-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(45, 90, 39, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    
    .van-icon {
      color: #2D5A27;
      font-size: 18px;
    }
  }
  
  .meta-text {
    text-align: center;
  }
  
  .meta-value {
    font-size: 15px;
    font-weight: 600;
    color: #1A1A1A;
  }
  
  .meta-label {
    font-size: 11px;
    color: #999999;
    margin-top: 2px;
  }
}

.facilities-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.facilities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.facility-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
  
  .van-icon {
    margin-right: 6px;
  }
}

.notice-card {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  background: rgba(212, 165, 116, 0.08);
  border: 1px solid rgba(212, 165, 116, 0.3);
}

.notice-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #D4A574;
  margin-bottom: 10px;
  
  .van-icon {
    margin-right: 6px;
  }
}

.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    font-size: 12px;
    color: #666666;
    line-height: 1.8;
  }
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

.price-area {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.price-label {
  font-size: 12px;
  color: #999999;
  margin-right: 4px;
}

.price-symbol {
  font-size: 14px;
  color: #E64340;
}

.price-value {
  font-size: 24px;
  font-weight: 600;
  color: #E64340;
}

.price-unit {
  font-size: 12px;
  color: #999999;
  margin-left: 2px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  flex: 1;
  height: 44px;
  font-size: 16px;
}
</style>
