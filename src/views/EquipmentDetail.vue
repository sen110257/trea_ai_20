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
        <div class="action-item" @click="addToCart">
          <van-icon name="shopping-cart-o" :color="cartCount > 0 ? '#2D5A27' : '#999999'" />
          <span>购物车</span>
          <van-badge v-if="cartCount > 0" :content="cartCount" class="cart-badge" />
        </div>
      </div>
      <van-button type="primary" block round @click="showConsultPopup = true">
        立即咨询
      </van-button>
    </div>
    
    <van-popup
      v-model:show="showConsultPopup"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="consult-popup">
        <div class="popup-header flex-between">
          <div class="popup-title">咨询客服</div>
          <van-icon name="cross" size="20" @click="showConsultPopup = false" />
        </div>
        
        <div class="consult-content">
          <div class="consult-info">
            <div class="info-label">商品</div>
            <div class="info-value">{{ equipment?.name }}</div>
          </div>
          
          <div class="consult-info">
            <div class="info-label">价格</div>
            <div class="info-value price">¥{{ equipment?.price }}</div>
          </div>
          
          <van-field
            v-model="consultMessage"
            type="textarea"
            placeholder="请输入您想咨询的问题..."
            :maxlength="200"
            show-word-limit
            autosize
            rows="4"
          />
        </div>
        
        <div class="popup-footer">
          <van-button type="primary" block round @click="sendConsult">
            发送
          </van-button>
        </div>
      </div>
    </van-popup>
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
const showConsultPopup = ref(false)
const consultMessage = ref('')

const cartCount = computed(() => equipmentStore.cartCount)

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

function addToCart() {
  if (equipment.value) {
    equipmentStore.addToCart(equipment.value, 1)
    showToast('已加入购物车')
  }
}

function sendConsult() {
  if (!consultMessage.value.trim()) {
    showToast('请输入咨询内容')
    return
  }
  showToast('消息已发送，客服会尽快回复您')
  consultMessage.value = ''
  showConsultPopup.value = false
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

.action-item {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

.consult-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.consult-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.consult-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  .info-label {
    font-size: 14px;
    color: #999999;
    width: 60px;
  }
  
  .info-value {
    font-size: 14px;
    color: #1A1A1A;
    
    &.price {
      color: #E64340;
      font-weight: 600;
      font-size: 16px;
    }
  }
}

.popup-footer {
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--safe-area-bottom));
  border-top: 1px solid #F0F0F0;
}
</style>
