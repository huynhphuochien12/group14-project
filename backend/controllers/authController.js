// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Kiểm tra email trùng
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email đã tồn tại" });
//     }

//     // Mã hóa mật khẩu
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ message: "Đăng ký thành công", user });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi khi đăng ký", error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Tìm user theo email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Email không tồn tại" });

//     // So sánh mật khẩu
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

//     // Tạo JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ message: "Đăng nhập thành công", token });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
//   }
// };

// exports.logout = (req, res) => {
//   res.json({ message: "Đăng xuất thành công" });
// };

const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu (quan trọng!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user với mật khẩu đã mã hóa
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "✅ User đã được thêm thành công!",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
