document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) return;

    const html = await fetch("../pages/menu.html").then(res => res.text());
    menuContainer.innerHTML = html;

    try {
        const response = await fetch(`https://localhost:7008/api/RolFormPermission/menu/${user.id}`);
        if (!response.ok) throw new Error("No se pudo obtener el menú");

        const estructura = await response.json();

        inicializarSelectorDeRoles(estructura);
    } catch (err) {
        console.error("Error al cargar el menú:", err);
    }
});

function inicializarSelectorDeRoles(estructura) {
    const selectRol = document.getElementById("select-rol");
    const rolTexto = document.getElementById("menu-rol");
    const menuContent = document.getElementById("menu-content");

    if (!estructura || estructura.length === 0) return;

    // Llenar el selector de roles
    estructura.forEach((rolObj, idx) => {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = rolObj.rol;
        selectRol.appendChild(opt);
    });

    // Escuchar cambios en el selector
    selectRol.addEventListener("change", () => {
        const index = parseInt(selectRol.value);
        const rolSeleccionado = estructura[index];
        rolTexto.textContent = rolSeleccionado.rol;
        renderizarMenu(rolSeleccionado.moduleForm);
    });

    // Mostrar el primer rol por defecto
    selectRol.value = 0;
    rolTexto.textContent = estructura[0].rol;
    renderizarMenu(estructura[0].moduleForm);
}

function renderizarMenu(modulos) {
    const contenedor = document.getElementById("menu-content");
    contenedor.innerHTML = "";

    modulos.forEach(modulo => {
        const moduloDiv = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = modulo.name;
        titulo.className = "text-lg font-semibold border-b border-blue-400 pb-1";
        moduloDiv.appendChild(titulo);

        const lista = document.createElement("ul");
        lista.className = "ml-2 mt-2 space-y-1";

        modulo.form.forEach(formulario => {
            const item = document.createElement("li");
            const link = document.createElement("a");

            link.href = `../pages/${formulario.path}`;
            link.textContent = formulario.name;
            link.className = "block hover:text-cyan-300 transition";

            item.appendChild(link);
            lista.appendChild(item);
        });

        moduloDiv.appendChild(lista);
        contenedor.appendChild(moduloDiv);
    });
}
