const axios = require("axios");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utlis/googleclient");
const User = require("../model/Usermodel");

// Tokens
const generateAccessToken = (user) => {
  console.log("User object in token generation:", user); // <-- check user
  if (!user || !user._id) {
    console.log("User invalid, cannot generate access token");
    return null;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  console.log("Access Token generated:", token); // <-- check token
  return token;
};

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

// GOOGLE LOGIN
exports.googleAuth = async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: "Code missing" });

  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
    );

    const { email, name, picture } = userRes.data;
    if (!email)
      return res.status(400).json({ message: "No email from Google" });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, image: picture });
    if (user.isBlocked) {
      return res.status(403).json({ message: "Acess blocked by admin" });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err.response?.data || err.message || err);
    res.status(500).json({ message: "Google Auth Failed" });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role }, // ✅ include role
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Not authenticated" });
    const user = await User.findById(req.user.id).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.log("Get user error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ message: "logout Something went wrong" });
  }
};
