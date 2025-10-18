const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// ==========================
// 📌 Đăng ký tài khoản
// ==========================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🔍 Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // ❌ Không cần hash ở đây — userModel sẽ tự hash khi save
    const newUser = new User({
      name,
      email,
      password,
      role: "user",
    });

    await newUser.save();

    // 🧹 Ẩn password trước khi trả về
    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "Đăng ký thành công!",
      user: userData,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
// 🔐 Đăng nhập
// ==========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Tìm người dùng theo email
    const user = await User.findOne({ email });
    console.log('Login attempt for email:', email);
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Debug: show whether password field exists and its length (do NOT log raw hash in production)
    console.log('Stored password exists:', !!user.password, 'length:', user.password ? user.password.length : 0);

    // 🔐 So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // ⚙️ Kiểm tra biến môi trường JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ Thiếu JWT_SECRET trong file .env");
      return res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
    }

    // 🔑 Tạo token JWT (chỉ chứa id). Quyền sẽ luôn được truy xuất trực tiếp từ DB khi cần.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // 🧹 Ẩn password trước khi trả về
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
// 🚪 Logout (frontend tự xoá token)
// ==========================
router.post("/logout", (req, res) => {
  res.json({ message: "Đăng xuất thành công (xoá token ở frontend)" });
});

module.exports = router;
