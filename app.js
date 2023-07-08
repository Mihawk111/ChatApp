const express = require("express");
const app = express();
const server = require("http").createServer(app);
const multer = require("multer");
const bodyParser = require("body-parser");
const io = require("socket.io")(server);
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const port = 3000;

const controller = require("./controller");
const fMessage = require("./models/message");
const userlist = require("./models/users");
const message = require("./models/messages");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images/"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "NoobDev",
    resave: false,
    saveUninitialized: false,
  })
);

io.on("connection", (socket) => {
  console.log("connected");

  socket.emit("online", "welcome to wapp");

  socket.on("chatMessage", (msg) => {
    user = userlist.getuserfromid(socket.id);
    username = msg["username"];
    to_send = msg["tosend"];
    image = msg["image"];
    msg = msg["message"];
    res = userlist.getuserfromname(to_send);
    for (var i = 0; i < res.length; i++) {
      socket
        .to(res[i])
        .emit("chatMessage", fMessage.message(username, msg, image));
    }
  });

  socket.on("gotonline", (username) => {
    const user = userlist.useronline(socket.id, username);
    socket.broadcast.emit("gotonline", username);
  });

  socket.on("disconnect", () => {
    const user = userlist.useroffline(socket.id);
    if (user) {
      io.emit("gotoffline", user.username);
    }
  });
});

app.set("view engine", "ejs");

app.get("/login", controller.getlogin);
app.get("/signup", controller.getsignup);
app.get("/getsessionowner", controller.getsessionowner);
app.get("/discussions", controller.getdiscussions);
app.get("/messages/:chattosend/", controller.messages);
app.get("/", controller.main);
app.post(
  "/login",
  bodyParser.urlencoded({ extended: false }),
  controller.postlogin
);
app.post("/signup", upload.single("avatar"), controller.postsignup);
app.post(
  "/message",
  upload.single("fileup"),
  bodyParser.json(),
  controller.postmessages
);

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://siam:password@cluster0.8kqokcl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) =>
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    })
  )
  .catch((err) => console.log("Error connecting to database"));
