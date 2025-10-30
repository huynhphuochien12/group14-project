const Log = require("../models/logModel");

/**
 * Middleware để log activity của user
 * Sử dụng: logActivity(action, metadata)
 */
const logActivity = (action, metadata = {}) => {
  return async (req, res, next) => {
    // Lưu response gốc
    const originalJson = res.json.bind(res);

    // Override res.json để catch response
    res.json = function (data) {
      // Tạo log entry
      const logEntry = {
        userId: req.user?._id || null,
        userName: req.user?.name || "Anonymous",
        userEmail: req.user?.email || null,
        action: action,
        method: req.method,
        endpoint: req.originalUrl || req.url,
        statusCode: res.statusCode,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent") || null,
        metadata: metadata,
        success: res.statusCode >= 200 && res.statusCode < 400,
        errorMessage: data?.message && res.statusCode >= 400 ? data.message : null,
        timestamp: new Date(),
      };

      // Lưu log vào DB (async, không block response)
      Log.create(logEntry)
        .then(() => {
          console.log(`📝 Logged: ${action} by ${logEntry.userName} (${res.statusCode})`);
        })
        .catch((err) => {
          console.error("❌ Error saving log:", err.message);
        });

      // Trả response như bình thường
      return originalJson(data);
    };

    next();
  };
};

/**
 * Log activity manually (dùng trong controller)
 */
const createLog = async ({
  userId = null,
  userName = "Anonymous",
  userEmail = null,
  action,
  method = null,
  endpoint = null,
  statusCode = 200,
  ipAddress = null,
  userAgent = null,
  metadata = {},
  success = true,
  errorMessage = null,
}) => {
  try {
    await Log.create({
      userId,
      userName,
      userEmail,
      action,
      method,
      endpoint,
      statusCode,
      ipAddress,
      userAgent,
      metadata,
      success,
      errorMessage,
      timestamp: new Date(),
    });
    console.log(`📝 Logged: ${action} by ${userName}`);
  } catch (err) {
    console.error("❌ Error creating log:", err.message);
  }
};

/**
 * Middleware để log mọi request (optional, cho debug)
 */
const logAllRequests = async (req, res, next) => {
  const start = Date.now();

  // Lưu response gốc
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    const duration = Date.now() - start;

    const logEntry = {
      userId: req.user?._id || null,
      userName: req.user?.name || "Anonymous",
      userEmail: req.user?.email || null,
      action: `${req.method} ${req.originalUrl}`,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: res.statusCode,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      metadata: { duration: `${duration}ms` },
      success: res.statusCode >= 200 && res.statusCode < 400,
      timestamp: new Date(),
    };

    Log.create(logEntry).catch((err) =>
      console.error("Error saving log:", err.message)
    );

    return originalJson(data);
  };

  next();
};

module.exports = {
  logActivity,
  createLog,
  logAllRequests,
};

