import React, { useState } from "react";

import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

import { useToast } from "../../contexts/ToastContext";

import "../../App.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);

  const [devToken, setDevToken] = useState(null);

  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!email) {
      addToast("Vui lòng nhập email", "warning");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast("Email không hợp lệ", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      
      console.log("Forgot password response:", response.data);
      
      setSent(true);
      addToast("✅ " + (response.data.message || "Email đã được gửi!"), "success");
      
      // Nếu có resetUrl (dev mode), log ra
      if (response.data.resetUrl) {
        console.log("🔗 Reset URL (dev):", response.data.resetUrl);
        addToast("Check console for reset link (dev mode)", "info");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      addToast(
        err.response?.data?.message || "Lỗi khi gửi email đặt lại mật khẩu",
        "error"
      );

    if (!email) return addToast('Vui lòng nhập email', 'warning');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      addToast(res.data.message || 'Nếu email tồn tại, một liên kết đã được gửi', 'success');
      if (res.data?.resetToken) setDevToken(res.data.resetToken);
      setEmail('');
    } catch (err) {
      console.error('Lỗi forgot-password:', err);
      addToast(err.response?.data?.message || 'Gửi yêu cầu thất bại', 'error');

    } finally {
      setLoading(false);
    }
  };


  if (sent) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>📧</div>
          <h2 style={styles.title}>Email Đã Được Gửi!</h2>
          <p style={styles.description}>
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
          </p>
          <p style={styles.hint}>
            Vui lòng kiểm tra hộp thư (và cả thư mục spam) của bạn.
          </p>
          <div style={styles.actionRow}>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setSent(false)}
              style={{ marginRight: 8 }}
            >
              Gửi lại
            </button>
            <a href="/login" className="btn">
              Quay lại đăng nhập
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <div style={styles.icon}>🔐</div>
        </div>
        
        <h2 style={styles.title}>Quên Mật Khẩu?</h2>
        <p style={styles.description}>
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              disabled={loading}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ width: "100%", marginTop: 8 }}
          >
            {loading ? "⏳ Đang gửi..." : "📧 Gửi Email Đặt Lại Mật Khẩu"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/login" style={styles.link}>
            ← Quay lại đăng nhập
          </a>
        </div>

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Quên mật khẩu</h2>
        <p className="auth-sub">Nhập email để nhận liên kết đặt lại mật khẩu</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="center">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi liên kết'}</button>
          </div>
        </form>
        {devToken && (
          <div style={{marginTop:12}}>
            <p style={{fontSize:13}}>DEV reset token (dùng để test reset):</p>
            <pre style={{background:'#f3f4f6',padding:8,borderRadius:6}}>{devToken}</pre>
          </div>
        )}

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
    animation: "pulse 2s infinite",
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
  actionRow: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
  },
};

