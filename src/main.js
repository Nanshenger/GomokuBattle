import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// 导入 Element Plus 和样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

// 使用 Element Plus 和路由
app.use(router);
app.use(ElementPlus);

app.mount('#app');
