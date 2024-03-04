// dowload info
const classroomArray = [];

const loadClassrooms = async () => {

    try {
        classroomArray.length = 0;
        const response = await fetch('http://localhost:3000/salones');

        if (!response.ok) {
            throw new Error('Error at the moment to load classrooms. Status: ', response.status);
        }
        const classrooms = await response.json();
        classroomArray.push(...classrooms);

    } catch (error) {
        console.error("Error at the moment to load classrooms: ", error.message);
    }
}


const loadInfoTable = async () => {

    const info = document.getElementById("info-classrooms");

    for (let i of classroomArray) {
        const id = i.id;
        const capacity = i.capacidad_alumnos;
        const build = i.edificio;
        const floor = i.piso;
        const code = i.numero_identificacion;

        // create new row
        const row = document.createElement("tr");
        row.classList.add("table-primary");

        // create id cell for de row
        const idCell = document.createElement("td");
        idCell.textContent = id;
        row.appendChild(idCell);

        // create capacity cell for the row
        const capacityCell = document.createElement("td");
        capacityCell.textContent = capacity;
        row.appendChild(capacityCell);
        
        // create build cell for the row
        const buildCell = document.createElement("td");
        buildCell.textContent = build;
        row.appendChild(buildCell);

        // create floor cell for the row
        const floorCell = document.createElement("td");
        floorCell.textContent = floor;
        row.appendChild(floorCell);

        // create code cell for the row
        const codeCell = document.createElement("td");
        codeCell.textContent = code;
        row.appendChild(codeCell);

        // Append the row to the table
        info.appendChild(row)
    }
    
    
}

const loadDataTable=async()=>{
    loadInfoTable();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadClassrooms();
    await loadDataTable();
})

console.log(classroomArray);