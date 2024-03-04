// Arrays of rates, programs
const ratesArray = [];
const programsArray = [];

// extract info of the api
const loadRates = async () => {

    try {
        ratesArray.length = 0;
        const response = await fetch('http://localhost:3000/tarifas');

        if (!response.ok) {
            throw new Error('Error at the moment to load rates. Status: ', response.status);
        }
        const rates = await response.json();
        ratesArray.push(...rates);

    } catch (error) {
        console.error("Error at the moment to load rates: ", error.message);
    }
}

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
// generate the info of a tables (id, price, etc) in rows
const loadInfoRates = () => {
    const info = document.getElementById("info-rates");

    ratesArray.forEach((i) => {
        const id = i.id;
        const price = i.costo_credito;
        const period = i.periodo_id;

        // find the name of the program in the program's array
        const program = programsArray.find((p) => p.id === i.programa_id);

        // If program is found, use its name, otherwise use a default value
        const programName = program ? program.nombre : "Program not found";
        // create new row
        const row = document.createElement("tr");
        row.classList.add("table-primary");

        // create id cell for the row
        const idCell = document.createElement("td");
        idCell.textContent = id;
        row.appendChild(idCell);

        // create price cell for the row
        const priceCell = document.createElement("td");
        priceCell.textContent = price;
        row.appendChild(priceCell);

        // create period cell for the row
        const periodCell = document.createElement("td");
        periodCell.textContent = period;
        row.appendChild(periodCell);

        // create program cell for the row
        const programCell = document.createElement("td");
        programCell.textContent = programName;
        row.appendChild(programCell);

        // Append the row to the table
        info.appendChild(row);
    });
};

const loadDataRates = async () => {
    loadInfoRates();
}

// when the document rates.html is already load. We'll load the info of the rates
document.addEventListener("DOMContentLoaded", async () => {
    await loadRates();
    await loadPrograms();
    await loadDataRates();
})

// print the rate's array
console.log(ratesArray);
console.log(programsArray)