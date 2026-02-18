// scripts/main.js
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeText = document.getElementById("welcomeText");

  // Function to update navbar UI based on login state
  function updateUI() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (token && role) {
      // User is logged in
      if (welcomeText) {
        welcomeText.textContent = `Welcome back, ${name || "User"} 👋`;
      }
      if (loginBtn) loginBtn.style.display = "none";
      if (signupBtn) signupBtn.style.display = "none";
      if (dashboardBtn) dashboardBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      // User is not logged in
      if (welcomeText) welcomeText.textContent = "Your Health, Simplified 🩺";
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (signupBtn) signupBtn.style.display = "inline-block";
      if (dashboardBtn) dashboardBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  }

  // Initialize navbar
  updateUI();

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      updateUI();
      window.location.href = "index.html";
    });
  }

  // Dashboard redirect based on role
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
      const role = localStorage.getItem("role"); // read fresh value
      if (role === "doctor") {
        window.location.href = "dashboard/doctor.html";
      } else if (role === "patient") {
        window.location.href = "dashboard/patient.html";
      } else {
        alert("Unknown role. Please login again.");
        localStorage.clear();
        updateUI();
      }
    });
  }
});
