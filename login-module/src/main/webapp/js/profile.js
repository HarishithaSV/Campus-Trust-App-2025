document.addEventListener('DOMContentLoaded', async () => {
    ensureAuthenticated();
    await loadProfile();
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
});

async function loadProfile() {
    try {
        const profile = await ApiClient.get('/student/profile');
        if (!profile) {
            return;
        }

        document.getElementById('username').value = profile.username;
        document.getElementById('email').value = profile.email;
        document.getElementById('firstName').value = profile.firstName || '';
        document.getElementById('lastName').value = profile.lastName || '';
        document.getElementById('role').value = profile.role;
        document.getElementById('phoneNumber').value = profile.phoneNumber || '';
        document.getElementById('profilePictureUrl').value = profile.profilePictureUrl || '';
        TokenManager.setUser(profile);
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    clearErrors();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const profilePictureUrl = document.getElementById('profilePictureUrl').value.trim();

    if (!firstName) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        return;
    }

    if (!lastName) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        return;
    }

    if (phoneNumber && !Validator.phone(phoneNumber)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        return;
    }

    try {
        const updated = await ApiClient.put('/student/profile', {
            firstName,
            lastName,
            phoneNumber: phoneNumber || null,
            profilePictureUrl: profilePictureUrl || null
        });

        if (updated) {
            TokenManager.setUser(updated);
            NotificationManager.success('Profile updated successfully');
        }
    } catch (error) {
        console.error('Profile update failed:', error);
        NotificationManager.error('Unable to update profile. Please try again.');
    }
}
