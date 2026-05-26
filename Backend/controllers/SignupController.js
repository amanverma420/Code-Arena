import User from "../models/User.js";
import { dbConnected } from "../config/db.js";
import { findUserByUsername, addUser } from "../services/fallbackUserStore.js";

export async function signup(req, res) {
  try {
    const { username, password } = req.body;

    if (dbConnected) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const newUser = new User({
        username,
        password,
      });

      await newUser.save();

      return res.status(201).json({
        message: "Account created successfully",
        user: {
          id: newUser._id,
          name: newUser.username,
        },
      });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await addUser({ username, password });
    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser.id,
        name: newUser.username,
      },
    });
  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
