import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  login,
  selectAuthLoading,
  selectAuthError,
  clearError,
} from "../../store/slices/authSlice";
import { useToast } from "../../contexts/ToastContext";

export default function RegisterFormRedux() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      addToast(error, "error");
    }
  }, [error, addToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      addToast("Vui lòng điền đầy đủ thông tin", "warning");
      return;
    }

    if (form.password.length < 6) {
      addToast("Mật khẩu phải có ít nhất 6 ký tự", "warning");
      return;
    }

    if (form.password !== form.confirmPassword) {
      addToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    try {
      // Register
      const registerAction = await dispatch(
        register({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      );

      if (register.fulfilled.match(registerAction)) {
        addToast("Đăng ký thành công!", "success");

        // Auto login after register
        const loginAction = await dispatch(
          login({
            email: form.email,
            password: form.password,
          })
        );

        if (login.fulfilled.match(loginAction)) {
          addToast("Đã đăng nhập!", "success");
          navigate("/profile");
        } else {
          // Login failed, redirect to login page
          navigate("/login");
        }
      } else {
        // Register failed - error already shown
        console.error("Register failed:", registerAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      addToast("Đã xảy ra lỗi không mong muốn", "error");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Đăng ký</h2>
        <p className="auth-sub">Tạo tài khoản mới để bắt đầu</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
                Mật khẩu không khớp
              </span>
            )}
          </div>

          <div className="center">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            Đã có tài khoản?{" "}
          </span>
          <Link to="/login" style={{ fontSize: 13, color: "#4f46e5" }}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

