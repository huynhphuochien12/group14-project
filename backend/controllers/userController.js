const User = require("../models/User");

// 📦 Lấy danh sách người dùng từ MongoDB
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // ✅ Lấy dữ liệu thật
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Thêm người dùng mới vào MongoDB
exports.createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
    });
    const savedUser = await newUser.save(); // ✅ Lưu vào DB
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  // ✏️ Cập nhật (sửa) người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name: req.body.name, email: req.body.email },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

};
