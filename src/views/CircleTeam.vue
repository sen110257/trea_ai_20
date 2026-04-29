<template>
  <div class="circle-team-page page-container">
    <van-nav-bar
      title="车友组队"
      left-arrow
      @click-left="$router.back()"
      right-text="发布"
      @click-right="$router.push('/circle/team/publish')"
    />
    
    <div class="team-content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="team in teams"
            :key="team.id"
            class="team-item card"
            @click="goToDetail(team.id)"
          >
            <div class="team-header">
              <van-image :src="team.author.avatar" round class="team-avatar" />
              <div class="team-author">
                <div class="author-name">{{ team.author.name }}</div>
                <div class="publish-time">发布于 {{ team.createTime }}</div>
              </div>
              <van-tag type="primary" size="small" v-if="team.status === 'recruiting'">
                招募中
              </van-tag>
              <van-tag type="default" size="small" v-else>
                已完成
              </van-tag>
            </div>
            
            <div class="team-title">{{ team.title }}</div>
            
            <div class="team-info">
              <div class="info-row">
                <van-icon name="location-o" color="#2D5A27" />
                <span class="info-label">出发地</span>
                <span class="info-value">{{ team.departure }}</span>
              </div>
              <div class="info-row">
                <van-icon name="location" color="#D4A574" />
                <span class="info-label">目的地</span>
                <span class="info-value">{{ team.destination }}</span>
              </div>
              <div class="info-row">
                <van-icon name="clock-o" color="#666666" />
                <span class="info-label">出发时间</span>
                <span class="info-value">{{ team.departTime }}</span>
              </div>
            </div>
            
            <div class="team-tags">
              <van-tag v-for="tag in team.tags" :key="tag" type="primary" plain size="small">
                {{ tag }}
              </van-tag>
            </div>
            
            <div class="team-footer flex-between">
              <div class="team-members">
                <div class="member-avatars">
                  <van-image
                    v-for="i in Math.min(3, team.currentMembers)"
                    :key="i"
                    :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=random%20person%20avatar%20${i}&image_size=square`"
                    round
                    class="member-avatar"
                    :style="{ marginLeft: i > 1 ? '-8px' : '0' }"
                  />
                </div>
                <span class="member-text">{{ team.currentMembers }}/{{ team.totalMembers }}人</span>
                <span class="car-text">· {{ team.carCount }}辆车</span>
              </div>
              <van-button type="primary" size="small" round @click.stop="joinTeam(team)">
                加入
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      
      <van-empty description="暂无组队信息" v-if="teams.length === 0 && !loading" />
    </div>
    
    <div class="fab-button" @click="$router.push('/circle/team/publish')">
      <van-icon name="plus" size="24" color="#FFFFFF" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCircleStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const circleStore = useCircleStore()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const teams = computed(() => circleStore.teamList)

onMounted(() => {
  // 确保数据已加载
})

function goToDetail(teamId) {
  router.push(`/circle/team/detail/${teamId}`)
}

function joinTeam(team) {
  if (team.currentMembers >= team.totalMembers) {
    showToast('队伍已满')
    return
  }
  team.currentMembers++
  showToast('已申请加入队伍')
}

function onRefresh() {
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

function onLoad() {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 1000)
}
</script>

<style lang="scss" scoped>
.circle-team-page {
  background: #FAF8F5;
  min-height: 100vh;
  padding-bottom: 70px;
}

.team-content {
  padding: 12px;
  padding-bottom: 80px;
}

.team-item {
  margin-bottom: 12px;
}

.team-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.team-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.team-author {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.publish-time {
  font-size: 11px;
  color: #999999;
  margin-top: 2px;
}

.team-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
  line-height: 1.4;
}

.team-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 4px 0;
  
  .info-label {
    width: 56px;
    font-size: 13px;
    color: #999999;
    margin-left: 6px;
  }
  
  .info-value {
    font-size: 13px;
    color: #1A1A1A;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.team-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.team-footer {
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.team-members {
  display: flex;
  align-items: center;
}

.member-avatars {
  display: flex;
  margin-right: 8px;
}

.member-avatar {
  width: 24px;
  height: 24px;
  border: 2px solid #FFFFFF;
}

.member-text {
  font-size: 12px;
  color: #1A1A1A;
  font-weight: 500;
}

.car-text {
  font-size: 12px;
  color: #999999;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
}

.fab-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  box-shadow: 0 4px 12px rgba(45, 90, 39, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}
</style>
