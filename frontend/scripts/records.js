document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const noteForm = document.getElementById("noteForm");
  const patientSelect = document.getElementById("patientSelect");
  const noteText = document.getElementById("noteText");
  const msg = document.getElementById("msg");
  const notesContainer = document.getElementById("notesContainer");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (role !== "doctor") {
    alert("Access denied! Only doctors can view this page.");
    window.location.href = "../login.html";
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });

  // Load patients into dropdown
  async function loadPatients() {
    patientSelect.innerHTML = `<option>Loading patients...</option>`;
    try {
      const res = await fetch("http://localhost:3000/doctor/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.patients.length > 0) {
        patientSelect.innerHTML = data.patients
          .map(p => `<option value="${p.id}">${p.name}</option>`)
          .join("");
      } else {
        patientSelect.innerHTML = `<option value="">No patients found</option>`;
      }
    } catch (err) {
      patientSelect.innerHTML = `<option value="">Error loading patients</option>`;
      console.error(err);
    }
  }

  // Load existing notes
  async function loadNotes() {
    notesContainer.innerHTML = `<p class="loading">Loading notes...</p>`;
    try {
      const res = await fetch("http://localhost:3000/doctor/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.notes.length > 0) {
        notesContainer.innerHTML = data.notes
          .map(
            n => `
            <div class="note-card">
              <h4>${n.patient_name}</h4>
              <p>${n.note}</p>
              <small>${new Date(n.created_at).toLocaleString()}</small>
            </div>
          `
          )
          .join("");
      } else {
        notesContainer.innerHTML = `<p>No notes yet.</p>`;
      }
    } catch (err) {
      notesContainer.innerHTML = `<p>⚠️ Failed to load notes.</p>`;
      console.error(err);
    }
  }

  // Handle new note submission
  noteForm.addEventListener("submit", async e => {
    e.preventDefault();

    const patientId = patientSelect.value;
    const note = noteText.value.trim();
    if (!patientId || !note) return;

    msg.textContent = "Saving note...";
    msg.style.color = "black";

    try {
      const res = await fetch("http://localhost:3000/doctor/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patient_id: patientId, note }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        msg.textContent = data.message || "Failed to save note";
        msg.style.color = "red";
        return;
      }

      msg.textContent = "Note saved successfully!";
      msg.style.color = "green";
      noteText.value = "";
      await loadNotes(); // Refresh notes
    } catch (err) {
      msg.textContent = "Server error. Try again later.";
      msg.style.color = "red";
      console.error(err);
    }
  });

  // Initial load
  await loadPatients();
  await loadNotes();
});
