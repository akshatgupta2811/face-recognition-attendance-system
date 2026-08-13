import React from 'react';
import { Users, UserCheck, Clock, CheckCircle2, Camera, UserPlus, CalendarPlus, Download, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { AttendanceStats, AttendanceRecord, Session } from '../types';

interface DashboardProps {
  stats: AttendanceStats;
  recentRecords: AttendanceRecord[];
  activeSessions: Session[];
  onNavigate: (tab: 'scanner' | 'students' | 'sessions' | 'reports') => void;
  onOpenAddStudent: () => void;
  onOpenCreateSession: () => void;
  onExportCsv: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  recentRecords,
  activeSessions,
  onNavigate,
  onOpenAddStudent,
  onOpenCreateSession,
  onExportCsv
}) => {
  // Weekly attendance trend demo data
  const trendData = [
    { day: 'Mon', Present: 22, Late: 2, Absent: 1 },
    { day: 'Tue', Present: 24, Late: 1, Absent: 0 },
    { day: 'Wed', Present: 21, Late: 3, Absent: 1 },
    { day: 'Thu', Present: 23, Late: 2, Absent: 0 },
    { day: 'Fri', Present: stats.onTimeCount || 20, Late: stats.lateCount || 3, Absent: stats.absentCount || 2 },
  ];

  const deptData = [
    { dept: 'CS', Present: 18, Total: 20 },
    { dept: 'EE', Present: 14, Total: 15 },
    { dept: 'DS', Present: 12, Total: 15 },
    { dept: 'IT', Present: 10, Total: 12 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-[#111] p-6 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">
            ATTENDANCE <span className="text-[#00FF41]">CONTROL</span>
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#888] mt-1">
            Real-time Biometric Face Recognition • Automated Logging & Sessions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('scanner')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#00FF41] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider hover:bg-[#00e038] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>Launch Scanner</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-[#333] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#00FF41]" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onOpenCreateSession}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-[#333] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#00FF41]" />
            <span>New Session</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-[#333] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00FF41]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#fff] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#888]">Students Enrolled</p>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">{stats.totalStudents}</h3>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-[#00FF41] mt-1 uppercase tracking-wider">
              <ArrowUpRight className="w-3 h-3" />
              <span>100% Biometric Verified</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Check-ins */}
        <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#888]">Today's Check-ins</p>
            <h3 className="text-3xl sm:text-4xl font-black text-[#00FF41] mt-1 tabular-nums">{stats.todayCheckIns}</h3>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-[#888] mt-1 uppercase tracking-wider">
              <span>Face AI & Manual Logs</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#1a2b1f] border border-[#00FF41]/30 flex items-center justify-center text-[#00FF41]">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#888]">Attendance Rate</p>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">{stats.attendanceRatePercentage}%</h3>
            <p className="text-[10px] font-mono text-[#888] mt-1 uppercase tracking-wider">
              ON-TIME: <span className="text-[#00FF41] font-bold">{stats.onTimeCount}</span> | LATE: <span className="text-amber-400 font-bold">{stats.lateCount}</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-[#00FF41]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#fff] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#888]">Active Sessions</p>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-1 tabular-nums">{stats.activeSessionsCount}</h3>
            <p className="text-[10px] font-mono text-[#888] mt-1 uppercase tracking-wider truncate max-w-[140px]">
              {activeSessions.length > 0 ? activeSessions[0].title : 'ALL CLOSED'}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-white">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Analytics Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trend Area Chart */}
        <div className="lg:col-span-2 bg-[#111] p-5 border border-[#222] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">ATTENDANCE WEEKLY TREND</h3>
              <p className="text-[10px] font-mono text-[#888] uppercase tracking-wider">Daily breakdown: Present vs Late vs Absent</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#00FF41] bg-[#1a2b1f] border border-[#00FF41]/40 px-2.5 py-1 uppercase tracking-widest">
              THIS WEEK
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF41" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="day" stroke="#666" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#666" fontSize={11} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="Present" stroke="#00FF41" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorLate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Recent Check-in Feed */}
        <div className="bg-[#111] p-5 border border-[#222] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#00FF41] animate-ping"></span>
                <span>LIVE FEED LOGS</span>
              </h3>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-[10px] font-mono text-[#00FF41] hover:underline font-bold uppercase tracking-wider cursor-pointer"
              >
                VIEW ALL →
              </button>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {recentRecords.length === 0 ? (
                <p className="text-xs font-mono text-[#666] text-center py-8 uppercase">No logs registered today.</p>
              ) : (
                recentRecords.slice(0, 5).map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-2.5 bg-[#0a0a0a] border border-[#222] hover:border-[#444] transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={rec.photoUrl}
                        alt={rec.studentName}
                        className="w-9 h-9 object-cover border border-[#00FF41]/40"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{rec.studentName}</p>
                        <p className="text-[10px] font-mono text-[#777] uppercase">{rec.department} • {rec.checkInTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                          rec.status === 'Present'
                            ? 'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                            : rec.status === 'Late'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                      <p className="text-[10px] font-mono text-[#00FF41] mt-0.5">{rec.confidenceScore}% MATCH</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#222] text-center">
            <button
              onClick={() => onNavigate('scanner')}
              className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#00FF41] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              START REAL-TIME SCAN →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
