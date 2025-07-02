import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  // Adiciona autocomplete para melhor UX
  document.getElementById("email").setAttribute("autocomplete", "username");
  document.getElementById("password").setAttribute("autocomplete", "current-password");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Redireciona após login bem-sucedido
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      let errorMessage = "Erro ao fazer login. Tente novamente.";
      
      if (error.code === "auth/invalid-credential") {
        errorMessage = "E-mail ou senha incorretos.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Muitas tentativas. Tente mais tarde.";
      }
      
      alert(errorMessage);
    }
  });
});