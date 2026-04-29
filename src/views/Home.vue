<template>
  <div class="home-page page-container">
    <div class="home-header">
      <div class="header-content">
        <div class="greeting">
          <div class="greeting-text">
            <span class="greeting-title">山野营地</span>
            <span class="greeting-subtitle">在自然中寻找宁静</span>
          </div>
          <div class="user-avatar" @click="goToUser">
            <van-image :src="user.avatar" round />
          </div>
        </div>
        <van-search
          v-model="searchValue"
          placeholder="搜索营地、活动..."
          shape="round"
          @search="onSearch"
          class="home-search"
        />
      </div>
    </div>
    
    <div class="home-content">
      <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="#2D5A27">
        <van-swipe-item v-for="(image, index) in banners" :key="index">
          <van-image :src="image" fit="cover" class="banner-image" @click="goToPanorama" />
        </van-swipe-item>
      </van-swipe>
      
      <div class="quick-entry card">
        <van-grid :column-num="4" border="false">
          <van-grid-item icon="location-o" text="营地预约" @click="$router.push('/reserve')" />
          <van-grid-item icon="photo-o" text="3D全景" @click="goToPanorama" />
          <van-grid-item icon="chat-o" text="结伴圈子" @click="$router.push('/circle')" />
          <van-grid-item icon="shopping-cart-o" text="装备推荐" @click="$router.push('/equipment')" />
        </van-grid>
      </div>
      
      <div class="section">
        <div class="section-header flex-between">
          <div class="section-title">推荐营地</div>
          <van-icon name="arrow" @click="$router.push('/reserve')" />
        </div>
        <div class="camp-card">
          <van-image :src="camp.images[0]" fit="cover" class="camp-image" @click="$router.push('/reserve')" />
          <div class="camp-info">
            <div class="camp-name">{{ camp.name }}</div>
            <div class="camp-location">
              <van-icon name="location-o" />
              <span>{{ camp.location }}</span>
            </div>
            <div class="camp-tags">
              <van-tag v-for="tag in camp.tags" :key="tag" type="primary" plain size="small">
                {{ tag }}
              </van-tag>
            </div>
            <div class="camp-footer flex-between">
              <div class="camp-rating">
                <van-icon name="star" color="#FFD700" />
                <span>{{ camp.rating }}</span>
                <span class="review-count">({{ camp.reviewCount }}条评价)</span>
              </div>
              <div class="camp-price">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ getMinPrice }}</span>
                <span class="price-unit">起/天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header flex-between">
          <div class="section-title">营地分区</div>
          <van-icon name="arrow" @click="$router.push('/reserve')" />
        </div>
        <div class="zone-list">
          <div
            v-for="zone in zones"
            :key="zone.id"
            class="zone-item card"
            @click="goToZone(zone.id)"
          >
            <van-image :src="zone.image" fit="cover" class="zone-image" />
            <div class="zone-overlay">
              <div class="zone-name">{{ zone.name }}</div>
              <div class="zone-price">
                <span class="price">¥{{ zone.price }}</span>
                <span class="unit">/天</span>
              </div>
            </div>
            <div class="zone-tags">
              <van-tag v-for="tag in zone.tags.slice(0, 2)" :key="tag" type="primary" plain size="small">
                {{ tag }}
              </van-tag>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header flex-between">
          <div class="section-title">热门动态</div>
          <van-icon name="arrow" @click="$router.push('/circle')" />
        </div>
        <div class="post-list">
          <div
            v-for="post in posts.slice(0, 3)"
            :key="post.id"
            class="post-item card"
            @click="goToPostDetail(post.id)"
          >
            <div class="post-header">
              <van-image :src="post.author.avatar" round class="post-avatar" />
              <div class="post-author">
                <div class="author-name">{{ post.author.name }}</div>
                <div class="post-time">{{ post.createTime }}</div>
              </div>
            </div>
            <div class="post-content">
              <div class="post-title">{{ post.title }}</div>
              <div class="post-text text-ellipsis-2">{{ post.content }}</div>
            </div>
            <div v-if="post.images && post.images.length > 0" class="post-images">
              <van-image
                v-for="(img, index) in post.images.slice(0, 3)"
                :key="index"
                :src="img"
                fit="cover"
                class="post-image"
              />
            </div>
            <div class="post-footer flex-between">
              <div class="post-location">
                <van-icon name="location-o" />
                <span>{{ post.location }}</span>
              </div>
              <div class="post-stats">
                <span class="stat-item">
                  <van-icon name="like-o" />
                  {{ post.likes }}
                </span>
                <span class="stat-item">
                  <van-icon name="comment-o" />
                  {{ post.comments }}
                </span>
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
import { useCampStore, useCircleStore, useUserStore } from '@/stores'

const router = useRouter()
const campStore = useCampStore()
const circleStore = useCircleStore()
const userStore = useUserStore()

const searchValue = ''
const camp = computed(() => campStore.camp)
const zones = computed(() => campStore.zoneList)
const posts = computed(() => circleStore.postList)
const user = computed(() => userStore.user)

const banners = computed(() => [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=panoramic%20mountain%20campsite%20sunset%20view%20with%20tents%20and%20lake%20beautiful%20nature&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20glamping%20tents%20in%20forest%20with%20cozy%20lighting%20evening%20atmosphere&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=family%20camping%20by%20lake%20with%20campfire%20happy%20people%20nature%20landscape&image_size=landscape_16_9'
])

const getMinPrice = computed(() => {
  if (zones.value.length === 0) return 0
  return Math.min(...zones.value.map(z => z.price))
})

function goToUser() {
  router.push('/user')
}

function goToPanorama() {
  router.push('/panorama/1')
}

function goToZone(zoneId) {
  router.push(`/reserve/zone/${zoneId}`)
}

function goToPostDetail(postId) {
  router.push(`/circle/post/detail/${postId}`)
}

function onSearch(value) {
  console.log('搜索:', value)
}
</script>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 50px;
}

.home-header {
  background: linear-gradient(180deg, #2D5A27 0%, #4A7C43 100%);
  padding: 16px;
  padding-top: calc(16px + var(--safe-area-top));
}

.header-content {
  position: relative;
}

.greeting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.greeting-text {
  display: flex;
  flex-direction: column;
}

.greeting-title {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
}

.greeting-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.user-avatar {
  width: 36px;
  height: 36px;
}

.home-search {
  background: transparent;
  padding: 0;
  
  :deep(.van-search__content) {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
  }
}

.home-content {
  padding: 12px 16px;
  padding-bottom: 70px;
}

.banner-swipe {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.banner-image {
  width: 100%;
  height: 180px;
  border-radius: 16px;
}

.quick-entry {
  margin-bottom: 16px;
  
  :deep(.van-grid-item__icon) {
    color: #2D5A27;
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  :deep(.van-grid-item__text) {
    font-size: 13px;
    color: #1A1A1A;
  }
}

.section {
  margin-bottom: 20px;
}

.section-header {
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1A1A1A;
}

.camp-card {
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.camp-image {
  width: 100%;
  height: 160px;
}

.camp-info {
  padding: 14px;
}

.camp-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.camp-location {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
  margin-bottom: 10px;
  
  .van-icon {
    margin-right: 4px;
    font-size: 12px;
  }
}

.camp-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.camp-footer {
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.camp-rating {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666666;
  
  .van-icon {
    margin-right: 4px;
  }
  
  .review-count {
    margin-left: 4px;
    color: #999999;
  }
}

.camp-price {
  display: flex;
  align-items: baseline;
  
  .price-symbol {
    font-size: 12px;
    color: #E64340;
  }
  
  .price-value {
    font-size: 20px;
    font-weight: 600;
    color: #E64340;
  }
  
  .price-unit {
    font-size: 12px;
    color: #999999;
    margin-left: 2px;
  }
}

.zone-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.zone-item {
  width: 160px;
  flex-shrink: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.zone-image {
  width: 100%;
  height: 100px;
}

.zone-overlay {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zone-name {
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
}

.zone-price {
  display: flex;
  align-items: baseline;
  
  .price {
    font-size: 16px;
    font-weight: 600;
    color: #D4A574;
  }
  
  .unit {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.zone-tags {
  padding: 8px 10px;
  display: flex;
  gap: 4px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-item {
  margin-bottom: 0;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.post-avatar {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.post-author {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.post-time {
  font-size: 11px;
  color: #999999;
  margin-top: 2px;
}

.post-content {
  margin-bottom: 10px;
}

.post-title {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.post-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}

.post-images {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.post-image {
  width: calc(33.33% - 4px);
  height: 80px;
  border-radius: 8px;
}

.post-footer {
  padding-top: 10px;
  border-top: 1px solid #F0F0F0;
}

.post-location {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
    font-size: 11px;
  }
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
  }
}
</style>
