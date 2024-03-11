// Array de las asignaturas más inscritas
const subjectFeatured = [];
const cantueTuitionsCost = [];

const fetchDataReports = async (url, list) => {
    try {
        list.length = 0;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar datos desde ${url}. Estado: ${response.status}`);
        const data = await response.json();
        
        // Encontrar el menor número de cupos disponibles
        const minCupos = Math.min(...data.map(asignatura => asignatura.cupos_disponibles));
        
        // Filtrar las asignaturas que tienen el menor número de cupos disponibles
        const asignaturasMenorCupos = data.filter(asignatura => asignatura.cupos_disponibles === minCupos);
        
        // Agregar las asignaturas con el menor número de cupos disponibles a la lista
        list.push(...asignaturasMenorCupos);
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
    }
};

const updateFeaturedSubject = async () => {
    const tdElement = document.getElementById('featuredSubject');
    if (!tdElement) return; // Verificar si el elemento td existe

    // Cargar los datos de asignaturas
    await fetchDataReports('http://localhost:3000/asignaturas', subjectFeatured);

    // Obtener la información de la primera asignatura destacada
    let featuredInfo = '';
    const asignatura = subjectFeatured[0]; // Acceder al primer elemento
    if (asignatura) {
        featuredInfo += `
            <strong>ID:</strong> ${asignatura.id}<br>
            <strong>Código:</strong> ${asignatura.codigo}<br>
            <strong>Cupos Disponibles:</strong> ${asignatura.cupos_disponibles}<br><br>
        `;
    }

    // Actualizar el contenido del td con la información de la primera asignatura destacada
    tdElement.innerHTML = featuredInfo;
};

// Función para calcular la cantidad de matrículas por período y el total recaudado
const calculateTuitionCosts = async () => {
    const tuitionsUrl = 'http://localhost:3000/matriculas';

    try {
        const response = await fetch(tuitionsUrl);
        if (!response.ok) throw new Error(`Error al cargar datos desde ${tuitionsUrl}. Estado: ${response.status}`);
        const tuitionData = await response.json();

        // Objeto para almacenar la cantidad de matrículas por período
        const tuitionsByPeriod = {};

        // Variable para almacenar el total recaudado
        let totalRevenue = 0;

        // Calcular la cantidad de matrículas por período y el total recaudado
        tuitionData.forEach(matricula => {
            // Verificar si ya existe una entrada para el período en el objeto tuitionsByPeriod
            if (!tuitionsByPeriod.hasOwnProperty(matricula.periodo_id)) {
                // Si no existe, inicializar la cantidad de matrículas para ese período en 1
                tuitionsByPeriod[matricula.periodo_id] = 1;
            } else {
                // Si ya existe, incrementar la cantidad de matrículas para ese período en 1
                tuitionsByPeriod[matricula.periodo_id]++;
            }

            // Sumar el precio de la matrícula al total recaudado
            totalRevenue += matricula.precio;
        });

        // Almacenar la información calculada en cantueTuitionsCost
        cantueTuitionsCost.push({
            tuitionsByPeriod: tuitionsByPeriod,
            totalRevenue: totalRevenue
        });
    } catch (error) {
        console.error(`Error al calcular los costos de matrícula: ${error.message}`);
    }
};

// Función para cargar los datos de asignaturas destacadas desde el servidor
const fetchFeaturedSubjects = async () => {
    try {
        const response = await fetch('http://localhost:3000/asignaturas');
        if (!response.ok) throw new Error(`Error al cargar datos. Estado: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
        return [];
    }
};

// Función para cargar los datos de matrículas desde el servidor
const fetchTuitionData = async () => {
    try {
        const response = await fetch('http://localhost:3000/matriculas');
        if (!response.ok) throw new Error(`Error al cargar datos. Estado: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al cargar datos: ${error.message}`);
        return [];
    }
};

// Función para actualizar el contenido de los elementos HTML
const updateElements = async () => {
    try {
        // Obtener los datos de asignaturas destacadas
        const featuredSubjects = await fetchFeaturedSubjects();
        if (featuredSubjects.length > 0) {
            const featuredSubject = featuredSubjects[0]; // Obtener la primera asignatura destacada
            const featuredSubjectElement = document.getElementById('featuredSubject');
            if (featuredSubjectElement) {
                featuredSubjectElement.innerHTML = `
                    <strong>ID:</strong> ${featuredSubject.id}<br>
                    <strong>Código:</strong> ${featuredSubject.codigo}<br>
                    <strong>Cupos Disponibles:</strong> ${featuredSubject.cupos_disponibles}<br><br>
                `;
            }
        }

        // Obtener los datos de matrículas
        const tuitionData = await fetchTuitionData();
        const tuitionInfoElement = document.getElementById('numberTuitions');
        if (tuitionInfoElement) {
            let tuitionInfo = '';
            // Calcular la cantidad de matrículas por período y el total recaudado
            const tuitionsByPeriod = {};
            let totalRevenue = 0;
            tuitionData.forEach(matricula => {
                if (!tuitionsByPeriod.hasOwnProperty(matricula.periodo_id)) {
                    tuitionsByPeriod[matricula.periodo_id] = 1;
                } else {
                    tuitionsByPeriod[matricula.periodo_id]++;
                }
                totalRevenue += matricula.precio;
            });
            // Actualizar el contenido del elemento HTML con la información de matrículas
            for (const periodo_id in tuitionsByPeriod) {
                if (tuitionsByPeriod.hasOwnProperty(periodo_id)) {
                    tuitionInfo += `Período ${periodo_id}: ${tuitionsByPeriod[periodo_id]} matrículas<br>`;
                }
            }
            tuitionInfo += `Total recaudado: ${totalRevenue}<br><br>`;
            tuitionInfoElement.innerHTML = tuitionInfo;
        }
    } catch (error) {
        console.error(`Error al actualizar elementos: ${error.message}`);
    }
};

// Llamar a la función para actualizar los elementos cada 5 segundos (5000 milisegundos)
setInterval(updateElements, 5000);


// Llamar a la función para calcular los costos de matrícula
calculateTuitionCosts();

// Actualizar la información cada 5 segundos (5000 milisegundos)
setInterval(updateFeaturedSubject, 5000);

const updateNumberTuitions = () => {
    const tdElement = document.getElementById('numberTuitions');
    if (!tdElement) return; // Verificar si el elemento td existe

    // Obtener la información de matrículas de la lista cantueTuitionsCost
    let tuitionInfo = '';
    cantueTuitionsCost.forEach(info => {
        for (const periodo_id in info.tuitionsByPeriod) {
            if (info.tuitionsByPeriod.hasOwnProperty(periodo_id)) {
                tuitionInfo += `Período ${periodo_id}: ${info.tuitionsByPeriod[periodo_id]} matrículas<br>`;
            }
        }
        tuitionInfo += `Total recaudado: ${info.totalRevenue}<br><br>`;
    });

    // Actualizar el contenido del td con la información de matrículas
    tdElement.innerHTML = tuitionInfo;
};

// Llamar a la función para actualizar la información de matrículas
updateNumberTuitions();

// Actualizar la información cada 5 segundos (5000 milisegundos)
setInterval(updateNumberTuitions, 5000);
