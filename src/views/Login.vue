<template>
  <div class="login-page page-container">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="login-content">
      <div class="logo-section">
        <div class="logo-icon">
          <van-icon name="location-o" color="#FFFFFF" size="40" />
        </div>
        <div class="logo-title">山野营地</div>
        <div class="logo-subtitle">在自然中寻找宁静</div>
      </div>
      
      <div class="form-section card">
        <van-form @submit="onSubmit">
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
          />
          
          <van-field
            v-model="form.password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            type="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
          
          <div class="form-footer">
            <van-button type="primary" round block native-type="submit" :loading="loading">
              登录
            </van-button>
            <div class="login-options">
              <span class="option-text" @click="$router.push('/user/register')">
                新用户注册
              </span>
              <span class="option-text">忘记密码</span>
            </div>
          </div>
        </van-form>
      </div>
      
      <div class="other-login">
        <div class="divider">
          <span class="divider-text">其他登录方式</span>
        </div>
        
        <div class="login-methods">
          <div class="method-item">
            <div class="method-icon wechat">
              <van-icon name="chat-o" color="#FFFFFF" size="24" />
            </div>
            <span class="method-text">微信登录</span>
          </div>
          <div class="method-item">
            <div class="method-icon phone">
              <van-icon name="phone-o" color="#FFFFFF" size="24" />
            </div>
            <span class="method-text">短信登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const form = ref({
  phone: '',
  password: ''
})

function onSubmit(values) {
  loading.value = true
  
  setTimeout(() => {
    loading.value = false
    userStore.login('露营爱好者', values.password)
    showToast('登录成功')
    router.replace('/user')
  }, 1000)
}
</script>

<style lang="scss" scoped>
.login-page {
  background: linear-gradient(180deg, #FAF8F5 0%, #F5F3EF 100%);
  min-height: 100vh;
}

.login-content {
  padding: 20px 16px;
  padding-bottom: 40px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.logo-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(45, 90, 39, 0.3);
}

.logo-title {
  font-size: 24px;
  font-weight: 600;
  color: #2D5A27;
  margin-bottom: 6px;
}

.logo-subtitle {
  font-size: 13px;
  color: #999999;
}

.form-section {
  margin-bottom: 24px;
}

:deep(.van-field__label) {
  width: 70px;
  font-size: 14px;
  color: #1A1A1A;
}

.form-footer {
  padding: 16px 0 8px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}

.option-text {
  font-size: 13px;
  color: #2D5A27;
}

.other-login {
  margin-top: 24px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #E8E4DF;
  }
}

.divider-text {
  padding: 0 16px;
  font-size: 12px;
  color: #999999;
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  
  &.wechat {
    background: #07C160;
  }
  
  &.phone {
    background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  }
}

.method-text {
  font-size: 12px;
  color: #666666;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  height: 44px;
  font-size: 15px;
}
</style>
