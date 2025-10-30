import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import "../../App.css";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    success: "",
    startDate: "",
    endDate: "",
  });
  const { addToast } = useToast();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.role !== "admin") {
      addToast("Chỉ Admin mới được xem logs", "error");
      return;
    }
    fetchLogs();
    fetchStats();
  }, [page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...filters,
      });

      const res = await api.get(`/logs?${params}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching logs:", err);
      addToast(err.response?.data?.message || "Lỗi khi tải logs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/logs/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPage(1); // Reset về trang 1 khi filter
  };

  const clearFilters = () => {
    setFilters({
      action: "",
      success: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };

  const handleClearOldLogs = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa logs cũ hơn 30 ngày? Hành động này không thể hoàn tác!"
      )
    ) {
      return;
    }

    try {
      const res = await api.delete("/logs?days=30");
      addToast(res.data.message, "success");
      fetchLogs();
      fetchStats();
    } catch (err) {
      console.error("Error clearing logs:", err);
      addToast("Lỗi khi xóa logs", "error");
    }
  };

  const getActionBadge = (action) => {
    const badges = {
      LOGIN_SUCCESS: { color: "#10b981", text: "✅ Login" },
      LOGIN_FAILED: { color: "#ef4444", text: "❌ Login Failed" },
      REGISTER_SUCCESS: { color: "#3b82f6", text: "📝 Register" },
      REGISTER_FAILED: { color: "#f59e0b", text: "⚠️ Register Failed" },
      LOGOUT: { color: "#6b7280", text: "🚪 Logout" },
      FORGOT_PASSWORD: { color: "#8b5cf6", text: "🔐 Forgot Password" },
      LOGIN_RATE_LIMITED: { color: "#dc2626", text: "🚫 Rate Limited" },
      VIEW_LOGS: { color: "#06b6d4", text: "👁️ View Logs" },
      UPDATE_PROFILE: { color: "#14b8a6", text: "✏️ Update Profile" },
      UPLOAD_AVATAR: { color: "#f97316", text: "📸 Upload Avatar" },
    };

    const badge = badges[action] || { color: "#9ca3af", text: action };

    return (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "600",
          background: badge.color + "20",
          color: badge.color,
          display: "inline-block",
        }}
      >
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  if (user?.role !== "admin") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>⛔ Không có quyền truy cập</h2>
        <p>Chỉ Admin mới được xem logs hệ thống.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>📊 User Activity Logs</h2>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
            Theo dõi hoạt động và bảo mật hệ thống
          </p>
        </div>
        <button
          className="btn secondary"
          onClick={handleClearOldLogs}
          style={{ fontSize: "13px" }}
        >
          🗑️ Xóa logs cũ (&gt;30 ngày)
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Tổng Logs</div>
            <div style={styles.statValue}>{stats.totalLogs.toLocaleString()}</div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #10b981" }}>
            <div style={styles.statLabel}>Thành Công</div>
            <div style={{ ...styles.statValue, color: "#10b981" }}>
              {stats.successfulLogs.toLocaleString()}
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #ef4444" }}>
            <div style={styles.statLabel}>Thất Bại</div>
            <div style={{ ...styles.statValue, color: "#ef4444" }}>
              {stats.failedLogs.toLocaleString()}
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #f59e0b" }}>
            <div style={styles.statLabel}>Success Rate</div>
            <div style={{ ...styles.statValue, color: "#f59e0b" }}>
              {stats.successRate}%
            </div>
          </div>
          <div style={{ ...styles.statCard, borderLeft: "4px solid #dc2626" }}>
            <div style={styles.statLabel}>Rate Limited</div>
            <div style={{ ...styles.statValue, color: "#dc2626" }}>
              {stats.rateLimitEvents}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersCard}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>🔍 Filters</h3>
        <div style={styles.filterGrid}>
          <div>
            <label style={styles.filterLabel}>Action</label>
            <select
              style={styles.filterInput}
              value={filters.action}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="LOGIN_SUCCESS">Login Success</option>
              <option value="LOGIN_FAILED">Login Failed</option>
              <option value="REGISTER_SUCCESS">Register Success</option>
              <option value="LOGOUT">Logout</option>
              <option value="LOGIN_RATE_LIMITED">Rate Limited</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>Status</label>
            <select
              style={styles.filterInput}
              value={filters.success}
              onChange={(e) => handleFilterChange("success", e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="true">Success</option>
              <option value="false">Failed</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>From Date</label>
            <input
              type="date"
              style={styles.filterInput}
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div>
            <label style={styles.filterLabel}>To Date</label>
            <input
              type="date"
              style={styles.filterInput}
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              className="btn secondary"
              onClick={clearFilters}
              style={{ fontSize: "13px", width: "100%" }}
            >
              ✖️ Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Không có logs nào.</p>
        </div>
      ) : (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Thời gian</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>IP Address</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} style={styles.tr}>
                    <td style={styles.td}>{formatDate(log.timestamp)}</td>
                    <td style={styles.td}>
                      <div>
                        <div style={{ fontWeight: "600" }}>{log.userName}</div>
                        {log.userEmail && (
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {log.userEmail}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>{getActionBadge(log.action)}</td>
                    <td style={styles.td}>
                      <code style={{ fontSize: "12px" }}>{log.ipAddress || "N/A"}</code>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: log.success ? "#d1fae5" : "#fee2e2",
                          color: log.success ? "#065f46" : "#991b1b",
                        }}
                      >
                        {log.success ? "✓ Success" : "✗ Failed"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {log.errorMessage && (
                        <div style={{ fontSize: "12px", color: "#dc2626" }}>
                          {log.errorMessage}
                        </div>
                      )}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <details style={{ fontSize: "12px" }}>
                          <summary style={{ cursor: "pointer" }}>Metadata</summary>
                          <pre style={{ margin: "4px 0", fontSize: "11px" }}>
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button
              className="btn secondary"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{ fontSize: "13px" }}
            >
              ← Previous
            </button>
            <span style={{ margin: "0 12px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn secondary"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              style={{ fontSize: "13px" }}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #3b82f6",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1f2937",
  },
  filtersCard: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  filterLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#374151",
  },
  filterInput: {
    width: "100%",
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "14px",
  },
  tableContainer: {
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    background: "#f9fafb",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "12px",
    fontSize: "14px",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "24px",
  },
};

