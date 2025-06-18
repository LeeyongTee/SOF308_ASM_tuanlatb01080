<template>
  <div class="dashboard-page container my-5">
    <div class="header-section text-center mb-5">
      <h1 class="dashboard-title">Bảng Điều Khiển Tổng Quan</h1>
      <p class="dashboard-subtitle">Chào mừng trở lại! Nơi đây hiển thị cái nhìn tổng quan về hệ thống và các hoạt động chính.</p>
    </div>

    <!-- Phần số liệu chính -->
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <router-link to="/blogs" class="text-decoration-none">
          <div class="metric-card bg-gradient-blue rounded-lg shadow-soft p-4 flex items-center justify-between transition-hover">
            <div class="flex items-center">
              <div class="metric-icon"><i class="fas fa-users"></i></div>
              <div>
                <p class="metric-label">Tổng người dùng</p>
                <p class="metric-value">{{ totalUsers }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link to="/blogs" class="text-decoration-none">
          <div class="metric-card bg-gradient-green rounded-lg shadow-soft p-4 flex items-center justify-between transition-hover">
            <div class="flex items-center">
              <div class="metric-icon"><i class="fas fa-file-alt"></i></div>
              <div>
                <p class="metric-label">Tổng bài viết</p>
                <p class="metric-value">{{ totalPosts }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div class="col-md-4">
        <router-link :to="{ path: '/blogs', query: { tab: 'videos' }}" class="text-decoration-none">
          <div class="metric-card bg-gradient-purple rounded-lg shadow-soft p-4 flex items-center justify-between transition-hover">
            <div class="flex items-center">
              <div class="metric-icon"><i class="fas fa-video"></i></div>
              <div>
                <p class="metric-label">Tổng Video</p>
                <p class="metric-value">{{ totalVideos }}</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Phần biểu đồ -->
    <div class="row g-4 mb-5">
      <div class="col-md-6">
        <div class="chart-card card shadow-soft border-0 rounded-lg p-4 transition-hover">
          <h5 class="card-title mb-4 text-center">Tỷ lệ Bài viết & Video</h5>
          <canvas id="postsVideosChart"></canvas>
        </div>
      </div>
      <div class="col-md-6">
        <div class="chart-card card shadow-soft border-0 rounded-lg p-4 transition-hover">
          <h5 class="card-title mb-4 text-center">Trạng thái Người dùng</h5>
          <canvas id="userStatusChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Bảng người dùng gần đây -->
    <div class="card shadow-soft border-0 rounded-lg recent-users-card transition-hover">
      <div class="card-body p-4">
        <h5 class="card-title mb-4">Người dùng gần đây</h5>
        <div class="table-responsive">
          <table class="table table-hover table-striped">
            <thead class="table-header">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in recentUsers" :key="user.email">
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td><span :class="{ 'badge': true, 'bg-success': user.status === 'Hoạt động','bg-danger': user.status === 'Không hoạt động'}">{{ user.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="recentUsers.length === 0" class="text-center text-muted py-3">Không có người dùng nào để hiển thị.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Chart from 'chart.js/auto'; // Import Chart.js
import { users, posts, videos } from '../data/staticData'; // Import tất cả dữ liệu tĩnh cần thiết

// Tính toán tổng số người dùng, bài viết và video
const totalUsers = computed(() => users.value.length);
const totalPosts = computed(() => posts.value.length);
const totalVideos = computed(() => videos.value.length);

// Dữ liệu giả định cho người dùng gần đây
const recentUsers = computed(() => {
  return users.value.slice(0, 6).map(user => ({
    ...user,
    status: Math.random() > 0.6 ? 'Hoạt động' : 'Không hoạt động' // Trạng thái ngẫu nhiên để minh họa
  }));
});

let postsVideosChart = null;
let userStatusChart = null;

// Hàm để render biểu đồ bài viết và video
const renderPostsVideosChart = () => {
  if (postsVideosChart) {
    postsVideosChart.destroy(); // Hủy biểu đồ cũ nếu có
  }
  const ctx = document.getElementById('postsVideosChart').getContext('2d');
  postsVideosChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Bài viết', 'Video'],
      datasets: [{
        data: [totalPosts.value, totalVideos.value],
        backgroundColor: ['#6a00f0', '#00bcd4'], // Màu sắc đẹp mắt
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Inter',
              size: 14,
            },
            color: '#444'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('vi-VN').format(context.parsed) + ' mục';
              }
              return label;
            }
          }
        }
      }
    }
  });
};

// Hàm để render biểu đồ trạng thái người dùng
const renderUserStatusChart = () => {
  if (userStatusChart) {
    userStatusChart.destroy(); // Hủy biểu đồ cũ nếu có
  }

  const activeUsers = recentUsers.value.filter(user => user.status === 'Hoạt động').length;
  const inactiveUsers = recentUsers.value.length - activeUsers;

  const ctx = document.getElementById('userStatusChart').getContext('2d');
  userStatusChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Hoạt động', 'Không hoạt động'],
      datasets: [{
        data: [activeUsers, inactiveUsers],
        backgroundColor: ['#28a745', '#dc3545'], // Màu xanh lá và đỏ
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              family: 'Inter',
              size: 14,
            },
            color: '#444'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('vi-VN').format(context.parsed) + ' người';
              }
              return label;
            }
          }
        }
      }
    }
  });
};

// Gọi render biểu đồ khi component được mount
onMounted(() => {
  renderPostsVideosChart();
  renderUserStatusChart();
});

// Hủy biểu đồ khi component bị unmount để tránh rò rỉ bộ nhớ
onUnmounted(() => {
  if (postsVideosChart) {
    postsVideosChart.destroy();
  }
  if (userStatusChart) {
    userStatusChart.destroy();
  }
});
</script>

<style scoped>
/* Google Font: Poppins cho kiểu chữ hiện đại và sang trọng */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.dashboard-page {
  font-family: 'Poppins', sans-serif;
  color: #333;
  background-color: #ffffff; /* Nền màu trắng */
  padding-top: 30px;
  padding-bottom: 30px;
}

.header-section {
  padding: 20px 0;
}

.dashboard-title {
  font-size: 3rem; /* Lớn hơn */
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 15px;
  letter-spacing: -0.05em;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.05);
}

.dashboard-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 700px;
  margin: 0 auto;
}

/* Hiệu ứng chuyển động chung */
.transition-hover {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Shadow mềm mại */
.shadow-soft {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05),
              0 15px 30px rgba(0, 0, 0, 0.05);
}

.shadow-soft:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08),
              0 20px 40px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px);
}

/* Thẻ số liệu */
.metric-card {
  border-radius: 12px;
  background-color: #ffffff; /* Đảm bảo nền trắng ban đầu */
  border: 1px solid rgba(0,0,0,0.05); /* Viền mỏng */
  position: relative;
  overflow: hidden;
  display: flex; /* Đảm bảo căn chỉnh nội dung */
  align-items: center;
}

/* Gradient cho metric-card */
/* ĐÃ CẬP NHẬT: Màu sắc giống với Navbar */
.bg-gradient-blue { background: linear-gradient(135deg, #5c6bc0 0%, #512da8 100%); color: #fff; }
.bg-gradient-green { background: linear-gradient(135deg, #673ab7 0%, #5c6bc0 100%); color: #fff; }
.bg-gradient-purple { background: linear-gradient(135deg, #512da8 0%, #673ab7 100%); color: #fff; }


.metric-card .metric-icon {
  width: 70px; /* Lớn hơn */
  height: 70px; /* Lớn hơn */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem; /* Lớn hơn */
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2); /* Icon background trong suốt */
  margin-right: 20px; /* Khoảng cách lớn hơn */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  flex-shrink: 0; /* Ngăn icon bị thu nhỏ */
}

.metric-card .metric-label {
  font-size: 1.1rem; /* Lớn hơn */
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9); /* Màu trắng nhạt cho label */
  margin-bottom: 5px;
}

.metric-card .metric-value {
  font-size: 2.8rem; /* Lớn hơn nhiều */
  font-weight: 700;
  color: #ffffff; /* Màu trắng cho giá trị */
  line-height: 1;
}

/* Card biểu đồ */
.chart-card {
  background-color: #ffffff;
  border-radius: 12px;
  height: 400px; /* Chiều cao cố định cho biểu đồ */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Căn giữa nội dung biểu đồ */
}

.chart-card .card-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Bảng người dùng gần đây */
.recent-users-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05); /* Viền mỏng */
}

.recent-users-card .card-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

.table th, .table td {
  padding: 18px; /* Tăng padding */
  vertical-align: middle;
  border-top: 1px solid #f0f0f0; /* Viền bảng mỏng hơn */
  color: #444444;
}

.table thead th {
  background-color: #f8f9fa; /* Nền đầu bảng */
  color: #555;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.95rem;
  border-bottom: 2px solid #e9ecef;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f5f5f5; /* Nền nhẹ hơn khi hover */
}

.badge {
  padding: 0.7em 1.2em; /* Tăng padding */
  border-radius: 50px;
  font-size: 0.9em;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.badge.bg-success {
  background-color: #28a745 !important;
  color: #fff;
}

.badge.bg-danger {
  background-color: #dc3545 !important;
  color: #fff;
}

/* Điều chỉnh đáp ứng */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 2.5rem;
  }
  .dashboard-subtitle {
    font-size: 1.1rem;
  }
  .metric-card {
    padding: 25px;
  }
  .metric-icon {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
    margin-right: 15px;
  }
  .metric-value {
    font-size: 2.2rem;
  }
  .chart-card {
    height: 350px;
  }
  .recent-users-card .card-title {
    font-size: 1.4rem;
  }
  .table th, .table td {
    padding: 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .dashboard-title {
    font-size: 2rem;
  }
  .dashboard-subtitle {
    font-size: 0.9rem;
  }
  .metric-card {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
  }
  .metric-icon {
    margin-bottom: 10px;
    margin-right: 0;
  }
  .metric-value {
    font-size: 2rem;
  }
  .chart-card {
    height: 300px;
  }
  .recent-users-card .card-title {
    font-size: 1.2rem;
  }
  .table th, .table td {
    padding: 10px;
    font-size: 0.85rem;
  }
  .badge {
    padding: 0.5em 0.9em;
    font-size: 0.8em;
  }
}
</style>
