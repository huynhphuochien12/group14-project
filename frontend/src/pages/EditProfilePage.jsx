// // src/components/EditProfileForm.jsx
// import React, { useState } from 'react';
// import API from '../services/api';

// export default function EditProfileForm({ user, onUpdated }) {
//   const [name, setName] = useState(user.name);
//   const [email, setEmail] = useState(user.email);
//   const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { name, email };
//       if (avatarUrl) payload.avatarUrl = avatarUrl;
//       if (newPassword) {
//         payload.currentPassword = currentPassword;
//         payload.newPassword = newPassword;
//       }
//       await API.put('/profile', payload);
//       alert('Cập nhật thành công');
//       onUpdated();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || 'Lỗi');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Name</label><br/>
//         <input value={name} onChange={e => setName(e.target.value)} />
//       </div>
//       <div>
//         <label>Email</label><br/>
//         <input value={email} onChange={e => setEmail(e.target.value)} />
//       </div>
//       <div>
//         <label>Avatar URL</label><br/>
//         <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
//       </div>
//       <hr />
//       <h4>Đổi mật khẩu</h4>
//       <div>
//         <label>Current Password</label><br/>
//         <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
//       </div>
//       <div>
//         <label>New Password</label><br/>
//         <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
//       </div>

//       <button type="submit">Lưu thay đổi</button>
//     </form>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import EditProfileForm from "../components/EditProfileForm"; // chỉnh đường dẫn cho đúng

const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // 🔄 Hàm load danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑️ Xóa người dùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  return (
    <div className="profile-page-container">
      <h1>Danh sách người dùng</h1>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <React.Fragment key={u._id}>
              <tr>
                <td>{u._id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {editingUser && editingUser._id === u._id ? (
                    <>
                      <button
                        className="action-btn small cancel"
                        onClick={() => setEditingUser(null)}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-btn edit small"
                        onClick={() => setEditingUser(u)}
                      >
                        Sửa
                      </button>
                      <button
                        className="action-btn delete small"
                        onClick={() => handleDelete(u._id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>

              {/* ✅ Hiển thị form chỉnh sửa ngay bên dưới dòng tương ứng */}
              {editingUser && editingUser._id === u._id && (
                <tr>
                  <td colSpan="4">
                    <EditProfileForm
                      user={editingUser}
                      onUpdated={() => {
                        setEditingUser(null);
                        fetchUsers(); // reload danh sách
                      }}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfilePage;

