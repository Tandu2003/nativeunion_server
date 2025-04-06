const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb.config");
const { clientUrl } = require("./config/env.config");

const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
