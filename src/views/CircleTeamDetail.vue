<template>
  <div class="team-detail-page page-container">
    <van-nav-bar
      title="组队详情"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div v-if="team" class="detail-content">
      <div class="team-header card">
        <van-image :src="team.author.avatar" round class="team-avatar" />
        <div class="team-author">
          <div class="author-name">{{ team.author.name }}</div>
          <div class="publish-time">发布于 {{ team.createTime }}</div>
        </div>
        <van-tag :type="team.status === 'recruiting' ? 'primary' : 'default'" size="small">
          {{ team.status === 'recruiting' ? '招募中' : '已完成' }}
        </van-tag>
      </div>
      
      <div class="team-title card">
        <div class="title-text">{{ team.title }}</div>
        <div class="team-tags">
          <van-tag v-for="tag in team.tags" :key="tag" type="primary" plain>
            {{ tag }}
          </van-tag>
        </div>
      </div>
      
      <div class="team-info card">
        <div class="info-item">
          <div class="info-icon depart">
            <van-icon name="location-o" color="#FFFFFF" />
          </div>
          <div class="info-content">
            <div class="info-label">出发地</div>
            <div class="info-value">{{ team.departure }}</div>
          </div>
        </div>
        
        <div class="info-divider"></div>
        
        <div class="info-item">
          <div class="info-icon dest">
            <van-icon name="location" color="#FFFFFF" />
          </div>
          <div class="info-content">
            <div class="info-label">目的地</div>
            <div class="info-value">{{ team.destination }}</div>
          </div>
        </div>
        
        <div class="info-divider"></div>
        
        <div class="info-item">
          <div class="info-icon time">
            <van-icon name="clock-o" color="#FFFFFF" />
          </div>
          <div class="info-content">
            <div class="info-label">出发时间</div>
            <div class="info-value">{{ team.departTime }}</div>
          </div>
        </div>
      </div>
      
      <div class="team-desc card">
        <div class="card-title">招募说明</div>
        <div class="desc-text">{{ team.description }}</div>
      </div>
      
      <div class="team-members card">
        <div class="card-title flex-between">
          <span>已加入队员 ({{ team.currentMembers }}/{{ team.totalMembers }})</span>
          <span class="car-count">{{ team.carCount }} 辆车</span>
        </div>
        
        <div class="members-list">
          <div class="member-item" v-for="i in Math.min(team.currentMembers, 6)" :key="i">
            <van-image
              :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=random%20person%20avatar%20${i}&image_size=square`"
              round
              class="member-avatar"
            />
            <div class="member-name">队员{{ i }}</div>
          </div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(team.currentMembers / team.totalMembers) * 100}%` }"></div>
        </div>
        <div class="progress-text">
          还需 {{ team.totalMembers - team.currentMembers }} 人满员
        </div>
      </div>
      
      <div class="comments-section">
        <div class="section-title">评论互动 ({{ team.comments.length }})</div>
        
        <div class="comment-list">
          <div
            v-for="comment in team.comments"
            :key="comment.id"
            class="comment-item card"
          >
            <van-image :src="comment.avatar" round class="comment-avatar" />
            <div class="comment-content">
              <div class="comment-header flex-between">
                <span class="comment-author">{{ comment.userName }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
          </div>
        </div>
        
        <van-empty description="暂无评论" v-if="team.comments.length === 0" />
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="action-buttons">
        <van-button type="primary" round block @click="joinTeam">
          申请加入
        </van-button>
        <van-button type="warning" round block @click="showCommentPopup = true">
          评论
        </van-button>
      </div>
    </div>
    
    <van-popup
      v-model:show="showCommentPopup"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="comment-popup">
        <div class="popup-header flex-between">
          <span class="popup-title">发表评论</span>
          <van-icon name="cross" @click="showCommentPopup = false" />
        </div>
        
        <van-field
          v-model="newComment"
          type="textarea"
          placeholder="说点什么吧..."
          :maxlength="200"
          show-word-limit
          autosize
        />
        
        <div class="popup-footer">
          <van-button type="primary" round block @click="submitComment">
            发布
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCircleStore, useUserStore } from '@/stores'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const circleStore = useCircleStore()
const userStore = useUserStore()

const team = ref(null)
const newComment = ref('')
const showCommentPopup = ref(false)

onMounted(() => {
  const teamId = parseInt(route.params.id)
  const found = circleStore.teamList.find(t => t.id === teamId)
  if (found) {
    team.value = found
  }
})

async function joinTeam() {
  if (!team.value) return
  
  if (team.value.currentMembers >= team.value.totalMembers) {
    showToast('队伍已满')
    return
  }
  
  try {
    await showConfirmDialog({
      title: '确认加入',
      message: `确定要加入"${team.value.title}"这个队伍吗？`
    })
    team.value.currentMembers++
    showToast('已申请加入队伍')
  } catch {
    // 用户取消
  }
}

function submitComment() {
  if (!newComment.value.trim()) {
    showToast('请输入评论内容')
    return
  }
  
  if (team.value) {
    circleStore.addTeamComment(team.value.id, {
      userId: userStore.user?.id || 1,
      userName: userStore.user?.username || '露营爱好者',
      avatar: userStore.user?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20camping%20enthusiast%20male%20avatar%20portrait&image_size=square',
      content: newComment.value
    })
    showToast('评论成功')
    showCommentPopup.value = false
    newComment.value = ''
  }
}
</script>

<style lang="scss" scoped>
.team-detail-page {
  background: #FAF8F5;
  min-height: 100vh;
  padding-bottom: 80px;
}

.detail-content {
  padding-bottom: 100px;
}

.team-header {
  display: flex;
  align-items: center;
  margin: 12px;
}

.team-avatar {
  width: 44px;
  height: 44px;
  margin-right: 12px;
}

.team-author {
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
}

.publish-time {
  font-size: 11px;
  color: #999999;
  margin-top: 2px;
}

.team-title {
  margin: 12px;
}

.title-text {
  font-size: 17px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1.4;
  margin-bottom: 12px;
}

.team-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.team-info {
  margin: 12px;
  display: flex;
  align-items: center;
}

.info-item {
  flex: 1;
  display: flex;
  align-items: center;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
  
  &.depart {
    background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  }
  
  &.dest {
    background: linear-gradient(135deg, #D4A574 0%, #E8C9A8 100%);
  }
  
  &.time {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

.info-content {
  min-width: 0;
}

.info-label {
  font-size: 11px;
  color: #999999;
  margin-bottom: 2px;
}

.info-value {
  font-size: 13px;
  color: #1A1A1A;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-divider {
  width: 1px;
  height: 40px;
  background: #F0F0F0;
  margin: 0 12px;
}

.team-desc,
.team-members {
  margin: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 14px;
    background: linear-gradient(180deg, #2D5A27 0%, #4A7C43 100%);
    border-radius: 2px;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  .car-count {
    font-size: 12px;
    color: #999999;
    font-weight: normal;
  }
}

.desc-text {
  font-size: 13px;
  color: #666666;
  line-height: 1.6;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-avatar {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
}

.member-name {
  font-size: 11px;
  color: #666666;
}

.progress-bar {
  height: 6px;
  background: #F5F5F5;
  border-radius: 3px;
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2D5A27 0%, #4A7C43 100%);
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #999999;
  text-align: center;
}

.comments-section {
  padding: 0 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  display: flex;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  margin-right: 10px;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  margin-bottom: 6px;
}

.comment-author {
  font-size: 13px;
  font-weight: 500;
  color: #1A1A1A;
}

.comment-time {
  font-size: 11px;
  color: #999999;
}

.comment-text {
  font-size: 13px;
  color: #333333;
  line-height: 1.5;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 12px 16px;
  padding-bottom: calc(12px + var(--safe-area-bottom));
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}

.action-buttons {
  display: flex;
  gap: 12px;
  
  .van-button {
    flex: 1;
    height: 44px;
  }
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
}

:deep(.van-button--warning) {
  background: linear-gradient(135deg, #D4A574 0%, #E8C9A8 100%);
  border: none;
}

.comment-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

:deep(.van-field--textarea) {
  padding: 16px;
  min-height: 100px;
}

.popup-footer {
  padding: 16px;
  margin-top: auto;
}
</style>
