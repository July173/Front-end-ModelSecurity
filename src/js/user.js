const apiUrl = "https://localhost:7008/api/User";
const apiRol = "https://localhost:7008/api/Rol";
const apiUserRol = "https://localhost:7008/api/UserRol/asignar";

window.onload = fetchUsers;

async function fetchUsers() {
  try {
    const res = await fetch(apiUrl);
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById("user-table-body");
  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-4 py-2">${user.username}</td>
      <td class="px-4 py-2">${user.email}</td>
      <td class="px-4 py-2">${user.active ? "✅" : "❌"}</td>
      <td class="px-4 py-2 space-x-2 text-right">
        <button onclick='loadEditForm(${JSON.stringify(user)})' class="text-blue-600 hover:underline">Editar</button>
        <button onclick='confirmDelete(${user.id})' class="text-red-600 hover:underline">Eliminar</button>
        <button onclick='openAssignRolesModal(${user.id})' class="text-green-600 hover:underline">Asignar Roles</button>
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

async function submitForm(e) {
  e.preventDefault();

  const userId = document.getElementById("user-id").value;
  if (!userId) {
    alert("No se permite crear usuarios desde esta vista.");
    return;
  }

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const personId = parseInt(document.getElementById("personId").value); // No se modificará
  const password = document.getElementById("password").value;
  const active = document.getElementById("active").checked;

  const user = {
    id: parseInt(userId),
    username,
    email,
    personId,
    password,
    active
  };

  await updateUser(userId, user);
}



async function updateUser(userId, user) {
  try {
    await fetch(`${apiUrl}/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    fetchUsers();
    closeModal();
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
  }
}

async function confirmDelete(userId) {
  const modal = document.getElementById("confirm-modal");
  modal.classList.remove("hidden");

  document.getElementById("confirm-action").onclick = async () => {
    await deleteUser(userId);
    modal.classList.add("hidden");
  };
}

async function deleteUser(userId) {
  try {
    await fetch(`${apiUrl}/${userId}`, { method: "DELETE" });
    fetchUsers();
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
  }
}

function closeModal() {
  document.getElementById("user-modal").classList.add("hidden");
  document.getElementById("confirm-modal").classList.add("hidden");
  document.getElementById("assign-roles-modal").classList.add("hidden");
}

document.getElementById("close-modal").onclick = closeModal;
document.getElementById("cancel-form").onclick = closeModal;
document.getElementById("edit-user-form").onsubmit = submitForm;


// ---------------------------
// ASIGNACIÓN DE ROLES
// ---------------------------
const assignModal = document.getElementById("assign-roles-modal");
const rolesCheckboxes = document.getElementById("roles-checkboxes");
const assignUserId = document.getElementById("assign-user-id");
const assignForm = document.getElementById("assign-roles-form");
const cancelAssign = document.getElementById("cancel-assign-roles");

async function openAssignRolesModal(userId) {
  assignUserId.value = userId;
  const res = await fetch(apiRol);
  const roles = await res.json();

  rolesCheckboxes.innerHTML = roles.map(r => `
    <label class="block">
      <input type="checkbox" value="${r.id}" class="mr-2" name="rol"> ${r.name}
    </label>
  `).join('');

  assignModal.classList.remove("hidden");
}

assignForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = parseInt(assignUserId.value);
  const rolIds = [...assignForm.querySelectorAll("input[name='rol']:checked")].map(cb => parseInt(cb.value));

  const res = await fetch(apiUserRol, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, rolIds })
  });

  if (res.ok) {
    alert("Roles asignados correctamente.");
    assignModal.classList.add("hidden");
  } else {
    alert("Error al asignar roles.");
  }
});

cancelAssign.addEventListener("click", () => assignModal.classList.add("hidden"));

