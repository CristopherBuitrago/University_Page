const tuitionsArray = [];
const ratesArray = [];

const loadTuitions = async () => {
    try {

        const response = await fetch('http://localhost:3000/matriculas');

        if (!response.ok) {
            throw new Error('Error al cargar matriculas. Estado: ', response.status);
        }
        const tuitions = await response.json();
        tuitionsArray.push(...tuitions);

    } catch (error) {
        console.error("Error al cargar matriculas", error.message);
    }
}

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
            throw new Error('Error al crear el matricula. Estado: ', response.status);
        }
        const tuitionCreated = await response.json();

        console.log('Producto creado:', tuitionCreated);

    } catch (error) {
        console.error("Error al cargar matricula", error.message);
    }
}




const actualizateStudentsTuitions = () => {
    const studentSelect = document.getElementById('studentTuition');
    studentSelect.innerHTML = '';
    const studentsOptions = generateStudentsOptions();
    studentSelect.innerHTML = studentsOptions;
}

const actualizateSubjectsTuitions = () => {
    const subjectSelect = document.getElementById('subjectTuition');
    subjectSelect.innerHTML = '';
    const subjectsOptions = generateSubjectsOptions();
    subjectSelect.innerHTML = subjectsOptions;
}

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
                <h3>Asignaturas escogidas:</h3>
                <hr>
                <ul id="items-list"></ul>

            <button class="btn btn-success mt-3" type="button" onclick="crearFactura()">Crear matricula</button>
            <button class="btn btn-danger mt-3" type="button" onclick="showTuitions()">Ver matriculas</button>
        </form>
    `;

    const tuitionsList = document.getElementById('tuitions-list');
    tuitionsList.style.display = 'none';

}

const generateStudentsOptions = () => {
    let options = '';
    for (const student of studentsList) {
        options += `<option value="${student.id}">${student.nombre}</option>`;
    }
    return options;

}

const generateSubjectsOptions = () => {
    let options = '';
    for (const subject of subjectArray) {
        options += `<option value="${subject.id}">${subject.codigo}</option>`;
    }
    return options;

}

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


const addSubject = () => {
    const subjectSelect = document.getElementById('subjectTuition');
    const itemsList = document.getElementById('items-list');

    if (subjectSelect.selectedIndex === -1) {
        console.error('No se ha seleccionado ningún tema.');
        return;
    }

    const subjectSelectedIndex = subjectSelect.selectedIndex;
    const subjectSelected = subjectArray[subjectSelectedIndex];
    const program_id = subjectSelected.programa_id;
    const period_id = subjectSelected.periodo_id;
    const credits = subjectSelected.creditos;

    let credit_cost = ratesArray.find(rate => { if (rate.periodo_id === period_id && rate.programa_id === program_id) { return Number(rate.costo_credito) } });

    if (credit_cost) {
        credit_cost = credit_cost.costo_credito;
    } else {
        alert("No se ha elegido ninguna opción")
        return;
    }

    const pasivo = [];
    const subtotal = credits * credit_cost;

    pasivo.push(subtotal);

    const total = match.sum(pasivo)



    // Obtener los horarios de las asignaturas ya agregadas
    const existingSchedules = Array.from(itemsList.getElementsByClassName('schedule-row')).map(row => JSON.parse(row.dataset.schedule));

    // Mostrar el horario de la asignatura
    const horarioAsignatura = showScheedulesSubject(subjectSelected.horario_clases);

    // Verificar si hay superposición de horarios
    if (checkScheduleOverlap(subjectSelected.horario_clases, existingSchedules)) {
        alert('¡Hay superposición de horarios! No se puede agregar esta asignatura.');
        return;
    }

    const li = document.createElement('li');
    li.textContent = `${subjectSelected.codigo} - Total a pagar: ${subtotal}`;
    itemsList.appendChild(li);

    // Agregar el horario de la asignatura a la lista de elementos
    const row = document.createElement('tr');
    row.classList.add('schedule-row');
    row.dataset.schedule = JSON.stringify(subjectSelected.horario_clases);
    row.appendChild(horarioAsignatura);
    itemsList.appendChild(row);

    subjectSelect.selectedIndex = -1;
};



const crearFactura = () => {
    const studentSelected = document.getElementById('studentTuition');
    const itemsList = document.getElementById('items-list');

    const fecha = fechaInput.value;
    const clienteId = studentSelected.value;
    const itemsFactura = [];
    let totalFactura = 0;

    for (const li of itemsList.getElementsByTagName('li')) {
        itemsFactura.push(li.textContent);
        const cantidadMatch = li.textContent.match(/Cantidad: (\d+)/);
        const subtotalMatch = li.textContent.match(/Subtotal: (\d+)/);

        if (cantidadMatch && subtotalMatch) {
            const cantidad = parseInt(cantidadMatch[1]);
            const subtotal = parseInt(subtotalMatch[1]);
            totalFactura += subtotal;
        }

    }

    if (!fecha || !clienteId || itemsFactura.length === 0) {
        alert('Por favor, completa todos los campos y agrega al menos un item de la factura.');
        return;
    }

    const cliente = listaClientes.find(c => c.id === clienteId);


    const nuevaFactura = {
        id: tuitionsArray.length + 1,
        fecha: fecha,
        cliente: cliente,
        items: itemsFactura,
        total: totalFactura
    };


    tuitionsArray.push(nuevaFactura);
    saveTuition(nuevaFactura);

    console.log("Factura creada ", nuevaFactura);
    console.log("Listado de facturas:", tuitionsArray);

    fechaInput.value = '';
    studentSelected.selectedIndex = 0;
    itemsList.innerHTML = '';

    alert(`Factura creada con éxito! Total: ${totalFactura}`);

}

const showTuitions = () => {
    const tuitionsForm = document.getElementById('tuitions-form');
    const listadoFacturas = document.getElementById('tuitions-list');

    // Ocultar formulario de facturas
    tuitionsForm.style.display = 'none';

    // Mostrar listado de facturas
    listadoFacturas.style.display = 'block';

    // Crear una lista (ul) para mostrar las facturas
    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    ul.style.padding = '0';

    // Recorrer la lista de facturas y agregar cada factura como un elemento de lista (li)
    for (const factura of tuitionsArray) {
        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        li.style.borderBottom = '1px solid #ccc';
        li.style.paddingBottom = '10px';


        const fecha = factura.fecha;

        const fechaCliente = document.createElement('div');
        fechaCliente.style.fontWeight = 'bold';
        fechaCliente.textContent = `Fecha: ${fecha}, Cliente: ${factura.cliente.nombre}, Total: ${factura.total}`;
        li.appendChild(fechaCliente);

        const itemsUl = document.createElement('ul');
        itemsUl.style.listStyleType = 'none';
        itemsUl.style.padding = '0';

        // Recorrer los items de la factura y agregar cada item como un elemento de lista (li)
        for (const item of factura.items) {
            const itemLi = document.createElement('li');
            itemLi.textContent = `Producto: ${item}`;
            itemsUl.appendChild(itemLi);
        }

        li.appendChild(itemsUl);
        ul.appendChild(li);
    }

    // Limpiar el contenido anterior del contenedor de listado de facturas
    listadoFacturas.innerHTML = '';

    // Agregar la lista al contenedor
    listadoFacturas.appendChild(ul);

    // Agregar botón para volver al formulario de facturas
    const volverButton = document.createElement('button');
    volverButton.textContent = 'Volver al Formulario de Facturas';
    volverButton.addEventListener('click', volverAlFormularioFacturas);
    listadoFacturas.appendChild(volverButton);

}

const volverAlFormularioFacturas = () => {
    const tuitionsForm = document.getElementById('tuitions-form');
    const listadoFacturas = document.getElementById('tuitions-list');

    // Ocultar listado de facturas
    listadoFacturas.style.display = 'none';

    // Mostrar formulario de facturas
    tuitionsForm.style.display = 'block';


}