/**
 * UI.js
 * Handles DOM manipulation and rendering
 */

const UI = {
    // Selectors
    elements: {
        studentList: document.getElementById('students-list'),
        attendanceList: document.getElementById('attendance-list'),
        statsTotal: document.getElementById('total-students-count'),
        statsPresent: document.getElementById('present-today-count'),
        statsRate: document.getElementById('attendance-rate'),
        currentDate: document.getElementById('current-date'),
        modal: document.getElementById('modal-overlay'),
        addStudentForm: document.getElementById('add-student-form'),
    },

    init() {
        // Set today's date in header
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        this.elements.currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    },

    refreshDashboard(stats) {
        this.elements.statsTotal.textContent = stats.totalStudents;
        this.elements.statsPresent.textContent = stats.presentToday || 0;
        this.elements.statsRate.textContent = stats.rate ? `${stats.rate}%` : '0%';
    },

    renderStudentList(students, onDelete) {
        const list = this.elements.studentList;
        list.innerHTML = '';

        if (students.length === 0) {
            list.innerHTML = '<div class="empty-state">No students added yet.</div>';
            return;
        }

        students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="student-info">
                    <h4>${student.name}</h4>
                    <p>Roll No: ${student.roll}</p>
                </div>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${student.id}">Delete</button>
            `;

            // Event listener for delete
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => onDelete(student.id));

            list.appendChild(card);
        });
    },

    renderAttendanceTable(students, attendanceRecords = []) {
        const tbody = this.elements.attendanceList;
        tbody.innerHTML = '';

        students.forEach(student => {
            // Find existing status if any
            const record = attendanceRecords.find(r => r.studentId === student.id);
            const currentStatus = record ? record.status : 'present'; // Default to present or null?

            const row = document.createElement('tr');
            row.dataset.studentId = student.id;

            row.innerHTML = `
                <td><strong>${student.name}</strong></td>
                <td>${student.roll}</td>
                <td>
                    <div class="status-btn-group">
                        <button type="button" class="status-btn present ${currentStatus === 'present' ? 'active' : ''}" data-status="present">Present</button>
                        <button type="button" class="status-btn absent ${currentStatus === 'absent' ? 'active' : ''}" data-status="absent">Absent</button>
                        <button type="button" class="status-btn late ${currentStatus === 'late' ? 'active' : ''}" data-status="late">Late</button>
                    </div>
                </td>
            `;

            // Attach toggle logic
            const buttons = row.querySelectorAll('.status-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active from all siblings
                    buttons.forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    e.target.classList.add('active');
                });
            });

            tbody.appendChild(row);
        });
    },

    getAttendanceDataFromTable() {
        const rows = this.elements.attendanceList.querySelectorAll('tr');
        const records = [];

        rows.forEach(row => {
            const studentId = row.dataset.studentId;
            const activeBtn = row.querySelector('.status-btn.active');
            // If no button is active (shouldn't happen with default), default to 'absent' or skip?
            // Let's assume one is always active or if not, we skip
            if (activeBtn) {
                records.push({
                    studentId,
                    status: activeBtn.dataset.status
                });
            }
        });

        return records;
    },

    toggleModal(isOpen) {
        if (isOpen) {
            this.elements.modal.classList.add('open');
        } else {
            this.elements.modal.classList.remove('open');
            this.elements.addStudentForm.reset();
        }
    }
};
