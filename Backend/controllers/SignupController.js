import User from "../models/User.js";

export async function signup(req, res) {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = new User({
      username,
      password  
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Account created successfully",
      user: {
        id: newUser._id,
        name: newUser.username
      }
    });

  } catch (error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
