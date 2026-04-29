<template>
  <div class="package-page page-container">
    <van-nav-bar
      title="选择套餐"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="package-content">
      <div class="info-summary card">
        <div class="summary-row">
          <span class="summary-label">营地分区</span>
          <span class="summary-value">{{ currentZone?.name }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">预约日期</span>
          <span class="summary-value">{{ selectedDate }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">入住人数</span>
          <span class="summary-value">{{ peopleCount }}人</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">选择套餐</div>
        <div class="package-list">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            class="package-card card"
            :class="{ selected: selectedPkg?.id === pkg.id }"
            @click="selectPackage(pkg)"
          >
            <div v-if="pkg.recommended" class="recommended-tag">
              推荐
            </div>
            <div class="package-header">
              <van-image :src="pkg.image" fit="cover" class="package-image" />
              <div class="package-info">
                <div class="package-name">{{ pkg.name }}</div>
                <div class="package-desc text-ellipsis-2">{{ pkg.description }}</div>
                <div class="package-price">
                  <span class="current-price">¥{{ pkg.price }}</span>
                  <span class="original-price">¥{{ pkg.originalPrice }}</span>
                  <span class="price-unit">/人</span>
                </div>
              </div>
            </div>
            <div class="package-includes">
              <div class="includes-title">包含内容</div>
              <div class="includes-list">
                <div v-for="(item, index) in pkg.includes" :key="index" class="include-item">
                  <van-icon name="success" color="#2D5A27" size="12" />
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
            <div class="select-indicator">
              <van-icon :name="selectedPkg?.id === pkg.id ? 'checked' : 'circle'" :color="selectedPkg?.id === pkg.id ? '#2D5A27' : '#CCCCCC'" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">可选加购</div>
        <div class="addons-list">
          <div
            v-for="addon in addOns"
            :key="addon.id"
            class="addon-card card"
            :class="{ selected: isAddOnSelected(addon.id) }"
          >
            <van-image :src="addon.image" fit="cover" class="addon-image" />
            <div class="addon-info">
              <div class="addon-name">{{ addon.name }}</div>
              <div class="addon-desc">{{ addon.description }}</div>
              <div class="addon-price">
                <span class="price">¥{{ addon.price }}</span>
                <span class="unit">/{{ addon.unit }}</span>
              </div>
            </div>
            <div class="addon-action">
              <van-stepper
                v-if="isAddOnSelected(addon.id)"
                v-model="addon.count"
                :min="1"
                :max="10"
                theme="round"
                button-size="24"
                @change="updateAddOn(addon)"
              />
              <van-button
                v-else
                type="primary"
                size="small"
                round
                @click="toggleAddOn(addon)"
              >
                加购
              </van-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="price-summary">
        <div class="price-row">
          <span class="price-label">套餐费用</span>
          <span class="price-value">¥{{ packagePrice }}</span>
        </div>
        <div v-if="addOnsPrice > 0" class="price-row">
          <span class="price-label">加购费用</span>
          <span class="price-value">¥{{ addOnsPrice }}</span>
        </div>
        <div class="total-row">
          <span class="total-label">合计</span>
          <span class="total-price">
            <span class="symbol">¥</span>
            <span class="value">{{ totalPrice }}</span>
          </span>
        </div>
      </div>
      <van-button
        type="primary"
        block
        round
        :disabled="!selectedPkg"
        @click="goToConfirm"
      >
        确认预约
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

const currentZone = computed(() => campStore.currentZone)
const selectedDate = computed(() => campStore.selectedDate)
const peopleCount = computed(() => campStore.peopleCount)
const selectedPkg = computed(() => campStore.selectedPackage)
const selectedAddOns = computed(() => campStore.selectedAddOns)
const packages = computed(() => campStore.packageList)
const addOns = computed(() => campStore.addOnList)

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

onMounted(() => {
  const zoneId = parseInt(route.params.zoneId)
  const zone = campStore.zoneList.find(z => z.id === zoneId)
  if (zone) {
    campStore.setCurrentZone(zone)
  }
  campStore.setSelectedDate(route.params.date)
})

function selectPackage(pkg) {
  campStore.setSelectedPackage(pkg)
}

function isAddOnSelected(addonId) {
  return selectedAddOns.value.some(item => item.id === addonId)
}

function toggleAddOn(addon) {
  campStore.toggleAddOn(addon)
}

function updateAddOn(addon) {
  const selectedItem = selectedAddOns.value.find(item => item.id === addon.id)
  if (selectedItem) {
    selectedItem.count = addon.count
  }
}

function goToConfirm() {
  if (!selectedPkg.value) return
  router.push('/reserve/confirm')
}
</script>

<style lang="scss" scoped>
.package-page {
  padding-bottom: 80px;
  background: #FAF8F5;
}

.package-content {
  padding: 12px 16px;
  padding-bottom: 120px;
}

.info-summary {
  margin-bottom: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  
  & + & {
    border-top: 1px solid #F5F5F5;
  }
  
  .summary-label {
    font-size: 14px;
    color: #666666;
  }
  
  .summary-value {
    font-size: 14px;
    color: #1A1A1A;
    font-weight: 500;
  }
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
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

.package-list,
.addons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.package-card {
  position: relative;
  border: 2px solid transparent;
  
  &.selected {
    border-color: #2D5A27;
  }
}

.recommended-tag {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #D4A574 0%, #E8C9A8 100%);
  color: #FFFFFF;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 0 12px 0 12px;
  z-index: 1;
}

.package-header {
  display: flex;
  margin-bottom: 12px;
}

.package-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-right: 12px;
  flex-shrink: 0;
}

.package-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.package-name {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.package-desc {
  font-size: 12px;
  color: #999999;
  line-height: 1.4;
  margin-bottom: 8px;
}

.package-price {
  margin-top: auto;
  display: flex;
  align-items: baseline;
  
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
  
  .price-unit {
    font-size: 11px;
    color: #999999;
    margin-left: 2px;
  }
}

.package-includes {
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.includes-title {
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
}

.includes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.include-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
  
  .van-icon {
    margin-right: 4px;
  }
}

.select-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  
  .van-icon {
    font-size: 22px;
  }
}

.addon-card {
  display: flex;
  align-items: center;
}

.addon-image {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-right: 12px;
  flex-shrink: 0;
}

.addon-info {
  flex: 1;
  min-width: 0;
}

.addon-name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.addon-desc {
  font-size: 11px;
  color: #999999;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.addon-price {
  display: flex;
  align-items: baseline;
  
  .price {
    font-size: 15px;
    font-weight: 600;
    color: #E64340;
  }
  
  .unit {
    font-size: 10px;
    color: #999999;
  }
}

.addon-action {
  flex-shrink: 0;
  margin-left: 12px;
  
  :deep(.van-stepper__minus),
  :deep(.van-stepper__plus) {
    background: rgba(45, 90, 39, 0.1);
    color: #2D5A27;
    border: none;
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

.price-summary {
  flex-shrink: 0;
  min-width: 120px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
  
  .price-label {
    color: #999999;
  }
  
  .price-value {
    color: #666666;
  }
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #F0F0F0;
  
  .total-label {
    font-size: 13px;
    color: #1A1A1A;
    font-weight: 500;
  }
}

.total-price {
  .symbol {
    font-size: 14px;
    color: #E64340;
  }
  
  .value {
    font-size: 22px;
    font-weight: 600;
    color: #E64340;
  }
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  flex: 1;
  height: 44px;
  font-size: 15px;
}

:deep(.van-button--primary::before) {
  border: none;
}

:deep(.van-button--primary:disabled) {
  opacity: 0.5;
}
</style>
