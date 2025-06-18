import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue'; // Import ref để tạo biến trạng thái phản ứng

// Import các component
import Home from '../views/Home.vue';
import BlogList from '../views/BlogList.vue';
import BlogPost from '../views/BlogPost.vue';
import VideoPost from '../views/VideoPost.vue';
import UserProfile from '../views/UserProfile.vue';
import Dashboard from '../views/Dashboard.vue';
import CreatePost from '../views/CreatePost.vue';
import CreateVid from '../views/CreateVid.vue';
import Settings from '../views/Settings.vue';
import FoundingTeam from '../views/FoundingTeam.vue'; // <-- Import component FoundingTeam mới

// showLoginModalFromRouter được định nghĩa và export TẠI ĐÂY
export const showLoginModalFromRouter = ref(false); 

// Đảm bảo chỉ import isAuthenticated từ auth.js
import { isAuthenticated } from './auth'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: BlogList
  },
  {
    path: '/blog/:id',
    name: 'BlogPostDetail',
    component: BlogPost
  },
  {
    path: '/video/:id',
    name: 'VideoDetail',
    component: VideoPost
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    meta: { requiresAuth: true } // Yêu cầu xác thực để truy cập
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Yêu cầu xác thực để truy cập
  },
  {
    path: '/create/post',
    name: 'CreatePost',
    component: CreatePost,
    meta: { requiresAuth: true } // Yêu cầu xác thực để truy cập
  },
  {
    path: '/create/video',
    name: 'CreateVideo',
    component: CreateVid,
    meta: { requiresAuth: true } // Yêu cầu xác thực để truy cập
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true } // Yêu cầu xác thực để truy cập
  },
  {
    path: '/founding', // <-- Thêm route mới cho trang Sáng lập
    name: 'FoundingTeam',
    component: FoundingTeam,
    meta: { requiresAuth: false } // Trang sáng lập không yêu cầu xác thực
  },
  {
    path: '/login',
    name: 'LoginModalRoute',
    redirect: { name: 'Home' },
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard để kiểm tra trạng thái xác thực trước mỗi tuyến đường
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    console.log(`[Router Guard] Tuyến đường "${to.path}" yêu cầu xác thực. Người dùng chưa đăng nhập.`);
    showLoginModalFromRouter.value = true;
    next({ name: 'Home', query: { redirect: to.fullPath } });
  } else if (to.name === 'LoginModalRoute' && isAuthenticated.value) {
    next({ name: 'Dashboard' });
  } else {
    console.log(`[Router Guard] Cho phép truy cập "${to.path}".`);
    showLoginModalFromRouter.value = false;
    next();
  }
});

export default router;
