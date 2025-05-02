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

        // 2️⃣ Obtener los roles del usuario
        const rolResponse = await fetch(`https://localhost:7008/api/RolUser/byUser/${user.id}`);
        if (!rolResponse.ok) throw new Error("Error al obtener los roles.");
        const roles = await rolResponse.json();

        const permisosTotales = [];

        // 3️⃣ Obtener permisos por cada rol
        for (const rol of roles) {
            const permResponse = await fetch(`https://localhost:7008/api/RolFormPermission/getByIdRol/${rol.rol.id}`);
            if (!permResponse.ok) throw new Error(`Error al obtener permisos del rol ${rol.rol.id}`);
            const permisos = await permResponse.json();

            permisos.forEach(p => {
                const existente = permisosTotales.find(pt => pt.formId === p.formId);
                if (existente) {
                    p.permissionIds.forEach(id => {
                        if (!existente.permissionIds.includes(id)) {
                            existente.permissionIds.push(id);
                        }
                    });
                } else {
                    permisosTotales.push({ formId: p.formId, permissionIds: [...p.permissionIds] });
                }
            });

            // 🟢 Guardar los nombres de los permisos en localStorage
            await guardarNombresDePermisos(rol.rol.id);
        }

        // 4️⃣ Guardar permisos combinados por ID en localStorage (opcional)
        localStorage.setItem("permisos", JSON.stringify(permisosTotales));

        // 5️⃣ Redirigir al home
        window.location.href = "home.html";

    } catch (err) {
        console.error(err);
        alert("Error al iniciar sesión: " + err.message);
    }
});

// 🔽 Función para obtener los nombres de los formularios y permisos en base a los IDs obtenidos
async function guardarNombresDePermisos(rolId) {
    try {
        const [formPerms, forms, permissions] = await Promise.all([
            fetch(`https://localhost:7008/api/RolFormPermission/permisos/${rolId}`).then(r => r.json()),
            fetch("https://localhost:7008/api/Form").then(r => r.json()),
            fetch("https://localhost:7008/api/Permission").then(r => r.json())
        ]);

        const permisosConNombres = [];

        formPerms.forEach(fp => {
            const form = forms.find(f => f.id === fp.formId);
            if (!form) return;

            fp.permissionIds.forEach(pid => {
                const permiso = permissions.find(p => p.id === pid);
                if (!permiso) return;

                permisosConNombres.push({
                    form: form.name,       // ✅ Nombre del formulario
                    permission: permiso.name // ✅ Nombre del permiso
                });
            });
        });

        // Guardar en localStorage
        localStorage.setItem("permissions", JSON.stringify(permisosConNombres));
        console.log("✅ Permisos guardados en localStorage:", permisosConNombres);
    } catch (err) {
        console.error("❌ Error al cargar permisos", err);
    }
}
