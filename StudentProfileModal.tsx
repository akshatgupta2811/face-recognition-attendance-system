import React from 'react';
import { X, Mail, Phone, Building, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface StudentProfileModalProps {
  student: Student;
  attendanceHistory: AttendanceRecord[];
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  attendanceHistory,
  onClose
}) => {
  const studentLogs = attendanceHistory.filter(r => r.studentId === student.id);
  const totalLogs = studentLogs.length;
  const presentLogs = studentLogs.filter(r => r.status === 'Present').length;
  const lateLogs = studentLogs.filter(r => r.status === 'Late').length;

  const rate = totalLogs > 0 ? Math.round(((presentLogs + lateLogs) / totalLogs) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#333] max-w-xl w-full p-6 space-y-6 shadow-2xl animate-[fade-in_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222] pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#00FF41]" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">STUDENT BIOMETRIC PROFILE</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 bg-[#0a0a0a] p-5 border border-[#222]">
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-24 h-24 object-cover border-2 border-[#00FF41]"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-between">
              <h2 className="text-lg font-black text-white uppercase">{student.name}</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40 uppercase">
                {student.id}
              </span>
            </div>

            <p className="text-xs font-mono text-[#888] uppercase flex items-center justify-center sm:justify-start space-x-1.5">
              <Building className="w-3.5 h-3.5 text-[#666]" />
              <span>{student.department} • {student.batchClass}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-mono text-[#888] border-t border-[#222]">
              <div className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-[#666]" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#666]" />
                <span>{student.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#0a0a0a] p-3.5 border border-[#222] text-center space-y-1">
            <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">ATTENDANCE RATE</p>
            <p className="text-xl font-black text-[#00FF41]">{rate}%</p>
          </div>

          <div className="bg-[#0a0a0a] p-3.5 border border-[#222] text-center space-y-1">
            <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">ON-TIME LOGS</p>
            <p className="text-xl font-black text-white">{presentLogs}</p>
          </div>

          <div className="bg-[#0a0a0a] p-3.5 border border-[#222] text-center space-y-1">
            <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">LATE LOGS</p>
            <p className="text-xl font-black text-amber-400">{lateLogs}</p>
          </div>
        </div>

        {/* Attendance Timeline History */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#888] flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-[#00FF41]" />
            <span>ATTENDANCE AUDIT HISTORY</span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {studentLogs.length === 0 ? (
              <p className="text-xs font-mono text-[#666] uppercase text-center py-6">No attendance logs found for this student.</p>
            ) : (
              studentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#222] text-xs">
                  <div>
                    <p className="font-bold text-white uppercase">{log.sessionTitle}</p>
                    <p className="text-[10px] font-mono text-[#888]">{log.date} at {log.checkInTime}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                        log.status === 'Present'
                          ? 'bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40'
                          : log.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {log.status}
                    </span>
                    <p className="text-[10px] text-[#666] font-mono mt-0.5 uppercase">{log.method}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
