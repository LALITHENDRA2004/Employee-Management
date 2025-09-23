// Password toggle for all toggle-password buttons
function addPasswordToggle() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const input = toggleBtn.parentElement.querySelector('input[type="password"], input[type="text"]');
      if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        input.type = 'password';
        toggleBtn.textContent = '👁️';
      }
    });
  });
}

// Flip container toggling, form handlers, and heading update
window.addEventListener('DOMContentLoaded', () => {
  addPasswordToggle(); // Activate toggle buttons on page load

  const flipContainer = document.getElementById('flip-container');
  const flipper = flipContainer.querySelector('.flipper');
  const headerTitle = document.getElementById('auth-title');

  function updateHeading() {
    if (flipper.classList.contains('show-signup')) {
      headerTitle.textContent = 'Create EMS Account';
    } else {
      headerTitle.textContent = 'EMS Login';
    }
  }

  // Show Signup form
  const showSignup = document.getElementById('show-signup');
  if (showSignup) {
    showSignup.addEventListener('click', function (e) {
      e.preventDefault();
      flipper.classList.add('show-signup');
      updateHeading();
    });
  }

  // Back to Login form
  const backToLogin = document.getElementById('back-to-login');
  if (backToLogin) {
    backToLogin.addEventListener('click', function (e) {
      e.preventDefault();
      flipper.classList.remove('show-signup');
      updateHeading();
    });
  }

  // Basic Login Form submission handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = this['userName'].value.trim();
      const password = this['password'].value.trim();
      if (!username) {
        alert('Please enter your username or email.');
        return;
      }
      if (!password) {
        alert('Please enter your password.');
        return;
      }
      
      signin();
    });
  }

  // Basic Signup Form submission handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = this['userName'].value.trim();
      const password = this['password'].value.trim();
      if (!username) {
        alert('Please enter a username or email to sign up.');
        return;
      }
      if (!password) {
        alert('Please enter a password to sign up.');
        return;
      }
      
      signup();
    });
  }

  // Initialize heading on page load
  updateHeading();
});

function signup() {
  const username = document.getElementById('signup-username-email').value;
  const password = document.getElementById('signup-password').value;

  fetch('http://localhost:8080/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({
      userName: username,
      password: password, 
    }),
  })
  .then(response => {
    if(response.ok) {
      return response.json(); 
    } else {
      return response.text().then(text => {throw new Error(text)});
    }
  })
  .then(data => {
    if(data.token) {
      localStorage.setItem('jwtToken', data.token); 
      localStorage.setItem('loggedInUser', username);
      alert('Signup successful. Redirecting...');
      window.location.href = 'http://127.0.0.1:5500/ems-frontend/mainPage.html';
    } else {
      alert('Signup successful but no token returned. Please login.');
      window.location.href = 'login.html';
    }
  })
  .catch(error => alert('Signup failed: ' + error.message));
}

function signin() {
  const username = document.getElementById('username-email').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({
      userName: username,
      password: password,
    }),
  })
    .then(response => response.json())
    .then(data => {
      try {
        if (data.token) {
          localStorage.setItem('jwtToken', data.token); 
          localStorage.setItem('loggedInUser', username);
          alert('Login successful. Redirecting...');
          window.location.href = 'http://127.0.0.1:5500/ems-frontend/mainPage.html';
        } else {
          alert('Invalid username or password.');
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    })
    .catch(error => alert('Error: ' + error.message));
}
