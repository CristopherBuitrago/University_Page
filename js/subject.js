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
        if (!response.ok) {
            throw new Error(`Error al cargar datos desde ${url}. Estado: ${response.status}`);
        }
        const data = await response.json();
        list.push(...data);

        console.log(list)
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
    }
};

// Funciones para cargar estudiantes y programas
const loadSubjects = async () => {
    await fetchDataSubjects('http://localhost:3000/asignaturas', subjectArray);
};

const loadPeriods = async () => {
    await fetchDataSubjects('http://localhost:3000/periodos', periodsArray);
};

const loadCourses = async () => {
    await fetchDataSubjects('http://localhost:3000/cursos', coursesArray);
};

const loadClassrooms = async () => {
    await fetchDataSubjects('http://localhost:3000/salones', classroomsArray);
};

// Función para generar las opciones del menú desplegable de programas
const generatePeriods = () => {
    return periodsArray.map(period => `<option>${period.codigo}</option>`).join('');
};

const generateCourses = () => {
    return coursesArray.map(course => `<option>${course.nombre}</option>`).join('');
};

const generateTeachers = () => {
    return teachersList.map( teacher => `<option>${teacher.nombre}</option>`).join('');
};

const generateClassRooms = () => {
    return classroomsArray.map( classroom => `<option>${classroom.numero_identificacion}</option>`).join('');
};

// Función para cargar el formulario al cargar la página
const loadSubjectsForm = () => {
    const subjectForm = document.getElementById('subjects-form');
    const subjectsListed = document.getElementById('subjects-list');

    // Oculta la lista de estudiantes al cargar el formulario
    subjectsListed.style.display = 'none';
    
    // Extraemos los nombres de los cursos
    const coursesNames = [];
    
    for (let course of coursesArray) {
        let name = course.nombre;
        coursesNames.push(name);
    }

    console.log(`Nombre de los cursos: ${coursesNames}`)

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

        <!-- profesor -->
        <div class="mb-3 row">
            <label for="teachers" class="col-4 col-form-label">Profesores</label>
            <div class="col-8">
                <select class="form-select" id="teachers" required>
                    <option selected>Seleccionar</option>
                    ${generateTeachers()}
                </select>
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
        <button type="button" class="btn btn-success mt-3" id="agregarSesion" onclick="createSubject()">Agregar Asignatura</button>
        <button class="btn btn-danger mt-3" type="button" onclick="showListSubjects()">Ver asignaturas</button>
        </div>

        </div>
        </div>

        </form>
    `;
};

// Funcion para guardar una asignatura
// Función para guardar un nuevo estudiante
const saveSubject = async (newSubject) => {
    try {
        const response = await fetch('http://localhost:3000/asignaturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSubject),
        });

        if (!response.ok) {
            throw new Error(`Error al crear la asignatura. Estado: ${response.status}`);
        }
        const subjectCreated = await response.json();
        console.log('asignatura creada:', subjectCreated);
    } catch (error) {
        console.error(`Error al crear la asignatura: ${error.message}`);
    }
};

// Función para crear asignatura
const createSubject = async () => {
    let period = document.getElementById('period').value;
    let course = document.getElementById('courses').value;
    let credit = document.getElementById('credits').value;
    let teacher = document.getElementById('teachers').value;
    let program = document.getElementById('programs').value;
    let day = document.getElementById('dia').value;
    let begin = document.getElementById('hora_inicio').value;
    let end = document.getElementById('hora_fin').value;
    let classRoom = document.getElementById('salon').value;

    const scheedule = {
        dia: day,
        hora_inicio: begin,
        hora_fin: end,
        salon_id: classRoom
    }

    const newSubject = {
        id: subjectArray.length + 1,
        curso_id: course,
        codigo: `${course.codigo}-${period.codigo}`,
        creditos: credit,
        profesor_id: teacher,
        cupos_disponibles: 20,
        programa_id: program,
        horario_clases: [scheedule],
    }

    await saveSubject(newSubject);
    await loadSubjects();

    // Restablecer los valores de los elementos del formulario
    document.getElementById('period').value = "";
    document.getElementById('courses').value = "";
    document.getElementById('credits').value = "";
    document.getElementById('teachers').value = "";
    document.getElementById('programs').value = "";
    document.getElementById('dia').value = "";
    document.getElementById('hora_inicio').value = "";
    document.getElementById('hora_fin').value = "";
    document.getElementById('salon').value = "";

    alert('¡Asignatura creada con éxito!');
    console.log(newSubject);
    return newSubject;
}
