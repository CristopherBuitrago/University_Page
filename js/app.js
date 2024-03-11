document.addEventListener('DOMContentLoaded',async ()=>{
    await loadStudents();
    await loadPrograms();

    await loadTeachers();
    await loadDepartaments();

    await loadSubjects();
    await loadPeriods();
    await loadCourses();
    await loadClassrooms();

    await loadTuitions();
    await loadRates();

    await updateFeaturedSubject();

    loadStudentsForm();

    loadTeachersForm();

    loadSubjectsForm();

    loadTuitionsForm();
})
