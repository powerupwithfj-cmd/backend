const User = require("../model/Usermodel");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot block yourself" });

    user.isBlocked = true;
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UNBLOCK USER
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CHANGE ROLE
exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You cannot change your own role" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
