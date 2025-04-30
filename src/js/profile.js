// Obtener usuario del localStorage
const user = JSON.parse(localStorage.getItem("user"));
const userInfo = document.getElementById("user-info");

if (!user) {
    alert("No hay sesión activa. Redirigiendo...");
    window.location.href = "login.html";
} else {
    fetch(`https://localhost:7008/api/Person/${user.personId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener la información del usuario.");
            }
            return response.json();
        })
        .then(person => {
            userInfo.innerHTML = `
          <p><strong>Nombres:</strong> ${person.firstName} ${person.secondName ?? ""}</p>
          <p><strong>Apellidos:</strong> ${person.firstLastName} ${person.secondLastName ?? ""}</p>
          <p><strong>Nombre de usuario:</strong> ${user.username}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Teléfono:</strong> ${person.phoneNumber}</p>
          <p><strong>Identificación:</strong> ${person.typeIdentification} ${person.numberIdentification}</p>
        `;
        })
        .catch(error => {
            console.error(error);
            userInfo.innerHTML = "<p class='text-red-500'>Error al cargar los datos del perfil.</p>";
        });
    userInfo.innerHTML = `
     <p><strong>Nombre de usuario:</strong> ${user.username}</p>
     <p><strong>Email:</strong> ${user.email}</p>`;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}