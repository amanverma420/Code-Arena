import User from "../models/User.js";

export async function login(req, res) {
  try {
    const user = await User.find({ username: req.body.formData.email, password: req.body.formData.password });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "Authenticated" });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}