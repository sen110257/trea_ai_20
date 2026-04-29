<template>
  <div class="post-detail-page page-container">
    <van-nav-bar
      title="动态详情"
      left-arrow
      @click-left="$router.back()"
      right-text="分享"
    />
    
    <div v-if="post" class="detail-content">
      <div class="post-header card">
        <van-image :src="post.author.avatar" round class="post-avatar" />
        <div class="post-author">
          <div class="author-name">{{ post.author.name }}</div>
          <div class="post-time">{{ post.createTime }}</div>
        </div>
        <van-button type="primary" size="small" round plain>
          关注
        </van-button>
      </div>
      
      <div class="post-content card">
        <div class="post-title">{{ post.title }}</div>
        <div class="post-text">{{ post.content }}</div>
        
        <div v-if="post.images && post.images.length > 0" class="post-images">
          <van-image
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            fit="cover"
            class="post-image"
            :class="{ 'single-image': post.images.length === 1 }"
          />
        </div>
        
        <div class="post-location">
          <van-icon name="location-o" color="#999999" />
          <span>{{ post.location }}</span>
        </div>
        
        <div class="post-tags">
          <van-tag v-for="tag in post.tags" :key="tag" type="primary" plain size="small">
            #{{ tag }}
          </van-tag>
        </div>
        
        <div class="post-stats flex-between">
          <div class="stats-item">
            <van-icon name="star-o" color="#999999" />
            <span>{{ post.likes }}</span>
          </div>
          <div class="stats-item">
            <van-icon name="comment-o" color="#999999" />
            <span>{{ post.comments }} 评论</span>
          </div>
          <div class="stats-item">
            <van-icon name="bookmark-o" color="#999999" />
            <span>{{ post.favorites }}</span>
          </div>
        </div>
      </div>
      
      <div class="comments-section">
        <div class="section-title">评论 ({{ post.commentList.length }})</div>
        
        <div class="comment-list">
          <div
            v-for="comment in post.commentList"
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
              <div class="comment-actions">
                <div class="action-item" @click="likeComment(comment)">
                  <van-icon name="like-o" color="#999999" />
                  <span>{{ comment.likes || 0 }}</span>
                </div>
                <div class="action-item">
                  <van-icon name="comment-o" color="#999999" />
                  <span>回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <van-empty description="暂无评论" v-if="post.commentList.length === 0" />
      </div>
    </div>
    
    <div class="bottom-bar">
      <van-field
        v-model="commentValue"
        placeholder="发表评论..."
        readonly
        @click="showCommentPopup = true"
      />
      <div class="action-buttons">
        <div class="action-btn" @click="toggleLike">
          <van-icon :name="isLiked ? 'star' : 'star-o'" :color="isLiked ? '#FFD700' : '#999999'" />
        </div>
        <div class="action-btn" @click="toggleFavorite">
          <van-icon :name="isFavorited ? 'bookmark' : 'bookmark-o'" :color="isFavorited ? '#2D5A27' : '#999999'" />
        </div>
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
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const circleStore = useCircleStore()
const userStore = useUserStore()

const post = ref(null)
const commentValue = ref('')
const newComment = ref('')
const showCommentPopup = ref(false)
const isLiked = ref(false)
const isFavorited = ref(false)

onMounted(() => {
  const postId = parseInt(route.params.id)
  const found = circleStore.postList.find(p => p.id === postId)
  if (found) {
    post.value = found
  }
})

function toggleLike() {
  if (post.value) {
    isLiked.value = !isLiked.value
    if (isLiked.value) {
      circleStore.likePost(post.value.id)
      showToast('点赞成功')
    }
  }
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
  showToast(isFavorited.value ? '已收藏' : '已取消收藏')
}

function likeComment(comment) {
  comment.likes = (comment.likes || 0) + 1
  showToast('点赞成功')
}

function submitComment() {
  if (!newComment.value.trim()) {
    showToast('请输入评论内容')
    return
  }
  
  if (post.value) {
    circleStore.addPostComment(post.value.id, {
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
.post-detail-page {
  background: #FAF8F5;
  min-height: 100vh;
  padding-bottom: 60px;
}

.detail-content {
  padding-bottom: 80px;
}

.post-header {
  display: flex;
  align-items: center;
  margin: 12px;
}

.post-avatar {
  width: 44px;
  height: 44px;
  margin-right: 12px;
}

.post-author {
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
}

.post-time {
  font-size: 11px;
  color: #999999;
  margin-top: 2px;
}

.post-content {
  margin: 12px;
}

.post-title {
  font-size: 17px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-text {
  font-size: 14px;
  color: #333333;
  line-height: 1.7;
  margin-bottom: 16px;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.post-image {
  width: calc(33.33% - 4px);
  height: 100px;
  border-radius: 8px;
  
  &.single-image {
    width: 100%;
    height: 200px;
  }
}

.post-location {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
  margin-bottom: 12px;
  
  .van-icon {
    margin-right: 4px;
  }
}

.post-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.post-stats {
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
}

.stats-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
  }
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
  margin-bottom: 8px;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
    font-size: 14px;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 10px 16px;
  padding-bottom: calc(10px + var(--safe-area-bottom));
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  
  :deep(.van-field) {
    flex: 1;
    background: #F5F5F5;
    border-radius: 20px;
    padding: 8px 16px;
  }
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  .van-icon {
    font-size: 22px;
  }
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
  min-height: 120px;
}

.popup-footer {
  padding: 16px;
  margin-top: auto;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
}
</style>
