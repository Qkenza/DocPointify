document.addEventListener('DOMContentLoaded', () => {
    const statsButton = document.getElementById('viewStats');
    const statsDiv = document.getElementById('stats');
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.getElementById('appointmentList');

    // Toggle stats view
    statsButton.addEventListener('click', () => {
        const isHidden = statsDiv.style.display === 'none';
        statsDiv.style.display = isHidden ? 'block' : 'none';
        statsButton.setAttribute('aria-expanded', isHidden);
    });

    // Save appointments to localStorage
    const saveAppointments = () => {
        const appointments = Array.from(appointmentList.children).map(li => li.textContent);
        localStorage.setItem('appointments', JSON.stringify(appointments));
    };

    // Load appointments from localStorage
    const loadAppointments = () => {
        const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
        savedAppointments.forEach(appointment => {
            const li = document.createElement('li');
            li.textContent = appointment;
            appointmentList.appendChild(li);
        });
    };

    // Load appointments on page load
    loadAppointments();

    // Add appointments
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const patientName = document.getElementById('patientName').value.trim();
        const appointmentDate = document.getElementById('appointmentDate').value;

        if (patientName && appointmentDate) {
            // Check for duplicates
            const existingAppointments = Array.from(appointmentList.children).map(li => li.textContent);
            const newAppointment = `${patientName} - ${appointmentDate}`;
            if (existingAppointments.includes(newAppointment)) {
                alert('This appointment already exists!');
                return;
            }

            // Create and append new appointment
            const li = document.createElement('li');
            li.textContent = newAppointment;
            li.classList.add('new-appointment'); // Add class for visual feedback
            appointmentList.appendChild(li);

            // Save appointments to localStorage
            saveAppointments();

            // Clear form
            appointmentForm.reset();

            // Highlight new appointment
            setTimeout(() => li.classList.remove('new-appointment'), 2000);
        } else {
            alert('Please fill out all fields');
        }
    });
});