<template>
  <div class="create-post-page-wrapper">
    <div class="container create-post-container">
      <!-- Tiêu đề chính của trang CreatePost -->
      <h1 class="mb-4 text-center create-post-main-title">Tạo bài viết mới</h1>

      <div class="row mb-5 justify-content-center">
        <div class="col-md-8">
          <!-- Form tạo bài viết -->
          <div class="card shadow-lg border-0 rounded-3 create-post-card">
            <div class="card-body p-4">
              <h5 class="card-title mb-3 create-post-card-title">Thông tin bài viết</h5>
              <form @submit.prevent="addPost">
                <div class="mb-3">
                  <label class="form-label post-label">Tiêu đề</label>
                  <input v-model="newPost.title" class="form-control post-input" required />
                </div>
                <div class="mb-3">
                  <label class="form-label post-label">Nội dung</label>
                  <textarea v-model="newPost.fullContent" class="form-control post-input" rows="5" required></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label post-label">Tải ảnh lên</label>
                  <div class="input-group">
                    <input type="file" class="form-control post-input file-input d-none"  id="imageUpload" @change="handleFileUpload" accept="image/*"/>
                    <label class="form-control post-input d-flex align-items-center me-2 text-muted" for="imageUpload" style="cursor: pointer;">
                      <i class="fas fa-image me-2"></i> {{ newPost.image ? 'Đã chọn ảnh' : 'Không có tệp nào được chọn' }}
                    </label>
                    <label class="input-group-text upload-button" for="imageUpload">
                      <i class="fas fa-upload me-2"></i> Chọn file
                    </label>
                  </div>
                  <small class="form-text text-muted file-hint">Kích thước ảnh tối đa: 5MB. Định dạng: JPG, PNG, GIF.</small>
                </div>

                <!-- Hiển thị ảnh xem trước nếu có (chỉ cục bộ) -->
                <div class="mb-3 text-center" v-if="newPost.image && !newPost.image.startsWith('https://') && !newPost.image.startsWith('http://')">
                  <p class="text-muted image-preview-label">Ảnh xem trước:</p>
                  <img :src="newPost.image" alt="Ảnh xem trước" class="post-preview-image">
                </div>

                <div class="mb-3">
                  <label class="form-label post-label">Hoặc nhập URL hình ảnh (tùy chọn)</label>
                  <input v-model="newPost.image" class="form-control post-input" placeholder="https://example.com/image.jpg" />
                  <small class="form-text text-muted url-hint">Nếu bạn tải ảnh lên, URL này sẽ được tự động cập nhật.</small>
                </div>
                
                <button type="submit" class="btn post-submit-button w-100 mt-3 rounded-pill"><i class="fas fa-plus-circle me-1"></i>Thêm bài viết</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Import posts từ staticData.js để tương tác với dữ liệu tĩnh
import { posts } from '../data/staticData';

const newPost = ref({
  title: '',
  fullContent: '',
  image: '', // URL hình ảnh hoặc URL đối tượng cục bộ
});

/**
 * @description Hàm xử lý tải file ảnh lên (chỉ hiển thị cục bộ bằng URL.createObjectURL).
 * @param {Event} event Sự kiện thay đổi của input file.
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    newPost.value.image = '';
    return;
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_FILE_SIZE) {
    alert("Kích thước ảnh không được vượt quá 5MB.");
    event.target.value = ''; // Xóa file đã chọn
    newPost.value.image = '';
    return;
  }

  // Tạo URL đối tượng cục bộ để hiển thị ảnh ngay lập tức
  // URL này chỉ tồn tại trong phiên hoạt động của trình duyệt
  newPost.value.image = URL.createObjectURL(file);
  console.log('Ảnh đã được chọn và hiển thị cục bộ:', newPost.value.image);
}

/**
 * @description Hàm thêm bài viết vào database tĩnh (mảng posts trong staticData.js).
 */
function addPost() {
  if (!newPost.value.title || !newPost.value.fullContent) {
    alert("Vui lòng điền đủ tiêu đề và nội dung bài viết.");
    return;
  }

  // Chuẩn bị đối tượng bài viết mới
  const postToAdd = {
    // Tạo ID duy nhất bằng cách kết hợp số lượng bài viết hiện có và timestamp
    id: `static-post-${posts.value.length + 1}-${Date.now()}`,
    title: newPost.value.title,
    fullContent: newPost.value.fullContent,
    // Sử dụng ảnh đã tải lên cục bộ, URL thủ công, hoặc ảnh giữ chỗ mặc định
    image: newPost.value.image || 'https://placehold.co/600x400/D3D3D3/FFFFFF?text=Không+có+ảnh',
    createdAt: new Date().toISOString(), // Thêm timestamp khi tạo bài viết, định dạng ISO
  };

  // Thêm bài viết mới vào đầu mảng 'posts' trong staticData.js
  // Do 'posts' là một ref và được watch trong staticData.js, thay đổi này sẽ tự động được lưu vào localStorage
  posts.value.unshift(postToAdd);
  alert('Bài viết đã được thêm thành công!');

  // Đặt lại form sau khi thêm bài viết thành công
  newPost.value = {
    title: '',
    fullContent: '',
    image: '',
  };
  // Đảm bảo input file được reset sau khi thêm bài viết
  document.getElementById('imageUpload').value = '';
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.create-post-page-wrapper {
  background-color: white; /* Đã đổi màu nền thành trắng */
  height: 100vh; /* Đã đổi thành height: 100vh để bao phủ toàn bộ chiều cao khung nhìn */
  padding-top: 15px; /* Đã điều chỉnh padding-top để giảm thêm khoảng cách trên cùng */
  padding-bottom: 50px; /* Thêm một số padding ở phía dưới */
  box-sizing: border-box; /* Bao gồm padding trong tính toán chiều cao */
}

.create-post-container {
  max-width: 900px; /* Chiều rộng tối đa cho nội dung */
}

.create-post-main-title {
  font-family: 'Inter', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2c3e50; /* Màu xanh-xám đậm hơn cho tiêu đề chính */
  margin-top: 0; /* Đã loại bỏ margin-top để tránh khoảng cách kép với padding-top trên wrapper */
  margin-bottom: 30px !important;
}

.create-post-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); /* Bóng rõ hơn */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.create-post-card:hover {
  transform: translateY(-5px); /* Nâng thẻ lên khi di chuột */
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); /* Bóng mạnh hơn khi di chuột */
}

.create-post-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #34495e; /* Màu xanh-xám đậm hơn một chút cho tiêu đề thẻ */
  margin-bottom: 25px;
}

.post-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block; /* Đảm bảo nhãn nằm trên dòng riêng */
}

.post-input {
  border-radius: 10px; /* Các trường nhập được bo tròn hơn */
  padding: 12px 18px; /* Nhiều padding hơn để cảm giác tốt hơn */
  border: 1px solid #e9ecef; /* Màu viền nhạt hơn */
  font-size: 1rem;
  color: #333;
  background-color: #f8f9fa; /* Nền hơi trắng đục */
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.post-input:focus {
  border-color: #8e24aa; /* Màu tím-xanh khi focus */
  box-shadow: 0 0 0 0.25rem rgba(142, 36, 170, 0.2); /* Ánh sáng nhẹ */
  background-color: #ffffff; /* Nền trắng khi focus */
  outline: none; /* Xóa đường viền mặc định */
}

.input-group .file-input {
  border-right: none; /* Không có viền bên phải cho trường nhập file */
}

.upload-button {
  background: linear-gradient(45deg, #8e24aa, #42a5f5); /* Gradient cho nút tải lên */
  color: white; /* Đã đổi thành màu trắng để tương phản tốt hơn ở trạng thái ban đầu */
  border: none;
  border-radius: 0 10px 10px 0; /* Khớp với các góc bo tròn của trường nhập */
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: white; /* Đã đổi nền thành màu trắng khi di chuột */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #6a00f0; /* Đã đổi chữ thành màu tím khi di chuột */
  border: 1px solid #6a00f0; /* Đã thêm viền màu tím khi di chuột */
}

.file-hint, .url-hint {
  font-size: 0.85rem;
  color: #777;
  margin-top: 5px;
}

.image-preview-label {
  font-weight: 500;
  color: #555;
  margin-bottom: 10px;
}

.post-preview-image {
  max-width: 100%; /* Đảm bảo hình ảnh phản hồi */
  height: auto;
  border-radius: 10px; /* Các góc bo tròn cho hình ảnh xem trước */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Bóng nhẹ cho xem trước */
  border: 1px solid #eee; /* Viền sáng */
}

.post-submit-button {
  background: linear-gradient(45deg, #6a00f0, #a050f7); /* Gradient sống động cho nút gửi */
  border: none;
  font-weight: 600;
  padding: 14px 25px; /* Nhiều padding hơn cho nút đậm hơn */
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(106, 0, 240, 0.3); /* Bóng mạnh hơn */
  color: white; /* Đã đổi thành màu trắng */
}

.post-submit-button:hover {
  background: white; /* Đã đổi nền thành màu trắng khi di chuột */
  transform: translateY(-3px); /* Hiệu ứng nâng lên khi di chuột */
  box-shadow: 0 8px 25px rgba(106, 0, 240, 0.4);
  color: #6a00f0; /* Đã đổi chữ thành màu tím khi di chuột */
  border: 1px solid #6a00f0; /* Đã thêm viền màu tím khi di chuột */
}

.post-submit-button:active {
  transform: translateY(0); /* Hiệu ứng nhấn xuống */
  box-shadow: 0 4px 10px rgba(106, 0, 240, 0.2);
  background: white; /* Đảm bảo nền trắng khi active */
  color: #6a00f0; /* Đảm bảo chữ màu tím khi active */
  border: 1px solid #6a00f0; /* Đảm bảo viền màu tím khi active */
}

/* Điều chỉnh Responsive */
@media (max-width: 768px) {
  .create-post-main-title {
    font-size: 2.2rem;
  }
  .create-post-card {
    margin: 0 15px; /* Thêm một số lề bên trên các màn hình nhỏ hơn */
  }
  .create-post-card-title {
    font-size: 1.5rem;
  }
  .post-input {
    padding: 10px 15px;
  }
  .upload-button {
    padding: 10px 15px;
  }
  .post-submit-button {
    padding: 12px 20px;
    font-size: 1rem;
  }
}
</style>
