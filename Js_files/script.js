// Mock database to store user data
const users = [];

// Get elements
const authTitle = document.getElementById('authTitle');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleText = document.getElementById('toggleText');
const message = document.getElementById('message');

// Initial state (login mode)
let isLoginMode = true;

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        restrictAccess();
    }
});

// Toggle between Login and Signup
toggleText.addEventListener('click', () => {
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
        authTitle.textContent = "Login";
        authSubmitBtn.textContent = "Submit";
        toggleText.innerHTML = "New user? <a href='javascript:void(0)'>Register now</a>";
        message.textContent = "";
    } else {
        authTitle.textContent = "Sign Up";
        authSubmitBtn.textContent = "Register";
        toggleText.innerHTML = "Already have an account? <a href='javascript:void(0)'>Login</a>";
        message.textContent = "";
    }
});

// Handle form submission
authSubmitBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        message.style.color = "red";
        message.textContent = "Please fill in all fields.";
        return;
    }

    if (isLoginMode) {
        const user = users.find(u => u.email === email);
        if (user && user.password === password) {
            localStorage.setItem('isLoggedIn', true);
            message.className = "success";
            message.textContent = "Welcome! Connected successfully.";
            setTimeout(() => {
                window.location.href = "appointments.html";
            }, 2000);
        } else {
            message.style.color = "red";
            message.textContent = "No user with this email registered yet.";
        }
    } else {
        const userExists = users.some(u => u.email === email);
        if (userExists) {
            message.style.color = "red";
            message.textContent = "User already registered. Please log in.";
        } else {
            users.push({ email, password });
            message.className = "success";
            message.textContent = "Signup successful! Please log in.";
            setTimeout(() => {
                isLoginMode = true;
                authTitle.textContent = "Login";
                authSubmitBtn.textContent = "Submit";
                toggleText.innerHTML = "New user? <a href='javascript:void(0)'>Register now</a>";
                message.textContent = "";
            }, 2000);
        }
    }
});

// Restrict access to restricted pages
function restrictAccess() {
    const restrictedLinks = document.querySelectorAll('.restricted');
    restrictedLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            message.style.color = "red";
            message.textContent = "You must log in to access this page.";
        });
    });
}