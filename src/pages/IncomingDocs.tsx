import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';

interface IncomingDoc {
  id: number;
  so: string;
  loai: string;
  trichYeu: string;
  coQuanGui: string;
  ngayDen: string;
  hanXuLy: string;
  trangThai: 'cho-xu-ly' | 'dang-xu-ly' | 'hoan-thanh' | 'tu-choi';
  nguoiTao?: string;
}

const initialDocs: IncomingDoc[] = [
  { id: 1, so: '145/CV-UBND', loai: 'Công văn', trichYeu: 'Về việc triển khai kế hoạch phòng chống dịch bệnh năm 2024', coQuanGui: 'UBND tỉnh', ngayDen: '2024-03-08', hanXuLy: '2024-03-15', trangThai: 'cho-xu-ly', nguoiTao: 'Hệ thống' },
  { id: 2, so: '23/TB-VP', loai: 'Thông báo', trichYeu: 'Thông báo lịch họp giao ban tuần thứ 10 năm 2024', coQuanGui: 'Văn phòng HĐND', ngayDen: '2024-03-07', hanXuLy: '2024-03-10', trangThai: 'dang-xu-ly', nguoiTao: 'Hệ thống' },
  { id: 3, so: '78/QD-KTHT', loai: 'Quyết định', trichYeu: 'Quyết định phê duyệt dự toán kinh phí quý I/2024', coQuanGui: 'Phòng KTHT', ngayDen: '2024-03-06', hanXuLy: '2024-03-20', trangThai: 'hoan-thanh', nguoiTao: 'Hệ thống' },
  { id: 4, so: '12/HD-NV', loai: 'Hướng dẫn', trichYeu: 'Hướng dẫn quy trình tiếp nhận và xử lý hồ sơ hành chính', coQuanGui: 'Phòng Nội vụ', ngayDen: '2024-03-05', hanXuLy: '2024-03-12', trangThai: 'cho-xu-ly', nguoiTao: 'Hệ thống' },
  { id: 5, so: '56/KH-UBND', loai: 'Kế hoạch', trichYeu: 'Kế hoạch tổ chức Lễ hội Văn hóa dân gian tỉnh năm 2024', coQuanGui: 'UBND tỉnh', ngayDen: '2024-03-04', hanXuLy: '2024-03-18', trangThai: 'dang-xu-ly', nguoiTao: 'Hệ thống' },
  { id: 6, so: '89/BC-TC', loai: 'Báo cáo', trichYeu: 'Báo cáo tình hình thu chi ngân sách tháng 2 năm 2024', coQuanGui: 'Phòng TC-KT', ngayDen: '2024-03-01', hanXuLy: '2024-03-05', trangThai: 'tu-choi', nguoiTao: 'Hệ thống' },
];

export function IncomingDocs() {
  const [docs, setDocs] = useState<IncomingDoc[]>(initialDocs);
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
    mucDo: 'thuong',
    ghiChu: ''
  });

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"tenHienThi":"Quản trị viên", "vaiTro": "Admin"}');
  const userRole = user.vaiTro || 'Admin';
  const canEditStatus = userRole === 'Admin' || userRole === 'Văn thư';

  const filteredDocs = docs.filter(doc => 
    doc.so.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.trichYeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.coQuanGui.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    const doc = docs.find(d => d.id === id);
    if (doc && window.confirm(`Xác nhận hoàn thành xử lý văn bản "${doc.so}"?`)) {
      setDocs(docs.map(d => d.id === id ? { ...d, trangThai: 'hoan-thanh' } : d));
      setFlash({ message: 'Đã cập nhật trạng thái hoàn thành!', type: 'thanh-cong' });
      banPhaoHoa();
    }
  };

  const handleStatusChange = (id: number, newStatus: IncomingDoc['trangThai']) => {
    setDocs(docs.map(d => d.id === id ? { ...d, trangThai: newStatus } : d));
    setFlash({ message: 'Đã cập nhật trạng thái!', type: 'thanh-cong' });
    if (newStatus === 'hoan-thanh') {
      banPhaoHoa();
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa văn bản đến này không?')) {
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
    const userName = user.tenHienThi || user.email?.split('@')[0] || 'Người dùng';

    const newDoc: IncomingDoc = {
      id: Date.now(),
      so: formData.so,
      loai: formData.loai,
      trichYeu: formData.trichYeu,
      coQuanGui: formData.coQuanGui,
      ngayDen: formData.ngayDen,
      hanXuLy: formData.hanXuLy,
      trangThai: 'cho-xu-ly',
      nguoiTao: userName
    };
    setDocs([newDoc, ...docs]);
    setIsModalOpen(false);
    setFormData({ ...formData, so: '', trichYeu: '', coQuanGui: '', hanXuLy: '' });
    setFlash({ message: 'Thêm văn bản đến thành công! 🎉', type: 'thanh-cong' });
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

  const getDeadlineBadge = (hanXuLy: string, trangThai: string) => {
    if (!hanXuLy) return null;
    if (trangThai === 'hoan-thanh' || trangThai === 'tu-choi') return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(hanXuLy);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <div className="mt-1"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-red-200">⚠️ Quá hạn {Math.abs(diffDays)} ngày</span></div>;
    } else if (diffDays === 0) {
      return <div className="mt-1"><span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-orange-200">⚠️ Đến hạn hôm nay</span></div>;
    } else if (diffDays <= 3) {
      return <div className="mt-1"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-amber-200">⏳ Còn {diffDays} ngày</span></div>;
    }
    return null;
  };

  return (
    <Layout title="📥 Quản lý Văn bản đến">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="search" 
            className="o-nhap w-full sm:w-[280px] py-2.5 text-sm" 
            placeholder="🔍 Tìm kiếm số, trích yếu, cơ quan gửi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="nut nut-chinh nut-nho w-full sm:w-auto justify-center" onClick={() => setIsModalOpen(true)}>
          + Thêm văn bản đến
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-6 hieu-ung-xuat-hien">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">📋 Danh sách văn bản đến</h3>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Ngày tháng</th>
                <th className="p-4">Số/Ký hiệu</th>
                <th className="p-4">Loại VB</th>
                <th className="p-4">Trích yếu nội dung</th>
                <th className="p-4">Cơ quan gửi</th>
                <th className="p-4">Hạn xử lý</th>
                <th className="p-4">Người tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{formatDate(doc.ngayDen)}</td>
                  <td className="p-4 font-bold text-blue-800 dark:text-blue-400 whitespace-nowrap">{doc.so}</td>
                  <td className="p-4 whitespace-nowrap">{doc.loai}</td>
                  <td className="p-4 min-w-[200px] max-w-[300px] truncate" title={doc.trichYeu}>{doc.trichYeu}</td>
                  <td className="p-4 min-w-[150px]">{doc.coQuanGui}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div>{formatDate(doc.hanXuLy)}</div>
                    {getDeadlineBadge(doc.hanXuLy, doc.trangThai)}
                  </td>
                  <td className="p-4 whitespace-nowrap text-slate-500 text-xs font-medium">{doc.nguoiTao || '—'}</td>
                  <td className="p-4 whitespace-nowrap">
                    {canEditStatus ? (
                      <select
                        value={doc.trangThai === 'cho-xu-ly' || doc.trangThai === 'tu-choi' ? 'dang-xu-ly' : doc.trangThai}
                        onChange={(e) => handleStatusChange(doc.id, e.target.value as IncomingDoc['trangThai'])}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-none outline-none cursor-pointer appearance-none shadow-sm ${
                          (doc.trangThai === 'cho-xu-ly' || doc.trangThai === 'tu-choi' || doc.trangThai === 'dang-xu-ly') ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        <option value="dang-xu-ly">🔄 Đang xử lý</option>
                        <option value="hoan-thanh">✅ Hoàn thành</option>
                      </select>
                    ) : (
                      statusLabels[doc.trangThai]
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors" onClick={() => handleView(doc.id)} title="Xem chi tiết">👁️</button>
                      {doc.trangThai !== 'hoan-thanh' && (
                        <button className="p-1.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => handleApprove(doc.id)} title="Đánh dấu hoàn thành">✅</button>
                      )}
                      <button className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors" onClick={() => handleDelete(doc.id)} title="Xóa">🗑️</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Không tìm thấy văn bản nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-[troXuatHienLen_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">📝 Thêm Văn Bản Đến Mới</h3>
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
