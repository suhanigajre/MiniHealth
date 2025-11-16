// scripts/main.js
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const welcomeText = document.getElementById("welcomeText");

  // If user is logged in
  if (token && role) {
    // Show welcome message
    if (welcomeText) {
      welcomeText.textContent = `Welcome back, ${name || "User"} 👋`;
    }

    // Hide login/signup buttons, show dashboard + logout
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (dashboardBtn) dashboardBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    // Not logged in
    if (dashboardBtn) dashboardBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html";
    });
  }

  // Dashboard redirect (based on role)
  if (dashboardBtn) {
    dashboardBtn.addEventListener("click", () => {
      if (role === "doctor") {
        window.location.href = "dashboard/doctor.html";
      } else if (role === "patient") {
        window.location.href = "dashboard/patient.html";
      } else {
        alert("Unknown role. Please login again.");
      }
    });
  }
});
