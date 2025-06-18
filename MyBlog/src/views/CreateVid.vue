<template>
  <div class="create-video-page-wrapper">
    <div class="container create-video-container">
      <h1 class="mb-4 text-center create-video-main-title">Tạo Video mới</h1>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg border-0 rounded-3 create-video-card">
            <div class="card-body p-4">
              <h5 class="card-title mb-3 create-video-card-title">Thông tin Video</h5>
              <form @submit.prevent="addVideo">
                <div class="mb-3">
                  <label for="videoTitle" class="form-label video-label">Tiêu đề Video</label>
                  <input type="text" id="videoTitle" v-model="newVideo.title" class="form-control video-input" required/>
                </div>
                <div class="mb-3">
                  <label for="videoDescription" class="form-label video-label">Mô tả Video</label>
                  <textarea id="videoDescription" v-model="newVideo.description" class="form-control video-input" rows="5"></textarea>
                </div>
                <div class="mb-3">
                  <label for="videoUrl" class="form-label video-label">URL Video (ví dụ: YouTube, Vimeo)</label>
                  <input type="url" id="videoUrl" v-model="newVideo.url" class="form-control video-input" placeholder="https://www.youtube.com/watch?v=your-video-id" required/>
                  <small class="form-text text-muted url-hint-video"> Vui lòng cung cấp URL video từ các nền tảng như YouTube, Vimeo.</small>
                </div>

                <div class="mb-3">
                  <label for="thumbnailUpload" class="form-label video-label">Tải ảnh Thumbnail (tùy chọn)</label>
                  <div class="input-group">
                    <input type="file" class="form-control video-input file-input d-none" id="thumbnailUpload" @change="handleThumbnailUpload" accept="image/*"/>
                    <label class="form-control video-input d-flex align-items-center me-2 text-muted" for="thumbnailUpload" style="cursor: pointer;">
                      <i class="fas fa-image me-2"></i> {{ newVideo.thumbnail ? 'Đã chọn ảnh' : 'Không có tệp nào được chọn' }}
                    </label>
                    <label class="input-group-text upload-button-video" for="thumbnailUpload">
                      <i class="fas fa-upload me-2"></i> Chọn file
                    </label>
                  </div>
                  <small class="form-text text-muted file-hint-video"> Kích thước ảnh tối đa: 5MB. Định dạng: JPG, PNG, GIF.</small>
                </div>
                <!-- Hiển thị ảnh thumbnail xem trước nếu có (chỉ cục bộ) -->
                <div class="mb-3 text-center" v-if="newVideo.thumbnail && !newVideo.thumbnail.startsWith('https://') && !newVideo.thumbnail.startsWith('http://')">
                  <p class="text-muted video-preview-label">Ảnh thumbnail đã tải:</p>
                  <img :src="newVideo.thumbnail" alt="Video Thumbnail" class="video-preview-image">
                </div>

                <button type="submit" class="btn video-submit-button w-100 mt-3 rounded-pill"><i class="fas fa-plus-circle me-1"></i> Thêm Video</button>
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
import { videos } from '../data/staticData';

const newVideo = ref({
  title: '',
  description: '',
  url: '',
  thumbnail: '',
});

/**
 * @description Hàm xử lý tải file thumbnail lên (chỉ hiển thị cục bộ bằng URL.createObjectURL).
 * @param {Event} event Sự kiện thay đổi của input file.
 */
function handleThumbnailUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    newVideo.value.thumbnail = '';
    return;
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_FILE_SIZE) {
    console.error("Kích thước ảnh không được vượt quá 5MB.");
    event.target.value = '';
    newVideo.value.thumbnail = '';
    return;
  }

  newVideo.value.thumbnail = URL.createObjectURL(file);
  console.log('Thumbnail đã được chọn và hiển thị cục bộ:', newVideo.value.thumbnail);
}

/**
 * @description Hàm thêm video vào database tĩnh (mảng videos trong staticData.js).
 */
function addVideo() {
  if (!newVideo.value.title || !newVideo.value.url) {
    console.error("Vui lòng điền đủ tiêu đề và URL video.");
    return;
  }

  const videoToAdd = {
    id: `static-video-${videos.value.length + 1}-${Date.now()}`,
    title: newVideo.value.title,
    description: newVideo.value.description,
    url: newVideo.value.url,
    thumbnail: newVideo.value.thumbnail || 'https://placehold.co/600x400/D3D3D3/FFFFFF?text=No+Thumbnail',
    createdAt: new Date().toISOString(),
  };

  videos.value.unshift(videoToAdd);
  console.log('Video đã được thêm thành công!');

  newVideo.value = {
    title: '',
    description: '',
    url: '',
    thumbnail: '',
  };
  document.getElementById('thumbnailUpload').value = '';
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.create-video-page-wrapper {
  background-color: white;
  height: 100vh;
  padding-top: 15px;
  padding-bottom: 50px;
  box-sizing: border-box;
}

.create-video-container {
  max-width: 900px;
}

.create-video-main-title {
  font-family: 'Inter', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 30px !important;
}

.create-video-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.create-video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.create-video-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #34495e;
  margin-bottom: 25px;
}

.video-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.video-input {
  border-radius: 10px;
  padding: 12px 18px;
  border: 1px solid #e9ecef;
  font-size: 1rem;
  color: #333;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.video-input:focus {
  border-color: #8e24aa;
  box-shadow: 0 0 0 0.25rem rgba(142, 36, 170, 0.2);
  background-color: #ffffff;
  outline: none;
}

.input-group .file-input {
  border-right: none;
}

/* Kiểu dáng cụ thể cho nút tải lên tùy chỉnh */
.upload-button-video {
  background: linear-gradient(45deg, #8e24aa, #42a5f5);
  color: white; /* Đã đổi sang màu trắng để có độ tương phản tốt hơn ở trạng thái ban đầu */
  border: none;
  border-radius: 0 10px 10px 0;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-button-video:hover {
  background: white; /* Đã thay đổi nền thành màu trắng khi di chuột*/
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: #6a00f0; /* Đã thay đổi văn bản thành màu tím khi di chuột qua */
  border: 1px solid #6a00f0; /* Đã thêm đường viền màu tím khi di chuột qua */
}

.file-hint-video, .url-hint-video {
  font-size: 0.85rem;
  color: #777;
  margin-top: 5px;
}

.video-preview-label {
  font-weight: 500;
  color: #555;
  margin-bottom: 10px;
}

.video-preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
}

.video-submit-button {
  background: linear-gradient(45deg, #6a00f0, #a050f7);
  border: none;
  font-weight: 600;
  padding: 14px 25px;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(106, 0, 240, 0.3);
  color: white;
}

.video-submit-button:hover {
  background: white; /* Đã thay đổi nền thành màu trắng khi di chuột */
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(106, 0, 240, 0.4);
  color: #6a00f0; /* Đã thay đổi văn bản thành màu tím khi di chuột qua */
  border: 1px solid #6a00f0; /* Đã thêm đường viền màu tím khi di chuột qua */
}

.video-submit-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(106, 0, 240, 0.2);
  background: white;
  color: #6a00f0;
  border: 1px solid #6a00f0;
}

/* Điều chỉnh đáp ứng */
@media (max-width: 768px) {
  .create-video-main-title {
    font-size: 2.2rem;
  }
  .create-video-card {
    margin: 0 15px;
  }
  .create-video-card-title {
    font-size: 1.5rem;
  }
  .video-input {
    padding: 10px 15px;
  }
  .upload-button-video {
    padding: 10px 15px;
  }
  .video-submit-button {
    padding: 12px 20px;
    font-size: 1rem;
  }
}
</style>
