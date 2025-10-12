<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const { getUsers, createUser, deleteUser } = require("../controllers/userController");
=======
// // // routes/userRoutes.js

// // const express = require("express");
// // const router = express.Router();
// // const userController = require("../controllers/userController");

// // // Danh sách user
// // router.get("/", userController.getUsers);

// // // Tạo user mới
// // router.post("/", userController.createUser);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Using base path /api/users from server.js
// router.get('/', userController.getUsers);
// router.post('/', userController.createUser);
// router.put('/:id', userController.updateUser);      // PUT /api/users/:id
// router.delete('/:id', userController.deleteUser);   // DELETE /api/users/:id

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { getUsers, createUser } = require("../controllers/userController");

// router.get("/", getUsers);
// router.post("/", createUser);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
>>>>>>> afb139a6b57fc65949e733b4c16575b95c313fd0

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);    // ✅ PUT
router.delete("/:id", deleteUser); // ✅ DELETE

// DELETE
router.delete("/:id", deleteUser);

module.exports = router;


