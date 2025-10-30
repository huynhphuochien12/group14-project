
const User = require("../models/userModel");

// 📦 Lấy danh sách người dùng (Admin, Moderator)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    
    console.log("📊 TRƯỚC KHI SẮP XẾP:");
    users.forEach(u => console.log(`  - ${u.name}: role="${u.role}"`));
    
    // Sắp xếp: Admin → Moderator → User
    users.sort((a, b) => {
      const roleOrder = { admin: 0, moderator: 1, user: 2 };
      return (roleOrder[a.role] || 3) - (roleOrder[b.role] || 3);
    });
    
    console.log("📊 SAU KHI SẮP XẾP:");
    users.forEach(u => console.log(`  - ${u.name}: role="${u.role}"`));
    
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 📘 Lấy thông tin một user theo ID (Admin, Moderator)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ➕ Thêm người dùng mới
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tên, email và mật khẩu là bắt buộc" });
    }

    const newUser = new User({ name, email, password, role: role || 'user' });
    const savedUser = await newUser.save();
    const userData = savedUser.toObject();
    delete userData.password;
    res.status(201).json(userData);
  } catch (err) {
    console.error("❌ Lỗi khi tạo user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ✏️ Cập nhật thông tin người dùng (Admin, Moderator)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Chỉ admin mới được đổi role
    if (role) {
      if (req.user.role === "admin") {
        user.role = role;
      } else {
        return res.status(403).json({ 
          message: "Chỉ admin mới có quyền thay đổi role" 
        });
      }
    }
    
    if (password) user.password = password; // Pre-save hook sẽ hash

    await user.save();
    
    const userData = user.toObject();
    delete userData.password;
    
    res.json({ message: "Cập nhật user thành công", user: userData });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ❌ Xóa người dùng (Admin hoặc chính mình)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🛡️ Chỉ cho phép nếu là admin hoặc xóa chính mình
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa người khác" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json({ message: "Đã xóa user thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 🔄 Cập nhật role của user (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin", "moderator"].includes(role)) {
      return res.status(400).json({ 
        message: "Role không hợp lệ. Chỉ chấp nhận: user, admin, moderator" 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    user.role = role;
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.json({ 
      message: `Đã cập nhật role của ${user.name} thành ${role}`, 
      user: userData 
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật role:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
};

