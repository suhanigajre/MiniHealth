// scripts/signup.js
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const msg = document.getElementById("msg");
  const proceedBtn = document.getElementById("proceedBtn");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const role = document.getElementById("role").value;


    msg.textContent = "Registering...";
    msg.style.color = "black";

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, dob,role }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        msg.textContent = data.message || "Signup failed";
        msg.style.color = "red";
        return;
      }

      msg.textContent = "Signup successful! You can now login.";
      msg.style.color = "green";

      // Show proceed button
      proceedBtn.style.display = "inline-block";

      // Optional: clear form
      signupForm.reset();

    } catch (err) {
      console.error("SIGNUP FETCH ERROR:", err);
      msg.textContent = "Server error. Please try again later.";
      msg.style.color = "red";
    }
  });
});
