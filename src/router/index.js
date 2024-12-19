import { createRouter, createWebHistory } from 'vue-router';
import Game from '../views/Game.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import RoomSelection from '../views/RoomSelection.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  {
    path: '/',  // 根路径
    redirect: '/login',  // 重定向到登录页
  },
  {
    path: '/game', // 游戏主页面
    name: 'Game',
    component: Game,
    meta: { requiresAuth: true },  // 需要登录才能访问
  },
  {
    path: '/login', // 登录页面
    name: 'Login',
    component: Login,
  },
  {
    path: '/register', // 注册页面
    name: 'Register',
    component: Register,
  },
  {
    path: '/roomselection', // 房间选择页面
    name: 'RoomSelection',
    component: RoomSelection,
    meta: { requiresAuth: true },  // 需要登录才能访问
  },
  {
    path: '/profile', // 个人资料页面
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },  // 需要登录才能访问
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
  const username = localStorage.getItem("username"); // 获取登录信息
  const isLoginPage = to.name === 'Login' || to.name === 'Register'; // 是否是登录或注册页面

  // 如果路由需要登录权限且用户未登录
  if (to.meta.requiresAuth && !username) {
    next('/login'); // 未登录，跳转到登录页
  } else if (!isLoginPage && !username) {
    // 如果未登录且用户访问的是其他页面，跳转到登录页
    next('/login');
  } else {
    // 已登录或者访问的是登录/注册页面
    next();
  }
});

export default router;
