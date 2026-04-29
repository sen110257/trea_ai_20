<template>
  <div class="confirm-page page-container">
    <van-nav-bar
      title="确认预约"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="confirm-content">
      <div class="contact-card card">
        <div class="card-title flex-between">
          <span>联系信息</span>
          <van-icon name="edit" color="#2D5A27" @click="showContactPopup = true" />
        </div>
        <div class="contact-info" v-if="contactForm.name && contactForm.phone">
          <div class="contact-row">
            <span class="contact-label">姓名</span>
            <span class="contact-value">{{ contactForm.name }}</span>
          </div>
          <div class="contact-row">
            <span class="contact-label">手机号</span>
            <span class="contact-value">{{ contactForm.phone }}</span>
          </div>
        </div>
        <div class="contact-placeholder" v-else @click="showContactPopup = true">
          <van-icon name="add-o" color="#999999" />
          <span>请填写联系信息</span>
        </div>
      </div>
      
      <div class="order-card card">
        <div class="card-title">预约详情</div>
        
        <div class="order-section">
          <div class="order-label">营地分区</div>
          <div class="order-value">{{ currentZone?.name }}</div>
        </div>
        
        <div class="order-section">
          <div class="order-label">预约日期</div>
          <div class="order-value">{{ selectedDate }}</div>
        </div>
        
        <div class="order-section">
          <div class="order-label">入住人数</div>
          <div class="order-value">{{ peopleCount }}人</div>
        </div>
        
        <div class="order-section">
          <div class="order-label">套餐类型</div>
          <div class="order-value">
            <div>{{ selectedPkg?.name }}</div>
            <div class="price-detail">¥{{ selectedPkg?.price }} × {{ peopleCount }}人</div>
          </div>
        </div>
        
        <div v-if="selectedAddOns.length > 0" class="order-section">
          <div class="order-label">加购项目</div>
          <div class="order-value">
            <div v-for="addon in selectedAddOns" :key="addon.id" class="addon-item">
              <span>{{ addon.name }} × {{ addon.count }}</span>
              <span class="addon-price">¥{{ addon.price * addon.count }}</span>
            </div>
          </div>
        </div>
        
        <div class="order-remarks">
          <van-field
            v-model="remarks"
            type="textarea"
            placeholder="备注信息（选填）"
            :maxlength="200"
            show-word-limit
            autosize
          />
        </div>
      </div>
      
      <div class="price-card card">
        <div class="card-title">费用明细</div>
        
        <div class="price-row flex-between">
          <span class="price-label">套餐费用</span>
          <span class="price-value">¥{{ packagePrice }}</span>
        </div>
        
        <div v-if="addOnsPrice > 0" class="price-row flex-between">
          <span class="price-label">加购费用</span>
          <span class="price-value">¥{{ addOnsPrice }}</span>
        </div>
        
        <div class="discount-row flex-between">
          <span class="price-label">新人优惠</span>
          <span class="discount-value">-¥0</span>
        </div>
        
        <div class="total-row flex-between">
          <span class="total-label">应付总额</span>
          <span class="total-price">
            <span class="symbol">¥</span>
            <span class="value">{{ totalPrice }}</span>
          </span>
        </div>
      </div>
      
      <div class="agreement">
        <van-checkbox v-model="agreed" shape="square">
          我已阅读并同意
          <span class="link" @click.stop>《营地使用协议》</span>
          和
          <span class="link" @click.stop>《隐私政策》</span>
        </van-checkbox>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="total-area">
        <span class="total-label">应付</span>
        <span class="total-price">
          <span class="symbol">¥</span>
          <span class="value">{{ totalPrice }}</span>
        </span>
      </div>
      <van-button
        type="primary"
        block
        round
        :disabled="!canSubmit"
        @click="submitOrder"
      >
        提交预约
      </van-button>
    </div>
    
    <van-popup
      v-model:show="showContactPopup"
      round
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="contact-popup">
        <div class="popup-header flex-between">
          <span class="popup-title">填写联系信息</span>
          <van-icon name="cross" @click="showContactPopup = false" />
        </div>
        
        <van-form @submit="saveContact">
          <van-field
            v-model="contactForm.name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="contactForm.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
          />
          <div class="popup-footer">
            <van-button type="primary" round block native-type="submit">
              保存
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
    
    <van-popup
      v-model:show="showSuccessPopup"
      round
      closeable
      :close-on-click-overlay="false"
    >
      <div class="success-popup">
        <div class="success-icon">
          <van-icon name="checked" color="#FFFFFF" size="36" />
        </div>
        <div class="success-title">预约成功</div>
        <div class="success-desc">您的预约已提交，营地将会尽快与您联系确认</div>
        <div class="success-buttons">
          <van-button round type="default" @click="goToHome">返回首页</van-button>
          <van-button round type="primary" @click="goToMyOrders">查看订单</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore, useUserStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const campStore = useCampStore()
const userStore = useUserStore()

const showContactPopup = ref(false)
const showSuccessPopup = ref(false)
const agreed = ref(false)
const remarks = ref('')

const contactForm = ref({
  name: '张先生',
  phone: '13888888888'
})

const currentZone = computed(() => campStore.currentZone)
const selectedDate = computed(() => campStore.selectedDate)
const peopleCount = computed(() => campStore.peopleCount)
const selectedPkg = computed(() => campStore.selectedPackage)
const selectedAddOns = computed(() => campStore.selectedAddOns)

const packagePrice = computed(() => {
  if (!selectedPkg.value) return 0
  return selectedPkg.value.price * peopleCount.value
})

const addOnsPrice = computed(() => {
  return selectedAddOns.value.reduce((total, item) => total + item.price * item.count, 0)
})

const totalPrice = computed(() => {
  return packagePrice.value + addOnsPrice.value
})

const canSubmit = computed(() => {
  return contactForm.value.name && contactForm.value.phone && agreed.value
})

function saveContact() {
  showContactPopup.value = false
}

function submitOrder() {
  if (!canSubmit.value) {
    if (!contactForm.value.name || !contactForm.value.phone) {
      showToast('请填写联系信息')
      return
    }
    if (!agreed.value) {
      showToast('请阅读并同意相关协议')
      return
    }
    return
  }
  
  const order = {
    zoneId: currentZone.value?.id,
    zoneName: currentZone.value?.name,
    packageId: selectedPkg.value?.id,
    packageName: selectedPkg.value?.name,
    date: selectedDate.value,
    startTime: '14:00',
    endTime: '次日12:00',
    peopleCount: peopleCount.value,
    totalPrice: totalPrice.value,
    contactName: contactForm.value.name,
    contactPhone: contactForm.value.phone,
    addOns: selectedAddOns.value.map(item => ({
      id: item.id,
      name: item.name,
      count: item.count,
      price: item.price * item.count
    })),
    remarks: remarks.value
  }
  
  userStore.addOrder(order)
  
  showSuccessPopup.value = true
}

function goToHome() {
  showSuccessPopup.value = false
  campStore.resetSelection()
  router.replace('/home')
}

function goToMyOrders() {
  showSuccessPopup.value = false
  campStore.resetSelection()
  router.replace('/user/orders')
}
</script>

<style lang="scss" scoped>
.confirm-page {
  padding-bottom: 80px;
  background: #FAF8F5;
}

.confirm-content {
  padding: 12px 16px;
  padding-bottom: 120px;
}

.contact-card,
.order-card,
.price-card {
  margin-bottom: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.contact-info {
  .contact-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    
    & + & {
      border-top: 1px solid #F5F5F5;
    }
    
    .contact-label {
      font-size: 14px;
      color: #666666;
    }
    
    .contact-value {
      font-size: 14px;
      color: #1A1A1A;
    }
  }
}

.contact-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: #999999;
  font-size: 14px;
  
  .van-icon {
    margin-right: 6px;
  }
}

.order-section {
  display: flex;
  padding: 10px 0;
  
  & + & {
    border-top: 1px solid #F5F5F5;
  }
  
  .order-label {
    width: 80px;
    font-size: 14px;
    color: #666666;
    flex-shrink: 0;
  }
  
  .order-value {
    flex: 1;
    font-size: 14px;
    color: #1A1A1A;
    
    .price-detail {
      font-size: 12px;
      color: #999999;
      margin-top: 2px;
    }
  }
}

.addon-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  
  .addon-price {
    color: #E64340;
  }
}

.order-remarks {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.price-row {
  padding: 8px 0;
}

.price-label {
  font-size: 14px;
  color: #666666;
}

.price-value {
  font-size: 14px;
  color: #1A1A1A;
}

.discount-row {
  padding: 8px 0;
}

.discount-value {
  font-size: 14px;
  color: #E64340;
}

.total-row {
  padding-top: 12px;
  margin-top: 8px;
  border-top: 1px solid #F5F5F5;
}

.total-label {
  font-size: 15px;
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

.agreement {
  margin-top: 16px;
  padding: 0 4px;
  
  :deep(.van-checkbox__label) {
    font-size: 12px;
    color: #666666;
  }
  
  .link {
    color: #2D5A27;
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

.total-area {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  
  .total-label {
    font-size: 14px;
    color: #666666;
    margin-right: 6px;
  }
  
  .total-price {
    .symbol {
      font-size: 14px;
      color: #E64340;
    }
    
    .value {
      font-size: 24px;
      font-weight: 600;
      color: #E64340;
    }
  }
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  flex: 1;
  height: 44px;
  font-size: 15px;
}

:deep(.van-button--primary:disabled) {
  opacity: 0.5;
}

.contact-popup {
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

.popup-footer {
  padding: 16px;
  margin-top: auto;
}

.success-popup {
  padding: 40px 30px;
  text-align: center;
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.success-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 10px;
}

.success-desc {
  font-size: 13px;
  color: #999999;
  line-height: 1.6;
  margin-bottom: 30px;
}

.success-buttons {
  display: flex;
  gap: 12px;
  
  .van-button {
    flex: 1;
    height: 44px;
  }
}
</style>
