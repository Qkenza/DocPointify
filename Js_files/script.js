// Get modal elements
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const doctorBtn = document.getElementById('doctorBtn');
const assistantBtn = document.getElementById('assistantBtn');
const toggleAuthMode = document.getElementById('toggleAuthMode');
const authForm = document.getElementById('authForm');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authTitle = document.getElementById('authTitle');
const toggleText = document.getElementById('toggleText');

// Show the authentication modal with login or signup mode
function showAuthModal(mode) {
  authModal.style.display = "block";
  
  // Reset form
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  
  if (mode === 'login') {
    authTitle.textContent = "Login";
    authSubmitBtn.textContent = "Login";
    toggleText.innerHTML = "Don't have an account? <a href='javascript:void(0)' id='toggleAuthMode'>Sign Up</a>";
  } else {
    authTitle.textContent = "Sign Up";
    authSubmitBtn.textContent = "Sign Up";
    toggleText.innerHTML = "Already have an account? <a href='javascript:void(0)' id='toggleAuthMode'>Login</a>";
  }

  // Reattach the event listener for toggling between Login and Sign Up
  document.getElementById('toggleAuthMode').onclick = function() {
    if (authTitle.textContent === "Login") {
      showAuthModal('signup');
    } else {
      showAuthModal('login');
    }
  };
}

// Open the modal when Doctor or Assistant buttons are clicked
doctorBtn.onclick = function() {
  showAuthModal('login');
}

assistantBtn.onclick = function() {
  showAuthModal('login');
}

// Close the modal when the close button is clicked
closeAuthModal.onclick = function() {
  authModal.style.display = "none";
}

// Close the modal if clicked outside the modal content
window.onclick = function(event) {
  if (event.target === authModal) {
    authModal.style.display = "none";
  }
}

authForm.onsubmit = function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Check if the user is signing up or logging in
  if (authTitle.textContent === "Login") {
    console.log('Login with', username, password);
    // Handle login logic here
  } else {
    console.log('Sign Up with', username, password);
    // Handle signup logic here
  }

  // Close the modal after form submission
  authModal.style.display = "none";
};
