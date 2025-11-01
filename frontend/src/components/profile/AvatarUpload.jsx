import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import "../../App.css";

export default function AvatarUpload({ currentAvatar, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar || null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const { addToast } = useToast();

  // ✅ Tự động cập nhật preview nếu avatar hiện tại thay đổi
  useEffect(() => {
    setPreview(currentAvatar || null);
  }, [currentAvatar]);

  // ✅ Xử lý chọn file
  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    // Validate loại file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(f.type)) {
      addToast("❌ Chỉ chấp nhận ảnh (JPEG, PNG, WebP)", "error");
      return;
    }

    // Validate dung lượng (tối đa 5MB)
    if (f.size > 5 * 1024 * 1024) {
      addToast("⚠️ Ảnh quá lớn! Giới hạn 5MB", "error");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // ✅ Xử lý upload
  const handleUpload = async () => {
    if (!file) {
      addToast("⚠️ Vui lòng chọn ảnh trước", "warning");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("avatar", file);

      const response = await api.post("/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addToast("✅ Upload avatar thành công!", "success");

      // Cập nhật lại preview nếu có URL mới
      if (response.data.avatar) {
        setPreview(response.data.avatar);
      }

      // Reset input
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";

      // Gọi callback reload dữ liệu user
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error("❌ Upload avatar lỗi:", err);
      addToast(err.response?.data?.message || "Upload thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Giao diện hiển thị
  return (
    <div style={{ marginTop: 16, marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: 16,
          background: "#f9fafb",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Avatar Preview */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: 32, color: "#9ca3af", fontWeight: 600 }}>
              👤
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: 14, color: "#374151" }}>
            Ảnh đại diện
          </h4>
          <p style={{ margin: "0 0 12px 0", fontSize: 12, color: "#6b7280" }}>
            JPEG, PNG, WebP - Tối đa 5MB. Ảnh sẽ được resize về 300x300.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="btn secondary"
              onClick={() => inputRef.current?.click()}
              style={{ fontSize: 13 }}
            >
              📁 Chọn ảnh
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleUpload}
              disabled={loading || !file}
              style={{ fontSize: 13 }}
            >
              {loading ? "⏳ Đang upload..." : "📤 Upload"}
            </button>
          </div>

          {file && (
            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: 12,
                color: "#059669",
                fontWeight: 500,
              }}
            >
              ✓ Đã chọn: {file.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
