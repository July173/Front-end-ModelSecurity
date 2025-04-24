const apiUrl = "https://localhost:7008/api/Person";

// Cargar personas al iniciar
window.onload = fetchPeople;

// Obtener y renderizar todas las personas
async function fetchPeople() {
  try {
    const res = await fetch(apiUrl);
    const people = await res.json();
    renderPeople(people);
  } catch (err) {
    console.error("Error al obtener personas:", err);
  }
}

// Renderizar tabla de personas
function renderPeople(people) {
  const tbody = document.getElementById("person-table-body");
  tbody.innerHTML = "";

  people.forEach(person => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="px-4 py-2">${person.id}</td>
      <td class="px-4 py-2">${person.firstName} ${person.secondName || ""}</td>
      <td class="px-4 py-2">${person.firstLastName} ${person.secondLastName || ""}</td>
        <td class="px-4 py-2">${person.typeIdentification}</td>
        <td class="px-4 py-2">${person.numberIdentification}</td>
      <td class="px-4 py-2">${person.email}</td>
      <td class="px-4 py-2">${person.phoneNumber}</td>
      <td class="px-4 py-2">${person.active ? "✅" : "❌"}</td>
      <td class="px-4 py-2 space-x-2">
        <button onclick='loadEditForm(${JSON.stringify(person)})' class="text-blue-600 hover:underline">Editar</button>
        <button onclick='confirmDelete(${person.id})' class="text-red-600 hover:underline">Eliminar</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Cargar datos en formulario de edición
function loadEditForm(person) {
  document.getElementById("person-id").value = person.id;
  document.getElementById("firstName").value = person.firstName;
  document.getElementById("secondName").value = person.secondName;
  document.getElementById("firstLastName").value = person.firstLastName;
  document.getElementById("secondLastName").value = person.secondLastName;
  document.getElementById("email").value = person.email;
  document.getElementById("phoneNumber").value = person.phoneNumber;
  document.getElementById("typeIdentification").value = person.typeIdentification;
  document.getElementById("numberIdentification").value = person.numberIdentification;
  document.getElementById("signing").value = person.signing;
  document.getElementById("active").checked = person.active;

  document.getElementById("modal-title").textContent = "Editar Persona";
  document.getElementById("person-modal").classList.remove("hidden");
}

// Crear o editar una persona
async function submitForm(e) {
  e.preventDefault();

  const personId = document.getElementById("person-id").value;

  const person = {
    id: personId ? parseInt(personId) : 0,
    firstName: document.getElementById("firstName").value,
    secondName: document.getElementById("secondName").value,
    firstLastName: document.getElementById("firstLastName").value,
    secondLastName: document.getElementById("secondLastName").value,
    email: document.getElementById("email").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    typeIdentification: document.getElementById("typeIdentification").value,
    numberIdentification: document.getElementById("numberIdentification").value,
    signing: document.getElementById("signing").value,
    active: document.getElementById("active").checked,
  };

  if (personId) {
    await updatePerson(personId, person);
  } else {
    await createPerson(person);
  }
}

// Crear persona
async function createPerson(person) {
  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
    fetchPeople();
    closeModal();
  } catch (err) {
    console.error("Error al crear persona:", err);
  }
}

// Actualizar persona
async function updatePerson(personId, person) {
  try {
    await fetch(`${apiUrl}/${personId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });
    fetchPeople();
    closeModal();
  } catch (err) {
    console.error("Error al actualizar persona:", err);
  }
}

// Confirmar eliminación
async function confirmDelete(personId) {
  const modal = document.getElementById("confirm-modal");
  modal.classList.remove("hidden");

  document.getElementById("confirm-action").onclick = async () => {
    await deletePerson(personId);
    modal.classList.add("hidden");
  };
}

// Eliminar persona
async function deletePerson(personId) {
  try {
    await fetch(`${apiUrl}/${personId}`, { method: "DELETE" });
    fetchPeople();
  } catch (err) {
    console.error("Error al eliminar persona:", err);
  }
}

// Cerrar formularios/modal
document.getElementById("close-modal").onclick = closeModal;
document.getElementById("cancel-form").onclick = closeModal;

function closeModal() {
  document.getElementById("person-modal").classList.add("hidden");
  document.getElementById("confirm-modal").classList.add("hidden");
}

// Eventos
document.getElementById("edit-user-form").onsubmit = submitForm;
document.getElementById("add-person-btn").onclick = () => {
  document.getElementById("modal-title").textContent = "Añadir Persona";
  document.getElementById("person-modal").classList.remove("hidden");
};
