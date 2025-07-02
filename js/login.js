import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
<<<<<<< HEAD

  // Adiciona autocomplete para melhor UX
  document.getElementById("email").setAttribute("autocomplete", "username");
  document.getElementById("password").setAttribute("autocomplete", "current-password");

=======
  
  // Adicionando autocomplete aos campos (se não estiver no HTML)
  document.getElementById("email").setAttribute("autocomplete", "email");
  document.getElementById("password").setAttribute("autocomplete", "current-password");

>>>>>>> 79fc587963db308522959e64cca8e4d3b35df9ed
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validação básica dos campos
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
<<<<<<< HEAD
      
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
=======

      const usuarioLogado = {
        nome: user.displayName || "Usuário Retrô",
        email: user.email,
        avatar: user.photoURL || "img/avatar-default.png"
      };

      // Armazenamento seguro (considerar sessionStorage para dados sensíveis)
      sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
      sessionStorage.setItem("usuarioUID", user.uid);

      // Feedback visual melhorado
      showLoginSuccess(() => {
        window.location.href = "index.html";
      });
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      handleLoginError(error);
    }
  });
});

// Funções auxiliares para melhor organização
function showLoginSuccess(callback) {
  // Substitua por um modal ou feedback visual mais elegante
  alert("✨ Login bem-sucedido! Bem-vindo de volta ✨");
  if (callback) callback();
}

function handleLoginError(error) {
  let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
  
  if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
    errorMessage = "E-mail ou senha incorretos. Verifique e tente novamente.";
  } else if (error.code === "auth/too-many-requests") {
    errorMessage = "Muitas tentativas falhas. Tente novamente mais tarde ou redefina sua senha.";
  }
  
  alert(errorMessage);
}
>>>>>>> 79fc587963db308522959e64cca8e4d3b35df9ed
