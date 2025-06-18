<template>
  <div class="blog-post-detail-page">
    <div class="container blog-post-container">
      <div v-if="post" class="post-content-area">
        <!-- Phần hình ảnh -->
        <div class="post-hero-image-wrapper">
          <img :src="post.image" alt="Bài viết hình ảnh" class="post-hero-image" onerror="this.onerror=null;this.src='https://placehold.co/1200x600/D3D3D3/FFFFFF?text=Không+có+ảnh';" />
          <div class="post-title-overlay">
            <h1 class="post-detail-title">{{ post.title }}</h1>
          </div>
        </div>

        <!-- Phần Nội dung Chính -->
        <div class="post-body-card">
          <p class="post-detail-content">{{ post.fullContent }}</p>

          <!-- Các nút hành động (Thích, Chia sẻ) -->
          <div class="post-actions mb-4 d-flex justify-content-center align-items-center">
            <button @click="toggleLike" class="btn btn-action me-3" :class="{ 'btn-liked': isLiked }"><i :class="[isLiked ? 'fas' : 'far', 'fa-heart']"></i> Thích <span class="badge bg-secondary ms-1">{{ post.likes }}</span></button>
            <button @click="sharePost" class="btn btn-action btn-share"><i class="fas fa-share-alt"></i> Chia sẻ</button>
          </div>

          <!-- Phần bình luận (Sử dụng Phần bình luận mới) -->
          <CommentSection :comments="post.comments" :post-id="post.id" @comment-added="handleCommentAdded" />

          <div class="read-more-link">
            <router-link to="/blogs" class="back-to-blogs-button">← Quay lại danh sách bài viết</router-link>
          </div>
        </div>
      </div>

      <div v-else class="loading-error-area">
        <!-- Hiển thị skeleton loader khi đang tải hoặc nếu postId không hợp lệ -->
        <div v-if="!postLoaded && postId" class="skeleton-loader-card">
          <div class="skeleton-hero-image"></div>
          <div class="skeleton-title-placeholder"></div>
          <div class="skeleton-text-block"></div>
          <div class="skeleton-text-block short"></div>
          <div class="skeleton-text-block"></div>
        </div>
        <!-- Hiển thị thông báo không tìm thấy bài viết -->
        <div v-else class="not-found-card">
          <h3 class="not-found-title">Rất tiếc! Không tìm thấy bài viết này.</h3>
          <p class="not-found-message">Có vẻ bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
          <router-link to="/blogs" class="back-to-blogs-button">Quay lại danh sách bài viết</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { posts as staticPosts, sharedPosts } from '../data/staticData'; // Nhập staticPosts và sharedPosts
import CommentSection from '../components/CommentSection.vue'; // Nhập thành phần mới Phần bình luận

const postId = ref(null);
const post = ref(null);
const postLoaded = ref(false);
const isLiked = ref(false); // Trạng thái like của bài viết

const route = useRoute();

/**
 * @description Hàm lấy bài viết từ dữ liệu tĩnh.
 * @param {string} id ID của bài viết cần tìm.
 * @returns {Object|null} Đối tượng bài viết nếu tìm thấy, ngược lại là null.
 */
const fetchPost = async (id) => {
  console.log(`Attempting to fetch post with ID: ${id} from static data.`);
  const foundPost = staticPosts.value.find(p => String(p.id) === String(id));
  if (foundPost) {
    console.log(`Đã tải bài viết "${foundPost.title}" từ dữ liệu tĩnh.`);
    // Đảm bảo thuộc tính comments và likes tồn tại, ngay cả khi ban đầu bị thiếu
    if (!foundPost.comments) {
      foundPost.comments = [];
    }
    if (typeof foundPost.likes === 'undefined') {
      foundPost.likes = 0;
    }
    isLiked.value = false; // Đặt lại trạng thái thích cho bài viết mới
  } else {
    console.log(`Không tìm thấy bài viết với ID: ${id} trong dữ liệu tĩnh.`);
  }
  return foundPost;
};

const simulateLoading = (ms) => new Promise(resolve => setTimeout(resolve, ms));

watchEffect(async () => {
  postId.value = route.params.id;
  console.log(`watchEffect triggered. postId.value: ${postId.value}`);

  post.value = null;
  postLoaded.value = false;

  await simulateLoading(300); // Giả lập thời gian tải ngắn hơn để có phản hồi nhanh hơn

  if (postId.value) {
    const foundPost = await fetchPost(postId.value);
    if (foundPost) {
      post.value = foundPost;
    } else {
      console.log("Không tìm thấy bài viết trong dữ liệu tĩnh, hiển thị thông báo lỗi.");
    }
  } else {
    console.warn(`ID bài viết không hợp lệ hoặc không có: ${route.params.id}`);
  }
  postLoaded.value = true;
  console.log(`postLoaded.value được đặt thành: ${postLoaded.value}`);
});

/**
 * @description Hàm xử lý bình luận mới được thêm từ component CommentSection.
 * @param {Object} newComment Đối tượng bình luận mới.
 */
const handleCommentAdded = (newComment) => {
  if (post.value) {
    post.value.comments.push(newComment);
    console.log(`Bình luận mới đã được thêm vào bài viết "${post.value.title}".`);
  }
};

/**
 * @description Tăng/giảm số lượt thích của bài viết.
 * Lưu ý: Với dữ liệu tĩnh, đây là một ví dụ đơn giản.
 * Trong ứng dụng thực tế, bạn sẽ cần logic phức tạp hơn để theo dõi ai đã thích.
 */
const toggleLike = () => {
  if (post.value) {
    if (!isLiked.value) {
      post.value.likes++;
      isLiked.value = true;
      console.log(`Bạn đã thích bài viết "${post.value.title}". Tổng số lượt thích: ${post.value.likes}`);
    } else {
      // Logic bỏ thích (nếu muốn)
      // post.value.likes--;
      // isLiked.value = false;
      // console.log(`Bạn đã bỏ thích bài viết "${post.value.title}". Tổng số lượt thích: ${post.value.likes}`);
      console.log(`Bạn đã thích bài viết này rồi.`);
    }
  }
};

/**
 * @description Chia sẻ bài viết (thêm ID bài viết vào mảng sharedPosts).
 */
const sharePost = () => {
  if (post.value) {
    // Kiểm tra xem bài viết đã được chia sẻ chưa
    if (!sharedPosts.value.includes(post.value.id)) {
      sharedPosts.value.push(post.value.id);
      console.log(`Bài viết "${post.value.title}" đã được chia sẻ thành công!`); // Thay alert bằng console.log
    } else {
      console.log(`Bài viết "${post.value.title}" đã được chia sẻ trước đó rồi.`); // Thay alert bằng console.log
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Merriweather:wght@400;700&family=Inter:wght@400;500;600&display=swap');

/* Wrapper trang chính */
.blog-post-detail-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start; /* Căn chỉnh lên trên thay vì giữa cho nội dung dài hơn */
  justify-content: center;
  background: #f0f2f5; /* Nền màu xám nhạt */
  padding: 60px 20px;
  font-family: 'Merriweather', serif;
  color: #333;
}

.blog-post-container {
  max-width: 960px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;
}

/* Khu vực nội dung bài viết */
.post-content-area {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-content-area:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

/* Hình ảnh Hero và Lớp phủ tiêu đề */
.post-hero-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 50%; /* Tỷ lệ khung hình 2:1 cho hình ảnh rộng hơn */
  background-color: #eee;
  overflow: hidden;
}

.post-hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-hero-image-wrapper:hover .post-hero-image {
  transform: scale(1.05);
}

.post-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  padding: 40px;
  color: #fff;
  text-align: center;
}

.post-detail-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

/* Thẻ nội dung chính */
.post-body-card {
  padding: 50px;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #444;
}

.post-detail-content {
  margin-bottom: 40px;
  text-align: justify;
}

/* Nút hành động (Thích, Chia sẻ) */
.post-actions {
  display: flex;
  justify-content: center;
  gap: 20px; /* Khoảng cách giữa các nút */
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
  background-color: #28a745; /* Màu xanh lá cây cho chia sẻ */
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-action.btn-share:hover {
  background-color: #218838;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  transform: translateY(-2px);
}


/* Nút quay lại */
.read-more-link {
  text-align: center;
  margin-top: 40px;
}

.back-to-blogs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #007bff, #0056b3); /* Gradient màu xanh */
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

.back-to-blogs-button:hover {
  background: linear-gradient(45deg, #0056b3, #003e80); /* Màu xanh đậm hơn khi di chuột */
  box-shadow: 0 12px 25px rgba(0, 123, 255, 0.4);
  transform: translateY(-3px);
}

.back-to-blogs-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

/* Khu vực tải và lỗi không tìm thấy */
.loading-error-area {
  width: 100%;
}

.skeleton-loader-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding-bottom: 50px; /* Đệm cho nội dung bên dưới skeleton */
}

.skeleton-hero-image {
  width: 100%;
  padding-bottom: 50%;
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
  .blog-post-detail-page {
    padding: 30px 15px;
  }

  .post-title-overlay {
    padding: 20px;
  }

  .post-detail-title {
    font-size: 2.5rem;
  }

  .post-body-card {
    padding: 30px;
    font-size: 1rem;
  }

  .back-to-blogs-button {
    padding: 12px 25px;
    font-size: 1rem;
  }

  .not-found-title {
    font-size: 1.8rem;
  }

  .not-found-message {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .post-detail-title {
    font-size: 2rem;
  }
  .post-body-card {
    padding: 20px;
  }
  .post-actions {
    flex-direction: column;
    gap: 10px;
  }
  .btn-action {
    width: 100%;
  }
}
</style>
