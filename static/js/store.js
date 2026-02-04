/**
 * Store.js
 * Handles data persistence using localStorage
 */

const STORAGE_KEY_STUDENTS = 'tracker_students';
const STORAGE_KEY_ATTENDANCE = 'tracker_attendance';

const Store = {
    // === Students ===
    getStudents() {
        const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
        return data ? JSON.parse(data) : [];
    },

    addStudent(student) {
        const students = this.getStudents();
        // Add ID if not present
        if (!student.id) {
            student.id = Date.now().toString();
        }
        students.push(student);
        localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
        return student;
    },

    deleteStudent(studentId) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== studentId);
        localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    },

    // === Attendance ===
    getAttendance() {
        const data = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
        return data ? JSON.parse(data) : {};
    },

    getAttendanceForDate(dateString) {
        const allAttendance = this.getAttendance();
        return allAttendance[dateString] || [];
    },

    saveAttendance(dateString, records) {
        const allAttendance = this.getAttendance();
        allAttendance[dateString] = records;
        localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(allAttendance));
    },

    // === Statistics ===
    getStats() {
        const students = this.getStudents();
        // Calculate something simple for now
        return {
            totalStudents: students.length,
        };
    }
};
