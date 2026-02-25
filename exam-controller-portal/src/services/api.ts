// src/services/api.ts

// CHANGE THIS: The base URL of your backend API
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Generic request handler
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Check for HTTP errors
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
    }

    // Return JSON response
    return await response.json();
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error);
    throw error;
  }
}

// --- API Definitions for Components ---

export const api = {
  // Auth Component APIs
  auth: {
    login: (credentials: { email: string; password: string }) => 
      request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
      
    adminLogin: (credentials: { email: string; password: string }) => 
      request('/auth/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),
      
    logout: () => request('/auth/logout', { method: 'POST' }),
  },

  // AdminDashboard Component APIs
  admin: {
    // Students
    getStudents: () => request('/students'),
    addStudent: (student: any) => request('/students', { method: 'POST', body: JSON.stringify(student) }),
    deleteStudent: (id: string) => request(`/students/${id}`, { method: 'DELETE' }),
    uploadStudents: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      // Note: Content-Type header is omitted to let browser set it with boundary for FormData
      return fetch(`${API_BASE_URL}/students/upload`, { method: 'POST', body: formData }).then(res => res.json());
    },

    // Teachers
    getTeachers: () => request('/teachers'),
    addTeacher: (teacher: any) => request('/teachers', { method: 'POST', body: JSON.stringify(teacher) }),
    deleteTeacher: (id: string) => request(`/teachers/${id}`, { method: 'DELETE' }),
    uploadTeachers: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return fetch(`${API_BASE_URL}/teachers/upload`, { method: 'POST', body: formData }).then(res => res.json());
    },
  },

  // Dashboard (Student) Component APIs
  dashboard: {
    getStudentStats: (studentId: string) => request(`/students/${studentId}/stats`),
    getUpcomingExams: () => request('/exams?status=scheduled'),
    getCompletedExams: () => request('/exams?status=completed'),
  },

  // CreateExam & EditExam Component APIs
  exams: {
    getAll: () => request('/exams'),
    getById: (id: string) => request(`/exams/${id}`),
    create: (examData: any) => request('/exams', { method: 'POST', body: JSON.stringify(examData) }),
    update: (id: string, examData: any) => request(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(examData) }),
    delete: (id: string) => request(`/exams/${id}`, { method: 'DELETE' }),
  },

  // ExamClassroom Component APIs
  classroom: {
    getExamQuestions: (examId: string) => request(`/exams/${examId}/questions`),
    submitAnswer: (examId: string, questionId: string, answer: any) => 
      request(`/exams/${examId}/questions/${questionId}/answer`, { method: 'POST', body: JSON.stringify({ answer }) }),
    finishExam: (examId: string, submissionData: any) => 
      request(`/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify(submissionData) }),
  },

  // StudentMonitor Component APIs
  monitor: {
    getExamStatus: (examId: string) => request(`/monitor/exams/${examId}`),
    getStudentActivity: (examId: string, studentId: string) => request(`/monitor/exams/${examId}/students/${studentId}`),
    flagStudent: (examId: string, studentId: string, reason: string) => 
      request(`/monitor/exams/${examId}/students/${studentId}/flag`, { method: 'POST', body: JSON.stringify({ reason }) }),
  }
};
