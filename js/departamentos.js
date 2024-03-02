// dowload info
const departamentArray = [];

const loadDepartaments = async () => {

    try {
        departamentArray.length = 0;
        const response = await fetch('http://localhost:3000/departamentos');

        if (!response.ok) {
            throw new Error('Error at the moment to load departaments. Status: ', response.status);
        }
        const departaments = await response.json();
        departamentArray.push(...departaments);

    } catch (error) {
        console.error("Error at the moment to load departaments: ", error.message);
    }
}


const loadInfoTable = async () => {

    const info = document.getElementById("info-table");

    for (let i of departamentArray) {
        const name = i.nombre;
        const id = i.id;

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

        // Append the row to the table
        info.appendChild(row)
    }
    
    
}

const loadDataTable=async()=>{
    loadInfoTable();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadDepartaments();
    await loadDataTable();
})

console.log(departamentArray);