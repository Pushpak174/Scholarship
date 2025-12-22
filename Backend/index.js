const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./App/routes/authRoutes");
const scholarshipRoutes = require("./App/routes/scholarship");
const matchRoutes = require("./App/routes/matchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error", err));

app.use("/website/auth", authRoutes);
app.use("/website/scholarship", scholarshipRoutes);
app.use("/website/match", matchRoutes); // ✅ THIS WAS MISSING

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
