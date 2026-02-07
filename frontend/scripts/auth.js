const BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const msgBox = document.getElementById("msg");

  /* ========== SIGNUP ========== */
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const dob = document.getElementById("dob").value;
      const role = document.getElementById("role").value;

      try {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role, phone, dob }),
        });

        const data = await res.json();

        if (data.success) {
          msgBox.style.color = "green";
          msgBox.textContent = "Signup successful! Redirecting...";
          setTimeout(() => (window.location.href = "login.html"), 1500);
        } else {
          msgBox.textContent = data.error;
          msgBox.style.color = "red";
        }
        document.getElementById("proceedBtn").style.display = "block";


      } catch (err) {
        msgBox.textContent = "⚠️ Server connection error.";
        msgBox.style.color = "red";
      }
    });
  }

  /* ========== LOGIN ========== */
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("name", data.name);
          localStorage.setItem("email", email);

          msgBox.style.color = "green";
          msgBox.textContent = "Login successful! Redirecting...";

          setTimeout(() => {
            if (data.role === "doctor") {
              window.location.href = "dashboard/doctor.html";
            } else {
              window.location.href = "dashboard/patient.html";
            }
          }, 1000);

        } else {
          msgBox.textContent = data.error;
          msgBox.style.color = "red";
        }

      } catch (err) {
        msgBox.textContent = "⚠️ Server connection error.";
        msgBox.style.color = "red";
      }
    });
  }
});
