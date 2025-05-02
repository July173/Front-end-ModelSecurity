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
        window.location.href = "login.html";
    });
});
