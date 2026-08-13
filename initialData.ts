import { Student, Session, AttendanceRecord } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'STU-1001',
    name: 'Alex Rivera',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    email: 'alex.rivera@university.edu',
    phone: '+1 (555) 019-2834',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  },
  {
    id: 'STU-1002',
    name: 'Sophia Chen',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    email: 'sophia.chen@university.edu',
    phone: '+1 (555) 012-9876',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  },
  {
    id: 'STU-1003',
    name: 'Marcus Vance',
    department: 'Electrical Engineering',
    batchClass: 'EE-3B',
    email: 'marcus.vance@university.edu',
    phone: '+1 (555) 018-3344',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  },
  {
    id: 'STU-1004',
    name: 'Elena Rostova',
    department: 'Data Science',
    batchClass: 'DS-2A',
    email: 'elena.rostova@university.edu',
    phone: '+1 (555) 014-7722',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  },
  {
    id: 'STU-1005',
    name: 'David Kim',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    email: 'david.kim@university.edu',
    phone: '+1 (555) 016-5599',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  },
  {
    id: 'STU-1006',
    name: 'Aisha Patel',
    department: 'Information Technology',
    batchClass: 'IT-3A',
    email: 'aisha.patel@university.edu',
    phone: '+1 (555) 013-4411',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    enrolledAt: '2024-09-01',
    status: 'Active'
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'SES-201',
    title: 'Advanced AI & Machine Learning',
    subject: 'CS401',
    batchClass: 'CS-4A',
    department: 'Computer Science',
    instructor: 'Dr. Robert Vance',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    status: 'Active',
    totalStudents: 25,
    presentCount: 18,
    lateCount: 3,
    absentCount: 4
  },
  {
    id: 'SES-202',
    title: 'Database Architecture & Security',
    subject: 'DS302',
    batchClass: 'DS-2A',
    department: 'Data Science',
    instructor: 'Prof. Helen Carter',
    date: new Date().toISOString().split('T')[0],
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    status: 'Scheduled',
    totalStudents: 30,
    presentCount: 0,
    lateCount: 0,
    absentCount: 30
  },
  {
    id: 'SES-200',
    title: 'Embedded Systems & Robotics',
    subject: 'EE305',
    batchClass: 'EE-3B',
    department: 'Electrical Engineering',
    instructor: 'Dr. James Thorne',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    status: 'Completed',
    totalStudents: 20,
    presentCount: 18,
    lateCount: 1,
    absentCount: 1
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-9001',
    studentId: 'STU-1001',
    studentName: 'Alex Rivera',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    sessionId: 'SES-201',
    sessionTitle: 'Advanced AI & Machine Learning',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:58 AM',
    checkOutTime: '10:55 AM',
    status: 'Present',
    method: 'Face Recognition',
    confidenceScore: 98.4
  },
  {
    id: 'ATT-9002',
    studentId: 'STU-1002',
    studentName: 'Sophia Chen',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    sessionId: 'SES-201',
    sessionTitle: 'Advanced AI & Machine Learning',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:02 AM',
    checkOutTime: undefined,
    status: 'Present',
    method: 'Face Recognition',
    confidenceScore: 96.8
  },
  {
    id: 'ATT-9003',
    studentId: 'STU-1005',
    studentName: 'David Kim',
    department: 'Computer Science',
    batchClass: 'CS-4A',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    sessionId: 'SES-201',
    sessionTitle: 'Advanced AI & Machine Learning',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '09:18 AM',
    checkOutTime: undefined,
    status: 'Late',
    method: 'Face Recognition',
    confidenceScore: 94.2
  },
  {
    id: 'ATT-9004',
    studentId: 'STU-1003',
    studentName: 'Marcus Vance',
    department: 'Electrical Engineering',
    batchClass: 'EE-3B',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    sessionId: 'SES-200',
    sessionTitle: 'Embedded Systems & Robotics',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:02 AM',
    checkOutTime: '09:30 AM',
    status: 'Present',
    method: 'Manual Check-in',
    confidenceScore: 100.0
  }
];
