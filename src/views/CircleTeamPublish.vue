<template>
  <div class="publish-team-page page-container">
    <van-nav-bar
      title="发布组队"
      left-arrow
      @click-left="$router.back()"
      right-text="发布"
      @click-right="publishTeam"
    />
    
    <div class="publish-content">
      <van-form @submit="onSubmit">
        <div class="form-card card">
          <van-field
            v-model="form.title"
            name="title"
            label="招募标题"
            placeholder="请输入招募标题"
            :rules="[{ required: true, message: '请输入招募标题' }]"
          />
          
          <van-field
            v-model="form.departure"
            name="departure"
            label="出发地"
            placeholder="请输入出发地"
            :rules="[{ required: true, message: '请输入出发地' }]"
          />
          
          <van-field
            v-model="form.destination"
            name="destination"
            label="目的地"
            placeholder="请输入目的地"
            :rules="[{ required: true, message: '请输入目的地' }]"
          />
          
          <van-field
            v-model="form.departTime"
            name="departTime"
            label="出发时间"
            placeholder="请选择出发时间"
            is-link
            readonly
            @click="showTimePicker = true"
            :rules="[{ required: true, message: '请选择出发时间' }]"
          />
          
          <van-field
            v-model="form.totalMembers"
            name="totalMembers"
            label="招募人数"
            placeholder="请输入招募人数"
            type="number"
            :rules="[{ required: true, message: '请输入招募人数' }]"
          />
          
          <van-field
            v-model="form.carCount"
            name="carCount"
            label="已有车辆"
            placeholder="请输入已有车辆数"
            type="number"
          />
          
          <van-field
            v-model="form.description"
            name="description"
            label="招募说明"
            type="textarea"
            placeholder="请输入招募说明，介绍您的行程安排、注意事项等..."
            :maxlength="500"
            show-word-limit
            autosize
          />
          
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
            发布招募
          </van-button>
        </div>
      </van-form>
    </div>
    
    <van-datetime-picker
      v-model:show="showTimePicker"
      type="datetime"
      :min-date="minDate"
      :max-date="maxDate"
      title="选择出发时间"
      @confirm="onTimeConfirm"
      @cancel="showTimePicker = false"
    />
    
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
        
        <div class="tag-section">
          <div class="section-label">自定义标签</div>
          <van-field
            v-model="customTag"
            placeholder="输入自定义标签"
            @keyup.enter="addCustomTag"
          >
            <template #button>
              <van-button type="primary" size="small" @click="addCustomTag">
                添加
              </van-button>
            </template>
          </van-field>
        </div>
      </div>
    </van-popup>
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

const loading = ref(false)
const showTimePicker = ref(false)
const showTagPopup = ref(false)

const minDate = ref(new Date())
const maxDate = ref(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

const form = ref({
  title: '',
  departure: '',
  destination: '',
  departTime: '',
  totalMembers: '',
  carCount: 1,
  description: ''
})

const tags = ref('')
const selectedTags = ref([])
const tempSelectedTags = ref([])
const customTag = ref('')

const recommendedTags = ['自驾', '周末游', '小长假', '亲子游', '星空露营', '日出', '烧烤', '钓鱼', '摄影', '徒步']

function onTimeConfirm(value) {
  form.value.departTime = new Date(value).toLocaleString()
  showTimePicker.value = false
}

function toggleTag(tag) {
  const index = tempSelectedTags.value.indexOf(tag)
  if (index > -1) {
    tempSelectedTags.value.splice(index, 1)
  } else {
    tempSelectedTags.value.push(tag)
  }
}

function addCustomTag() {
  if (!customTag.value.trim()) {
    showToast('请输入标签内容')
    return
  }
  if (tempSelectedTags.value.includes(customTag.value.trim())) {
    showToast('标签已存在')
    return
  }
  tempSelectedTags.value.push(customTag.value.trim())
  customTag.value = ''
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

function publishTeam() {
  if (!form.value.title) {
    showToast('请输入招募标题')
    return
  }
  if (!form.value.departure) {
    showToast('请输入出发地')
    return
  }
  if (!form.value.destination) {
    showToast('请输入目的地')
    return
  }
  if (!form.value.departTime) {
    showToast('请选择出发时间')
    return
  }
  if (!form.value.totalMembers) {
    showToast('请输入招募人数')
    return
  }
  
  onSubmit(form.value)
}

function onSubmit(values) {
  loading.value = true
  
  setTimeout(() => {
    loading.value = false
    
    const team = {
      title: values.title,
      author: {
        id: userStore.user?.id || 1,
        name: userStore.user?.username || '露营爱好者',
        avatar: userStore.user?.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20camping%20enthusiast%20male%20avatar%20portrait&image_size=square'
      },
      departure: values.departure,
      destination: values.destination,
      departTime: values.departTime,
      totalMembers: parseInt(values.totalMembers),
      currentMembers: 1,
      carCount: parseInt(values.carCount) || 1,
      description: values.description,
      tags: selectedTags.value
    }
    
    circleStore.addTeam(team)
    showToast('发布成功')
    router.back()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.publish-team-page {
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
    width: 90px;
    font-size: 14px;
    color: #1A1A1A;
  }
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

.tag-section {
  padding: 16px;
  
  & + & {
    border-top: 1px solid #F0F0F0;
  }
}

.section-label {
  font-size: 14px;
  color: #999999;
  margin-bottom: 12px;
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

:deep(.van-tag--primary.van-tag--plain) {
  border-color: #2D5A27;
  color: #2D5A27;
  background: rgba(45, 90, 39, 0.05);
}
</style>
