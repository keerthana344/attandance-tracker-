/**
 * App.js
 * Main Controller
 */

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
    loadDashboard();
    setupEventListeners();

    // Set default date to today
    const dateInput = document.getElementById('attendance-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
});

function setupEventListeners() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            const target = e.currentTarget; // use currentTarget to get the button
            target.classList.add('active');

            // Switch View
            const viewId = target.dataset.view;
            switchView(viewId);
        });
    });

    // Add Student Modal
    document.getElementById('btn-add-student').addEventListener('click', () => UI.toggleModal(true));
    document.querySelectorAll('.close-modal').forEach(el => {
        el.addEventListener('click', () => UI.toggleModal(false));
    });

    // Handle Add Student Form Submit
    document.getElementById('add-student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('student-name').value;
        const roll = document.getElementById('student-roll').value;

        Store.addStudent({ name, roll });
        UI.toggleModal(false);
        loadStudents(); // Refresh list
        loadDashboard(); // Refresh stats
        alert('Student Added!');
    });

    // Attendance Actions
    document.getElementById('btn-save-attendance').addEventListener('click', () => {
        const date = document.getElementById('attendance-date').value;
        if (!date) {
            alert('Please select a date');
            return;
        }

        const records = UI.getAttendanceDataFromTable();
        Store.saveAttendance(date, records);
        alert('Attendance Saved Successfully for ' + date);
        loadDashboard(); // Recalculate stats
    });

    document.getElementById('attendance-date').addEventListener('change', () => {
        loadAttendanceView();
    });

    document.getElementById('btn-mark-all-present').addEventListener('click', () => {
        const buttons = document.querySelectorAll('.status-btn.present');
        buttons.forEach(btn => btn.click());
    });
}

function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    // Show target
    document.getElementById(`view-${viewName}`).classList.add('active');

    // Load data for view
    if (viewName === 'students') {
        loadStudents();
    } else if (viewName === 'attendance') {
        loadAttendanceView();
    } else if (viewName === 'dashboard') {
        loadDashboard();
    }
}

function loadStudents() {
    const students = Store.getStudents();
    UI.renderStudentList(students, (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            Store.deleteStudent(id);
            loadStudents();
            loadDashboard();
        }
    });
}

function loadAttendanceView() {
    const students = Store.getStudents();
    const dateInput = document.getElementById('attendance-date');
    const date = dateInput.value; // yyyy-mm-dd

    // Load existing records for this date
    const records = Store.getAttendanceForDate(date);

    UI.renderAttendanceTable(students, records);
}

function loadDashboard() {
    const students = Store.getStudents();
    const total = students.length;

    // Get today's stats if available
    const today = new Date().toISOString().split('T')[0];
    const todaysRecords = Store.getAttendanceForDate(today);

    const presentCount = todaysRecords.filter(r => r.status === 'present').length;

    // Calculate rate (mock calculation for now based on today)
    let rate = 0;
    if (todaysRecords.length > 0) {
        rate = Math.round((presentCount / todaysRecords.length) * 100);
    }

    UI.refreshDashboard({
        totalStudents: total,
        presentToday: presentCount,
        rate: rate
    });
}
