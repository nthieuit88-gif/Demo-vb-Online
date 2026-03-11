import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Request } from './pages/Request';
import { OutgoingDocs } from './pages/OutgoingDocs';
import { IncomingDocs } from './pages/IncomingDocs';
import { DocumentBooks } from './pages/DocumentBooks';
import { SystemAdmin } from './pages/SystemAdmin';

function FloatingHome() {
  const location = useLocation();
  const inIframe = window.self !== window.top;
  
  // Không hiển thị nút Home ở trang chủ
  if (location.pathname === '/') return null;

  return (
    <Link 
      to="/" 
      className={`fixed ${inIframe ? 'bottom-6 right-6' : 'bottom-6 right-6 md:bottom-8 md:right-8'} w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] hover:from-blue-700 hover:to-blue-600 transition-all duration-300 z-[9999] group`}
      title="Về trang chủ"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏠</span>
    </Link>
  );
}

function MobileSimulator() {
  const inIframe = window.self !== window.top;
  const [isMobileMode, setIsMobileMode] = useState(() => {
    return localStorage.getItem('mobileMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mobileMode', isMobileMode.toString());
  }, [isMobileMode]);

  // Không hiển thị trong iframe
  if (inIframe) return null;

  if (isMobileMode) {
    return (
      <div className="fixed inset-0 z-[10000] bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
        <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 text-white">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold">Chế độ xem Mobile</h2>
            <p className="text-sm text-slate-400">Đang mô phỏng màn hình điện thoại (375x812)</p>
          </div>
          <button 
            onClick={() => setIsMobileMode(false)} 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <span>✕</span> Đóng mô phỏng
          </button>
        </div>
        
        <div className="w-[375px] h-[812px] max-h-[85vh] bg-white dark:bg-slate-950 rounded-[2.5rem] border-[12px] border-slate-800 overflow-hidden shadow-2xl relative flex flex-col ring-1 ring-white/10">
          {/* Notch simulation */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-50"></div>
          
          <iframe 
            src={window.location.href} 
            className="w-full h-full border-none bg-white dark:bg-slate-900" 
            title="Mobile View"
          />
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsMobileMode(true)}
      className="fixed bottom-24 right-6 md:bottom-28 md:right-8 w-14 h-14 bg-slate-800 dark:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-300 z-[9998] group"
      title="Xem giao diện Mobile"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📱</span>
    </button>
  );
}

export default function App() {
  return (
    <Router>
      <MobileSimulator />
      <FloatingHome />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request" element={<Request />} />
        <Route path="/outgoing" element={<OutgoingDocs />} />
        <Route path="/incoming" element={<IncomingDocs />} />
        <Route path="/books" element={<DocumentBooks />} />
        <Route path="/admin" element={<SystemAdmin />} />
      </Routes>
    </Router>
  );
}
