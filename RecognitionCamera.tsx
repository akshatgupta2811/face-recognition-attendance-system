import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, ShieldCheck, Sparkles, UserCheck, AlertCircle, Upload, CheckCircle2, Scan, Eye } from 'lucide-react';
import { Student, AttendanceRecord, FaceMatchResult } from '../types';
import { detectFaceOnCanvas, captureVideoFrameBase64, verifyFaceMatch } from '../utils/faceMatching';
import { sounds } from '../utils/audio';

interface RecognitionCameraProps {
  students: Student[];
  onLogAttendance: (record: Partial<AttendanceRecord>) => void;
}

export const RecognitionCamera: React.FC<RecognitionCameraProps> = ({ students, onLogAttendance }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mode, setMode] = useState<'live' | 'upload'>('live');

  const [autoScan, setAutoScan] = useState<boolean>(true);
  const [useAiVerification, setUseAiVerification] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [lastMatch, setLastMatch] = useState<FaceMatchResult | null>(null);
  const [matchNotification, setMatchNotification] = useState<{
    student: Student;
    confidence: number;
    action: string;
    time: string;
  } | null>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadResults, setUploadResults] = useState<{
    totalFacesDetected: number;
    matchedStudents: { studentId: string; studentName: string; confidence: number; department: string }[];
  } | null>(null);

  // Cooldown map so same student isn't logged continuously
  const lastLoggedMap = useRef<Record<string, number>>({});

  // START CAMERA
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err.name !== 'AbortError' && !err.message?.includes('interrupted')) {
              console.warn('Camera video play error:', err);
            }
          });
        }
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. Please grant camera permissions in browser.');
      setCameraActive(false);
    }
  };

  // STOP CAMERA
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (mode === 'live') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode]);

  // PERFORM FACE RECOGNITION SCAN
  const performRecognition = useCallback(async () => {
    if (!videoRef.current || isProcessing || !cameraActive) return;

    setIsProcessing(true);
    try {
      const capturedBase64 = captureVideoFrameBase64(videoRef.current);
      const matchResult = await verifyFaceMatch(capturedBase64, students, useAiVerification);
      setLastMatch(matchResult);

      if (matchResult.matchedStudent) {
        const student = matchResult.matchedStudent;
        const now = Date.now();
        const lastLoggedTime = lastLoggedMap.current[student.id] || 0;

        // 10-second cooldown per student
        if (now - lastLoggedTime > 10000) {
          lastLoggedMap.current[student.id] = now;
          sounds.playSuccessPing();

          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          onLogAttendance({
            studentId: student.id,
            status: 'Present',
            method: 'Face Recognition',
            confidenceScore: matchResult.confidence
          });

          setMatchNotification({
            student,
            confidence: matchResult.confidence,
            action: 'Attendance Verified',
            time: nowTime
          });

          // Auto hide banner after 5s
          setTimeout(() => setMatchNotification(null), 5000);
        }
      }
    } catch (err) {
      console.error('Recognition error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, cameraActive, students, useAiVerification, onLogAttendance]);

  // CONTINUOUS LIVE CAMERA FRAME DRAWING & AUTO-SCANNER
  useEffect(() => {
    let animFrameId: number;
    let scanIntervalId: NodeJS.Timeout;

    const renderLoop = () => {
      if (videoRef.current && canvasRef.current && cameraActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Clear previous frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Detect face region
          const det = detectFaceOnCanvas(video, canvas);

          if (det.hasFace) {
            // Draw Target Bounding Box
            ctx.strokeStyle = '#06b6d4'; // Cyan
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            ctx.strokeRect(det.x, det.y, det.width, det.height);
            ctx.setLineDash([]);

            // Target Corners
            const cornerLen = 20;
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 4;

            // Top-left corner
            ctx.beginPath();
            ctx.moveTo(det.x, det.y + cornerLen);
            ctx.lineTo(det.x, det.y);
            ctx.lineTo(det.x + cornerLen, det.y);
            ctx.stroke();

            // Top-right corner
            ctx.beginPath();
            ctx.moveTo(det.x + det.width - cornerLen, det.y);
            ctx.lineTo(det.x + det.width, det.y);
            ctx.lineTo(det.x + det.width, det.y + cornerLen);
            ctx.stroke();

            // Bottom-left corner
            ctx.beginPath();
            ctx.moveTo(det.x, det.y + det.height - cornerLen);
            ctx.lineTo(det.x, det.y + det.height);
            ctx.lineTo(det.x + cornerLen, det.y + det.height);
            ctx.stroke();

            // Bottom-right corner
            ctx.beginPath();
            ctx.moveTo(det.x + det.width - cornerLen, det.y + det.height);
            ctx.lineTo(det.x + det.width, det.y + det.height);
            ctx.lineTo(det.x + det.width, det.y + det.height - cornerLen);
            ctx.stroke();

            // Label Box
            if (lastMatch?.matchedStudent) {
              const label = `${lastMatch.matchedStudent.name} (${lastMatch.confidence}%)`;
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(det.x, det.y - 30, ctx.measureText(label).width + 20, 26);
              ctx.fillStyle = '#38bdf8';
              ctx.font = 'bold 13px sans-serif';
              ctx.fillText(label, det.x + 10, det.y - 12);
            }
          }
        }
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };

    if (cameraActive) {
      animFrameId = requestAnimationFrame(renderLoop);
      if (autoScan) {
        scanIntervalId = setInterval(() => {
          performRecognition();
        }, 3000); // Trigger auto-recognition every 3s
      }
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      if (scanIntervalId) clearInterval(scanIntervalId);
    };
  }, [cameraActive, autoScan, performRecognition, lastMatch]);

  // HANDLE PHOTO UPLOAD RECOGNITION
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      setIsProcessing(true);

      try {
        const res = await fetch('/api/recognition/photo-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        if (res.ok) {
          const data = await res.json();
          setUploadResults(data);

          // Log attendance for matched students
          if (data.matchedStudents && Array.isArray(data.matchedStudents)) {
            data.matchedStudents.forEach((m: any) => {
              onLogAttendance({
                studentId: m.studentId,
                status: 'Present',
                method: 'Image Upload',
                confidenceScore: m.confidence || 95.0
              });
            });
            sounds.playSuccessPing();
          }
        }
      } catch (err) {
        console.error('Upload recognition failed:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Selector */}
      <div className="bg-[#111] p-5 border border-[#222] border-l-4 border-l-[#00FF41] flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center space-x-2">
            <Scan className="w-5 h-5 text-[#00FF41]" />
            <span>BIOMETRIC FACE RECOGNITION ENGINE</span>
          </h2>
          <p className="text-[10px] font-mono text-[#888] uppercase tracking-widest mt-1">
            Real-time video stream scanning • Neural landmark verification
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-[#0a0a0a] p-1 border border-[#222]">
          <button
            onClick={() => setMode('live')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'live'
                ? 'bg-[#00FF41] text-[#0a0a0a]'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>LIVE SCANNER</span>
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#00FF41] text-[#0a0a0a]'
                : 'text-[#888] hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>PHOTO UPLOAD</span>
          </button>
        </div>
      </div>

      {mode === 'live' ? (
        /* LIVE CAMERA VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Viewport */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#222] p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[420px]">
            
            {cameraError ? (
              <div className="text-center p-8 space-y-4 max-w-md">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <p className="text-xs font-mono text-[#ccc] uppercase">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white border border-[#444] text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  RETRY CAMERA ACCESS
                </button>
              </div>
            ) : (
              <div className="relative w-full max-w-2xl aspect-video overflow-hidden bg-[#111] border border-[#222]">
                
                {/* Video Element */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Face Overlay Canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />

                {/* Animated Scanner Grid overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none border border-[#00FF41]/20 overflow-hidden">
                    <div className="w-full h-1 bg-[#00FF41] shadow-[0_0_10px_#00FF41] animate-[pulse_2s_infinite]" />
                  </div>
                )}

                {/* Status Overlay Badge */}
                <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 px-3 py-1.5 border border-[#333] text-xs flex items-center space-x-2 text-white font-mono">
                  <span className={`w-2 h-2 ${cameraActive ? 'bg-[#00FF41] animate-ping' : 'bg-rose-500'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    {cameraActive ? (autoScan ? 'AUTO-SCANNING' : 'CAMERA READY') : 'OFFLINE'}
                  </span>
                </div>

                {/* AI Verification Badge */}
                <div className="absolute top-3 right-3 bg-[#0a0a0a]/90 px-3 py-1.5 border border-[#333] text-xs flex items-center space-x-1.5 text-[#00FF41] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>GEMINI 3.6 VISION</span>
                </div>

              </div>
            )}

            {/* Controls Bar */}
            <div className="mt-4 w-full flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#222]">
              <div className="flex items-center space-x-3">
                <button
                  onClick={cameraActive ? stopCamera : startCamera}
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    cameraActive
                      ? 'bg-[#1a1a1a] text-rose-400 border-rose-500/40 hover:bg-[#252525]'
                      : 'bg-[#00FF41] text-[#0a0a0a] border-[#00FF41]'
                  }`}
                >
                  {cameraActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  <span>{cameraActive ? 'STOP CAMERA' : 'START CAMERA'}</span>
                </button>

                <button
                  onClick={() => setAutoScan(!autoScan)}
                  disabled={!cameraActive}
                  className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                    autoScan
                      ? 'bg-[#1a2b1f] text-[#00FF41] border-[#00FF41]/40'
                      : 'bg-[#111] text-[#666] border-[#333] hover:text-white'
                  }`}
                >
                  AUTO-SCAN: {autoScan ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={performRecognition}
                  disabled={!cameraActive || isProcessing}
                  className="flex items-center space-x-2 px-5 py-2 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] disabled:opacity-50 font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span>{isProcessing ? 'ANALYZING...' : 'SCAN & LOG'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Side Feedback & Matched Banner Panel */}
          <div className="space-y-4">
            
            {/* Last Match Notification Box */}
            {matchNotification ? (
              <div className="bg-[#111] p-5 border border-[#00FF41] border-l-4 border-l-[#00FF41] space-y-4 animate-[fade-in_0.3s_ease-out]">
                <div className="flex items-center justify-between border-b border-[#222] pb-3">
                  <div className="flex items-center space-x-2 text-[#00FF41]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-wider">ATTENDANCE VERIFIED</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#00FF41] font-bold">{matchNotification.time}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={matchNotification.student.photoUrl}
                    alt={matchNotification.student.name}
                    className="w-16 h-16 object-cover border-2 border-[#00FF41]"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white uppercase">{matchNotification.student.name}</h4>
                    <p className="text-xs font-mono text-[#888]">{matchNotification.student.id} • {matchNotification.student.department}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40 uppercase">
                        {matchNotification.confidence}% MATCH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111] p-5 border border-[#222] text-center py-8 space-y-2">
                <Eye className="w-8 h-8 text-[#444] mx-auto" />
                <h4 className="text-xs font-black text-[#888] uppercase tracking-widest">SCANNER STANDBY</h4>
                <p className="text-[10px] font-mono text-[#666] max-w-xs mx-auto uppercase">
                  Position face in front of the lens for instant biometric verification.
                </p>
              </div>
            )}

            {/* Verification Settings Card */}
            <div className="bg-[#111] p-5 border border-[#222] space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
                <span>DETECTION PARAMETERS</span>
              </h4>

              <div className="flex items-center justify-between text-xs py-2 border-b border-[#222]">
                <span className="text-[#888] uppercase font-mono text-[11px]">SPOOF PREVENTION</span>
                <input
                  type="checkbox"
                  checked={useAiVerification}
                  onChange={(e) => setUseAiVerification(e.target.checked)}
                  className="rounded bg-[#0a0a0a] border-[#333] text-[#00FF41] focus:ring-[#00FF41] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-[#888] uppercase font-mono text-[11px]">VERIFIED RECORDS</span>
                <span className="font-mono font-bold text-[#00FF41]">{students.length} ENROLLED</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* PHOTO UPLOAD MODE */
        <div className="bg-[#111] p-6 border border-[#222] space-y-6">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="border-2 border-dashed border-[#333] hover:border-[#00FF41] p-8 bg-[#0a0a0a] transition-all">
              <Upload className="w-12 h-12 text-[#00FF41] mx-auto mb-3" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">UPLOAD CLASS OR GROUP PHOTO</h3>
              <p className="text-xs font-mono text-[#888] mt-1 mb-4 uppercase">
                Batch scan multiple student faces simultaneously with Gemini AI
              </p>

              <label className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#00FF41] hover:bg-[#00e038] text-[#0a0a0a] font-black uppercase tracking-wider text-xs cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                <Camera className="w-4 h-4" />
                <span>SELECT IMAGE FILE</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {uploadedImage && (
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#888]">UPLOAD PREVIEW:</h4>
                <img src={uploadedImage} alt="Uploaded preview" className="w-full max-h-72 object-contain border border-[#222]" />
              </div>
            )}

            {uploadResults && (
              <div className="bg-[#0a0a0a] p-5 border border-[#222] text-left space-y-3">
                <div className="flex items-center justify-between border-b border-[#222] pb-2">
                  <span className="text-xs font-black text-white uppercase">ANALYSIS REPORT</span>
                  <span className="text-xs font-mono text-[#00FF41] font-bold">{uploadResults.totalFacesDetected} FACES DETECTED</span>
                </div>

                <div className="space-y-2">
                  {uploadResults.matchedStudents.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#111] border border-[#222] text-xs">
                      <div>
                        <p className="font-bold text-white uppercase">{m.studentName}</p>
                        <p className="text-[10px] font-mono text-[#888]">{m.studentId} • {m.department}</p>
                      </div>
                      <span className="px-2 py-0.5 font-mono font-bold text-[10px] bg-[#1a2b1f] text-[#00FF41] border border-[#00FF41]/40 uppercase">
                        {m.confidence}% MATCH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
