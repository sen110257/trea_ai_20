import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  campData,
  zones,
  packages,
  addOns,
  teams,
  posts,
  equipments,
  equipmentCategories,
  orders,
  userInfo
} from '@/data'

export const useCampStore = defineStore('camp', () => {
  const camp = ref(campData)
  const zoneList = ref(zones)
  const packageList = ref(packages)
  const addOnList = ref(addOns)
  
  const currentZone = ref(null)
  const selectedDate = ref('')
  const selectedPackage = ref(null)
  const selectedAddOns = ref([])
  const peopleCount = ref(2)
  
  const totalPrice = computed(() => {
    let price = 0
    if (selectedPackage.value) {
      price += selectedPackage.value.price * peopleCount.value
    }
    selectedAddOns.value.forEach(item => {
      price += item.price * item.count
    })
    return price
  })
  
  function setCurrentZone(zone) {
    currentZone.value = zone
  }
  
  function setSelectedDate(date) {
    selectedDate.value = date
  }
  
  function setSelectedPackage(pkg) {
    selectedPackage.value = pkg
  }
  
  function toggleAddOn(addOn) {
    const index = selectedAddOns.value.findIndex(item => item.id === addOn.id)
    if (index > -1) {
      selectedAddOns.value.splice(index, 1)
    } else {
      selectedAddOns.value.push({ ...addOn, count: 1 })
    }
  }
  
  function updateAddOnCount(addOnId, count) {
    const item = selectedAddOns.value.find(item => item.id === addOnId)
    if (item) {
      item.count = count
    }
  }
  
  function setPeopleCount(count) {
    peopleCount.value = count
  }
  
  function resetSelection() {
    currentZone.value = null
    selectedDate.value = ''
    selectedPackage.value = null
    selectedAddOns.value = []
    peopleCount.value = 2
  }
  
  return {
    camp,
    zoneList,
    packageList,
    addOnList,
    currentZone,
    selectedDate,
    selectedPackage,
    selectedAddOns,
    peopleCount,
    totalPrice,
    setCurrentZone,
    setSelectedDate,
    setSelectedPackage,
    toggleAddOn,
    updateAddOnCount,
    setPeopleCount,
    resetSelection
  }
})

export const useCircleStore = defineStore('circle', () => {
  const teamList = ref([...teams])
  const postList = ref([...posts])
  
  function addTeam(team) {
    teamList.value.unshift({
      ...team,
      id: Date.now(),
      currentMembers: 1,
      status: 'recruiting',
      createTime: new Date().toLocaleString(),
      comments: []
    })
  }
  
  function addPost(post) {
    postList.value.unshift({
      ...post,
      id: Date.now(),
      likes: 0,
      comments: 0,
      favorites: 0,
      createTime: new Date().toLocaleString(),
      commentList: []
    })
  }
  
  function likePost(postId) {
    const post = postList.value.find(p => p.id === postId)
    if (post) {
      post.likes++
    }
  }
  
  function addTeamComment(teamId, comment) {
    const team = teamList.value.find(t => t.id === teamId)
    if (team) {
      team.comments.push({
        id: Date.now(),
        ...comment,
        time: new Date().toLocaleString()
      })
    }
  }
  
  function addPostComment(postId, comment) {
    const post = postList.value.find(p => p.id === postId)
    if (post) {
      post.commentList.unshift({
        id: Date.now(),
        ...comment,
        time: new Date().toLocaleString(),
        likes: 0
      })
      post.comments++
    }
  }
  
  return {
    teamList,
    postList,
    addTeam,
    addPost,
    likePost,
    addTeamComment,
    addPostComment
  }
})

export const useEquipmentStore = defineStore('equipment', () => {
  const equipmentList = ref([...equipments])
  const categories = ref(equipmentCategories)
  const currentCategory = ref('')
  const favoriteEquipmentIds = ref([])
  const cartItems = ref([])
  
  const filteredEquipments = computed(() => {
    if (!currentCategory.value) {
      return equipmentList.value
    }
    return equipmentList.value.filter(eq => eq.category === currentCategory.value)
  })
  
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.count, 0)
  })
  
  const cartTotalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.count, 0)
  })
  
  function setCategory(category) {
    currentCategory.value = category
  }
  
  function toggleFavorite(equipmentId) {
    const index = favoriteEquipmentIds.value.indexOf(equipmentId)
    if (index > -1) {
      favoriteEquipmentIds.value.splice(index, 1)
    } else {
      favoriteEquipmentIds.value.push(equipmentId)
    }
  }
  
  function isFavorite(equipmentId) {
    return favoriteEquipmentIds.value.includes(equipmentId)
  }
  
  function addToCart(equipment, count = 1) {
    const existingItem = cartItems.value.find(item => item.id === equipment.id)
    if (existingItem) {
      existingItem.count += count
    } else {
      cartItems.value.push({
        ...equipment,
        count
      })
    }
  }
  
  function removeFromCart(equipmentId) {
    const index = cartItems.value.findIndex(item => item.id === equipmentId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
  }
  
  function updateCartCount(equipmentId, count) {
    const item = cartItems.value.find(item => item.id === equipmentId)
    if (item) {
      item.count = Math.max(1, count)
    }
  }
  
  function clearCart() {
    cartItems.value = []
  }
  
  return {
    equipmentList,
    categories,
    currentCategory,
    favoriteEquipmentIds,
    cartItems,
    filteredEquipments,
    cartCount,
    cartTotalPrice,
    setCategory,
    toggleFavorite,
    isFavorite,
    addToCart,
    removeFromCart,
    updateCartCount,
    clearCart
  }
})

export const useUserStore = defineStore('user', () => {
  const user = ref({ ...userInfo })
  const isLoggedIn = ref(true)
  const orderList = ref([...orders])
  const myTeams = ref([])
  const myPosts = ref([])
  const favoriteCamps = ref([])
  const favoriteEquipments = ref([])
  
  function login(username, password) {
    isLoggedIn.value = true
    user.value = {
      ...userInfo,
      username
    }
    return true
  }
  
  function register(username, phone, password) {
    isLoggedIn.value = true
    user.value = {
      ...userInfo,
      username,
      phone
    }
    return true
  }
  
  function logout() {
    isLoggedIn.value = false
    user.value = null
  }
  
  function updateProfile(data) {
    user.value = {
      ...user.value,
      ...data
    }
  }
  
  function addOrder(order) {
    orderList.value.unshift({
      ...order,
      id: 'ORD' + Date.now(),
      status: 'pending',
      createTime: new Date().toLocaleString()
    })
  }
  
  function toggleCampFavorite(campId) {
    const index = favoriteCamps.value.indexOf(campId)
    if (index > -1) {
      favoriteCamps.value.splice(index, 1)
    } else {
      favoriteCamps.value.push(campId)
    }
  }
  
  function toggleEquipmentFavorite(equipmentId) {
    const index = favoriteEquipments.value.indexOf(equipmentId)
    if (index > -1) {
      favoriteEquipments.value.splice(index, 1)
    } else {
      favoriteEquipments.value.push(equipmentId)
    }
  }
  
  return {
    user,
    isLoggedIn,
    orderList,
    myTeams,
    myPosts,
    favoriteCamps,
    favoriteEquipments,
    login,
    register,
    logout,
    updateProfile,
    addOrder,
    toggleCampFavorite,
    toggleEquipmentFavorite
  }
})
