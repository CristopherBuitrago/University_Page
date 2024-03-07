// Definimos arrays para almacenar las asignaturas y los periodos
const subjectArray = [];
const periodsArray = [];
const coursesArray = [];
const classroomsArray = [];

// Función para cargar datos desde una URL a una lista específica
const fetchDataSubjects = async (url, list) => {
    try {
        list.length = 0;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar datos desde ${url}. Estado: ${response.status}`);
        const data = await response.json();
        list.push(...data);
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
    }
};

// Funciones para cargar asignaturas y programas
const loadSubjects = async () => await fetchDataSubjects('http://localhost:3000/asignaturas', subjectArray);
const loadPeriods = async () => await fetchDataSubjects('http://localhost:3000/periodos', periodsArray);
const loadCourses = async () => await fetchDataSubjects('http://localhost:3000/cursos', coursesArray);
const loadClassrooms = async () => await fetchDataSubjects('http://localhost:3000/salones', classroomsArray);

// Función para generar las opciones del menú desplegable de programas
const generatePeriods = () => periodsArray.map(period => `<option>${period.codigo}</option>`).join('');
const generateCourses = () => coursesArray.map(course => `<option>${course.nombre}</option>`).join('');
const generateClassRooms = () => classroomsArray.map(classroom => `<option>${classroom.numero_identificacion}</option>`).join('');

// Función para cargar el formulario al cargar la página
const loadSubjectsForm = () => {
    const subjectForm = document.getElementById('subjects-form');
    const subjectsListed = document.getElementById('subject-list');

    // Oculta la lista de asignaturas al cargar el formulario
    subjectsListed.style.display = 'none';
    
    // Extraemos los nombres de los cursos
    const coursesNames = coursesArray.map(course => course.nombre); 

    // Crea el formulario
    subjectForm.innerHTML = `
        <form>
        <!-- period -->
        <div class="mb-3 row">
            <label for="periods" class="col-4 col-form-label">Periodo</label>
            <div class="col-8">
                <select class="form-select" id="period" required>
                    <option selected>Seleccionar</option>
                    ${generatePeriods()}
                </select>
            </div>
        </div>

        <!-- cursos -->
        <div class="mb-3 row">
            <label for="courses" class="col-4 col-form-label">Cursos</label>
            <div class="col-8">
                <select class="form-select" id="courses" required>
                    <option selected>Seleccionar</option>
                    ${generateCourses()}
                </select>
            </div>
        </div>

        <!-- creditos -->
        <div class="mb-3 row">
            <label for="credits" class="col-4 col-form-label">Creditos</label>
            <div class="col-8">
                <input type="Number" class="form-control" id="credits" placeholder="Example: 4..." required>
            </div>
        </div>

        <!-- programas -->
        <div class="mb-3 row">
            <label for="programs" class="col-4 col-form-label">Programas</label>
            <div class="col-8">
                <select class="form-select" id="programs" required>
                    <option selected>Seleccionar</option>
                    ${generatePrograms()}
                </select>
            </div>
        </div>

        <!-- Construcción de Horario -->
        <div class="form-group" id="horario">
        <label>Horario de Clases:</label>
        <div class="row">
            <div class="col-md-3">
            <label for="dia">Día:</label>
            <select class="form-control" id="dia">
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
            </select>
            </div>
            <div class="col-md-3">
                <label for="hora_inicio">Hora de Inicio:</label>
                <input type="time" class="form-control" id="hora_inicio">
            </div>
            <div class="col-md-3">
                <label for="hora_fin">Hora de Fin:</label>
                <input type="time" class="form-control" id="hora_fin">
            </div>
            <div class="col-md-3">
                <label for="salon">Salón:</label>
                <select class="form-select" id="salon"> 
                    ${generateClassRooms()}
                </select>
            </div>
        </div>
    
        <button type="button" class="btn btn-danger mt-3" onclick="showListSubject()">Mostrar asignaturas</button>
        <button type="button" class="btn btn-success mt-3" onclick="createSubject()">Agregar Asignatura</button>
    
        </div>
        </form>
    `;
};

// Función para guardar una asignatura
const saveSubject = async (newSubject) => {
    try {
        const response = await fetch('http://localhost:3000/asignaturas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newSubject),
        });

        if (!response.ok) throw new Error(`Error al crear la asignatura. Estado: ${response.status}`);
        const subjectCreated = await response.json();
        console.log('asignatura creada:', subjectCreated);
    } catch (error) {
        console.error(`Error al crear la asignatura: ${error.message}`);
    }
};

// Función para obtener el ID de una entidad
const getId = (entity, list) => {
    const result = list.find(element => entity === element.nombre);
    return result ? result.id : "Id no encontrada o la lista no existe";
}

// Función para obtener el código de una entidad
const getCode = (entity, list) => {
    const result = list.find(element => entity === element.nombre);
    return result ? result.codigo : "Codigo no encontrada o la lista no existe";
}

// Función para crear asignatura    
const createSubject = async () => {
    const period = document.getElementById('period').value;
    const course = document.getElementById('courses').value;
    const credit = document.getElementById('credits').value;
    const teacher = document.getElementById('teachers').value;
    const program = document.getElementById('programs').value;
    const day = document.getElementById('dia').value;
    const begin = document.getElementById('hora_inicio').value;
    const end = document.getElementById('hora_fin').value;
    const classRoom = document.getElementById('salon').value;

    // Obtener el ID del periodo y del curso para encontrar el código del curso
    const code_course = getCode(course, coursesArray);

    const scheedule = {dia: day, hora_inicio: begin, hora_fin: end, salon_id: classRoom};

    const newSubject = {
        id: subjectArray.length + 1,
        curso_id: Number(getId(course, coursesArray)),
        codigo: `${code_course}-${period}`,
        creditos: credit,
        profesor_id: Number(getId(teacher, teachersList)),
        cupos_disponibles: 20,
        programa_id: Number(getId(program, programsList)),
        horario_clases: [scheedule],
    };

    await saveSubject(newSubject);
    await loadSubjects();

    // Restablecer los valores de los elementos del formulario
    const elements = ['period', 'courses', 'credits', 'teachers', 'programs', 'dia', 'hora_inicio', 'hora_fin', 'salon'];
    elements.forEach(element => document.getElementById(element).value = "");

    alert('¡Asignatura creada con éxito!');
    console.log(newSubject);
    return newSubject;
};

// Función para crear una celda de tabla con contenido dado
const createCellSubject = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
};

// Función para mostrar la lista de asignaturas
const showListSubject = async () => {
    await loadSubjects();
    const subjectsForm = document.getElementById('subjects-form');
    const subjectListed = document.getElementById('subject-list');
    
    // Oculta el formulario y muestra la lista de asignaturas
    subjectsForm.style.display = 'none';
    subjectListed.style.display = 'block';

    // Crea la estructura de la tabla para mostrar la lista de asignaturas
    subjectListed.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-borderless table-primary align-middle">
                <thead class="table-light">
                    <caption>Asignaturas</caption>
                    <tr>
                        <th>ID</th>
                        <th>Codigo</th>
                        <th>Creditos</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider" id="info-subject"></tbody>
            </table>
        </div>
    `;
    // Llena la tabla con los datos de los asignaturas
    subjectArray.forEach(({ id, codigo, creditos}) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        [id, codigo, creditos].forEach(content => {
            row.appendChild(createCellSubject(content));
        });
        document.getElementById("info-subject").appendChild(row);
    });

    // Agrega un botón para volver al formulario
    const volverButton = document.createElement('button');
    volverButton.setAttribute("class", "btn btn-danger");
    volverButton.textContent = 'Volver al Formulario';
    volverButton.addEventListener('click', volverFormularioSubjects);
    subjectListed.appendChild(volverButton);

};

// Función para volver al formulario desde la lista de asignaturas
const volverFormularioSubjects = () => {
    const subjectsForm = document.getElementById('subjects-form');
    const subjectListed = document.getElementById('subject-list');

    // Oculta la lista de asignaturas y muestra el formulario
    subjectListed.style.display = 'none';
    subjectsForm.style.display = 'block';   
};
