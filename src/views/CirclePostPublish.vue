<template>
  <div class="publish-post-page page-container">
    <van-nav-bar
      title="发布动态"
      left-arrow
      @click-left="$router.back()"
      right-text="发布"
      @click-right="publishPost"
    />
    
    <div class="publish-content">
      <van-form @submit="onSubmit">
        <div class="form-card card">
          <van-field
            v-model="form.title"
            name="title"
            label="标题"
            placeholder="请输入标题"
            :rules="[{ required: true, message: '请输入标题' }]"
          />
          
          <van-field
            v-model="form.content"
            name="content"
            label="内容"
            type="textarea"
            placeholder="分享你的露营体验..."
            :maxlength="500"
            show-word-limit
            autosize
            :rules="[{ required: true, message: '请输入内容' }]"
          />
          
          <van-field
            v-model="form.location"
            name="location"
            label="位置"
            placeholder="添加位置"
            is-link
            readonly
            @click="showLocationPopup = true"
          />
          
          <div class="upload-section">
            <div class="section-label">添加图片/视频</div>
            <div class="upload-grid">
              <div
                v-for="(image, index) in uploadedImages"
                :key="index"
                class="upload-item"
              >
                <van-image :src="image" fit="cover" class="upload-image" />
                <div class="delete-btn" @click="deleteImage(index)">
                  <van-icon name="cross" size="12" />
                </div>
              </div>
              <div class="upload-item upload-trigger" @click="uploadImage" v-if="uploadedImages.length < 9">
                <van-icon name="plus" size="24" color="#CCCCCC" />
                <span>添加图片</span>
              </div>
            </div>
            <div class="upload-tip">最多可上传9张图片</div>
          </div>
          
          <van-field
            v-model="tags"
            name="tags"
            label="标签"
            placeholder="选择或输入标签"
            readonly
            @click="showTagPopup = true"
          />
          
          <div class="tag-preview" v-if="selectedTags.length > 0">
            <van-tag
              v-for="(tag, index) in selectedTags"
              :key="index"
              type="primary"
              plain
              closeable
              @close="removeTag(index)"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>
        
        <div class="submit-section">
          <van-button type="primary" round block native-type="submit" :loading="loading">
            发布动态
          </van-button>
        </div>
      </van-form>
    </div>
    
    <van-popup
      v-model:show="showLocationPopup"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="location-popup">
        <div class="popup-header flex-between">
          <span class="popup-title">选择位置</span>
          <van-icon name="cross" @click="showLocationPopup = false" />
        </div>
        
        <van-search
          v-model="locationSearch"
          placeholder="搜索位置"
          shape="round"
          class="location-search"
        />
        
        <div class="location-list">
          <div
            v-for="location in filteredLocations"
            :key="location"
            class="location-item"
            @click="selectLocation(location)"
          >
            <van-icon name="location-o" color="#2D5A27" />
            <div class="location-info">
              <div class="location-name">{{ location }}</div>
              <div class="location-desc">浙江省杭州市</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    
    <van-popup
      v-model:show="showTagPopup"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <div class="tag-popup">
        <div class="popup-header flex-between">
          <span class="popup-title">选择标签</span>
          <span class="confirm-text" @click="confirmTags">确定</span>
        </div>
        
        <div class="tag-section">
          <div class="section-label">推荐标签</div>
          <div class="tag-list">
            <van-tag
              v-for="tag in recommendedTags"
              :key="tag"
              :type="tempSelectedTags.includes(tag) ? 'primary' : 'default'"
              size="large"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCircleStore, useUserStore } from '@/stores'
import { showToast } from 'vant'

const router = useRouter()
const circleStore = useCircleStore()
const userStore = useUserStore()

const loading = ref(false)
const showLocationPopup = ref(false)
const showTagPopup = ref(false)
const locationSearch = ref('')
const customTag = ref('')

const form = ref({
  title: '',
  content: '',
  location: ''
})

const tags = ref('')
const selectedTags = ref([])
const tempSelectedTags = ref([])
const uploadedImages = ref([])

const recommendedTags = ['露营体验', '风景美照', '装备分享', '美食分享', '亲子露营', '星空露营', '日出日落', '钓鱼', '徒步', '篝火晚会']

const locations = [
  '绿野仙踪营地',
  '莫干山星空营地',
  '千岛湖露营基地',
  '安吉竹海营地',
  '太湖湾露营谷',
  '天目湖营地',
  '桐庐小众营地',
  '临安山野营地'
]

const filteredLocations = computed(() => {
  if (!locationSearch.value) {
    return locations
  }
  return locations.filter(loc => loc.includes(locationSearch.value))
})

function uploadImage() {
  if (uploadedImages.value.length >= 9) {
    showToast('最多上传9张图片')
    return
  }
  
  const randomImages = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20camping%20scene%20with%20tent%20and%20forest%20sunset&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campfire%20at%20night%20with%20friends%20camping&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=morning%20campsite%20with%20mist%20and%20mountains&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lake%20camping%20with%20reflection%20in%20water&image_size=square'
  ]
  
  const randomIndex = Math.floor(Math.random() * randomImages.length)
  uploadedImages.value.push(randomImages[randomIndex])
  showToast('图片添加成功')
}

function deleteImage(index) {
  uploadedImages.value.splice(index, 1)
}

function selectLocation(location) {
  form.value.location = location
  showLocationPopup.value = false
}

function toggleTag(tag) {
  const index = tempSelectedTags.value.indexOf(tag)
  if (index > -1) {
    tempSelectedTags.value.splice(index, 1)
  } else {
    tempSelectedTags.value.push(tag)
  }
}

function removeTag(index) {
  selectedTags.value.splice(index, 1)
  tags.value = selectedTags.value.join(', ')
}

function confirmTags() {
  selectedTags.value = [...tempSelectedTags.value]
  tags.value = selectedTags.value.join(', ')
  showTagPopup.value = false
}

function publishPost() {
  if (!form.value.title) {
    showToast('请输入标题')
    return
  }
  if (!form.value.content) {
    showToast('请输入内容')
    return
  }
  
  onSubmit(form.value)
}

function onSubmit(values) {
  loading.value = true
  
  setTimeout(() => {
    loading.value = false
    
    const post = {
      title: values.title,
      author: {
        id: userStore.user?.id || 1,
        name: userStore.user?.username || '露营爱好者',
        avatar: userStore.user?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20camping%20enthusiast%20male%20avatar%20portrait&image_size=square'
      },
      content: values.content,
      images: uploadedImages.value,
      location: values.location || '未知位置',
      tags: selectedTags.value
    }
    
    circleStore.addPost(post)
    showToast('发布成功')
    router.back()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.publish-post-page {
  background: #FAF8F5;
  min-height: 100vh;
}

.publish-content {
  padding: 12px;
  padding-bottom: 30px;
}

.form-card {
  margin-bottom: 20px;
  
  :deep(.van-field__label) {
    width: 70px;
    font-size: 14px;
    color: #1A1A1A;
  }
}

.upload-section {
  padding: 12px 16px;
}

.section-label {
  font-size: 14px;
  color: #1A1A1A;
  margin-bottom: 12px;
  font-weight: 500;
}

.upload-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.upload-item {
  width: calc(33.33% - 6px);
  aspect-ratio: 1;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.upload-image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
}

.upload-trigger {
  border: 1px dashed #E8E4DF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FAFAFA;
  
  span {
    font-size: 12px;
    color: #999999;
    margin-top: 4px;
  }
}

.upload-tip {
  font-size: 11px;
  color: #999999;
  margin-top: 8px;
}

.tag-preview {
  padding: 0 16px 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.submit-section {
  padding: 0 4px 20px;
}

.location-popup,
.tag-popup {
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

.confirm-text {
  font-size: 14px;
  color: #2D5A27;
  font-weight: 500;
}

.location-search {
  padding: 12px 16px;
  
  :deep(.van-search__content) {
    background: #F5F5F5;
  }
}

.location-list {
  flex: 1;
  overflow-y: auto;
}

.location-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #F5F5F5;
  
  .van-icon {
    margin-right: 12px;
    font-size: 20px;
  }
}

.location-name {
  font-size: 14px;
  color: #1A1A1A;
}

.location-desc {
  font-size: 12px;
  color: #999999;
  margin-top: 2px;
}

.tag-section {
  padding: 16px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
  height: 44px;
  font-size: 15px;
}

:deep(.van-tag--primary:not(.van-tag--plain)) {
  background: linear-gradient(135deg, #2D5A27 0%, #4A7C43 100%);
  border: none;
}
</style>
