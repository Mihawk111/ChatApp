const users = [];

exports.useronline = (id, username) => {
  const user = { id, username };
  users.push(user);
  return user;
};

exports.getuserfromid = (id) => {
  return users.find((user) => user.id === id);
};

exports.getuserfromname = (name) => {
  res = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].username == name) res.push(users[i].id);
  }
  return res;
};

exports.getallusers = () => {
  return users;
};

exports.useroffline = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    var t = users.splice(index, 1)[0];
    return t;
  }
};
