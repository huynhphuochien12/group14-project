const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const { protect } = require("../middleware/authMiddleware");
const multer = require('multer');
const sharp = require('sharp');

const { protect } = require("../midlleware/authMiddleware");
const multer = require('multer');

const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// 🟢 Lấy thông tin cá nhân (GET /api/profile) - yêu cầu token
router.get("/", protect, async (req, res) => {
  try {
    // protect middleware đã gán req.user (không có password)
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟣 Cập nhật thông tin cá nhân (PUT /api/profile) - yêu cầu token
router.put("/", protect, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    const updateData = { name, email };
    if (password) {
      // Hash password here because findByIdAndUpdate bypasses schema pre('save') middleware
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt); // nếu có đổi mật khẩu
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🛑 Xóa tài khoản của chính user (DELETE /api/profile) - yêu cầu token
router.delete("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Tài khoản đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 📸 Upload avatar to Cloudinary với Sharp resize
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        message: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)' 
      });
    }

    console.log(`📸 Processing avatar for user: ${req.user.email}`);
    console.log(`   Original size: ${(req.file.size / 1024).toFixed(2)} KB`);

    // ✨ Resize ảnh với Sharp (300x300, quality 80)
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    console.log(`   Resized size: ${(resizedBuffer.length / 1024).toFixed(2)} KB`);

    // 🌥️ Upload lên Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'avatars',
            resource_type: 'image',
            transformation: [
              { width: 300, height: 300, crop: 'fill' }
            ]
          }, 
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

// Upload avatar to Cloudinary
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // upload buffer to cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };


    const result = await streamUpload(resizedBuffer);
    const avatarUrl = result.secure_url;

    console.log(`   ✅ Uploaded to: ${avatarUrl}`);

    // 💾 Lưu URL vào database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({ 
      message: 'Upload avatar thành công',
      avatar: avatarUrl,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('❌ Lỗi upload avatar:', err);
    res.status(500).json({ 
      message: 'Upload thất bại',
      error: err.message 
    });

    const result = await streamUpload(req.file.buffer);
    const avatarUrl = result.secure_url;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.avatar = avatarUrl;
    await user.save();
    res.json({ message: 'Avatar uploaded', avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });

  }
});

module.exports = router;



// Upload avatar to Cloudinary
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // upload buffer to cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    const avatarUrl = result.secure_url;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.avatar = avatarUrl;
    await user.save();
    res.json({ message: 'Avatar uploaded', avatar: avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});


