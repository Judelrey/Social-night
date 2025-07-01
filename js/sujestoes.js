import { db, auth } from './firebase-config.js';
import {
  collection, getDocs, doc, updateDoc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

const carrossel = document.getElementById("carrosselSugestoes");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const usuariosSnap = await getDocs(collection(db, "usuarios"));
  carrossel.innerHTML = "";

  usuariosSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (docSnap.id === user.uid) return; // ignora o próprio usuário

    const card = document.createElement("div");
    card.className = "sugestao-card";
    card.innerHTML = `
      <img src="${data.avatar || 'img/default-avatar.png'}" class="avatar-mini" />
      <strong>${data.nome || 'Usuário'}</strong>
      <button class="seguir-btn" data-id="${docSnap.id}">Seguir</button>
    `;
    carrossel.appendChild(card);
  });

  document.querySelectorAll(".seguir-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const alvoId = btn.dataset.id;
      const usuarioAtualRef = doc(db, "usuarios", user.uid);
      await updateDoc(usuarioAtualRef, {
        seguindo: arrayUnion(alvoId)
      });
      btn.textContent = "Seguindo";
      btn.disabled = true;
    });
  });
});
