const apiUser = "https://localhost:7008/api/User";
const apiPerson = "https://localhost:7008/api/Person";

const user = JSON.parse(localStorage.getItem("user"));
const userInfo = document.getElementById("user-info");

if (!user) {
    alert("No hay sesión activa. Redirigiendo...");
    window.location.href = "login.html";
} else {
    fetch(`${apiPerson}/${user.personId}`)
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener la información del usuario.");
            return response.json();
        })
        .then(person => {
            user.person = person; // guardamos los datos para usarlos luego
            renderUserInfo(user);
        })
        .catch(error => {
            console.error(error);
            userInfo.innerHTML = "<p class='text-red-500'>Error al cargar los datos del perfil.</p>";
        });
}

function renderUserInfo(user) {
    const person = user.person;
    userInfo.innerHTML = `
        <p><strong>Nombres:</strong> ${person.firstName} ${person.secondName ?? ""}</p>
        <p><strong>Apellidos:</strong> ${person.firstLastName} ${person.secondLastName ?? ""}</p>
        <p><strong>Nombre de usuario:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Teléfono:</strong> ${person.phoneNumber}</p>
        <p><strong>Identificación:</strong> ${person.typeIdentification ?? ""} ${person.numberIdentification}</p>
        <button onclick="openEditModal()" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Editar Información
        </button>
    `;
}

function openEditModal() {
    const person = user.person;
    document.getElementById("user-id").value = user.id;
    document.getElementById("person-id").value = person.id;

    document.getElementById("username-input").value = user.username;
    document.getElementById("email-input").value = user.email;
    document.getElementById("nombre-input").value =
        `${person.firstName} ${person.secondName ?? ""} ${person.firstLastName} ${person.secondLastName}`.trim();

    document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("edit-modal").classList.add("hidden");
}

document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = parseInt(document.getElementById("user-id").value);
    const personId = parseInt(document.getElementById("person-id").value);
    const username = document.getElementById("username-input").value;
    const email = document.getElementById("email-input").value;
    const nombreCompleto = document.getElementById("nombre-input").value.trim().split(" ");

    const person = {
        id: personId,
        firstName: nombreCompleto[0] || "",
        secondName: nombreCompleto[1] || "",
        firstLastName: nombreCompleto[2] || "",
        secondLastName: nombreCompleto[3] || "",
        phoneNumber: user.person.phoneNumber,
        numberIdentification: user.person.numberIdentification
    };

    const userUpdate = { id: userId, username, email };

    try {
        await fetch(`${apiUser}/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userUpdate)
        });

        await fetch(`${apiPerson}/${personId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(person)
        });

        user.username = username;
        user.email = email;
        user.person = person;
        localStorage.setItem("user", JSON.stringify(user));

        renderUserInfo(user);
        closeEditModal();
    } catch (err) {
        console.error("Error al actualizar:", err);
        alert("Hubo un problema al actualizar la información.");
    }
});

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
