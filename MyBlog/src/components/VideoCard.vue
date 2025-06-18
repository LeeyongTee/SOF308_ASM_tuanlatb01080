<template>
  <div class="card h-100 shadow-sm border-0 rounded-3 video-card">
    <img
      :src="video.thumbnail"
      class="card-img-top video-card-img"
      alt="Video Thumbnail"
      onerror="this.onerror=null;this.src='https://placehold.co/600x400/D3D3D3/FFFFFF?text=No+Thumbnail';"
    />
    <div class="card-body d-flex flex-column p-4">
      <h5 class="card-title mb-2">{{ video.title }}</h5>
      <p class="card-text text-muted flex-grow-1 text-truncate-3">{{ video.description }}</p>
      <div class="d-flex justify-content-between align-items-center mt-3">
        <router-link :to="`/video/${video.id}`" class="btn btn-outline-primary rounded-pill flex-grow-1 me-2">Xem chi tiết <i class="fas fa-arrow-right ms-1"></i></router-link>
        <!-- Nút xóa video, phát ra sự kiện 'delete-video' -->
        <button @click.stop="emitDeleteVideo" class="btn btn-danger rounded-circle btn-delete-post"><i class="fas fa-trash-alt"></i></button>
      </div>
      <!-- Hiển thị số lượt thích và bình luận cho video -->
      <div class="d-flex align-items-center mt-2 text-muted justify-content-between">
        <div>
          <i class="far fa-heart me-1"></i> {{ video.likes || 0 }} lượt thích
        </div>
        <div>
          <i class="far fa-comment me-1"></i> {{ video.comments ? video.comments.length : 0 }} bình luận
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// defineProps và defineEmits là compiler macro và không cần phải được import trong <script setup>
// import { defineProps, defineEmits } from 'vue'; // Dòng này đã bị xóa

// Định nghĩa các props mà component này nhận
const props = defineProps({
  video: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: 'Video không có tiêu đề',
      description: 'Mô tả video không có sẵn.',
      url: '#', // Default URL
      thumbnail: 'https://placehold.co/600x400/D3D3D3/FFFFFF?text=No+Thumbnail',
      likes: 0,
      comments: [],
    })
  }
});

// Định nghĩa các sự kiện mà component này có thể phát ra
const emit = defineEmits(['delete-video']);

// Hàm phát ra sự kiện xóa video
const emitDeleteVideo = () => {
  emit('delete-video', props.video.id, props.video.title);
};
</script>

<style scoped>
/* Các kiểu chung cho card (có thể trùng với PostCard, nhưng giữ riêng để linh hoạt) */
.card {
  border-radius: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.video-card-img {
  height: 250px; /* Chiều cao hình ảnh lớn hơn để có tác động trực quan tốt hơn */
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.card-title {
  font-weight: 600;
  color: black;
}

.card-text {
  color: #6c757d;
  line-height: 1.6;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-primary {
  background-color: #6a00f0;
  border-color: #6a00f0;
  font-weight: 500;
  padding: 10px 25px;
}

.btn-primary:hover {
  background-color: #5500c0;
  border-color: #5500c0;
}

.btn-outline-primary {
  color: #6a00f0;
  border-color: #6a00f0;
  font-weight: 500;
  padding: 8px 20px;
}

.btn-outline-primary:hover {
  background-color: #6a00f0;
  color: white;
}

.btn-delete-post {
  width: 40px; /* Làm cho nó thành một vòng tròn hoàn hảo */
  height: 40px; /* Làm cho nó thành một vòng tròn hoàn hảo */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  font-size: 1rem;
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.2);
  transition: all 0.3s ease;
}

.btn-delete-post:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
}

.btn-delete-post i {
  color: white;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .video-card-img {
    height: 180px; /* Chiều cao nhỏ hơn trên màn hình nhỏ */
  }
  .card-title {
    font-size: 1.1rem;
  }
  .card-text {
    font-size: 0.9rem;
  }
  .btn-outline-primary {
    padding: 6px 15px;
    font-size: 0.9rem;
  }
  .btn-delete-post {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
}
</style>
