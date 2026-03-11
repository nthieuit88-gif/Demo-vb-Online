import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { FlashMessage, FlashType } from './FlashMessage';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = 'Tổng quan Dashboard' }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất không?')) {
      localStorage.removeItem('nguoiDungHienTai');
      setFlash({ message: 'Đăng xuất thành công!', type: 'thanh-cong' });
      setTimeout(() => navigate('/login'), 1000);
    }
  };

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"tenHienThi":"Người dùng", "vaiTro": "Người dùng"}');
  const userName = user.tenHienThi || user.email?.split('@')[0] || 'Người dùng';
  const userRole = user.vaiTro || 'Người dùng';
  const userInitial = (user.tenHienThi || 'V')[0].toUpperCase();

  // Mock notifications for demonstration
  const notifications = [
    { id: 1, title: 'Văn bản đến quá hạn', message: 'Công văn 89/BC-TC đã quá hạn xử lý 5 ngày.', type: 'danger', time: '10 phút trước' },
    { id: 2, title: 'Văn bản đến hạn hôm nay', message: 'Thông báo 23/TB-VP cần xử lý trong hôm nay.', type: 'warning', time: '1 giờ trước' },
    { id: 3, title: 'Văn bản sắp đến hạn', message: 'Hướng dẫn 12/HD-NV còn 2 ngày để xử lý.', type: 'info', time: '3 giờ trước' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-gradient-to-br from-blue-900 to-blue-800 text-white flex flex-col shadow-[4px_0_20px_rgba(0,0,0,0.15)] z-[100] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-7 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">📋</div>
          <div className="text-sm font-bold leading-tight">
            Sổ Văn Bản Online
            <small className="block font-normal opacity-70 text-xs">Hệ thống quản lý</small>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <h5 className="text-[0.7rem] font-bold text-white/50 uppercase tracking-wider px-3 mt-4 mb-1">Tổng quan</h5>
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/dashboard' ? 'bg-white/20 text-white font-semibold' : ''}`}>
            <span className="text-lg w-6 text-center">🏠</span> Dashboard
          </Link>

          <h5 className="text-[0.7rem] font-bold text-white/50 uppercase tracking-wider px-3 mt-4 mb-1">Văn bản</h5>
          {(userRole === 'Văn thư' || userRole === 'Admin') && (
            <Link to="/books" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/books' ? 'bg-white/20 text-white font-semibold' : ''}`}>
              <span className="text-lg w-6 text-center">📚</span> Sổ văn bản
            </Link>
          )}
          <Link to="/incoming" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/incoming' ? 'bg-white/20 text-white font-semibold' : ''}`}>
            <span className="text-lg w-6 text-center">📥</span> Văn bản đến
          </Link>
          <Link to="/outgoing" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/outgoing' ? 'bg-white/20 text-white font-semibold' : ''}`}>
            <span className="text-lg w-6 text-center">📤</span> Văn bản đi
          </Link>
          <Link to="/request" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/request' ? 'bg-white/20 text-white font-semibold' : ''}`}>
            <span className="text-lg w-6 text-center">🔢</span> Xin số điện tử
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white">
            <span className="text-lg w-6 text-center">🗂️</span> Lưu trữ
          </button>

          <h5 className="text-[0.7rem] font-bold text-white/50 uppercase tracking-wider px-3 mt-4 mb-1">Tiện ích</h5>
          {userRole === 'Admin' && (
            <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${location.pathname === '/admin' ? 'bg-white/20 text-white font-semibold' : ''}`}>
              <span className="text-lg w-6 text-center">⚙️</span> Quản trị hệ thống
            </Link>
          )}
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 text-sm font-medium transition-all hover:bg-white/10 hover:text-white">
            <span className="text-lg w-6 text-center">🌐</span> Trang chủ
          </Link>
        </nav>

        <div className="p-5 border-t border-white/10 flex items-center gap-3 text-white/80 text-sm">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer">
            {userInitial}
          </div>
          <div>
            <div className="font-semibold text-white">{userName}</div>
            <div className="text-xs opacity-60">{userRole}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 h-16 flex items-center justify-between sticky top-0 z-50 shadow-[0_1px_10px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-2xl text-slate-600 dark:text-slate-300 p-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              ☰
            </button>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-200">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Thông báo nhắc nhở"
              >
                <span className="text-xl">🔔</span>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsNotifOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-[troXuatHienLen_0.2s_ease-out]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">Nhắc nhở xử lý</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{notifications.length} mới</span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                          {notifications.map(notif => (
                            <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  notif.type === 'danger' ? 'bg-red-100 text-red-600' :
                                  notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                  'bg-amber-100 text-amber-600'
                                }`}>
                                  {notif.type === 'danger' ? '⚠️' : notif.type === 'warning' ? '⏰' : '⏳'}
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">{notif.title}</h5>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5 leading-relaxed">{notif.message}</p>
                                  <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                          <div className="text-3xl mb-2 opacity-50">📭</div>
                          <p className="text-sm">Không có nhắc nhở nào</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-100 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/50">
                      <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Xem tất cả</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />
            <button 
              className="nut nut-vien nut-nho border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
