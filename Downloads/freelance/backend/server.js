const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(cookieParser());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));

// Routes
const productroutes = require("./Routes/productRoutes");
app.use("/auth/products", productroutes);

const authrouter = require("./routes/authRoutes");
app.use("/auth", authrouter);

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
