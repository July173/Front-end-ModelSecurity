const apiUrl = 'https://localhost:7008/api/Rol/';
const tableBody = document.getElementById("users-table-body");
const modal = document.getElementById("user-modal");
const openModalBtn = document.getElementById("add-user-btn");
const closeModalBtn = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-form");
const form = document.getElementById("rol-form");

// Mostrar modal
openModalBtn.addEventListener("click", () => {
  form.reset();
  document.getElementById("rol-id").value = "";
  modal.classList.remove("hidden");
});

// Cerrar modal
closeModalBtn?.addEventListener("click", () => modal.classList.add("hidden"));
cancelBtn?.addEventListener("click", () => modal.classList.add("hidden"));

// Guardar rol (crear o editar)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("rol-id").value;
  const typeRol = document.getElementById("rol-name").value;
const description = document.getElementById("rol-description").value;

  const rolData = { id: parseInt(id || 0), typeRol, active: true, description };

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

// Cargar roles al iniciar
async function loadRoles() {
  const res = await fetch(apiUrl);
  const roles = await res.json();
  tableBody.innerHTML = "";

  roles.forEach((rol) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-6 py-4">${rol.typeRol}</td>
      <td class="px-6 py-4">${rol.description }</td>
      <td class="px-6 py-4 text-right">
        <button onclick="editRol(${rol.id}, '${rol.typeRol}', '${rol.description}' )" class="text-blue-600 hover:text-blue-800">Editar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Prellenar modal para editar
window.editRol = (id, typeRol, description) => {
  document.getElementById("rol-id").value = id;
  document.getElementById("rol-name").value = typeRol;
    document.getElementById("rol-description").value = description;
  modal.classList.remove("hidden");
};

loadRoles();
