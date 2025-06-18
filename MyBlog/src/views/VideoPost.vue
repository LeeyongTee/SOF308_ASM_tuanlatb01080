<template>
  <div class="video-post-detail-page">
    <div class="container video-post-container">
      <div v-if="video" class="video-content-area">
        <div class="video-thumbnail-wrapper mb-4">
          <img :src="video.thumbnail" alt="Hình thu nhỏ Video" class="video-detail-thumbnail" onerror="this.onerror=null;this.src='https://placehold.co/960x540/D3D3D3/FFFFFF?text=Không+có+ảnh+thumbnail';"/>
        </div>

        <div class="video-body-card">
          <h1 class="video-detail-title mb-3">{{ video.title }}</h1>
          <p class="video-detail-description">{{ video.description }}</p>

          <div class="video-actions mb-4 d-flex justify-content-center align-items-center">
            <button @click="toggleLike" class="btn btn-action me-3" :class="{ 'btn-liked': isLiked }"><i :class="[isLiked ? 'fas' : 'far', 'fa-heart']"></i>Thích <span class="badge bg-secondary ms-1">{{ video.likes }}</span></button>
            <button @click="shareVideo" class="btn btn-action btn-share me-3"><i class="fas fa-share-alt"></i> Chia sẻ</button>
            <a :href="video.url" target="_blank" class="btn btn-action btn-watch-youtube"><i class="fab fa-youtube"></i>Xem trên YouTube</a>
          </div>

          <CommentSection :comments="video.comments" :post-id="video.id" @comment-added="handleCommentAdded"/>

          <div class="read-more-link">
            <router-link to="/blogs?tab=videos" class="back-to-videos-button">← Quay lại danh sách Video</router-link>
          </div>
        </div>
      </div>

      <div v-else class="loading-error-area">
        <div v-if="!videoLoaded && videoId" class="skeleton-loader-card">
          <div class="skeleton-video-thumbnail"></div>
          <div class="skeleton-title-placeholder"></div>
          <div class="skeleton-text-block"></div>
          <div class="skeleton-text-block short"></div>
          <div class="skeleton-text-block"></div>
        </div>
        <div v-else class="not-found-card">
          <h3 class="not-found-title">Rất tiếc! Không tìm thấy video này.</h3>
          <p class="not-found-message">Có vẻ video bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <router-link to="/blogs?tab=videos" class="back-to-videos-button">Quay lại danh sách Video</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { videos as staticVideos, sharedPosts } from '../data/staticData';
import CommentSection from '../components/CommentSection.vue';

const videoId = ref(null);
const video = ref(null);
const videoLoaded = ref(false);
const isLiked = ref(false); // Trạng thái thích của video

const route = useRoute();

/**
 * @description Hàm lấy video từ dữ liệu tĩnh.
 * @param {string} id ID của video cần tìm.
 * @returns {Object|null} Đối tượng video nếu tìm thấy, ngược lại là null.
 */
const fetchVideo = async (id) => {
  console.log(`Đang cố gắng tải video với ID: ${id} từ dữ liệu tĩnh.`);
  const foundVideo = staticVideos.value.find(v => String(v.id) === String(id));
  if (foundVideo) {
    console.log(`Đã tải video "${foundVideo.title}" từ dữ liệu tĩnh.`);
    // Đảm bảo thuộc tính comments và likes tồn tại, ngay cả khi ban đầu bị thiếu
    if (!foundVideo.comments) {
      foundVideo.comments = [];
    }
    if (typeof foundVideo.likes === 'undefined') {
      foundVideo.likes = 0;
    }
    isLiked.value = false; // Đặt lại trạng thái thích cho video mới
  } else {
    console.log(`Không tìm thấy video với ID: ${id} trong dữ liệu tĩnh.`);
  }
  return foundVideo;
};

/**
 * @description Hàm giả lập thời gian tải.
 * @param {number} ms Số mili giây để chờ.
 * @returns {Promise<void>} Một Promise sẽ giải quyết sau khoảng thời gian đã cho.
 */
const simulateLoading = (ms) => new Promise(resolve => setTimeout(resolve, ms));

watchEffect(async () => {
  videoId.value = route.params.id;
  console.log(`watchEffect đã kích hoạt. videoId.value: ${videoId.value}`);

  video.value = null;
  videoLoaded.value = false;

  await simulateLoading(300); // Giả lập thời gian tải ngắn hơn để có phản hồi nhanh hơn

  if (videoId.value) {
    const foundVideo = await fetchVideo(videoId.value);
    if (foundVideo) {
      video.value = foundVideo;
    } else {
      console.log("Không tìm thấy video trong dữ liệu tĩnh, hiển thị thông báo lỗi.");
    }
  } else {
    console.warn(`ID video không hợp lệ hoặc không có: ${route.params.id}`);
  }
  videoLoaded.value = true;
  console.log(`videoLoaded.value đã được đặt thành: ${videoLoaded.value}`);
});

/**
 * @description Hàm xử lý bình luận mới được thêm từ component CommentSection.
 * @param {Object} newComment Đối tượng bình luận mới.
 */
const handleCommentAdded = (newComment) => {
  if (video.value) {
    video.value.comments.push(newComment);
    console.log(`Bình luận mới đã được thêm vào video "${video.value.title}".`);
  }
};

/**
 * @description Tăng/giảm số lượt thích của video.
 * Lưu ý: Với dữ liệu tĩnh, đây là một ví dụ đơn giản.
 */
const toggleLike = () => {
  if (video.value) {
    if (!isLiked.value) {
      video.value.likes++;
      isLiked.value = true;
      console.log(`Bạn đã thích video "${video.value.title}". Tổng số lượt thích: ${video.value.likes}`);
    } else {
      console.log(`Bạn đã thích video này rồi.`);
    }
  }
};

/**
 * @description Chia sẻ video (thêm ID video vào mảng sharedPosts, có thể phân biệt post/video ID nếu cần).
 * Ở đây, chúng ta sẽ giả định sharedPosts lưu cả ID bài viết và video cho mục đích đơn giản.
 */
const shareVideo = () => {
  if (video.value) {
    // Kiểm tra xem video đã được chia sẻ chưa
    if (!sharedPosts.value.includes(video.value.id)) {
      sharedPosts.value.push(video.value.id);
      // Thay thế alert bằng console.log hoặc một modal/thông báo tùy chỉnh
      console.log(`Video "${video.value.title}" đã được chia sẻ thành công!`);
      console.log(`Video "${video.value.title}" đã được thêm vào danh sách chia sẻ.`);
    } else {
      // Thay thế alert bằng console.log hoặc một modal/thông báo tùy chỉnh
      console.log(`Video "${video.value.title}" đã được chia sẻ trước đó rồi.`);
      console.log(`Video "${video.value.title}" đã có trong danh sách chia sẻ.`);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Merriweather:wght@400;700&family=Inter:wght@400;500;600&display=swap');

/* Main Page Wrapper */
.video-post-detail-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start; /* Căn chỉnh lên trên thay vì giữa cho nội dung dài hơn */
  justify-content: center;
  background: #f0f2f5; /* Nền xám nhạt */
  padding: 60px 20px;
  font-family: 'Merriweather', serif;
  color: #333;
}

.video-post-container {
  max-width: 960px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;
}

/* Khu vực nội dung Video */
.video-content-area {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-content-area:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

/* Bao bọc hình thu nhỏ Video - Kiểu mới cho hình ảnh thu nhỏ */
.video-thumbnail-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* Tỷ lệ khung hình 16:9 */
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
}

.video-detail-thumbnail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Thẻ nội dung chính */
.video-body-card {
  padding: 50px;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #444;
}

.video-detail-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.3;
  color: #2c3e50;
  text-align: center;
}

.video-detail-description {
  margin-bottom: 40px;
  text-align: justify;
}

/* Nút hành động (Thích, Chia sẻ, Xem trên YouTube) */
.video-actions {
  display: flex;
  justify-content: center;
  gap: 15px; /* Khoảng cách giữa các nút */
  margin-top: 20px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  padding: 10px 25px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border: none;
}

.btn-action i {
  margin-right: 8px;
  font-size: 1.1rem;
}

.btn-action.btn-liked {
  background-color: #ff6b6b; /* Màu đỏ cho trạng thái đã thích */
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.btn-action:not(.btn-liked) {
  background-color: #f0f2f5; /* Nền nhạt hơn cho trạng thái chưa thích */
  color: #6c757d;
  border: 1px solid #e0e0e0;
}

.btn-action:not(.btn-liked):hover {
  background-color: #e0e0e0;
  color: #555;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.btn-action.btn-share {
  background-color: #28a745; /* Màu xanh lá cho chia sẻ */
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-action.btn-share:hover {
  background-color: #218838;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}

.btn-action.btn-watch-youtube {
  background-color: #ff0000; /* Màu đỏ YouTube */
  color: white;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
}

.btn-action.btn-watch-youtube:hover {
  background-color: #cc0000;
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
  transform: translateY(-2px);
}

/* Phần Bình luận (Tương tự như BlogPost.vue) */
.comments-section {
  border-top: 1px solid #eee;
  padding-top: 40px;
  margin-top: 40px;
}

.comments-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 25px;
}

.comment-list {
  max-height: 400px; /* Giới hạn chiều cao và cho phép cuộn cho nhiều bình luận */
  overflow-y: auto;
  padding-right: 10px; /* Khoảng cách cho thanh cuộn */
}

/* Thanh cuộn tùy chỉnh cho comment-list */
.comment-list::-webkit-scrollbar {
  width: 8px;
}

.comment-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.comment-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.comment-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.comment-item {
  background-color: #fdfdfd;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.comment-author-info {
  margin-bottom: 5px;
}

.comment-avatar {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border: 2px solid #eee;
}

.comment-author-name {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #2c3e50;
}

.comment-timestamp {
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  color: #888;
}

.comment-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0;
}

.comment-form h5 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #333;
}

.comment-form .form-control {
  border-radius: 8px;
  border-color: #ced4da;
  padding: 12px 15px;
  font-size: 1rem;
  color: #343a40;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.comment-form .form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  background-color: #ffffff;
}

.submit-comment-button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  padding: 12px 25px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
}

.submit-comment-button:hover:not(:disabled) {
  background: linear-gradient(45deg, #0056b3, #003e80);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.4);
  transform: translateY(-2px);
}

.submit-comment-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

/* Nút Quay lại */
.read-more-link {
  text-align: center;
  margin-top: 40px;
}

.back-to-videos-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #007bff, #0056b3); /* Chuyển màu xanh lam */
  color: white;
  padding: 15px 35px;
  border-radius: 50px; /* Bo tròn hoàn toàn */
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
}

.back-to-videos-button:hover {
  background: linear-gradient(45deg, #0056b3, #003e80); /* Xanh lam đậm hơn khi di chuột */
  box-shadow: 0 12px 25px rgba(0, 123, 255, 0.4);
  transform: translateY(-3px);
}

.back-to-videos-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

/* Khu vực tải và không tìm thấy */
.loading-error-area {
  width: 100%;
}

.skeleton-loader-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding-bottom: 50px; /* Đệm cho nội dung bên dưới khung xương */
}

.skeleton-video-thumbnail {
  width: 100%;
  padding-bottom: 56.25%; /* Tỷ lệ khung hình 16:9 */
  background-color: #e0e0e0;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-title-placeholder {
  height: 40px;
  width: 80%;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin: 40px auto 30px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text-block {
  height: 20px;
  width: 90%;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 0 auto 15px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text-block.short {
  width: 70%;
}

.not-found-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.not-found-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  color: #dc3545; /* Màu đỏ cho lỗi */
  margin-bottom: 15px;
}

.not-found-message {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 30px;
}

/* Hoạt ảnh */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

/* Điều chỉnh responsive */
@media (max-width: 768px) {
  .video-post-detail-page {
    padding: 30px 15px;
  }

  .video-detail-title {
    font-size: 2.2rem;
  }

  .video-body-card {
    padding: 30px;
    font-size: 1rem;
  }

  .back-to-videos-button {
    padding: 12px 25px;
    font-size: 1rem;
  }

  .not-found-title {
    font-size: 1.8rem;
  }

  .not-found-message {
    font-size: 1rem;
  }
  .video-actions {
    flex-direction: column;
    gap: 10px;
  }
  .btn-action {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .video-detail-title {
    font-size: 1.8rem;
  }
  .video-body-card {
    padding: 20px;
  }
}
</style>