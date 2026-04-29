<template>
  <div class="equipment-page page-container">
    <van-nav-bar
      title="装备推荐"
      :left-arrow="false"
    />
    
    <div class="equipment-content">
      <div class="category-section">
        <div class="category-scroll">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            :class="{ active: currentCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            <van-icon :name="cat.icon" :color="currentCategory === cat.id ? '#2D5A27' : '#999999'" />
            <span>{{ cat.name }}</span>
          </div>
          <div
            class="category-item"
            :class="{ active: !currentCategory }"
            @click="selectCategory('')"
          >
            <van-icon name="apps-o" :color="!currentCategory ? '#2D5A27' : '#999999'" />
            <span>全部</span>
          </div>
        </div>
      </div>
      
      <van-tabs v-model:active="sortActive" color="#2D5A27" type="card" line-width="0">
        <van-tab title="综合排序">
          <div class="equipment-list">
            <div
              v-for="equipment in filteredEquipments"
              :key="equipment.id"
              class="equipment-card card"
              @click="goToDetail(equipment.id)"
            >
              <van-image :src="equipment.image" fit="cover" class="equipment-image" />
              <div class="equipment-info">
                <div class="equipment-name">{{ equipment.name }}</div>
                <div class="equipment-desc text-ellipsis-2">{{ equipment.description }}</div>
                <div class="equipment-tags">
                  <van-tag v-for="tag in equipment.tags.slice(0, 2)" :key="tag" type="primary" plain size="small">
                    {{ tag }}
                  </van-tag>
                </div>
                <div class="equipment-footer flex-between">
                  <div class="equipment-rating">
                    <van-icon name="star" color="#FFD700" size="12" />
                    <span class="rating-value">{{ equipment.rating }}</span>
                    <span class="review-count">({{ equipment.reviewCount }})</span>
                    <span class="sales">销量 {{ equipment.sales }}</span>
                  </div>
                </div>
                <div class="equipment-price">
                  <span class="current-price">¥{{ equipment.price }}</span>
                  <span class="original-price">¥{{ equipment.originalPrice }}</span>
                </div>
              </div>
              <div class="favorite-btn" @click.stop="toggleFavorite(equipment)">
                <van-icon :name="isFavorite(equipment.id) ? 'star' : 'star-o'" :color="isFavorite(equipment.id) ? '#FFD700' : '#CCCCCC'" />
              </div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="价格低到高">
          <div class="equipment-list">
            <div
              v-for="equipment in sortedByPriceLow"
              :key="equipment.id"
              class="equipment-card card"
              @click="goToDetail(equipment.id)"
            >
              <van-image :src="equipment.image" fit="cover" class="equipment-image" />
              <div class="equipment-info">
                <div class="equipment-name">{{ equipment.name }}</div>
                <div class="equipment-price">
                  <span class="current-price">¥{{ equipment.price }}</span>
                  <span class="original-price">¥{{ equipment.originalPrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        
        <van-tab title="销量优先">
          <div class="equipment-list">
            <div
              v-for="equipment in sortedBySales"
              :key="equipment.id"
              class="equipment-card card"
              @click="goToDetail(equipment.id)"
            >
              <van-image :src="equipment.image" fit="cover" class="equipment-image" />
              <div class="equipment-info">
                <div class="equipment-name">{{ equipment.name }}</div>
                <div class="equipment-price">
                  <span class="current-price">¥{{ equipment.price }}</span>
                  <span class="original-price">¥{{ equipment.originalPrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const equipmentStore = useEquipmentStore()

const sortActive = ref(0)
const currentCategory = ref('')

const categories = computed(() => equipmentStore.categories)
const equipments = computed(() => equipmentStore.equipmentList)

const filteredEquipments = computed(() => {
  if (!currentCategory.value) {
    return equipments.value
  }
  return equipments.value.filter(eq => eq.category === currentCategory.value)
})

const sortedByPriceLow = computed(() => {
  return [...filteredEquipments.value].sort((a, b) => a.price - b.price)
})

const sortedBySales = computed(() => {
  return [...filteredEquipments.value].sort((a, b) => b.sales - a.sales)
})

function selectCategory(categoryId) {
  currentCategory.value = categoryId
  equipmentStore.setCategory(categoryId)
}

function goToDetail(equipmentId) {
  router.push(`/equipment/detail/${equipmentId}`)
}

function toggleFavorite(equipment) {
  equipmentStore.toggleFavorite(equipment.id)
  showToast(equipmentStore.isFavorite(equipment.id) ? '已收藏' : '已取消收藏')
}

function isFavorite(equipmentId) {
  return equipmentStore.isFavorite(equipmentId)
}
</script>

<style lang="scss" scoped>
.equipment-page {
  padding-bottom: 50px;
  background: #FAF8F5;
  min-height: 100vh;
}

.equipment-content {
  padding-bottom: 70px;
}

.category-section {
  background: #FFFFFF;
  padding: 12px 0;
}

.category-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 0 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  flex-shrink: 0;
  
  .van-icon {
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  span {
    font-size: 12px;
    color: #666666;
  }
  
  &.active {
    span {
      color: #2D5A27;
      font-weight: 500;
    }
  }
}

:deep(.van-tabs__nav--card) {
  margin: 12px 16px;
  border-radius: 8px;
  border: none;
  background: #F5F5F5;
}

:deep(.van-tab--card) {
  border: none;
  color: #666666;
}

:deep(.van-tab--card.van-tab--active) {
  background: #FFFFFF;
  color: #2D5A27;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.equipment-list {
  padding: 0 16px;
}

.equipment-card {
  display: flex;
  position: relative;
  margin-bottom: 12px;
}

.equipment-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  margin-right: 12px;
  flex-shrink: 0;
}

.equipment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.equipment-name {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.equipment-desc {
  font-size: 12px;
  color: #999999;
  line-height: 1.4;
  margin-bottom: 8px;
}

.equipment-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.equipment-footer {
  margin-bottom: auto;
}

.equipment-rating {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  
  .rating-value {
    color: #FFD700;
    font-weight: 500;
    margin-left: 2px;
  }
  
  .review-count,
  .sales {
    margin-left: 8px;
  }
}

.equipment-price {
  display: flex;
  align-items: baseline;
  margin-top: 8px;
  
  .current-price {
    font-size: 18px;
    font-weight: 600;
    color: #E64340;
  }
  
  .original-price {
    font-size: 12px;
    color: #999999;
    text-decoration: line-through;
    margin-left: 6px;
  }
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  
  .van-icon {
    font-size: 16px;
  }
}
</style>
