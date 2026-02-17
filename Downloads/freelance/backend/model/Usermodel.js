const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user", 
  },
  isBlocked: {
  type: Boolean,
  default: false
},
});

module.exports = mongoose.model("User", userSchema);