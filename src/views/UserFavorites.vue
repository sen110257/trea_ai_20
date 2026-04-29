<template>
  <div class="favorites-page page-container">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="$router.back()"
    />
    
    <van-tabs v-model:active="activeTab" color="#2D5A27">
      <van-tab title="营地">
        <div class="favorites-list">
          <div
            v-for="zone in favoriteZones"
            :key="zone.id"
            class="favorite-item card"
            @click="goToZone(zone.id)"
          >
            <van-image :src="zone.image" fit="cover" class="favorite-image" />
            <div class="favorite-info">
              <div class="favorite-name">{{ zone.name }}</div>
              <div class="favorite-tags">
                <van-tag v-for="tag in zone.tags.slice(0, 2)" :key="tag" type="primary" plain size="small">
                  {{ tag }}
                </van-tag>
              </div>
              <div class="favorite-price">
                <span class="price">¥{{ zone.price }}</span>
                <span class="unit">/天</span>
              </div>
            </div>
            <div class="favorite-action" @click.stop="removeZoneFavorite(zone.id)">
              <van-icon name="close" color="#999999" />
            </div>
          </div>
          
          <van-empty description="暂无收藏的营地" v-if="favoriteZones.length === 0" />
        </div>
      </van-tab>
      
      <van-tab title="装备">
        <div class="favorites-list">
          <div
            v-for="equipment in favoriteEquipments"
            :key="equipment.id"
            class="favorite-item card"
            @click="goToEquipment(equipment.id)"
          >
            <van-image :src="equipment.image" fit="cover" class="favorite-image" />
            <div class="favorite-info">
              <div class="favorite-name">{{ equipment.name }}</div>
              <div class="favorite-tags">
                <van-tag v-for="tag in equipment.tags.slice(0, 2)" :key="tag" type="primary" plain size="small">
                  {{ tag }}
                </van-tag>
              </div>
              <div class="favorite-price">
                <span class="price">¥{{ equipment.price }}</span>
                <span class="original">¥{{ equipment.originalPrice }}</span>
              </div>
            </div>
            <div class="favorite-action" @click.stop="removeEquipmentFavorite(equipment.id)">
              <van-icon name="close" color="#999999" />
            </div>
          </div>
          
          <van-empty description="暂无收藏的装备" v-if="favoriteEquipments.length === 0" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore, useEquipmentStore } from '@/stores'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const campStore = useCampStore()
const equipmentStore = useEquipmentStore()

const activeTab = ref(0)
const favoriteZoneIds = ref([1, 3, 5])
const favoriteEquipmentIds = ref([1, 3, 4])

const zones = computed(() => campStore.zoneList)
const equipments = computed(() => equipmentStore.equipmentList)

const favoriteZones = computed(() => {
  return zones.value.filter(z => favoriteZoneIds.value.includes(z.id))
})

const favoriteEquipments = computed(() => {
  return equipments.value.filter(eq => favoriteEquipmentIds.value.includes(eq.id))
})

function goToZone(zoneId) {
  router.push(`/reserve/zone/${zoneId}`)
}

function goToEquipment(equipmentId) {
  router.push(`/equipment/detail/${equipmentId}`)
}

async function removeZoneFavorite(zoneId) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消收藏该营地吗？'
    })
    
    const index = favoriteZoneIds.value.indexOf(zoneId)
    if (index > -1) {
      favoriteZoneIds.value.splice(index, 1)
    }
    showToast('已取消收藏')
  } catch {
    // 用户取消
  }
}

async function removeEquipmentFavorite(equipmentId) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要取消收藏该装备吗？'
    })
    
    const index = favoriteEquipmentIds.value.indexOf(equipmentId)
    if (index > -1) {
      favoriteEquipmentIds.value.splice(index, 1)
    }
    showToast('已取消收藏')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.favorites-page {
  background: #FAF8F5;
  min-height: 100vh;
}

:deep(.van-tabs__line) {
  background: #2D5A27;
}

:deep(.van-tab--active) {
  color: #2D5A27;
}

.favorites-list {
  padding: 12px;
}

.favorite-item {
  display: flex;
  position: relative;
  margin-bottom: 12px;
}

.favorite-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-right: 12px;
  flex-shrink: 0;
}

.favorite-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.favorite-name {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.favorite-price {
  margin-top: auto;
  display: flex;
  align-items: baseline;
  
  .price {
    font-size: 16px;
    font-weight: 600;
    color: #E64340;
  }
  
  .original {
    font-size: 12px;
    color: #999999;
    text-decoration: line-through;
    margin-left: 6px;
  }
  
  .unit {
    font-size: 11px;
    color: #999999;
    margin-left: 2px;
  }
}

.favorite-action {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
