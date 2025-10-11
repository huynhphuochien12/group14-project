// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });


const app = express();
app.use(cors());
app.use(express.json());

// 👉 Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 👉 Dùng route
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); // ✅ route chính để frontend gọi

const PORT = process.env.PORT || 5000;
// 👉 Route kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// 👉 Route API trả danh sách user (demo)
app.get("/api/users", async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
