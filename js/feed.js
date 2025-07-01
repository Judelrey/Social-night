import { db, auth } from './firebase-config.js';
import {
  collection, addDoc, getDocs, query, orderBy, updateDoc, doc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import {
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

const feedContainer = document.getElementById("feedContainer");
let usuarioAtual = null;

// Verifica usuário logado
onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "login.html";

  const res = await fetch(`https://firestore.googleapis.com/v1/projects/star-rey/databases/(default)/documents/usuarios/${user.uid}`);
  const data = await res.json();

  usuarioAtual = {
    uid: user.uid,
    nome: data.fields?.nome?.stringValue || user.email,
    avatar: data.fields?.avatar?.stringValue || ""
  };

  carregarPosts();

  div.innerHTML = `
  <div class="post-topo">
    <img src="${data.avatar || 'img/default-avatar.png'}" class="avatar-mini">
    <strong>${data.nome}</strong>
    <span class="data">${new Date(data.criadoEm).toLocaleString()}</span>
  </div>
  <p>${data.texto}</p>
  ${data.midia ? `<div class="midia"><img src="${data.midia}" /></div>` : ""}
  <div class="post-interacoes">
    <button class="curtir" data-id="${doc.id}">❤️ Curtir (${data.likes?.length || 0})</button>
    <button class="comentar" data-id="${doc.id}">💬 Comentar</button>
  </div>
  <div class="comentarios" id="comentarios-${doc.id}">
    ${(data.comentarios || []).map(c => `<p><strong>${c.nome}:</strong> ${c.texto}</p>`).join('')}
  </div>
  <div class="comentario-input">
    <input type="text" placeholder="Escreva um comentário..." data-id="${doc.id}" class="input-comentario">
    <button class="btn-enviar-comentario" data-id="${doc.id}">Enviar</button>
  </div>
`;

});
document.querySelectorAll(".curtir").forEach(btn => {
  btn.addEventListener("click", async () => {
    const postId = btn.dataset.id;
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();

    const jaCurtiu = postData.likes?.includes(usuarioAtual.uid);
    const novosLikes = jaCurtiu
      ? postData.likes.filter(uid => uid !== usuarioAtual.uid)
      : [...(postData.likes || []), usuarioAtual.uid];

    await updateDoc(postRef, { likes: novosLikes });
    carregarPosts();
  });
});

document.querySelectorAll(".btn-enviar-comentario").forEach(btn => {
  btn.addEventListener("click", async () => {
    const postId = btn.dataset.id;
    const input = document.querySelector(`.input-comentario[data-id="${postId}"]`);
    const texto = input.value.trim();
    if (!texto) return;

    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comentarios: arrayUnion({
        nome: usuarioAtual.nome,
        texto
      })
    });

    input.value = "";
    carregarPosts();
  });
});


async function carregarPosts() {
  feedContainer.innerHTML = "";
  const q = query(collection(db, "posts"), orderBy("criadoEm", "desc"));
  const snapshot = await getDocs(q);

  <div class="post-interacoes">
  <button class="curtir" data-id="${doc.id}">❤️ Curtir (${data.likes?.length || 0})</button>
  <button class="comentar" data-id="${doc.id}">💬 Comentar</button>
  <button class="repostar" data-id="${doc.id}">🔁 Republicar</button>
</div>

document.querySelectorAll(".repostar").forEach(btn => {
  btn.addEventListener("click", async () => {
    const postId = btn.dataset.id;
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) return;

    const postOriginal = postSnap.data();

    // Cria um novo post com os dados originais
    await addDoc(collection(db, "posts"), {
      nome: usuarioAtual.nome,
      avatar: usuarioAtual.avatar,
      texto: postOriginal.texto,
      midia: postOriginal.midia || "",
      criadoEm: Date.now(),
      republicadoDe: {
        nome: postOriginal.nome,
        avatar: postOriginal.avatar,
        criadoEm: postOriginal.criadoEm
      },
      likes: [],
      comentarios: []
    });

    alert("Post republicado com sucesso!");
    carregarPosts();
  });
});


  snapshot.forEach(docSnap => {
    const post = docSnap.data();
    const postId = docSnap.id;
    const data = new Date(post.criadoEm);
    const hora = `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;

    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <div class="user-info">
        <img src="${post.avatar || 'img/default-avatar.png'}" class="avatar" alt="avatar">
        <strong>${post.nome}</strong> <span class="data">• ${hora}</span>
      </div>
      <p>${post.texto}</p>
      ${post.midia ? `<img src="${post.midia}" class="midia">` : ""}
      <div class="post-actions">
        <button class="like-btn" data-id="${postId}">❤️ ${post.likes?.length || 0}</button>
        <button class="comment-toggle" data-id="${postId}">💬 Comentários</button>
      </div>
      <div class="comments hidden" id="comments-${postId}">
        <input type="text" placeholder="Escreva um comentário..." class="comment-input" data-id="${postId}" />
        <div class="comment-list">
          ${(post.comentarios || []).map(c => `<p><strong>${c.nome}:</strong> ${c.texto}</p>`).join('')}
        </div>
      </div>
    `;
    feedContainer.appendChild(div);
  });

  configurarEventos();
}

function configurarEventos() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.onclick = async () => {
      const postId = btn.dataset.id;
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: arrayUnion(usuarioAtual.uid)
      });
      carregarPosts();
    };
  });

  document.querySelectorAll('.comment-toggle').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const box = document.getElementById(`comments-${id}`);
      box.classList.toggle("hidden");
    };
  });

  document.querySelectorAll('.comment-input').forEach(input => {
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && input.value.trim() !== "") {
        const postId = input.dataset.id;
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          comentarios: arrayUnion({
            nome: usuarioAtual.nome,
            texto: input.value.trim()
          })
        });
        input.value = "";
        carregarPosts();
// Botão e modal
const btnNovaPostagem = document.getElementById("btnNovaPostagem");
const modalPostagem = document.getElementById("modalPostagem");
const fecharModal = document.getElementById("fecharModal");
const enviarPost = document.getElementById("enviarPost");

btnNovaPostagem.onclick = () => modalPostagem.classList.remove("hidden");
fecharModal.onclick = () => modalPostagem.classList.add("hidden");

enviarPost.onclick = async () => {
  const texto = document.getElementById("textoPost").value.trim();
  const arquivo = document.getElementById("arquivoPost").files[0];
  let midiaBase64 = "";

  if (arquivo) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      midiaBase64 = reader.result;
      await salvarPost(texto, midiaBase64);
    };
    reader.readAsDataURL(arquivo);
  } else {
    await salvarPost(texto, "");
  }
};

async function salvarPost(texto, midia) {
  if (!texto && !midia) return alert("Adicione conteúdo ou mídia!");
  await addDoc(collection(db, "posts"), {
    nome: usuarioAtual.nome,
    avatar: usuarioAtual.avatar,
    texto,
    midia,
    criadoEm: Date.now(),
    likes: [],
    comentarios: []
  });
  modalPostagem.classList.add("hidden");
  document.getElementById("textoPost").value = "";
  document.getElementById("arquivoPost").value = "";
  carregarPosts();
}

      }
    });
  });
}
