const session = require("express-session");
const { Message, User } = require("./models/messages.js");

exports.getlogin = function (req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("login", { msg: "" });
  }
};

exports.main = function (req, res, next) {
  if (req.session.user != null) {
    console.log(req.session.user);
    res.render("main", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
};

exports.getsessionowner = (req, res) => {
  User.find({ username: req.session.user }).then((data) => {
    console.log(data);
    if (data.length == 0) console.log("no session error");
    else {
      res.json({
        username: req.session.user,
      });
    }
  });
};

exports.postlogin = (req, res, next) => {
  const uname = req.body.username;
  const pw = req.body.password;
  User.find({ username: uname, password: pw }).then((data) => {
    if (data.length) {
      req.session.user = uname;
      res.redirect("/");
    } else {
      res.render("login", { msg: "Account not found" });
    }
  });
};

exports.getsignup = function (req, res, next) {
  res.render("signup", { msg: "" });
};

exports.postsignup = (req, res, next) => {
  file = req.file;
  const uname = req.body.username;
  const pw = req.body.password;
  const cpw = req.body.cpassword;
  if (pw != cpw) {
    res.render("signup", { msg: "Passwords don't match" });
  } else {
    const newUser = new User({
      username: uname,
      password: pw,
      image: file ? file.originalname : "",
    });
    newUser
      .save()
      .then(function (value) {
        console.log("new user, all ok:" + uname);
        req.session.user = uname;
        res.redirect("/");
      })
      .catch((err) => {
        console.log("same user");
        res.render("signup", { msg: "User exists, try logging in" });
      });
  }
};

exports.postmessages = (req, res, next) => {
  const tosend = req.body.tosend;
  const username = req.session.user;
  const message = req.body.message;
  console.log(message);
  console.log(username);
  file = req.file;
  if (file) file = file.originalname;

  if (username > tosend) str = tosend + username;
  else str = username + tosend;
  const instance = new Message({
    chat: str,
    sender: username,
    text: message,
    image: file,
  });
  instance
    .save()
    .then(function (val) {
      res.json({
        _id: val._id,
        reply: "noerror",
        file: file,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.messages = (req, res, next) => {
  to_send = req.params["chattosend"];
  from_send = req.session.user;

  if (to_send > from_send) str = from_send + to_send;
  else str = to_send + from_send;

  Message.find({ chat: str }).then((data) => res.json(data));
};

exports.getdiscussions = (req, res) => {
  if (req.session.user) {
    User.find().then((data) => {
      let i = 0;
      disc = {};
      for (i = 0; i < data.length; i++) {
        let uname = data[i].username;
        let image = data[i].image;
        disc[uname] = image;
      }
      res.json(disc);
    });
  } else res.redirect("/");
};
