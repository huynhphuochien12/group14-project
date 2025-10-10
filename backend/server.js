// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

// Import route user
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
