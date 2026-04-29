<template>
  <div class="my-posts-page page-container">
    <van-nav-bar
      title="我的动态"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="posts-content">
      <van-tabs v-model:active="activeTab" color="#2D5A27">
        <van-tab title="全部">
          <div class="post-list">
            <div
              v-for="post in allPosts"
              :key="post.id"
              class="post-item card"
              @click="goToDetail(post.id)"
            >
              <div class="post-header flex-between">
                <div class="post-info">
                  <div class="post-title">{{ post.title }}</div>
                  <div class="post-time">{{ post.createTime }}</div>
                </div>
                <van-tag :type="getStatusType(post.status)">
                  {{ getStatusText(post.status) }}
                </van-tag>
              </div>
              
              <div class="post-content text-ellipsis-2">
                {{ post.content }}
              </div>
              
              <div v-if="post.images && post.images.length > 0" class="post-images">
                <van-image
                  v-for="(img, index) in post.images.slice(0, 3)"
                  :key="index"
                  :src="img"
                  fit="cover"
                  class="post-image"
                />
              </div>
              
              <div class="post-footer flex-between">
                <div class="post-stats">
                  <span class="stat-item">
                    <van-icon name="star-o" color="#999999" size="12" />
                    {{ post.likes }}
                  </span>
                  <span class="stat-item">
                    <van-icon name="comment-o" color="#999999" size="12" />
                    {{ post.comments }}
                  </span>
                </div>
                <div class="post-actions">
                  <van-button type="default" size="small" plain @click.stop="editPost(post)">
                    编辑
                  </van-button>
                  <van-button type="danger" size="small" plain @click.stop="deletePost(post)">
                    删除
                  </van-button>
                </div>
              </div>
            </div>
          </div>
          
          <van-empty description="暂无动态" v-if="allPosts.length === 0" />
        </van-tab>
        
        <van-tab title="已发布">
          <div class="post-list">
            <div
              v-for="post in publishedPosts"
              :key="post.id"
              class="post-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无已发布动态" v-if="publishedPosts.length === 0" />
        </van-tab>
        
        <van-tab title="草稿">
          <div class="post-list">
            <div
              v-for="post in draftPosts"
              :key="post.id"
              class="post-item card"
            >
              <!-- 相同内容省略 -->
            </div>
          </div>
          <van-empty description="暂无草稿" v-if="draftPosts.length === 0" />
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

const myPosts = ref([
  {
    id: 101,
    title: '周末临安露营体验分享',
    content: '第一次来这个营地，环境真的太美了！早上起来被鸟鸣声叫醒，呼吸着新鲜的空气...',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20morning%20campsite%20with%20tent%20and%20sunrise&image_size=square'
    ],
    location: '临安绿野营地',
    tags: ['露营体验', '临安'],
    likes: 128,
    comments: 24,
    status: 'published',
    createTime: '2024-05-15 20:30'
  },
  {
    id: 102,
    title: '带娃露营的一些小技巧',
    content: '作为一个经常带娃露营的妈妈，分享一些经验...',
    images: [],
    location: '家中',
    tags: ['亲子露营', '攻略'],
    likes: 256,
    comments: 42,
    status: 'published',
    createTime: '2024-05-10 15:20'
  },
  {
    id: 103,
    title: '发现一个小众露营地（草稿）',
    content: '周末发现了一个非常棒的小众露营地，人少景美，还没有被开发...',
    images: [],
    location: '未知',
    tags: ['小众推荐'],
    likes: 0,
    comments: 0,
    status: 'draft',
    createTime: '2024-05-08 10:15'
  }
])

const allPosts = computed(() => myPosts.value)
const publishedPosts = computed(() => myPosts.value.filter(p => p.status === 'published'))
const draftPosts = computed(() => myPosts.value.filter(p => p.status === 'draft'))

function getStatusType(status) {
  const typeMap = {
    published: 'primary',
    draft: 'warning'
  }
  return typeMap[status] || 'default'
}

function getStatusText(status) {
  const textMap = {
    published: '已发布',
    draft: '草稿'
  }
  return textMap[status] || '未知'
}

function goToDetail(postId) {
  router.push(`/circle/post/detail/${postId}`)
}

function editPost(post) {
  showToast('编辑功能开发中')
}

async function deletePost(post) {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要删除这条动态吗？'
    })
    
    const index = myPosts.value.findIndex(p => p.id === post.id)
    if (index > -1) {
      myPosts.value.splice(index, 1)
    }
    showToast('删除成功')
  } catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.my-posts-page {
  background: #FAF8F5;
  min-height: 100vh;
}

:deep(.van-tabs__line) {
  background: #2D5A27;
}

:deep(.van-tab--active) {
  color: #2D5A27;
}

.posts-content {
  padding-bottom: 20px;
}

.post-list {
  padding: 12px;
}

.post-item {
  margin-bottom: 12px;
}

.post-header {
  margin-bottom: 10px;
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-time {
  font-size: 11px;
  color: #999999;
}

.post-content {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.post-images {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.post-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.post-footer {
  padding-top: 10px;
  border-top: 1px solid #F5F5F5;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999999;
  
  .van-icon {
    margin-right: 4px;
  }
}

.post-actions {
  display: flex;
  gap: 8px;
}

:deep(.van-button--danger) {
  border-color: #E64340;
  color: #E64340;
}
</style>
