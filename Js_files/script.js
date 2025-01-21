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
    if (isLoggedIn && logoutNav) {
        logoutNav.style.display = "inline";
    } else if (logoutNav) {
        logoutNav.style.display = "none";
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn'); // Clear login state
            alert("You have logged out successfully.");
            window.location.href = "home.html"; // Redirect to the home page
        });
    }

    // Restrict access to protected pages
    const restrictedLinks = document.querySelectorAll('.restricted');
    if (!isLoggedIn) {
        restrictedLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigation
                alert("You must log in to access this page.");
                window.location.href = "home.html"; // Redirect to home
            });
        });
    }

    // Login/Register form functionality
    let isLoginMode = true;

    if (toggleText) {
        toggleText.addEventListener('click', () => {
            isLoginMode = !isLoginMode;

            if (isLoginMode) {
                authTitle.textContent = "Login";
                authSubmitBtn.textContent = "Submit";
                toggleText.innerHTML = "New user? <a href='javascript:void(0)'>Register now</a>";
            } else {
                authTitle.textContent = "Sign Up";
                authSubmitBtn.textContent = "Register";
                toggleText.innerHTML = "Already have an account? <a href='javascript:void(0)'>Login</a>";
            }
            if (authMessage) authMessage.textContent = ""; // Clear any existing messages
        });
    }

    if (authSubmitBtn) {
        authSubmitBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                if (authMessage) {
                    authMessage.textContent = "Please fill in all fields.";
                    authMessage.style.color = "red";
                }
                return;
            }

            if (isLoginMode) {
                // Login logic
                const storedEmail = localStorage.getItem('email');
                const storedPassword = localStorage.getItem('password');

                if (email === storedEmail && password === storedPassword) {
                    localStorage.setItem('isLoggedIn', true);
                    if (authMessage) {
                        authMessage.textContent = "Welcome! Connected successfully.";
                        authMessage.style.color = "green";
                    }
                    setTimeout(() => {
                        window.location.href = "appointments.html"; // Redirect to appointments
                    }, 1500);
                } else {
                    if (authMessage) {
                        authMessage.textContent = "No user with this email registered yet.";
                        authMessage.style.color = "red";
                    }
                }
            } else {
                // Register logic
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                if (authMessage) {
                    authMessage.textContent = "Signup successful! Please log in.";
                    authMessage.style.color = "green";
                }
                isLoginMode = true; // Switch to login mode
                authTitle.textContent = "Login";
                authSubmitBtn.textContent = "Submit";
                toggleText.innerHTML = "New user? <a href='javascript:void(0)'>Register now</a>";
            }
        });
    }
});