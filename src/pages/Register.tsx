import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';

export function Register() {
  const [formData, setFormData] = useState({
    hoTen: '',
    soDienThoai: '',
    email: '',
    coQuan: '',
    chucVu: '',
    matKhau: '',
    matKhauLap: '',
    dongY: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const getPasswordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.matKhau);
  const strengthClasses = ['', 'bg-red-600', 'bg-amber-500', 'bg-green-600', 'bg-green-600'];
  const strengthTexts = ['Nhập mật khẩu tối thiểu 8 ký tự', 'Mật khẩu yếu', 'Mật khẩu trung bình', 'Mật khẩu mạnh', 'Mật khẩu rất mạnh!'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.matKhau !== formData.matKhauLap) {
      setFlash({ message: 'Mật khẩu nhập lại không khớp!', type: 'loi' });
      return;
    }
    if (!formData.dongY) {
      setFlash({ message: 'Vui lòng đồng ý với Điều khoản Dịch vụ!', type: 'canh-bao' });
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    banPhaoHoa();
    setFlash({ message: 'Đăng ký thành công! Chào mừng bạn đến với hệ thống! 🎉', type: 'thanh-cong' });
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 md:p-8 transition-colors duration-300">
      <ThemeToggle />
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-[0_25px_80px_rgba(30,64,175,0.15)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.4)] w-full max-w-[580px] p-6 md:p-12 relative overflow-hidden hieu-ung-xuat-hien">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500"></div>
        
        <div className="text-center mb-10">
          <span className="text-5xl block mb-4 animate-[nhipTim_3s_ease-in-out_infinite]">📋</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-200 mb-2">Tạo tài khoản miễn phí</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Dùng thử đầy đủ tính năng trong 30 ngày, không cần thẻ tín dụng</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-400 mb-1">Gói Miễn Phí 30 Ngày</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Truy cập đầy đủ tính năng: quản lý văn bản, xin số điện tử, báo cáo thống kê</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">👤</span>
              <input type="text" id="hoTen" className="o-nhap pl-12" placeholder="Họ và tên *" required value={formData.hoTen} onChange={handleChange} />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">📞</span>
              <input type="tel" id="soDienThoai" className="o-nhap pl-12" placeholder="Số điện thoại *" required value={formData.soDienThoai} onChange={handleChange} />
            </div>
            <div className="relative sm:col-span-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">✉️</span>
              <input type="email" id="email" className="o-nhap pl-12" placeholder="Địa chỉ email *" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="relative sm:col-span-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🏛️</span>
              <input type="text" id="coQuan" className="o-nhap pl-12" placeholder="Tên cơ quan / đơn vị *" required value={formData.coQuan} onChange={handleChange} />
            </div>
            <div className="relative sm:col-span-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">💼</span>
              <select id="chucVu" className="o-nhap pl-12 cursor-pointer appearance-none" required value={formData.chucVu} onChange={handleChange}>
                <option value="">-- Chức vụ / Vai trò --</option>
                <option>Cán bộ văn thư</option>
                <option>Lãnh đạo phòng ban</option>
                <option>Quản trị hệ thống</option>
                <option>Nhân viên xử lý</option>
                <option>Khác</option>
              </select>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔑</span>
              <input type="password" id="matKhau" className="o-nhap pl-12" placeholder="Mật khẩu *" required minLength={8} value={formData.matKhau} onChange={handleChange} />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔐</span>
              <input type="password" id="matKhauLap" className="o-nhap pl-12" placeholder="Nhập lại mật khẩu *" required value={formData.matKhauLap} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-2 mb-4">
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map(i => (
                <span key={i} className={`flex-1 rounded-full transition-colors duration-300 ${formData.matKhau.length > 0 && i <= strength ? strengthClasses[strength] : 'bg-slate-200 dark:bg-slate-700'}`}></span>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{formData.matKhau.length > 0 ? strengthTexts[strength] : strengthTexts[0]}</p>
          </div>

          <label className="flex items-start gap-3 my-5 text-sm text-slate-500 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" id="dongY" className="w-4 h-4 mt-0.5 accent-blue-500 shrink-0" required checked={formData.dongY} onChange={handleChange} />
            <span>Tôi đồng ý với <a href="#" className="text-blue-500 font-medium hover:underline">Điều khoản Dịch vụ</a> và <a href="#" className="text-blue-500 font-medium hover:underline">Chính sách Bảo mật</a> của Sổ Văn Bản Online</span>
          </label>

          <button type="submit" className="nut nut-chinh w-full justify-center text-base py-3.5" disabled={isLoading}>
            {isLoading ? '⏳ Đang tạo tài khoản...' : '🚀 Tạo tài khoản miễn phí'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
          Đã có tài khoản? <Link to="/login" className="text-blue-500 font-semibold no-underline">Đăng nhập ngay</Link>
        </p>
        <p className="text-center mt-2 text-xs text-slate-400">
          <Link to="/" className="text-slate-400 no-underline">← Quay về trang chủ</Link>
        </p>
      </div>
    </div>
  );
}
