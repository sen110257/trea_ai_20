<template>
  <div class="panorama-page">
    <van-nav-bar
      title="3D全景预览"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="panorama-content">
      <div class="panorama-container">
        <div class="panorama-viewer" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
          <van-swipe
          ref="swipeRef"
          class="panorama-swipe"
          :show-indicators="false"
          :autoplay="0"
        >
          <van-swipe-item v-for="(image, index) in panoramaImages" :key="index">
            <van-image :src="image" fit="cover" class="panorama-image" />
          </van-swipe-item>
        </van-swipe>
        
        <div class="view-info">
          <div class="info-title">{{ camp.name }}</div>
          <div class="info-location">
            <van-icon name="location-o" />
            <span>{{ camp.location }}</span>
          </div>
        </div>
        
        <div class="view-hint">
          <van-icon name="arrow-left" />
          <span>左右滑动查看更多视角</span>
          <van-icon name="arrow" />
        </div>
        
        <div class="indicator-dots">
          <span
            v-for="(image, index) in panoramaImages"
            :key="index"
            class="dot"
            :class="{ active: currentIndex === index }"
          ></span>
        </div>
        </div>
      </div>
      
      <div class="panorama-info card">
        <div class="info-section">
          <div class="section-title">营地信息</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">
                <van-icon name="star" color="#FFD700" />
              </div>
              <div class="info-text">
                <div class="info-value">{{ camp.rating }}</div>
                <div class="info-label">评分</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <van-icon name="friends-o" color="#2D5A27" />
              </div>
              <div class="info-text">
                <div class="info-value">{{ camp.capacity }}人</div>
                <div class="info-label">容纳人数</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <van-icon name="clock-o" color="#D4A574" />
              </div>
              <div class="info-text">
                <div class="info-value">{{ camp.openTime }}</div>
                <div class="info-label">营业时间</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="section-title">营地分区</div>
          <div class="zone-tags">
            <van-tag
              v-for="zone in zones"
              :key="zone.id"
              type="primary"
              plain
              size="large"
              @click="goToZone(zone.id)"
            >
              {{ zone.name }}
            </van-tag>
          </div>
        </div>
        
        <div class="info-section">
          <div class="section-title">营地特色</div>
          <div class="features-list">
            <div v-for="tag in camp.tags" :key="tag" class="feature-item">
              <van-icon name="success" color="#2D5A27" />
              <span>{{ tag }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="section-title">营地介绍</div>
          <div class="camp-description">
            {{ camp.description }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <van-button type="primary" block round @click="goToReserve">
        立即预约
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore } from '@/stores'

const router = useRouter()
const campStore = useCampStore()

const camp = computed(() => campStore.camp)
const zones = computed(() => campStore.zoneList)

const panoramaImages = computed(() => camp.value.panoramaImages)
const currentIndex = ref(0)

const touchStartX = ref(0)
const touchStartY = ref(0)
const touchStartTime = ref(0)

function onTouchStart(event) {
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  touchStartTime.value = Date.now()
}

function onTouchMove(event) {
  const touchX = event.touches[0].clientX
  const touchY = event.touches[0].clientY
  const deltaX = touchX - touchStartX.value
  const deltaY = touchY - touchStartY.value
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    event.preventDefault()
  }
}

function onTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX
  const deltaX = touchEndX - touchStartX.value
  const deltaTime = Date.now() - touchStartTime.value
  
  if (Math.abs(deltaX) > 50 && deltaTime < 500) {
    if (deltaX > 0) {
      currentIndex.value = Math.max(0, currentIndex.value - 1)
    } else {
      currentIndex.value = Math.min(panoramaImages.value.length - 1, currentIndex.value + 1)
    }
  }
}

function goToZone(zoneId) {
  router.push(`/reserve/zone/${zoneId}`)
}

function goToReserve() {
  router.push('/reserve')
}
</script>

<style lang="scss" scoped>
.panorama-page {
  min-height: 100vh;
  background: #FAF8F5;
  padding-bottom: 70px;
}

.panorama-content {
  padding-bottom: 80px;
}

.panorama-container {
  position: relative;
  height: 300px;
  background: #000;
}

.panorama-viewer {
  width: 100%;
  height: 100%;
  touch-action: pan-y;
}

.panorama-swipe {
  height: 100%;
}

.panorama-image {
  width: 100%;
  height: 100%;
}

.view-info {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.info-location {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  
  .van-icon {
    margin-right: 4px;
    font-size: 12px;
  }
}

.view-hint {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  
  .van-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
  
  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.indicator-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.3s;
  
  &.active {
    width: 24px;
    border-radius: 4px;
    background: #2D5A27;
  }
}

.panorama-info {
  margin: -20px 12px 0;
  position: relative;
}

.info-section {
  padding: 12px 0;
  
  & + & {
    border-top: 1px solid #F5F5F5;
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.info-grid {
  display: flex;
  gap: 16px;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(45, 90, 39, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  .van-icon {
    font-size: 20px;
  }
}

.info-text {
  .info-value {
    font-size: 14px;
    font-weight: 500;
    color: #1A1A1A;
  }
  
  .info-label {
    font-size: 11px;
    color: #999999;
    margin-top: 2px;
  }
}

.zone-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.van-tag--plain) {
  border-color: rgba(45, 90, 39, 0.3);
  color: #2D5A27;
  background: rgba(45, 90, 39, 0.05);
  padding: 8px 14px;
  border-radius: 16px;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
  
  .van-icon {
    margin-right: 6px;
    font-size: 14px;
  }
}

.camp-description {
  font-size: 13px;
  color: #666666;
  line-height: 1.6;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--safe-area-bottom));
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  height: 44px;
  font-size: 15px;
}
</style>
