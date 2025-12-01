import User from "../models/User.js";

export async function login(req, res) {
  try {
    const user = await User.find({ username: req.body.formData.email, password: req.body.formData.password });
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "Authenticated" , user });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateRating(req, res) {
  try {
    const { username, newRating } = req.body;
    const user = await User.findOneAndUpdate({username : username}, { $inc : { rating: newRating }}, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "Rating updated", user });
  } catch (error) {
    console.error("Error in updateRating controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}