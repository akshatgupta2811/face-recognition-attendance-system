import React, { useState } from 'react';
import { FileSpreadsheet, Download, Filter, Printer, Calendar, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { AttendanceRecord, Student } from '../types';

interface ReportsAndExportProps {
  records: AttendanceRecord[];
  students: Student[];
  onExportCsv: () => void;
}

export const ReportsAndExport: React.FC<ReportsAndExportProps> = ({
  records,
  students,
  onExportCsv
}) => {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = records.filter(r => {
    const matchDept = departmentFilter === 'All' || r.department === departmentFilter;
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchDept && matchStatus;
  });

  const presentCount = filtered.filter(r => r.status === 'Present').length;
  const lateCount = filtered.filter(r => r.status === 'Late').length;
  const absentCount = filtered.filter(r => r.status === 'Absent').length;
  const totalCount = filtered.length;

  const presentRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const lateRate = totalCount > 0 ? Math.round((lateCount / totalCount) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#00FF41]" />
            <span>ATTENDANCE REPORTS & ANALYTICS</span>
          </h2>
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest mt-0.5">
            Generate summary metrics and export CSV data logs
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-[#333] font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#888]" />
            <span>PRINT REPORT</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center space-x-2 px-4 py-2 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>EXPORT CSV REPORT</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#111] p-4 border border-[#222] space-y-1">
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest">FILTERED LOGS</p>
          <h3 className="text-2xl font-black text-white">{totalCount}</h3>
        </div>

        <div className="bg-[#111] p-4 border border-[#222] border-l-2 border-l-[#00FF41] space-y-1">
          <p className="text-[10px] font-mono text-[#00FF41] uppercase tracking-widest flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PRESENT ON-TIME</span>
          </p>
          <h3 className="text-2xl font-black text-[#00FF41]">{presentCount} <span className="text-xs font-mono font-normal text-[#888]">({presentRate}%)</span></h3>
        </div>

        <div className="bg-[#111] p-4 border border-[#222] border-l-2 border-l-amber-400 space-y-1">
          <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>LATE CHECK-INS</span>
          </p>
          <h3 className="text-2xl font-black text-amber-400">{lateCount} <span className="text-xs font-mono font-normal text-[#888]">({lateRate}%)</span></h3>
        </div>

        <div className="bg-[#111] p-4 border border-[#222] border-l-2 border-l-rose-500 space-y-1">
          <p className="text-[10px] font-mono text-rose-400 uppercase tracking-widest flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>UNEXCUSED ABSENCES</span>
          </p>
          <h3 className="text-2xl font-black text-rose-400">{absentCount}</h3>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111] p-3 border border-[#222]">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#888]" />
          <span className="text-xs font-mono font-bold text-white uppercase">FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] text-xs text-white px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="Information Technology">Information Technology</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-[#222] text-xs text-white px-3 py-2 font-mono uppercase focus:outline-none focus:border-[#00FF41] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Report Detailed Table */}
      <div className="bg-[#111] border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#222] text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">
                <th className="py-3.5 px-4">STUDENT ID</th>
                <th className="py-3.5 px-4">STUDENT NAME</th>
                <th className="py-3.5 px-4">DEPARTMENT & CLASS</th>
                <th className="py-3.5 px-4">SESSION TITLE</th>
                <th className="py-3.5 px-4">CHECK-IN TIME</th>
                <th className="py-3.5 px-4">RECOGNITION METHOD</th>
                <th className="py-3.5 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-xs">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#161616]">
                  <td className="py-3 px-4 font-mono font-bold text-[#00FF41]">{rec.studentId}</td>
                  <td className="py-3 px-4 font-black text-white uppercase">{rec.studentName}</td>
                  <td className="py-3 px-4 font-mono text-[#888] uppercase">{rec.department} ({rec.batchClass})</td>
                  <td className="py-3 px-4 font-bold text-[#ccc] uppercase">{rec.sessionTitle}</td>
                  <td className="py-3 px-4 font-mono text-[#00FF41] font-bold">{rec.checkInTime}</td>
                  <td className="py-3 px-4 font-mono text-[#888] uppercase">{rec.method} ({rec.confidenceScore}%)</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                        rec.status === 'Present'
                          ? 'bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40'
                          : rec.status === 'Late'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
