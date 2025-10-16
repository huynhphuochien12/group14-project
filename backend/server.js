// =======================
// 🔹 Import thư viện
// =======================
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import User from "./User.js";

// Load biến môi trường
dotenv.config();

// =======================
// 🔹 Tạo app + middleware
// =======================
const app = express();
app.use(express.json());
app.use(cors());

// 🔑 Khóa bí mật JWT
const JWT_SECRET = process.env.JWT_SECRET || "group14_secret_key";

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/group14DB")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err.message));

// =======================
// 🔹 API Đăng ký
// =======================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "❌ Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.json({ message: "✅ Đăng ký thành công!", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Lỗi khi đăng ký!", error: error.message });
  }
});

// =======================
// 🔹 API Đăng nhập
// =======================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "❌ Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Sai mật khẩu!" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "✅ Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Lỗi khi đăng nhập!", error: error.message });
  }
});

// =======================
// 🔹 Middleware xác thực JWT
// =======================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "❌ Thiếu token!" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "❌ Token không hợp lệ!" });
  }
};

// =======================
// 🔹 API xem & cập nhật profile
// =======================
app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ message: "✅ Thông tin người dùng:", user });
});

app.put("/profile", authMiddleware, async (req, res) => {
  const { name, role } = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, role }, { new: true }).select("-password");
  res.json({ message: "✅ Cập nhật thành công!", user: updatedUser });
});

// =======================
// 🔹 Chạy server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
