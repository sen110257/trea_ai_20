import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import {
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Swipe,
  SwipeItem,
  Card,
  Grid,
  GridItem,
  Icon,
  Search,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Image as VanImage,
  Popup,
  Calendar,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Stepper,
  SubmitBar,
  Tag,
  Badge,
  ActionSheet,
  NoticeBar,
  Divider,
  Empty,
  PullRefresh,
  List,
  Form,
  Field,
  Dialog,
  Toast,
  Loading,
  Overlay,
  CountDown,
  Picker
} from 'vant'
import App from './App.vue'
import 'vant/lib/index.css'
import './styles/index.scss'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: { title: '首页', showTabbar: true }
  },
  {
    path: '/reserve',
    name: 'Reserve',
    component: () => import('./views/Reserve.vue'),
    meta: { title: '营地预约', showTabbar: true }
  },
  {
    path: '/reserve/zone/:id',
    name: 'ReserveZone',
    component: () => import('./views/ReserveZone.vue'),
    meta: { title: '分区详情', showTabbar: false }
  },
  {
    path: '/reserve/date/:zoneId',
    name: 'ReserveDate',
    component: () => import('./views/ReserveDate.vue'),
    meta: { title: '选择日期', showTabbar: false }
  },
  {
    path: '/reserve/package/:zoneId/:date',
    name: 'ReservePackage',
    component: () => import('./views/ReservePackage.vue'),
    meta: { title: '选择套餐', showTabbar: false }
  },
  {
    path: '/reserve/confirm',
    name: 'ReserveConfirm',
    component: () => import('./views/ReserveConfirm.vue'),
    meta: { title: '确认预约', showTabbar: false }
  },
  {
    path: '/reserve/detail/:id',
    name: 'ReserveDetail',
    component: () => import('./views/ReserveDetail.vue'),
    meta: { title: '预约详情', showTabbar: false }
  },
  {
    path: '/panorama/:id',
    name: 'Panorama',
    component: () => import('./views/Panorama.vue'),
    meta: { title: '3D全景', showTabbar: false }
  },
  {
    path: '/circle',
    name: 'Circle',
    component: () => import('./views/Circle.vue'),
    meta: { title: '结伴圈子', showTabbar: true }
  },
  {
    path: '/circle/team',
    name: 'CircleTeam',
    component: () => import('./views/CircleTeam.vue'),
    meta: { title: '车友组队', showTabbar: false }
  },
  {
    path: '/circle/team/detail/:id',
    name: 'CircleTeamDetail',
    component: () => import('./views/CircleTeamDetail.vue'),
    meta: { title: '组队详情', showTabbar: false }
  },
  {
    path: '/circle/team/publish',
    name: 'CircleTeamPublish',
    component: () => import('./views/CircleTeamPublish.vue'),
    meta: { title: '发布组队', showTabbar: false }
  },
  {
    path: '/circle/post/detail/:id',
    name: 'CirclePostDetail',
    component: () => import('./views/CirclePostDetail.vue'),
    meta: { title: '动态详情', showTabbar: false }
  },
  {
    path: '/circle/post/publish',
    name: 'CirclePostPublish',
    component: () => import('./views/CirclePostPublish.vue'),
    meta: { title: '发布动态', showTabbar: false }
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: () => import('./views/Equipment.vue'),
    meta: { title: '装备推荐', showTabbar: true }
  },
  {
    path: '/equipment/detail/:id',
    name: 'EquipmentDetail',
    component: () => import('./views/EquipmentDetail.vue'),
    meta: { title: '装备详情', showTabbar: false }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('./views/User.vue'),
    meta: { title: '个人中心', showTabbar: true }
  },
  {
    path: '/user/login',
    name: 'Login',
    component: () => import('./views/Login.vue'),
    meta: { title: '登录', showTabbar: false }
  },
  {
    path: '/user/register',
    name: 'Register',
    component: () => import('./views/Register.vue'),
    meta: { title: '注册', showTabbar: false }
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('./views/UserProfile.vue'),
    meta: { title: '编辑资料', showTabbar: false }
  },
  {
    path: '/user/orders',
    name: 'UserOrders',
    component: () => import('./views/UserOrders.vue'),
    meta: { title: '我的预约', showTabbar: false }
  },
  {
    path: '/user/teams',
    name: 'UserTeams',
    component: () => import('./views/UserTeams.vue'),
    meta: { title: '我的组队', showTabbar: false }
  },
  {
    path: '/user/posts',
    name: 'UserPosts',
    component: () => import('./views/UserPosts.vue'),
    meta: { title: '我的动态', showTabbar: false }
  },
  {
    path: '/user/favorites',
    name: 'UserFavorites',
    component: () => import('./views/UserFavorites.vue'),
    meta: { title: '我的收藏', showTabbar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '山野营地'
  next()
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Button)
app.use(Tabbar)
app.use(TabbarItem)
app.use(NavBar)
app.use(Swipe)
app.use(SwipeItem)
app.use(Card)
app.use(Grid)
app.use(GridItem)
app.use(Icon)
app.use(Search)
app.use(Tab)
app.use(Tabs)
app.use(Cell)
app.use(CellGroup)
app.use(VanImage)
app.use(Popup)
app.use(Calendar)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(Radio)
app.use(RadioGroup)
app.use(Stepper)
app.use(SubmitBar)
app.use(Tag)
app.use(Badge)
app.use(ActionSheet)
app.use(NoticeBar)
app.use(Divider)
app.use(Empty)
app.use(PullRefresh)
app.use(List)
app.use(Form)
app.use(Field)
app.use(Dialog)
app.use(Toast)
app.use(Loading)
app.use(Overlay)
app.use(CountDown)
app.use(Picker)

app.mount('#app')
