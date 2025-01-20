// Get elements
const authTitle = document.getElementById('authTitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleText = document.getElementById('toggleText');

// Initial state (login mode)
let isLoginMode = true;

// Toggle between Login and Signup
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
});

// Handle form submission
authSubmitBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (isLoginMode) {
        console.log(`Logging in with Email: ${email}, Password: ${password}`);
        alert("Login successful! Redirecting...");
        window.location.href = "appointments.html";
    } else {
        console.log(`Registering with Email: ${email}, Password: ${password}`);
        alert("Signup successful! Redirecting to appointments...");
        window.location.href = "appointments.html";
    }
});