document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("usuarioLogado"));
  const allUsers = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (!user) {
    alert("Você precisa estar logado para ver essa página.");
    window.location.href = "login.html";
    return;
  }

  const seguindoList = document.getElementById("seguindoList");
  const seguidoresList = document.getElementById("seguidoresList");

 const getCard = (usuario) => {
  const avatar = usuario.avatar || "img/avatar-default.png";
  const email = encodeURIComponent(usuario.email);
  return `
    <a href="visualizar-perfil.html?email=${email}" class="follow-card-link">
      <div class="follow-card">
        <img src="${avatar}" alt="${usuario.nome}" />
        <span>${usuario.nome}</span>
      </div>
    </a>
  `;
};


  const seguindo = allUsers.filter(u => user.seguindo.includes(u.email));
  const seguidores = allUsers.filter(u => user.seguidores.includes(u.email));

  seguindoList.innerHTML = seguindo.map(getCard).join("") || "<p>Você ainda não segue ninguém.</p>";
  seguidoresList.innerHTML = seguidores.map(getCard).join("") || "<p>Ninguém te segue ainda. Mas calma, diva atrai multidões. 💅🏻</p>";
});
