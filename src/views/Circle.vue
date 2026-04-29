<template>
  <div class="circle-page page-container">
    <van-nav-bar
      title="结伴圈子"
      :left-arrow="false"
      right-text="发布"
      @click-right="showPublishAction"
    />
    
    <van-tabs v-model:active="activeTab" color="#2D5A27" sticky line-width="24">
      <van-tab title="露营动态">
        <div class="tab-content">
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model:loading="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div
                v-for="post in posts"
                :key="post.id"
                class="post-item card"
                @click="goToPostDetail(post.id)"
              >
                <div class="post-header">
                  <van-image :src="post.author.avatar" round class="post-avatar" />
                  <div class="post-author">
                    <div class="author-name">{{ post.author.name }}</div>
                    <div class="post-time">{{ post.createTime }}</div>
                  </div>
                </div>
                
                <div class="post-content">
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-text text-ellipsis-2">{{ post.content }}</div>
                </div>
                
                <div v-if="post.images && post.images.length > 0" class="post-images">
                  <van-image
                    v-for="(img, index) in post.images.slice(0, 3)"
                    :key="index"
                    :src="img"
                    fit="cover"
                    class="post-image"
                  />
                  <div v-if="post.images.length > 3" class="more-images">
                    +{{ post.images.length - 3 }}
                  </div>
                </div>
                
                <div class="post-footer flex-between">
                  <div class="post-location">
                    <van-icon name="location-o" />
                    <span>{{ post.location }}</span>
                  </div>
                  <div class="post-actions">
                    <div class="action-item" @click.stop="likePost(post)">
                      <van-icon :name="isLiked(post.id) ? 'star' : 'star-o'" :color="isLiked(post.id) ? '#FFD700' : '#999999'" />
                      <span>{{ post.likes + (isLiked(post.id) ? 1 : 0) }}</span>
                    </div>
                    <div class="action-item">
                      <van-icon name="comment-o" />
                      <span>{{ post.comments }}</span>
                    </div>
                    <div class="action-item" @click.stop="toggleFavoritePost(post)">
                      <van-icon :name="isFavorited(post.id) ? 'bookmark' : 'bookmark-o'" :color="isFavorited(post.id) ? '#2D5A27' : '#999999'" />
                      <span>{{ post.favorites + (isFavorited(post.id) ? 1 : 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      
      <van-tab title="车友组队">
        <div class="tab-content">
          <van-pull-refresh v-model="teamRefreshing" @refresh="onTeamRefresh">
            <van-list
              v-model:loading="teamLoading"
              :finished="teamFinished"
              finished-text="没有更多了"
              @load="onTeamLoad"
            >
              <div
                v-for="team in teams"
                :key="team.id"
                class="team-item card"
                @click="goToTeamDetail(team.id)"
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
        </div>
      </van-tab>
    </van-tabs>
    
    <van-fab
      icon="plus"
      type="primary"
      @click="showPublishAction"
      :style="{ right: '20px', bottom: '70px' }"
    />
    
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="onActionSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCircleStore, useUserStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const circleStore = useCircleStore()
const userStore = useUserStore()

const activeTab = ref(0)
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const teamRefreshing = ref(false)
const teamLoading = ref(false)
const teamFinished = ref(false)

const showActionSheet = ref(false)
const likedPostIds = ref([])
const favoritePostIds = ref([])

const posts = computed(() => circleStore.postList)
const teams = computed(() => circleStore.teamList)

const actions = [
  { name: '发布动态', value: 'post' },
  { name: '发布组队', value: 'team' }
]

function showPublishAction() {
  showActionSheet.value = true
}

function onActionSelect(action) {
  showActionSheet.value = false
  if (action.value === 'post') {
    router.push('/circle/post/publish')
  } else if (action.value === 'team') {
    router.push('/circle/team/publish')
  }
}

function isLiked(postId) {
  return likedPostIds.value.includes(postId)
}

function isFavorited(postId) {
  return favoritePostIds.value.includes(postId)
}

function likePost(post) {
  if (!isLiked(post.id)) {
    likedPostIds.value.push(post.id)
    circleStore.likePost(post.id)
    showToast('点赞成功')
  } else {
    const index = likedPostIds.value.indexOf(post.id)
    if (index > -1) {
      likedPostIds.value.splice(index, 1)
    }
  }
}

function toggleFavoritePost(post) {
  if (!isFavorited(post.id)) {
    favoritePostIds.value.push(post.id)
    showToast('已收藏')
  } else {
    const index = favoritePostIds.value.indexOf(post.id)
    if (index > -1) {
      favoritePostIds.value.splice(index, 1)
    }
    showToast('已取消收藏')
  }
}

function goToPostDetail(postId) {
  router.push(`/circle/post/detail/${postId}`)
}

function goToTeamDetail(teamId) {
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

function onTeamRefresh() {
  setTimeout(() => {
    teamRefreshing.value = false
  }, 1000)
}

function onTeamLoad() {
  setTimeout(() => {
    teamLoading.value = false
    teamFinished.value = true
  }, 1000)
}
</script>

<style lang="scss" scoped>
.circle-page {
  padding-bottom: 50px;
  background: #FAF8F5;
  min-height: 100vh;
}

:deep(.van-tabs__line) {
  background: #2D5A27;
}

:deep(.van-tab--active) {
  color: #2D5A27;
}

.tab-content {
  padding: 12px 16px;
  padding-bottom: 80px;
}

.post-item {
  margin-bottom: 12px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.post-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.post-author {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.post-time {
  font-size: 11px;
  color: #999999;
  margin-top: 2px;
}

.post-content {
  margin-bottom: 12px;
}

.post-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.post-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}

.post-images {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  position: relative;
}

.post-image {
  width: calc(33.33% - 4px);
  height: 90px;
  border-radius: 8px;
}

.more-images {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(33.33% - 4px);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
}

.post-footer {
  padding-top: 10px;
  border-top: 1px solid #F5F5F5;
}

.post-location {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
    font-size: 11px;
  }
}

.post-actions {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
    font-size: 14px;
  }
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
  padding: 6px 0;
  
  .info-label {
    width: 56px;
    font-size: 13px;
    color: #999999;
  }
  
  .info-value {
    font-size: 13px;
    color: #1A1A1A;
  }
  
  .van-icon {
    margin-right: 8px;
    font-size: 16px;
  }
}

.team-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
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

:deep(.van-fab__button) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  box-shadow: 0 4px 12px rgba(45, 90, 39, 0.3);
}
</style>
