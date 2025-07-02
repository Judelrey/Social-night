import { db, auth } from './firebase-config.js';
import { requireAuth, logout } from './auth-handler.js';
import { 
  collection, getDocs, addDoc, serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", async () => {
  const user = await requireAuth();
  if (!user) return;

  // Elementos da UI
  const feedContainer = document.getElementById("feedContainer");
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const modal = document.getElementById("modalPost");
  const openModalBtn = document.getElementById("btnAbrirModal");
  const closeModalBtn = document.querySelector(".close");
  const postBtn = document.getElementById("btnPostar");
  const postText = document.getElementById("postText");
  const postImage = document.getElementById("postImage");

  // Configura menu lateral
  setupSidebar(user);

  // Event listeners
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });

  openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  postBtn.addEventListener("click", async () => {
    await createPost(user);
  });

  // Carrega posts
  loadPosts();

  // Funções
  function setupSidebar(user) {
    sidebar.innerHTML = `
      <ul>
        <li><a href="profile.html">👤 ${user.nome}</a></li>
        <li><a href="editar-perfil.html">✏️ Editar Perfil</a></li>
        <li><a href="#" id="logoutBtn">🚪 Sair</a></li>
      </ul>
    `;
    
    document.getElementById("logoutBtn").addEventListener("click", logout);
  }

  async function loadPosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    feedContainer.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = createPostElement(post);
      feedContainer.appendChild(postElement);
    });
  }

  function createPostElement(post) {
    const postEl = document.createElement("div");
    postEl.className = "post";
    
    postEl.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" class="avatar-post">
        <div>
          <strong>${post.nome}</strong>
          <p class="post-date">${new Date(post.createdAt?.toDate()).toLocaleString()}</p>
        </div>
      </div>
      <p class="post-content">${post.texto}</p>
      ${post.imagem ? `<img src="${post.imagem}" class="post-image">` : ''}
      <div class="post-actions">
        <button class="like-btn">❤️ Curtir</button>
        <button class="comment-btn">💬 Comentar</button>
      </div>
    `;
    
    return postEl;
  }

  async function createPost(user) {
    const texto = postText.value.trim();
    if (!texto && !postImage.files[0]) {
      alert("Adicione texto ou uma imagem");
      return;
    }

    let imageUrl = '';
    if (postImage.files[0]) {
      // Aqui você implementaria o upload para Firebase Storage
      // Por enquanto usamos apenas o nome do arquivo como exemplo
      imageUrl = `img/${postImage.files[0].name}`;
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        nome: user.nome,
        avatar: user.avatar,
        texto,
        imagem: imageUrl,
        createdAt: serverTimestamp(),
        likes: [],
        comentarios: []
      });

      postText.value = '';
      postImage.value = '';
      modal.classList.add("hidden");
      loadPosts();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Erro ao criar post. Tente novamente.");
    }
  }
});