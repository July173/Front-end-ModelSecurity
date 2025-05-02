
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html"; // Redirigir si no está logueado
        return;
    }

    document.getElementById("username").textContent = user.username || user.email;

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        localStorage.removeItem("permisos");
        localStorage.removeItem("estructuraPermisos");
        window.location.href = "login.html";
    });

    // 🔽 Revisión de permisos
    // Usuarios
    if (!hasPermission("Lista de usuarios", "Ver")) {
        const linkUsers = document.querySelector('a[href="users.html"]');
        if (linkUsers) linkUsers.remove();

        const mobileUsers = document.querySelector('#mobile-entities-menu a[href="users.html"]');
        if (mobileUsers) mobileUsers.remove();
    }

    // Roles
    if (!hasPermission("Crear rol", "Ver")) {
        const linkRoles = document.querySelector('a[href="rols.html"]');
        if (linkRoles) linkRoles.remove();

        const mobileRoles = document.querySelector('#mobile-entities-menu a[href="rols.html"]');
        if (mobileRoles) mobileRoles.remove();
    }
});

// 🔄 Función corregida para revisar los permisos desde estructuraPermisos
function hasPermission(formName, permissionName) {
    const stored = JSON.parse(localStorage.getItem("estructuraPermisos")) || [];

    return stored.some(r =>
        r.form?.some(f =>
            f.name.toLowerCase() === formName.toLowerCase() &&
            f.permission?.some(p => p.toLowerCase() === permissionName.toLowerCase())
        )
    );
}

