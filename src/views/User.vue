<template>
  <div class="user-page page-container">
    <div class="user-header">
      <div class="header-bg">
        <van-image
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20mountain%20forest%20sunset%20landscape%20nature%20scenery&image_size=landscape_16_9"
          fit="cover"
          class="bg-image"
        />
        <div class="bg-overlay"></div>
      </div>
      
      <div class="user-info" v-if="isLoggedIn && user">
        <van-image :src="user.avatar" round class="user-avatar" />
        <div class="user-detail">
          <div class="user-name">{{ user.username }}</div>
          <div class="user-level">
            <van-tag type="primary" size="small">{{ user.levelName }}</van-tag>
          </div>
        </div>
        <van-icon name="setting" class="setting-icon" @click="$router.push('/user/profile')" />
      </div>
      
      <div class="user-login" v-else @click="$router.push('/user/login')">
        <div class="login-avatar">
          <van-icon name="user-o" />
        </div>
        <div class="login-text">点击登录</div>
      </div>
    </div>
    
    <div class="user-content" v-if="isLoggedIn">
      <div class="stats-card card">
        <div class="stats-grid">
          <div class="stats-item" @click="$router.push('/user/orders')">
            <div class="stats-value">{{ user?.points || 0 }}</div>
            <div class="stats-label">积分</div>
          </div>
          <div class="stats-item" @click="$router.push('/user/orders')">
            <div class="stats-value">{{ ordersCount }}</div>
            <div class="stats-label">预约</div>
          </div>
          <div class="stats-item" @click="$router.push('/user/favorites')">
            <div class="stats-value">{{ user?.favorites?.camps || 0 }}</div>
            <div class="stats-label">收藏</div>
          </div>
          <div class="stats-item">
            <div class="stats-value">{{ user?.coupons || 0 }}</div>
            <div class="stats-label">优惠券</div>
          </div>
        </div>
      </div>
      
      <div class="menu-card card">
        <van-cell-group inset>
          <van-cell
            title="我的预约"
            is-link
            icon="orders-o"
            @click="$router.push('/user/orders')"
          />
          <van-cell
            title="我的组队"
            is-link
            icon="friends-o"
            @click="$router.push('/user/teams')"
          />
          <van-cell
            title="我的动态"
            is-link
            icon="photo-o"
            @click="$router.push('/user/posts')"
          />
          <van-cell
            title="我的收藏"
            is-link
            icon="star-o"
            @click="$router.push('/user/favorites')"
          />
        </van-cell-group>
      </div>
      
      <div class="menu-card card">
        <van-cell-group inset>
          <van-cell
            title="个人资料"
            is-link
            icon="manager"
            @click="$router.push('/user/profile')"
          />
          <van-cell
            title="联系客服"
            is-link
            icon="service-o"
          />
          <van-cell
            title="关于我们"
            is-link
            icon="info-o"
          />
        </van-cell-group>
      </div>
      
      <div class="logout-section">
        <van-button type="default" block round @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </div>
    
    <div class="guest-content" v-else>
      <div class="guest-card card">
        <van-empty description="登录后查看更多内容">
          <template #image>
            <van-icon name="user-o" size="80" color="#CCCCCC" />
          </template>
          <van-button type="primary" round @click="$router.push('/user/login')">
            立即登录
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)
const orders = computed(() => userStore.orderList)

const ordersCount = computed(() => {
  return orders.value.length
})

async function handleLogout() {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出登录吗？'
    })
    userStore.logout()
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  padding-bottom: 50px;
  background: #FAF8F5;
  min-height: 100vh;
}

.user-header {
  position: relative;
  padding-bottom: 60px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  overflow: hidden;
  padding-top: var(--safe-area-top);
}

.bg-image {
  width: 100%;
  height: 100%;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(45, 90, 39, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px;
  padding-top: calc(40px + var(--safe-area-top));
}

.user-avatar {
  width: 64px;
  height: 64px;
  border: 3px solid #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.user-detail {
  flex: 1;
  margin-left: 12px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.setting-icon {
  font-size: 22px;
  color: #FFFFFF;
}

.user-login {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(60px + var(--safe-area-top));
}

.login-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .van-icon {
    font-size: 32px;
    color: #FFFFFF;
  }
}

.login-text {
  font-size: 14px;
  color: #FFFFFF;
  margin-top: 8px;
}

.user-content,
.guest-content {
  padding: 0 16px;
  padding-bottom: 70px;
  margin-top: -40px;
  position: relative;
}

.stats-card {
  margin-bottom: 12px;
}

.stats-grid {
  display: flex;
}

.stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stats-value {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
}

.stats-label {
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}

.menu-card {
  margin-bottom: 12px;
  padding: 0;
  
  :deep(.van-cell-group) {
    background: transparent;
  }
  
  :deep(.van-cell) {
    background: transparent;
    padding: 14px 16px;
    
    .van-cell__title {
      font-size: 14px;
      color: #1A1A1A;
    }
    
    .van-icon {
      color: #2D5A27;
      font-size: 20px;
    }
  }
}

.logout-section {
  margin-top: 24px;
  padding-bottom: 20px;
  
  :deep(.van-button) {
    height: 44px;
    background: #FFFFFF;
    border: 1px solid #E8E4DF;
    color: #E64340;
  }
}

.guest-card {
  padding: 40px 20px;
  
  :deep(.van-empty) {
    padding: 0;
  }
}
</style>
