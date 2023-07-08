const socket = io();
const chatMessages = document.querySelector(".msg_card_body");

fetch("/getsessionowner")
  .then((res) => res.json())
  .then((data) => {
    username = data["username"];
    socket.emit("gotonline", username);
  });
