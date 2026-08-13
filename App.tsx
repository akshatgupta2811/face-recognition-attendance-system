import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RecognitionCamera } from './components/RecognitionCamera';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceTable } from './components/AttendanceTable';
import { SessionManagement } from './components/SessionManagement';
import { ReportsAndExport } from './components/ReportsAndExport';
import { StudentProfileModal } from './components/StudentProfileModal';
import { Student, Session, AttendanceRecord, AttendanceStats, AttendanceStatus } from './types';
import { LayoutDashboard, Camera, Users, ClipboardCheck, Calendar, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    todayCheckIns: 0,
    onTimeCount: 0,
    lateCount: 0,
    absentCount: 0,
    attendanceRatePercentage: 100,
    activeSessionsCount: 0
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // FETCH DATA FROM REST API
  const fetchData = useCallback(async () => {
    try {
      const [stuRes, sesRes, attRes, statRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/sessions'),
        fetch('/api/attendance'),
        fetch('/api/stats')
      ]);

      if (stuRes.ok) setStudents(await stuRes.json());
      if (sesRes.ok) setSessions(await sesRes.json());
      if (attRes.ok) setAttendanceRecords(await attRes.json());
      if (statRes.ok) setStats(await statRes.json());
    } catch (err) {
      console.error('Error fetching API data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeSession = sessions.find(s => s.status === 'Active') || null;

  // HANDLERS FOR STUDENT CRUD
  const handleAddStudent = async (studentData: Partial<Student>) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  const handleEditStudent = async (student: Student) => {
    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error editing student:', err);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    try {
      const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      fetchData();
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      fetchData();
    }
  };

  const handleDeleteAttendanceRecord = async (recordId: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
    try {
      const res = await fetch(`/api/attendance/${recordId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error deleting attendance record:', err);
      fetchData();
    }
  };

  // HANDLERS FOR SESSIONS
  const handleCreateSession = async (sessionData: Partial<Session>) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  const handleUpdateSessionStatus = async (sessionId: string, status: 'Active' | 'Scheduled' | 'Completed') => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating session:', err);
    }
  };

  // HANDLER FOR ATTENDANCE LOGGING
  const handleLogAttendance = async (recordData: Partial<AttendanceRecord>) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recordData,
          sessionId: recordData.sessionId || (activeSession ? activeSession.id : undefined)
        })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error logging attendance:', err);
    }
  };

  const handleUpdateRecordStatus = async (id: string, status: AttendanceStatus, checkOutTime?: string) => {
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, checkOutTime })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating record status:', err);
    }
  };

  // CSV EXPORT GENERATOR
  const handleExportCsv = () => {
    if (attendanceRecords.length === 0) {
      alert('No attendance records available to export.');
      return;
    }

    const headers = ['Record ID', 'Student ID', 'Student Name', 'Department', 'Class', 'Session', 'Date', 'Check In Time', 'Check Out Time', 'Status', 'Method', 'Confidence Score'];
    const rows = attendanceRecords.map(r => [
      r.id,
      r.studentId,
      `"${r.studentName}"`,
      `"${r.department}"`,
      r.batchClass,
      `"${r.sessionTitle}"`,
      r.date,
      r.checkInTime,
      r.checkOutTime || 'N/A',
      r.status,
      r.method,
      `${r.confidenceScore}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeSession={activeSession}
        cameraActive={activeTab === 'scanner'}
        onOpenScanner={() => setActiveTab('scanner')}
      />

      <div className="flex flex-1">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeSessionCount={sessions.filter(s => s.status === 'Active').length}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentRecords={attendanceRecords}
              activeSessions={sessions.filter(s => s.status === 'Active')}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddStudent={() => setActiveTab('students')}
              onOpenCreateSession={() => setActiveTab('sessions')}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'scanner' && (
            <RecognitionCamera
              students={students}
              onLogAttendance={handleLogAttendance}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement
              students={students}
              onAddStudent={handleAddStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onSelectStudent={(stu) => setSelectedStudent(stu)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceTable
              records={attendanceRecords}
              students={students}
              sessions={sessions}
              onLogManualAttendance={handleLogAttendance}
              onUpdateRecordStatus={handleUpdateRecordStatus}
              onDeleteRecord={handleDeleteAttendanceRecord}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionManagement
              sessions={sessions}
              onCreateSession={handleCreateSession}
              onUpdateSessionStatus={handleUpdateSessionStatus}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAndExport
              records={attendanceRecords}
              students={students}
              onExportCsv={handleExportCsv}
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 flex items-center justify-around md:hidden z-40">
        {[
          { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
          { id: 'scanner', label: 'Scan', icon: Camera },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'attendance', label: 'Logs', icon: ClipboardCheck },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-semibold transition-all ${
                isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          attendanceHistory={attendanceRecords}
          onClose={() => setSelectedStudent(null)}
        />
      )}

    </div>
  );
}
