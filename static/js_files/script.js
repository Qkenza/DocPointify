// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const logoutNav = document.getElementById('logoutNav');
    const logoutBtn = document.getElementById('logoutBtn');
    const authMessage = document.getElementById('authMessage');
    const authTitle = document.getElementById('authTitle');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('toggleText');

    // Show or hide the logout button based on login state
    if (isLoggedIn) {
        logoutNav.style.display = "inline";
    } else {
        logoutNav.style.display = "none";
    }

    // Handle logout
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn'); // Clear login state
        showMessage('You have logged out successfully.', 'green');
        setTimeout(() => {
            window.location.href = "home.html"; // Redirect to the home page
        }, 1500);
    });

    // Restrict access to protected pages
    const restrictedLinks = document.querySelectorAll('.restricted');
    if (!isLoggedIn) {
        restrictedLinks.forEach(link =>
            link.addEventListener('click', e => {
                e.preventDefault(); // Prevent navigation
                showMessage('You must log in to access this page.', 'red');
                setTimeout(() => {
                    window.location.href = "home.html"; // Redirect to home
                }, 1500);
            })
        );
    }

    // Toggle between login and register modes
    let isLoginMode = true;
    toggleText?.addEventListener('click', () => {
        isLoginMode = !isLoginMode;

        authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
        authSubmitBtn.textContent = isLoginMode ? "Submit" : "Register";
        toggleText.innerHTML = isLoginMode
            ? `New user? <a href='javascript:void(0)'>Register now</a>`
            : `Already have an account? <a href='javascript:void(0)'>Login</a>`;
        clearMessage();
    });

    // Handle login or register
    authSubmitBtn?.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage('Please fill in all fields.', 'red');
            return;
        }

        if (isLoginMode) {
            // Login logic
            const storedEmail = localStorage.getItem('email');
            const storedPassword = localStorage.getItem('password');

            if (email === storedEmail && password === storedPassword) {
                localStorage.setItem('isLoggedIn', true);
                showMessage('Welcome! Connected successfully.', 'green');
                setTimeout(() => {
                    window.location.href = "appointments.html"; // Redirect to appointments
                }, 1500);
            } else {
                showMessage('No user with this email registered yet.', 'red');
            }
        } else {
            // Register logic
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            showMessage('Signup successful! Please log in.', 'green');
            isLoginMode = true; // Switch to login mode
            authTitle.textContent = "Login";
            authSubmitBtn.textContent = "Submit";
            toggleText.innerHTML = `New user? <a href='javascript:void(0)'>Register now</a>`;
        }
    });

    // Utility function to show messages
    const showMessage = (msg, color) => {
        if (authMessage) {
            authMessage.textContent = msg;
            authMessage.style.color = color;
            authMessage.style.textAlign = 'center'; // Center-align message
            authMessage.style.marginTop = '20px';
        }
    };

    // Utility function to clear messages
    const clearMessage = () => {
        if (authMessage) authMessage.textContent = '';
    };
});