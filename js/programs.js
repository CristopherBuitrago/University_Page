//!  Define un arreglo vacío para almacenar los programas cargados desde la API.
const programsArray = [];

//! Función asíncrona para cargar programas desde una API.
const loadPrograms = async () => {
    try {
        // Intenta hacer una solicitud fetch a una URL específica.
        const response = await fetch('http://localhost:3000/programas');
        // Verifica si la respuesta no es exitosa y lanza un error si es necesario.
        if (!response.ok) {
            throw new Error('Error at the moment to load programs. Status: ', response.status);
        }
        // Convierte la respuesta de la API a formato JSON.
        const programs = await response.json();
        // Añade los programas cargados al arreglo definido previamente.
        programsArray.push(...programs);
        // Imprimimos la información de la lista
        console.log(programsArray);
    } catch (error) {
        // Captura cualquier error que ocurra durante la solicitud o procesamiento de datos y lo imprime en la consola.
        console.error("Error at the moment to load programs: ", error.message);
    }
}

//! Función para cargar y mostrar la información de los programas en el DOM.
const loadInfoPrograms = () => {
    // Obtiene el elemento del DOM donde se mostrará la información de los programas.
    const info = document.getElementById("info-program");

    //todo: Crea filas de tabla para cada programa usando los datos del arreglo programsArray.
    const rows = programsArray.map(({ id, nombre, nivel }) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        const cells = [id, nombre, nivel].map(data => {
            const cell = document.createElement("td");
            cell.textContent = data;
            return cell;
        });
        cells.forEach(cell => row.appendChild(cell));
        return row;
    });
    // Añade cada fila creada al elemento del DOM para mostrar la información.
    rows.forEach(row => info.appendChild(row));
}

//! Función envoltorio que simplemente llama a loadInfoPrograms. 
const loadDataPrograms = async () => {
    loadInfoPrograms();
}

//! Event listener que espera a que el contenido del DOM esté cargado para ejecutar las funciones de carga de programas.
document.addEventListener("DOMContentLoaded", async () => { 
    await loadPrograms();
    await loadDataPrograms();
})