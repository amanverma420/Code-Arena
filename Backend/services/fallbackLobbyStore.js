const lobbies = new Map();

export const addLobby = ({ lobbyCode, mode, teamSize, difficulty, battleTime }) => {
  if (!lobbyCode) return null;
  const lobby = {
    lobbyCode,
    mode: mode || "competitive",
    teamSize: teamSize || "1v1",
    difficulty: difficulty || "medium",
    battleTime: battleTime || "2",
    players: [],
  };
  lobbies.set(lobbyCode, lobby);
  return lobby;
};

export const getLobby = (lobbyCode) => {
  if (!lobbyCode) return null;
  return lobbies.get(lobbyCode) || null;
};

export const hasLobby = (lobbyCode) => {
  return Boolean(lobbyCode && lobbies.has(lobbyCode));
};

export const deleteLobby = (lobbyCode) => {
  if (!lobbyCode) return false;
  return lobbies.delete(lobbyCode);
};

export const clearLobbies = () => {
  lobbies.clear();
};
