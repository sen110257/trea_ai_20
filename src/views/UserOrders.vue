<template>
  <div class="orders-page page-container">
    <van-nav-bar
      title="我的预约"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="orders-content">
      <van-tabs v-model:active="activeTab" color="#2D5A27">
        <van-tab title="全部">
          <div class="order-list">
            <div
              v-for="order in orders"
              :key="order.id"
              class="order-item card"
              @click="goToDetail(order.id)"
            >
              <div class="order-header flex-between">
                <span class="order-id">订单号：{{ order.id }}</span>
                <van-tag :type="getStatusType(order.status)">
                  {{ getStatusText(order.status) }}
                </van-tag>
              </div>
              
              <div class="order-body">
                <div class="order-info">
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
                </div>
              </div>
              
              <div class="order-footer flex-between">
                <div class="order-price">
                  <span class="price-label">订单金额</span>
                  <span class="price-value">¥{{ order.totalPrice }}</span>
                </div>
                <div class="order-actions">
                  <van-button
                    v-if="order.status === 'pending'"
                    size="small"
                    type="primary"
                    round
                    @click.stop="payOrder(order)"
                  >
                    去支付
                  </van-button>
                  <van-button
                    v-if="order.status === 'confirmed'"
                    size="small"
                    type="warning"
                    round
                    @click.stop="cancelOrder(order)"
                  >
                    取消预约
                  </van-button>
                  <van-button
                    v-if="order.status === 'completed'"
                    size="small"
                    type="primary"
                    plain
                    round
                  >
                    再次预约
                  </van-button>
                </div>
              </div>
            </div>
          </div>
          
          <van-empty description="暂无预约记录" v-if="orders.length === 0" />
        </van-tab>
        
        <van-tab title="待确认">
          <div class="order-list">
            <div
              v-for="order in pendingOrders"
              :key="order.id"
              class="order-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无待确认订单" v-if="pendingOrders.length === 0" />
        </van-tab>
        
        <van-tab title="已完成">
          <div class="order-list">
            <div
              v-for="order in completedOrders"
              :key="order.id"
              class="order-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无已完成订单" v-if="completedOrders.length === 0" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref(0)

const orders = computed(() => userStore.orderList)

const pendingOrders = computed(() => {
  return orders.value.filter(o => o.status === 'pending' || o.status === 'confirmed')
})

const completedOrders = computed(() => {
  return orders.value.filter(o => o.status === 'completed')
})

function getStatusType(status) {
  const typeMap = {
    pending: 'warning',
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'default'
  }
  return typeMap[status] || 'default'
}

function getStatusText(status) {
  const textMap = {
    pending: '待支付',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return textMap[status] || '未知'
}

function goToDetail(orderId) {
  router.push(`/reserve/detail/${orderId}`)
}

async function cancelOrder(order) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消该预约吗？'
    })
    order.status = 'cancelled'
    showToast('已取消预约')
  } catch {
    // 用户取消
  }
}

function payOrder(order) {
  order.status = 'confirmed'
  showToast('支付成功')
}
</script>

<style lang="scss" scoped>
.orders-page {
  background: #FAF8F5;
  min-height: 100vh;
}

.orders-content {
  padding-bottom: 20px;
}

:deep(.van-tabs__line) {
  background: #2D5A27;
}

:deep(.van-tab--active) {
  color: #2D5A27;
}

.order-list {
  padding: 12px;
}

.order-item {
  margin-bottom: 12px;
}

.order-header {
  padding-bottom: 12px;
  border-bottom: 1px solid #F5F5F5;
  margin-bottom: 12px;
}

.order-id {
  font-size: 12px;
  color: #999999;
}

.order-body {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  
  .info-label {
    font-size: 13px;
    color: #999999;
  }
  
  .info-value {
    font-size: 13px;
    color: #1A1A1A;
  }
}

.order-footer {
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.order-price {
  .price-label {
    font-size: 12px;
    color: #999999;
    margin-right: 4px;
  }
  
  .price-value {
    font-size: 18px;
    font-weight: 600;
    color: #E64340;
  }
}

.order-actions {
  display: flex;
  gap: 8px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
}

:deep(.van-button--warning) {
  background: linear-gradient(135deg, #D4A574 0%, #E8C9A8 100%);
  border: none;
}
</style>
