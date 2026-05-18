document.addEventListener('DOMContentLoaded', async () => {
    ensureAuthenticated();
    await loadDashboard();
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

async function loadDashboard() {
    try {
        const user = TokenManager.getUser();
        if (!user) {
            return handleLogout();
        }

        document.getElementById('welcomeText').textContent = `Welcome back, ${user.firstName || user.username}!`;
        document.getElementById('studentName').textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        document.getElementById('studentEmail').textContent = user.email;
        document.getElementById('studentRole').textContent = `Role: ${user.role}`;

        // Fetch latest profile details if the token is valid
        const profile = await ApiClient.get('/student/profile');
        if (profile) {
            TokenManager.setUser(profile);
            document.getElementById('studentName').textContent = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
            document.getElementById('studentEmail').textContent = profile.email;
            document.getElementById('studentRole').textContent = `Role: ${profile.role}`;
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        handleLogout();
    }
}

function handleLogout() {
    TokenManager.clearTokens();
    window.location.href = '/login.html';
}
