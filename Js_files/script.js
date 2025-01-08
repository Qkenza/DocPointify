document.addEventListener('DOMContentLoaded', () => {
    const doctorBtn = document.getElementById('doctorBtn');
    const assistantBtn = document.getElementById('assistantBtn');
    const modal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    const authTitle = document.getElementById('authTitle');

    // Open modal with respective titles
    doctorBtn.addEventListener('click', () => {
        authTitle.textContent = 'Doctor Login';
        modal.style.display = 'block';
    });

    assistantBtn.addEventListener('click', () => {
        authTitle.textContent = 'Assistant Login';
        modal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    const authForm = document.getElementById('authForm');
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Simple validation (replace with actual authentication logic)
        if (username && password) {
            alert(`Welcome, ${username}!`);
            modal.style.display = 'none';
            authForm.reset();
        } else {
            alert('Please enter both username and password');
        }
    });
});