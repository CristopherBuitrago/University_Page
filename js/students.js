const studentsList = [];


const loadStudents = async () => {

    try {
        studentsList.length = 0;
        const response = await fetch('http://localhost:3000/alumnos');

        if (!response.ok) {
            throw new Error('Error al cargar estudiantes. Estado: ', response.status);
        }
        const students = await response.json();
        studentsList.push(...students);

    } catch (error) {
        console.error("Error al cargar estudiantes", error.message);
    }
}


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
            throw new Error('Error al crear el estudiante. Estado: ', response.status);
        }
        const studentCreated = await response.json();


        console.log('estudiante creado:', studentCreated);

    } catch (error) {
        console.error("Error al cargar estudiantes", error.message);
    }
}

const loadStudentsForm = () => {
    const studentForm = document.getElementById('students-form');
    studentForm.innerHTML = `
        <form>
        <!-- name -->
        <div class="mb-3 row">
            <label for="inputName" class="col-4 col-form-label">Nombre</label>
            <div class="col-8">
                <input type="text" class="form-control" id="inputName" placeholder="Alhan" required />
            </div>
        </div>
        <!-- last Name -->
        <div class="mb-3 row">
            <label for="inputLastName" class="col-4 col-form-label">Apellidos</label>
            <div class="col-8">
                <input type="text" class="form-control" id="inputLastName" placeholder="Brito Delgado "
                    required />
            </div>
        </div>
        <!-- Document type -->
        <div class="mb-3 row">
            <label for="inputTypeDocument" class="col-4 col-form-label">Tipo de documento</label>
            <div class="col-8">
                <select class="form-select" id="inputTypeDocument" required>
                    <option selected>Seleccionar</option>
                    <option value="1">C.C</option>
                    <option value="2">C.E</option>
                    <option value="3">N.P</option>
                    <option value="4">T.I</option>
                </select>
            </div>
        </div>
        <!-- Document Number -->
        <div class="mb-3 row">
            <label for="inputDocumentNumber" class="col-4 col-form-label">Número Documento</label>
            <div class="col-8">
                <input type="number" class="form-control" id="inputDocumentNumber" placeholder="1234356602"
                    maxlength="10" required />
            </div>
        </div>
        <!-- Residence City -->
        <div class="mb-3 row">
            <label for="inputResidenCity" class="col-4 col-form-label">Ciudad Residencia</label>
            <div class="col-8">
                <input type="text" class="form-control" id="inputResidenCity" placeholder="Campus City"
                    required />
            </div>
        </div>
        <!-- Adress -->
        <div class="mb-3 row">
            <label for="inputAdress" class="col-4 col-form-label">Dirección</label>
            <div class="col-8">
                <input type="text" class="form-control" id="inputAdress"
                    placeholder="Cra. 18 #1-2 Barrio El Churco" required />
            </div>
        </div>
        <!-- Phone -->
        <div class="mb-3 row">
            <label for="inputPhoneNumber" class="col-4 col-form-label">Número Telefónico</label>
            <div class="col-8">
                <input type="text" class="form-control" id="inputPhoneNumber" placeholder="3104567894"
                    required />
            </div>
        </div>
        <!-- Birth Date -->
        <div class="mb-3 row">
            <label for="inputBirthDate" class="col-4 col-form-label">Fecha de nacimiento</label>
            <div class="col-8">
                <input type="date" class="form-control" id="inputBirthDate" placeholder="Campus City"
                    required />
            </div>
        </div>
        <!-- Genre -->
        <div class="mb-3 row">
            <label for="inputGenre" class="col-4 col-form-label">Género</label>
            <div class="col-8">
                <select class="form-select" id="inputGenre" required>
                    <option selected>Seleccionar</option>
                    <option value="1">Masculino</option>
                    <option value="2">Femenino</option>
                </select>
            </div>
        </div>
        <!-- Genre -->
        <div class="mb-3 row">
            <label for="inputGenre" class="col-4 col-form-label">Programa</label>
            <div class="col-8">
                <select class="form-select" id="inputGenre" required>
                    <option selected>Seleccionar</option>
                </select>
            </div>
        </div>
        <hr>

        <button type="button" onclick="createStudent()">Crear Cliente</button>
        <button type="button" onclick="showList()">Ver Listado de Clientes</button>
        </form>
    `;
    const studentsListed = document.getElementById('students-list');
    studentsListed.style.display = 'none';
}

const createStudent = async () => {
    const nameInput = document.getElementById('studentName');
    const ageInput = document.getElementById('studentAge');
    const emailInput = document.getElementById('studentEmail');

    const name = nameInput.value;
    const age = ageInput.value;
    const email = emailInput.value;

    const newStudent = {
        id: studentsList.length + 1,
        name: name,
        age: age,
        email: email
    }


    await saveStudent(newStudent);
    await loadStudents();

    nameInput.value = '';
    ageInput.value = '';
    emailInput.value = '';

    alert('estudiante creado con éxito!');

    actulizarClientesEnFacturas();

    return newStudent;

}

const showList = async () => {
    await loadStudents();
    const studentForm = document.getElementById('students-form');
    const studentsListed = document.getElementById('students-list');

    studentForm.style.display = 'none';
    studentsListed.style.display = 'block';

    const ul = document.createElement('ul');

    for (const cliente of studentsList) {
        const li = document.createElement('li');
        li.textContent = `ID: ${cliente.id}, Nombre: ${cliente.name}, Edad: ${cliente.age}, Email: ${cliente.email}`;
        ul.appendChild(li);
    }

    studentsListed.innerHTML = '';
    studentsListed.appendChild(ul);

    const volverButton = document.createElement('button');
    volverButton.textContent = 'Volver al Formulario';
    volverButton.addEventListener('click', volverFormulario);
    studentsListed.appendChild(volverButton);

}

const volverFormulario = () => {
    const studentForm = document.getElementById('students-form');
    const studentsListed = document.getElementById('students-list');

    studentsListed.style.display = 'none';
    studentForm.style.display = 'block';

}

console.log(studentsList);