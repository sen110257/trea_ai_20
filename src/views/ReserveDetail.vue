<template>
  <div class="reserve-detail-page page-container">
    <van-nav-bar
      title="预约详情"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div v-if="order" class="detail-content">
      <div class="status-card card">
        <div class="status-info flex-between">
          <div class="status-left">
            <div class="status-text">{{ getStatusText(order.status) }}</div>
            <div class="status-desc">{{ getStatusDesc(order.status) }}</div>
          </div>
          <van-icon :name="getStatusIcon(order.status)" :color="getStatusColor(order.status)" size="48" />
        </div>
      </div>
      
      <div class="info-card card">
        <div class="card-title">预约信息</div>
        
        <div class="info-row">
          <span class="info-label">订单号</span>
          <span class="info-value">{{ order.id }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">营地分区</span>
          <span class="info-value">{{ order.zoneName }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">套餐类型</span>
          <span class="info-value">{{ order.packageName }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">预约日期</span>
          <span class="info-value">{{ order.date }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">入住时段</span>
          <span class="info-value">{{ order.startTime }} - {{ order.endTime }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">入住人数</span>
          <span class="info-value">{{ order.peopleCount }}人</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">联系人</span>
          <span class="info-value">{{ order.contactName }}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">联系电话</span>
          <span class="info-value">{{ order.contactPhone }}</span>
        </div>
        
        <div v-if="order.addOns && order.addOns.length > 0" class="addons-section">
          <div class="addons-title">加购项目</div>
          <div
            v-for="addon in order.addOns"
            :key="addon.id"
            class="addon-row flex-between"
          >
            <span>{{ addon.name }} × {{ addon.count }}</span>
            <span class="addon-price">¥{{ addon.price }}</span>
          </div>
        </div>
      </div>
      
      <div class="price-card card">
        <div class="card-title">费用明细</div>
        
        <div class="price-row flex-between">
          <span class="price-label">套餐费用</span>
          <span class="price-value">¥{{ order.totalPrice }}</span>
        </div>
        
        <div v-if="order.addOns && order.addOns.length > 0" class="price-row flex-between">
          <span class="price-label">加购费用</span>
          <span class="price-value">¥{{ addOnsTotal }}</span>
        </div>
        
        <div class="discount-row flex-between">
          <span class="price-label">优惠金额</span>
          <span class="discount-value">-¥0</span>
        </div>
        
        <div class="total-row flex-between">
          <span class="total-label">订单金额</span>
          <span class="total-price">
            <span class="symbol">¥</span>
            <span class="value">{{ order.totalPrice + addOnsTotal }}</span>
          </span>
        </div>
      </div>
      
      <div class="create-time card">
        <div class="info-row flex-between">
          <span class="info-label">创建时间</span>
          <span class="info-value">{{ order.createTime }}</span>
        </div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <van-button
        v-if="order?.status === 'pending'"
        type="primary"
        round
        block
        @click="payOrder"
      >
        去支付
      </van-button>
      <van-button
        v-if="order?.status === 'confirmed'"
        type="warning"
        round
        block
        @click="cancelOrder"
      >
        取消预约
      </van-button>
      <van-button
        v-if="order?.status === 'completed'"
        type="primary"
        round
        plain
        block
        @click="goToReserve"
      >
        再次预约
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const order = ref(null)

const addOnsTotal = computed(() => {
  if (!order.value || !order.value.addOns) return 0
  return order.value.addOns.reduce((total, item) => total + item.price, 0)
})

onMounted(() => {
  const orderId = route.params.id
  const found = userStore.orderList.find(o => o.id === orderId)
  if (found) {
    order.value = found
  }
})

function getStatusText(status) {
  const textMap = {
    pending: '待支付',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || '未知'
}

function getStatusDesc(status) {
  const descMap = {
    pending: '请尽快完成支付',
    confirmed: '营地已确认您的预约',
    completed: '感谢您的光临',
    cancelled: '您的预约已取消'
  }
  return descMap[status] || ''
}

function getStatusIcon(status) {
  const iconMap = {
    pending: 'clock-o',
    confirmed: 'checked',
    completed: 'success',
    cancelled: 'close'
  }
  return iconMap[status] || 'info-o'
}

function getStatusColor(status) {
  const colorMap = {
    pending: '#D4A574',
    confirmed: '#2D5A27',
    completed: '#2D5A27',
    cancelled: '#999999'
  }
  return colorMap[status] || '#999999'
}

function payOrder() {
  if (order.value) {
    order.value.status = 'confirmed'
    showToast('支付成功')
  }
}

async function cancelOrder() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消该预约吗？'
    })
    if (order.value) {
      order.value.status = 'cancelled'
    }
    showToast('已取消预约')
  } catch {
    // 用户取消
  }
}

function goToReserve() {
  router.push('/reserve')
}
</script>

<style lang="scss" scoped>
.reserve-detail-page {
  background: #FAF8F5;
  min-height: 100vh;
  padding-bottom: 70px;
}

.detail-content {
  padding: 12px;
  padding-bottom: 80px;
}

.status-card {
  margin-bottom: 12px;
}

.status-info {
  padding: 4px 0;
}

.status-left {
  flex: 1;
}

.status-text {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 12px;
  color: #999999;
}

.info-card,
.price-card,
.create-time {
  margin-bottom: 12px;
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

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  
  & + & {
    border-top: 1px solid #F5F5F5;
  }
  
  .info-label {
    font-size: 13px;
    color: #999999;
  }
  
  .info-value {
    font-size: 13px;
    color: #1A1A1A;
  }
}

.addons-section {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.addons-title {
  font-size: 13px;
  color: #999999;
  margin-bottom: 8px;
}

.addon-row {
  padding: 6px 0;
  
  .addon-price {
    color: #E64340;
    font-weight: 500;
  }
}

.price-row {
  padding: 8px 0;
  
  .price-label {
    font-size: 13px;
    color: #666666;
  }
  
  .price-value {
    font-size: 13px;
    color: #1A1A1A;
  }
}

.discount-row {
  padding: 8px 0;
  
  .price-label {
    font-size: 13px;
    color: #666666;
  }
  
  .discount-value {
    font-size: 13px;
    color: #E64340;
  }
}

.total-row {
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #F5F5F5;
}

.total-label {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.total-price {
  .symbol {
    font-size: 14px;
    color: #E64340;
  }
  
  .value {
    font-size: 20px;
    font-weight: 600;
    color: #E64340;
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
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  height: 44px;
  font-size: 15px;
  
  &.van-button--plain {
    background: transparent;
    border-color: #2D5A27;
    color: #2D5A27;
  }
}

:deep(.van-button--warning) {
  background: linear-gradient(135deg, #D4A574 0%, #E8C9A8 100%);
  border: none;
  height: 44px;
  font-size: 15px;
}
</style>
