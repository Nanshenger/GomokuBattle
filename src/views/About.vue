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
                <el-carousel interval="5000" arrow="always" height="350px" class="carousel">
                    <el-carousel-item>
                        <img src="https://via.placeholder.com/800x350?text=五子棋游戏" alt="轮播图1">
                    </el-carousel-item>
                    <el-carousel-item>
                        <img src="https://via.placeholder.com/800x350?text=游戏特色" alt="轮播图2">
                    </el-carousel-item>
                    <el-carousel-item>
                        <img src="https://via.placeholder.com/800x350?text=开始游戏" alt="轮播图3">
                    </el-carousel-item>
                </el-carousel>

                <div class="about-content">
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
                        邮箱: support@wzqgame.com<br>
                        微信: wzq_game
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
    background: linear-gradient(to right, #f8f9fa, #e9ecef);
}

.about-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.sidebar {
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.about-main {
    flex-grow: 1;
    margin-left: 3%;
    padding: 20px;
}

.carousel {
    width: 89%;
}

.el-carousel img {
    width: 100%;
    height: auto;
    border-radius: 10px;
}

.about-content {
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 10px;
    max-width: 1000px;
    margin: 2%;
}

.about-content h2,
.about-content p,
.about-content ul {
    padding-left: 20px;
    padding-right: 20px;
}

.about-content p {
    padding-top: 10px;
    padding-bottom: 10px;
}

.about-content ul {
    padding-top: 15px;
    padding-bottom: 15px;
}

.about-content li {
    padding-left: 20px;
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
}

.about-content ul {
    list-style-type: disc;
    margin-left: 20px;
}

.about-content li {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.sidebar .el-menu-item {
    font-size: 18px;
    font-weight: 500;
    padding: 10px 15px;
}

.sidebar .el-menu-item:hover {
    background-color: #f4f4f4;
    border-radius: 4px;
}

.el-carousel {
    border-radius: 10px;
    overflow: hidden;
}
</style>
