import Lobby from "../models/Lobby.js";
import { dbConnected } from "../config/db.js";
import { addLobby, getLobby } from "../services/fallbackLobbyStore.js";

export async function lobbyCreate(req, res) {
  try {
    const lobbyData = {
      lobbyCode: req.body.lobbyCode,
      mode: req.body.mode,
      teamSize: req.body.teamSize, 
      difficulty: req.body.difficulty,
      battleTime: req.body.battleTime,
    };

    if (dbConnected) {
      const lobby = new Lobby(lobbyData);
      await lobby.save();
      return res.status(201).json({ message: "Lobby created successfully", lobby });
    }

    console.log("Database disconnected, using fallback lobby store for create");
    const lobby = addLobby(lobbyData);
    return res.status(201).json({ message: "Lobby created successfully (fallback)", lobby });

  } catch (error) {
    console.error("Error in lobbyCreate controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function lobbyJoin(req, res) {
  try {
    const { lobbyCode } = req.body;

    if (dbConnected) {
      const lobby = await Lobby.findOne({ lobbyCode: lobbyCode });
      if (lobby) {
        return res.status(200).json({ message: "Lobby found", lobby });
      } else {
        return res.status(404).json({ message: "Lobby not found" });
      }
    }

    console.log("Database disconnected, using fallback lobby store for join");
    const lobby = getLobby(lobbyCode);
    if (lobby) {
      return res.status(200).json({ message: "Lobby found (fallback)", lobby });
    } else {
      return res.status(404).json({ message: "Lobby not found" });
    }
  } catch (error) {
    console.error("Error in lobbyJoin controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}