import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { banPhaoHoa } from '../utils/confetti';

export function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleStartClick = () => {
    banPhaoHoa();
  };

  const slides = [
    {
      bg: 'bg-gradient-to-br from-blue-900 to-blue-500',
      icon: '📋',
      title: 'Quản Lý Sổ Văn Bản\nThông Minh',
      desc: 'Số hóa toàn bộ quy trình quản lý văn bản hành chính. Tiết kiệm thời gian, tăng hiệu quả công việc lên 10 lần.'
    },
    {
      bg: 'bg-gradient-to-br from-teal-900 to-teal-600',
      icon: '🔢',
      title: 'Xin Số Điện Tử\nNhanh Chóng',
      desc: 'Đăng ký số điện tử cho văn bản đến/đi chỉ trong vài giây. Tích hợp phê duyệt trực tuyến theo thời gian thực.'
    },
    {
      bg: 'bg-gradient-to-br from-purple-900 to-purple-600',
      icon: '🔒',
      title: 'Bảo Mật Tuyệt Đối\nDữ Liệu An Toàn',
      desc: 'Hệ thống phân quyền nhiều cấp, mã hóa dữ liệu đầu cuối, sao lưu tự động hàng ngày. An tâm tuyệt đối.'
    },
    {
      bg: 'bg-gradient-to-br from-orange-900 to-orange-600',
      icon: '📊',
      title: 'Báo Cáo & Thống Kê\nTrực Quan',
      desc: 'Dashboard tổng hợp với biểu đồ thống kê sinh động. Theo dõi tình trạng văn bản mọi lúc, mọi nơi.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <ThemeToggle />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white/95 dark:bg-slate-900/95 shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-xl' : 'bg-white/5 backdrop-blur-xl border-b border-white/10'}`}>
        <Link to="/" className={`text-lg font-extrabold flex items-center gap-2 no-underline ${isScrolled || isMobileMenuOpen ? 'text-blue-800 dark:text-blue-400' : 'text-white'}`}>
          📋 Sổ Văn Bản Online
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#tinh-nang" className={`font-medium text-sm transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/85 hover:text-white'}`}>Tính năng</a>
          <a href="#thong-ke" className={`font-medium text-sm transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/85 hover:text-white'}`}>Thống kê</a>
          <a href="#lien-he" className={`font-medium text-sm transition-colors hover:text-blue-600 ${isScrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white/85 hover:text-white'}`}>Liên hệ</a>
          <Link to="/login" className={`nut nut-vien nut-nho ${isScrolled ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' : 'border-white/50 text-white hover:bg-white/10'}`}>Đăng nhập</Link>
          <Link to="/register" className={`nut nut-nho ${isScrolled ? 'nut-chinh' : 'nut-trang'}`}>Đăng ký miễn phí</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden text-2xl p-2 ${isScrolled || isMobileMenuOpen ? 'text-slate-800 dark:text-slate-200' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-white dark:bg-slate-900 z-[90] flex flex-col p-6 animate-[troXuatHienLen_0.3s_ease-out]">
          <div className="flex flex-col gap-6 text-lg font-semibold">
            <a href="#tinh-nang" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-4">Tính năng</a>
            <a href="#thong-ke" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-4">Thống kê</a>
            <a href="#lien-he" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-4">Liên hệ</a>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-800 pb-4">Đăng nhập</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="nut nut-chinh justify-center mt-4">Đăng ký miễn phí</Link>
          </div>
        </div>
      )}

      {/* Hero Carousel */}
      <header className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className={`flex-shrink-0 w-full h-full relative flex items-center justify-center ${slide.bg}`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)' }}></div>
              <div className="text-center p-4 md:p-8 z-10 relative w-full max-w-4xl mx-auto">
                <span className="text-[clamp(4rem,10vw,8rem)] mb-4 md:mb-6 block drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">{slide.icon}</span>
                <h1 className="text-[clamp(2rem,5vw,4rem)] font-extrabold text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] mb-4 whitespace-pre-line leading-tight hieu-ung-xuat-hien">{slide.title}</h1>
                <p className="text-[clamp(1rem,2vw,1.3rem)] text-white/90 mb-8 max-w-[600px] mx-auto px-4">{slide.desc}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mt-6">
                  {index === 0 && (
                    <>
                      <Link to="/register" className="nut nut-trang nut-lon justify-center">🚀 Bắt đầu miễn phí</Link>
                      <a href="#tinh-nang" className="nut nut-vien nut-lon border-white/60 text-white hover:bg-white/10 justify-center">Tìm hiểu thêm</a>
                    </>
                  )}
                  {index === 1 && <Link to="/register" className="nut nut-trang nut-lon justify-center">📝 Đăng ký ngay</Link>}
                  {index === 2 && <Link to="/login" className="nut nut-trang nut-lon justify-center">🔐 Đăng nhập ngay</Link>}
                  {index === 3 && <Link to="/dashboard" className="nut nut-trang nut-lon justify-center">📈 Xem Dashboard</Link>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button 
          className="hidden md:flex absolute top-1/2 left-6 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md border-2 border-white/40 text-white w-14 h-14 rounded-full items-center justify-center text-2xl cursor-pointer transition-all hover:bg-white/50 hover:scale-110 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        >
          &#8592;
        </button>
        <button 
          className="hidden md:flex absolute top-1/2 right-6 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-md border-2 border-white/40 text-white w-14 h-14 rounded-full items-center justify-center text-2xl cursor-pointer transition-all hover:bg-white/50 hover:scale-110 hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)]"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        >
          &#8594;
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ${currentSlide === index ? 'bg-white scale-150' : 'bg-white/50'}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </header>

      {/* Features Section */}
      <section id="tinh-nang" className="bg-white dark:bg-slate-900 py-16 md:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16 hieu-ung-xuat-hien">
            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">✨ Tính Năng</span>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold mt-4 mb-3 text-slate-900 dark:text-slate-100">
              Tất cả trong một nền tảng
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-[600px] mx-auto">
              Hệ thống tích hợp đầy đủ mọi công cụ cần thiết cho quản lý văn bản hành chính hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {[
              { icon: '📁', bg: 'bg-blue-50', title: 'Quản Lý Văn Bản Đến', desc: 'Tiếp nhận, phân loại và theo dõi toàn bộ văn bản đến. Tự động đánh số, thông báo kịp thời đến người phụ trách.', link: '/incoming' },
              { icon: '📤', bg: 'bg-green-50', title: 'Quản Lý Văn Bản Đi', desc: 'Đăng ký và quản lý văn bản phát hành. Cấp số tự động, kiểm soát quy trình duyệt và gửi văn bản đúng hạn.', link: '/outgoing' },
              { icon: '🔢', bg: 'bg-purple-50', title: 'Xin Số Điện Tử', desc: 'Gửi yêu cầu cấp số văn bản trực tuyến không cần giấy tờ. Phê duyệt nhanh, phản hồi ngay lập tức.', link: '/request' },
              { icon: '📊', bg: 'bg-orange-50', title: 'Báo Cáo & Thống Kê', desc: 'Biểu đồ trực quan theo ngày, tháng, quý. Xuất báo cáo Excel/PDF chỉ với một cú nhấp chuột.', link: '/dashboard' },
              { icon: '🔒', bg: 'bg-red-50', title: 'Phân Quyền & Bảo Mật', desc: 'Phân quyền theo cấp bậc, đơn vị, vai trò. Nhật ký thao tác đầy đủ, không thể xóa lịch sử.', link: '/dashboard' },
              { icon: '🔔', bg: 'bg-sky-50', title: 'Thông Báo Tự Động', desc: 'Nhận thông báo qua email và hệ thống khi có văn bản mới, sắp đến hạn hoặc cần xử lý gấp.', link: '/dashboard' }
            ].map((feature, index) => (
              <Link to={feature.link} key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(30,64,175,0.25)] transition-all duration-300 relative overflow-hidden cursor-pointer group hieu-ung-xuat-hien block no-underline" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-5 ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="thong-ke" className="bg-gradient-to-br from-blue-900 to-purple-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold">Được tin dùng trên toàn quốc</h2>
            <p className="opacity-80 mt-2 text-sm md:text-base">Hàng ngàn cơ quan, tổ chức đang sử dụng mỗi ngày</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { num: '1,200+', label: 'Cơ quan sử dụng' },
              { num: '85,000+', label: 'Văn bản đã xử lý' },
              { num: '98%', label: 'Hài lòng' },
              { num: '24/7', label: 'Hỗ trợ' }
            ].map((stat, index) => (
              <div key={index} className="hieu-ung-xuat-hien" style={{ animationDelay: `${index * 0.1}s` }}>
                <span className="text-4xl md:text-5xl font-extrabold block">{stat.num}</span>
                <p className="opacity-80 text-xs md:text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-900 py-16 md:py-24 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold mb-4">
            Sẵn sàng số hóa văn phòng?
          </h2>
          <p className="text-white/75 text-base md:text-lg mb-8 md:mb-10">
            Tham gia cùng hàng nghìn cơ quan đang sử dụng hệ thống. Dùng thử miễn phí 30 ngày, không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" onClick={handleStartClick} className="nut nut-trang nut-lon justify-center">🚀 Bắt đầu miễn phí</Link>
            <Link to="/login" className="nut nut-vien nut-lon border-white/40 text-white hover:bg-white/10 justify-center">Đăng nhập ngay</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="lien-he" className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2">
              <h4 className="text-white font-bold mb-4">📋 Sổ Văn Bản Online</h4>
              <p className="text-sm leading-relaxed mb-4 max-w-sm">
                Nền tảng quản lý văn bản hành chính hiện đại, được phát triển đặc thù cho cơ quan nhà nước và tổ chức Việt Nam.
              </p>
              <p className="text-sm">📧 hotro@sovb.vn</p>
              <p className="text-sm">📞 1800 1234 (miễn phí)</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#tinh-nang" className="hover:text-blue-400 transition-colors">Tính năng</a></li>
                <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><Link to="/request" className="hover:text-blue-400 transition-colors">Xin số điện tử</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Báo cáo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Tài khoản</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Đăng ký</Link></li>
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Đăng nhập</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Quên mật khẩu</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-sm">
            © 2024 Sổ Văn Bản Online. Bản quyền thuộc về hệ thống. Phiên bản 2.0
          </div>
        </div>
      </footer>
    </div>
  );
}
