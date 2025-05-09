// auth.js

// ⚠️ Tiempo máximo de inactividad (en milisegundos)
const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutos

function verificarLogin() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (!user.username && !user.email)) {
        cerrarSesion(); // Limpia y redirige
    }
}

function actualizarActividad() {
    sessionStorage.setItem("lastActivity", Date.now());
}

function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    alert("Sesión cerrada por inactividad o cierre de sesión.");
    window.location.href = "../pages/login.html";
}

function inicializarControlSesion() {
    // Verificar si está logueado
    verificarLogin();

    // Registrar eventos de actividad
    document.addEventListener("mousemove", actualizarActividad);
    document.addEventListener("keydown", actualizarActividad);
    document.addEventListener("click", actualizarActividad);

    // Establecer la primera actividad si no existe
    if (!sessionStorage.getItem("lastActivity")) {
        actualizarActividad();
    }

    // Verificar inactividad cada minuto
    setInterval(() => {
        const last = sessionStorage.getItem("lastActivity");
        const now = Date.now();

        if (!last || now - last > INACTIVITY_LIMIT) {
            cerrarSesion();
        }
    }, 60000);
}

// Exportar funciones si usas módulos (opcional)
// export { verificarLogin, cerrarSesion, inicializarControlSesion };
