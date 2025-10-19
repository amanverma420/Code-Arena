import Lobby from "../models/Lobby.js";

export async function lobbyCreate(req, res) {
  try {
    const lobby = new Lobby({
      lobbyCode: req.body.lobbyCode,
      mode: req.body.mode,
      teamSize: req.body.teamSize, 
      difficulty: req.body.difficulty,
    });
    await lobby.save();
    res.status(201).json({ message: "Lobby created successfully", lobby });

  } catch (error) {
    console.error("Error in lobbyCreate controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function lobbyJoin(req, res) {
  try {
    const { lobbyCode } = req.body;
    const lobby = await Lobby.findOne({ lobbyCode: lobbyCode });
    if (lobby) {
      res.status(200).json({ message: "Lobby found", lobby });
    } else {
      res.status(404).json({ message: "Lobby not found" });
    }
  } catch (error) {
    console.error("Error in lobbyJoin controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}