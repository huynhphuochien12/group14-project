import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";
import "../../App.css";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devToken, setDevToken] = useState(null);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      addToast("⚠️ Vui lòng nhập email", "warning");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast("❌ Email không hợp lệ", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      console.log("Forgot password response:", response.data);

      setSent(true);
      addToast("✅ " + (response.data.message || "Đã gửi email hướng dẫn!"), "success");

      // For development testing
      if (response.data.resetToken) {
        setDevToken(response.data.resetToken);
        if (response.data.resetUrl) {
          console.log("🔗 Reset URL (dev):", response.data.resetUrl);
        }
      }

      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      addToast(
        err.response?.data?.message || "❌ Lỗi khi gửi email đặt lại mật khẩu",
        "error"
      );
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
          <div style={styles.actions}>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setSent(false)}
              style={styles.secondaryButton}
            >
              Gửi lại
            </button>
            <button
              className="btn"
              onClick={() => navigate("/login")}
              style={styles.primaryButton}
            >
              Quay lại đăng nhập
            </button>
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
            style={{ width: "100%", marginTop: 16 }}
          >
            {loading ? "⏳ Đang gửi..." : "📧 Gửi Email Đặt Lại Mật Khẩu"}
          </button>
        </form>

        {devToken && (
          <div style={styles.devToken}>
            <p style={styles.devTokenTitle}>DEV reset token:</p>
            <div style={styles.tokenDisplay}>
              <pre style={styles.tokenPre}>{devToken}</pre>
              <button
                onClick={() => {
                  navigate(`/reset-password?token=${devToken}`);
                }}
                className="btn secondary"
                style={styles.useTokenButton}
              >
                Dùng token này
              </button>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <a href="/login" style={styles.link}>
            ← Quay lại đăng nhập
          </a>
        </div>
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
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  primaryButton: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  form: {
    marginBottom: "24px",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    transition: "border-color 0.15s ease",
    "&:focus": {
      borderColor: "#667eea",
      outline: "none",
    },
  },
  devToken: {
    marginTop: "24px",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "8px",
  },
  devTokenTitle: {
    fontSize: "13px",
    color: "#4b5563",
    marginBottom: "8px",
  },
  tokenDisplay: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  tokenPre: {
    flex: 1,
    background: "#ffffff",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "12px",
    overflow: "auto",
    margin: 0,
  },
  useTokenButton: {
    whiteSpace: "nowrap",
    fontSize: "12px",
    padding: "4px 8px",
  },
  footer: {
    textAlign: "center",
    marginTop: "16px",
  },
  link: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};