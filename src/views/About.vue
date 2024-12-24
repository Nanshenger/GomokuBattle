<template>
    <div class="about-container">
        <NavBar></NavBar>
        <el-container>
            <el-aside width="240px" class="sidebar">
                <el-menu default-active="1">
                    <el-menu-item index="1">关于游戏</el-menu-item>
                    <el-menu-item index="2">游戏特色</el-menu-item>
                    <el-menu-item index="3">联系我们</el-menu-item>
                </el-menu>
            </el-aside>

            <el-main class="about-main">


                <div class="about-content">
                    <el-carousel interval="5000" arrow="always" height="350px" class="carousel">
                        <el-carousel-item>
                            <img src="../assets/1.png" alt="轮播图1">
                        </el-carousel-item>
                        <el-carousel-item>
                            <img src="../assets/2.png" alt="轮播图2">
                        </el-carousel-item>
                        <el-carousel-item>
                            <img src="../assets/3.png" alt="轮播图3">
                        </el-carousel-item>
                    </el-carousel>
                    <br><br>
                    <h2>关于五子棋</h2>
                    <p>
                        五子棋是一款经典的棋盘游戏，目标是先将自己的五个棋子连成一条直线（横、竖、斜均可）。本游戏通过实时对战模式，让玩家可以与世界各地的对手一决高下。
                    </p>

                    <h2>游戏特色</h2>
                    <ul>
                        <li>实时对战，随时与全球玩家对战</li>
                        <li>简洁直观的游戏界面，易于上手</li>
                        <li>支持创建房间和加入房间，方便多人互动</li>
                        <li>包含个人资料管理，玩家可以查看战绩</li>
                    </ul>

                    <h2>联系我们</h2>
                    <p>
                        如果你有任何问题，欢迎通过以下方式联系我们：<br>
                        邮箱: 123456789@QQ.com<br>
                        微信: 123456789
                    </p>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';

export default {
    components: {
        NavBar,
    },
}
</script>

<style scoped>
/* 移除浏览器默认的margin和padding，确保页面内容紧贴浏览器边缘 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: linear-gradient(to bottom, #e8f4ff, #d1e9fc);
    /* 应用你喜欢的渐变背景色 */
    font-family: 'Arial', sans-serif;
}

.about-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.sidebar {
    background: linear-gradient(to bottom, #ffffff, #f0f8ff);
    /* 轻柔渐变增强立体感 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 20px;
}

.sidebar .el-menu-item {
    font-size: 18px;
    font-weight: 500;
    padding: 12px 18px;
    transition: background-color 0.3s, transform 0.2s;
}

.sidebar .el-menu-item:hover {
    background-color: #cde4ff;
    /* 鼠标悬停的高亮效果 */
    border-radius: 6px;
    transform: scale(1.05);
    /* 鼠标悬停时稍微放大 */
}

.about-main {
    flex-grow: 1;
    margin-left: 3%;
    padding: 20px;
}

.carousel {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.el-carousel img {
    width: 100%;
    height: auto;
    border-radius: 12px;
}

.about-content {
    margin-top: 20px;
    background: linear-gradient(to bottom, #ffffff, #f9f9f9);
    /* 让内容块更显层次 */
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;

    margin: auto;
}

.about-content h2 {
    font-size: 26px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}

.about-content p {
    font-size: 16px;
    color: #555;
    line-height: 1.8;
    margin-bottom: 15px;
}

.about-content ul {
    list-style-type: disc;
    margin-left: 20px;
    padding-left: 20px;
    padding-top: 15px;
    padding-bottom: 15px;
}

.about-content li {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.about-content h2,
.about-content p,
.about-content ul {
    padding-left: 20px;
    padding-right: 20px;
}

.el-carousel {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    /* 为轮播图添加阴影 */
}
</style>
