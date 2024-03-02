// dowload info
const programsArray = [];

const loadPrograms = async () => {

    try {
        programsArray.length = 0;
        const response = await fetch('http://localhost:3000/programas');

        if (!response.ok) {
            throw new Error('Error at the moment to load programs. Status: ', response.status);
        }
        const programs = await response.json();
        programsArray.push(...programs);

    } catch (error) {
        console.error("Error at the moment to load programs: ", error.message);
    }
}


const loadInfoPrograms = () => {

    const info = document.getElementById("info-program");

    for (let i of programsArray) {
        const id = i.id;
        const name = i.nombre;
        const level = i.nivel;

        // create new row
        const row = document.createElement("tr");
        row.classList.add("table-primary");

        // create id cell for de row
        const idCell = document.createElement("td");
        idCell.textContent = id;
        row.appendChild(idCell);

        // create name cell for the row
        const nameCell = document.createElement("td");
        nameCell.textContent = name;
        row.appendChild(nameCell);

        // create level cell for the row
        const levelCell = document.createElement("td");
        levelCell.textContent = level;
        row.appendChild(levelCell);

        // Append the row to the table
        info.appendChild(row)
    }
    
    
}

const loadDataPrograms = async () => {
    loadInfoPrograms();
}


document.addEventListener("DOMContentLoaded", async () => {
    await loadPrograms();
    await loadDataPrograms();
})

console.log(programsArray);