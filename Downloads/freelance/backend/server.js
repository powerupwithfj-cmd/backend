const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  message: "Too Many Requests, Please Wait A Minute ",
});
app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(express.json());
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const AdminUserRoutes = require("./Routes/adminUserRoutes");
const productroutes = require("./Routes/productRoutes");
const authrouter = require("./routes/authRoutes");

app.use("/uploads", express.static("uploads"));
app.use("/auth/products", productroutes);
app.use("/auth", authrouter);
app.use("/auth/users", AdminUserRoutes);
app.get("/", (req, res) => {
  res.send("hello from auth server");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
