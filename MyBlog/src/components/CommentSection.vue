<template>
  <div class="comments-section mt-5">
    <h4 class="comments-title mb-4">Bình luận ({{ comments.length }})</h4>
    <div class="comment-list mb-4">
      <div v-if="comments.length === 0" class="text-muted text-center py-3">
        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
      </div>
      <div v-for="comment in comments" :key="comment.id" class="comment-item p-3 mb-3 rounded-lg shadow-sm">
        <div class="comment-author-info d-flex align-items-center mb-2">
          <img :src="getAuthorAvatar(comment.author)" alt="Avatar" class="comment-avatar me-2 rounded-circle">
          <strong class="comment-author-name">{{ comment.author }}</strong>
          <span class="comment-timestamp ms-auto text-muted">{{ formatTime(comment.timestamp) }}</span>
        </div>
        <p class="comment-text">{{ comment.text }}</p>
      </div>
    </div>

    <!-- Comment Form -->
    <div class="comment-form mt-4">
      <h5 class="mb-3">Thêm bình luận của bạn</h5>
      <textarea v-model="newCommentText" class="form-control mb-3" rows="3" placeholder="Viết bình luận của bạn tại đây..." required></textarea>
      <button @click="addComment" class="btn btn-primary submit-comment-button" :disabled="!newCommentText.trim()">
        Gửi bình luận <i class="fas fa-comment-dots ms-1"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { users, GENERIC_DEFAULT_AVATAR } from '../data/staticData'; // Import users và GENERIC_DEFAULT_AVATAR
import { currentUser } from '../router/auth'; // Import currentUser

// Định nghĩa các props mà component này nhận từ component cha
const props = defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => [] // Mảng bình luận
  },
  postId: {
    type: String, // ID của bài viết/video mà bình luận này thuộc về
    required: true
  }
});

// Định nghĩa các sự kiện mà component này có thể phát ra cho component cha
const emit = defineEmits(['commentAdded']);

const newCommentText = ref(''); // ref để lưu nội dung bình luận mới

/**
 * @description Hàm thêm bình luận mới. Nó sẽ tạo một đối tượng bình luận và phát ra sự kiện
 * `commentAdded` lên component cha để component cha xử lý việc thêm vào dữ liệu tĩnh.
 */
const addComment = () => {
  if (newCommentText.value.trim()) {
    const newComment = {
      id: `c-${Date.now()}`, // ID duy nhất cho bình luận
      author: currentUser.value?.name || 'Khách', // Lấy tên người dùng hiện tại hoặc 'Khách'
      text: newCommentText.value.trim(),
      timestamp: new Date().toISOString(), // Dấu thời gian
    };
    // Phát ra sự kiện với đối tượng bình luận mới
    emit('commentAdded', newComment);
    newCommentText.value = ''; // Xóa nội dung bình luận sau khi gửi
    console.log(`Bình luận mới đã được gửi bởi ${newComment.author}.`);
  }
};

/**
 * @description Lấy avatar của tác giả bình luận.
 * @param {string} authorName Tên tác giả bình luận.
 * @returns {string} URL avatar của tác giả.
 */
const getAuthorAvatar = (authorName) => {
  const author = users.value.find(user => user.name === authorName);
  return author?.profilePic || GENERIC_DEFAULT_AVATAR;
};

/**
 * @description Định dạng thời gian hiển thị thân thiện hơn.
 * @param {string} isoString Chuỗi thời gian ISO.
 * @returns {string} Chuỗi thời gian đã định dạng.
 */
const formatTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffMinutes = Math.round(diffTime / (1000 * 60));
    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    return `${Math.round(diffMinutes / 60)} giờ trước`;
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays <= 7) {
    return `${diffDays} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN'); // Hoặc định dạng khác bạn muốn
  }
};
</script>

<style scoped>
/* Nhập phông chữ */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Merriweather:wght@400;700&family=Inter:wght@400;500;600&display=swap');

/* Phần Bình luận */
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
  max-height: 400px; /* Giới hạn chiều cao và bật cuộn cho nhiều bình luận */
  overflow-y: auto;
  padding-right: 10px; /* Khoảng trống cho thanh cuộn */
}

/* Thanh cuộn tùy chỉnh cho danh sách bình luận */
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

/* Điều chỉnh phản hồi cho phần bình luận */
@media (max-width: 480px) {
  .comments-title {
    font-size: 1.8rem;
  }
  .comment-item {
    padding: 10px;
  }
  .comment-author-info {
    flex-wrap: wrap; /* Cho phép wrap trên màn hình nhỏ */
  }
  .comment-author-name {
    margin-right: 5px; /* Giảm khoảng cách */
  }
  .comment-timestamp {
    width: 100%; /* Đẩy dấu thời gian xuống dòng mới */
    text-align: left;
    margin-top: 5px;
  }
  .submit-comment-button {
    width: 100%;
  }
}
</style>
