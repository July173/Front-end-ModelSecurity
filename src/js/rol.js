const apiUrl = 'https://localhost:7008/api/Rol/';
const tableBody = document.getElementById("users-table-body");
const modal = document.getElementById("user-modal");
const openModalBtn = document.getElementById("add-user-btn");
const closeModalBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-form");
const form = document.getElementById("rol-form");

// Modal de confirmación
const confirmModal = document.getElementById("confirm-modal");
const confirmMessage = document.getElementById("confirm-message");
const confirmActionBtn = document.getElementById("confirm-action");
const cancelConfirmBtn = document.getElementById("cancel-action"); // Este ID debe estar en tu modal

// Variables de control
let selectedRolId = null;
let currentAction = null;

// Mostrar modal de formulario
openModalBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("rol-id").value = "";
  document.getElementById("modal-title").textContent = "Crear Rol";
  modal.classList.remove("hidden");
});

// Cerrar modal de formulario
closeModalBtn?.addEventListener("click", () => modal.classList.add("hidden"));
cancelBtn?.addEventListener("click", () => modal.classList.add("hidden"));

// Guardar rol
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("rol-id").value;
  const typeRol = document.getElementById("rol-name").value;
  const description = document.getElementById("rol-description").value;

  const rolData = {
    id: parseInt(id || 0),
    typeRol,
    active: true,
    description
  };

  const method = id ? "PUT" : "POST";
  const url = id ? apiUrl + id : apiUrl;

  const res = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rolData),
  });

  if (res.ok) {
    modal.classList.add("hidden");
    loadRoles();
  } else {
    alert("Error al guardar el rol.");
  }
});

// Cargar roles
async function loadRoles() {
  const res = await fetch(apiUrl);
  const roles = await res.json();
  tableBody.innerHTML = "";

  roles.forEach((rol) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-6 py-4">${rol.typeRol}</td>
      <td class="px-6 py-4">${rol.description}</td>
      <td class="px-6 py-4">${rol.active ? "✅" : "❌"}</td>
      <td class="px-6 py-4 text-right space-x-2">
        <button onclick="editRol(${rol.id}, '${rol.typeRol}', '${rol.description}')" class="text-blue-600 hover:text-blue-800">Editar</button>
        ${
          rol.active
            ? `<button onclick="openConfirm(${rol.id}, 'deactivate')" class="text-red-600 hover:text-red-800">Eliminar</button>`
            : `<button onclick="openConfirm(${rol.id}, 'activate')" class="text-green-600 hover:text-green-800">Activar</button>`
        }
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Abrir modal para editar
window.editRol = (id, typeRol, description) => {
  document.getElementById("rol-id").value = id;
  document.getElementById("rol-name").value = typeRol;
  document.getElementById("rol-description").value = description;
  document.getElementById("modal-title").textContent = "Editar Rol";
  modal.classList.remove("hidden");
};

// Abrir modal de confirmación
window.openConfirm = (rolId, action) => {
  selectedRolId = rolId;
  currentAction = action;

  confirmMessage.textContent =
    action === "deactivate"
      ? "¿Estás seguro de que deseas eliminar este rol?"
      : "¿Deseas activar este rol?";

  confirmModal.classList.remove("hidden");
};

// Confirmar acción
confirmActionBtn.onclick = async () => {
  if (!selectedRolId || !currentAction) return;

  const rol = {
    id: selectedRolId,
    active: currentAction === "activate"
  };

  try {
    await fetch(`${apiUrl}active`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rol),
    });

    confirmModal.classList.add("hidden");
    loadRoles();
  } catch (err) {
    console.error("Error al ejecutar acción:", err);
  }
};

// Cancelar acción
cancelConfirmBtn?.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

// Cargar al iniciar
loadRoles();
