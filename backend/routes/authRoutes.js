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

// Import logging & rate limiting middleware
const { logActivity, createLog } = require("../middleware/logMiddleware");
const {
  loginLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimitMiddleware");

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
router.post("/register", logActivity("REGISTER"), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Log failed registration
      await createLog({
        userName: name,
        userEmail: email,
        action: "REGISTER_FAILED",
        method: "POST",
        endpoint: "/api/auth/register",
        statusCode: 400,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        metadata: { reason: "Email already exists" },
        success: false,
        errorMessage: "Email đã được sử dụng",
      });

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

    // Log successful registration
    await createLog({
      userId: newUser._id,
      userName: newUser.name,
      userEmail: newUser.email,
      action: "REGISTER_SUCCESS",
      method: "POST",
      endpoint: "/api/auth/register",
      statusCode: 201,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      metadata: { role: newUser.role },
      success: true,
    });

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
router.post(
  "/login",
  loginLimiter, // Rate limiting - max 5 attempts per 15 min
  logActivity("LOGIN"),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      console.log("Login attempt for email:", email);

      if (!user) {
        // Log failed login - user not found
        await createLog({
          userEmail: email,
          action: "LOGIN_FAILED",
          method: "POST",
          endpoint: "/api/auth/login",
          statusCode: 400,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
          metadata: { reason: "User not found", email },
          success: false,
          errorMessage: "Email không tồn tại",
        });

        return res.status(400).json({ message: "Email không tồn tại" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Log failed login - wrong password
        await createLog({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          action: "LOGIN_FAILED",
          method: "POST",
          endpoint: "/api/auth/login",
          statusCode: 400,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
          metadata: { reason: "Wrong password", email },
          success: false,
          errorMessage: "Sai mật khẩu",
        });

        return res.status(400).json({ message: "Sai mật khẩu" });
      }

      if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        console.error(
          "❌ Thiếu JWT_SECRET hoặc JWT_REFRESH_SECRET trong .env"
        );
        return res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
      }

      // ✅ Tạo Access Token & Refresh Token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

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

      const userData = user.toObject();
      delete userData.password;

      // Log successful login
      await createLog({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        action: "LOGIN_SUCCESS",
        method: "POST",
        endpoint: "/api/auth/login",
        statusCode: 200,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        metadata: { role: user.role },
        success: true,
      });

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
  }
);

// ==========================
// ♻️ Refresh Access Token
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
router.post(
  "/forgot-password",
  forgotPasswordLimiter, // Rate limiting - max 3 per hour
  logActivity("FORGOT_PASSWORD"),
  async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Vui lòng nhập email" });
  }

  try {
    const user = await User.findOne({ email });
    
    // Security: Không tiết lộ email có tồn tại hay không
    if (!user) {
      console.log(`📧 Forgot password request for non-existent email: ${email}`);
      return res.json({ 
        message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu" 
      });
    }

    // Sinh reset token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Lưu token hash vào DB (1 giờ hết hạn)
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    console.log(`🔑 Reset token generated for: ${email}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);

    // Kiểm tra SMTP config
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { 
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS 
          },
        });

        // Email HTML đẹp
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .button:hover { background: #5568d3; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Đặt Lại Mật Khẩu</h1>
              </div>
              <div class="content">
                <p>Xin chào <strong>${user.name}</strong>,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Đặt Lại Mật Khẩu</a>
                </div>
                <p>Hoặc copy link sau vào trình duyệt:</p>
                <p style="background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; word-break: break-all;">
                  <a href="${resetUrl}">${resetUrl}</a>
                </p>
                <div class="warning">
                  <strong>⚠️ Lưu ý:</strong>
                  <ul style="margin: 5px 0;">
                    <li>Link này chỉ có hiệu lực trong <strong>1 giờ</strong></li>
                    <li>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này</li>
                    <li>Không chia sẻ link này với bất kỳ ai</li>
                  </ul>
                </div>
                <p>Trân trọng,<br><strong>Tech University Team</strong></p>
              </div>
              <div class="footer">
                <p>Email này được gửi tự động, vui lòng không reply.</p>
                <p>&copy; 2024 Tech University. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Tech University" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "🔐 Đặt lại mật khẩu - Tech University",
          text: `Xin chào ${user.name},\n\nNhấn vào liên kết sau để đặt lại mật khẩu:\n${resetUrl}\n\nLink có hiệu lực trong 1 giờ.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.\n\nTrân trọng,\nTech University Team`,
          html: emailHtml,
        });

        console.log(`✅ Reset password email sent to: ${email}`);
        return res.json({ 
          message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn." 
        });
      } catch (emailError) {
        console.error("❌ Lỗi gửi email:", emailError);
        // Vẫn trả về token để test khi email fail
        return res.json({ 
          message: "Lỗi gửi email. Token để test:", 
          resetToken, 
          resetUrl,
          error: emailError.message 
        });
      }
    } else {
      // Không có SMTP config - Trả về token để test
      console.warn("⚠️ SMTP not configured. Returning token for testing.");
      return res.json({ 
        message: "SMTP chưa được cấu hình. Token để test:", 
        resetToken, 
        resetUrl 
      });
    }
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Lỗi server khi xử lý yêu cầu" });
  }
});

// ==========================
// 🔐 Reset mật khẩu bằng token
// ==========================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  
  // Validation
  if (!token || !password) {
    return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  try {
    // Hash token để so sánh với DB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    
    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log(`❌ Invalid or expired reset token: ${token.substring(0, 10)}...`);
      return res.status(400).json({ 
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới." 
      });
    }

    console.log(`🔐 Resetting password for user: ${user.email}`);

    // Cập nhật mật khẩu mới (sẽ tự động hash bởi pre-save hook)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log(`✅ Password reset successful for: ${user.email}`);

    // Gửi email xác nhận (optional)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: { 
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS 
          },
        });

        const confirmEmailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 10px; margin: 15px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Mật Khẩu Đã Được Đặt Lại</h1>
              </div>
              <div class="content">
                <p>Xin chào <strong>${user.name}</strong>,</p>
                <div class="success">
                  <p><strong>✅ Thành công!</strong> Mật khẩu của bạn đã được đặt lại.</p>
                </div>
                <p>Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới.</p>
                <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
                <p>Trân trọng,<br><strong>Tech University Team</strong></p>
              </div>
              <div class="footer">
                <p>Email này được gửi tự động, vui lòng không reply.</p>
                <p>&copy; 2024 Tech University. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Tech University" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "✅ Mật khẩu đã được đặt lại - Tech University",
          text: `Xin chào ${user.name},\n\nMật khẩu của bạn đã được đặt lại thành công.\n\nBạn có thể đăng nhập ngay bây giờ với mật khẩu mới.\n\nNếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.\n\nTrân trọng,\nTech University Team`,
          html: confirmEmailHtml,
        });

        console.log(`📧 Password reset confirmation email sent to: ${user.email}`);
      } catch (emailError) {
        console.error("⚠️ Could not send confirmation email:", emailError.message);
        // Không fail request nếu email không gửi được
      }
    }

    res.json({ 
      message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới." 
    });
  } catch (err) {
    console.error("❌ Lỗi reset-password:", err);
    res.status(500).json({ message: "Lỗi server khi đặt lại mật khẩu" });
  }
});

module.exports = router;
