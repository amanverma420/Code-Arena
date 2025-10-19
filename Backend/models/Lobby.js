import mongoose from "mongoose";

const lobbySchema = new mongoose.Schema(
  {
    lobbyCode: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    teamSize: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
  }
  // createdAt, updatedAt
);

const Lobby = mongoose.model("Lobby", lobbySchema);

export default Lobby;