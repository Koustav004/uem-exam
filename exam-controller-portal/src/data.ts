export interface Exam {
  id: string;
  name: string;
  code: string;
  details: string;
  date: string;
  duration: string;
  url: string;
  status: 'Scheduled' | 'Active' | 'Completed';
}

export interface Student {
  id: string;
  examId: string;
  name: string;
  rollNo: string;
  enrollment: string;
  department: string;
  section: string;
  year: string;
  status: 'Active' | 'Suspicious' | 'Offline' | 'Camera Off' | 'Tab Switch';
  lastActivity: string;
}

export const mockExams: Exam[] = [
  { 
    id: '1', 
    name: 'Data Structures Mid-Term', 
    code: 'CS301', 
    details: 'Comprehensive test on Arrays, Linked Lists, and Trees.', 
    date: '2023-10-27', 
    duration: '60', 
    url: 'https://exam.uem.edu.in/cs301-mid',
    status: 'Scheduled' 
  },
  { 
    id: '2', 
    name: 'Operating Systems Final', 
    code: 'CS402', 
    details: 'Final exam covering processes, memory management, and file systems.', 
    date: '2023-10-28', 
    duration: '90', 
    url: 'https://exam.uem.edu.in/cs402-final',
    status: 'Active' 
  },
  { 
    id: '3', 
    name: 'Database Management Systems', 
    code: 'CS305', 
    details: 'SQL, Normalization, and Transaction Management.', 
    date: '2023-10-29', 
    duration: '120', 
    url: 'https://exam.uem.edu.in/cs305-dbms',
    status: 'Completed' 
  },
];

export const mockStudents: Student[] = [
  { id: '1', examId: '1', name: 'John Doe', rollNo: '101', enrollment: 'EN123456', department: 'CSE', section: 'A', year: '3rd', status: 'Active', lastActivity: 'Just now' },
  { id: '2', examId: '1', name: 'Jane Smith', rollNo: '102', enrollment: 'EN123457', department: 'CSE', section: 'A', year: '3rd', status: 'Suspicious', lastActivity: '2 mins ago' },
  { id: '3', examId: '2', name: 'Alice Johnson', rollNo: '201', enrollment: 'EN123458', department: 'ECE', section: 'B', year: '4th', status: 'Offline', lastActivity: '10 mins ago' },
  { id: '4', examId: '2', name: 'Bob Brown', rollNo: '202', enrollment: 'EN123459', department: 'ECE', section: 'B', year: '4th', status: 'Camera Off', lastActivity: '1 min ago' },
  { id: '5', examId: '3', name: 'Charlie Davis', rollNo: '301', enrollment: 'EN123460', department: 'ME', section: 'C', year: '2nd', status: 'Tab Switch', lastActivity: '5 mins ago' },
];
