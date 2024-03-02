// dowload info
const periodsArray = [];

const loadPeriods = async () => {

    try {
        periodsArray.length = 0;
        const response = await fetch('http://localhost:3000/periodos');

        if (!response.ok) {
            throw new Error('Error at the moment to load periods. Status: ', response.status);
        }
        const periods = await response.json();
        periodsArray.push(...periods);

    } catch (error) {
        console.error("Error at the moment to load periods: ", error.message);
    }
}


const loadInfoPeriods = () => {

    const info = document.getElementById("info-period");

    for (let i of periodsArray) {
        const id = i.id;
        const code = i.codigo;
        const year = i.ano;
        const semester = i.semestre;

        // create new row
        const row = document.createElement("tr");
        row.classList.add("table-primary");

        // create id cell for de row
        const idCell = document.createElement("td");
        idCell.textContent = id;
        row.appendChild(idCell);

        // create code cell for the row
        const codeCell = document.createElement("td");
        codeCell.textContent = code;
        row.appendChild(codeCell);

        // create year cell for the row
        const yearCell = document.createElement("td");
        yearCell.textContent = year;
        row.appendChild(yearCell);

        // create semester cell for the row
        const semesterCell = document.createElement("td");
        semesterCell.textContent = semester;
        row.appendChild(semesterCell);

        // Append the row to the table
        info.appendChild(row)
    }
    
    
}

const loadDataPeriods = async () => {
    loadInfoPeriods();
}


document.addEventListener("DOMContentLoaded", async () => {
    await loadPeriods();
    await loadDataPeriods();
})

console.log(periodsArray);