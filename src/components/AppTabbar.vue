<template>
  <van-tabbar :model-value="active" route active-color="#2D5A27" inactive-color="#999999">
    <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/reserve" icon="location-o">营地预约</van-tabbar-item>
    <van-tabbar-item replace to="/circle" icon="chat-o">结伴圈子</van-tabbar-item>
    <van-tabbar-item replace to="/equipment" icon="shopping-cart-o">装备推荐</van-tabbar-item>
    <van-tabbar-item replace to="/user" icon="user-o">个人中心</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = computed(() => {
  const pathMap = {
    '/home': 0,
    '/reserve': 1,
    '/circle': 2,
    '/equipment': 3,
    '/user': 4
  }
  return pathMap[route.path] || 0
})
</script>

<style lang="scss" scoped>
.van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
