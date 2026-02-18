document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const doctorName = localStorage.getItem("username");

  if (role !== "doctor") {
    alert("Access denied");
    window.location.href = "../login.html";
    return;
  }

  const patientsList = document.getElementById("patientsList");
  const historyContainer = document.getElementById("historyContainer");
  const selectedPatientTitle = document.getElementById("selectedPatientTitle");
  const diagnosisInput = document.getElementById("diagnosis");
  const medicineList = document.getElementById("medicineList");
  const notesInput = document.getElementById("additionalNotes");

  let selectedPatientId = null;
  let editingId = null;

  // Load Assigned Patients
  async function loadPatients() {
    const res = await fetch("http://localhost:3000/doctor/assigned-patients", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    patientsList.innerHTML = "";

    data.patients.forEach(patient => {
      const div = document.createElement("div");
      div.className = "patient-item";
      div.textContent = patient.name;

      div.onclick = () => {
        document.querySelectorAll(".patient-item").forEach(p => p.classList.remove("active"));
        div.classList.add("active");

        selectedPatientId = patient.id;
        selectedPatientTitle.textContent = `Prescription History - ${patient.name}`;
        loadHistory(patient.id);
      };

      patientsList.appendChild(div);
    });
  }

  // Load Prescription History
  async function loadHistory(patientId) {
    const res = await fetch(`http://localhost:3000/doctor/prescriptions/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    historyContainer.innerHTML = "";

    data.prescriptions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(p => {

        const card = document.createElement("div");
        card.className = "history-card";
        card.innerHTML = `
          <small>${new Date(p.date).toLocaleDateString()}</small>
          <p><strong>Diagnosis:</strong> ${p.diagnosis}</p>
          <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
          <button class="btn btn-add">Edit</button>
        `;

        card.querySelector("button").onclick = () => {
          diagnosisInput.value = p.diagnosis;
          notesInput.value = p.notes;
          editingId = p.id;
        };

        historyContainer.appendChild(card);
      });
  }

  // Add Medicine Row
  document.getElementById("addMedicineBtn").onclick = () => {
    const div = document.createElement("div");
    div.className = "medicine-row";
    div.innerHTML = `
      <input placeholder="Medicine Name" class="med-name">
      <input placeholder="Dosage" class="med-dosage">
      <input placeholder="Frequency" class="med-frequency">
      <input placeholder="Duration" class="med-duration">
    `;
    medicineList.appendChild(div);
  };

  // Save Prescription
  document.getElementById("savePrescription").onclick = async () => {

    if (!selectedPatientId) {
      alert("Select patient first");
      return;
    }

    const medicines = [];
    document.querySelectorAll(".medicine-row").forEach(row => {
      medicines.push({
        name: row.querySelector(".med-name").value,
        dosage: row.querySelector(".med-dosage").value,
        frequency: row.querySelector(".med-frequency").value,
        duration: row.querySelector(".med-duration").value
      });
    });

    await fetch("http://localhost:3000/doctor/prescriptions", {
      method: editingId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        patientId: selectedPatientId,
        diagnosis: diagnosisInput.value,
        medicines,
        notes: notesInput.value
      })
    });

    diagnosisInput.value = "";
    notesInput.value = "";
    medicineList.innerHTML = "";
    editingId = null;

    loadHistory(selectedPatientId);
  };

  // Print
  document.getElementById("printPrescription").onclick = () => {
    window.print();
  };

  // Download PDF
  document.getElementById("downloadPdf").onclick = () => {
    const element = document.getElementById("prescriptionArea");
    html2pdf().from(element).save("prescription.pdf");
  };

  // Logout
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "../login.html";
  };

  loadPatients();
});
