import { db, auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const avatarInput = document.getElementById("avatar");
    let avatar = "";

    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (avatarInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        avatar = event.target.result;
        salvarUsuario(nome, email, senha, avatar);
      };
      reader.readAsDataURL(avatarInput.files[0]);
    } else {
      salvarUsuario(nome, email, senha, avatar);
    }
  });

  async function salvarUsuario(nome, email, senha, avatar) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      alert("Já existe um usuário cadastrado com este e-mail.");
      return;
    }
    const novoUsuario = {nome, email, senha, avatar};
    usuarios.push(novoUsuario);
    
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(novoUsuario));
    alert("Cadastro realizado com sucesso! 🌟");
    // alert("cadastro realizado com sucesso! 🌟"); // Removido alerta duplicado
    window.location.href = "index.html";
    try {
      const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
      const user = credenciais.user;

      // Converte avatar para base64
      let avatarBase64 = "";
      if (document.getElementById("avatar").files[0]) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          avatarBase64 = reader.result;

          // Salva dados do perfil no Firestore
          await setDoc(doc(db, "usuarios", user.uid), {
            nome: nome,
            email: email,
            avatar: avatarBase64,
            criadoEm: new Date()
          });

          alert("Cadastro realizado com sucesso! 🌟");
          window.location.href = "login.html";
        };
        reader.readAsDataURL(document.getElementById("avatar").files[0]);
      } else {
        // Salva mesmo sem avatar
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: nome,
          email: email,
          avatar: "",
          criadoEm: new Date()
        });

        alert("Cadastro realizado com sucesso! 🌟");
        window.location.href = "login.html";
      }

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + error.message);
    }
  }
});
