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
    const flipper = flipContainer ? flipContainer.querySelector('.flipper') : null;
    const headerTitle = document.getElementById('auth-title');

    function updateHeading() {
        if (!headerTitle) return;
        if (flipper && flipper.classList.contains('show-signup')) {
            headerTitle.textContent = 'Create EMS Account';
        } else if (document.getElementById('reset-password-form').style.display === 'block') {
            headerTitle.textContent = 'Reset Password';
        } else {
            headerTitle.textContent = 'EMS Login';
        }
    }

    // Show Signup form
    const showSignup = document.getElementById('show-signup');
    if (showSignup && flipper) {
        showSignup.addEventListener('click', function (e) {
            e.preventDefault();
            flipper.classList.add('show-signup');
            updateHeading();
        });
    }

    // Back to Login form
    const backToLogin = document.getElementById('back-to-login');
    if (backToLogin && flipper) {
        backToLogin.addEventListener('click', function (e) {
            e.preventDefault();
            flipper.classList.remove('show-signup');
            updateHeading();
        });
    }

    // Forgot Password link handle
    const forgotPasswordLink = document.querySelector('.text-links a[title="Forgot password link"]');
    const resetForm = document.getElementById('reset-password-form');
    const loginForm = document.getElementById('login-form');
    const backToLoginReset = document.getElementById('back-to-login-reset');

    if (forgotPasswordLink && loginForm && resetForm) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            resetForm.style.display = 'block';
            updateHeading();
        });
    }

    if (backToLoginReset && loginForm && resetForm) {
        backToLoginReset.addEventListener('click', function (e) {
            e.preventDefault();
            resetForm.style.display = 'none';
            loginForm.style.display = 'block';
            updateHeading();
        });
    }

    // Basic Login Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = this['userName'].value.trim();
            const password = this['password'].value.trim();
            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }
            signin(username, password);
        });
    }

    // Basic Signup Form submission handler
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = this['userName'].value.trim();
            const password = this['password'].value.trim();
            if (!username || !password) {
                alert('Please enter both username and password to sign up.');
                return;
            }
            signup(username, password);
        });
    }

    // Handle Reset Password Form Submission
    if (resetForm) {
        resetForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = this['userName'] ? this['userName'].value.trim() : document.getElementById('reset-username').value.trim();
            const newPassword = this['newPassword'] ? this['newPassword'].value.trim() : document.getElementById('reset-password').value.trim();

            if (!username || !newPassword) {
                alert('Please fill in both fields.');
                return;
            }

            fetch('https://employee-management-dcf9.onrender.com/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    newPassword: newPassword,
                }),
            })
                .then(response => {
                    if (response.ok) return response.json();
                    return response.text().then(text => { throw new Error(text) });
                })
                .then(data => {
                    alert('Password reset successful! You can now login with your new password.');
                    resetForm.style.display = 'none';
                    if (loginForm) loginForm.style.display = 'block';
                    updateHeading();
                })
                .catch(error => alert('Password reset failed: ' + error.message));
        });
    }

    // Initialize heading on page load
    updateHeading();
});

function signup(username, password) {
    fetch('https://employee-management-dcf9.onrender.com/auth/signup', {
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
            if (response.ok) return response.json();
            return response.text().then(text => { throw new Error(text) });
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('loggedInUser', username);
                alert('Signup successful. Redirecting...');
                window.location.href = 'mainPage.html';
            } else {
                alert('Signup successful but no token returned. Please login.');
                window.location.href = 'index.html';
            }
        })
        .catch(error => alert('Signup failed: ' + error.message));
}

function signin(username, password) {
    fetch('https://employee-management-dcf9.onrender.com/auth/signin', {
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
            if (response.ok) return response.json();
            throw new Error('Invalid username or password');
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('loggedInUser', username);
                alert('Login successful. Redirecting...');
                window.location.href = 'mainPage.html';
            }
        })
        .catch(error => alert('Error: ' + error.message));
}
