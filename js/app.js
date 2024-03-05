document.addEventListener('DOMContentLoaded',async ()=>{
    await loadStudents();
    await loadPrograms();
    loadStudentsForm();
})