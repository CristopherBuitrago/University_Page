//! Array donde se almacenarán los periodos cargados desde el servidor.
const periodsArray = [];

//! Función asincrónica para cargar los periodos desde el servidor.
const loadPeriods = async () => {
    try {
        // Se realiza una solicitud fetch para obtener los periodos.
        const response = await fetch('http://localhost:3000/periodos');
        
        // Se verifica si la respuesta fue exitosa.
        if (!response.ok) throw new Error(`Error al cargar los periodos. Estado: ${response.status}`);
        
        // Se limpia el array antes de añadir nuevos elementos.
        periodsArray.length = 0;
        
        // Se obtiene el cuerpo de la respuesta y se agrega al array periodsArray.
        periodsArray.push(...await response.json());
    } catch (error) {
        // Se manejan los errores mostrando un mensaje en la consola.
        console.error("Error al cargar los periodos: ", error.message);
    }
}

//! Función para cargar la información de los periodos en la tabla HTML.
const loadInfoPeriods = () => {
    // Se obtiene el elemento de la tabla donde se mostrará la información.
    const info = document.getElementById("info-period");
    
    // Se itera sobre los periodos en periodsArray y se crea una fila para cada uno.
    periodsArray.forEach(({id, codigo, ano, semestre}) => {
        // Se crea una nueva fila en la tabla.
        const row = document.createElement("tr");
        row.classList.add("table-primary");
        
        // Se itera sobre los datos de cada periodo y se crean las celdas correspondientes en la fila.
        [id, codigo, ano, semestre].forEach(data => {
            const cell = document.createElement("td");
            cell.textContent = data;
            row.appendChild(cell);
        });
        
        // Se agrega la fila a la tabla.
        info.appendChild(row);
    });
}

//! Función principal para cargar los datos de los periodos.
const loadDataPeriods = async () => {
    // Se espera a que se carguen los periodos desde el servidor.
    await loadPeriods();
    
    // Se carga la información de los periodos en la tabla HTML.
    loadInfoPeriods();
}

//! Se añade un evento que se dispara cuando el contenido HTML ha sido completamente cargado.
document.addEventListener("DOMContentLoaded", loadDataPeriods);

//! Se imprime el array de periodos en la consola para propósitos de depuración.
console.log(periodsArray);
