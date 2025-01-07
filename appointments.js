// Add new appointment to localStorage
function addAppointment(event) {
  event.preventDefault(); // Prevent form submission

  // Get values from the form inputs
  const patientName = document.getElementById("patientName").value;
  const appointmentDateTime = document.getElementById(
    "appointmentDateTime"
  ).value;

  // Create a new appointment object
  const newAppointment = { name: patientName, dateTime: appointmentDateTime };

  // Retrieve existing appointments from localStorage, or initialize an empty array if none
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(newAppointment); // Add the new appointment to the array

  // Save the updated appointments array back to localStorage
  localStorage.setItem("appointments", JSON.stringify(appointments));

  // Reload the list data and reset the form
  loadAppointments();
  document.getElementById("appointmentForm").reset();
}

// Load appointments from localStorage and display them in the list
function loadAppointments() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const appointmentList = document.getElementById("appointmentList");
  appointmentList.innerHTML = ""; // Clear current list

  // Loop through appointments and create a list item for each
  appointments.forEach((appointment, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
                    <div class="appointment">
                        <span class="name">${appointment.name}</span> - 
                        <span class="dateTime">${new Date(
                          appointment.dateTime
                        ).toLocaleString()}</span>
                        <div class="action-buttons">
                            <button class="edit-btn" onclick="editAppointment(${index})">Edit</button>
                            <button class="delete-btn" onclick="deleteAppointment(${index})">Delete</button>
                        </div>
                    </div>
                `;
    appointmentList.appendChild(listItem);
  });
}

// Edit an appointment in localStorage by its index
function editAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const appointment = appointments[index];

  // Set the form fields to the current values of the selected appointment
  document.getElementById("patientName").value = appointment.name;
  document.getElementById("appointmentDateTime").value = appointment.dateTime;

  // Remove the appointment from the array for later updating
  appointments.splice(index, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  // Change the form's submit button text to "Update" for editing
  const form = document.getElementById("appointmentForm");
  form.onsubmit = function (event) {
    event.preventDefault();
    updateAppointment(index);
  };
}

// Update an existing appointment in localStorage
function updateAppointment(index) {
  const patientName = document.getElementById("patientName").value;
  const appointmentDateTime = document.getElementById(
    "appointmentDateTime"
  ).value;

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments[index] = { name: patientName, dateTime: appointmentDateTime }; // Update the appointment

  localStorage.setItem("appointments", JSON.stringify(appointments));

  loadAppointments(); // Reload the list
  document.getElementById("appointmentForm").reset(); // Reset the form
  const form = document.getElementById("appointmentForm");
  form.onsubmit = addAppointment; // Reset the form submit handler
}

// Delete an appointment from localStorage
function deleteAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.splice(index, 1); // Remove the appointment at the specified index
  localStorage.setItem("appointments", JSON.stringify(appointments)); // Save the updated array
  loadAppointments(); // Reload the list
}

// Load appointments when the page loads
window.onload = loadAppointments;

// Bind the form's submit event to addAppointment
document.getElementById("appointmentForm").onsubmit = addAppointment;
