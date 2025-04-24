const apiUrl = "https://localhost:7008/api/User";

// Cargar usuarios al iniciar
window.onload = fetchUsers;

// Obtener y renderizar todos los usuarios
async function fetchUsers() {
  try {
    const res = await fetch(apiUrl);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}

// Renderizar tabla de usuarios
function renderUsers(users) {
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-4 py-2">${user.id}</td>
      <td class="px-4 py-2">${user.username}</td>
      <td class="px-4 py-2">${user.email}</td>
      <td class="px-4 py-2">${user.active ? "✅" : "❌"}</td>
      <td class="px-4 py-2 space-x-2">
        <button onclick='loadEditForm(${JSON.stringify(user)})' class="text-blue-600 hover:underline">Editar</button>
        <button onclick='confirmDelete(${user.id})' class="text-red-600 hover:underline">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadEditForm(user) {
    document.getElementById("user-id").value = user.id;
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("personId").value = user.personId;
    document.getElementById("password").value = user.password || "";
    document.getElementById("active").checked = user.active;
  
    document.getElementById("modal-title").textContent = "Editar Usuario";
    document.getElementById("user-modal").classList.remove("hidden");
  }
  

// Crear o editar un usuario
async function submitForm(e) {
    e.preventDefault();
  
    const userId = document.getElementById("user-id").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const personId = parseInt(document.getElementById("personId").value);
    const password = document.getElementById("password").value;
    const active = document.getElementById("active").checked;
  
    const user = {
      id: userId ? parseInt(userId) : 0,
      username,
      email,
      personId,
      password,
      active
    };
  
    if (userId) {
      await updateUser(userId, user);
    } else {
      await createUser(user);
    }
  }
  

// Crear usuario
async function createUser(user) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  }
  

// Actualizar usuario
async function updateUser(userId, user) {
  try {
    const res = await fetch(`${apiUrl}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    fetchUsers(); // Recargar tabla
    closeModal(); // Cerrar modal
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
  }
}

// Eliminar usuario
async function confirmDelete(userId) {
  // Mostrar modal de confirmación
  const modal = document.getElementById("confirm-modal");
  modal.classList.remove("hidden");

  // Confirmar eliminación
  document.getElementById("confirm-action").onclick = async () => {
    await deleteUser(userId);
    modal.classList.add("hidden"); // Cerrar modal
  };
}

// Eliminar usuario
async function deleteUser(userId) {
  try {
    await fetch(`${apiUrl}/${userId}`, { method: "DELETE" });
    fetchUsers(); // Recargar tabla
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
  }
}

// Cerrar formularios/modal
document.getElementById("close-modal").onclick = closeModal;
document.getElementById("cancel-form").onclick = closeModal;

function closeModal() {
  document.getElementById("user-modal").classList.add("hidden");
  document.getElementById("confirm-modal").classList.add("hidden");
}

document.getElementById("edit-user-form").onsubmit = submitForm;
document.getElementById("add-user-btn").onclick = () => {
  document.getElementById("modal-title").textContent = "Añadir Usuario";
  document.getElementById("user-modal").classList.remove("hidden");
};
