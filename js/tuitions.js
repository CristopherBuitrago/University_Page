// Arreglos para almacenar datos de matrículas y tarifas
const tuitionsArray = [];
const ratesArray = [];

// Función para cargar matrículas desde la API
const loadTuitions = async () => {
    try {
        const response = await fetch('http://localhost:3000/matriculas');
        if (!response.ok) {
            throw new Error('Error al cargar matrículas. Estado: ', response.status);
        }
        const tuitions = await response.json();
        tuitionsArray.push(...tuitions);
    } catch (error) {
        console.error("Error al cargar matrículas", error.message);
    }
}

// Función para cargar tarifas desde la API
const loadRates = async () => {
    try {
        const response = await fetch('http://localhost:3000/tarifas');
        if (!response.ok) {
            throw new Error('Error al cargar tarifas. Estado: ', response.status);
        }
        const rates = await response.json();
        ratesArray.push(...rates);
        console.log(ratesArray)
    } catch (error) {
        console.error("Error al cargar tarifas", error.message);
    }
}

// Función para guardar nueva matrícula en la API
const saveTuition = async (newTuition) => {
    try {
        const response = await fetch('http://localhost:3000/matriculas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTuition),
        });
        if (!response.ok) {
            throw new Error('Error al crear la matrícula. Estado: ', response.status);
        }
        const tuitionCreated = await response.json();
        console.log('Matrícula creada:', tuitionCreated);
    } catch (error) {
        console.error("Error al cargar matrícula", error.message);
    }
}

// Función para actualizar lista de estudiantes en el formulario
const actualizateStudentsTuitions = () => {
    const studentSelect = document.getElementById('studentTuition');
    studentSelect.innerHTML = '';
    const studentsOptions = generateStudentsOptions();
    studentSelect.innerHTML = studentsOptions;
}

// Función para actualizar lista de asignaturas en el formulario
const actualizateSubjectsTuitions = () => {
    const subjectSelect = document.getElementById('subjectTuition');
    subjectSelect.innerHTML = '';
    const subjectsOptions = generateSubjectsOptions();
    subjectSelect.innerHTML = subjectsOptions;
}

// Función para cargar formulario de matrículas
const loadTuitionsForm = () => {
    const tuitionsForm = document.getElementById('tuitions-form');
    tuitionsForm.innerHTML = `
        <form>
            <div class="mb-3 row">
                <label class="col-4 col-form-label" for="studentTuition">Estudiante:</label>
                <div class="col-8"> 
                    <select class="form-select" id="studentTuition" required>
                        ${generateStudentsOptions()}
                    </select>
                </div>
            </div>

            <div class="mb-3 row">
                <label class="col-4 col-form-label" for="subjectTuition">Asignatura:</label>
                <div class="col-8"> 
                    <select class="form-select" id="subjectTuition" required>
                        ${generateSubjectsOptions()}
                    </select>
                </div>
            </div>
                <button class="btn btn-success mt-3" type="button" onclick="addSubject()">Agregar Asignatura</button>
                <hr>
                <h3>Matrículas escogidas:</h3>
                <hr>
                <ul id="items-list"></ul>

            <button class="btn btn-success mt-3" type="button" onclick="createTuition()">Crear matrícula</button>
            <button class="btn btn-danger mt-3" type="button" onclick="showTuitions()">Ver matrículas</button>
        </form>
    `;

    const tuitionsList = document.getElementById('tuitions-list');
    tuitionsList.style.display = 'none';

}

// Función para generar opciones de estudiantes en el formulario
const generateStudentsOptions = () => {
    let options = '';
    for (const student of studentsList) {
        options += `<option value="${student.id}">${student.nombre}</option>`;
    }
    return options;

}

// Función para generar opciones de asignaturas en el formulario
const generateSubjectsOptions = () => {
    let options = '';
    for (const subject of subjectArray) {
        options += `<option value="${subject.id}">${subject.codigo}</option>`;
    }
    return options;

}

// Función para mostrar horarios de asignaturas
const showScheedulesSubject = (horarioClases) => {
    const table = document.createElement('table');
    table.classList.add("table", "table-striped", "table-hover", "table-borderless", "table-primary", "align-middle");

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    tbody.classList.add('table-group-divider');

    const headerRow = document.createElement('tr');
    headerRow.classList.add("table-light");

    const headers = ['Día', 'Hora de inicio', 'Hora de fin', 'Salón'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        header.scope = "col";
        header.classList.add("text-center");
        headerRow.appendChild(header);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    horarioClases.forEach(horario => {
        const row = document.createElement('tr');
        row.classList.add("table-primary");
        const cells = [horario.dia, horario.hora_inicio, horario.hora_fin, horario.salon_id];

        cells.forEach(cellText => {
            const cell = document.createElement('td');
            cell.textContent = cellText;
            cell.classList.add("text-center");
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    return table;
};

// Función para verificar superposición de horarios
const checkScheduleOverlap = (newSchedule, existingSchedules) => {
    for (const existingSchedule of existingSchedules) {
        for (const newClass of newSchedule) {
            for (const existingClass of existingSchedule) {
                // Verificar si hay superposición en los días y horas de inicio y fin
                if (newClass.dia === existingClass.dia &&
                    ((newClass.hora_inicio >= existingClass.hora_inicio && newClass.hora_inicio < existingClass.hora_fin) ||
                        (newClass.hora_fin > existingClass.hora_inicio && newClass.hora_fin <= existingClass.hora_fin))) {
                    return true; // Hay superposición
                }
            }
        }
    }
    return false; // No hay superposición
};

// Arreglo para almacenar valores de pasivos
const pasivo = [];
// Arreglo para almacenar asignaturas agregadas
const subjectsAdd = [];
let period = 0;
let total = 0;

// Función para agregar asignatura al formulario de matrículas
const addSubject = () => {
    const subjectSelect = document.getElementById('subjectTuition');
    const itemsList = document.getElementById('items-list');

    if (subjectSelect.selectedIndex === -1) {
        alert('No se ha seleccionado ningún tema.');
        return;
    }

    const subjectSelectedIndex = subjectSelect.selectedIndex;
    const subjectSelected = subjectArray[subjectSelectedIndex];
    const id_subject = Number(subjectSelected.id);
    const program_id = subjectSelected.programa_id;
    const period_id = subjectSelected.periodo_id;
    const credits = subjectSelected.creditos;

    period = period_id;

    let credit_cost = ratesArray.find(rate => { if (rate.periodo_id === period_id && rate.programa_id === program_id) { return Number(rate.costo_credito) } });

    if (credit_cost) {
        credit_cost = credit_cost.costo_credito;
    } else {
        alert("No se ha elegido ninguna opción")
        return;
    }

    const subtotal = credits * credit_cost;
    subjectsAdd.push(id_subject);

    // Obtener los horarios de las matrículas ya agregadas
    const existingSchedules = Array.from(itemsList.getElementsByClassName('schedule-table')).map(row => JSON.parse(row.dataset.schedule));

    // Mostrar el horario de la asignatura
    const horarioAsignatura = showScheedulesSubject(subjectSelected.horario_clases);

    // Verificar si hay superposición de horarios
    if (checkScheduleOverlap(subjectSelected.horario_clases, existingSchedules)) {
        alert('¡Hay superposición de horarios! No se puede agregar esta asignatura.');
        return;
    }

    // Agregar el subtotal a pasivo
    pasivo.push(subtotal);

    // Calcular el total sumando todos los elementos en pasivo
    total = pasivo.reduce((accumulator, currentValue) => accumulator + currentValue, 0);


    const li = document.createElement('li');
    li.textContent = `Asignatura: ${subjectSelected.codigo} - subtotal: ${subtotal} - Total: ${total}`;
    itemsList.appendChild(li);

    // Agregar el horario de la asignatura a la lista de elementos
    const table = document.createElement('div');
    table.classList.add('schedule-table', 'container');
    table.dataset.schedule = JSON.stringify(subjectSelected.horario_clases);
    table.appendChild(horarioAsignatura);
    itemsList.appendChild(table);

    subjectSelect.selectedIndex = -1;


};

//crear nueva matricula
const createTuition = () => {
    // Verificar si se ha seleccionado un estudiante y al menos una asignatura
    const studentSelect = document.getElementById('studentTuition');
    const studentSelectedIndex = studentSelect.selectedIndex;
    if (studentSelectedIndex === -1) {
        alert("Por favor seleccione un estudiante.");
        return;
    }

    if (subjectsAdd.length === 0) {
        alert("Por favor agregue al menos una asignatura.");
        return;
    }

    // La lista de pasivos queda limpia
    pasivo.length = 0;

    // Obtenemos el id del estudiante y de las asignaturas
    const selectedStudent = studentsList[studentSelectedIndex];
    const idStudent = Number(selectedStudent.id);

    // Crear un objeto de matriculas
    const newTuition = {
        id: tuitionsArray.length + 1,
        estudiante_id: idStudent,
        asignatura_id: subjectsAdd,
        periodo_id: period,
        precio: total
    };

    // Imprimimos en la consola para ver los resultados esperados   
    saveTuition(newTuition);
    alert("Matricula creada con éxito");

    // El total vuelve a ser 0
    total.length = 0;
}

// Función para crear celda de tabla con contenido
const createCellTuition = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
};

// Función para mostrar lista de matrículas
const showTuitions = async () => {
    await loadTuitions();
    const tuitionsForm = document.getElementById('tuitions-form');
    const tuitionListed = document.getElementById('tuitions-list');

    // Oculta el formulario y muestra la lista de matrículas
    tuitionsForm.style.display = 'none';
    tuitionListed.style.display = 'block';

    // Crea la estructura de la tabla para mostrar la lista de matrículas
    tuitionListed.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover table-borderless table-primary align-middle">
                <thead class="table-light">
                    <caption>Matrículas</caption>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Asignaturas</th>
                        <th>Periodo</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider" id="info-tuition"></tbody>
            </table>
        </div>
    `;
    // Llena la tabla con los datos de los matrículas
    tuitionsArray.forEach(({ id, estudiante_id, asignatura_id, periodo_id, precio }) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        [id, estudiante_id, asignatura_id, periodo_id, precio].forEach(content => {
            row.appendChild(createCellTuition(content));
        });
        document.getElementById("info-tuition").appendChild(row);
    });

    // Agrega un botón para volver al formulario
    const volverButton = document.createElement('button');
    volverButton.setAttribute("class", "btn btn-danger");
    volverButton.textContent = 'Volver al Formulario';
    volverButton.addEventListener('click', volverAlFormularioMatriculas);
    tuitionListed.appendChild(volverButton);

};

// Función para volver al formulario de matrículas
const volverAlFormularioMatriculas = () => {
    const tuitionsForm = document.getElementById('tuitions-form');
    const listadoFacturas = document.getElementById('tuitions-list');

    // Ocultar listado de facturas
    listadoFacturas.style.display = 'none';

    // Mostrar formulario de facturas
    tuitionsForm.style.display = 'block';
}

