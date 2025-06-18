<template>
  <div class="user-settings-modern-wrapper">
    <h3 class="settings-main-title">Cài đặt tài khoản</h3>
    <p class="settings-description">Tùy chỉnh các thiết lập tài khoản và quản lý quyền truy cập hệ thống của bạn.</p>

    <div class="settings-section-card shadow-sm mb-4">
      <div class="section-header">
        <i class="bi bi-person-circle section-icon"></i>
        <h4 class="section-title">Thông tin cá nhân & Chung</h4>
      </div>
      <div class="section-content">
        <form @submit.prevent="saveGeneralSettings">
          <div class="mb-3">
            <label for="displayName" class="form-label">Tên hiển thị</label>
            <input type="text" class="form-control" id="displayName" v-model="settings.general.displayName" placeholder="Họ tên của bạn">
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" v-model="settings.general.email" disabled>
            <div class="form-text">Email là tài khoản chính, không thể thay đổi trực tiếp.</div>
          </div>
          <div class="mb-3">
            <label for="language" class="form-label">Ngôn ngữ giao diện</label>
            <select class="form-select" id="language" v-model="settings.general.language">
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
          <button type="submit" class="btn-save-settings">Lưu thay đổi chung</button>
        </form>
      </div>
    </div>

    <div class="settings-section-card shadow-sm mb-4">
      <div class="section-header">
        <i class="bi bi-shield-check section-icon"></i>
        <h4 class="section-title">Bảo mật tài khoản</h4>
      </div>
      <div class="section-content">
        <h5 class="sub-section-title">Đổi mật khẩu</h5>
        <form @submit.prevent="savePasswordSettings" class="mb-4">
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Mật khẩu hiện tại</label>
            <input type="password" class="form-control" id="currentPassword" v-model="settings.security.currentPassword" placeholder="Nhập mật khẩu hiện tại">
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Mật khẩu mới</label>
            <input type="password" class="form-control" id="newPassword" v-model="settings.security.newPassword" placeholder="Nhập mật khẩu mới">
          </div>
          <div class="mb-3">
            <label for="confirmNewPassword" class="form-label">Xác nhận mật khẩu mới</label>
            <input type="password" class="form-control" id="confirmNewPassword" v-model="settings.security.confirmNewPassword" placeholder="Xác nhận mật khẩu mới">
          </div>
          <button type="submit" class="btn-save-settings">Đổi mật khẩu</button>
        </form>

        <h5 class="sub-section-title mt-4">Xác thực 2 yếu tố (2FA)</h5>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="twoFactorAuth" v-model="settings.security.twoFactorAuthEnabled" @change="toggleTwoFactorAuth">
          <label class="form-check-label" for="twoFactorAuth">
            {{ settings.security.twoFactorAuthEnabled ? 'Đã bật 2FA' : 'Tắt 2FA' }}
          </label>
        </div>
        <div v-if="!settings.security.twoFactorAuthEnabled" class="alert alert-info small-text">
          Bật 2FA để tăng cường bảo mật cho tài khoản của bạn.
        </div>
        <div v-else class="alert alert-success small-text">
          2FA đang hoạt động. Vui lòng giữ bí mật mã dự phòng.
        </div>
        <button v-if="!settings.security.twoFactorAuthEnabled" @click="setupTwoFactorAuth" class="btn-save-settings btn-small mt-2">Thiết lập 2FA</button>
        <button v-else @click="disableTwoFactorAuth" class="btn-delete-settings btn-small mt-2">Vô hiệu hóa 2FA</button>
      </div>
    </div>

    <div class="settings-section-card shadow-sm mb-4">
      <div class="section-header">
        <i class="bi bi-key-fill section-icon"></i>
        <h4 class="section-title">Quản lý API Keys</h4>
      </div>
      <div class="section-content">
        <p class="small-text text-muted">API Keys cho phép các ứng dụng bên ngoài tương tác với hệ thống của bạn. Hãy bảo mật chúng!</p>
        <div class="api-key-list mb-3">
          <div v-if="settings.apiKeys.length === 0" class="alert alert-warning">
            Bạn chưa có API Key nào.
          </div>
          <div v-for="(key, index) in settings.apiKeys" :key="key.id || index" class="api-key-item">
            <span class="api-key-value">**** **** **** {{ key.value.slice(-4) }}</span>
            <span class="api-key-status" :class="{'active': key.status === 'active', 'inactive': key.status === 'inactive'}">{{ key.status === 'active' ? 'Đang hoạt động' : 'Đã thu hồi' }}</span>
            <div class="api-key-actions">
              <button @click="copyApiKey(key)" class="btn-action btn-copy" title="Sao chép"><i class="bi bi-clipboard"></i></button>
              <button v-if="key.status === 'active'" @click="revokeApiKey(key)" class="btn-action btn-revoke" title="Thu hồi"><i class="bi bi-x-lg"></i></button>
              <button v-else @click="reactivateApiKey(key)" class="btn-action btn-reactivate" title="Kích hoạt lại"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
        </div>
        <button @click="generateNewApiKey" class="btn-save-settings">Tạo API Key mới</button>
      </div>
    </div>

    <div class="settings-section-card shadow-sm mb-4">
      <div class="section-header">
        <i class="bi bi-bell-fill section-icon"></i>
        <h4 class="section-title">Cài đặt thông báo</h4>
      </div>
      <div class="section-content">
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="emailNotifications" v-model="settings.notifications.emailNotifications">
          <label class="form-check-label" for="emailNotifications">Thông báo qua Email</label>
        </div>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="pushNotifications" v-model="settings.notifications.pushNotifications">
          <label class="form-check-label" for="pushNotifications">Thông báo đẩy (Push Notifications)</label>
        </div>
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="smsNotifications" v-model="settings.notifications.smsNotifications">
          <label class="form-check-label" for="smsNotifications">Thông báo qua SMS</label>
        </div>
        <button @click="saveNotificationSettings" class="btn-save-settings">Lưu cài đặt thông báo</button>
      </div>
    </div>

    <div class="settings-section-card shadow-sm mb-4">
      <div class="section-header">
        <i class="bi bi-clock-history section-icon"></i>
        <h4 class="section-title">Lịch sử hoạt động</h4>
      </div>
      <div class="section-content">
        <p class="small-text text-muted">Xem lại các hoạt động gần đây và phiên đăng nhập của bạn.</p>
        <div class="activity-log-list">
          <div v-if="settings.activityLog.length === 0" class="alert alert-info">Chưa có hoạt động nào gần đây.</div>
          <div v-for="(log, index) in settings.activityLog" :key="index" class="activity-log-item">
            <span class="log-time">{{ log.time }}</span> -
            <span class="log-device">{{ log.device }}</span> -
            <span class="log-location">{{ log.location }}</span> -
            <span class="log-action">{{ log.action }}</span>
            <button v-if="log.action === 'Đăng nhập thành công' && log.device !== 'Thiết bị hiện tại'" @click="revokeSession(log)" class="btn-action btn-revoke-session" title="Thu hồi phiên"><i class="bi bi-power"></i></button>
          </div>
        </div>
        <button @click="loadMoreActivity" class="btn-save-settings btn-small mt-3">Tải thêm</button>
      </div>
    </div>

    <div class="settings-section-card shadow-sm delete-account-section">
      <div class="section-header">
        <i class="bi bi-exclamation-triangle-fill section-icon text-danger"></i>
        <h4 class="section-title text-danger">Vùng nguy hiểm</h4>
      </div>
      <div class="section-content">
        <h5 class="sub-section-title">Xóa tài khoản</h5>
        <p class="text-danger small-text">Hành động này sẽ **xóa vĩnh viễn** tài khoản và tất cả dữ liệu của bạn. Không thể hoàn tác.</p>
        <button @click="confirmDeleteAccount" class="btn-delete-account">Xóa tài khoản vĩnh viễn</button>

        <h5 class="sub-section-title mt-4">Reset cài đặt về mặc định</h5>
        <p class="text-muted small-text">Đặt lại tất cả các cài đặt về trạng thái ban đầu của hệ thống.</p>
        <button @click="confirmResetSettings" class="btn-delete-settings">Reset tất cả cài đặt</button>
      </div>
    </div>

    <!-- Added mt-5 class to increase top margin -->
    <div class="settings-section-card shadow-sm logout-section mt-5"> 
      <div class="section-header">
        <i class="bi bi-box-arrow-right section-icon text-info"></i>
        <h4 class="section-title text-info">Đăng xuất</h4>
      </div>
      <div class="section-content">
        <p class="small-text text-muted">Đăng xuất khỏi tài khoản của bạn khỏi tất cả các thiết bị hoặc chỉ thiết bị hiện tại.</p>
        <button @click="logout" class="btn-logout">Đăng xuất</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { userDisplayName, userEmail, logout as authLogout, updateCurrentUser } from '../router/auth';
import { updatePasswordInUsers, getUserPasswordFromUsers, getAllUsers, saveAllUsers } from '../utils/userManagement'; 

const INITIAL_APP_DEFAULT_PASSWORD = ''; 

const getLocalStorageKey = (email) => {
  return email ? `userSettings_${email.replace(/[^a-zA-Z0-9]/g, '_')}` : 'guestSettings';
};

const defaultSettings = {
  general: {
    displayName: '',
    email: '',
    language: 'vi',
  },
  security: {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    twoFactorAuthEnabled: false,
    storedPassword: '', 
  },
  apiKeys: [],
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  },
  activityLog: [],
};

const settings = ref(JSON.parse(JSON.stringify(defaultSettings)));

const saveSettingsToLocalStorage = () => {
  const currentKey = getLocalStorageKey(userEmail.value); 
  try {
    const settingsToSave = JSON.parse(JSON.stringify(settings.value));
    delete settingsToSave.general.email;
    delete settingsToSave.general.displayName;
    localStorage.setItem(currentKey, JSON.stringify(settingsToSave));
    console.log(`[UserProfile] Cài đặt cho ${userEmail.value || 'khách'} đã được lưu vào Local Storage.`);
  } catch (e) {
    console.error('[UserProfile] Lỗi khi lưu cài đặt vào Local Storage:', e);
  }
};

const loadSettingsFromLocalStorage = () => {
  const currentKey = getLocalStorageKey(userEmail.value); 
  try {
    const storedSettings = localStorage.getItem(currentKey);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      
      settings.value = {
        ...JSON.parse(JSON.stringify(defaultSettings)), 
        ...parsedSettings, 
        general: {
          ...JSON.parse(JSON.stringify(defaultSettings.general)),
          ...(parsedSettings.general || {}),
        },
        security: {
          ...JSON.parse(JSON.stringify(defaultSettings.security)),
          ...(parsedSettings.security || {}),
          storedPassword: getUserPasswordFromUsers(userEmail.value) || INITIAL_APP_DEFAULT_PASSWORD, 
        },
        notifications: {
          ...JSON.parse(JSON.stringify(defaultSettings.notifications)),
          ...(parsedSettings.notifications || {}),
        },
      };
      console.log(`[UserProfile] Cài đặt cho ${userEmail.value || 'khách'} đã được tải từ Local Storage.`);
    } else {
      console.log(`[UserProfile] Không tìm thấy cài đặt cho ${userEmail.value || 'khách'} trong Local Storage, sử dụng mặc định.`);
      settings.value = JSON.parse(JSON.stringify(defaultSettings));
      settings.value.security.storedPassword = getUserPasswordFromUsers(userEmail.value) || INITIAL_APP_DEFAULT_PASSWORD;
      saveSettingsToLocalStorage(); 
    }
    settings.value.general.email = userEmail.value;
    settings.value.general.displayName = userDisplayName.value;
  } catch (e) {
    console.error('[UserProfile] Lỗi khi tải cài đặt từ Local Storage:', e);
    settings.value = JSON.parse(JSON.stringify(defaultSettings));
    settings.value.security.storedPassword = getUserPasswordFromUsers(userEmail.value) || INITIAL_APP_DEFAULT_PASSWORD; 
  }
};

onMounted(() => {
  loadSettingsFromLocalStorage();
});

watch(userEmail, (newEmail, oldEmail) => {
  if (newEmail !== oldEmail) {
    console.log(`[UserProfile] Email thay đổi từ ${oldEmail || 'không có'} thành ${newEmail || 'không có'}. Tải cài đặt mới.`);
    loadSettingsFromLocalStorage(); 
  }
});

const saveGeneralSettings = () => {
  console.log('[UserProfile] Đang lưu cài đặt chung:', settings.value.general);
  // Pass name and email, assuming that the 'name' field in currentUser
  // is updated from settings.general.displayName, and email remains constant.
  updateCurrentUser({ name: settings.value.general.displayName, email: settings.value.general.email }); 
  alert('Cài đặt chung đã được lưu!');
  saveSettingsToLocalStorage(); 
};

const savePasswordSettings = () => {
  const { currentPassword, newPassword, confirmNewPassword } = settings.value.security;
  console.log('[UserProfile] --- Debug Mật khẩu ---');
  console.log('[UserProfile] Email của người dùng hiện tại:', userEmail.value);
  console.log('[UserProfile] Mật khẩu hiện tại người dùng nhập (currentPassword):', currentPassword);
  console.log('[UserProfile] Mật khẩu mới người dùng nhập (newPassword):', newPassword);
  console.log('[UserProfile] Xác nhận mật khẩu mới người dùng nhập (confirmNewPassword):', confirmNewPassword);
  
  const actualStoredPassword = getUserPasswordFromUsers(userEmail.value);
  console.log('[UserProfile] Mật khẩu thực sự được lưu trữ từ userManagement:', actualStoredPassword);

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    alert('Vui lòng điền đủ các trường mật khẩu.');
    return;
  }
  
  if (actualStoredPassword === null) {
    alert('Không tìm thấy mật khẩu hiện tại của người dùng. Vui lòng thử đăng xuất và đăng nhập lại.');
    console.error('[UserProfile] Lỗi: getUserPasswordFromUsers trả về null. Người dùng không tìm thấy hoặc không có mật khẩu.');
    return;
  }
  if (currentPassword !== actualStoredPassword) {
    alert('Mật khẩu hiện tại không đúng.');
    settings.value.security.currentPassword = ''; 
    return;
  }
  if (newPassword !== confirmNewPassword) {
    alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
    return;
  }
  if (newPassword.length < 6) { 
    alert('Mật khẩu mới phải có ít nhất 6 ký tự.');
    return;
  }
  if (newPassword === currentPassword) {
    alert('Mật khẩu mới không được trùng với mật khẩu hiện tại!');
    return;
  }
  if (newPassword === '') {
    alert('Mật khẩu mới không được để trống!');
    return;
  }
  const updateSuccess = updatePasswordInUsers(userEmail.value, newPassword);
  if (updateSuccess) {
    settings.value.security.storedPassword = newPassword; 
    alert('Mật khẩu đã được đổi thành công!');
    settings.value.security.currentPassword = '';
    settings.value.security.newPassword = '';
    settings.value.security.confirmNewPassword = '';
    addActivityLog('Đổi mật khẩu');
  } else {
    alert('Không thể cập nhật mật khẩu. Vui lòng thử lại.');
    console.error('[UserProfile] Lỗi: updatePasswordInUsers trả về false.');
  }
};

const toggleTwoFactorAuth = () => {
  // This function is just a placeholder to keep the code valid.
  // The actual logic for toggling 2FA would be more complex.
};

const setupTwoFactorAuth = () => {
  alert('Bắt đầu thiết lập xác thực 2 yếu tố. Vui lòng quét mã QR hoặc nhập mã thủ công. (Mô phỏng: 2FA đã được bật)');
  settings.value.security.twoFactorAuthEnabled = true;
  addActivityLog('Bật Xác thực 2 yếu tố');
  saveSettingsToLocalStorage();
};

const disableTwoFactorAuth = () => {
  if (confirm('Bạn có chắc chắn muốn vô hiệu hóa xác thực 2 yếu tố? Điều này làm giảm bảo mật tài khoản.')) {
    alert('Xác thực 2 yếu tố đã được vô hiệu hóa.');
    settings.value.security.twoFactorAuthEnabled = false;
    addActivityLog('Vô hiệu hóa Xác thực 2 yếu tố');
    saveSettingsToLocalStorage();
  }
};

const generateNewApiKey = () => {
  const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const newId = `key_${Date.now()}`;
  settings.value.apiKeys.push({ id: newId, value: newKey, status: 'active' });
  alert('Đã tạo API Key mới. Vui lòng sao chép ngay!');
  addActivityLog('Tạo API Key mới');
  saveSettingsToLocalStorage();
};

const copyApiKey = (key) => {
  navigator.clipboard.writeText(key.value).then(() => {
    alert('API Key đã được sao chép vào clipboard!');
  }).catch(err => {
    console.error('Lỗi khi sao chép API Key:', err);
    alert('Lỗi khi sao chép API Key.');
  });
};

const revokeApiKey = (keyToRevoke) => {
  if (confirm(`Bạn có chắc chắn muốn thu hồi API Key này (${keyToRevoke.value.slice(-4)})? Các ứng dụng sử dụng nó sẽ không hoạt động.`)) {
    const keyIndex = settings.value.apiKeys.findIndex(key => key.id === keyToRevoke.id);
    if (keyIndex !== -1) {
      settings.value.apiKeys[keyIndex].status = 'inactive';
      alert('API Key đã được thu hồi.');
      addActivityLog(`Thu hồi API Key: ${keyToRevoke.value.slice(-4)}`);
      saveSettingsToLocalStorage();
    }
  }
};

const reactivateApiKey = (keyToReactivate) => {
  if (confirm(`Bạn có chắc chắn muốn kích hoạt lại API Key này (${keyToReactivate.value.slice(-4)})?`)) {
    const keyIndex = settings.value.apiKeys.findIndex(key => key.id === keyToReactivate.id);
    if (keyIndex !== -1) {
      settings.value.apiKeys[keyIndex].status = 'active';
      alert('API Key đã được kích hoạt lại.');
      addActivityLog(`Kích hoạt lại API Key: ${keyToReactivate.value.slice(-4)}`);
      saveSettingsToLocalStorage();
    }
  }
};

const saveNotificationSettings = () => {
  console.log('[UserProfile] Đang lưu cài đặt thông báo:', settings.value.notifications);
  alert('Cài đặt thông báo đã được lưu!');
  saveSettingsToLocalStorage();
};

const formatActivityTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const addActivityLog = (action) => {
  const device = 'Thiết bị hiện tại (Mô phỏng)';
  const location = 'Vị trí hiện tại (Mô phỏng)';
  settings.value.activityLog.unshift({ 
    time: formatActivityTime(),
    device: device,
    location: location,
    action: action,
  });
  if (settings.value.activityLog.length > 20) {
    settings.value.activityLog.pop(); 
  }
  saveSettingsToLocalStorage(); 
};

const revokeSession = (logToRevoke) => {
  if (confirm(`Bạn có muốn thu hồi phiên đăng nhập từ ${logToRevoke.device} vào lúc ${logToRevoke.time}?`)) {
    console.log('[UserProfile] Đang thu hồi phiên:', logToRevoke);
    settings.value.activityLog = settings.value.activityLog.filter(log => log !== logToRevoke);
    alert('Phiên đăng nhập đã được thu hồi.');
    addActivityLog(`Thu hồi phiên từ ${logToRevoke.device}`);
    saveSettingsToLocalStorage(); 
  }
};

const loadMoreActivity = () => {
  alert('Đang tải thêm lịch sử hoạt động... (Mô phỏng)');
  settings.value.activityLog.push(
    { time: formatActivityTime(), device: 'Mobile App on iOS (Mô phỏng)', location: 'Đà Nẵng, VN (Mô phỏng)', action: 'Đăng xuất' },
    { time: formatActivityTime(), device: 'Chrome on Windows (Mô phỏng)', location: 'Hà Nội, VN (Mô phỏng)', action: 'Cập nhật hồ sơ' }
  );
  saveSettingsToLocalStorage(); 
};

const confirmDeleteAccount = () => {
  if (confirm('CẢNH BÁO: Hành động này sẽ xóa VĨNH VIỄN tài khoản và tất cả dữ liệu của bạn. KHÔNG THỂ HOÀN TÁC! Bạn có chắc chắn muốn tiếp tục?')) {
    const confirmationText = prompt('Để xác nhận, vui lòng nhập "XOA TAI KHOAN" vào ô bên dưới:');
    if (confirmationText === 'XOA TAI KHOAN') {
      console.log('[UserProfile] Yêu cầu xóa tài khoản đã được xác nhận');
      alert('Tài khoản của bạn đang được xóa. Vui lòng chờ...');
      
      let allUsers = getAllUsers(); 
      allUsers = allUsers.filter(user => user.email !== userEmail.value); 
      saveAllUsers(allUsers); 

      authLogout(); 

      alert('Tài khoản của bạn đã được xóa vĩnh viễn và dữ liệu đã được đặt lại.');
      
      window.location.reload(); 
    } else {
      alert('Văn bản xác nhận không đúng. Yêu cầu xóa tài khoản đã bị hủy.');
    }
  }
};

const confirmResetSettings = () => {
  if (confirm('Bạn có chắc chắn muốn đặt lại TẤT CẢ các cài đặt về trạng thái mặc định của hệ thống? Hành động này không thể hoàn tác một số cài đặt.')) {
    console.log('[UserProfile] Yêu cầu đặt lại cài đặt');
    const currentStoredPassword = getUserPasswordFromUsers(userEmail.value); 
    settings.value = JSON.parse(JSON.stringify(defaultSettings));
    settings.value.general.email = userEmail.value;
    settings.value.general.displayName = userDisplayName.value;
    settings.value.security.storedPassword = currentStoredPassword || INITIAL_APP_DEFAULT_PASSWORD; 
    
    addActivityLog('Reset tất cả cài đặt về mặc định');
    saveSettingsToLocalStorage(); 
    alert('Tất cả cài đặt đã được đặt lại về mặc định.');
  }
};

const logout = () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình?')) {
    console.log('[UserProfile] Người dùng đang đăng xuất...');
    authLogout(); 
    
    alert('Bạn đã đăng xuất thành công.'); 
    window.location.reload(); 
  }
};
</script>


<style scoped>
/* Nhập biểu tượng Bootstrap nếu bạn sử dụng biểu tượng bi-* */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css");
/* Nhập phông chữ Roboto để đồng bộ hóa với UserProfile*/
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');


.user-settings-modern-wrapper {
  font-family: 'Roboto', sans-serif; /* Sử dụng Roboto font */
  padding: 10px; /* Đệm nhẹ cho toàn bộ lớp bọc */
  color: #343a40;
}

.settings-main-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #343a40;
  margin-bottom: 10px;
  text-align: center;
}

.settings-description {
  font-size: 1.05rem;
  color: #6c757d;
  margin-bottom: 30px;
  text-align: center;
}

/* Thẻ cho từng phần cài đặt */
.settings-section-card {
  background-color: #ffffff; /* Màu nền trắng */
  border-radius: 12px; /* Góc bo tròn */
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Đổ bóng nhẹ */
  border: 1px solid #e0e0e0; /* Viền mỏng */
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; /* Hiệu ứng chuyển động */
}

.settings-section-card:hover {
  transform: translateY(-3px); /* Nhẹ nhàng nâng lên khi di chuột */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); /* Đổ bóng sâu hơn */
}

/* Tiêu đề phần */
.section-header {
  display: flex; /* Sắp xếp tiêu đề theo chiều ngang */
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e0e0e0; /* Đường phân cách dạng gạch đứt */
}

/* Biểu tượng tiêu đề */
.section-icon {
  font-size: 1.8rem;
  color: #3f51b5; /* Màu xanh chàm chủ đạo */
  margin-right: 15px;
}

/* Tên tiêu đề */
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0;
}

/* Tiêu đề phụ */
.sub-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
  margin-top: 25px;
  margin-bottom: 15px;
  border-bottom: 1px solid #f0f0f0; /* Đường phân cách nhẹ */
  padding-bottom: 8px;
}

/* Nhãn biểu mẫu */
.form-label {
  font-weight: 500; /* Độ đậm chữ */
  color: #343a40; /* Màu chữ đậm */
  margin-bottom: 8px;
}

/* Trường nhập dữ liệu */
.form-control, .form-select {
  border-radius: 8px; /* Góc bo tròn */
  border: 1px solid #ced4da;
  padding: 10px 15px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus, .form-select:focus {
  border-color: #3f51b5; /* Viền xanh chàm khi nhập */
  box-shadow: 0 0 0 0.25rem rgba(63, 81, 181, 0.25); /* Hiệu ứng khi nhập */
  outline: none;
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

/* Ghi chú nhỏ */
.form-text, .small-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
}

/* Công tắc bật/tắt */
.form-check-input {
  width: 2.5em; /* Rộng hơn */
  height: 1.4em; /* Cao hơn */
  margin-top: 0.25em;
  background-color: #e9ecef;
  border-color: #dee2e6;
  border-radius: 0.7em;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  appearance: none;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: #3f51b5; /* Màu xanh chàm khi bật */
  border-color: #3f51b5;
}

.form-check-label {
  margin-left: 0.5rem;
  font-weight: 500;
  color: #343a40;
}

/* Nút lưu */
.btn-save-settings {
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(45deg, #3f51b5, #673ab7); /* Hiệu ứng màu chuyển động */
  color: white; /* Chữ trắng */
  box-shadow: 0 4px 15px rgba(63, 81, 181, 0.3); /* Hiệu ứng đổ bóng */
  transition: all 0.3s ease-in-out;
}

.btn-save-settings:hover {
  transform: translateY(-2px); /* Nhẹ nhàng nâng lên */
  box-shadow: 0 6px 20px rgba(63, 81, 181, 0.4); /* Đổ bóng sâu hơn */
}

/* Nút xóa */
.btn-delete-settings {
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #dc3545; /* Viền đỏ */
  background-color: #ffffff; /* Nền trắng */
  color: #dc3545; /* Chữ đỏ */
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.btn-delete-settings:hover {
  transform: translateY(-2px);
  background-color: #dc3545; /* Đổi sang nền đỏ */
  color: white; /* Chữ trắng */
}

/* Khu vực xóa tài khoản */
.delete-account-section {
  border: 1px dashed #dc3545; /* Viền cảnh báo dạng gạch đứt */
  background-color: #fff8f8; /* Nền đỏ nhạt */
}


.btn-delete-account {
  display: inline-block;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
  transition: all 0.3s ease-in-out;
}

.btn-delete-account:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
  background-color: #c82333;
}

/* Kiểu dáng danh sách khóa API */
.api-key-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.api-key-item {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px 15px;
  font-family: monospace; 
  font-size: 0.9rem;
  color: #495057;
  justify-content: space-between;
  gap: 10px;
}

.api-key-value {
  flex-grow: 1; /* Cho phép chiếm không gian */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Hiển thị ... nếu quá dài*/
}

.api-key-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 5px;
  white-space: nowrap;
}

.api-key-status.active {
  background-color: #d4edda;
  color: #155724;
}

.api-key-status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.api-key-actions {
  display: flex;
  gap: 5px;
}

.btn-action {
  background: none;
  border: none;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  color: #495057;
}

.btn-action:hover {
  background-color: #e9ecef;
}

.btn-copy:hover {
  color: #007bff; 
}
.btn-revoke:hover {
  color: #dc3545; 
}
.btn-reactivate:hover {
  color: #28a745; 
}

/* Danh sách Nhật ký hoạt động Kiểu dáng */
.activity-log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-log-item {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-left: 4px solid #3f51b5; /* Thanh màu ở bên trái */
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 0.9rem;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.log-time {
  font-weight: 500;
  white-space: nowrap;
}
.log-device, .log-location, .log-action {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.log-action {
  font-weight: 600;
}

.btn-revoke-session {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.btn-revoke-session:hover {
  color: #c82333;
  transform: scale(1.1);
}

/* Cảnh báo cho tin nhắn */
.alert {
  padding: 12px 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.alert-info {
  background-color: #e0f2f7; /* Light blue */
  color: #0d6efd; /* Darker blue */
  border: 1px solid #b3e5fc;
}

.alert-warning {
  background-color: #fff3cd; /* Light yellow */
  color: #856404; /* Darker yellow */
  border: 1px solid #ffeeba;
}

.alert-success {
  background-color: #d4edda; /* Light green */
  color: #155724; /* Darker green */
  border: 1px solid #c3e6cb;
}

/* Thêm kiểu dáng cho phần Đăng xuất */
.logout-section .section-header {
  border-bottom: 1px dashed #0dcaf0; /* Màu xanh ngọc cho đường kẻ dưới header */
}

.logout-section .section-icon {
  color: #0dcaf0; /* Màu xanh ngọc cho icon */
}

.logout-section .section-title {
  color: #0dcaf0; /* Màu xanh ngọc cho tiêu đề */
}

.btn-logout {
  display: inline-block;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #0dcaf0; /* Màu xanh ngọc */
  color: white;
  box-shadow: 0 4px 15px rgba(13, 202, 240, 0.3);
  transition: all 0.3s ease-in-out;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 202, 240, 0.4);
  background-color: #0aa3c2; /* Màu xanh ngọc đậm hơn */
}


/* Phản hồi*/
@media (max-width: 768px) {
  .user-settings-modern-wrapper {
    padding: 0;
  }
  .settings-main-title {
    font-size: 1.8rem;
  }
  .settings-description {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }
  .settings-section-card {
    padding: 20px;
  }
  .section-header {
    flex-direction: column; /* Sếp chồng các mục và tiêu đề theo chiều dọc*/
    align-items: flex-start;
  }
  .section-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  .section-title {
    font-size: 1.3rem;
  }
  .form-control, .form-select, .btn-save-settings, .btn-delete-account, .btn-delete-settings {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
  .api-key-item, .activity-log-item {
    flex-direction: column; /* Xếp chồng các mục trên thiết bị di động */
    align-items: flex-start;
  }
  .api-key-actions {
    width: 100%;
    justify-content: flex-end; /* Căn chỉnh các nút sang bên phải */
    margin-top: 10px;
  }
  .activity-log-item button {
    margin-top: 5px;
    align-self: flex-end; /* Căn chỉnh nút sang bên phải */
  }
}
</style>
