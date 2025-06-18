<template>
  <div id="app" class="d-flex">
    <!-- Sử dụng component Navbar đã refactor -->
    <Navbar @open-login-modal="openLoginModal" @logout-requested="handleLogout" />

    <div class="flex-grow-1">
      <div class="container my-4">
        <router-view v-slot="{ Component }"><component :is="Component" @data-shared="handleSharedData" /></router-view>

        <div v-if="sharedData" class="alert alert-info mt-4">
          <strong>Dữ liệu từ component con:</strong> {{ sharedData }}
        </div>
      </div>
    </div>

    <!-- LoginModal vẫn nằm ở đây vì nó là một modal toàn cục -->
    <!-- Đã sửa đường dẫn import của LoginModal về vị trí gốc -->
    <LoginModal v-if="showLoginModalFromRouter || showLoginModalLocal" @close="handleCloseLoginModal" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
// Giữ nguyên đường dẫn import của LoginModal nếu file Login.vue vẫn ở đây
import LoginModal from './views/Login.vue'; 
import Navbar from './components/Navbar.vue'; 
// ĐÃ SỬA: Import showLoginModalFromRouter từ './router/index'
import { showLoginModalFromRouter } from './router/index'; 
import { isAuthenticated, logout } from './router/auth';
import router from './router';

const sharedData = ref(null);
const route = useRoute();

const showLoginModalLocal = ref(false);

function handleSharedData(data) {
  sharedData.value = data;
}

function openLoginModal() {
  showLoginModalLocal.value = true;
}

function handleCloseLoginModal() {
  console.log('Login modal close event received by App.vue!');
  showLoginModalFromRouter.value = false;
  showLoginModalLocal.value = false;
}

function handleLogout() {
  logout();
  showLoginModalFromRouter.value = false;
  showLoginModalLocal.value = false;
  router.push('/');
  // Đã thay thế alert() bằng console.log()
  console.log('Bạn đã đăng xuất thành công!'); 
}

watch(route, () => {
  // Logic để đóng modal nếu tuyến đường yêu cầu xác thực và đã đăng nhập
  // (Lưu ý: Logic này sẽ không còn kích hoạt modal cho /create/post và /create/video
  // vì meta: { requiresAuth: true } đã bị xóa khỏi các route đó trong router/index.js)
  if (showLoginModalFromRouter.value && !route.meta.requiresAuth && isAuthenticated.value) {
    showLoginModalFromRouter.value = false;
  }
  // Logic để đóng modal cục bộ khi tuyến đường thay đổi
  if (showLoginModalLocal.value) {
    showLoginModalLocal.value = false;
  }
});
</script>

<style scoped>
/* Các kiểu liên quan đến sidebar đã được chuyển sang Navbar.vue */

.flex-grow-1 {
  /* Margin-left này giữ cho nội dung chính không bị che bởi sidebar cố định */
  margin-left: 290px; 
}

@media (max-width: 768px) {
  .flex-grow-1 {
    margin-left: 0; /* Trên màn hình nhỏ, nội dung chính chiếm toàn bộ chiều rộng */
  }
}
</style>
