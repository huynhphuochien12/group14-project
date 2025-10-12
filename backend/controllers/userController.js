const User = require("../models/userModel");

// 📦 Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Lấy tất cả user trong MongoDB
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ➕ Thêm người dùng mới
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Tên và email là bắt buộc" });
    }

    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("❌ Lỗi khi tạo user:", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// ✏️ Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ❌ Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
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

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
