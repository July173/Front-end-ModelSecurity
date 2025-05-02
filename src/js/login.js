document.getElementById("loginBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    try {
        // 1️⃣ Login del usuario
        const loginResponse = await fetch("https://localhost:7008/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (loginResponse.status === 401) {
            alert("Credenciales inválidas.");
            return;
        }

        if (!loginResponse.ok) {
            throw new Error("Error al conectarse al servidor.");
        }

        const user = await loginResponse.json();
        localStorage.setItem("user", JSON.stringify(user));

        // 2️⃣ Obtener permisos organizados por rol con formularios y nombres
        const permisosResponse = await fetch(`https://localhost:7008/api/RolFormPermission/permissionUserAgrupado/${user.id}`);
        if (!permisosResponse.ok) {
            throw new Error("Error al obtener permisos estructurados.");
        }

        const estructuraPermisos = await permisosResponse.json();

        // 3️⃣ Guardar en localStorage para usar después
        localStorage.setItem("estructuraPermisos", JSON.stringify(estructuraPermisos));

        // 4️⃣ Redirigir al home
        window.location.href = "home.html";

    } catch (err) {
        console.error(err);
        alert("Error al iniciar sesión: " + err.message);
    }
});
