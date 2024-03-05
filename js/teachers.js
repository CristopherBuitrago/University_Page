 // Declaración de arrays para almacenar la lista de estudiantes y departamentos
const teachersList = [];
const departamentsList = [];

// Función para cargar datos desde una URL a una lista específica
const fetchDataTeachers = async (url, list) => {
    try {
        list.length = 0;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al cargar datos desde ${url}. Estado: ${response.status}`);
        }
        const data = await response.json();
        list.push(...data);
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
    }
};

// Funciones para cargar estudiantes y departamentos
const loadTeachers = async () => {
    await fetchData('http://localhost:3000/profesores', teachersList);
};

const loadDepartaments = async () => {
    await fetchData('http://localhost:3000/departamentos', departamentsList);
};

// Función para guardar un nuevo estudiante
const saveTeacher = async (newTeacher) => {
    try {
        const response = await fetch('http://localhost:3000/profesores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeacher),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el estudiante. Estado: ${response.status}`);
        }
        const teacherCreated = await response.json();
        console.log('Profesor creado:', teacherCreated);
    } catch (error) {
        console.error(`Error al crear el profesor: ${error.message}`);
    }
};

// Función para crear un nuevo profesor
const createTeacher = async () => {
    let nameInput = document.getElementById('teacherName');
    let lastNameInput = document.getElementById('teacherLastName');
    let docInput = document.getElementById('teacherDocumentType');
    let docNumbInput = document.getElementById('teacherDocumentNumber');
    let teachDepInput = document.getElementById('teacherDepartament');

    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const docType = docInput.value;
    const docNumb = docNumbInput.value;
    const teachDep = teachDepInput.value;

    const newTeacher = {
        id: teachersList.length + 1,
        nombre: name,
        apellido: lastName,
        tipo_documento: docType,
        numero_documento: docNumb,
        departamento_id: teachDep,
    }


    await saveTeacher(newTeacher);
    await loadTeachers();

    nameInput = "";
    lastNameInput = "";
    docInput = "";
    docNumbInput = "";
    teachDepInput = "";

    alert('Maestro creado con éxito!');

    //actulizarClientesEnFacturas();

    return newTeacher;

}

// Función para crear una celda de tabla con contenido dado
const createCellTeacher = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
};

// Función para mostrar la lista de estudiantes
const showListTeacher = async () => {
    await loadTeachers();
    const teacherForm = document.getElementById('teachers-form');
    const teachersListed = document.getElementById('teachers-list');
    
    // Oculta el formulario y muestra la lista de estudiantes
    teacherForm.style.display = 'none';
    teachersListed.style.display = 'block';

    // Crea la estructura de la tabla para mostrar la lista de estudiantes
    teachersListed.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-borderless table-primary align-middle">
                <thead class="table-light">
                    <caption>Profesores</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Departamento</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider" id="info-teachers"></tbody>
            </table>
        </div>
    `;

    // Llena la tabla con los datos de los estudiantes
    teachersList.forEach(({ id, nombre, apellido, departamento_id }) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        [id, nombre, apellido, departamento_id].forEach(content => {
            row.appendChild(createCellTeacher(content));
        });
        document.getElementById("info-teachers").appendChild(row);
    });

    // Agrega un botón para volver al formulario
    const volverButton = document.createElement('button');
    volverButton.setAttribute("class", "btn btn-danger");
    volverButton.textContent = 'Volver al Formulario';
    volverButton.addEventListener('click', volverFormularioTeacher);
    teachersListed.appendChild(volverButton);

};

// Función para volver al formulario desde la lista de estudiantes
const volverFormularioTeacher = () => {
    const teacherForm = document.getElementById('teachers-form');
    const teachersListed = document.getElementById('teachers-list');

    // Oculta la lista de estudiantes y muestra el formulario
    teachersListed.style.display = 'none';
    teacherForm.style.display = 'block';
};

// Función para generar las opciones del menú desplegable de departamentos
const generateDepartaments = () => {
    return departamentsList.map(departament => `<option>${departament.nombre}</option>`).join('');
};

// Función para cargar el formulario al cargar la página
const loadTeachersForm = () => {
    const teacherForm = document.getElementById('teachers-form');
    const teachersListed = document.getElementById('teachers-list');
    
    // Oculta la lista de estudiantes al cargar el formulario
    teachersListed.style.display = 'none';

    // Crea el formulario
    teacherForm.innerHTML = `
        <form>
        <!-- name -->
        <div class="mb-3 row">
            <label for="teacherName" class="col-4 col-form-label">Nombre</label>
            <div class="col-8">
                <input type="text" class="form-control" id="teacherName" placeholder="Alhan" required />
            </div>
        </div>

        <!-- last Name -->
        <div class="mb-3 row">
            <label for="teacherLastName" class="col-4 col-form-label">Apellidos</label>
            <div class="col-8">
                <input type="text" class="form-control" id="teacherLastName" placeholder="Brito Delgado "
                    required />
            </div>
        </div>

        <!-- Document type -->
        <div class="mb-3 row">
            <label for="teacherDocumentType" class="col-4 col-form-label">Tipo de documento</label>
            <div class="col-8">
                <select class="form-select" id="teacherDocumentType" required>
                    <option selected>Seleccionar</option>
                    <option value="C.C">C.C</option>
                    <option value="C.E">C.E</option>
                    <option value="N.P">N.P</option>
                    <option value="T.I">T.I</option>
                </select>
            </div>
        </div>

        <!-- Document Number -->
        <div class="mb-3 row">
            <label for="teacherDocumentNumber" class="col-4 col-form-label">Número Documento</label>
            <div class="col-8">
                <input type="number" class="form-control" id="teacherDocumentNumber" placeholder="1234356602"
                    maxlength="10" required />
            </div>
        </div>

        <!-- Departament -->
        <div class="mb-3 row">
            <label for="teacherDepartament" class="col-4 col-form-label">Departamento</label>
            <div class="col-8">
                <select class="form-select" id="teacherDepartament" required>
                    <option selected>Seleccionar</option>
                    ${generateDepartaments()}
                </select>
            </div>
        </div>
        <hr>

            <button class="btn btn-danger" class="col-2 col-form-label" type="button" onclick="showListTeacher()">Ver Listado de maestros</button>
            <button class="btn btn-primary" class="col-6 col-form-label" type="button" onclick="createTeacher()">Crear maestro</button>
            
        </form>
    `;
};
