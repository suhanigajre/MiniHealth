const BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const msgBox = document.getElementById("msg");

  // ===== SIGNUP =====
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;

      if (!name || !email || !password || !role) {
        msgBox.textContent = "⚠️ All fields are required.";
        msgBox.style.color = "red";
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();
        console.log("Signup response:", data);

        if (data.success) {
          msgBox.style.color = "green";
          msgBox.textContent = "✅ Signup successful! Redirecting to login...";
          setTimeout(() => (window.location.href = "login.html"), 1500);
        } else {
          msgBox.style.color = "red";
          msgBox.textContent = data.error || "Signup failed. Try again.";
        }
      } catch (err) {
        msgBox.style.color = "red";
        msgBox.textContent = "⚠️ Error connecting to server.";
      }
    });
  }

  // ===== LOGIN =====
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        msgBox.textContent = "⚠️ Please enter email and password.";
        msgBox.style.color = "red";
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log("Login response:", data);

        if (data.success) {
          // 🧠 Save user info locally
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("name", data.name || "User");
          localStorage.setItem("email", email); // fallback

          msgBox.style.color = "green";
          msgBox.textContent = "✅ Login successful! Redirecting...";

          // 🧭 Redirect based on role
          setTimeout(() => {
            if (data.role === "doctor") {
              window.location.href = "dashboard/doctor.html";
            } else if (data.role === "patient") {
              window.location.href = "dashboard/patient.html";
            } else {
              msgBox.style.color = "orange";
              msgBox.textContent = "⚠️ Unknown role. Please contact admin.";
            }
          }, 1000);
        } else {
          msgBox.style.color = "red";
          msgBox.textContent = data.error || "Invalid credentials.";
        }
      } catch (err) {
        console.error("Login error:", err);
        msgBox.style.color = "red";
        msgBox.textContent = "⚠️ Server connection error.";
      }
    });
  }
});
