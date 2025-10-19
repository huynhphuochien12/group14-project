import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import AvatarUpload from "./AvatarUpload";
import "../../App.css";

function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();

  // 🟢 Lấy thông tin người dùng hiện tại
  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile`);
      // backend returns the user object directly
      setUser(res.data.user || res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Lỗi khi tải thông tin cá nhân:", err);
      setMessage("❌ Không thể tải thông tin cá nhân!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🟣 Cập nhật thông tin cá nhân
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Nếu có nhập mật khẩu mới, kiểm tra xác nhận
    if (newPassword) {
      if (newPassword.length < 6) {
        addToast('Mật khẩu mới phải có ít nhất 6 ký tự', 'warning');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        addToast('Mật khẩu xác nhận không khớp', 'warning');
        return;
      }
    }

    try {
      const payload = { name: user.name, email: user.email };
      if (newPassword) payload.password = newPassword;
      await api.put("/profile", payload);

      addToast('Cập nhật thông tin thành công', 'success');
      setNewPassword("");
      setConfirmNewPassword("");
      fetchProfile();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      addToast(err.response?.data?.message || "Cập nhật thất bại", 'error');
    }
  };

  // Xóa tài khoản (người dùng tự xóa)
  const handleDeleteAccount = async () => {
    const ok = window.confirm('Bạn có chắc muốn xóa tài khoản của mình? Hành động này không thể hoàn tác.');
    if (!ok) return;

    try {
      await api.delete('/profile');
      addToast('Tài khoản đã được xóa', 'success');
      // clear client state and redirect
      logout();
      localStorage.removeItem('userId');
      navigate('/');
    } catch (err) {
      console.error('❌ Lỗi khi xóa tài khoản:', err);
      addToast(err.response?.data?.message || 'Xóa thất bại', 'error');
    }
  };

  if (loading) return <p className="loading">⏳ Đang tải thông tin...</p>;

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h2 className="auth-title">👤 Thông tin cá nhân</h2>
            <p className="auth-sub">Quản lý thông tin cá nhân và mật khẩu</p>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:13,fontWeight:700,color:user.role === 'admin' ? '#991B1B' : '#0f172a'}}>
              {user.role === 'admin' ? 'Admin' : 'Người dùng'}
            </div>
            {user.role === 'admin' && (
              <a href="/admin" style={{fontSize:12,color:'#4f46e5'}}>Đi tới trang quản trị</a>
            )}
          </div>
        </div>

        <AvatarUpload currentAvatar={user.avatar} onUploaded={fetchProfile} />

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Họ và tên:</label>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới (tùy chọn):</label>
            <input type="password" placeholder="Nhập mật khẩu mới nếu muốn đổi" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" placeholder="Nhập lại mật khẩu mới" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          </div>

          <div className="center" style={{display:'flex',gap:12,justifyContent:'center',alignItems:'center'}}>
            <button className="btn" type="submit">💾 Lưu thay đổi</button>
            <button type="button" onClick={handleDeleteAccount} className="btn" style={{background:'#ef4444',borderColor:'#ef4444'}}>🗑️ Xóa tài khoản</button>
          </div>
        </form>

        {message && <p className="status-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;
