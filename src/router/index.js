import { createRouter, createWebHistory } from 'vue-router';
import Game from '../views/Game.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // 引入注册页面
import RoomSelection from '../views/RoomSelection.vue'; // 引入注册页面
import Profile from '@/views/Profile.vue';

const routes = [

  {
    path: '/', // 游戏主页面
    name: 'Game',
    component: Game,
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
    name: 'roomselection',
    component: RoomSelection,
  },
  {
    path: '/profile', // 个人资料页面
    name: 'profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
