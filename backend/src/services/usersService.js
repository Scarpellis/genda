const users = [];

function createUser(userData) {
  const { name, email, phone, password } = userData;
  const user = { name, email, phone, password };
  users.push(user);
  return user;
}

function listUsers() {
  return users;
}

module.exports = { createUser, listUsers };
