const isAdmin = (req, res, next) => {
      console.log("REQ.USER:", req.user);
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access only admin bro" });
  }

  next();
};

module.exports = isAdmin;
