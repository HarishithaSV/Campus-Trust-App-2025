// Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    HEALTH: '/auth/health',
    PROFILE: '/student/profile',
    ATTENDANCE: '/student/attendance'
};

// Token Storage
const TokenManager = {
    getAccessToken: () => localStorage.getItem('accessToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },
    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    isAuthenticated: () => !!localStorage.getItem('accessToken')
};

// API Helper
const ApiClient = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const accessToken = TokenManager.getAccessToken();
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Handle 401 - Token expired
            if (response.status === 401 && endpoint !== AUTH_ENDPOINTS.LOGIN) {
                const refreshToken = TokenManager.getRefreshToken();
                if (refreshToken) {
                    const refreshed = await this.refreshAccessToken(refreshToken);
                    if (refreshed) {
                        return this.request(endpoint, options);
                    }
                }
                TokenManager.clearTokens();
                window.location.href = '/login.html';
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'GET'
        });
    },

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE'
        });
    },

    async refreshAccessToken(refreshToken) {
        try {
            const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                TokenManager.setTokens(data.accessToken, data.refreshToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }
};

// Notification Helper
const NotificationManager = {
    show: (message, type = 'info', duration = 5000) => {
        const container = document.getElementById('alertContainer');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, duration);
    },

    success: (message) => NotificationManager.show(message, 'success'),
    error: (message) => NotificationManager.show(message, 'error'),
    warning: (message) => NotificationManager.show(message, 'warning'),
    info: (message) => NotificationManager.show(message, 'info')
};

// Validation Helper
const Validator = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    password: (password) => {
        return password && password.length >= 8;
    },

    username: (username) => {
        return username && username.length >= 3;
    },

    phone: (phone) => {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return phone ? regex.test(phone) : true;
    },

    passwordStrength: (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        return strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong';
    }
};

// Utility Functions
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function togglePasswordVisibility(inputId = 'password') {
    const input = document.getElementById(inputId);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
}

function disableForm(formId, disabled) {
    const form = document.getElementById(formId);
    const button = form.querySelector('button[type="submit"]');
    const spinner = button.querySelector('.spinner');
    
    form.querySelectorAll('input, select, button').forEach(el => {
        el.disabled = disabled;
    });

    if (disabled) {
        spinner.style.display = 'inline-block';
        button.querySelector('.btn-text').style.display = 'none';
    } else {
        spinner.style.display = 'none';
        button.querySelector('.btn-text').style.display = 'inline';
    }
}

// Check Authentication Status for login/register pages
function checkAuthStatus() {
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('/login.html') || path.endsWith('/register.html');
    if (TokenManager.isAuthenticated() && isAuthPage) {
        window.location.href = '/dashboard.html';
    }
}

function ensureAuthenticated() {
    if (!TokenManager.isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

// OAuth Placeholder Functions (implement with actual OAuth providers)
function loginWithGoogle() {
    NotificationManager.warning('Google login coming soon!');
    // Implement Google OAuth login
}

function loginWithGithub() {
    NotificationManager.warning('GitHub login coming soon!');
    // Implement GitHub OAuth login
}
