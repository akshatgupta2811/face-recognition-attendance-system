export type AttendanceStatus = 'Present' | 'Late' | 'Absent';

export type RecognitionMethod = 'Face Recognition' | 'Manual Check-in' | 'Image Upload';

export interface Student {
  id: string; // e.g. "STU-1001"
  name: string;
  department: string;
  batchClass: string;
  email: string;
  phone: string;
  photoUrl: string; // Base64 or image URL
  faceDescriptor?: number[]; // Feature vector representation
  enrolledAt: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  batchClass: string;
  photoUrl: string;
  sessionId: string;
  sessionTitle: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM:SS AM/PM
  checkOutTime?: string;
  status: AttendanceStatus;
  method: RecognitionMethod;
  confidenceScore: number; // 0 - 100
  notes?: string;
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  batchClass: string;
  department: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Scheduled' | 'Completed';
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
}

export interface FaceMatchResult {
  matchedStudent: Student | null;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isSpoof?: boolean;
  message?: string;
  detectedAttributes?: {
    expression?: string;
    wearingGlasses?: boolean;
    lightingQuality?: string;
  };
}

export interface AttendanceStats {
  totalStudents: number;
  todayCheckIns: number;
  onTimeCount: number;
  lateCount: number;
  absentCount: number;
  attendanceRatePercentage: number;
  activeSessionsCount: number;
}
