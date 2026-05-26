import User from "../models/User.js";
import { dbConnected } from "../config/db.js";
import {
  findUserByCredentials,
  updateUserRating,
} from "../services/fallbackUserStore.js";

export async function login(req, res) {
  try {
    if (dbConnected) {
      const user = await User.find({ username: req.body.formData.email, password: req.body.formData.password });
      if (user.length === 0) {
        return res.status(404).json({ message: "User not found!" });
      }
      return res.json({ message: "Authenticated", user });
    }

    const user = await findUserByCredentials(req.body.formData.email, req.body.formData.password);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.json({ message: "Authenticated", user });
  } catch (error) {
    console.error("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateRating(req, res) {
  try {
    const { username, newRating } = req.body;

    if (dbConnected) {
      const user = await User.findOneAndUpdate({ username: username }, { $inc: { rating: newRating } }, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      return res.json({ message: "Rating updated", user });
    }

    const user = await updateUserRating(username, newRating);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.json({ message: "Rating updated", user });
  } catch (error) {
    console.error("Error in updateRating controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}