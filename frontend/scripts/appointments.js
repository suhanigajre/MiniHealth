document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const appointmentsContainer = document.getElementById("appointmentsContainer");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (role !== "doctor") {
    alert("Access denied! Only doctors can view this page.");
    window.location.href = "../login.html";
    return;
  }

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "../login.html";
  });

  // Fetch appointments
  async function loadAppointments() {
    appointmentsContainer.innerHTML = `<p class="loading">Loading appointments...</p>`;
    try {
      const res = await fetch("http://localhost:3000/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success || data.appointments.length === 0) {
        appointmentsContainer.innerHTML = `<p class="loading">No appointments found.</p>`;
        return;
      }

      // Sort appointments: most recent first
      data.appointments.sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time));

      // Build table
      let tableHTML = `
        <table class="appointments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.appointments
              .map(
                (appt) => `
              <tr data-id="${appt.id}">
                <td>${new Date(appt.date).toLocaleDateString()}</td>
                <td>${appt.time}</td>
                <td>${appt.patient_name}</td>
                <td class="status">${appt.status}</td>
                <td>
                  <button class="btn-action btn-accept">Accept</button>
                  <button class="btn-action btn-deny">Deny</button>
                  <button class="btn-action btn-delay">Delay</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
      appointmentsContainer.innerHTML = tableHTML;

      // Add action listeners
      document.querySelectorAll(".appointments-table tbody tr").forEach((row) => {
        const id = row.dataset.id;
        const statusCell = row.querySelector(".status");

        row.querySelector(".btn-accept").addEventListener("click", () => updateStatus(id, "Accepted", statusCell));
        row.querySelector(".btn-deny").addEventListener("click", () => updateStatus(id, "Denied", statusCell));
        row.querySelector(".btn-delay").addEventListener("click", () => delayAppointment(id, statusCell));
      });

    } catch (err) {
      appointmentsContainer.innerHTML = `<p class="loading">⚠️ Failed to load appointments.</p>`;
      console.error(err);
    }
  }

  // Update appointment status
  async function updateStatus(appointmentId, newStatus, statusCell) {
    try {
      const res = await fetch(`http://localhost:3000/doctor/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      statusCell.textContent = newStatus;
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  }

  // Delay appointment - simple prompt for new date
  async function delayAppointment(appointmentId, statusCell) {
    const newDate = prompt("Enter new date for appointment (YYYY-MM-DD):");
    if (!newDate) return;

    try {
      const res = await fetch(`http://localhost:3000/doctor/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Delayed", new_date: newDate }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delay appointment");
        return;
      }

      statusCell.textContent = `Delayed → ${new Date(newDate).toLocaleDateString()}`;
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  }

  await loadAppointments();
});
