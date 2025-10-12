const express = require("express");
const router = express.Router();
const { getUsers, createUser, deleteUser } = require("../controllers/userController");

// GET và POST
router.get("/", getUsers);
router.post("/", createUser);

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;
