document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEditarPerfil");
  const nomeInput = document.getElementById("novoNome");
  const fotoInput = document.getElementById("novaFoto");

  // Carrega os dados atuais do usuário
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (usuarioLogado) {
    nomeInput.value = usuarioLogado.nome || "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Atualiza o nome
    const novoNome = nomeInput.value.trim();
    if (novoNome) {
      usuarioLogado.nome = novoNome;
    }

    // Atualiza a imagem
    if (fotoInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        usuarioLogado.avatar = event.target.result;
        salvarEAtualizar();
      };
      reader.readAsDataURL(fotoInput.files[0]);
    } else {
      salvarEAtualizar();
    }

    function salvarEAtualizar() {
      // Salva no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      // Atualiza lista de usuários
      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const index = usuarios.findIndex(u => u.email === usuarioLogado.email);
      if (index !== -1) {
        usuarios[index] = usuarioLogado;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
      }

      alert("Perfil atualizado com sucesso!");
      window.location.href = "profile.html";
    }
  });
});
