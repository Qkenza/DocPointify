document.addEventListener('DOMContentLoaded', () => {
    const statsButton = document.getElementById('viewStats');
    const statsDiv = document.getElementById('stats');
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.getElementById('appointmentList');

    // Toggle stats view
    statsButton.addEventListener('click', () => {
        statsDiv.style.display = statsDiv.style.display === 'none' ? 'block' : 'none';
    });

    // Add appointments
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const patientName = document.getElementById('patientName').value;
        const appointmentDate = document.getElementById('appointmentDate').value;

        if (patientName && appointmentDate) {
            const li = document.createElement('li');
            li.textContent = `${patientName} - ${appointmentDate}`;
            appointmentList.appendChild(li);

            appointmentForm.reset();
        } else {
            alert('Please fill out all fields');
        }
    });
});

