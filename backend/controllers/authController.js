
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // ====================== SIGNUP ======================
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

// // ====================== LOGIN ======================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log("📩 Email nhập:", email);
//     console.log("🔑 Password nhập:", password);

//     // Tìm user theo email
//     const user = await User.findOne({ email });
//     console.log("📦 User tìm được trong DB:", user);

//     if (!user) {
//       console.log("⚠️ Không tìm thấy user với email này");
//       return res.status(400).json({ message: "Email không tồn tại" });
//     }

//     // So sánh mật khẩu
//     console.log("🔐 Password trong DB:", user.password);
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("🧮 Kết quả so sánh bcrypt:", isMatch);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Sai mật khẩu" });
//     }

//     // Tạo JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ message: "Đăng nhập thành công", token });
//   } catch (err) {
//     console.error("❌ Lỗi khi đăng nhập:", err);
//     res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
//   }
// };

// // ====================== LOGOUT ======================
// exports.logout = (req, res) => {
//   res.json({ message: "Đăng xuất thành công" });
// };




const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ====================== SIGNUP ======================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // ✅ Không hash ở đây nữa (model tự hash)
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng ký", error: err.message });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Email nhập:", email);
    console.log("🔑 Password nhập:", password);

    const user = await User.findOne({ email });
    console.log("📦 User tìm được trong DB:", user);

    if (!user) {
      console.log("⚠️ Không tìm thấy user với email này");
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // ✅ Dùng hàm comparePassword từ model
    const isMatch = await user.comparePassword(password);
    console.log("🧮 Kết quả so sánh bcrypt:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    console.error("❌ Lỗi khi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập", error: err.message });
  }
};

// ====================== LOGOUT ======================
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};
// ====================== PROFILE ======================

// 📖 Xem thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    res.json({ message: "Lấy thông tin thành công", user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin", error: err.message });
  }
};

// ✏️ Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // model sẽ tự hash vì có pre("save")

    await user.save();

    res.json({ message: "Cập nhật thành công", user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: err.message });
  }
};


