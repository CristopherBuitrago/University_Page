// Definimos arrays para almacenar las tarifas y los programas
const ratesArray = [];
const programsArray = [];
// Función genérica para cargar datos desde una URL y almacenarlos en el array especificado
const loadData = async (url, dataArray) => {
    try {
        const response = await fetch(url); // Hacemos la petición a la URL proporcionada

        if (!response.ok) {
            throw new Error(`Error at the moment to load data from ${url}. Status: ${response.status}`);
        }

        const data = await response.json();
        dataArray.length = 0; // Limpiamos el array
        dataArray.push(...data); // Añadimos los datos al array

    } catch (error) {
        console.error(`Error loading data from ${url}:`, error);
    }
};
// Función para cargar la información de las tarifas en la tabla
const loadInfoRates = () => {
    const info = document.getElementById("info-rates");
    ratesArray.forEach(rate => {
        const program = programsArray.find(p => Number(p.id) === Number(rate.programa_id)) || { nombre: "Programa no encontrado" };
        const row = `<tr class="table-primary">
            <td>${rate.id}</td>
            <td>${rate.costo_credito}</td>
            <td>${rate.periodo_id}</td>
            <td>${program.nombre}</td>
        </tr>`;
        info.innerHTML += row; // Añadimos la fila a la tabla
    });
};

// Función para inicializar la carga de datos y mostrarlos en la tabla
const init = async () => {
    await loadData('http://localhost:3000/tarifas', ratesArray);
    await loadData('http://localhost:3000/programas', programsArray);
    loadInfoRates(); // Cargamos la información de las tarifas en la tabla
};

// Evento que se dispara cuando el contenido del DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", init);
