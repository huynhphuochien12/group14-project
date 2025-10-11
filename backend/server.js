const express = require("express");
const mongoose = require("mongoose");
backend
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
const User = require("./User");

const app = express();
app.use(express.json());

// ✅ Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://phat220393:12345@cluster0.itkfnni.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ✅ POST: thêm user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: xem toàn bộ user
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(5000, () => console.log("🚀 Server chạy tại http://localhost:5000"));
 main
