const rolSelect = document.getElementById("rol-select");
const formList = document.getElementById("form-list");
const assignForm = document.getElementById("assign-permissions-form");

const apiRol = "https://localhost:7008/api/Rol/";
const apiForm = "https://localhost:7008/api/Form/";
const apiPerm = "https://localhost:7008/api/Permission/";
const apiAsignar = "https://localhost:7008/api/RolFormPermission/permission/";

// Cargar roles
async function cargarRoles() {
  const res = await fetch(apiRol);
  const data = await res.json();
  rolSelect.innerHTML = data.map(r => `<option value="${r.id}">${r.typeRol}</option>`).join('');
}

// Cargar formularios y permisos
async function cargarFormsYPerms() {
  const forms = await (await fetch(apiForm)).json();
  const perms = await (await fetch(apiPerm)).json();

  formList.innerHTML = forms.map(form => `
    <div class="border p-4 rounded shadow-sm">
      <p class="font-semibold mb-2">${form.name}</p>
      <div class="flex flex-wrap gap-2">
        ${perms.map(p => `
          <label class="inline-flex items-center">
            <input type="checkbox" name="perm-${form.id}" value="${p.id}" class="mr-1">
            ${p.name}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

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
