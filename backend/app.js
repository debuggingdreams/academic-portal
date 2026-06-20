const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors"); 

dotenv.config();
connectDB();

const app = express();

// Middleware configured before routes
app.use(express.json());
app.use(cors());

// Mount routes cleanly
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));

// Unified to Port 5000 to match Angular frontend expectations
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));