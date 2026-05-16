// Login Page Script
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const usernameOrEmail = document.getElementById('usernameOrEmail').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!usernameOrEmail) {
        document.getElementById('usernameError').textContent = 'Username or email is required';
        return;
    }

    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        return;
    }

    disableForm('loginForm', true);

    try {
        const response = await ApiClient.post(AUTH_ENDPOINTS.LOGIN, {
            usernameOrEmail,
            password
        });

        if (response && response.accessToken) {
            // Store tokens and user info
            TokenManager.setTokens(response.accessToken, response.refreshToken);
            TokenManager.setUser(response.user);

            // Check remember me
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberedUsername', usernameOrEmail);
            }

            NotificationManager.success('Login successful!');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = `/dashboard.html?role=${response.user.role}`;
            }, 1000);
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error.message.includes('not found')) {
            NotificationManager.error('User not found. Please register first.');
        } else if (error.message.includes('Invalid password')) {
            NotificationManager.error('Invalid password. Please try again.');
        } else if (error.message.includes('not active')) {
            NotificationManager.error('Your account has been suspended. Contact support.');
        } else {
            NotificationManager.error('Login failed: ' + error.message);
        }
    } finally {
        disableForm('loginForm', false);
    }
}

// Load remembered username
window.addEventListener('load', function() {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('usernameOrEmail').value = rememberedUsername;
        document.getElementById('rememberMe').checked = true;
    }
});
