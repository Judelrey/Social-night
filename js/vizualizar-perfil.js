document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));

  const perfil = usuarios.find(u => u.email === email);
  if (!perfil) return alert("Usuário não encontrado.");

  document.getElementById("avatar").src = perfil.avatar || "img/avatar-default.png";
  document.getElementById("nome").textContent = perfil.nome;
  document.getElementById("email").textContent = perfil.email;

  const seguirBtn = document.getElementById("seguirBtn");

  const seguindo = logado.seguindo.includes(email);
  seguirBtn.textContent = seguindo ? "Seguindo ✔️" : "Seguir";

  seguirBtn.addEventListener("click", () => {
    const logadoIndex = usuarios.findIndex(u => u.email === logado.email);
    const perfilIndex = usuarios.findIndex(u => u.email === email);

    if (!seguindo) {
      usuarios[logadoIndex].seguindo.push(email);
      usuarios[perfilIndex].seguidores.push(logado.email);
      seguirBtn.textContent = "Seguindo ✔️";
    } else {
      usuarios[logadoIndex].seguindo = usuarios[logadoIndex].seguindo.filter(e => e !== email);
      usuarios[perfilIndex].seguidores = usuarios[perfilIndex].seguidores.filter(e => e !== logado.email);
      seguirBtn.textContent = "Seguir";
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[logadoIndex]));
  });
});
