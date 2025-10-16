import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/users", { name, email })
      .then(() => navigate("/"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Thêm người dùng mới</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;