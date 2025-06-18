<template>
  <div class="luxury-profile-page-wrapper">
    <div class="container luxury-profile-container my-5">
      <div class="luxury-card">
        <!-- Tiêu đề hồ sơ -->
        <div class="luxury-card-header text-center">
          <h2 class="luxury-title">Thông tin người dùng</h2>
          <p class="luxury-subtitle">Quản lý hồ sơ cá nhân của bạn</p>
        </div>

        <!-- Nội dung hồ sơ -->
        <div class="luxury-card-body">
          <div class="luxury-content-wrapper">
            <transition name="luxury-fade-slide" mode="out-in">
              <div class="profile-info-content">
                <form @submit.prevent="saveProfile">
                  <!-- Ảnh đại diện -->
                  <div class="mb-4 text-center">
                    <img :src="localProfile.profilePic || GENERIC_DEFAULT_AVATAR" alt="Avatar" class="profile-avatar mb-3 rounded-circle shadow-sm" @error="handleImageError"/>
                    <div v-if="isEditing">
                      <label for="avatarUpload" class="btn btn-outline-primary luxury-btn-sm rounded-pill cursor-pointer">
                        <i class="fas fa-upload me-2"></i> Tải ảnh đại diện
                      </label>
                      <input type="file" id="avatarUpload" class="d-none" accept="image/*" @change="handleAvatarChange"/>
                      <p class="text-muted text-sm mt-2">Kích thước khuyến nghị: 150x150px</p>
                    </div>
                  </div>

                  <!-- Thông tin cá nhân -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="fullName" class="form-label luxury-label">Tên đầy đủ</label>
                      <input type="text" id="fullName" class="form-control luxury-input" v-model="localProfile.name" :readonly="!isEditing" required/>
                    </div>
                    <div class="col-md-6">
                      <label for="email" class="form-label luxury-label">Email</label>
                      <input type="email" id="email" class="form-control luxury-input" v-model="localProfile.email" :readonly="true" required/>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="dob" class="form-label luxury-label">Ngày sinh</label>
                      <input type="date" id="dob" class="form-control luxury-input" v-model="localProfile.profileData.dob" :readonly="!isEditing"/>
                    </div>
                    <div class="col-md-6">
                      <label for="gender" class="form-label luxury-label">Giới tính</label>
                      <select id="gender" class="form-select luxury-input" v-model="localProfile.profileData.gender" :disabled="!isEditing">
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="phone" class="form-label luxury-label">Số điện thoại</label>
                      <input type="tel" id="phone" class="form-control luxury-input" v-model="localProfile.profileData.phone" :readonly="!isEditing"/>
                    </div>
                    <div class="col-md-6">
                      <label for="address" class="form-label luxury-label">Địa chỉ</label>
                      <input type="text" id="address" class="form-control luxury-input" v-model="localProfile.profileData.address" :readonly="!isEditing"/>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label for="bio" class="form-label luxury-label">Giới thiệu bản thân</label>
                    <textarea id="bio" class="form-control luxury-input" v-model="localProfile.profileData.bio" rows="4" :readonly="!isEditing"></textarea>
                  </div>

                  <!-- Nút thao tác -->
                  <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-secondary luxury-btn me-2" @click="toggleEdit" v-if="!isEditing">
                      <i class="fas fa-edit me-2"></i> Chỉnh sửa
                    </button>
                    <button type="submit" class="btn btn-primary luxury-btn" v-else>
                      <i class="fas fa-save me-2"></i> Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import các giá trị cần thiết
import { ref, watch } from 'vue';
import { GENERIC_DEFAULT_AVATAR } from '../data/staticData'; // Hình đại diện mặc định
import { currentUser, updateCurrentUser } from '../router/auth'; // Quản lý thông tin người dùng

// Trạng thái chỉnh sửa hồ sơ
const isEditing = ref(false);

// Dữ liệu hồ sơ người dùng
const localProfile = ref({
  name: '',
  email: '',
  profilePic: GENERIC_DEFAULT_AVATAR, // Hình đại diện mặc định
  profileData: {
    dob: '', // Ngày sinh
    gender: '', // Giới tính
    phone: '', // Số điện thoại
    address: '', // Địa chỉ
    bio: '', // Giới thiệu bản thân
  }
});

// Theo dõi thay đổi trong currentUser để cập nhật localProfile
watch(currentUser, (newVal) => {
  if (newVal) {
    // Sao chép dữ liệu người dùng vào localProfile để chỉnh sửa
    localProfile.value = {
      name: newVal.name || '',
      email: newVal.email || '',
      profilePic: newVal.profilePic || GENERIC_DEFAULT_AVATAR,
      profileData: {
        dob: newVal.profileData?.dob || '',
        gender: newVal.profileData?.gender || '',
        phone: newVal.profileData?.phone || '',
        address: newVal.profileData?.address || '',
        bio: newVal.profileData?.bio || '',
      }
    };
  } else {
    // Đặt lại dữ liệu hồ sơ khi người dùng đăng xuất
    localProfile.value = {
      name: '',
      email: '',
      profilePic: GENERIC_DEFAULT_AVATAR,
      profileData: {
        dob: '',
        gender: '',
        phone: '',
        address: '',
        bio: '',
      }
    };
  }
}, { immediate: true, deep: true }); // Theo dõi sâu và cập nhật ngay lập tức

// Xử lý lỗi tải ảnh đại diện
const handleImageError = (event) => {
  event.target.src = GENERIC_DEFAULT_AVATAR;
};

// Xử lý thay đổi ảnh đại diện
const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newProfilePic = e.target.result; // Lấy chuỗi Base64
      localProfile.value.profilePic = newProfilePic; // Cập nhật ảnh đại diện ngay lập tức

      // Cập nhật ảnh đại diện trong hệ thống
      updateCurrentUser({ profilePic: newProfilePic });
    };
    reader.readAsDataURL(file); // Đọc file dưới dạng Base64
  }
};

// Chuyển đổi chế độ chỉnh sửa hồ sơ
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

// Lưu thông tin hồ sơ
const saveProfile = () => {
  // Chuẩn bị dữ liệu cập nhật từ localProfile
  const updatedData = {
    name: localProfile.value.name,
    email: localProfile.value.email,
    profilePic: localProfile.value.profilePic,
    profileData: { ...localProfile.value.profileData }
  };

  // Cập nhật thông tin người dùng
  updateCurrentUser(updatedData);

  isEditing.value = false;
  console.log('Thông tin hồ sơ đã được lưu.');
};
</script>

<style scoped>
/* Nhập font chữ hiện đại */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

/* Wrapper trang hồ sơ */
.luxury-profile-page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; /* Đã đổi nền thành màu trắng */
  padding: 40px 15px;
  font-family: 'Roboto', sans-serif;
  color: #343a40;
}

/* Container chính */
.luxury-profile-container {
  max-width: 950px;
  width: 100%;
}

/* Thẻ chứa hồ sơ */
.luxury-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05), /* Shadow nhẹ hơn */
              0 10px 25px rgba(0, 0, 0, 0.05); /* Shadow nhẹ hơn */
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* Hiệu ứng khi di chuột */
.luxury-card:hover {
  transform: translateY(-3px); /* Nâng nhẹ hơn khi di chuột */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07),
              0 15px 35px rgba(0, 0, 0, 0.07);
}

/* Phần tiêu đề của thẻ */
.luxury-card-header {
  background: linear-gradient(90deg, #6a00f0 0%, #a050f7 100%); /* Gradient tím đậm hơn */
  padding: 50px 40px;
  color: #ffffff;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
}

/* Hiệu ứng gợn sóng Subtle trong tiêu đề */
.luxury-card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 90% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
  background-size: 200px 200px;
  animation: wave-effect 15s infinite alternate ease-in-out;
  pointer-events: none;
}

@keyframes wave-effect {
  0% { background-position: 0% 0%, 100% 100%; }
  100% { background-position: 100% 100%, 0% 0%; }
}

.luxury-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 5px;
  letter-spacing: -0.03em;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.luxury-subtitle {
  font-size: 1.1rem;
  font-weight: 300;
  opacity: 0.9;
}

/* Phần body của thẻ */
.luxury-card-body {
  padding: 40px;
}

/* Wrapper nội dung */
.luxury-content-wrapper {
  padding: 0 20px;
}

/* Avatar */
.profile-avatar {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 5px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Input và Label */
.luxury-label {
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.luxury-input {
  border-radius: 10px;
  padding: 12px 18px;
  border: 1px solid #e9ecef;
  font-size: 1rem;
  color: #333;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.luxury-input:focus {
  border-color: #6a00f0;
  box-shadow: 0 0 0 0.25rem rgba(106, 0, 240, 0.2);
  background-color: #ffffff;
  outline: none;
}

.luxury-input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}

/* Nút */
.luxury-btn {
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 50px;
  transition: all 0.3s ease;
  min-width: 150px;
}

.luxury-btn.btn-outline-primary {
  color: #6a00f0;
  border-color: #6a00f0;
}

.luxury-btn.btn-outline-primary:hover {
  background-color: #6a00f0;
  color: #fff;
  box-shadow: 0 4px 15px rgba(106, 0, 240, 0.3);
}

.luxury-btn.btn-primary {
  background: linear-gradient(45deg, #6a00f0, #a050f7);
  border: none;
  color: #fff;
  box-shadow: 0 4px 15px rgba(106, 0, 240, 0.3);
}

.luxury-btn.btn-primary:hover {
  background: linear-gradient(45deg, #a050f7, #6a00f0);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(106, 0, 240, 0.4);
}

.luxury-btn.luxury-btn-sm {
  padding: 8px 18px;
  font-size: 0.9rem;
  min-width: unset;
}

/* Chuyển tiếp */
.luxury-fade-slide-enter-active,
.luxury-fade-slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.luxury-fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.luxury-fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Điều chỉnh đáp ứng */
@media (max-width: 768px) {
  .luxury-card-body {
    padding: 30px;
  }
  .luxury-content-wrapper {
    padding: 0;
  }
  .luxury-title {
    font-size: 2.2rem;
  }
  .luxury-subtitle {
    font-size: 1rem;
  }
  .luxury-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
    min-width: 120px;
  }
}

@media (max-width: 576px) {
  .luxury-card-header {
    padding: 40px 20px;
  }
  .luxury-title {
    font-size: 1.8rem;
  }
  .luxury-subtitle {
    font-size: 0.9rem;
  }
  .luxury-card-body {
    padding: 20px;
  }
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  .luxury-btn {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
  .d-flex.justify-content-end {
    flex-direction: column;
    align-items: center;
  }
}
</style>
