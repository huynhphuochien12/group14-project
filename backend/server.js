// require("dotenv").config(); // ✅ Nạp biến môi trường từ file .env

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // ✅ In ra kiểm tra xem MONGO_URI có được đọc không
// console.log("DEBUG MONGO_URI =", process.env.MONGO_URI);

// // ✅ Kết nối MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// // ✅ Import routes
// const userRoutes = require("./routes/userRoutes");
// app.use("/api/users", userRoutes);

// // ✅ Khởi chạy server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




//======================



require("dotenv").config(); // Nạp biến môi trường từ file .env

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cors());

// ===== Kiểm tra biến môi trường =====
console.log("DEBUG MONGO_URI =", process.env.MONGO_URI);

// ===== Kết nối MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ===== Import routes =====
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes"); // 🔒 thêm dòng này

// ===== Sử dụng routes =====
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // 🔒 thêm dòng này

// ===== Khởi chạy server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
