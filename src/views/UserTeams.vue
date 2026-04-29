<template>
  <div class="my-teams-page page-container">
    <van-nav-bar
      title="我的组队"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="teams-content">
      <van-tabs v-model:active="activeTab" color="#2D5A27">
        <van-tab title="全部">
          <div class="team-list">
            <div
              v-for="team in allTeams"
              :key="team.id"
              class="team-item card"
              @click="goToDetail(team.id)"
            >
              <div class="team-header flex-between">
                <div class="team-title">{{ team.title }}</div>
                <van-tag :type="getStatusType(team.status)">
                  {{ getStatusText(team.status) }}
                </van-tag>
              </div>
              
              <div class="team-info">
                <div class="info-row">
                  <van-icon name="location-o" color="#2D5A27" size="14" />
                  <span class="info-label">出发地</span>
                  <span class="info-value">{{ team.departure }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="location" color="#D4A574" size="14" />
                  <span class="info-label">目的地</span>
                  <span class="info-value">{{ team.destination }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="clock-o" color="#999999" size="14" />
                  <span class="info-label">出发时间</span>
                  <span class="info-value">{{ team.departTime }}</span>
                </div>
              </div>
              
              <div class="team-footer flex-between">
                <div class="team-members">
                  <span>{{ team.currentMembers }}/{{ team.totalMembers }}人</span>
                  <span class="car-count">· {{ team.carCount }}辆车</span>
                </div>
                <div class="team-actions">
                  <van-button
                    v-if="team.status === 'recruiting'"
                    type="danger"
                    size="small"
                    plain
                    @click.stop="quitTeam(team)"
                  >
                    退出队伍
                  </van-button>
                  <van-button
                    v-if="team.isAuthor && team.status === 'recruiting'"
                    type="primary"
                    size="small"
                    plain
                    @click.stop="disbandTeam(team)"
                  >
                    解散队伍
                  </van-button>
                </div>
              </div>
            </div>
          </div>
          
          <van-empty description="暂无组队记录" v-if="allTeams.length === 0" />
        </van-tab>
        
        <van-tab title="招募中">
          <div class="team-list">
            <div
              v-for="team in recruitingTeams"
              :key="team.id"
              class="team-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无招募中的队伍" v-if="recruitingTeams.length === 0" />
        </van-tab>
        
        <van-tab title="已完成">
          <div class="team-list">
            <div
              v-for="team in completedTeams"
              :key="team.id"
              class="team-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无已完成的队伍" v-if="completedTeams.length === 0" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()

const activeTab = ref(0)

const myTeams = ref([
  {
    id: 201,
    title: '周末自驾露营招募！杭州出发千岛湖',
    departure: '杭州市',
    destination: '千岛湖绿野营地',
    departTime: '2024-05-18 08:00',
    totalMembers: 8,
    currentMembers: 6,
    carCount: 3,
    status: 'recruiting',
    isAuthor: false,
    createTime: '2024-05-10 14:30'
  },
  {
    id: 202,
    title: '端午莫干山露营组队',
    departure: '上海市',
    destination: '莫干山星空营地',
    departTime: '2024-06-10 07:30',
    totalMembers: 12,
    currentMembers: 10,
    carCount: 5,
    status: 'recruiting',
    isAuthor: true,
    createTime: '2024-05-08 09:15'
  },
  {
    id: 203,
    title: '安吉竹海一日游',
    departure: '杭州市',
    destination: '安吉竹海营地',
    departTime: '2024-05-01 09:00',
    totalMembers: 6,
    currentMembers: 6,
    carCount: 2,
    status: 'completed',
    isAuthor: false,
    createTime: '2024-04-20 10:45'
  }
])

const allTeams = computed(() => myTeams.value)
const recruitingTeams = computed(() => myTeams.value.filter(t => t.status === 'recruiting'))
const completedTeams = computed(() => myTeams.value.filter(t => t.status === 'completed'))

function getStatusType(status) {
  const typeMap = {
    recruiting: 'primary',
    completed: 'success'
  }
  return typeMap[status] || 'default'
}

function getStatusText(status) {
  const textMap = {
    recruiting: '招募中',
    completed: '已完成'
  }
  return textMap[status] || '未知'
}

function goToDetail(teamId) {
  router.push(`/circle/team/detail/${teamId}`)
}

async function quitTeam(team) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要退出这个队伍吗？'
    })
    
    const index = myTeams.value.findIndex(t => t.id === team.id)
    if (index > -1 && myTeams.value[index].currentMembers > 1) {
      myTeams.value[index].currentMembers--
    }
    showToast('已退出队伍')
  } catch {
    // 用户取消
  }
}

async function disbandTeam(team) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要解散这个队伍吗？解散后所有成员将被移除。'
    })
    
    const index = myTeams.value.findIndex(t => t.id === team.id)
    if (index > -1) {
      myTeams.value.splice(index, 1)
    }
    showToast('队伍已解散')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.my-teams-page {
  background: #FAF8F5;
  min-height: 100vh;
}

:deep(.van-tabs__line) {
  background: #2D5A27;
}

:deep(.van-tab--active) {
  color: #2D5A27;
}

.teams-content {
  padding-bottom: 20px;
}

.team-list {
  padding: 12px;
}

.team-item {
  margin-bottom: 12px;
}

.team-header {
  margin-bottom: 12px;
}

.team-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  flex: 1;
  margin-right: 8px;
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

.team-footer {
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.team-members {
  font-size: 13px;
  color: #666666;
  
  .car-count {
    color: #999999;
  }
}

.team-actions {
  display: flex;
  gap: 8px;
}

:deep(.van-button--danger) {
  border-color: #E64340;
  color: #E64340;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  
  &.van-button--plain {
    background: transparent;
    border-color: #2D5A27;
    color: #2D5A27;
  }
}
</style>
