const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  msg.textContent = "Logging in...";
  msg.style.color = "black";

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      msg.textContent = data.message || "Login failed";
      msg.style.color = "red";
      return;
    }

    // ✅ Save auth info in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);   // important!
    localStorage.setItem("name", data.name);
    localStorage.setItem("userEmail", data.email);

    msg.textContent = "Login successful! Redirecting...";
    msg.style.color = "green";

    // ✅ Redirect based on role
    setTimeout(() => {
      if (data.role === "doctor") {
        window.location.href = "dashboard/doctor.html";
      } else if (data.role === "patient") {
        window.location.href = "dashboard/patient.html";
      } else {
        msg.textContent = "Unknown role. Please login again.";
        localStorage.clear();
      }
    }, 800);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    msg.textContent = "Server error. Please try again later.";
    msg.style.color = "red";
  }
});
