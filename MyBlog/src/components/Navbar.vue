<template>
  <nav class="sidebar">
    <!-- Router-link cho logo, hoạt động như một liên kết thương hiệu -->
    <router-link to="/" class="navbar-brand-logo">
      <!-- Nguồn ảnh động cho logo với xử lý lỗi -->
      <img :src="innovatevietLogo" alt="Logo INNOVATEVIET" class="innovateviet-logo" onerror="this.onerror=null;this.src='https://placehold.co/200x50/D3D3D3/FFFFFF?text=Lỗi+Logo';">
    </router-link>

    <!-- Khu vực có thể cuộn cho các mục menu, cho phép nội dung mở rộng -->
    <div class="sidebar-menu-scrollable-area">
      <ul class="nav-links">
        <li class="nav-item">
          <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }"><i class="fas fa-home"></i> Trang chủ </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/blogs" class="nav-link" :class="{ active: route.path.startsWith('/blogs') && !route.path.startsWith('/blog/') }"><i class="fas fa-pencil-alt"></i> Bài viết </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link" :class="{ active: route.path.startsWith('/profile') }"><i class="fas fa-user"></i> Hồ sơ </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link" :class="{ active: route.path.startsWith('/dashboard') }"><i class="fas fa-chart-bar"></i> Dashboard </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/settings" class="nav-link" :class="{ active: route.path.startsWith('/settings') }"><i class="fas fa-cog"></i> Cài đặt </router-link>
        </li>
        <li class="nav-item">
          <!-- Mục "Sáng lập" mới -->
          <router-link to="/founding" class="nav-link" :class="{ active: route.path.startsWith('/founding') }">
            <i class="fas fa-users"></i> Sáng lập
          </router-link>
        </li>

        <li class="nav-item">
          <div class="accordion" id="sidebarAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCreate" :class="{ 'active-accordion-button': isCreatePathActive }">
                  <i class="fas fa-plus-circle"></i> Tạo mới
                </button>
              </h2>
              <div id="collapseCreate" class="accordion-collapse collapse" data-bs-parent="#sidebarAccordion" :class="{ 'show': isCreatePathActive }">
                <div class="accordion-body">
                  <ul class="sub-nav-links">
                    <li class="nav-item">
                      <router-link to="/create/post" class="nav-link" :class="{ active: route.path === '/create/post' }">Bài viết</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/create/video" class="nav-link" :class="{ active: route.path === '/create/video' }">Video</router-link>
                    </li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Kết thúc wrapper các mục menu có thể cuộn -->

    <!-- Nút Đăng nhập/Đăng xuất được cố định ở cuối sidebar -->
    <div class="auth-button-fixed">
      <a v-if="!isAuthenticated" href="#" class="nav-link" @click.prevent="$emit('open-login-modal')">
        <i class="fas fa-lock"></i> Đăng nhập
      </a>
      <a v-else href="#" class="nav-link" @click.prevent="$emit('logout-requested')">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </a>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { isAuthenticated } from '../router/auth'; // Nhập trạng thái xác thực
import innovatevietLogo from '../assets/images/innovateviet_logo.png';

const route = useRoute();
const emit = defineEmits(['open-login-modal', 'logout-requested']);

const isCreatePathActive = computed(() => {
  return route.path.startsWith('/create/');
});
</script>

<style scoped>
/* Kiểu dáng sidebar chính */
.sidebar {
  position: fixed;
  top: 24px;
  left: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 260px;
  border-radius: 20px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #5c6bc0, #512da8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  box-shadow: 0 15px 35px rgba(81, 45, 168, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

/* Kiểu dáng logo */
.navbar-brand-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
  padding: 10px 0;
}

.innovateviet-logo {
  max-width: 200px;
  height: auto;
  max-height: 70px;
  filter: brightness(1.2);
  transition: transform 0.3s ease;
}

.innovateviet-logo:hover {
  transform: scale(1.05);
}

/* Khu vực menu có thể cuộn */
.sidebar-menu-scrollable-area {
  flex-grow: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  margin-bottom: 15px;
}

.nav-links {
  list-style: none; /* Xóa dấu đầu dòng */
  padding: 0; /* Xóa padding mặc định */
  margin: 0; /* Xóa margin mặc định */
}

/* Kiểu dáng liên kết điều hướng */
.nav-link {
  color: #ffffff; /* Đặt màu chữ mặc định */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  padding: 10px 16px;
  margin: 4px 0;
  font-weight: 500;
  position: relative;
  box-sizing: border-box;
  display: flex; /* Sử dụng flex để căn chỉnh biểu tượng và văn bản */
  align-items: center;
  text-decoration: none; /* Xóa gạch chân */
}

.nav-link i {
  margin-right: 10px; /* Khoảng cách giữa biểu tượng và văn bản */
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #512da8; /* Màu tối hơn khi di chuột */
}

.nav-link.active {
  background: #ffffff;
  color: #512da8; /* Màu trạng thái hoạt động */
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Kiểu dáng mục accordion */
.accordion-item {
  background: transparent;
  border: none;
  margin: 8px 0;
}

.accordion-header {
  margin-bottom: 0;
}

.accordion-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
  padding: 10px 16px;
  max-width: 100%;
  box-sizing: border-box;
  text-align: left; /* Đảm bảo văn bản căn trái */
  display: flex; /* Sử dụng flex để căn chỉnh biểu tượng và văn bản */
  align-items: center;
}

.accordion-button i {
  margin-right: 10px; /* Khoảng cách giữa biểu tượng và văn bản */
}

.accordion-button:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #512da8;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.accordion-button.active-accordion-button {
  background: #ffffff;
  color: #512da8;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.accordion-button:not(.collapsed) {
  background: #ffffff;
  color: #512da8;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.accordion-button::after {
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
}

.accordion-button:hover::after,
.accordion-button:not(.collapsed)::after {
  filter: brightness(0) invert(0.2) sepia(1) saturate(5) hue-rotate(240deg);
}

.accordion-collapse {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0 0 12px 12px;
  margin-top: -1px;
}

.accordion-body {
  padding: 8px 0 16px 0;
}

.sub-nav-links {
  list-style: none; /* Xóa dấu đầu dòng */
  padding: 0; /* Xóa padding mặc định */
  margin: 0; /* Xóa margin mặc định */
}

.accordion-body .nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  padding: 6px 20px;
  margin-left: 16px;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  max-width: calc(100% - 16px);
}

.accordion-body .nav-link:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #512da8;
  border-left-color: #512da8;
  transform: translateX(2px);
}

.accordion-body .nav-link.active {
  color: #512da8;
  background: #ffffff;
  border-left-color: #512da8;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Nút xác thực cố định ở cuối */
.auth-button-fixed {
  margin-top: auto;
  padding-top: 15px; /* Thêm padding phía trên nút */
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Tùy chọn: một đường phân cách tinh tế */
}

/* Điều chỉnh responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
