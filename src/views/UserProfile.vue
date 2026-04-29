<template>
  <div class="profile-page page-container">
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="profile-content">
      <div class="avatar-section card">
        <div class="avatar-row flex-between">
          <span class="avatar-label">头像</span>
          <div class="avatar-wrapper" @click="changeAvatar">
            <van-image :src="user?.avatar" round class="user-avatar" />
            <van-icon name="photograph" class="camera-icon" />
          </div>
        </div>
      </div>
      
      <van-cell-group inset class="form-group">
        <van-field
          v-model="form.username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        
        <van-field
          v-model="form.phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          readonly
          is-link
          @click="showPhonePopup = true"
        />
        
        <van-field
          v-model="form.bio"
          label="个人简介"
          type="textarea"
          placeholder="介绍一下自己吧..."
          :maxlength="100"
          show-word-limit
          autosize
        />
        
        <van-field
          v-model="form.gender"
          label="性别"
          placeholder="请选择性别"
          readonly
          is-link
          @click="showGenderAction = true"
        />
        
        <van-field
          v-model="form.birthday"
          label="生日"
          placeholder="请选择生日"
          readonly
          is-link
          @click="showDatePicker = true"
        />
        
        <van-field
          v-model="form.location"
          label="常驻地"
          placeholder="请选择城市"
          readonly
          is-link
          @click="showCityPicker = true"
        />
      </van-cell-group>
      
      <div class="submit-section">
        <van-button type="primary" round block @click="saveProfile" :loading="loading">
          保存修改
        </van-button>
      </div>
    </div>
    
    <van-action-sheet
      v-model:show="showGenderAction"
      :actions="genderOptions"
      cancel-text="取消"
      @select="onGenderSelect"
    />
    
    <van-datetime-picker
      v-model:show="showDatePicker"
      type="date"
      title="选择生日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm"
      @cancel="showDatePicker = false"
    />
    
    <van-popup
      v-model:show="showCityPicker"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="city-picker">
        <div class="picker-header flex-between">
          <span class="picker-title">选择城市</span>
          <span class="confirm-text" @click="confirmCity">确定</span>
        </div>
        <van-search
          v-model="citySearch"
          placeholder="搜索城市"
          shape="round"
        />
        <div class="city-list">
          <div
            v-for="city in cities"
            :key="city"
            class="city-item"
            :class="{ active: selectedCity === city }"
            @click="selectCity(city)"
          >
            {{ city }}
          </div>
        </div>
      </div>
    </van-popup>
    
    <van-popup
      v-model:show="showPhonePopup"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="phone-popup">
        <div class="popup-header flex-between">
          <span class="popup-title">修改手机号</span>
          <van-icon name="cross" @click="showPhonePopup = false" />
        </div>
        
        <van-field
          v-model="newPhone"
          placeholder="请输入新手机号"
          type="tel"
        />
        
        <van-field
          v-model="smsCode"
          placeholder="请输入验证码"
        >
          <template #button>
            <van-button size="small" type="primary" plain @click="sendCode" :disabled="countDown > 0">
              {{ countDown > 0 ? `${countDown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
        
        <div class="popup-footer">
          <van-button type="primary" round block @click="updatePhone">
            确认修改
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.user)
const loading = ref(false)

const showGenderAction = ref(false)
const showDatePicker = ref(false)
const showCityPicker = ref(false)
const showPhonePopup = ref(false)

const minDate = ref(new Date(1950, 0, 1))
const maxDate = ref(new Date())

const form = ref({
  username: '',
  phone: '',
  bio: '',
  gender: '',
  birthday: '',
  location: ''
})

const newPhone = ref('')
const smsCode = ref('')
const countDown = ref(0)
const citySearch = ref('')
const selectedCity = ref('')

const genderOptions = [
  { text: '男', value: 'male' },
  { text: '女', value: 'female' },
  { text: '保密', value: 'secret' }
]

const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都',
  '武汉', '西安', '重庆', '天津', '长沙', '郑州', '青岛', '厦门',
  '宁波', '无锡', '佛山', '大连', '沈阳', '哈尔滨', '济南', '合肥'
]

onMounted(() => {
  if (user.value) {
    form.value.username = user.value.username || ''
    form.value.phone = user.value.phone || ''
  }
})

function changeAvatar() {
  showToast('头像修改功能开发中')
}

function onGenderSelect(action) {
  form.value.gender = action.text
  showGenderAction.value = false
}

function onDateConfirm(value) {
  form.value.birthday = new Date(value).toLocaleDateString()
  showDatePicker.value = false
}

function selectCity(city) {
  selectedCity.value = city
}

function confirmCity() {
  if (selectedCity.value) {
    form.value.location = selectedCity.value
  }
  showCityPicker.value = false
}

function sendCode() {
  if (!newPhone.value) {
    showToast('请输入手机号')
    return
  }
  
  countDown.value = 60
  showToast('验证码已发送')
  
  const timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

function updatePhone() {
  if (!newPhone.value) {
    showToast('请输入手机号')
    return
  }
  if (!smsCode.value) {
    showToast('请输入验证码')
    return
  }
  
  form.value.phone = newPhone.value
  showToast('手机号修改成功')
  showPhonePopup.value = false
}

function saveProfile() {
  if (!form.value.username) {
    showToast('请输入用户名')
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    loading.value = false
    userStore.updateProfile({
      username: form.value.username,
      phone: form.value.phone
    })
    showToast('保存成功')
    router.back()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: #FAF8F5;
  min-height: 100vh;
}

.profile-content {
  padding: 12px;
  padding-bottom: 30px;
}

.avatar-section {
  margin-bottom: 12px;
}

.avatar-row {
  padding: 12px 0;
}

.avatar-label {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 72px;
  height: 72px;
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: #2D5A27;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 12px;
  border: 2px solid #FFFFFF;
}

.form-group {
  margin-bottom: 20px;
  
  :deep(.van-field__label) {
    width: 80px;
    font-size: 14px;
    color: #1A1A1A;
  }
}

.submit-section {
  padding: 0 4px 20px;
}

.city-picker,
.phone-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.picker-header,
.popup-header {
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
}

.picker-title,
.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.confirm-text {
  font-size: 14px;
  color: #2D5A27;
  font-weight: 500;
}

.city-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.city-item {
  padding: 14px 0;
  border-bottom: 1px solid #F5F5F5;
  font-size: 14px;
  color: #1A1A1A;
  
  &.active {
    color: #2D5A27;
    font-weight: 500;
  }
}

.popup-footer {
  padding: 16px;
  margin-top: auto;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  height: 44px;
  font-size: 15px;
}

:deep(.van-button--primary.plain) {
  background: transparent;
  border-color: #2D5A27;
  color: #2D5A27;
  height: 32px;
}
</style>
