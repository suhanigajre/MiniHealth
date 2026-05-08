document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const doctorName = localStorage.getItem("name");

  if (!token || role !== "doctor") {
    alert("Access denied");
    window.location.href = "./login.html";
    return;
  }

  const patientsList = document.getElementById("patientsList");
  const historyContainer = document.getElementById("historyContainer");
  const selectedPatientTitle = document.getElementById("selectedPatientTitle");
  const diagnosisInput = document.getElementById("diagnosis");
  const medicineList = document.getElementById("medicineList");
  const notesInput = document.getElementById("additionalNotes");

  let selectedPatientId = null;

  async function apiCall(endpoint, method = "GET", body = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(`http://localhost:3000/api${endpoint}`, options);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  // Load Assigned Patients
  async function loadPatients() {
    try {
      const data = await apiCall("/doctor/patients");

      patientsList.innerHTML = "";

      if (!data.patients || data.patients.length === 0) {
        patientsList.innerHTML = "<p>No assigned patients found.</p>";
        return;
      }

      data.patients.forEach((patient) => {
        const div = document.createElement("div");
        div.className = "patient-item";
        div.textContent = patient.name;

        div.onclick = () => {
          document
            .querySelectorAll(".patient-item")
            .forEach((p) => p.classList.remove("active"));

          div.classList.add("active");

          selectedPatientId = patient.id;
          selectedPatientTitle.textContent = `Prescription History - ${patient.name}`;

          loadHistory(patient.id);
        };

        patientsList.appendChild(div);
      });
    } catch (err) {
      console.error("Load patients error:", err);
      patientsList.innerHTML = "<p>Failed to load patients.</p>";
    }
  }

  // Load Prescription History
  async function loadHistory(patientId) {
    try {
      const data = await apiCall("/prescriptions");

      historyContainer.innerHTML = "";

      const filtered = data.prescriptions.filter(
        (p) => Number(p.patient_id) === Number(patientId)
      );

      if (filtered.length === 0) {
        historyContainer.innerHTML = "<p>No prescription history found.</p>";
        return;
      }

      filtered.forEach((p) => {
        const card = document.createElement("div");
        card.className = "history-card";

        card.innerHTML = `
          <small>${new Date(p.created_at).toLocaleDateString()}</small>
          <p><strong>Medication:</strong> ${p.medication || "-"}</p>
          <p><strong>Dosage:</strong> ${p.dosage || "-"}</p>
          <p><strong>Instructions:</strong> ${p.instructions || "-"}</p>
          <p><strong>Doctor:</strong> Dr. ${doctorName || "Doctor"}</p>
        `;

        historyContainer.appendChild(card);
      });
    } catch (err) {
      console.error("Load history error:", err);
      historyContainer.innerHTML = "<p>Failed to load prescription history.</p>";
    }
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

    document.querySelectorAll(".medicine-row").forEach((row) => {
      const name = row.querySelector(".med-name").value.trim();
      const dosage = row.querySelector(".med-dosage").value.trim();
      const frequency = row.querySelector(".med-frequency").value.trim();
      const duration = row.querySelector(".med-duration").value.trim();

      if (name || dosage || frequency || duration) {
        medicines.push(`${name} - ${dosage} - ${frequency} - ${duration}`);
      }
    });

    const medicationText = medicines.join("\n");
    const dosageText =
      document.querySelector(".med-dosage")?.value.trim() || "As prescribed";

    if (!medicationText) {
      alert("Please add at least one medicine.");
      return;
    }

    try {
      await apiCall("/prescriptions", "POST", {
        patient_id: selectedPatientId,
        medication: medicationText,
        dosage: dosageText,
        instructions: notesInput.value,
      });

      diagnosisInput.value = "";
      notesInput.value = "";
      medicineList.innerHTML = "";

      alert("Prescription saved successfully");
      loadHistory(selectedPatientId);
    } catch (err) {
      console.error("Save prescription error:", err);
      alert(err.message || "Failed to save prescription");
    }
  };

  document.getElementById("printPrescription").onclick = () => {
    window.print();
  };

  document.getElementById("downloadPdf").onclick = () => {
    const element = document.getElementById("prescriptionArea");

    if (typeof html2pdf === "undefined") {
      alert("PDF library not loaded.");
      return;
    }

    html2pdf().from(element).save("prescription.pdf");
  };

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "./login.html";
  };

  loadPatients();
});