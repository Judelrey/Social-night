import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usuarioLogado = {
        nome: user.displayName || "Usuário Retrô",
        email: user.email,
        avatar: user.photoURL || "img/avatar-default.png"
      };

      // Salva os dados no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      localStorage.setItem("usuarioUID", user.uid); // UID para identificar o usuário logado

      alert("✨ Login bem-sucedido! Bem-vindo de volta ✨");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("E-mail ou senha incorretos. Verifique e tente novamente.");
    }
  });
});
