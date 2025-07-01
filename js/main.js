document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  const postBtn = document.getElementById("postBtn");
  const postText = document.getElementById("postText");
  const postImage = document.getElementById("postImage");
  const modal = document.getElementById("modalPost");
  const closeModal = document.getElementById("closeModal");
  const openModalBtn = document.getElementById("openModal");
  const feedContainer = document.getElementById("feedContainer");

  // Abrir e fechar modal
  openModalBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  closeModal.addEventListener("click", () => modal.classList.add("hidden"));

  // Função de postar
  postBtn.addEventListener("click", () => {
    const texto = postText.value.trim();
    if (texto === "") {
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

    // Se tiver imagem
    const arquivo = postImage.files[0];
    if (arquivo) {
      const reader = new FileReader();
      reader.onload = function (event) {
        post.midias = event.target.result;
        salvarPost(post);
      };
      reader.readAsDataURL(arquivo);
    } else {
      salvarPost(post);
    }
  });

  // Salvar post no localStorage
  function salvarPost(post) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(post); // adiciona no topo
    localStorage.setItem("posts", JSON.stringify(posts));
    renderizarPosts();
    modal.classList.add("hidden");
    postText.value = "";
    postImage.value = "";
  }

  // Renderizar posts no feed
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
          <button onclick="curtirPost(${index})">❤️ Curtir (${post.curtidas})</button>
          <button onclick="comentarPost(${index})">💬 Comentar</button>
          <button onclick="republicarPost(${index})">🔁 Republicar</button>
        </div>
      `;
      feedContainer.appendChild(postEl);
    });
  }

  renderizarPosts();

  // Funções globais de interação
  window.curtirPost = function (index) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[index].curtidas++;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderizarPosts();
  };

  window.comentarPost = function (index) {
    const comentario = prompt("Escreva seu comentário:");
    if (comentario) {
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts[index].comentarios.push({ nome: usuarioLogado.nome, texto: comentario });
      localStorage.setItem("posts", JSON.stringify(posts));
      alert("Comentário adicionado!");
    }
  };

  window.republicarPost = function (index) {
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
  };
});
