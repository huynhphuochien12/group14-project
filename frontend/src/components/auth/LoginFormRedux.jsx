import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  login, 
  selectAuthLoading, 
  selectAuthError,
  clearError 
} from "../../store/slices/authSlice";
import { useToast } from "../../contexts/ToastContext";

export default function LoginFormRedux() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(resultAction)) {
        // Login successful
        const user = resultAction.payload.user;
        
        addToast("Đăng nhập thành công!", 'success');
        
        // Redirect based on role
        if (user.role === "admin" || user.role === "moderator") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        // Login failed - error already shown by useEffect
        console.error("Login failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      addToast("Đã xảy ra lỗi không mong muốn", 'error');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Đăng nhập</h2>
        <p className="auth-sub">Đăng nhập để tiếp tục đến trang cá nhân</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>

          <div className="center">
            <button 
              className="btn" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>
        </form>

        <div style={{textAlign:'center', marginTop:12}}>
          <Link to="/forgot-password" style={{fontSize:13,color:'#4f46e5'}}>
            Quên mật khẩu?
          </Link>
        </div>

        <div style={{textAlign:'center', marginTop:12}}>
          <span style={{fontSize:13,color:'#6b7280'}}>Chưa có tài khoản? </span>
          <Link to="/signup" style={{fontSize:13,color:'#4f46e5'}}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

