const express = require("express");
const mongoose = require("mongoose");
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
