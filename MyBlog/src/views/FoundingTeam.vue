<template>
  <div class="founding-team-container">
    <h1 class="page-title">Đội Ngũ Sáng Lập</h1>
    <p class="page-description">Giới thiệu các thành viên chủ chốt đã xây dựng nên INNOVATEVIET.</p>

    <div class="team-grid">
      <div class="team-member-card">
        <img :src="leAnhTuanAvatar" alt="Lê Anh Tuấn Avatar" class="member-avatar">
        <h2 class="member-name">Lê Anh Tuấn</h2>
        <p class="member-role">Trưởng nhóm, phụ trách Frontend + Backend chính (Router + Auth + Layout)</p>
        <div class="member-details">
          <h3>Chức năng chính:</h3>
          <ul>
            <li>Khởi tạo dự án, cấu hình route và xác thực người dùng</li>
          </ul>
          <h3>Nhiệm vụ cụ thể:</h3>
          <ul>
            <li> Khởi tạo project VueJS, cài đặt Bootstrap</li>
            <li> Thiết lập cấu trúc thư mục dự án, tạo layout chính</li>
            <li> Tạo các trang: /login – Trang đăng nhập, /register – Trang đăng ký</li>
            <li> Thiết lập hệ thống xác thực người dùng (login/logout, token giả)</li>
            <li> Cấu hình Vue Router, bảo vệ các route yêu cầu đăng nhập</li>
            <li> Điều hướng giữa các trang, xử lý trạng thái đăng nhập</li>
          </ul>
          <h3>Kỹ năng áp dụng:</h3>
          <p>✨ Vue Router, form binding, event handling, conditional rendering, localStorage</p>
        </div>
      </div>

      <div class="team-member-card">
        <img :src="nguyenGiaBaoAvatar" alt="Nguyễn Gia Bảo Avatar" class="member-avatar">
        <h2 class="member-name">Nguyễn Gia Bảo</h2>
        <p class="member-role">Phụ trách Backend (Dữ liệu + CRUD giả lập)</p>
        <div class="member-details">
          <h3>Chức năng chính:</h3>
          <ul>
            <li>Xử lý dữ liệu bài viết, bình luận và người dùng bằng localStorage</li>
          </ul>
          <h3>Nhiệm vụ cụ thể:</h3>
          <ul>
            <li> Xây dựng module quản lý dữ liệu: user, bài viết, bình luận (CRUD)</li>
            <li> Gắn dữ liệu người dùng vào bài viết và bình luận</li>
            <li> Tạo các hàm: Đăng ký / Đăng nhập, Tạo / sửa / xoá bài viết, Tạo / xoá bình luận</li>
            <li> Lưu trữ và truy xuất dữ liệu bằng localStorage</li>
            <li> Tích hợp dữ liệu với frontend của các thành viên khác</li>
          </ul>
          <h3>Kỹ năng áp dụng:</h3>
          <p>✨ JavaScript thuần, xử lý dữ liệu, quản lý localStorage, phân quyền thao tác</p>
        </div>
      </div>

      <div class="team-member-card">
        <img :src="voTranAnSangAvatar" alt="Võ Trần An Sang Avatar" class="member-avatar">
        <h2 class="member-name">Võ Trần An Sang</h2>
        <p class="member-role">Phụ trách tính năng đăng bài & hiển thị bài viết</p>
        <div class="member-details">
          <h3>Chức năng chính:</h3>
          <ul>
            <li>Tạo bài viết, chỉnh sửa/xoá và hiển thị danh sách bài</li>
          </ul>
          <h3>Nhiệm vụ cụ thể:</h3>
          <ul>
            <li> Trang /post/create – Form tạo bài viết (tiêu đề, nội dung, ảnh)</li>
            <li> Hiển thị danh sách bài viết (dùng list rendering)</li>
            <li> Tạo chức năng sửa, xoá bài viết với xác nhận</li>
            <li> Gắn liên kết bài viết với người đăng</li>
            <li> Thiết kế UI bài viết bằng Bootstrap Cards/List</li>
          </ul>
          <h3>Kỹ năng áp dụng:</h3>
          <p>✨ CRUD, data binding, list rendering, sự kiện click/submit, Bootstrap UI</p>
        </div>
      </div>

      <div class="team-member-card">
        <img :src="trinhTrungHieuAvatar" alt="Trình Trung Hiếu Avatar" class="member-avatar">
        <h2 class="member-name">Trình Trung Hiếu</h2>
        <p class="member-role">Phụ trách bình luận + Kiểm thử chức năng (Tester chính)</p>
        <div class="member-details">
          <h3>Chức năng chính:</h3>
          <ul>
            <li>Xây dựng phần bình luận và kiểm thử toàn bộ ứng dụng</li>
          </ul>
          <h3>Nhiệm vụ cụ thể:</h3>
          <ul>
            <li> Hiển thị bình luận dưới bài viết (tên, nội dung, thời gian)</li>
            <li> Form nhập bình luận cho người dùng đã đăng nhập</li>
            <li> Cho phép xoá bình luận của chính mình</li>
            <li> Lập checklist kiểm thử: đăng nhập, đăng bài, bình luận, chỉnh sửa hồ sơ</li>
            <li> Viết file README.md, hướng dẫn cài đặt và sử dụng project</li>
            <li> Góp ý giao diện, kiểm tra lỗi và phối hợp sửa</li>
          </ul>
          <h3>Kỹ năng áp dụng:</h3>
          <p>✨ Component lồng nhau, props/emit, kiểm thử thủ công, UX review</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Hàm trợ giúp để tạo URL động cho tài sản trong thư mục src/assets/images/
const getAssetUrl = (path) => {
  // `import.meta.url` là một tính năng của ES Modules trong Vite (Vue 3 mặc định dùng Vite)
  // Nó cho phép bạn xây dựng một URL tương đối đến một tài sản tĩnh
  return new URL(`../assets/images/${path}`, import.meta.url).href;
};

// Import các hình ảnh cụ thể cho từng thành viên
import leAnhTuanAvatar from '../assets/images/at.jpg';
import nguyenGiaBaoAvatar from '../assets/images/ngb.jpg'; 
import voTranAnSangAvatar from '../assets/images/vtas.jpg'; 
import trinhTrungHieuAvatar from '../assets/images/tth.jpg';
</script>

<style scoped>
.founding-team-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #333;
}

.page-title {
  font-size: 3em;
  color: #512da8;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-description {
  font-size: 1.2em;
  color: #666;
  text-align: center;
  margin-bottom: 50px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Đã thay đổi để có 4 cột bằng nhau */
  gap: 20px; /* Giảm khoảng cách giữa các cột để phù hợp hơn */
}

.team-member-card {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px; /* Giảm padding để tiết kiệm không gian */
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.team-member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
}

.member-avatar {
  width: 140px; /* Điều chỉnh kích thước avatar nhỏ hơn để vừa 4 cột */
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px; /* Giảm khoảng cách */
  align-self: center;
  border: 3px solid #5c6bc0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.member-name {
  font-size: 1.5em; /* Điều chỉnh font size nhỏ hơn */
  color: #5c6bc0;
  margin-bottom: 8px; /* Giảm khoảng cách */
  font-weight: 600;
  text-align: center; /* Căn giữa tên */
}

.member-role {
  font-size: 0.95em; /* Điều chỉnh font size nhỏ hơn */
  color: #777;
  margin-bottom: 15px; /* Giảm khoảng cách */
  font-style: italic;
  text-align: center; /* Căn giữa vai trò */
}

.member-details h3 {
  font-size: 1.05em; /* Điều chỉnh font size nhỏ hơn */
  color: #512da8;
  margin-top: 20px; /* Giảm khoảng cách */
  margin-bottom: 8px; /* Giảm khoảng cách */
  font-weight: 600;
}

.member-details ul {
  list-style: none;
  padding: 0;
  margin-bottom: 10px; /* Giảm khoảng cách */
}

.member-details ul li {
  font-size: 0.9em; /* Điều chỉnh font size nhỏ hơn */
  line-height: 1.5; /* Giảm line-height */
  color: #555;
  margin-bottom: 3px; /* Giảm khoảng cách */
  position: relative;
  padding-left: 20px; /* Giảm khoảng cách cho dấu tích */
}

.member-details ul li::before {
  content: '✓';
  color: #4CAF50;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

.member-details p {
  font-size: 0.9em; /* Điều chỉnh font size nhỏ hơn */
  color: #555;
  line-height: 1.5; /* Giảm line-height */
}

.member-details p.skill-highlight {
  font-weight: bold;
  color: #512da8;
}

/* Responsive adjustments */
@media (max-width: 992px) { /* Thay đổi breakpoint để chuyển từ 4 cột sang 2 cột sớm hơn */
  .team-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 cột trên màn hình vừa */
    gap: 25px;
  }
  .member-avatar {
    width: 160px;
    height: 160px;
  }
  .member-name {
    font-size: 1.6em;
  }
  .member-role {
    font-size: 1.05em;
  }
  .member-details h3 {
    font-size: 1.1em;
  }
  .member-details ul li,
  .member-details p {
    font-size: 0.9em;
  }
}

@media (max-width: 768px) {
  .founding-team-container {
    padding: 20px;
  }

  .page-title {
    font-size: 2.5em;
  }

  .page-description {
    font-size: 1em;
    margin-bottom: 30px;
  }

  .team-grid {
    grid-template-columns: 1fr; /* Stack cards on small screens */
    gap: 20px;
  }

  .team-member-card {
    padding: 20px;
    align-items: center; /* Căn giữa nội dung trong card khi ở 1 cột */
  }

  .member-avatar {
    width: 120px; /* Điều chỉnh kích thước trên màn hình di động */
    height: 120px;
  }
  .member-name {
    font-size: 1.5em;
  }

  .member-role {
    font-size: 1em;
  }

  .member-details h3 {
    font-size: 1.1em;
  }

  .member-details ul li,
  .member-details p {
    font-size: 0.9em;
    text-align: left; /* Đảm bảo text-align vẫn là left trong ul */
  }
  .member-details ul {
    width: 100%; /* Đảm bảo ul chiếm đủ chiều rộng */
  }
}

@media (max-width: 480px) {
  .member-avatar {
    width: 100px;
    height: 100px;
  }
  .member-name {
    font-size: 1.4em;
  }
  .member-role {
    font-size: 0.9em;
  }
  .member-details ul li,
  .member-details p {
    font-size: 0.85em;
  }
}
</style>
