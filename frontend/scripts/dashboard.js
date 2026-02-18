document.addEventListener("DOMContentLoaded", () => {
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const currentPage = window.location.pathname;

  console.log("ROLE:", role);
  console.log("PAGE:", currentPage);

  if (!token) {
    alert("Please login to access your dashboard.");
    window.location.href = "../login.html";
    return;
  }

  const email = localStorage.getItem("userEmail") || "User";

  if (userEmail) {
    userEmail.textContent = email;
  }

  // Role-based protection
  if (role === "doctor" && currentPage.includes("patient.html")) {
    window.location.href = "doctor.html";
    return;
  }

  if (role === "patient" && currentPage.includes("doctor.html")) {
    window.location.href = "patient.html";
    return;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
