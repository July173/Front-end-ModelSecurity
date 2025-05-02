const apiUrl = "https://localhost:7008/api/User";
const apiRol = "https://localhost:7008/api/Rol";
const apiUserRol = "https://localhost:7008/api/RolUser/asignar";

// Al cargar, obtener usuarios
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
      <td class="px-4 py-2 text-right space-x-2">
        <button onclick='loadEditForm(${JSON.stringify(user)})' class="text-blue-600 hover:underline">Editar</button>
        ${
          user.active
            ? `<button onclick='confirmDelete(${user.id})' class="text-red-600 hover:underline">Eliminar</button>`
            : `<button onclick='confirmActivate(${user.id})' class="text-green-600 hover:underline">Activar</button>`
        }
        <button onclick='openAssignRolesModal(${user.id})' class="text-yellow-600 hover:underline">Asignar Roles</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function loadEditForm(user) {
  document.getElementById("user-id").value = user.id;
  document.getElementById("usernameform").value = user.username;
  document.getElementById("email").value = user.email;

  document.getElementById("modal-title").textContent = "Editar Usuario";
  document.getElementById("user-modal").classList.remove("hidden");
}

async function submitForm(e) {
  e.preventDefault();

  const userId = document.getElementById("user-id").value;
  if (!userId) {
    alert("Solo puedes editar usuarios, no crear nuevos.");
    return;
  }

  const username = document.getElementById("usernameform").value;
  const email = document.getElementById("email").value;

  const user = {
    id: parseInt(userId),
    username,
    email,
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
  const message = document.getElementById("confirm-message");
  message.textContent = "¿Estás seguro de que deseas eliminar este usuario?";
  modal.classList.remove("hidden");

  const user = {
    id: parseInt(userId),
    active: false
  };

  document.getElementById("confirm-action").onclick = async () => {
    await changeUserStatus(user);
    modal.classList.add("hidden");
  };
}

async function confirmActivate(userId) {
  const modal = document.getElementById("confirm-modal");
  const message = document.getElementById("confirm-message");
  message.textContent = "¿Estás seguro de que deseas activar este usuario?";
  modal.classList.remove("hidden");

  const user = {
    id: parseInt(userId),
    active: true
  };

  document.getElementById("confirm-action").onclick = async () => {
    await changeUserStatus(user);
    modal.classList.add("hidden");
  };
}

async function changeUserStatus(user) {
  try {
    await fetch(`${apiUrl}/active`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    fetchUsers();
  } catch (err) {
    console.error("Error al cambiar estado del usuario:", err);
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

  try {
    // Obtener todos los roles
    const allRolesRes = await fetch(apiRol);
    const allRoles = await allRolesRes.json();

    // Filtrar solo los roles activos
    const activeRoles = allRoles.filter(r => r.active === 1 || r.active === true);

    // Obtener roles ya asignados al usuario
    const assignedRes = await fetch(`https://localhost:7008/api/Rol/User/${userId}`);
    const assignedRoles = await assignedRes.json();
    const assignedRoleIds = assignedRoles.map(r => r.id);

    // Renderizar checkboxes solo de roles activos
    rolesCheckboxes.innerHTML = activeRoles.map(r => `
      <label class="block">
        <input type="checkbox" value="${r.id}" ${assignedRoleIds.includes(r.id) ? 'checked' : ''} class="mr-2" name="rol"> ${r.typeRol} 
      </label>
    `).join('');

    assignModal.classList.remove("hidden");

  } catch (err) {
    alert("Error al cargar roles del usuario.");
    console.error(err);
  }
}


assignForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = parseInt(assignUserId.value);
  const rolIds = [...assignForm.querySelectorAll("input[name='rol']:checked")].map(cb => parseInt(cb.value));

  try {
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
  } catch (err) {
    alert("Error en la petición.");
    console.error(err);
  }
});

cancelAssign.addEventListener("click", () => assignModal.classList.add("hidden"));
