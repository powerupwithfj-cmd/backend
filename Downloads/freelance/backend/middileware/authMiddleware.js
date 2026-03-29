const jwt = require("jsonwebtoken");
const User = require("../model/Usermodel");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Fetch fresh user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User not found" });

    if (user.isBlocked)
      return res.status(403).json({ message: "Account blocked by admin" });

    req.user = user; 
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
