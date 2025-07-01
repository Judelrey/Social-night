document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  const modal = document.getElementById("modalPost");
  const openModalBtn = document.querySelector("button[onclick='abrirModalPost()']"); // Seu botão estrela
  const feedContainer = document.getElementById("feedContainer");
  const postText = document.getElementById("novaPostagem");
  const postImage = document.getElementById("imagemPost");

  // Abrir e fechar modal
  openModalBtn.addEventListener("click", abrirModalPost);

  function abrirModalPost() {
    modal.classList.toggle("hidden");
  }

  // Função de criar post
  document.querySelector("#modalPost button").addEventListener("click", () => {
    const texto = postText.value.trim();
    if (!texto) {
      alert("Escreva algo antes de postar.");
      return;
    }

    const post = {
      nome: usuarioLogado.nome,
      email: usuarioLogado.email,
      avatar: usuarioLogado.avatar || "img/avatar-default.png",
      texto,
      data: new Date().toLocaleString(),
      midias: null,
      curtidas: 0,
      comentarios: [],
    };

    const arquivo = postImage.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onload = function(e) {
        post.midias = e.target.result;
        salvarPost(post);
      };
      reader.readAsDataURL(arquivo);  // Safe
    } else {
      salvarPost(post);
    }
  });

  function salvarPost(post) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderizarPosts();
    modal.classList.add("hidden");
    postText.value = "";
    postImage.value = "";
  }

  function renderizarPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    feedContainer.innerHTML = "";

    posts.forEach((post, index) => {
      const postEl = document.createElement("div");
      postEl.classList.add("post");

      postEl.innerHTML = `
        <div class="post-header">
          <img src="${post.avatar}" class="avatar-post" alt="Avatar">
          <div>
            <strong>${post.nome}</strong>
            <p class="data">${post.data}</p>
          </div>
        </div>
        <p>${post.texto}</p>
        ${post.midias ? `<img src="${post.midias}" class="midia-post">` : ""}
        <div class="post-actions">
          <button data-action="curtir" data-index="${index}">❤️ Curtir (${post.curtidas})</button>
          <button data-action="comentar" data-index="${index}">💬 Comentar</button>
          <button data-action="republicar" data-index="${index}">🔁 Republicar</button>
        </div>
      `;
      feedContainer.appendChild(postEl);
    });
  }

  // Delegação de eventos
  feedContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const index = parseInt(btn.dataset.index);
    if (action === "curtir") curtirPost(index);
    else if (action === "comentar") comentarPost(index);
    else if (action === "republicar") republicarPost(index);
  });

  renderizarPosts();

  function curtirPost(index) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[index].curtidas++;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderizarPosts();
  }

  function comentarPost(index) {
    const comentario = prompt("Escreva seu comentário:");
    if (comentario) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts[index].comentarios.push({ nome: usuarioLogado.nome, texto: comentario });
      localStorage.setItem("posts", JSON.stringify(posts));
      alert("Comentário adicionado!");
    }
  }

  function republicarPost(index) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const original = posts[index];
    const repost = {
      ...original,
      nome: usuarioLogado.nome,
      email: usuarioLogado.email,
      avatar: usuarioLogado.avatar || "img/avatar-default.png",
      data: `Republicado em ${new Date().toLocaleString()}`
    };
    posts.unshift(repost);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderizarPosts();
  }
});
