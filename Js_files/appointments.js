window.onload = function () {
  initializeCalendar();
};

function addAppointment(event) {
  event.preventDefault();

  const patientName = document.getElementById("patientNameInput").value.trim();
  const appointmentDateTime = document.getElementById(
    "appointmentDateTime"
  ).value;

  if (!patientName) {
    alert("Please enter the patient's name.");
    return;
  }

  const newAppointment = {
    id: Date.now(),
    name: patientName,
    dateTime: appointmentDateTime,
  };
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  initializeCalendar();
  document.getElementById("appointmentForm").reset();
}

function deleteAppointment(appointmentId, event) {
  event.stopPropagation();

  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments = appointments.filter(
    (appointment) => appointment.id !== appointmentId
  );
  localStorage.setItem("appointments", JSON.stringify(appointments));
  initializeCalendar();
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function initializeCalendar() {
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.name,
    start: new Date(appointment.dateTime),
    extendedProps: {
      appointmentId: appointment.id,
      time: appointment.dateTime,
    },
  }));

  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: events,
    eventContent: function (arg) {
      const appointmentId = arg.event.extendedProps.appointmentId;
      const time = formatTime(arg.event.start);
      return {
        html: `
          <div class="appointment-container">
            <div class="appointment-info">
              <span class="appointment-name">${arg.event.title}</span>
              <span class="appointment-time">${time}</span>
            </div>
            <button 
              class="delete-button" 
              onclick="deleteAppointment(${appointmentId}, event)"
              title="Delete appointment"
            >×</button>
          </div>
        `,
      };
    },
  });

  calendar.render();
}

document.getElementById("appointmentForm").onsubmit = addAppointment;
