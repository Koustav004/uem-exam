import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, CheckCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-64 bg-gray-700 text-white flex flex-col h-full p-4 shadow-2xl z-10">
      <div className="space-y-4 flex-1 pt-4 overflow-y-auto">
        <NavLink 
          to="/dashboard" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase transition-all duration-200 ${isActive ? 'bg-white text-gray-800 shadow-lg translate-x-2' : 'bg-gray-600/50 hover:bg-gray-600 hover:translate-x-1'}`
          }
        >
          <LayoutDashboard size={20} />
          All Exam
        </NavLink>

        <NavLink 
          to="/upcoming-exams" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase transition-all duration-200 ${isActive ? 'bg-white text-gray-800 shadow-lg translate-x-2' : 'bg-gray-600/50 hover:bg-gray-600 hover:translate-x-1'}`
          }
        >
          <Calendar size={20} />
          Upcoming Exam
        </NavLink>

        <NavLink 
          to="/completed-exams" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase transition-all duration-200 ${isActive ? 'bg-white text-gray-800 shadow-lg translate-x-2' : 'bg-gray-600/50 hover:bg-gray-600 hover:translate-x-1'}`
          }
        >
          <CheckCircle size={20} />
          Complete Exam
        </NavLink>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-600">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold uppercase bg-red-500/20 text-red-100 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </div>
  );
}
