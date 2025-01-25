// Check login state on page load
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const logoutNav = document.getElementById("logoutNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const authMessage = document.getElementById("authMessage");
  const authTitle = document.getElementById("authTitle");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const toggleText = document.getElementById("toggleText");

  // Show or hide the logout button based on login state
  if (isLoggedIn) {
    logoutNav.style.display = "inline";
  } else {
    logoutNav.style.display = "none";
  }

  // Handle logout
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn"); // Clear login state
    showMessage("You have logged out successfully.", "green");
    setTimeout(() => {
      window.location.href = "home.html"; // Redirect to the home page
    }, 1500);
  });

  // Restrict access to protected pages
  const restrictedLinks = document.querySelectorAll(".restricted");
  if (!isLoggedIn) {
    restrictedLinks.forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent navigation
        showMessage("You must log in to access this page.", "red");
        setTimeout(() => {
          window.location.href = "home.html"; // Redirect to home
        }, 1500);
      })
    );
  }

  // Toggle between login and register modes
  let isLoginMode = true;
  toggleText?.addEventListener("click", () => {
    isLoginMode = !isLoginMode;

    authTitle.textContent = isLoginMode ? "Login" : "Sign Up";
    authSubmitBtn.textContent = isLoginMode ? "Submit" : "Register";
    toggleText.innerHTML = isLoginMode
      ? `New user? <a href='javascript:void(0)'>Register now</a>`
      : `Already have an account? <a href='javascript:void(0)'>Login</a>`;
    clearMessage();
  });

  // Handle login or register
  authSubmitBtn?.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage("Please fill in all fields.", "red");
      return;
    }

    if (isLoginMode) {
      // Login logic
      fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            localStorage.setItem("isLoggedIn", true);
            showMessage("Welcome! Connected successfully.", "green");
            setTimeout(() => {
              window.location.href = "appointments.html"; // Redirect to appointments
            }, 1500);
          } else {
            showMessage(data.error, "red");
          }
        })
        .catch((error) => {
          showMessage("An error occurred, please try again.", "red");
        });
    } else {
      // Register logic
      fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            showMessage("Signup successful! Please log in.", "green");
            isLoginMode = true; // Switch to login mode
            authTitle.textContent = "Login";
            authSubmitBtn.textContent = "Submit";
            toggleText.innerHTML = `New user? <a href='javascript:void(0)'>Register now</a>`;
          } else {
            showMessage(data.error, "red");
          }
        })
        .catch((error) => {
          showMessage("An error occurred, please try again.", "red");
        });
    }
  });

  function showMessage(message, color) {
    authMessage.textContent = message;
    authMessage.style.color = color;
    authMessage.style.display = "block";
  }

  function clearMessage() {
    authMessage.textContent = "";
    authMessage.style.display = "none";
  }
});
