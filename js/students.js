// Declaración de arrays para almacenar la lista de estudiantes y programas
const studentsList = [];
const programsList = [];

// Función para cargar datos desde una URL a una lista específica
const fetchData = async (url, list) => {
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

// Funciones para cargar estudiantes y programas
const loadStudents = async () => {
    await fetchData('http://localhost:3000/alumnos', studentsList);
};

const loadPrograms = async () => {
    await fetchData('http://localhost:3000/programas', programsList);
};

// Función para guardar un nuevo estudiante
const saveStudent = async (newStudent) => {
    try {
        const response = await fetch('http://localhost:3000/alumnos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el estudiante. Estado: ${response.status}`);
        }
        const studentCreated = await response.json();
        console.log('Estudiante creado:', studentCreated);
    } catch (error) {
        console.error(`Error al crear el estudiante: ${error.message}`);
    }
};

// Función para crear un nuevo estudiante
const createStudent = async () => {
    let nameInput = document.getElementById('studentName');
    let lastNameInput = document.getElementById('studentLastName');
    let docInput = document.getElementById('studentDocumentType');
    let docNumbInput = document.getElementById('studentDocumentNumber');
    let studCityInput = document.getElementById('studentResidenCity');
    let studAdressInput = document.getElementById('studentAdress');
    let studNumbInput = document.getElementById('studentPhoneNumber');
    let studBirthInput = document.getElementById('studentBirthDate');
    let studGenreInput = document.getElementById('studentGenre');
    let studProgramInput = document.getElementById('studentProgram');

    const name = nameInput.value;
    const lastName = lastNameInput.value;
    const docType = docInput.value;
    const docNumb = docNumbInput.value;
    const studCity = studCityInput.value;
    const studAdress = studAdressInput.value;
    const studNumb = studNumbInput.value;
    const studBirth = studBirthInput.value;
    const studGenre = studGenreInput.value;
    const studProgram = studProgramInput.value;

    const newStudent = {
        id: studentsList.length + 1,
        nombre: name,
        apellido: lastName,
        tipo_documento: docType,
        numero_documento: docNumb,
        ciudad_residencia: studCity,
        direccion: studAdress,
        telefono: studNumb,
        fecha_nacimiento: studBirth,
        sexo: studGenre,
        programa_id: studProgram,
    }


    await saveStudent(newStudent);
    await loadStudents();

    nameInput = "";
    lastNameInput = "";
    docInput = "";
    docNumbInput = "";
    studCityInput = "";
    studAdressInput = "";
    studNumbInput = "";
    studBirthInput = "";
    studGenreInput = "";
    studProgramInput = "";

    alert('estudiante creado con éxito!');

    //actulizarClientesEnFacturas();

    return newStudent;

}

// Función para crear una celda de tabla con contenido dado
const createCell = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
};

// Función para mostrar la lista de estudiantes
const showList = async () => {
    await loadStudents();
    const studentForm = document.getElementById('students-form');
    const studentsListed = document.getElementById('students-list');

    // Oculta el formulario y muestra la lista de estudiantes
    studentForm.style.display = 'none';
    studentsListed.style.display = 'block';

    // Crea la estructura de la tabla para mostrar la lista de estudiantes
    studentsListed.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-borderless table-primary align-middle">
                <thead class="table-light">
                    <caption>Estudiantes</caption>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Programas</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider" id="info-students"></tbody>
            </table>
        </div>
    `;

    // Llena la tabla con los datos de los estudiantes
    studentsList.forEach(({ id, nombre, apellido, programa_id }) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        [id, nombre, apellido, programa_id].forEach(content => {
            row.appendChild(createCell(content));
        });
        document.getElementById("info-students").appendChild(row);
    });

    // Agrega un botón para volver al formulario
    const volverButton = document.createElement('button');
    volverButton.setAttribute("class", "btn btn-danger");
    volverButton.textContent = 'Volver al Formulario';
    volverButton.addEventListener('click', volverFormulario);
    studentsListed.appendChild(volverButton);

};

// Función para volver al formulario desde la lista de estudiantes
const volverFormulario = () => {
    const studentForm = document.getElementById('students-form');
    const studentsListed = document.getElementById('students-list');

    // Oculta la lista de estudiantes y muestra el formulario
    studentsListed.style.display = 'none';
    studentForm.style.display = 'block';
};

// Función para generar las opciones del menú desplegable de programas
const generatePrograms = () => {
    return programsList.map(program => `<option>${program.nombre}</option>`).join('');
};

// Función para cargar el formulario al cargar la página
const loadStudentsForm = () => {
    const studentForm = document.getElementById('students-form');
    const studentsListed = document.getElementById('students-list');

    // Oculta la lista de estudiantes al cargar el formulario
    studentsListed.style.display = 'none';
    
    // Crea el formulario
    studentForm.innerHTML = `
        <form>
        <!-- name -->
        <div class="mb-3 row">
            <label for="studentName" class="col-4 col-form-label">Nombre</label>
            <div class="col-8">
                <input type="text" class="form-control" id="studentName" placeholder="Alhan" required />
            </div>
        </div>

        <!-- last Name -->
        <div class="mb-3 row">
            <label for="studentLastName" class="col-4 col-form-label">Apellidos</label>
            <div class="col-8">
                <input type="text" class="form-control" id="studentLastName" placeholder="Brito Delgado "
                    required />
            </div>
        </div>

        <!-- Document type -->
        <div class="mb-3 row">
            <label for="studentDocumentType" class="col-4 col-form-label">Tipo de documento</label>
            <div class="col-8">
                <select class="form-select" id="studentDocumentType" required>
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
            <label for="studentDocumentNumber" class="col-4 col-form-label">Número Documento</label>
            <div class="col-8">
                <input type="number" class="form-control" id="studentDocumentNumber" placeholder="1234356602"
                    maxlength="10" required />
            </div>
        </div>

        <!-- Residence City -->
        <div class="mb-3 row">
            <label for="studentResidenCity" class="col-4 col-form-label">Ciudad Residencia</label>
            <div class="col-8">
                <input type="text" class="form-control" id="studentResidenCity" placeholder="Campus City"
                    required />
            </div>
        </div>

        <!-- Adress -->
        <div class="mb-3 row">
            <label for="studentAdress" class="col-4 col-form-label">Dirección</label>
            <div class="col-8">
                <input type="text" class="form-control" id="studentAdress"
                    placeholder="Cra. 18 #1-2 Barrio El Churco" required />
            </div>
        </div>

        <!-- Phone -->
        <div class="mb-3 row">
            <label for="studentPhoneNumber" class="col-4 col-form-label">Número Telefónico</label>
            <div class="col-8">
                <input type="text" class="form-control" id="studentPhoneNumber" placeholder="3104567894"
                    required />
            </div>
        </div>

        <!-- Birth Date -->
        <div class="mb-3 row">
            <label for="studentBirthDate" class="col-4 col-form-label">Fecha de nacimiento</label>
            <div class="col-8">
                <input type="date" class="form-control" id="studentBirthDate" placeholder="Campus City"
                    required />
            </div>
        </div>

        <!-- Genre -->
        <div class="mb-3 row">
            <label for="studentGenre" class="col-4 col-form-label">Género</label>
            <div class="col-8">
                <select class="form-select" id="studentGenre" required>
                    <option selected>Seleccionar</option>
                    <option value="Maculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
            </div>
        </div>

        <!-- Program -->
        <div class="mb-3 row">
            <label for="studentProgram" class="col-4 col-form-label">Programa</label>
            <div class="col-8">
                <select class="form-select" id="studentProgram" required>
                    <option selected>Seleccionar</option>
                    ${generatePrograms()}
                </select>
            </div>
        </div>
        <hr>

            <button class="btn btn-danger" class="col-2 col-form-label" type="button" onclick="showList()">Ver Listado de estudiantes</button>
            <button class="btn btn-primary" class="col-6 col-form-label" type="button" onclick="createStudent()">Crear Estudiante</button>
            
        </form>
    `;
};
