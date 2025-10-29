// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const RefreshToken = require("../models/RefreshToken");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ==========================
// ☁️ Cấu hình Cloudinary
// ==========================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================
// 📌 Đăng ký tài khoản
// ==========================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: "user",
    });

    await newUser.save();

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
    const user = await User.findOne({ email });
    console.log("Login attempt for email:", email);
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

<<<<<<< HEAD
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.error("❌ Thiếu JWT_SECRET hoặc JWT_REFRESH_SECRET trong .env");
      return res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
    }

    // ✅ Tạo Access Token & Refresh Token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Lưu Refresh Token vào DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
    });

=======
    if (!process.env.JWT_SECRET) {
      console.error("❌ Thiếu JWT_SECRET trong file .env");
      return res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

>>>>>>> ce8b15b65b3aa3e65ac046be144aff8054f90225
    const userData = user.toObject();
    delete userData.password;

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err.message);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
<<<<<<< HEAD
// ♻️ Refresh Access Token
=======
// 🚪 Logout
>>>>>>> ce8b15b65b3aa3e65ac046be144aff8054f90225
// ==========================
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Thiếu refresh token" });

  // Kiểm tra token có trong DB không
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken)
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã bị xóa" });

  try {
    // Xác thực refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Tạo access token mới
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh token hết hạn hoặc sai" });
  }
});

// ==========================
// 🚪 Logout
// ==========================
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }
  res.json({ message: "Đăng xuất thành công" });
});

// ==========================
// 🔁 Quên mật khẩu - gửi token reset
// ==========================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ message: "Nếu email tồn tại, một liên kết đã được gửi" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 giờ
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Đặt lại mật khẩu",
        text: `Nhấn vào liên kết sau để đặt lại mật khẩu: ${resetUrl}`,
      });

      return res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
    }

    res.json({ message: "Reset token created", resetToken, resetUrl });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
// 🔐 Reset mật khẩu bằng token
// ==========================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi reset-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
// 🔁 Quên mật khẩu - gửi token reset
// ==========================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ message: "Nếu email tồn tại, một liên kết đã được gửi" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 giờ
    await user.save({ validateBeforeSave: false }); // ✅ FIX lỗi password required

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Đặt lại mật khẩu",
        text: `Nhấn vào liên kết sau để đặt lại mật khẩu: ${resetUrl}`,
      });

      return res.json({ message: "Email đặt lại mật khẩu đã được gửi" });
    }

    // 🧪 Dev fallback
    res.json({ message: "Reset token created", resetToken, resetUrl });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==========================
// 🔐 Reset mật khẩu bằng token
// ==========================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = password; // pre-save sẽ hash
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi reset-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
