const rateLimit = require("express-rate-limit");
const { createLog } = require("./logMiddleware");

/**
 * Rate limiter cho login - Chống brute force
 * Max 5 attempts mỗi 1 phút từ cùng IP (TEST MODE)
 */
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute (TEST - change to 15 for production)
  max: 5, // Limit mỗi IP đến 5 requests per windowMs
  message: {
    message:
      "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  
  // Log khi bị rate limit
  handler: async (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Log rate limit event
    await createLog({
      userId: null,
      userName: "Anonymous",
      userEmail: req.body?.email || null,
      action: "LOGIN_RATE_LIMITED",
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: 429,
      ipAddress: ipAddress,
      userAgent: req.get("user-agent"),
      metadata: {
        email: req.body?.email || "unknown",
        reason: "Too many login attempts",
      },
      success: false,
      errorMessage: "Rate limit exceeded",
    });

    console.log(
      `⚠️ Rate limit exceeded for IP: ${ipAddress}, Email: ${req.body?.email || "unknown"}`
    );

    res.status(429).json({
      message:
        "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.",
    });
  },

  // Key generator - rate limit by IP
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

/**
 * Rate limiter cho forgot password
 * Max 3 requests mỗi 1 phút từ cùng IP (TEST MODE)
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute (TEST - change to 60 for production)
  max: 3,
  message: {
    message:
      "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress;

    await createLog({
      userId: null,
      userName: "Anonymous",
      userEmail: req.body?.email || null,
      action: "FORGOT_PASSWORD_RATE_LIMITED",
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: 429,
      ipAddress: ipAddress,
      userAgent: req.get("user-agent"),
      metadata: {
        email: req.body?.email || "unknown",
        reason: "Too many forgot password requests",
      },
      success: false,
      errorMessage: "Rate limit exceeded",
    });

    console.log(
      `⚠️ Forgot password rate limit exceeded for IP: ${ipAddress}`
    );

    res.status(429).json({
      message:
        "Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 1 phút.",
    });
  },

  keyGenerator: (req) => req.ip || req.connection.remoteAddress,
});

/**
 * Rate limiter chung cho API
 * Max 100 requests mỗi 15 phút
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Quá nhiều requests. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,

  handler: async (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress;

    await createLog({
      userId: req.user?._id || null,
      userName: req.user?.name || "Anonymous",
      userEmail: req.user?.email || null,
      action: "API_RATE_LIMITED",
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: 429,
      ipAddress: ipAddress,
      userAgent: req.get("user-agent"),
      metadata: {
        reason: "Too many API requests",
      },
      success: false,
      errorMessage: "Rate limit exceeded",
    });

    console.log(`⚠️ API rate limit exceeded for IP: ${ipAddress}`);

    res.status(429).json({
      message: "Quá nhiều requests. Vui lòng thử lại sau.",
    });
  },
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  apiLimiter,
};

