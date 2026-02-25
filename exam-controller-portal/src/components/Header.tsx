import React from 'react';

export default function Header() {

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center border-b-4 border-red-700 relative z-20 px-8">
      {/* Left Logo */}
     <div className="flex-shrink-0 z-10">
        <img src="src\assets\UEM.png" alt="UEM Logo" className="h-10 md:h-15 object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Center Text */}
      <div className="flex flex-col items-center text-center mx-4">
          <h1 className="text-xl md:text-3xl font-black text-blue-900 uppercase tracking-tight leading-none">University of Engineering and Management Kolkata</h1>
          <h2 className="text-sm md:text-lg font-bold text-red-700 uppercase tracking-widest leading-tight mt-1">Institute of Engineering and Management Kolkata</h2>
      </div>
      
      {/* Right Logo */}
      <div className="flex-shrink-0 z-10">
        <img src="src\assets\IEM.png" alt="IEM Logo" className="h-26 md:h-30 object-contain" referrerPolicy="no-referrer" />
      </div>
    </header>
  );
}
