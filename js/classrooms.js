//! Array para almacenar los salones cargados
const classroomArray = [];

//! Función asincrónica para cargar los salones desde la API
const loadClassrooms = async () => {
    try {
        // Se hace una solicitud a la API para obtener los salones
        const response = await fetch('http://localhost:3000/salones');
        // Si la respuesta no es exitosa, se lanza un error
        if (!response.ok) {
            throw new Error('Error al cargar los salones. Estado: ', response.status);
        }
        // Se agregan los salones al array
        classroomArray.push(...(await response.json()));
    } catch (error) {
        // En caso de error, se muestra en la consola
        console.error("Error al cargar los salones: ", error.message);
    }
}

//! Función asincrónica para cargar la información de los salones en la tabla
const loadInfoTable = async () => {
    const info = document.getElementById("info-classrooms");
    // Se itera sobre cada salón en el array y se crea una fila en la tabla con la información correspondiente
    for (let {id, capacidad_alumnos: capacity, edificio: build, piso: floor, numero_identificacion: code} of classroomArray) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${id}</td><td>${capacity}</td><td>${build}</td><td>${floor}</td><td>${code}</td>`;
        info.appendChild(row);
    }
}

//! Se espera a que el DOM esté completamente cargado antes de ejecutar la carga de los salones y la información en la tabla
document.addEventListener("DOMContentLoaded", async () => {
    await loadClassrooms();
    await loadInfoTable();
});