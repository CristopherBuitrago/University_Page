// dowload info
const coursesArray = [];

const loadCourses = async () => {

    try {
        coursesArray.length = 0;
        const response = await fetch('http://localhost:3000/cursos');

        if (!response.ok) {
            throw new Error('Error at the moment to load courses . Status: ', response.status);
        }
        const courses = await response.json();
        coursesArray.push(...courses);

    } catch (error) {
        console.error("Error at the moment to load courses: ", error.message);
    }
}


const loadInfoTable = async () => {

    const info = document.getElementById("info-courses");

    for (let i of coursesArray) {
        const id = i.id;
        const name = i.nombre;
        const code = i.codigo;
        const guide = i.guia_catedra;

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
        
        // create code cell for the row
        const codeCell = document.createElement("td");
        codeCell.textContent = code;
        row.appendChild(codeCell);

        // create guide cell for the row
        const guideCell = document.createElement("td");
        guideCell.textContent = guide;
        row.appendChild(guideCell);


        // Append the row to the table
        info.appendChild(row)
    }
    
    
}

const loadDataTable=async()=>{
    loadInfoTable();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadCourses();
    await loadDataTable();
})

console.log(coursesArray);