<template>
  <div class="row">
    <div class="col-md-6">
      <h5>Họ tên</h5>
      <p>{{ user.name }}</p>

      <h5>Email</h5>
      <p>{{ user.email }}</p>

      <h5>Mật khẩu</h5>
      <div class="input-group">
        <input :type="showPassword ? 'text' : 'password'" :value="user.password" class="form-control" disabled/>
        <button class="btn btn-outline-secondary" type="button" @click="togglePassword"> <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Lấy user hiện tại đã đăng nhập từ localStorage
const user = ref(JSON.parse(localStorage.getItem('user')) || {
  name: 'Chưa đăng nhập',
  email: '-',
  password: '******',
})

const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>


