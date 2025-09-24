import User from "../models/User.js";

export async function lobbyCreate(req, res) {
  try {
    const lobbyID = Math.random() * (100000 - 10000) + 10000;
    res.json({ lobbyID: Math.floor(lobbyID) });
    console.log("Lobby created with ID:", Math.floor(lobbyID));
  } catch (error) {
    console.error("Error in lobbyCreate controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function lobbyJoin(req, res) {
  try {
  } catch (error) {
  }
}