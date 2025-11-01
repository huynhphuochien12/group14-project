const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const sharp = require("sharp");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

/**
 * ✅ Cloudinary config (Render đọc từ CLOUDINARY_URL)
 * 👉 Vì bạn đã set CLOUDINARY_URL trên Render, nên không cần CLOUDINARY_API_KEY / SECRET nữa
 */
cloudinary.config({
  secure: true,
});

/**
 * ✅ Multer config (upload file vào memory)
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
});

/* ============================================================
   🟢 GET PROFILE — /api/profile (Yêu cầu Token)
=============================================================== */
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.json({ user: req.user }); // Không trả password vì protect middleware đã loại bỏ
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   🟣 UPDATE PROFILE — /api/profile (Yêu cầu Token)
=============================================================== */
router.put("/", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    const updateData = { name, email };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   🔥 DELETE ACCOUNT — /api/profile (Yêu cầu Token)
=============================================================== */
router.delete("/", protect, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user._id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Tài khoản đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ============================================================
   📸 UPLOAD AVATAR — /api/profile/avatar (Yêu cầu Token)
=============================================================== */
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file được upload" });
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ message: "Chỉ chấp nhận ảnh JPEG, PNG, WebP" });
      }

      console.log(`📸 Upload avatar for: ${req.user.email}`);

      const resizedBuffer = await sharp(req.file.buffer)
        .resize(300, 300, { fit: "cover", position: "center" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(resizedBuffer).pipe(stream);
      });

      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

      user.avatar = result.secure_url;
      await user.save();

      res.json({
        message: "Upload avatar thành công",
        avatar: result.secure_url,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      console.error("❌ Error uploading avatar:", err);
      res.status(500).json({ message: "Upload thất bại", error: err.message });
    }
  }
);

module.exports = router;
