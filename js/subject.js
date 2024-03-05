// Definimos arrays para almacenar las asignaturas y los periodos
const subjectArray = [];
const periodsArray = [];
const coursesArray = [];

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


// Función para generar las opciones del menú desplegable de programas
const generatePeriods = () => {
    return periodsArray.map(period => `<option>${period.codigo}</option>`).join('');
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
            <label for="course" class="col-4 col-form-label">Curso</label>
            <div class="col-7">
                <input type="text" class="form-control" id="course" placeholder="Buscar..." required />
            </div>
            <button class=" col-9 btn btn-primary" id="search"><i class='bx bx-search bx-tada'></i></button>
        </div>
        </div>

            <button class="btn btn-danger" class="col-2 col-form-label" type="button" onclick="showList()">Ver Listado de estudiantes</button>
            <button class="btn btn-primary" class="col-6 col-form-label" type="button" onclick="createStudent()">Crear Estudiante</button>
            
        </form>
    `;
};


