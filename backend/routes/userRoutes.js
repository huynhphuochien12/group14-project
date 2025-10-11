// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Danh sách user
router.get("/", userController.getUsers);

// Tạo user mới
router.post("/", userController.createUser);

module.exports = router;
