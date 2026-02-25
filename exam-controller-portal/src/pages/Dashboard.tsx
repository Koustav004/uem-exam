import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Monitor, LogOut, Trash2 } from 'lucide-react';
import { useExams } from '../context/ExamContext';

interface DashboardProps {
  filter?: 'Scheduled' | 'Completed' | 'Active';
}

export default function Dashboard({ filter }: DashboardProps) {
  const navigate = useNavigate();
  const { exams, deleteExam } = useExams();

  const filteredExams = filter 
    ? exams.filter(e => e.status === filter) 
    : exams;

  const title = filter 
    ? `${filter} Exams` 
    : 'All Exams';

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">{title}</h1>
        <button 
          onClick={() => navigate('/create-exam')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <PlusCircle size={20} />
          Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
        {filteredExams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col h-80 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className={`p-6 text-center relative overflow-hidden ${
              exam.status === 'Active' ? 'bg-green-500' : 
              exam.status === 'Completed' ? 'bg-gray-500' : 'bg-blue-500'
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider relative z-10">{exam.name}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase backdrop-blur-sm">
                {exam.code} • {exam.status}
              </span>
            </div>
            
            <div className="flex-1 bg-gray-50 p-6 flex flex-col items-center justify-center text-center space-y-2">
              <p className="text-gray-600 font-medium text-sm uppercase tracking-wide">{exam.details}</p>
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
              <p className="text-gray-400 font-bold text-xs uppercase">{exam.date} • {exam.duration} MINS</p>
            </div>
            
            <div className="bg-white p-4 flex justify-between items-center border-t border-gray-100 gap-2">
              <button 
                onClick={() => navigate(`/classroom/${exam.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl uppercase text-xs transition-colors shadow-md hover:shadow-lg"
              >
                Open Classroom
              </button>
              <button 
                onClick={(e) => handleDelete(exam.id, e)}
                className="bg-red-100 hover:bg-red-600 hover:text-white text-red-600 font-bold py-2 px-4 rounded-xl uppercase text-xs transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                title="Delete Exam"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
