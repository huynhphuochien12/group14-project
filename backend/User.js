// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String
// });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 🔥 thêm dòng này
});

module.exports = mongoose.model("User", userSchema);

