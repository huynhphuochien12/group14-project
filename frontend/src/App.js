import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>Quản lý người dùng</h1>
        <nav>
          <Link to="/" style={{ marginRight: "10px" }}>Danh sách</Link>
          <Link to="/add">Thêm người dùng</Link>
        </nav>

        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/add" element={<AddUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
