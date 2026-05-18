document.addEventListener('DOMContentLoaded', async () => {
    ensureAuthenticated();
    setupForm();
    await loadAttendance();
});

function setupForm() {
    const attendanceForm = document.getElementById('attendanceForm');
    attendanceForm.addEventListener('submit', handleAttendanceSubmit);

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;
}

async function loadAttendance() {
    try {
        const records = await ApiClient.get('/student/attendance');
        renderAttendance(records || []);
    } catch (error) {
        console.error('Failed to load attendance records:', error);
        NotificationManager.error('Unable to load attendance records.');
    }
}

function renderAttendance(records) {
    const list = document.getElementById('attendanceList');
    list.innerHTML = '';

    if (!records.length) {
        list.innerHTML = '<tr><td colspan="3">No attendance records yet.</td></tr>';
        return;
    }

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.status}</td>
            <td>${record.remark || '-'}</td>
        `;
        list.appendChild(row);
    });
}

async function handleAttendanceSubmit(event) {
    event.preventDefault();

    const date = document.getElementById('attendanceDate').value;
    const status = document.getElementById('attendanceStatus').value;
    const remark = document.getElementById('attendanceRemark').value.trim();

    if (!date) {
        NotificationManager.error('Attendance date is required.');
        return;
    }

    try {
        const attendance = await ApiClient.post('/student/attendance', {
            date,
            status,
            remark: remark || null
        });

        if (attendance) {
            NotificationManager.success('Attendance saved successfully.');
            await loadAttendance();
        }
    } catch (error) {
        console.error('Attendance save failed:', error);
        NotificationManager.error('Unable to save attendance.');
    }
}
