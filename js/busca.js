import { db } from './firebase-config.js';
import {
  collection, getDocs
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

const campoBusca = document.getElementById("campoBusca");
const resultadosContainer = document.getElementById("resultadosBusca");

campoBusca.addEventListener("input", async () => {
  const termo = campoBusca.value.trim().toLowerCase();
  resultadosContainer.innerHTML = "";

  if (termo.length < 2) return;

  const usuariosSnap = await getDocs(collection(db, "usuarios"));
  const postsSnap = await getDocs(collection(db, "posts"));

  let encontrados = [];

  usuariosSnap.forEach(doc => {
    const data = doc.data();
    if (data.nome && data.nome.toLowerCase().includes(termo)) {
      encontrados.push({
        tipo: "usuario",
        nome: data.nome,
        avatar: data.avatar,
        uid: doc.id
      });
    }
  });

  postsSnap.forEach(doc => {
    const data = doc.data();
    if (data.texto && data.texto.toLowerCase().includes(termo)) {
      encontrados.push({
        tipo: "post",
        nome: data.nome,
        texto: data.texto,
        postId: doc.id
      });
    }
  });

  mostrarResultados(encontrados);
});

function mostrarResultados(lista) {
  lista.forEach(item => {
    const div = document.createElement("div");
    div.className = "resultado-item";

    if (item.tipo === "usuario") {
      div.innerHTML = `
        <img src="${item.avatar || 'img/default-avatar.png'}" class="avatar-mini">
        <span><strong>${item.nome}</strong></span>
        <a href="profile.html?uid=${item.uid}">Ver Perfil</a>
      `;
    } else if (item.tipo === "post") {
      div.innerHTML = `
        <p><strong>${item.nome}:</strong> ${item.texto}</p>
      `;
    }

    resultadosContainer.appendChild(div);
  });
}
