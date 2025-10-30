const mongoose = require("mongoose");
const User = require("./models/userModel");
require("dotenv").config();

// 🌱 Dữ liệu mẫu cho các roles
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Moderator User",
    email: "moderator@example.com",
    password: "mod123",
    role: "moderator",
  },
  {
    name: "Regular User 1",
    email: "user1@example.com",
    password: "user123",
    role: "user",
  },
  {
    name: "Regular User 2",
    email: "user2@example.com",
    password: "user123",
    role: "user",
  },
];

// 🚀 Hàm seed dữ liệu
const seedUsers = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Đã kết nối MongoDB");

    // Xóa dữ liệu cũ (tùy chọn - bỏ comment nếu muốn reset)
    // await User.deleteMany({});
    // console.log("🗑️  Đã xóa dữ liệu user cũ");

    // Kiểm tra và thêm user mẫu
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  Bỏ qua: ${userData.email} đã tồn tại`);
      } else {
        const newUser = new User(userData);
        await newUser.save();
        console.log(`✅ Đã tạo user: ${userData.name} (${userData.role})`);
      }
    }

    console.log("\n🎉 Seed dữ liệu thành công!");
    console.log("\n📋 Danh sách tài khoản test:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 Admin:");
    console.log("   Email: admin@example.com");
    console.log("   Password: admin123");
    console.log("\n🛡️  Moderator:");
    console.log("   Email: moderator@example.com");
    console.log("   Password: mod123");
    console.log("\n👤 User:");
    console.log("   Email: user1@example.com");
    console.log("   Password: user123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed dữ liệu:", error);
    process.exit(1);
  }
};

// Chạy seed
seedUsers();


