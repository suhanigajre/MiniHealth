document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const noteForm = document.getElementById("noteForm");
  const patientSelect = document.getElementById("patientSelect");
  const noteText = document.getElementById("noteText");
  const msg = document.getElementById("msg");
  const notesContainer = document.getElementById("notesContainer");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "doctor") {
    alert("Access denied! Only doctors can view this page.");
    window.location.href = "./login.html";
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
  });

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

  async function loadPatients() {
    patientSelect.innerHTML = `<option>Loading patients...</option>`;

    try {
      const data = await apiCall("/doctor/patients");

      if (data.patients && data.patients.length > 0) {
        patientSelect.innerHTML = data.patients
          .map((p) => `<option value="${p.id}">${p.name}</option>`)
          .join("");
      } else {
        patientSelect.innerHTML = `<option value="">No patients found</option>`;
      }
    } catch (err) {
      patientSelect.innerHTML = `<option value="">Error loading patients</option>`;
      console.error("Load patients error:", err);
    }
  }

  async function loadNotes() {
    notesContainer.innerHTML = `<p class="loading">Loading notes...</p>`;

    try {
      const data = await apiCall("/doctor-notes");

      if (data.notes && data.notes.length > 0) {
        notesContainer.innerHTML = data.notes
          .map(
            (n) => `
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
      console.error("Load notes error:", err);
    }
  }

  noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const patientId = patientSelect.value;
    const note = noteText.value.trim();

    if (!patientId || !note) {
      msg.textContent = "Please select patient and write note.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Saving note...";
    msg.style.color = "black";

    try {
      const data = await apiCall("/doctor-notes", "POST", {
        patient_id: patientId,
        note,
      });

      msg.textContent = data.message || "Note saved successfully!";
      msg.style.color = "green";
      noteText.value = "";

      await loadNotes();
    } catch (err) {
      msg.textContent = err.message || "Server error. Try again later.";
      msg.style.color = "red";
      console.error("Save note error:", err);
    }
  });

  await loadPatients();
  await loadNotes();
});