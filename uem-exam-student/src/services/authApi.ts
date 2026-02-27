import axios from 'axios';

export type StudentProfile = {
  _id: string;
  enrollmentId: number;
  name: string;
  email: string;
  department: string;
  section: string;
  roll: number;
  secure: boolean;
};

export type StudentProfileResponse = {
  success: true;
  data: StudentProfile;
};

const apiClient = axios.create({
  // If you call the backend directly from the browser (http://127.0.0.1:8000),
  // CORS must be configured to allow credentials.
  // In development, prefer using the Vite proxy base '/api' (see vite.config.ts)
  // to avoid CORS entirely.
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1) Login endpoint
// POST http://127.0.0.1:8000/login
// Body: { email, password }
// Server sets the session cookie via Set-Cookie.
export async function loginUser(email: string, password: string) {
  const response = await apiClient.post('/login', {email, password});
  return response.data;
}

// 2) Profile endpoint
// GET http://127.0.0.1:8000/student/profile
// Must send cookies automatically (withCredentials: true)
export async function getProfile(): Promise<StudentProfileResponse> {
  const response = await apiClient.get('/student/profile');
  return response.data as StudentProfileResponse;
}
