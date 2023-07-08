// socket.emit("gotonline", username)

socket.on("gotonline", (username) => {
  const div = document.getElementById(username).querySelector(".online_icon");
  div.classList.remove("offline");

  const user = document.getElementById(username);
  if (user.classList.contains("active")) {
    const div2 = document
      .querySelector(".msg_head")
      .querySelector("online_icon");
    div2.classList.remove("offline");
  }
});

socket.on("gotoffline", (username) => {
  const div = document.getElementById(username).querySelector(".online_icon");
  div.classList.add("offline");

  const user = document.getElementById(username);
  if (user.classList.contains("active")) {
    const div2 = document
      .querySelector(".msg_head")
      .querySelector("online_icon");
    div2.classList.add("offline");
  }
});
