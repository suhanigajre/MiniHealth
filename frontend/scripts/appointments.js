document.addEventListener("DOMContentLoaded", async () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const appointmentsContainer = document.getElementById("appointmentsContainer");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    alert("Please login first.");
    window.location.href = "./login.html";
    return;
  }

  if (role !== "doctor" && role !== "patient") {
    alert("Access denied!");
    window.location.href = "./login.html";
    return;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
  });

  async function loadAppointments() {
    appointmentsContainer.innerHTML = `<p class="loading">Loading appointments...</p>`;

    try {
      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.appointments || data.appointments.length === 0) {
        appointmentsContainer.innerHTML = `<p class="loading">No appointments found.</p>`;
        return;
      }

      data.appointments.sort(
        (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
      );

      let tableHTML = `
        <table class="appointments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>${role === "doctor" ? "Patient" : "Doctor"}</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${data.appointments
              .map((appt) => {
                const dateObj = new Date(appt.appointment_date);

                return `
                  <tr data-id="${appt.id}">
                    <td>${dateObj.toLocaleDateString()}</td>
                    <td>${dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</td>
                    <td>${role === "doctor" ? appt.patient_name : appt.doctor_name}</td>
                    <td>${appt.status}</td>
                    <td>${appt.notes || "-"}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      `;

      appointmentsContainer.innerHTML = tableHTML;
    } catch (err) {
      appointmentsContainer.innerHTML = `<p class="loading">⚠️ Failed to load appointments.</p>`;
      console.error("Appointments error:", err);
    }
  }

  await loadAppointments();
});