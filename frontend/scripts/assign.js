async function assignPatient() {
  const doctorId = document.getElementById("doctorSelect").value;
  const patientId = document.getElementById("patientSelect").value;

  const response = await fetch("/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ doctorId, patientId })
  });

  const data = await response.json();
  alert(data.message);
}
