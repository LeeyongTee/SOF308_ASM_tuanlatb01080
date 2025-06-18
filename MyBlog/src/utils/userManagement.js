import { users } from '../data/staticData'; // Import the reactive `users` ref from staticData.js

/**
 * @description Lấy tất cả người dùng hiện có từ mảng `users`.
 * @returns {Array} Mảng các đối tượng người dùng.
 */
export function getAllUsers() {
  return users.value;
}

/**
 * @description Lưu toàn bộ mảng người dùng vào `users` ref.
 * Hàm này sẽ kích hoạt watcher trong staticData.js để lưu vào localStorage.
 * @param {Array} updatedUsers Mảng người dùng đã được cập nhật.
 */
export function saveAllUsers(updatedUsers) {
  users.value = updatedUsers;
  console.log('[userManagement] All users saved via users ref update.');
}

/**
 * @description Lấy mật khẩu của một người dùng dựa trên email của họ.
 * @param {string} email Email của người dùng cần lấy mật khẩu.
 * @returns {string|null} Mật khẩu của người dùng nếu tìm thấy, ngược lại là null.
 */
export function getUserPasswordFromUsers(email) {
  const user = users.value.find(u => u.email === email);
  if (user) {
    console.log(`[userManagement] Tìm thấy người dùng với email: ${email}. Mật khẩu: ${user.password}`);
    return user.password;
  }
  console.warn(`[userManagement] Không tìm thấy người dùng với email: ${email} hoặc không có mật khẩu được lưu.`);
  return null;
}

/**
 * @description Cập nhật mật khẩu của một người dùng trong mảng `users`.
 * @param {string} email Email của người dùng cần cập nhật.
 * @param {string} newPassword Mật khẩu mới.
 * @returns {boolean} True nếu cập nhật thành công, ngược lại là false.
 */
export function updatePasswordInUsers(email, newPassword) {
  const userIndex = users.value.findIndex(u => u.email === email);
  if (userIndex !== -1) {
    // Tạo một bản sao sâu để đảm bảo khả năng phản ứng và tránh các vấn đề sửa đổi trực tiếp
    const updatedUser = JSON.parse(JSON.stringify(users.value[userIndex]));
    updatedUser.password = newPassword;
    
    users.value[userIndex] = updatedUser; // Cập nhật tham chiếu phản ứng
    console.log(`[userManagement] Mật khẩu người dùng ${email} đã được cập nhật thành công.`);
    return true;
  }
  console.error(`[userManagement] Không tìm thấy người dùng với email: ${email} để cập nhật mật khẩu.`);
  return false;
}

