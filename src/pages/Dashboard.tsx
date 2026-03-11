import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Document {
  id: number;
  so: string;
  trichYeu: string;
  coQuanGui: string;
  ngayDen: string;
  hanXuLy: string;
  trangThai: 'cho-xu-ly' | 'dang-xu-ly' | 'hoan-thanh' | 'tu-choi';
}

const initialDocs: Document[] = [
  { id: 1, so: '145/CV-UBND', trichYeu: 'Về việc triển khai kế hoạch phòng chống dịch bệnh năm 2024', coQuanGui: 'UBND tỉnh', ngayDen: '2024-03-08', hanXuLy: '2024-03-15', trangThai: 'cho-xu-ly' },
  { id: 2, so: '23/TB-VP', trichYeu: 'Thông báo lịch họp giao ban tuần thứ 10 năm 2024', coQuanGui: 'Văn phòng HĐND', ngayDen: '2024-03-07', hanXuLy: '2024-03-10', trangThai: 'dang-xu-ly' },
  { id: 3, so: '78/QD-KTHT', trichYeu: 'Quyết định phê duyệt dự toán kinh phí quý I/2024', coQuanGui: 'Phòng KTHT', ngayDen: '2024-03-06', hanXuLy: '2024-03-20', trangThai: 'hoan-thanh' },
  { id: 4, so: '12/HD-NV', trichYeu: 'Hướng dẫn quy trình tiếp nhận và xử lý hồ sơ hành chính', coQuanGui: 'Phòng Nội vụ', ngayDen: '2024-03-05', hanXuLy: '2024-03-12', trangThai: 'cho-xu-ly' },
  { id: 5, so: '56/KH-UBND', trichYeu: 'Kế hoạch tổ chức Lễ hội Văn hóa dân gian tỉnh năm 2024', coQuanGui: 'UBND tỉnh', ngayDen: '2024-03-04', hanXuLy: '2024-03-18', trangThai: 'dang-xu-ly' },
  { id: 6, so: '89/BC-TC', trichYeu: 'Báo cáo tình hình thu chi ngân sách tháng 2 năm 2024', coQuanGui: 'Phòng TC-KT', ngayDen: '2024-03-01', hanXuLy: '2024-03-05', trangThai: 'tu-choi' },
];

const barData = [
  { name: 'T1', 'Văn bản đến': 85, 'Văn bản đi': 62 },
  { name: 'T2', 'Văn bản đến': 92, 'Văn bản đi': 74 },
  { name: 'T3', 'Văn bản đến': 124, 'Văn bản đi': 89 },
  { name: 'T4', 'Văn bản đến': 108, 'Văn bản đi': 81 },
  { name: 'T5', 'Văn bản đến': 135, 'Văn bản đi': 107 },
  { name: 'T6', 'Văn bản đến': 119, 'Văn bản đi': 93 },
  { name: 'T7', 'Văn bản đến': 98, 'Văn bản đi': 75 },
  { name: 'T8', 'Văn bản đến': 143, 'Văn bản đi': 112 },
  { name: 'T9', 'Văn bản đến': 127, 'Văn bản đi': 98 },
  { name: 'T10', 'Văn bản đến': 115, 'Văn bản đi': 88 },
  { name: 'T11', 'Văn bản đến': 88, 'Văn bản đi': 67 },
  { name: 'T12', 'Văn bản đến': 104, 'Văn bản đi': 82 },
];

const pieData = [
  { name: 'Công văn', value: 38 },
  { name: 'Tờ trình', value: 18 },
  { name: 'Quyết định', value: 14 },
  { name: 'Thông báo', value: 12 },
  { name: 'Báo cáo', value: 11 },
  { name: 'Khác', value: 7 },
];
const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export function Dashboard() {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);

  const [formData, setFormData] = useState({
    so: '',
    loai: '',
    trichYeu: '',
    coQuanGui: '',
    nguoiXuLy: '',
    ngayDen: new Date().toISOString().split('T')[0],
    hanXuLy: '',
    mucDo: 'thuong'
  });

  const filteredDocs = docs.filter(doc => 
    doc.so.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.trichYeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.coQuanGui.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    const doc = docs.find(d => d.id === id);
    if (doc && window.confirm(`Phê duyệt văn bản "${doc.so}"?`)) {
      setDocs(docs.map(d => d.id === id ? { ...d, trangThai: 'hoan-thanh' } : d));
      setFlash({ message: 'Phê duyệt thành công!', type: 'thanh-cong' });
      banPhaoHoa();
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa văn bản này không?')) {
      setDocs(docs.filter(d => d.id !== id));
      setFlash({ message: 'Đã xóa văn bản!', type: 'canh-bao' });
    }
  };

  const handleView = (id: number) => {
    const doc = docs.find(d => d.id === id);
    if (doc) {
      setFlash({ message: `📋 ${doc.so}: ${doc.trichYeu}`, type: 'thong-tin' });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Document = {
      id: Date.now(),
      so: formData.so,
      trichYeu: formData.trichYeu,
      coQuanGui: formData.coQuanGui,
      ngayDen: formData.ngayDen,
      hanXuLy: formData.hanXuLy,
      trangThai: 'cho-xu-ly'
    };
    setDocs([newDoc, ...docs]);
    setIsModalOpen(false);
    setFormData({ ...formData, so: '', trichYeu: '', coQuanGui: '', hanXuLy: '' });
    setFlash({ message: 'Thêm văn bản thành công! 🎉', type: 'thanh-cong' });
    banPhaoHoa();
  };

  const statusLabels = {
    'cho-xu-ly': <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">⏳ Chờ xử lý</span>,
    'dang-xu-ly': <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">🔄 Đang xử lý</span>,
    'hoan-thanh': <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">✅ Hoàn thành</span>,
    'tu-choi': <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">❌ Từ chối</span>
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <Layout title="🏠 Tổng quan Dashboard">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      {/* Top Action Bar */}
      <div className="flex justify-end gap-4 mb-8">
        <button className="nut nut-chinh nut-nho" onClick={() => setIsModalOpen(true)}>
          + Thêm văn bản
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { num: '1,248', label: 'Văn bản đến', icon: '📥', bg: 'bg-gradient-to-br from-blue-800 to-blue-500', link: '/incoming' },
          { num: '856', label: 'Văn bản đi', icon: '📤', bg: 'bg-gradient-to-br from-green-800 to-green-500', link: '/outgoing' },
          { num: '47', label: 'Chờ xử lý', icon: '⏳', bg: 'bg-gradient-to-br from-amber-700 to-amber-500', link: '/incoming' },
          { num: '312', label: 'Số đã cấp', icon: '🔢', bg: 'bg-gradient-to-br from-purple-800 to-purple-400', link: '/request' }
        ].map((stat, i) => (
          <Link to={stat.link} key={i} className={`${stat.bg} rounded-2xl p-6 text-white relative overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.12)] hieu-ung-xuat-hien block no-underline hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-300`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="text-4xl font-extrabold leading-none mb-2">{stat.num}</div>
            <div className="text-sm opacity-85">{stat.label}</div>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-5xl opacity-25">{stat.icon}</div>
          </Link>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hieu-ung-xuat-hien">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">📈 Thống kế văn bản theo tháng</h3>
            <select className="o-nhap w-auto py-1.5 px-3 text-sm">
              <option>Năm 2024</option>
              <option>Năm 2023</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontFamily: 'Be Vietnam Pro', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontFamily: 'Be Vietnam Pro', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: 'Be Vietnam Pro', fontSize: '12px' }} />
                <Bar dataKey="Văn bản đến" fill="rgba(59,130,246,0.8)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Văn bản đi" fill="rgba(34,197,94,0.8)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hieu-ung-xuat-hien" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">🕐 Hoạt động gần đây</h3>
            <a href="#" className="text-sm text-blue-600 hover:underline">Xem tất cả</a>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { icon: '📥', bg: 'bg-blue-50', text: <>Tiếp nhận <strong>Công văn 145/CV-UBND</strong> từ UBND tỉnh</>, time: '5 phút trước' },
              { icon: '✅', bg: 'bg-green-50', text: <>Phê duyệt yêu cầu số <strong>#VB-2024-0312</strong></>, time: '18 phút trước' },
              { icon: '📤', bg: 'bg-purple-50', text: <>Phát hành <strong>Công văn 78/TB-VP</strong> về lịch họp tháng 3</>, time: '1 giờ trước' },
              { icon: '🔢', bg: 'bg-orange-50', text: <>Cấp số điện tử cho <strong>3 văn bản</strong> từ phòng KTHT</>, time: '2 giờ trước' },
              { icon: '⚠️', bg: 'bg-red-50', text: <><strong>5 văn bản</strong> sắp quá hạn xử lý (còn 2 ngày)</>, time: 'Hôm nay, 07:30' }
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 ${act.bg}`}>{act.icon}</div>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{act.text}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-6 hieu-ung-xuat-hien" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">📋 Văn bản chờ xử lý</h3>
          <div className="flex items-center gap-3">
            <input 
              type="search" 
              className="o-nhap w-[220px] py-2 text-sm" 
              placeholder="🔍 Tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="nut nut-chinh nut-nho whitespace-nowrap" onClick={() => window.location.href = '/request'}>+ Xin số mới</button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Ngày tháng</th>
                <th className="p-4">Số/Ký hiệu</th>
                <th className="p-4">Trích yếu nội dung</th>
                <th className="p-4">Cơ quan gửi</th>
                <th className="p-4">Hạn xử lý</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{formatDate(doc.ngayDen)}</td>
                  <td className="p-4 font-bold text-blue-800 dark:text-blue-400">{doc.so}</td>
                  <td className="p-4 max-w-[250px] truncate" title={doc.trichYeu}>{doc.trichYeu}</td>
                  <td className="p-4">{doc.coQuanGui}</td>
                  <td className="p-4">{formatDate(doc.hanXuLy)}</td>
                  <td className="p-4">{statusLabels[doc.trangThai]}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors" onClick={() => handleView(doc.id)} title="Xem chi tiết">👁️</button>
                      <button className="p-1.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => handleApprove(doc.id)} title="Phê duyệt">✅</button>
                      <button className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors" onClick={() => handleDelete(doc.id)} title="Xóa">🗑️</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Không tìm thấy văn bản nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hieu-ung-xuat-hien" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 mb-6 flex items-center gap-2">🍩 Phân loại văn bản</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontFamily: 'Be Vietnam Pro', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hieu-ung-xuat-hien" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 mb-6 flex items-center gap-2">📊 Tiến độ xử lý theo phòng ban</h3>
          <div className="flex flex-col gap-5">
            {[
              { name: 'Văn phòng', percent: 92, color: 'from-blue-600 to-blue-400' },
              { name: 'Phòng KTHT', percent: 78, color: 'from-blue-600 to-blue-400' },
              { name: 'Phòng Nội vụ', percent: 61, color: 'from-amber-500 to-amber-400', textCol: 'text-amber-500' },
              { name: 'Phòng TC-KT', percent: 45, color: 'from-red-600 to-red-400', textCol: 'text-red-600' },
              { name: 'Phòng Pháp chế', percent: 87, color: 'from-blue-600 to-blue-400' }
            ].map((prog, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">{prog.name}</span>
                  <span className={`font-bold ${prog.textCol || 'text-blue-800 dark:text-blue-400'}`}>{prog.percent}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${prog.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${prog.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-[troXuatHienLen_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">📝 Thêm Văn Bản Mới</h3>
              <button 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Số/Ký hiệu *</label>
                  <input type="text" className="o-nhap py-2.5" placeholder="VD: 145/CV-UBND" required value={formData.so} onChange={e => setFormData({...formData, so: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Loại văn bản *</label>
                  <select className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.loai} onChange={e => setFormData({...formData, loai: e.target.value})}>
                    <option value="">-- Chọn loại --</option>
                    <option>Công văn</option>
                    <option>Tờ trình</option>
                    <option>Quyết định</option>
                    <option>Thông báo</option>
                    <option>Báo cáo</option>
                    <option>Biên bản</option>
                    <option>Hợp đồng</option>
                    <option>Khác</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trích yếu nội dung *</label>
                <textarea className="o-nhap py-2.5 resize-y" rows={3} placeholder="Nhập trích yếu nội dung văn bản..." required value={formData.trichYeu} onChange={e => setFormData({...formData, trichYeu: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cơ quan gửi *</label>
                  <input type="text" className="o-nhap py-2.5" placeholder="Tên cơ quan..." required value={formData.coQuanGui} onChange={e => setFormData({...formData, coQuanGui: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Người xử lý</label>
                  <input type="text" className="o-nhap py-2.5" placeholder="Họ tên người xử lý" value={formData.nguoiXuLy} onChange={e => setFormData({...formData, nguoiXuLy: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ngày đến *</label>
                  <input type="date" className="o-nhap py-2.5" required value={formData.ngayDen} onChange={e => setFormData({...formData, ngayDen: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hạn xử lý</label>
                  <input type="date" className="o-nhap py-2.5" value={formData.hanXuLy} onChange={e => setFormData({...formData, hanXuLy: e.target.value})} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mức độ ưu tiên</label>
                <select className="o-nhap py-2.5 cursor-pointer appearance-none" value={formData.mucDo} onChange={e => setFormData({...formData, mucDo: e.target.value})}>
                  <option value="thuong">Thường</option>
                  <option value="khan">Khẩn</option>
                  <option value="thuong-khan">Thượng khẩn</option>
                  <option value="hoa-toc">Hỏa tốc</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" className="nut nut-vien" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="nut nut-chinh">💾 Lưu văn bản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
