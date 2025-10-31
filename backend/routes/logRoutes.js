const express = require("express");
const router = express.Router();
const Log = require("../models/logModel");
const { protect, checkRole } = require("../middleware/authMiddleware");
const { logActivity } = require("../middleware/logMiddleware");

/**
 * @route   GET /api/logs
 * @desc    Get all logs (Admin only)
 * @access  Private (Admin)
 */
router.get(
  "/",
  protect,
  checkRole("admin"),
  logActivity("VIEW_LOGS"),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        userId,
        action,
        success,
        startDate,
        endDate,
      } = req.query;

      // Build filter
      const filter = {};

      if (userId) filter.userId = userId;
      if (action) filter.action = action;
      if (success !== undefined) filter.success = success === "true";
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Get logs with pagination
      const logs = await Log.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "name email role")
        .lean();

      // Map logs để format giống ảnh Postman (ipAddress -> ip)
      const formattedLogs = logs.map(log => ({
        ...log,
        ip: log.ipAddress || null, // Thêm field ip (alias của ipAddress)
        // Giữ nguyên ipAddress để backward compatibility
      }));

      // Get total count
      const total = await Log.countDocuments(filter);

      res.json({
        success: true,
        count: formattedLogs.length,
        logs: formattedLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (err) {
      console.error("❌ Error fetching logs:", err);
      res.status(500).json({ message: "Lỗi khi lấy logs" });
    }
  }
);

/**
 * @route   GET /api/logs/stats
 * @desc    Get log statistics (Admin only)
 * @access  Private (Admin)
 */
router.get(
  "/stats",
  protect,
  checkRole("admin"),
  logActivity("VIEW_LOG_STATS"),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Build date filter
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.timestamp = {};
        if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
        if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
      }

      // Get stats
      const [
        totalLogs,
        successfulLogs,
        failedLogs,
        actionStats,
        rateLimitEvents,
        recentLogs,
      ] = await Promise.all([
        // Total logs
        Log.countDocuments(dateFilter),

        // Successful logs
        Log.countDocuments({ ...dateFilter, success: true }),

        // Failed logs
        Log.countDocuments({ ...dateFilter, success: false }),

        // Action breakdown
        Log.aggregate([
          { $match: dateFilter },
          { $group: { _id: "$action", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),

        // Rate limit events
        Log.countDocuments({
          ...dateFilter,
          action: { $in: ["LOGIN_RATE_LIMITED", "API_RATE_LIMITED", "FORGOT_PASSWORD_RATE_LIMITED"] },
        }),

        // Recent logs (last 10)
        Log.find(dateFilter)
          .sort({ timestamp: -1 })
          .limit(10)
          .populate("userId", "name email")
          .lean(),
      ]);

      res.json({
        totalLogs,
        successfulLogs,
        failedLogs,
        successRate:
          totalLogs > 0
            ? ((successfulLogs / totalLogs) * 100).toFixed(2)
            : 0,
        actionStats,
        rateLimitEvents,
        recentLogs,
      });
    } catch (err) {
      console.error("❌ Error fetching log stats:", err);
      res.status(500).json({ message: "Lỗi khi lấy thống kê logs" });
    }
  }
);

/**
 * @route   GET /api/logs/user/:userId
 * @desc    Get logs for specific user (Admin only)
 * @access  Private (Admin)
 */
router.get(
  "/user/:userId",
  protect,
  checkRole("admin"),
  logActivity("VIEW_USER_LOGS"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const logs = await Log.find({ userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Log.countDocuments({ userId });

      res.json({
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (err) {
      console.error("❌ Error fetching user logs:", err);
      res.status(500).json({ message: "Lỗi khi lấy logs của user" });
    }
  }
);

/**
 * @route   DELETE /api/logs
 * @desc    Clear old logs (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  "/",
  protect,
  checkRole("admin"),
  logActivity("CLEAR_OLD_LOGS"),
  async (req, res) => {
    try {
      const { days = 30 } = req.query;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

      const result = await Log.deleteMany({
        timestamp: { $lt: cutoffDate },
      });

      res.json({
        message: `Đã xóa ${result.deletedCount} logs cũ hơn ${days} ngày`,
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      console.error("❌ Error clearing logs:", err);
      res.status(500).json({ message: "Lỗi khi xóa logs" });
    }
  }
);

module.exports = router;

