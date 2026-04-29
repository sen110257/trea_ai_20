<template>
  <div class="date-page page-container">
    <van-nav-bar
      title="选择日期"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="date-content">
      <div class="zone-info-card card">
        <div class="zone-info-row">
          <van-image :src="currentZone?.image" fit="cover" class="zone-thumb" />
          <div class="zone-info">
            <div class="zone-name">{{ currentZone?.name }}</div>
            <div class="zone-price">
              <span class="price">¥{{ currentZone?.price }}</span>
              <span class="unit">/天</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calendar-card card">
        <div class="calendar-title">选择入住日期</div>
        <van-calendar
          v-model="selectedDate"
          type="single"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="onDateConfirm"
          color="#2D5A27"
          :show-confirm="false"
          :poppable="false"
        />
      </div>
      
      <div class="time-select-card card" v-if="selectedDate">
        <div class="card-title">选择时段</div>
        <van-radio-group v-model="selectedTime">
          <div class="time-options">
            <van-radio
              v-for="timeSlot in timeSlots"
              :key="timeSlot.value"
              :name="timeSlot.value"
              :disabled="!timeSlot.available"
            >
              <div class="time-option-content">
                <div class="time-range">{{ timeSlot.label }}</div>
                <div class="time-status" :class="timeSlot.available ? 'available' : 'unavailable'">
                  {{ timeSlot.available ? '可预约' : '已满' }}
                </div>
              </div>
            </van-radio>
          </div>
        </van-radio-group>
      </div>
      
      <div class="people-select-card card" v-if="selectedDate">
        <div class="card-title">选择人数</div>
        <div class="people-control flex-between">
          <span class="people-label">入住人数</span>
          <van-stepper
            v-model="peopleCount"
            :min="1"
            :max="maxPeople"
            theme="round"
            button-size="28"
          />
        </div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="summary-area">
        <div class="summary-row">
          <span class="summary-label">日期</span>
          <span class="summary-value">{{ selectedDate ? formatDate(selectedDate) : '请选择' }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">时段</span>
          <span class="summary-value">{{ selectedTime ? getTimeSlotLabel(selectedTime) : '请选择' }}</span>
        </div>
      </div>
      <van-button
        type="primary"
        block
        round
        :disabled="!canProceed"
        @click="goToPackage"
      >
        下一步：选择套餐
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useCampStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const campStore = useCampStore()

const selectedDate = ref('')
const selectedTime = ref('')
const peopleCount = ref(2)

const minDate = ref(new Date())
const maxDate = ref(new Date(dayjs().add(30, 'day').valueOf()))

const currentZone = computed(() => campStore.currentZone)
const maxPeople = computed(() => currentZone.value?.capacity || 10)

const timeSlots = [
  { value: 'morning', label: '上午 08:00 - 12:00', available: true },
  { value: 'afternoon', label: '下午 14:00 - 18:00', available: true },
  { value: 'evening', label: '晚上 18:00 - 22:00', available: false },
  { value: 'overnight', label: '过夜 14:00 - 次日12:00', available: true }
]

const canProceed = computed(() => {
  return selectedDate.value && selectedTime.value
})

const formatter = (day) => {
  const today = dayjs()
  const date = dayjs(day.date)
  
  if (date.isBefore(today, 'day')) {
    day.type = 'disabled'
  }
  
  const random = Math.random()
  if (random > 0.7 && date.isAfter(today, 'day')) {
    day.type = 'disabled'
    day.bottomInfo = '已满'
  }
  
  return day
}

onMounted(() => {
  const zoneId = parseInt(route.params.zoneId)
  const zone = campStore.zoneList.find(z => z.id === zoneId)
  if (zone) {
    campStore.setCurrentZone(zone)
  }
})

function onDateConfirm(value) {
  selectedDate.value = value
}

function formatDate(date) {
  if (!date) return ''
  const d = dayjs(date)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.month() + 1}月${d.date()}日 ${weekDays[d.day()]}`
}

function getTimeSlotLabel(value) {
  const slot = timeSlots.find(s => s.value === value)
  return slot ? slot.label : ''
}

function goToPackage() {
  if (!canProceed.value) return
  
  campStore.setSelectedDate(dayjs(selectedDate.value).format('YYYY-MM-DD'))
  campStore.setPeopleCount(peopleCount.value)
  router.push(`/reserve/package/${route.params.zoneId}/${dayjs(selectedDate.value).format('YYYY-MM-DD')}`)
}
</script>

<style lang="scss" scoped>
.date-page {
  padding-bottom: 80px;
  background: #FAF8F5;
}

.date-content {
  padding: 12px 16px;
  padding-bottom: 100px;
}

.zone-info-card {
  margin-bottom: 12px;
}

.zone-info-row {
  display: flex;
  align-items: center;
}

.zone-thumb {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  margin-right: 12px;
  flex-shrink: 0;
}

.zone-info {
  flex: 1;
}

.zone-name {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.zone-price {
  display: flex;
  align-items: baseline;
  
  .price {
    font-size: 18px;
    font-weight: 600;
    color: #E64340;
  }
  
  .unit {
    font-size: 12px;
    color: #999999;
    margin-left: 2px;
  }
}

.calendar-card {
  padding: 0;
  overflow: hidden;
  margin-bottom: 12px;
}

.calendar-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  padding: 14px 16px;
  border-bottom: 1px solid #F0F0F0;
}

.time-select-card,
.people-select-card {
  margin-bottom: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.time-options {
  :deep(.van-radio) {
    padding: 12px 0;
    border-bottom: 1px solid #F5F5F5;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  :deep(.van-radio__icon--checked .van-icon) {
    background-color: #2D5A27;
    border-color: #2D5A27;
  }
}

.time-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 12px;
}

.time-range {
  font-size: 14px;
  color: #1A1A1A;
}

.time-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  
  &.available {
    background: rgba(45, 90, 39, 0.1);
    color: #2D5A27;
  }
  
  &.unavailable {
    background: #F5F5F5;
    color: #999999;
  }
}

.people-control {
  padding: 8px 0;
}

.people-label {
  font-size: 14px;
  color: #1A1A1A;
}

:deep(.van-stepper__minus),
:deep(.van-stepper__plus) {
  background: rgba(45, 90, 39, 0.1);
  color: #2D5A27;
  border: none;
}

:deep(.van-stepper__input) {
  font-weight: 600;
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

.summary-area {
  flex-shrink: 0;
}

.summary-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .summary-label {
    font-size: 12px;
    color: #999999;
    width: 40px;
  }
  
  .summary-value {
    font-size: 13px;
    color: #1A1A1A;
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

:deep(.van-calendar__selected-day) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%) !important;
}
</style>
