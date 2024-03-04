//! Array para almacenar información de departamentos
const departamentArray = [];

//! Función para cargar los departamentos desde el servidor
const loadDepartaments = async () => {
    try {
        // Realizar la petición GET a la URL del servidor
        const response = await fetch('http://localhost:3000/departamentos');
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al cargar los departamentos. Estado: ' + response.status);
        }
        // Vaciar el array de departamentos antes de actualizarlo
        departamentArray.length = 0;
        // Actualizar el array con los datos obtenidos de la respuesta JSON
        departamentArray.push(...await response.json());
    } catch (error) {
        // Manejar cualquier error ocurrido durante la carga de los departamentos
        console.error("Error al cargar los departamentos: ", error.message);
    }
}

//! Función para crear una celda de una tabla con un contenido dado
const createCell = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
}

//! Función para cargar la información de los departamentos en una tabla HTML
const loadInfoTable = async () => {
    const info = document.getElementById("info-table");
    info.innerHTML = ''; // Limpiar el contenido previo de la tabla
    // Mapear cada departamento en el array para crear filas en la tabla
    departamentArray.map(({ id, nombre }) => {
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        row.appendChild(createCell(id)); // Agregar una celda con el ID del departamento
        row.appendChild(createCell(nombre)); // Agregar una celda con el nombre del departamento
        info.appendChild(row); // Agregar la fila a la tabla
    });
}

//! Función para cargar los datos en la tabla
const loadDataTable = async () => {
    await loadInfoTable();
}

//! Evento que se dispara cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Cargar los departamentos al inicio
    await loadDepartaments();
    // Cargar los datos en la tabla
    await loadDataTable();
});

//! Imprimir el array de departamentos en la consola (para propósitos de depuración)
console.log(departamentArray);
