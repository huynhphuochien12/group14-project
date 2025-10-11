// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");

// GET và POST
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
