document.querySelector("button").addEventListener("click", async function (e) { 
    e.preventDefault();

    const person = {
        firstName: document.getElementById("FirstName").value.trim(),
        secondName: document.getElementById("SecondName").value.trim(),
        firstLastName: document.getElementById("FirstLastName").value.trim(),
        secondLastName: document.getElementById("SecondLastName").value.trim(),
        phoneNumber: document.getElementById("PhoneNumber").value.trim(),
        typeIdentification: document.getElementById("TypeIdentification").value.trim(),
        numberIdentification: document.getElementById("NumberIdentification").value.trim(),
        active: true
    };

    const user = {
        username: document.getElementById("Username").value.trim(),
        password: document.getElementById("Password").value.trim(),
        email: document.getElementById("Email").value.trim(),
        active: true
    };

    if (!person.firstName || !user.username || !user.password || !user.email || !person.typeIdentification || !person.numberIdentification) {   
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    if (!/^\d+$/.test(person.numberIdentification)) {
        alert("El número de identificación debe contener solo números.");
        return;
    }

    if (user.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    try {
        // 1. Registrar persona
        const resPerson = await fetch("https://localhost:7008/api/Person", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(person)
        });

        if (!resPerson.ok) throw new Error("Error al registrar la persona");
        const createdPerson = await resPerson.json();

        // 2. Registrar usuario con ID de persona
        user.personId = createdPerson.id;
        const resUser = await fetch("https://localhost:7008/api/User", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        if (!resUser.ok) throw new Error("Error al registrar el usuario");
        const createdUser = await resUser.json();

        // 3. Asignar rol de aprendiz automáticamente (rolId = 12)
        const rolUser = {
            id: 0,
            rolId: 12,
            userId: createdUser.id
        };

        const resRolUser = await fetch("https://localhost:7008/api/RolUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rolUser)
        });

        if (!resRolUser.ok) throw new Error("Error al asignar el rol al usuario");

        alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        window.location.href = "../pages/login.html";

    } catch (err) {
        console.error(err);
        alert("Ocurrió un error en el registro.");
    }
});
