// Register Page Script
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength indicator
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }

        // Password confirmation check
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }
    }
});

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthEl = document.getElementById('passwordStrength');

    if (!password) {
        strengthEl.textContent = '';
        return;
    }

    const strength = Validator.passwordStrength(password);
    strengthEl.className = `password-strength ${strength}`;
    
    const texts = {
        'weak': '⚠️ Weak password',
        'medium': '👌 Medium strength',
        'strong': '✅ Strong password'
    };
    
    strengthEl.textContent = texts[strength];
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmError = document.getElementById('confirmPasswordError');

    if (confirmPassword && password !== confirmPassword) {
        confirmError.textContent = 'Passwords do not match';
    } else {
        confirmError.textContent = '';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    clearErrors();

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        role: document.getElementById('role').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim()
    };

    // Validation
    if (!formData.firstName) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        return;
    }

    if (!formData.lastName) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        return;
    }

    if (!Validator.username(formData.username)) {
        document.getElementById('usernameError').textContent = 'Username must be at least 3 characters';
        return;
    }

    if (!Validator.email(formData.email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        return;
    }

    if (!Validator.password(formData.password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters';
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        return;
    }

    if (!formData.role) {
        document.getElementById('roleError').textContent = 'Please select a role';
        return;
    }

    if (formData.phoneNumber && !Validator.phone(formData.phoneNumber)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        return;
    }

    if (!document.getElementById('agreeTerms').checked) {
        document.getElementById('termsError').textContent = 'You must agree to the terms and conditions';
        return;
    }

    disableForm('registerForm', true);

    try {
        const registerData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            phoneNumber: formData.phoneNumber || null
        };

        const response = await ApiClient.post(AUTH_ENDPOINTS.REGISTER, registerData);

        if (response && response.accessToken) {
            // Store tokens and user info
            TokenManager.setTokens(response.accessToken, response.refreshToken);
            TokenManager.setUser(response.user);

            NotificationManager.success('Registration successful! Redirecting...');
            
            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = `/dashboard.html?role=${response.user.role}`;
            }, 1000);
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already exists')) {
            if (error.message.includes('Username')) {
                document.getElementById('usernameError').textContent = 'Username already exists';
            } else if (error.message.includes('Email')) {
                document.getElementById('emailError').textContent = 'Email already exists';
            }
        } else {
            NotificationManager.error('Registration failed: ' + error.message);
        }
    } finally {
        disableForm('registerForm', false);
    }
}
