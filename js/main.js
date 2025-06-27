document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const postBtn = document.getElementById("postBtn");
  const postImageInput = document.getElementById("postImage");
  const feedContainer = document.getElementById("feedContainer");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  postBtn.addEventListener("click", () => {
    const textArea = document.querySelector(".post-box textarea");
    const content = textArea.value.trim();
    const file = postImageInput.files[0];

    if (!content && !file) return;

    const post = document.createElement("div");
    post.classList.add("post");

    const textEl = document.createElement("p");
    textEl.textContent = content;
    post.appendChild(textEl);

    if (file) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      img.style.marginTop = "1rem";
      post.appendChild(img);
    }

    feedContainer.prepend(post);
    textArea.value = "";
    postImageInput.value = "";
  });
});
