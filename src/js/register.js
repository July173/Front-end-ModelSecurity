document.querySelector("button").addEventListener("click", async function (e) {
    e.preventDefault();
  
    // Obtener valores del formulario
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
  
    // Validaciones básicas
    if (!person.firstName || !user.username || !user.password || !user.email || !person.typeIdentification || !person.numberIdentification) {   
        alert("Por favor completa los campos obligatorios.");
        return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    // Validación de número de identificación (solo números)
    if (!/^\d+$/.test(person.numberIdentification)) {
        alert("El número de identificación debe contener solo números.");
        return;
    }

    // Validación de contraseña (mínimo 6 caracteres)
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
  
        // 2. Registrar usuario con el ID de persona
        user.personId = createdPerson.id;
  
        const resUser = await fetch("https://localhost:7008/api/User", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
  
        if (!resUser.ok) throw new Error("Error al registrar el usuario");
  
        alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        window.location.href = "../pages/login.html"; // redirigir al login
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error en el registro.");
    }
});
