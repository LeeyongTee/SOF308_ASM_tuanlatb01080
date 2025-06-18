<template>
  <div class="home-page container my-5">
    <!-- Phần Banner -->
    <div class="banner-section mb-5">
      <div class="banner-carousel-container">
        <transition name="banner-fade" mode="out-in">
          <img :src="banners[currentBannerIndex]?.image || 'https://placehold.co/1200x400/D3D3D3/FFFFFF?text=Banner+Error'"  :alt="banners[currentBannerIndex]?.alt || 'Banner Image'"  :key="banners[currentBannerIndex]?.id"  class="banner-image" onerror="this.onerror=null;this.src='https://placehold.co/1200x400/D3D3D3/FFFFFF?text=Error+Loading+Image';"/>
        </transition>

        <!-- Nút điều hướng -->
        <button class="banner-nav-button prev-button" @click="prevBanner"><i class="fas fa-chevron-left"></i></button>
        <button class="banner-nav-button next-button" @click="nextBanner"><i class="fas fa-chevron-right"></i></button>

        <!-- Dấu chấm phân trang -->
        <div class="banner-pagination-dots">
          <span  v-for="(banner, index) in banners" :key="banner.id" class="dot" :class="{ active: index === currentBannerIndex }" @click="goToBanner(index)"></span>
        </div>
      </div>
    </div>
    
    <!-- Phần Hero -->
    <div class="hero-section mb-5 text-center">
      <!-- Văn bản "" trực tiếp, không còn hình ảnh nền xanh -->
      <h1 class="hero-welcome-text">Chào mừng đến với InnovateViet</h1>
      <h2 class="hero-title mt-4 text-dark">Nơi Chia Sẻ Tri Thức và Đam Mê</h2>
      <p class="lead text-secondary">
       InnovateViet: Thể hiện sự đổi mới.
       Chia Sẻ Công Nghệ, Lan Tỏa Đam Mê.
      </p>
    </div>

    <div class="row">
      <!-- Phần Giới thiệu bản thân -->
      <div class="col-lg-4 mb-4">
        <div class="card h-100 shadow-sm border-0 rounded-lg about-card">
          <div class="card-body p-4 text-start">
            <div class="text-center"> <!-- Div căn giữa avatar -->
              <!-- Hiển thị ảnh đại diện của người dùng hiện tại nếu có, nếu không thì dùng ảnh giữ chỗ chung -->
              <img :src="currentUser?.profilePic || 'https://placehold.co/150x150/D3D3D3/FFFFFF?text=Avatar'" alt="Ảnh đại diện" class="profile-pic mb-3 rounded-circle shadow-sm"/>
            </div>
            <h5 class="card-title mb-2 custom-card-title">Giới thiệu bản thân</h5>
            <!-- Hiển thị tên và email của người dùng hiện tại từ currentUser -->
            <p class="card-text mb-1"><strong>Tên:</strong> {{ currentUser?.name || 'Khách' }}</p>
            <p class="card-text mb-3"><strong>Email:</strong> {{ currentUser?.email || 'guest@example.com' }}</p>
            <p class="card-text">
              <!-- Hiển thị tiểu sử tùy chỉnh của người dùng từ currentUser.profileData -->
              {{ currentUser?.profileData?.bio || 'Chào mừng bạn đến với trang cá nhân của tôi! Tôi rất vui được chia sẻ những câu chuyện và trải nghiệm của mình tại đây.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Phần Blog của tôi -->
      <div class="col-lg-8 mb-4">
        <div class="card h-100 shadow-sm border-0 rounded-lg blog-section-card">
          <div class="card-body p-4 text-start">
            <h5 class="card-title mb-4 custom-card-title">Blog của tôi</h5>
            <div class="row">
              <div class="col-md-4 mb-3" v-for="post in latestPosts" :key="post.id">
                <!-- Wrapper router-link để toàn bộ mục preview có thể nhấp được -->
                <router-link :to="`/blog/${post.id}`" class="blog-preview-link-wrapper text-decoration-none">
                  <div class="blog-preview-item">
                    <img :src="post.image" alt="Ảnh bài viết" class="img-fluid rounded-md blog-thumb mb-2" onerror="this.onerror=null;this.src='https://placehold.co/150x100/D3D3D3/FFFFFF?text=Không+có+ảnh';"/>
                    <p class="fw-bold mb-1 blog-title-preview text-start">{{ post.title }}</p>
                    <p class="text-sm text-truncate-2 text-start">{{ post.fullContent }}</p>
                  </div>
                </router-link>
              </div>
            </div>
            <!-- Nút "Xem tất cả bài viết" cho toàn bộ phần blog -->
            <div class="text-center mt-4">
              <router-link to="/blogs" class="btn btn-outline-primary rounded-pill">Xem tất cả bài viết <i class="fas fa-arrow-right ms-1"></i></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần Video -->
    <div class="card shadow-sm border-0 rounded-lg mt-5 video-section-card">
      <div class="card-body p-4 text-start">
        <h5 class="card-title mb-4 custom-card-title">VIDEO - ĐỪNG BỎ LỠ</h5>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="video in latestVideos" :key="video.id">
            <!-- Wrapper <a> để toàn bộ mục preview video có thể nhấp được -->
            <a :href="video.url" target="_blank" class="video-preview-link-wrapper text-decoration-none">
              <div class="video-preview-item">
                <img :src="video.thumbnail" alt="Video Thumbnail" class="img-fluid rounded-md video-thumb mb-2" onerror="this.onerror=null;this.src='https://placehold.co/150x100/D3D3D3/FFFFFF?text=Không+có+ảnh';"/>
                <p class="fw-bold mb-1 video-title-preview text-start">{{ video.title }}</p>
                <p class="text-sm text-truncate-2 text-start">{{ video.description }}</p>
              </div>
            </a>
          </div>
        </div>
        <!-- Nút "Xem tất cả video" cho toàn bộ phần video -->
        <div class="text-center mt-4">
          <router-link :to="{ path: '/blogs', query: { tab: 'videos' }}" class="btn btn-outline-primary rounded-pill">Xem tất cả video <i class="fas fa-arrow-right ms-1"></i></router-link>
        </div>
      </div>
    </div>

    <!-- Phần Nội dung đã chia sẻ -->
    <div v-if="sharedContentDetails.length > 0" class="card shadow-sm border-0 rounded-lg mt-5 shared-posts-section-card">
      <div class="card-body p-4 text-start">
        <h5 class="card-title mb-4 custom-card-title">Nội dung bạn đã chia sẻ</h5>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="item in sharedContentDetails" :key="item.id">
            <!-- Dynamic router-link hoặc <a> dựa trên loại mục -->
            <component :is="item.type === 'post' ? 'router-link' : 'a'" :to="item.type === 'post' ? `/blog/${item.id}` : null" :href="item.type === 'video' ? item.url : null" :target="item.type === 'video' ? '_blank' : null" class="blog-preview-link-wrapper text-decoration-none">
              <div class="blog-preview-item">
                <img :src="item.image || item.thumbnail" :alt="item.type === 'post' ? 'Ảnh bài viết' : 'Video Thumbnail'" class="img-fluid rounded-md blog-thumb mb-2" onerror="this.onerror=null;this.src='https://placehold.co/150x100/D3D3D3/FFFFFF?text=Không+có+ảnh';"/>
                <p class="fw-bold mb-1 blog-title-preview text-start">{{ item.title }}</p>
                <p class="text-sm text-truncate-2 text-start">{{ item.fullContent || item.description }}</p>
              </div>
            </component>
          </div>
        </div>
        <div class="text-center mt-4">
          <router-link to="/blogs" class="btn btn-outline-primary rounded-pill">Xem thêm nội dung đã chia sẻ <i class="fas fa-arrow-right ms-1"></i></router-link>
        </div>
      </div>
    </div>
    <div v-else class="card shadow-sm border-0 rounded-lg mt-5 shared-posts-section-card">
      <div class="card-body p-4 text-center text-muted">
        <h5 class="card-title mb-3 custom-card-title">Nội dung bạn đã chia sẻ</h5>
        <p>Bạn chưa chia sẻ nội dung nào. Hãy chia sẻ để mọi người cùng xem nhé!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'; // Nhập onMounted và onUnmount
import { posts, videos, banners, sharedPosts } from '../data/staticData'; // Nhập biểu ngữ và bài viết được chia sẻ
import { currentUser } from '../router/auth'; 

// Logic băng chuyền Banner
const currentBannerIndex = ref(0);
let autoSlideInterval = null;
const slideDuration = 3000; // 3 giây

const startAutoSlide = () => {
  clearInterval(autoSlideInterval); // Xóa bất kỳ khoảng thời gian hiện có nào
  autoSlideInterval = setInterval(() => {
    nextBanner();
  }, slideDuration);
};

const nextBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.value.length;
  startAutoSlide(); // Đặt lại bộ hẹn giờ khi điều hướng thủ công
};

const prevBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value - 1 + banners.value.length) % banners.value.length;
  startAutoSlide(); // Đặt lại bộ hẹn giờ khi điều hướng thủ công
};

const goToBanner = (index) => {
  currentBannerIndex.value = index;
  startAutoSlide(); // Đặt lại bộ hẹn giờ khi điều hướng thủ công
};

onMounted(() => {
  if (banners.value.length > 0) {
    startAutoSlide();
  }
});

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});

// Lấy 3 bài viết mới nhất
const latestPosts = computed(() => {
  return posts.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
});

// Lấy 3 video mới nhất
const latestVideos = computed(() => {
  return videos.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
});

// Thuộc tính được tính toán để lấy chi tiết các bài viết và video đã chia sẻ
const sharedContentDetails = computed(() => {
  const content = [];
  sharedPosts.value.forEach(id => {
    // Thử tìm trong posts
    const foundPost = posts.value.find(p => p.id === id);
    if (foundPost) {
      content.push({ ...foundPost, type: 'post' });
    } else {
      // Nếu không tìm thấy trong posts, thử tìm trong videos
      const foundVideo = videos.value.find(v => v.id === id);
      if (foundVideo) {
        content.push({ ...foundVideo, type: 'video' });
      }
    }
  });
  return content;
});
</script>

<style scoped>
/* Nhập phông chữ mới */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

.home-page {
  font-family: 'Inter', sans-serif;
}

/* Kiểu phần Banner */
.banner-section {
  position: relative;
  width: 100%;
  max-width: 1200px; /* Điều chỉnh khi cần */
  margin: 0 auto 50px; /* Căn giữa và thêm lề dưới */
  border-radius: 15px;
  overflow: hidden; /* Ẩn các phần tràn của hình ảnh */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.banner-carousel-container {
  position: relative;
  width: 100%;
  /* Đã thay đổi padding-bottom để phù hợp với tỷ lệ 2:1 của ảnh (3780x1890) */
  padding-bottom: 50%; /* Chiều cao = 50% chiều rộng */
  background-color: #eee;
  overflow: hidden;
}

.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px; /* Áp dụng border-radius cho hình ảnh */
}

/* Chuyển đổi banner fade */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.8s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
}

/* Nút điều hướng */
.banner-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.banner-nav-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
}

.prev-button {
  left: 15px;
}

.next-button {
  right: 15px;
}

/* Dấu chấm phân trang */
.banner-pagination-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.dot.active,
.dot:hover {
  background-color: #ffffff;
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}


.hero-section {
  background: linear-gradient(to right, #e0f7fa, #b2ebf2);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  display: flex; /* Sử dụng flexbox để căn giữa nội dung */
  flex-direction: column; /* Xếp chồng các phần tử con theo chiều dọc */
  justify-content: center; /* Căn giữa theo chiều dọc */
  align-items: center; /* Căn giữa theo chiều ngang */
}

/* MỚI: Kiểu cho văn bản trực tiếp "Welcome to MyBlog" */
.hero-welcome-text {
  font-family: 'Playfair Display', serif; /* Hoặc một phông chữ thanh lịch khác */
  font-size: 3rem; /* Kích thước phông lớn */
  font-weight: 700; /* In đậm */
  color: #2c3e50; /* Màu tối để tương phản trên nền sáng */
  margin-bottom: 10px; /* Khoảng cách bên dưới văn bản chào mừng */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Bóng chữ nhẹ */
  text-align: center; /* Đảm bảo căn giữa */
}

.hero-title {
  font-weight: 700;
  color: #333;
}

.lead {
  color: #555;
}

/* Nền thẻ được cập nhật thành gradient xanh-lam hiện đại */
.about-card, .blog-section-card, .video-section-card, .shared-posts-section-card { /* Thêm shared-posts-section-card */
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  /* Gradient xanh-lam hiện đại */
  background: linear-gradient(135deg, #e0f2f7 0%, #a7d9de 100%);
  color: #333333; /* Màu văn bản mặc định cho các phần này */
}

/* Kiểu ảnh đại diện được cập nhật */
.profile-pic {
  width: 70%; /* Tăng chiều rộng lên 70% */
  max-width: 250px; /* Tăng chiều rộng tối đa */
  height: auto; /* Duy trì tỷ lệ khung hình */
  aspect-ratio: 1 / 1; /* Đảm bảo nó vẫn là hình vuông cho border-radius hình tròn hoàn hảo */
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 50%; /* Đảm bảo nó là hình tròn hoàn hảo */
}

/* Kiểu tùy chỉnh cho tiêu đề thẻ cụ thể */
.custom-card-title {
  font-family: 'Playfair Display', serif; /* Áp dụng phông chữ mới */
  font-weight: 700; /* Làm cho nó đậm hơn */
  color: #2c3e50; /* Màu tối hơn cho tiêu đề để tương phản tốt hơn */
  font-size: 1.8rem; /* Lớn hơn một chút để nhấn mạnh */
  margin-bottom: 1.5rem; /* Thêm khoảng cách bên dưới tiêu đề */
}


/* Đảm bảo văn bản bên trong các thẻ này có màu tối để tương phản */
.about-card .card-text,
.blog-section-card .blog-title-preview,
.blog-section-card .text-truncate-2,
.video-section-card .video-title-preview,
.video-section-card .text-truncate-2,
.shared-posts-section-card .blog-title-preview, /* Thêm văn bản bài viết đã chia sẻ */
.shared-posts-section-card .text-truncate-2 {
  color: #444444; /* Màu tối hơn cho văn bản chung trong các phần này để dễ đọc */
}


/* Thêm style cho wrapper link của preview bài viết */
.blog-preview-link-wrapper {
  display: block; /* Khiến toàn bộ link là một khối */
  color: inherit; /* Kế thừa màu chữ từ parent, để không bị màu xanh mặc định của link */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Thêm transition cho background-color */
  padding: 10px; /* Thêm padding để dễ tương tác hơn */
  border-radius: 8px; /* Bo tròn các góc */
}


/* Thêm style cho wrapper link của preview video */
.video-preview-link-wrapper {
  display: block; /* Khiến toàn bộ link là một khối */
  color: inherit; /* Kế thừa màu chữ từ parent, để không bị màu xanh mặc định của link */
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease; /* Thêm transition cho background-color */
  padding: 10px; /* Thêm padding để dễ tương tác hơn */
  border-radius: 8px; /* Bo tròn các góc */
}

/* Kiểu hover cho các mục preview bài viết và video */
.blog-preview-link-wrapper:hover,
.video-preview-link-wrapper:hover {
  transform: translateY(-5px); /* Nâng nhẹ lên khi di chuột */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* Thêm bóng khi di chuột */
  background-color: #ffffff; /* Nền trắng khi di chuột */
}

.blog-preview-link-wrapper:hover .blog-title-preview,
.blog-preview-link-wrapper:hover .text-truncate-2,
.video-preview-link-wrapper:hover .video-title-preview,
.video-preview-link-wrapper:hover .text-truncate-2 {
  color: #333333; /* Màu chữ đen khi di chuột */
}


.blog-thumb, .video-thumb {
  width: 100%;
  height: 150px; /* Chiều cao cố định cho thumbnail */
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.blog-thumb:hover, .video-thumb:hover {
  transform: scale(1.05);
}

.blog-title-preview, .video-title-preview {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444444; /* Màu văn bản mặc định trong các mục preview blog/video */
  margin-top: 10px;
  text-align: left; /* Căn trái rõ ràng các tiêu đề trong preview */
  transition: color 0.3s ease; /* Thêm transition cho màu chữ */
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  color: #444444; /* Màu văn bản mặc định trong các mục preview blog/video */
  min-height: 2.5em; /* Đảm bảo chiều cao nhất quán cho 2 dòng */
  text-align: left; /* Căn trái rõ ràng văn bản trong preview */
  transition: color 0.3s ease; /* Thêm transition cho màu chữ */
}

/* Màu nút được cập nhật cho .btn-outline-primary */
.btn-outline-primary {
  color: #333333; /* Văn bản màu xám đậm cho nút viền */
  background-color: #ffffff; /* Nền trắng cho trạng thái bình thường */
  border-color: #e0f2f7; /* Màu viền sáng từ gradient thẻ */
  transition: all 0.3s ease; /* Chuyển động mượt mà cho tất cả các thuộc tính */
}

.btn-outline-primary:hover {
  background-color: #512da8; /* Nền màu chính đậm hơn khi di chuột */
  color: white; /* Văn bản màu trắng khi di chuột */
  border-color: #512da8; /* Viền màu chính đậm hơn khi di chuột */
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

/* Đảm bảo text-primary khớp với màu chính của chủ đề mới */
.text-primary {
  color: #2196F3 !important; /* Sử dụng màu xanh sống động cho text-primary khi áp dụng */
}

/* Điều chỉnh responsive */
@media (max-width: 991px) {

}

@media (max-width: 767px) {
  .hero-section {
    padding: 30px;
  }
  .hero-title {
    font-size: 2rem;
  }
  .hero-welcome-text { 
    font-size: 2.5rem;
  }
  .lead {
    font-size: 1rem;
  }
  .about-card, .blog-section-card, .video-section-card {
    margin-bottom: 20px;
  }
  .blog-thumb, .video-thumb {
    height: 120px;
  }

  .banner-nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero-welcome-text { 
    font-size: 2rem;
  }
}
</style>
