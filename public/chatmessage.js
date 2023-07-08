const chatForm = document.querySelector(".send_btn")

chatForm.addEventListener("click", (e) => {
    e.preventDefault();
    textbox = document.getElementById("msgtext")
    const msg = textbox.value
    if (msg == "") return
    
    console.log(msg)
    const files = document.querySelector("#fileup")
    console.log(files)
    tosend = document.querySelector(".active").getAttribute("id")

    const lol = new FormData()
    lol.append("fileup", files.files[0])
    lol.append("message", msg)
    lol.append("tosend", tosend)
    fetch("/message", {
        method:"POST",
        body: lol,
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        if (data["reply"] == "noerror"){
            socket.emit("chatMessage", {
                "username":username,
                "tosend":tosend,
                "message":msg,
                "image":data.file
            })
            const div = document.createElement('div')
                div.setAttribute("id", data._id)
                div.classList.add("d-flex")
                div.classList.add("justify-content-start")
                div.classList.add("mb-4")
                div.innerHTML = 
                    `<div class="img_cont_msg">`
                    +((userlist[username]!=="") ? `<img src="images/${userlist[username]}" class="rounded-circle user_img_msg">`:`<img src="images/anonymous.jpg" class="rounded-circle user_img_msg">`)
                    +`</div>
                    <div class="msg_container">`
                    + ((data.file) ? `<img style="width:20vh;" src="images/${data.file}"><br>` : "")
                    +`${msg}
                    </div>`
                    
                
                document.querySelector(".msg_card_body").appendChild(div)
                chatMessages.scrollTop = chatMessages.scrollHeight
            textbox.value = ""
            files.value = ""
            textbox.focus()
        }
    })
})

socket.on("chatMessage", fmessage => {
    console.log("Socket:", fmessage.username, discussions)
    tosend = document.querySelector(".active").getAttribute("id")
    if (tosend !== fmessage["username"])
        return

    const div = document.createElement('div')
        div.setAttribute("id", fmessage._id)
        div.classList.add("d-flex")
        div.classList.add("justify-content-end")
        div.classList.add("mb-4")
        div.innerHTML = `
            <div class="msg_container_send">`
            + ((fmessage.image) ? `<img style="width:20vh;" src="images/${fmessage.image}"><br>` : "")
            +`${fmessage["text"]}
            </div>`+
            `<div class="img_cont_msg">`
            +((userlist[tosend]!=="")?  `<img src="images/${userlist[tosend]}" class="rounded-circle user_img_msg">`:`<img src="images/anonymous.jpg" class="rounded-circle user_img_msg">`)+
            `</div>`
            
        
        document.querySelector(".msg_card_body").appendChild(div)
        chatMessages.scrollTop = chatMessages.scrollHeight
})