fetch("/discussions")
  .then((res) => res.json())
  .then((discussion) => {
    userlist = discussion;
    console.log(discussion);
    for (elem in discussion) {
      if (elem === username) continue;
      tousername = elem;
      photo =
        discussion[tousername] !== ""
          ? discussion[tousername]
          : "anonymous.jpg";

      const div = document.createElement("li");
      div.classList.add("discussion");
      div.setAttribute("id", tousername);
      div.innerHTML = `
            <div class="d-flex bd-highlight">
								<div class="img_cont">
									<img src="images/${photo}" class="rounded-circle user_img">
									<span class="online_icon offline"></span>
								</div>
								<div class="user_info">
									<span>${tousername}</span>
									<p></p>
								</div>
							</div>
            `;
      document.querySelector(".contacts").appendChild(div);

      div.addEventListener("click", (e) => {
        if ((discussion_active = document.querySelector(".active")))
          discussion_active.classList.remove("active");
        div.classList.add("active");
        // t = document.getElementById("chat-init-name")
        // t.innerText = div.getAttribute("id")

        fetch(`/messages/${div.getAttribute("id")}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            document.querySelector(".msg_head").innerHTML = "";
            sender = div.getAttribute("id");
            dp =
              discussion[sender] !== "" ? discussion[sender] : "anonymous.jpg";
            const div2 = document.createElement("div");
            div2.classList.add("d-flex");
            div2.classList.add("bd-highlight");
            div2.innerHTML = `
                            <div class="img_cont">
                                <img src="images/${dp}" class="rounded-circle user_img">
                                <span class="online_icon offline"></span>
                            </div>
                            <div class="user_info">
                                <span>Chat with ${sender}</span>
                            </div>
                            `;
            document.querySelector(".msg_head").appendChild(div2);

            document.querySelector(".msg_card_body").innerHTML = "";
            for (var i = 0; i < data.length; i++) {
              sender = data[i]["sender"];
              text = data[i]["text"];
              if (sender === username) {
                console.log("USER:", username);
                const div = document.createElement("div");
                div.setAttribute("id", data[i]._id);
                div.classList.add("d-flex");
                div.classList.add("justify-content-start");
                div.classList.add("mb-4");
                console.log(discussion[sender]);
                div.innerHTML =
                  `<div class="img_cont_msg">` +
                  (discussion[sender] !== ""
                    ? `<img src="images/${discussion[sender]}" class="rounded-circle user_img_msg">`
                    : `<img src="images/anonymous.jpg" class="rounded-circle user_img_msg">`) +
                  `</div>
                                        <div class="msg_container">` +
                  (data[i].image
                    ? `<img style="width:20vh;" src="images/${data[i].image}"><br>`
                    : "") +
                  `${text}
                                        </div>`;

                document.querySelector(".msg_card_body").appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
              } else {
                console.log(discussion[sender]);
                const div = document.createElement("div");
                div.setAttribute("id", data[i]._id);
                div.classList.add("d-flex");
                div.classList.add("justify-content-end");
                div.classList.add("mb-4");
                div.innerHTML =
                  `
                                        <div class="msg_container_send">` +
                  (data[i].image
                    ? `<img style="width:20vh;" src="images/${data[i].image}"><br>`
                    : "") +
                  `${text}
                                        </div>` +
                  `<div class="img_cont_msg">` +
                  (discussion[sender] !== ""
                    ? `<img src="images/${discussion[sender]}" class="rounded-circle user_img_msg">`
                    : `<img src="images/anonymous.jpg" class="rounded-circle user_img_msg">`) +
                  `</div>`;

                document.querySelector(".msg_card_body").appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }
            }
          });
      });
    }
  });
