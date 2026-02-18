async function loadPatients() {
  const doctorId = localStorage.getItem("userId"); // or from token

  const response = await fetch(`/doctor/${doctorId}/patients`);
  const patients = await response.json();

  const container = document.getElementById("assignedPatientsContainer");
  container.innerHTML = "";

  patients.forEach(patient => {
    container.innerHTML += `
      <div class="patient-card">
        <h3>${patient.name}</h3>
        <p>${patient.email}</p>
      </div>
    `;
  });
}

loadPatients();
