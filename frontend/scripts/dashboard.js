// ===========================
// DASHBOARD LOGIC
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  // Get stored data
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const currentPage = window.location.pathname;

  // Redirect if not logged in
  if (!token) {
    alert("Please login to access your dashboard.");
    window.location.href = "../login.html";
    return;
  }

  // Load user info (mock for now — later we'll fetch from backend)
  const email = localStorage.getItem("email") || "User";

  if (userEmail) {
    userEmail.textContent = email;
  }

  // ✅ Role-based access control
  if (role === "doctor" && currentPage.includes("patient.html")) {
    alert("Redirecting to Doctor Dashboard...");
    window.location.href = "doctor.html";
    return;
  }

  if (role === "patient" && currentPage.includes("doctor.html")) {
    alert("Redirecting to Patient Dashboard...");
    window.location.href = "patient.html";
    return;
  }

  // ✅ Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      alert("Logged out successfully!");
      window.location.href = "../index.html";
    });
  }
});
