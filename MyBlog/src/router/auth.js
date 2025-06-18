import { ref, computed } from 'vue'
import { users, GENERIC_DEFAULT_AVATAR } from '../data/staticData'; // Import users and GENERIC_DEFAULT_AVATAR

const token = ref(localStorage.getItem('token') || null)
export const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

// Biến này sẽ được sử dụng để thông báo cho component App.vue biết khi nào cần hiển thị modal đăng nhập
export const showLoginModalFromRouter = ref(false); // Thêm export cho showLoginModalFromRouter

export const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
// Đổi từ displayName sang name để khớp với cấu trúc defaultUsers trong staticData.js
export const userDisplayName = computed(() => currentUser.value ? currentUser.value.name : '') 
export const userEmail = computed(() => currentUser.value ? currentUser.value.email : '')

export function login(newToken, userData) {
  token.value = newToken
  localStorage.setItem('token', newToken)

  const loggedInUser = users.value.find(u => u.email === userData.email && u.password === userData.password);

  if (loggedInUser) {
    // Đảm bảo profileData luôn là một đối tượng, ngay cả khi nó null/undefined trong dữ liệu nguồn
    const userToSet = {
      ...loggedInUser,
      profileData: loggedInUser.profileData || {} 
    };
    currentUser.value = JSON.parse(JSON.stringify(userToSet)); // Tạo bản sao sâu để đảm bảo tính phản ứng và tránh thay đổi trực tiếp
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
  } else {
    console.error("Lỗi: Không tìm thấy người dùng trong danh sách tĩnh sau khi đăng nhập.");
    currentUser.value = null;
    localStorage.removeItem('currentUser');
  }
}

export function logout() {
  token.value = null
  localStorage.removeItem('token')

  currentUser.value = null
  localStorage.removeItem('currentUser')
}

// Hàm cập nhật thông tin người dùng (ví dụ: khi người dùng thay đổi tên hiển thị, hoặc profile data)
export function updateCurrentUser(updatedData) {
  if (currentUser.value) {
    // Cập nhật ref currentUser
    // Đối với profileData, hợp nhất cẩn thận để bảo toàn các thuộc tính hiện có
    // Đã sửa từ 'profile' thành 'profileData'
    if (updatedData.profileData) { 
      currentUser.value.profileData = { ...currentUser.value.profileData, ...updatedData.profileData };
      delete updatedData.profileData; 
    }
    
    // Cập nhật các thuộc tính cấp cao nhất
    currentUser.value = { ...currentUser.value, ...updatedData };

    // Đảm bảo profilePic có giá trị dự phòng nếu nó trở thành trống
    if (!currentUser.value.profilePic) {
      currentUser.value.profilePic = GENERIC_DEFAULT_AVATAR;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser.value));

    // Tìm và cập nhật người dùng trong mảng 'users' từ staticData.js
    const userIndex = users.value.findIndex(u => u.email === currentUser.value.email);
    if (userIndex !== -1) {
      // Tạo một bản sao sâu của người dùng để cập nhật
      const userToUpdate = JSON.parse(JSON.stringify(users.value[userIndex]));

      // Cập nhật các thuộc tính cơ bản từ currentUser.value
      // Đã sửa từ 'displayName' thành 'name'
      userToUpdate.name = currentUser.value.name; 
      userToUpdate.email = currentUser.value.email;
      userToUpdate.profilePic = currentUser.value.profilePic;

      // Cập nhật các thuộc tính profileData lồng nhau
      // Đã sửa từ 'profile' thành 'profileData'
      if (currentUser.value.profileData) { 
        userToUpdate.profileData = { ...userToUpdate.profileData, ...currentUser.value.profileData };
      }

      // Gán lại người dùng đã cập nhật vào mảng phản ứng
      users.value[userIndex] = userToUpdate;
    }
    console.log('[Auth] currentUser và mảng người dùng tĩnh đã được cập nhật:', currentUser.value);
  }
}
