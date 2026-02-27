import {BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {motion} from 'motion/react';
import {ArrowLeft} from 'lucide-react';
import axios from 'axios';

import {getProfile, loginUser, type StudentProfileResponse} from './services/authApi';

import uemLogo from './assets/UEM.png';
import iemLogo from './assets/IEM.png';



function Header() {
  return (
    <header className="bg-white py-4 px-4 md:px-8 flex justify-between items-center shadow-md z-20 relative border-b-4 border-red-600 min-h-[100px]">
      {/* Left Logo */}
      <div className="flex-shrink-0 z-10">
        <img src={uemLogo} alt="UEM Logo" className="h-10 md:h-15 object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Center Text - Absolute positioning to ensure true center */}
      <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center pointer-events-none hidden md:flex">
        <div className="text-center px-24">
          <h1 className="text-[#1e3a8a] text-2xl md:text-3xl font-bold tracking-tight font-serif uppercase">UNIVERSITY OF ENGINEERING AND MANAGEMENT KOLKATA</h1>
          <div className="h-0.5 bg-red-600 w-full max-w-3xl mx-auto my-1"></div>
          <h2 className="text-[#1e3a8a] text-lg md:text-xl font-bold tracking-tight font-serif uppercase">INSTITUTE OF ENGINEERING AND MANAGEMENT KOLKATA</h2>
        </div>
      </div>

      {/* Right Logo */}
      <div className="flex-shrink-0 z-10">
        <img src={iemLogo} alt="IEM Logo" className="h-26 md:h-30 object-contain" referrerPolicy="no-referrer" />
      </div>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-400 flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}

// function Test() {
//   const [apiResult, setApiResult] = useState<unknown>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleShow = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.post('/login', {});

//       setApiResult(response.data); // store result
//     } catch (err) {
//       console.error("API Error:", err);
//       setError("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-5">
//       <button
//         onClick={handleShow}
//         disabled={loading}
//         className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 mt-4"
//       >
//         {loading ? "VERIFYING..." : "SHOW"}
//       </button>

//       {/* Show API Result */}
//       {apiResult && (
//         <pre className="mt-4 p-3 bg-gray-200 rounded">
//           {JSON.stringify(apiResult, null, 2)}
//         </pre>
//       )}

//       {/* Show Error */}
//       {error && (
//         <p className="text-red-600 font-semibold mt-3">{error}</p>
//       )}
//     </div>
//   );
// }



//login page
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProfile(null);
    setLoading(true);

    try {
      await loginUser(email, password);

      const profileResponse = await getProfile();
      setProfile(profileResponse);
      setSuccess('Login successful. Session cookie set.');
    } catch (err) {
      console.error('Login Error:', err);

      if (axios.isAxiosError(err)) {
        const message = (err.response?.data as any)?.message;
        setError(message || 'Login failed. Please check your credentials.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full md:h-[500px]"
      >
        {/* Left Side - Form */}
        <div className="flex-1 bg-sky-500 p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-600 opacity-90"></div>

          <form
            onSubmit={handleLogin}
            className="relative z-10 w-full max-w-xs space-y-6"
          >
            <h2 className="text-3xl font-black text-black mb-8 tracking-wider uppercase font-mono">
              SIGN IN
            </h2>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/80 border-none rounded-lg py-3 px-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-800 outline-none transition-all shadow-inner font-bold"
            />

            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/80 border-none rounded-lg py-3 px-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-800 outline-none transition-all shadow-inner font-bold"
            />

            {error && (
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            )}

            {success && (
              <p className="text-green-800 font-semibold text-sm">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95 mt-4"
            >
              {loading ? "VERIFYING..." : "LOG IN"}
            </button>
          </form>
        </div>

        {/* Right Side - Logo */}
        <div className="flex-1 bg-white p-8 md:p-12 flex items-center justify-center">
          <div className="text-center">
            <img
              src={uemLogo}
              alt="UEM Logo"
              className="w-32 md:w-48 mx-auto mb-4"
            />
            <p>This paper will decide your future.</p>
            <p>GOOD LUCK BUDDIES</p>

            {profile && (
              <pre className="mt-6 p-3 bg-gray-100 rounded text-left text-xs overflow-auto max-h-64">
                {JSON.stringify(profile, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StudentLoginPage() {
  const navigate = useNavigate();

  const [examCode, setExamCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!examCode.trim()) {
      setError("Exam code is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.example.com/verify-exam-code", 
        {
          examCode: examCode,
        }
      );

      if (response.status === 200) {
        
        localStorage.setItem("examSession", JSON.stringify(response.data));

        navigate("/exam"); 
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired exam code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-sky-300 rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border-4 border-white/20 relative"
      >
        <Link
          to="/"
          className="absolute top-4 left-4 text-black/50 hover:text-black"
        >
          <ArrowLeft size={32} />
        </Link>

        <h2 className="text-3xl md:text-4xl font-black text-black mb-8 tracking-wider uppercase font-mono">
          SIGN IN
        </h2>

        <div className="space-y-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="EXAM CODE"
            value={examCode}
            onChange={(e) => setExamCode(e.target.value.toUpperCase())}
            className="w-full bg-white/80 border-none rounded-lg py-4 px-6 text-xl text-center text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-blue-500 outline-none transition-all shadow-inner font-bold uppercase"
          />

          {error && (
            <p className="text-red-700 font-semibold">{error}</p>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-full text-lg shadow-xl transform transition hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {loading ? "VERIFYING..." : "START"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/student" element={<StudentLoginPage />} />
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
