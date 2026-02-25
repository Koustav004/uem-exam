import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudents } from '../data';
import { useExams } from '../context/ExamContext';
import { ArrowLeft, Users, Play, Square, Edit3, Search, Filter, RefreshCw, Eye, X, Monitor, Clock } from 'lucide-react';
import { api } from '../services/api'; // Import API service

export default function ExamClassroom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exams, updateExam } = useExams();
  const exam = exams.find(e => e.id === id);
  
  // Local state for timer
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  // Student Monitor State
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const isActive = exam?.status === 'Active';

  // API Integration: Fetch Monitor Data
  /*
  useEffect(() => {
    const fetchMonitorData = async () => {
      if (id && isActive) {
        try {
          const data = await api.monitor.getExamStatus(id);
          // Update students with real-time data
          // setStudents(data.students);
        } catch (error) {
          console.error('Failed to fetch monitor data:', error);
        }
      }
    };
    // Poll every 5 seconds
    const interval = setInterval(fetchMonitorData, 5000);
    return () => clearInterval(interval);
  }, [id, isActive]);
  */

  // Initialize timer when exam becomes active
  useEffect(() => {
    if (isActive && exam && timeLeft === 0) {
      // If just activated, set time based on duration (in seconds)
      // In a real app, this would calculate difference from start time
      setTimeLeft(parseInt(exam.duration) * 60);
    }
  }, [isActive, exam]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up
            handleEndExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Simulate polling for student status
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setStudents(prev => prev.map(s => ({
        ...s,
        status: Math.random() > 0.8 ? 
          ['Active', 'Suspicious', 'Offline', 'Camera Off', 'Tab Switch'][Math.floor(Math.random() * 5)] as any 
          : s.status
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartExam = async () => {
    if (exam) {
      // API Integration: Start Exam
      /*
      try {
        await api.exams.update(exam.id, { status: 'Active' });
        updateExam({ ...exam, status: 'Active' });
      } catch (error) {
        console.error('Failed to start exam:', error);
      }
      */
      updateExam({ ...exam, status: 'Active' });
      setTimeLeft(parseInt(exam.duration) * 60);
    }
  };

  const handleEndExam = async () => {
    if (exam) {
      // API Integration: End Exam
      /*
      try {
        await api.exams.update(exam.id, { status: 'Completed' });
        updateExam({ ...exam, status: 'Completed' });
      } catch (error) {
        console.error('Failed to end exam:', error);
      }
      */
      updateExam({ ...exam, status: 'Completed' });
      setTimeLeft(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Suspicious': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Camera Off': return 'bg-red-100 text-red-800 border-red-200';
      case 'Tab Switch': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = id ? s.examId === id : true;
    return matchesSearch && matchesExam;
  });

  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Exam Classroom</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className={`p-8 text-white relative overflow-hidden transition-colors duration-500 ${isActive ? 'bg-green-600' : 'bg-blue-600'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-wider">{exam.name}</h2>
                  <p className="text-white/80 font-medium mt-2">{exam.code} • {exam.date}</p>
                </div>
                {isActive && (
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2 animate-pulse">
                    <Clock size={20} />
                    <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-700 font-medium leading-relaxed">{exam.details}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</h4>
                  <p className="text-xl font-black text-gray-800">{exam.duration} Mins</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Marks</h4>
                  <p className="text-xl font-black text-gray-800">{exam.totalMarks}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Questions</h4>
                  <p className="text-xl font-black text-gray-800">{exam.questionCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</h4>
                  <p className={`text-xl font-black ${isActive ? 'text-green-600' : 'text-gray-800'}`}>
                    {exam.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-6 border-b border-gray-100 pb-4">
              Control Panel
            </h3>
            
            <div className="space-y-4">
              {exam.status !== 'Completed' && (
                <button 
                  onClick={isActive ? handleEndExam : handleStartExam}
                  className={`w-full py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transition-all transform hover:scale-105 font-bold uppercase tracking-wider text-sm ${
                    isActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isActive ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  {isActive ? 'End Exam' : 'Start Exam'}
                </button>
              )}

              <button 
                onClick={() => navigate(`/edit-exam/${id}`)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-all uppercase tracking-wider text-sm"
              >
                <Edit3 size={20} />
                Edit Details
              </button>
            </div>
          </div>

          <div className="bg-blue-900 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-2 relative z-10">Quick Stats</h3>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-sm">Registered</span>
                <span className="font-bold text-xl">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-sm">Online</span>
                <span className="font-bold text-xl text-green-400">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 text-sm">Submitted</span>
                <span className="font-bold text-xl">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Monitor Section - Only visible when active or completed */}
      {(isActive || exam.status === 'Completed') && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-2">
              <Users size={24} />
              Student Monitor
            </h3>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search Student..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 bg-white rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Filter size={20} />
              </button>
              <button className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 shadow-md">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">SL No.</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Dept</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Roll No.</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-wider">Screenshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-6 font-medium text-gray-900">{index + 1}</td>
                      <td className="p-6 font-bold text-gray-800">{student.name}</td>
                      <td className="p-6 font-mono text-sm text-gray-600">{student.enrollment}</td>
                      <td className="p-6 text-gray-600">{student.department}</td>
                      <td className="p-6 text-gray-600">{student.section}</td>
                      <td className="p-6 font-mono text-sm text-gray-600">{student.rollNo}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-gray-500">{student.lastActivity}</td>
                      <td className="p-6">
                        <button 
                          onClick={() => setSelectedStudentId(student.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                          title="View Screen"
                        >
                          <Eye size={18} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-gray-400 font-medium">
                      No students found for this exam.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {selectedStudentId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in" onClick={() => setSelectedStudentId(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl animate-in zoom-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Live Screen Monitor</h3>
                  <p className="text-xs text-gray-500">Viewing Student ID: {selectedStudentId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video bg-gray-900 flex items-center justify-center relative group">
               <img 
                src={`https://picsum.photos/seed/${selectedStudentId}/800/450`} 
                alt="Screen" 
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
               />
               <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-mono backdrop-blur-sm">
                 LIVE • 1080p
               </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100">
                Take Screenshot
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                Flag Suspicious
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
