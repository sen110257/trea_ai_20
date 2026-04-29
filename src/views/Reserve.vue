<template>
  <div class="reserve-page page-container">
    <van-nav-bar
      title="营地预约"
      :left-arrow="false"
    />
    
    <div class="reserve-content">
      <div class="camp-header-card card">
        <van-swipe class="camp-swipe" :autoplay="3000" indicator-color="#2D5A27">
          <van-swipe-item v-for="(image, index) in camp.images" :key="index">
            <van-image :src="image" fit="cover" class="camp-swipe-image" />
          </van-swipe-item>
        </van-swipe>
        <div class="camp-info-section">
          <div class="camp-name">{{ camp.name }}</div>
          <div class="camp-location">
            <van-icon name="location-o" />
            <span>{{ camp.location }}</span>
            <span class="distance">{{ camp.distance }}</span>
          </div>
          <div class="camp-tags">
            <van-tag v-for="tag in camp.tags" :key="tag" type="primary" plain size="small">
              {{ tag }}
            </van-tag>
          </div>
          <div class="camp-meta flex-between">
            <div class="meta-item">
              <span class="meta-value">{{ camp.rating }}</span>
              <span class="meta-label">评分</span>
            </div>
            <div class="meta-item">
              <span class="meta-value">{{ camp.reviewCount }}</span>
              <span class="meta-label">评价</span>
            </div>
            <div class="meta-item">
              <span class="meta-value">{{ camp.capacity }}</span>
              <span class="meta-label">容纳</span>
            </div>
            <div class="meta-item" @click="goToPanorama">
              <van-icon name="eye-o" />
              <span class="meta-label">3D全景</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="camp-detail-card card">
        <div class="detail-row">
          <div class="detail-label">营业时间</div>
          <div class="detail-value">{{ camp.openTime }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">营地介绍</div>
          <div class="detail-value">{{ camp.description }}</div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">选择营地分区</div>
        <div class="zone-grid">
          <div
            v-for="zone in zones"
            :key="zone.id"
            class="zone-card card"
            @click="goToZoneDetail(zone.id)"
          >
            <van-image :src="zone.image" fit="cover" class="zone-card-image" />
            <div class="zone-card-overlay">
              <div class="zone-card-name">{{ zone.name }}</div>
              <div class="zone-card-status" :class="zone.remainingSlots > 0 ? 'available' : 'full'">
                {{ zone.remainingSlots > 0 ? `剩余${zone.remainingSlots}位` : '已满' }}
              </div>
            </div>
            <div class="zone-card-info">
              <div class="zone-card-tags">
                <van-tag v-for="tag in zone.tags" :key="tag" type="primary" plain size="small">
                  {{ tag }}
                </van-tag>
              </div>
              <div class="zone-card-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ zone.price }}</span>
                <span class="price-unit">/天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore } from '@/stores'

const router = useRouter()
const campStore = useCampStore()

const camp = computed(() => campStore.camp)
const zones = computed(() => campStore.zoneList)

function goToPanorama() {
  router.push('/panorama/1')
}

function goToZoneDetail(zoneId) {
  router.push(`/reserve/zone/${zoneId}`)
}
</script>

<style lang="scss" scoped>
.reserve-page {
  padding-bottom: 50px;
  background: #FAF8F5;
}

.reserve-content {
  padding: 12px 16px;
  padding-bottom: 70px;
}

.camp-header-card {
  padding: 0;
  overflow: hidden;
}

.camp-swipe {
  height: 200px;
}

.camp-swipe-image {
  width: 100%;
  height: 200px;
}

.camp-info-section {
  padding: 14px;
}

.camp-name {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.camp-location {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999999;
  margin-bottom: 10px;
  
  .van-icon {
    margin-right: 4px;
    font-size: 12px;
  }
  
  .distance {
    margin-left: 8px;
    color: #2D5A27;
  }
}

.camp-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.camp-meta {
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .meta-value {
    font-size: 16px;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 2px;
  }
  
  .meta-label {
    font-size: 11px;
    color: #999999;
  }
  
  .van-icon {
    font-size: 18px;
    color: #2D5A27;
    margin-bottom: 2px;
  }
}

.camp-detail-card {
  margin-top: 12px;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  
  & + & {
    border-top: 1px solid #F5F5F5;
  }
}

.detail-label {
  width: 70px;
  font-size: 14px;
  color: #666666;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  font-size: 14px;
  color: #1A1A1A;
  line-height: 1.6;
}

.section {
  margin-top: 20px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
  padding: 0 4px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background: linear-gradient(180deg, #2D5A27 0%, #4A7C43 100%);
    border-radius: 2px;
    margin-right: 8px;
    vertical-align: middle;
  }
}

.zone-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.zone-card {
  padding: 0;
  overflow: hidden;
}

.zone-card-image {
  width: 100%;
  height: 140px;
}

.zone-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140px;
  background: linear-gradient(180deg, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 12px;
}

.zone-card-name {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.zone-card-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  
  &.available {
    background: rgba(45, 90, 39, 0.8);
    color: #FFFFFF;
  }
  
  &.full {
    background: rgba(153, 153, 153, 0.8);
    color: #FFFFFF;
  }
}

.zone-card-info {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zone-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.zone-card-price {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  
  .price-symbol {
    font-size: 12px;
    color: #E64340;
  }
  
  .price-value {
    font-size: 18px;
    font-weight: 600;
    color: #E64340;
  }
  
  .price-unit {
    font-size: 11px;
    color: #999999;
    margin-left: 2px;
  }
}
</style>
