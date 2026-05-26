const users = [];

export const findUserByCredentials = async (username, password) => {
  return users.filter((user) => user.username === username && user.password === password);
};

export const findUserByUsername = async (username) => {
  return users.find((user) => user.username === username) || null;
};

export const addUser = async ({ username, password }) => {
  const newUser = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    username,
    password,
    rating: 1500,
  };
  users.push(newUser);
  return newUser;
};

export const updateUserRating = async (username, newRating) => {
  const user = users.find((user) => user.username === username);
  if (!user) return null;
  user.rating += newRating;
  return user;
};
