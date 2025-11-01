import React, { useState, useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import "../../App.css";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();


import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";  // 👈 Thêm useNavigate
import "../../App.css";

export default function ResetPasswordForm() {

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Lấy token từ URL query params
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      addToast("Link đặt lại mật khẩu không hợp lệ", "error");
      navigate("/login");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate, addToast]);

  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate(); // 👈 Khởi tạo navigate

  // 🔹 Lấy token từ URL (vd: /reset-password?token=abc123)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, [location.search]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    // Validation
    if (!password || !confirmPassword) {
      addToast("Vui lòng nhập đầy đủ thông tin", "warning");
      return;
    }

    if (password.length < 6) {
      addToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return;
    }

    if (password !== confirmPassword) {
      addToast("Mật khẩu xác nhận không khớp", "error");
      return;

    if (!token || !password) {
      return addToast("Vui lòng nhập token và mật khẩu mới", "warning");
    }
    if (password !== confirmPassword) {
      return addToast("Mật khẩu nhập lại không khớp", "error");

    }

    setLoading(true);
    try {

      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });

      console.log("Reset password response:", response.data);

      setSuccess(true);
      addToast("✅ " + (response.data.message || "Đổi mật khẩu thành công!"), "success");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      addToast(
        err.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
        "error"
      );

      await api.post("/auth/reset-password", { token, password });
      addToast("Đổi mật khẩu thành công! Hãy đăng nhập lại.", "success");

      // ✅ Sau khi đổi mật khẩu thành công, quay lại trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 1500); // đợi 1.5 giây cho toast hiển thị xong
    } catch (err) {
      console.error("❌ Reset error:", err);
      addToast(err.response?.data?.message || "Đổi mật khẩu thất bại", "error");

    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.title}>Thành Công!</h2>
          <p style={styles.description}>
            Mật khẩu của bạn đã được đặt lại thành công.
          </p>
          <p style={styles.hint}>Đang chuyển đến trang đăng nhập...</p>
          <a href="/login" className="btn" style={{ display: "block", textAlign: "center" }}>
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <div style={styles.icon}>🔑</div>
        </div>

        <h2 style={styles.title}>Đặt Lại Mật Khẩu</h2>
        <p style={styles.description}>Nhập mật khẩu mới của bạn bên dưới.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mật khẩu mới</label>

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Đặt lại mật khẩu</h2>
        <p className="auth-sub">
          Dán token nhận được hoặc dùng link từ email, nhập mật khẩu mới
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reset token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              disabled={loading}
              style={styles.input}
              required
              minLength={6}
            />
            <div style={styles.passwordHint}>
              {password.length > 0 && password.length < 6 && (
                <span style={{ color: "#ef4444" }}>
                  ⚠️ Mật khẩu quá ngắn (tối thiểu 6 ký tự)
                </span>
              )}
              {password.length >= 6 && (
                <span style={{ color: "#10b981" }}>✓ Độ dài hợp lệ</span>
              )}
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Xác nhận mật khẩu</label>

              required
            />
          </div>

          <div className="form-group">
            <label>Nhập lại mật khẩu</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}

              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
              style={styles.input}
              required
            />
            <div style={styles.passwordHint}>
              {confirmPassword.length > 0 &&
                password !== confirmPassword && (
                  <span style={{ color: "#ef4444" }}>
                    ⚠️ Mật khẩu không khớp
                  </span>
                )}
              {confirmPassword.length > 0 &&
                password === confirmPassword && (
                  <span style={{ color: "#10b981" }}>✓ Mật khẩu khớp</span>
                )}
            </div>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading || password !== confirmPassword || password.length < 6}
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "⏳ Đang xử lý..." : "🔐 Đặt Lại Mật Khẩu"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/login" style={styles.link}>
            ← Quay lại đăng nhập
          </a>

              required
            />
          </div>

          <div className="center">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}


const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    padding: "40px",
    maxWidth: "450px",
    width: "100%",
  },
  iconWrapper: {
    textAlign: "center",
    marginBottom: "20px",
  },
  icon: {
    fontSize: "64px",
    display: "inline-block",
  },
  successIcon: {
    fontSize: "64px",
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: "12px",
  },
  description: {
    fontSize: "15px",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: "24px",
    lineHeight: 1.6,
  },
  hint: {
    fontSize: "14px",
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: "24px",
  },
  form: {
    marginTop: "24px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "15px",
    transition: "all 0.3s",
    boxSizing: "border-box",
  },
  passwordHint: {
    marginTop: "6px",
    fontSize: "13px",
    minHeight: "20px",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
};
