discussions = document.querySelectorAll("discussion");
discussion_length = discussions.discussion_length;

console.log(discussions);
console.log(discussion_length);

for (var i = 1; i < discussion_length; i++) {
  console.log(discussions[i]);
  discussions[i].addEventListener("click", (e) => {
    e.preventDefault();
    console.log(discussion[i].getAttribute("id"));
  });
}
