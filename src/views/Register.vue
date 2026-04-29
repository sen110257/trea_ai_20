<template>
  <div class="register-page page-container">
    <van-nav-bar
      title="注册"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="register-content">
      <div class="logo-section">
        <div class="logo-icon">
          <van-icon name="location-o" color="#FFFFFF" size="36" />
        </div>
        <div class="logo-title">加入山野营地</div>
        <div class="logo-subtitle">开启您的户外露营之旅</div>
      </div>
      
      <div class="form-section card">
        <van-form @submit="onSubmit">
          <van-field
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          />
          
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
            v-model="form.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button size="small" type="primary" plain @click="sendCode" :disabled="countDown > 0">
                {{ countDown > 0 ? `${countDown}s后重发` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
          
          <van-field
            v-model="form.password"
            name="password"
            label="密码"
            placeholder="请设置密码"
            type="password"
            :rules="[
              { required: true, message: '请设置密码' },
              { min: 6, message: '密码至少6位' }
            ]"
          />
          
          <van-field
            v-model="form.confirmPassword"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            type="password"
            :rules="[{ required: true, message: '请再次输入密码' }]"
          />
          
          <div class="agreement">
            <van-checkbox v-model="agreed" shape="square">
              我已阅读并同意
              <span class="link">《用户协议》</span>
              和
              <span class="link">《隐私政策》</span>
            </van-checkbox>
          </div>
          
          <div class="form-footer">
            <van-button type="primary" round block native-type="submit" :loading="loading">
              注册
            </van-button>
            <div class="login-link">
              已有账号？
              <span class="link" @click="$router.push('/user/login')">立即登录</span>
            </div>
          </div>
        </van-form>
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
const agreed = ref(false)
const countDown = ref(0)
const form = ref({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

function sendCode() {
  if (!form.value.phone) {
    showToast('请先输入手机号')
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

function onSubmit(values) {
  if (!agreed.value) {
    showToast('请阅读并同意用户协议')
    return
  }
  
  if (values.password !== values.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    loading.value = false
    userStore.register(values.username, values.phone, values.password)
    showToast('注册成功')
    router.replace('/user')
  }, 1500)
}
</script>

<style lang="scss" scoped>
.register-page {
  background: linear-gradient(180deg, #FAF8F5 0%, #F5F3EF 100%);
  min-height: 100vh;
}

.register-content {
  padding: 16px;
  padding-bottom: 40px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.logo-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.logo-title {
  font-size: 18px;
  font-weight: 600;
  color: #2D5A27;
  margin-bottom: 4px;
}

.logo-subtitle {
  font-size: 12px;
  color: #999999;
}

.form-section {
  margin-bottom: 16px;
}

:deep(.van-field__label) {
  width: 70px;
  font-size: 14px;
  color: #1A1A1A;
}

.agreement {
  padding: 12px 0 4px;
  
  :deep(.van-checkbox__label) {
    font-size: 12px;
    color: #666666;
  }
  
  .link {
    color: #2D5A27;
  }
}

.form-footer {
  padding: 16px 0 8px;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: #666666;
  
  .link {
    color: #2D5A27;
  }
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
}
</style>
