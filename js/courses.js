//! Definir un array vacío para almacenar los cursos
const coursesArray = [];

//! Función asincrónica para cargar los cursos desde una URL
const loadCourses = async () => {
    try {
        // Limpiar el array de cursos antes de cargar nuevos datos
        coursesArray.length = 0;
        // Realizar una solicitud de red para obtener los cursos
        const response = await fetch('http://localhost:3000/cursos');

        // Si la respuesta no es exitosa, lanzar un error
        if (!response.ok) {
            throw new Error('Error al cargar los cursos. Estado: ', response.status);
        }
        // Convertir la respuesta a formato JSON
        const courses = await response.json();
        // Agregar los cursos al array
        coursesArray.push(...courses);
    } catch (error) {
        // Manejar cualquier error ocurrido durante la carga de los cursos
        console.error("Error al cargar los cursos: ", error.message);
    }
}

//! Función para cargar la información de los cursos en una tabla HTML
const loadInfoTable = () => {
    // Obtener el elemento de la tabla donde se mostrará la información de los cursos
    const info = document.getElementById("info-courses");
    // Iterar sobre cada curso en el array
    coursesArray.forEach(({ id, nombre: name, codigo: code, guia_catedra: guide }) => {
        // Crear una fila para cada curso
        const row = document.createElement("tr");
        row.classList.add("table-primary");

        // Iterar sobre los datos de cada curso e insertarlos en celdas de la fila
        [id, name, code, guide].forEach(content => {
            const cell = document.createElement("td");
            cell.textContent = content;
            row.appendChild(cell);
        });

        // Agregar la fila a la tabla
        info.appendChild(row);
    });
}

//! Función para cargar los datos de la tabla
const loadDataTable = () => {
    // Llamar a la función para cargar la información de los cursos en la tabla
    loadInfoTable();
}

//! Evento que se dispara cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Esperar a que se carguen los cursos antes de cargar la tabla
    await loadCourses();
    loadDataTable();
});

//! Imprimir el array de cursos en la consola
console.log(coursesArray);