document.getElementById("loginBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validaciones
    if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        // Realizamos la llamada al API de login
        const res = await fetch("https://localhost:7008/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (res.status === 401) {
            alert("Credenciales inválidas.");
            return;
        }
        if (!res.ok) {
            throw new Error("Error al conectarse al servidor.");
        }
        
        const user = await res.json();

        // Guardar datos del usuario en localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirigir al home
        window.location.href = "home.html";
    } catch (err) {
        console.error(err);
        alert("Error al iniciar sesión. " + err.message);
    }
});
