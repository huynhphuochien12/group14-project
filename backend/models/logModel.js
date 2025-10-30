const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null nếu action không cần auth (ví dụ: failed login)
  },
  userName: {
    type: String,
    default: "Anonymous",
  },
  userEmail: {
    type: String,
    default: null,
  },
  action: {
    type: String,
    required: true,
    // Các action types:
    // AUTH: login, logout, register, forgot-password, reset-password
    // USER: view-profile, update-profile, upload-avatar
    // ADMIN: view-users, create-user, update-user, delete-user
  },
  method: {
    type: String, // GET, POST, PUT, DELETE
    default: null,
  },
  endpoint: {
    type: String, // /api/auth/login, /api/users, v.v.
    default: null,
  },
  statusCode: {
    type: Number, // 200, 201, 400, 401, 500, v.v.
    default: null,
  },
  ipAddress: {
    type: String,
    default: null,
  },
  userAgent: {
    type: String, // Browser info
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Thông tin thêm (JSON object)
    default: {},
  },
  success: {
    type: Boolean,
    default: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index để query nhanh hơn
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ ipAddress: 1, action: 1, timestamp: -1 }); // Cho rate limiting

module.exports = mongoose.model("Log", logSchema);

