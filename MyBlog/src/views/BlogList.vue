<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Danh sách nội dung</h1>

    <!-- Điều hướng Tab cho Bài viết và Video -->
    <div class="d-flex justify-content-center mb-4">
      <button class="btn btn-tab me-3" :class="{ 'btn-primary': activeTab === 'posts', 'btn-outline-primary': activeTab !== 'posts' }" @click="switchTab('posts')">
        <i class="fas fa-pencil-alt me-2"></i> Bài viết
      </button>
      <button class="btn btn-tab" :class="{ 'btn-primary': activeTab === 'videos', 'btn-outline-primary': activeTab !== 'videos' }" @click="switchTab('videos')">
        <i class="fas fa-video me-2"></i> Video
      </button>
    </div>

    <!-- Phần dành cho bài viết trên blog -->
    <div v-if="activeTab === 'posts'">
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="post in filteredPosts" :key="post.id">
          <!-- Sử dụng component PostCard mới -->
          <PostCard :post="post" @delete-post="confirmDeletePost" />
        </div>
      </div>
      <p v-if="filteredPosts.length === 0" class="text-muted text-center mt-5">Hiện chưa có bài viết nào.</p>
    </div>

    <!-- Phần dành cho Video-->
    <div v-if="activeTab === 'videos'">
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="video in filteredVideos" :key="video.id">
          <!-- Sử dụng component VideoCard mới -->
          <VideoCard :video="video" @delete-video="confirmDeleteVideo" />
        </div>
      </div>
      <p v-if="filteredVideos.length === 0" class="text-muted text-center mt-5">Hiện chưa có video nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { posts, videos } from '../data/staticData';
import PostCard from '../components/PostCard.vue'; // Import PostCard component
import VideoCard from '../components/VideoCard.vue'; // Import VideoCard component

const route = useRoute();

const activeTab = ref('posts');
const searchQueryPosts = ref('');
const searchQueryVideos = ref('');

const filteredPosts = computed(() => {
  if (!searchQueryPosts.value.trim()) return posts.value;
  return posts.value.filter(post =>
    post.title.toLowerCase().includes(searchQueryPosts.value.toLowerCase())
  );
});

const filteredVideos = computed(() => {
  if (!searchQueryVideos.value.trim()) return videos.value;
  return videos.value.filter(video =>
    video.title.toLowerCase().includes(searchQueryVideos.value.toLowerCase())
  );
});

function switchTab(tabName) {
  activeTab.value = tabName;
}

watchEffect(() => {
  if (route.query.tab === 'videos') {
    activeTab.value = 'videos';
  } else {
    activeTab.value = 'posts';
  }
});

// Hàm xác nhận và xóa bài viết, được gọi khi PostCard phát ra sự kiện 'delete-post'
function confirmDeletePost(postIdToDelete, postTitle) {
  // Thay thế window.confirm bằng một modal tùy chỉnh trong ứng dụng thực tế
  if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${postTitle}" không?`)) {
    const index = posts.value.findIndex(p => p.id === postIdToDelete);
    if (index !== -1) {
      posts.value.splice(index, 1);
      // Thay thế alert bằng một thông báo tùy chỉnh
      alert(`Bài viết có ID ${postIdToDelete} đã được xóa thành công!`);
    } else {
      alert('Không tìm thấy bài viết để xóa.');
    }
  }
}

// Hàm xác nhận và xóa video, được gọi khi VideoCard phát ra sự kiện 'delete-video'
function confirmDeleteVideo(videoIdToDelete, videoTitle) {
  if (window.confirm(`Bạn có chắc chắn muốn xóa video "${videoTitle}" không?`)) {
    const index = videos.value.findIndex(v => v.id === videoIdToDelete);
    if (index !== -1) {
      videos.value.splice(index, 1);
      alert(`Video có ID ${videoIdToDelete} đã được xóa thành công!`);
    } else {
      alert('Không tìm thấy video để xóa.');
    }
  }
}
</script>

<style scoped>
/* Các kiểu tùy chỉnh từ BlogList.vue trước đó */
.container {
  max-width: 1200px;
}

h1 {
  font-weight: 700;
  color: black;
}

/* Tab buttons styling */
.btn-tab {
  font-weight: 600;
  padding: 10px 25px;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-tab.btn-primary {
  background-color: #6a00f0;
  border-color: #6a00f0;
  color: white;
  box-shadow: 0 4px 10px rgba(106, 0, 240, 0.2);
}

.btn-tab.btn-outline-primary {
  color: #6a00f0;
  border-color: #6a00f0;
  background-color: transparent;
}

.btn-tab.btn-outline-primary:hover {
  background-color: rgba(106, 0, 240, 0.1);
  color: #5500c0;
}

/* Các kiểu chung cho card đã được chuyển sang PostCard.vue và VideoCard.vue */
/* Chỉ giữ lại các kiểu áp dụng chung cho container hoặc các phần tử không phải card */

/* Các kiểu dưới đây có thể được loại bỏ nếu chúng chỉ áp dụng cho card riêng lẻ */
/* và đã được chuyển vào PostCard.vue và VideoCard.vue */
/* .card, .blog-card-img, .video-card-img, .card-title, .card-text, .text-truncate-3, 
.btn-primary, .btn-outline-primary, .btn-delete-post { } */

/* Nếu có kiểu nào đó chỉ áp dụng cho các div bao quanh card trong BlogList, hãy giữ lại ở đây */
</style>
