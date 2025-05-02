const rolSelect = document.getElementById("rol-select");
const formList = document.getElementById("form-list");
const assignForm = document.getElementById("assign-permissions-form");

const apiRol = "https://localhost:7008/api/Rol/";
const apiForm = "https://localhost:7008/api/Form/";
const apiPerm = "https://localhost:7008/api/Permission/";
const apiAsignar = "https://localhost:7008/api/RolFormPermission/permission/";
const apiPermByRol = "https://localhost:7008/api/RolFormPermission/getByIdRol/";

// Cargar roles
async function cargarRoles() {
  const res = await fetch(apiRol);
  const data = await res.json();
  rolSelect.innerHTML = data.map(r => `<option value="${r.id}">${r.typeRol}</option>`).join('');
}

  async function cargarFormsYPerms() {
    const forms = await (await fetch(apiForm)).json();
    const perms = await (await fetch(apiPerm)).json();
    const permsByRol = await (await fetch(`${apiPermByRol}${rolSelect.value}`)).json();
  
    console.log("Permisos del rol:", permsByRol);
  
    formList.innerHTML = forms.map(form => {
      // Buscar los permisos asignados al form actual
      const permisoAsignado = permsByRol.find(p => p.formId === form.id);
      const permisosDelForm = permisoAsignado ? permisoAsignado.permissionIds : [];
  
      const checkboxes = perms.map(p => {
        const isChecked = permisosDelForm.includes(p.id);
        console.log(`Permiso ${p.id} para el form ${form.id}: ${isChecked}`);
        return `
          <label class="inline-flex items-center">
            <input type="checkbox" name="perm-${form.id}" value="${p.id}" ${isChecked ? "checked" : ""} class="mr-1">
            ${p.name}
          </label>
        `;
      }).join('');
  
      return `
        <div class="border p-4 rounded shadow-sm mb-4">
          <p class="font-semibold mb-2">${form.name}</p>
          <div class="flex flex-wrap gap-2">
            ${checkboxes}
          </div>
        </div>
      `;
    }).join('');
  }
  

rolSelect.addEventListener("change", async () => {
  const idRol = rolSelect.value;
  if (!idRol) return;

  // Limpiar formularios y permisos
  formList.innerHTML = '';

  // Cargar formularios y permisos
  await cargarFormsYPerms();

  // Obtener permisos asignados al rol seleccionado
  //const asignados = await (await fetch(`${apiPermByRol}${idRol}`)).json();

  // Marcar checkboxes según los permisos asignados
  /*asignados.forEach(a => {
    const checkboxes = document.querySelectorAll(`[name="perm-${a.idForm}"]`);
    checkboxes.forEach(checkbox => {
      if (parseInt(checkbox.value) === a.idPermission) {
        checkbox.checked = true;
      }
    });
  });*/
});

// Enviar datos
assignForm.addEventListener("submit", async e => {
  e.preventDefault();
  const rolId = parseInt(rolSelect.value);
  const data = [];

  document.querySelectorAll("[name^='perm-']").forEach(input => {
    if (!input.checked) return;
    const formId = parseInt(input.name.split("-")[1]);
    const permId = parseInt(input.value);

    let form = data.find(f => f.formId === formId);
    if (!form) {
      form = { formId, permissionIds: [] };
      data.push(form);
    }

    form.permissionIds.push(permId);
  });

  const body = {
    rolId,
    formPermissions: data
  };

  const res = await fetch(apiAsignar, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    alert("Permisos asignados correctamente.");
  } else {
    alert("Error al asignar permisos.");
  }
});

// Inicializar
cargarRoles();
cargarFormsYPerms();
function hasPermission(formName, permissionName) {
  const stored = JSON.parse(localStorage.getItem("permissions")) || [];

  return stored.some(r =>
    r.form.some(f =>
      f.name.toLowerCase() === formName.toLowerCase() &&
      f.permission.some(p => p.toLowerCase() === permissionName.toLowerCase())
    )
  );
}