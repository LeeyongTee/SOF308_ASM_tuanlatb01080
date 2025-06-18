<template>
  <div class="modal-overlay" @keydown.esc="closeModal" @click.self="closeModal">
    <div class="login-wrapper">
      <div class="close-btn" @click.stop="closeModal">
        <i class="fas fa-times"></i>
      </div>

      <div class="form-container" :class="{ active: activeTab === 'register' }" id="container">
        <div class="form-box sign-up">
          <form @submit.prevent="handleRegister">
            <h2>Tạo tài khoản</h2>
            <div class="input-group">
              <input type="text" v-model="registerForm.name" placeholder="Họ tên" required>
              <input type="email" v-model="registerForm.email" placeholder="Email" required>
              <input type="password" v-model="registerForm.password" placeholder="Mật khẩu" required>
              <input type="password" v-model="registerForm.confirmPassword" placeholder="Xác nhận mật khẩu" required>
            </div>
            <button type="submit">Đăng ký</button>
          </form>
        </div>

        <div class="form-box sign-in">
          <form @submit.prevent="handleLogin">
            <h2>Đăng nhập</h2>
            <div class="input-group">
              <input type="email" v-model="loginForm.email" placeholder="Email" required>
              <input type="password" v-model="loginForm.password" placeholder="Mật khẩu" required>
            </div>
            <button type="submit">Vào trang chính</button>
          </form>
        </div>

        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <h1>Chào mừng trở lại!</h1>
              <p>Nhập thông tin đã đăng ký để đăng nhập</p>
              <button class="hidden" @click="activeTab = 'login'">Đăng nhập</button>
            </div>
            <div class="toggle-panel toggle-right">
              <h1>Xin chào!</h1>
              <p>Hãy điền đủ thông tin để đăng ký tài khoản</p>
              <button class="hidden" @click="activeTab = 'register'">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hiển thị thông báo lỗi hoặc thành công -->
      <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
      <div v-if="successMsg" class="alert alert-success mt-3">{{ successMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { login as authLogin, isAuthenticated } from '../router/auth' // Nhập khẩu được xác thực
import { users } from '../data/staticData'; 

const router = useRouter()
const emit = defineEmits(['close'])

// Định nghĩa props mà component này có thể nhận, ví dụ: để chuyển hướng sau đăng nhập
const props = defineProps({
  redirectPath: {
    type: String,
    default: '/dashboard' // Mặc định chuyển hướng về Dashboard nếu không có đường dẫn cụ thể
  }
});

const activeTab = ref('register')
const errorMsg = ref('')
const successMsg = ref(''); // ref mới cho thông báo thành công

// Khởi tạo registerForm và loginForm với các giá trị mặc định
const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loginForm = ref({
  email: '',
  password: '',
});

// Hàm xóa thông báo sau một khoảng thời gian
const clearMessages = () => {
  setTimeout(() => {
    errorMsg.value = '';
    successMsg.value = '';
  }, 3000); // Xóa thông báo sau 3 giây
};

onMounted(async () => {
  await nextTick();
})

// Hàm xử lý đăng ký tài khoản
function handleRegister() {
  errorMsg.value = ''; // Xóa lỗi trước đó
  successMsg.value = ''; // Xóa thông báo thành công trước đó

  const { name, email, password, confirmPassword } = registerForm.value
  if (password !== confirmPassword) {
    errorMsg.value = 'Mật khẩu không khớp!';
    clearMessages();
    return;
  }
  const exists = users.value.find(u => u.email === email);
  if (exists) {
    errorMsg.value = 'Email đã tồn tại!';
    clearMessages();
    return;
  }
  users.value.push({ name, email, password, profileData: {} }); // Thêm người dùng mới vào mảng tĩnh, kèm profileData rỗng
  
  successMsg.value = 'Đăng ký thành công! Vui lòng đăng nhập.';
  activeTab.value = 'login';
  // Xóa form sau khi đăng ký thành công
  registerForm.value = { name: '', email: '', password: '', confirmPassword: '' };
  clearMessages();
}

// Hàm xử lý đăng nhập
function handleLogin() {
  errorMsg.value = ''; // Xóa lỗi trước đó
  successMsg.value = ''; // Xóa thông báo thành công trước đó

  const { email, password } = loginForm.value;

  console.log('[LoginModal] Đang cố gắng đăng nhập với:', { email, password });

  // Gọi hàm đăng nhập từ auth.js trực tiếp với dữ liệu form
  authLogin('dummy-token-from-login', { email: email, password: password });

  // Kiểm tra isAuthenticated là true SAU khi gọi authLogin
  if (isAuthenticated.value) {
    // Nếu đăng nhập thành công, currentUser trong auth.js sẽ được thiết lập
    // Chúng ta có thể truy cập currentUser từ auth.js để lấy tên
    import('../router/auth').then(({ currentUser: authCurrentUser }) => {
      successMsg.value = `Xin chào ${authCurrentUser.value.name}, bạn đã đăng nhập thành công!`;
      console.log('[LoginModal] Đăng nhập thành công. Đóng modal và chuyển hướng.');
      closeModal(); // Đóng modal ngay lập tức khi thành công
      // Chuyển hướng đến đường dẫn được yêu cầu hoặc Dashboard mặc định
      router.push(props.redirectPath || { name: 'Dashboard' }); 
    });
  } else {
    // Điều này sẽ xảy ra nếu authLogin không tìm thấy người dùng khớp
    errorMsg.value = 'Email hoặc mật khẩu sai!';
    console.error('[LoginModal] Đăng nhập thất bại: Email hoặc mật khẩu không khớp.');
    clearMessages();
  }
  // Đặt lại form đăng nhập bất kể thành công hay thất bại
  loginForm.value = { email: '', password: '' };
}

// Hàm đóng modal
function closeModal() {
  console.log('Hàm closeModal được gọi từ Login.vue!');
  errorMsg.value = ''; // Xóa thông báo khi modal đóng
  successMsg.value = '';
  emit('close');
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000; /* Đảm bảo z-index đủ cao */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  position: relative;
  outline: none;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1001; /* Phải cao hơn modal-overlay một chút để nhận click */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

/* Các style khác không thay đổi */
#container {
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  position: relative;
}

.form-box {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  transition: all 0.6s ease-in-out;
  z-index: 2;
}

.sign-in {
  left: 0;
  z-index: 2;
}

.sign-up {
  left: 0;
  opacity: 0;
  z-index: 1;
}

.form-container.active .sign-in {
  transform: translateX(100%);
}

.form-container.active .sign-up {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

.toggle-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
  z-index: 100;
  border-radius: 150px 0 0 100px;
}

.form-container.active .toggle-container {
  transform: translateX(-100%);
  border-radius: 0 150px 100px 0;
}

.toggle {
  background: linear-gradient(to right, #5c6bc0, #512da8);
  color: #fff;
  height: 100%;
  width: 200%;
  position: relative;
  left: -100%;
  transition: all 0.6s ease-in-out;
}

.form-container.active .toggle {
  transform: translateX(50%);
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
  text-align: center;
  top: 0;
}

.toggle-left {
  transform: translateX(-200%);
}

.form-container.active .toggle-left {
  transform: translateX(0);
}

.toggle-right {
  right: 0;
  transform: translateX(0);
}

.form-container.active .toggle-right {
  transform: translateX(200%);
}

input {
  background-color: #eee;
  border: none;
  margin: 8px 0;
  padding: 10px 15px;
  font-size: 13px;
  border-radius: 8px;
  width: 100%;
  outline: none;
}

button {
  background-color: #512da8;
  color: #fff;
  font-size: 12px;
  padding: 10px 45px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3f1a78;
}

button.hidden {
  background-color: transparent;
  border: 1px solid #fff;
}

button.hidden:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.alert {
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>
