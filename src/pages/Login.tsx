import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { FlashMessage, FlashType } from '../components/FlashMessage';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setFlash({ message: 'Vui lòng nhập đầy đủ thông tin!', type: 'canh-bao' });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    
    localStorage.setItem('nguoiDungHienTai', JSON.stringify({ username, tenHienThi: username, vaiTro: role }));
    setFlash({ message: 'Đăng nhập thành công! Đang chuyển hướng...', type: 'thanh-cong' });
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-stretch bg-blue-50 dark:bg-slate-900 transition-colors duration-300">
      <ThemeToggle />
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      {/* Left Column - Illustration */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-900 via-blue-600 to-purple-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.04) 50px, rgba(255,255,255,0.04) 51px)' }}></div>
        <div className="text-9xl mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.25)] animate-[nhipTim_3s_ease-in-out_infinite]">📋</div>
        <h2 className="text-white text-3xl font-extrabold text-center mb-4 relative z-10">Sổ Văn Bản Online</h2>
        <p className="text-white/75 text-center max-w-[380px] leading-relaxed relative z-10">
          Nền tảng quản lý văn bản hành chính hiện đại, bảo mật và hiệu quả nhất Việt Nam.
        </p>
        <div className="flex flex-col gap-4 mt-10 relative z-10 w-full max-w-[380px]">
          {[
            { icon: '🔒', text: 'Bảo mật đa lớp, mã hóa đầu cuối' },
            { icon: '⚡', text: 'Xử lý tức thì, không chờ đợi' },
            { icon: '📱', text: 'Truy cập mọi nơi, mọi thiết bị' },
            { icon: '🏆', text: 'Được 1.200+ cơ quan tin dùng' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-white/90 text-sm">
              <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-[480px] bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-8 md:p-14 relative transition-colors duration-300">
        <div className="w-full max-w-[380px]">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-4 py-1.5 rounded-full mb-6 no-underline">
              📋 Sổ Văn Bản Online
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-200 mb-2">Đăng nhập</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Chào mừng trở lại! Vui lòng nhập thông tin đăng nhập.</p>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-xl border border-blue-100 dark:border-slate-600 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Tài khoản dùng thử:</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li><span className="font-medium text-slate-800 dark:text-slate-200">Quản trị:</span> admin / admin123</li>
                <li><span className="font-medium text-slate-800 dark:text-slate-200">Văn thư:</span> vanthu / vanthu123</li>
                <li><span className="font-medium text-slate-800 dark:text-slate-200">Người dùng:</span> user / user123</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">👤</span>
              <input 
                type="text" 
                className="o-nhap pl-12" 
                placeholder="Tên đăng nhập" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">🔑</span>
              <input 
                type="password" 
                className="o-nhap pl-12" 
                placeholder="Mật khẩu" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">💼</span>
              <select 
                className="o-nhap pl-12 cursor-pointer appearance-none" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="Admin">Quản trị viên (Admin)</option>
                <option value="Văn thư">Văn thư</option>
                <option value="Người dùng">Người dùng</option>
              </select>
            </div>

            <div className="flex justify-between items-center mt-[-0.5rem] mb-5">
              <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-blue-500" /> Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-sm text-blue-500 font-medium hover:underline">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="nut nut-chinh w-full justify-center" disabled={isLoading}>
              {isLoading ? '⏳ Đang đăng nhập...' : 'Đăng nhập →'}
            </button>

            <div className="flex items-center gap-4 my-6 before:content-[''] before:flex-1 before:h-px before:bg-slate-200 dark:before:bg-slate-700 after:content-[''] after:flex-1 after:h-px after:bg-slate-200 dark:after:bg-slate-700">
              <span className="text-slate-400 text-xs whitespace-nowrap">Hoặc đăng nhập bằng</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="nut nut-vien justify-center" onClick={() => setFlash({ message: 'Tính năng đang phát triển!', type: 'canh-bao' })}>
                🌐 Google
              </button>
              <button type="button" className="nut nut-vien justify-center" onClick={() => setFlash({ message: 'Tính năng đang phát triển!', type: 'canh-bao' })}>
                🏛️ Cổng SSO
              </button>
            </div>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Chưa có tài khoản? <Link to="/register" className="text-blue-500 font-semibold no-underline">Đăng ký miễn phí</Link>
          </p>
          <p className="text-center mt-2 text-xs text-slate-400">
            <Link to="/" className="text-slate-400 no-underline">← Quay về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
