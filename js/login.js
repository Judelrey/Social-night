// Importações do Firebase
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salva o UID no localStorage para controle de sessão
      localStorage.setItem("usuarioUID", user.uid);

      alert("Login bem-sucedido! Bem-vindo de volta ✨");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("E-mail ou senha incorretos. Verifique e tente novamente.");
    }
  });
});
