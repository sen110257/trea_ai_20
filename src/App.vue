<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <keep-alive :include="['Home', 'Reserve', 'Circle', 'Equipment', 'User']">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <app-tabbar v-if="showTabbar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTabbar from './components/AppTabbar.vue'

const route = useRoute()
const showTabbar = computed(() => route.meta.showTabbar)
</script>

<style lang="scss">
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #FAF8F5 0%, #F5F3EF 100%);
  position: relative;
  padding-bottom: 50px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
