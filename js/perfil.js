document.addEventListener("DOMContentLoaded", () => {
  const avatarPerfil = document.getElementById("avatarPerfil");
  const nomeUsuario = document.getElementById("nomeUsuario");
  const emailUsuario = document.getElementById("emailUsuario");
  const meusPostsContainer = document.getElementById("meusPostsContainer");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const todosPosts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!usuarioLogado) {
    alert("Você precisa estar logado.");
    window.location.href = "login.html";
    return;
  }

  // Exibe as informações do perfil
  nomeUsuario.textContent = usuarioLogado.nome;
  emailUsuario.textContent = usuarioLogado.email;
  avatarPerfil.src = usuarioLogado.avatar || "img/avatar-default.png";

  // Filtra e exibe os posts do usuário logado
  const meusPosts = todosPosts.filter(post => post.email === usuarioLogado.email);

  meusPosts.forEach(post => {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    postElement.innerHTML = `
      <div class="post-header">
        <img src="${usuarioLogado.avatar || 'img/avatar-default.png'}" class="avatar-post" alt="Avatar">
        <div>
          <strong>${usuarioLogado.nome}</strong>
          <p class="data">${post.data || ''}</p>
        </div>
      </div>
      <p>${post.texto}</p>
      ${post.midias ? `<img src="${post.midias}" class="midia-post">` : ""}
    `;

    meusPostsContainer.appendChild(postElement);
  });
});
