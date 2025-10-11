// controllers/userController.js

const User = require("../models/User");

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // lấy tất cả user từ MongoDB
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách user:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/users
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validation cơ bản
    if (!name || !email) {
      return res.status(400).json({ message: "Tên và email là bắt buộc" });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ Lỗi khi tạo user:", err);

    // Nếu lỗi do trùng email, báo lỗi cụ thể
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    res.status(500).json({ message: "Lỗi khi tạo user", error: err.message });
  }
};
``
