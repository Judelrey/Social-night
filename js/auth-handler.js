import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

export const initAuthStateListener = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const usuarioLogado = {
          uid: user.uid,
          nome: user.displayName || "Usuário Retrô",
          email: user.email,
          avatar: user.photoURL || "img/avatar-default.png"
        };
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        resolve(usuarioLogado);
      } else {
        localStorage.removeItem("usuarioLogado");
        resolve(null);
      }
    });
  });
};

export const requireAuth = async (redirectToLogin = true) => {
  const loader = document.getElementById("authLoader");
  if (loader) loader.classList.remove("hidden");

  const user = await initAuthStateListener();
  
  if (loader) loader.classList.add("hidden");
  
  if (!user && redirectToLogin) {
    window.location.href = "login.html";
    return null;
  }
  
  return user;
};

export const logout = async () => {
  try {
    await auth.signOut();
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    alert("Erro ao sair. Tente novamente.");
  }
};