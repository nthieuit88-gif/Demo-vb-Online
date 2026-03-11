import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';
import { Signer } from './Signers';
import { supabase } from '../lib/supabase';

interface OutgoingDoc {
  id: number;
  so: string;
  loai: string;
  trichYeu: string;
  noiNhan: string;
  nguoiKy: string;
  ngayBanHanh: string;
  hanXuLy?: string;
  trangThai: 'cho-duyet' | 'da-ban-hanh' | 'tu-choi' | 'dang-xu-ly' | 'hoan-thanh';
  nguoiTao?: string;
}

const initialDocs: OutgoingDoc[] = [
  { id: 1, so: '78/TB-VP', loai: 'Thông báo', trichYeu: 'Thông báo lịch họp giao ban tuần thứ 11 năm 2024', noiNhan: 'Các phòng ban', nguoiKy: 'Nguyễn Văn A', ngayBanHanh: '2024-03-10', hanXuLy: '2024-03-15', trangThai: 'da-ban-hanh', nguoiTao: 'Hệ thống' },
  { id: 2, so: '145/CV-UBND', loai: 'Công văn', trichYeu: 'Về việc báo cáo tình hình thực hiện dự án', noiNhan: 'Sở Kế hoạch và Đầu tư', nguoiKy: 'Trần Thị B', ngayBanHanh: '2024-03-09', hanXuLy: '2024-03-12', trangThai: 'cho-duyet', nguoiTao: 'Hệ thống' },
  { id: 3, so: '42/QD-KTHT', loai: 'Quyết định', trichYeu: 'Quyết định thành lập đoàn kiểm tra', noiNhan: 'Các đơn vị trực thuộc', nguoiKy: 'Lê Văn C', ngayBanHanh: '2024-03-08', hanXuLy: '2024-03-20', trangThai: 'da-ban-hanh', nguoiTao: 'Hệ thống' },
  { id: 4, so: '15/BC-TC', loai: 'Báo cáo', trichYeu: 'Báo cáo quyết toán năm 2023', noiNhan: 'Sở Tài chính', nguoiKy: 'Phạm Thị D', ngayBanHanh: '2024-03-05', hanXuLy: '2024-03-10', trangThai: 'tu-choi', nguoiTao: 'Hệ thống' },
];

export function OutgoingDocs() {
  const [docs, setDocs] = useState<OutgoingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  const [signers, setSigners] = useState<Signer[]>([]);

  useEffect(() => {
    fetchDocs();
    fetchSigners();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outgoing_docs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching docs:', error);
      setFlash({ message: 'Lỗi khi tải danh sách văn bản!', type: 'canh-bao' });
    } else {
      setDocs(data || []);
    }
    setLoading(false);
  };

  const fetchSigners = async () => {
    const { data, error } = await supabase.from('signers').select('*').eq('status', 'Hoạt động');
    if (error) {
      console.error('Error fetching signers:', error);
    } else {
      setSigners(data || []);
    }
  };

  const [formData, setFormData] = useState({
    so: '',
    loai: '',
    trichYeu: '',
    noiNhan: '',
    nguoiKy: '',
    ngayBanHanh: new Date().toISOString().split('T')[0],
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
    doc.noiNhan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: number) => {
    const doc = docs.find(d => d.id === id);
    if (doc && window.confirm(`Ban hành văn bản "${doc.so}"?`)) {
      const { error } = await supabase
        .from('outgoing_docs')
        .update({ trangThai: 'da-ban-hanh' })
        .eq('id', id);

      if (error) {
        setFlash({ message: 'Lỗi khi ban hành văn bản!', type: 'canh-bao' });
      } else {
        setDocs(docs.map(d => d.id === id ? { ...d, trangThai: 'da-ban-hanh' } : d));
        setFlash({ message: 'Ban hành thành công!', type: 'thanh-cong' });
        banPhaoHoa();
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: OutgoingDoc['trangThai']) => {
    const { error } = await supabase
      .from('outgoing_docs')
      .update({ trangThai: newStatus })
      .eq('id', id);

    if (error) {
      setFlash({ message: 'Lỗi khi cập nhật trạng thái!', type: 'canh-bao' });
    } else {
      setDocs(docs.map(d => d.id === id ? { ...d, trangThai: newStatus } : d));
      setFlash({ message: 'Đã cập nhật trạng thái!', type: 'thanh-cong' });
      if (newStatus === 'hoan-thanh' || newStatus === 'da-ban-hanh') {
        banPhaoHoa();
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa văn bản này không?')) {
      const { error } = await supabase.from('outgoing_docs').delete().eq('id', id);
      if (error) {
        setFlash({ message: 'Lỗi khi xóa văn bản!', type: 'canh-bao' });
      } else {
        setDocs(docs.filter(d => d.id !== id));
        setFlash({ message: 'Đã xóa văn bản!', type: 'canh-bao' });
      }
    }
  };

  const handleView = (id: number) => {
    const doc = docs.find(d => d.id === id);
    if (doc) {
      setFlash({ message: `📋 ${doc.so}: ${doc.trichYeu}`, type: 'thong-tin' });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userName = user.tenHienThi || user.email?.split('@')[0] || 'Người dùng';
    
    const newDocData = {
      so: formData.so,
      loai: formData.loai,
      trichYeu: formData.trichYeu,
      noiNhan: formData.noiNhan,
      nguoiKy: formData.nguoiKy,
      ngayBanHanh: formData.ngayBanHanh,
      hanXuLy: formData.hanXuLy || null,
      trangThai: 'cho-duyet',
      nguoiTao: userName
    };

    const { data, error } = await supabase
      .from('outgoing_docs')
      .insert([newDocData])
      .select();

    if (error) {
      console.error('Error adding doc:', error);
      setFlash({ message: 'Lỗi khi lưu văn bản!', type: 'canh-bao' });
    } else {
      if (data) setDocs([data[0], ...docs]);
      setIsModalOpen(false);
      setFormData({ ...formData, so: '', trichYeu: '', noiNhan: '', nguoiKy: '', hanXuLy: '' });
      setFlash({ message: 'Thêm văn bản đi thành công! 🎉', type: 'thanh-cong' });
      banPhaoHoa();
    }
  };

  const statusLabels = {
    'cho-duyet': <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">⏳ Chờ duyệt</span>,
    'da-ban-hanh': <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">✅ Đã ban hành</span>,
    'tu-choi': <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">❌ Từ chối</span>,
    'dang-xu-ly': <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">🔄 Đang xử lý</span>,
    'hoan-thanh': <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">✅ Hoàn thành</span>
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getDeadlineBadge = (hanXuLy: string | undefined, trangThai: string) => {
    if (!hanXuLy) return null;
    if (trangThai === 'hoan-thanh' || trangThai === 'tu-choi' || trangThai === 'da-ban-hanh') return null;

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
    <Layout title="📤 Quản lý Văn bản đi">
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
            placeholder="🔍 Tìm kiếm số, trích yếu, nơi nhận..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="nut nut-chinh nut-nho w-full sm:w-auto justify-center" onClick={() => setIsModalOpen(true)}>
          + Thêm văn bản đi
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-6 hieu-ung-xuat-hien">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">📋 Danh sách văn bản đi</h3>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Ngày tháng</th>
                <th className="p-4">Số/Ký hiệu</th>
                <th className="p-4">Loại VB</th>
                <th className="p-4">Trích yếu nội dung</th>
                <th className="p-4">Nơi nhận</th>
                <th className="p-4">Người ký</th>
                <th className="p-4">Hạn xử lý</th>
                <th className="p-4">Người tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredDocs.length > 0 ? filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{formatDate(doc.ngayBanHanh)}</td>
                  <td className="p-4 font-bold text-blue-800 dark:text-blue-400 whitespace-nowrap">{doc.so}</td>
                  <td className="p-4 whitespace-nowrap">{doc.loai}</td>
                  <td className="p-4 min-w-[200px] max-w-[300px] truncate" title={doc.trichYeu}>{doc.trichYeu}</td>
                  <td className="p-4 min-w-[150px]">{doc.noiNhan}</td>
                  <td className="p-4 whitespace-nowrap">{doc.nguoiKy}</td>
                  <td className="p-4 whitespace-nowrap">
                    <div>{formatDate(doc.hanXuLy)}</div>
                    {getDeadlineBadge(doc.hanXuLy, doc.trangThai)}
                  </td>
                  <td className="p-4 whitespace-nowrap text-slate-500 text-xs font-medium">{doc.nguoiTao || '—'}</td>
                  <td className="p-4 whitespace-nowrap">
                    {canEditStatus ? (
                      <select
                        value={doc.trangThai === 'hoan-thanh' || doc.trangThai === 'da-ban-hanh' ? 'hoan-thanh' : 'dang-xu-ly'}
                        onChange={(e) => handleStatusChange(doc.id, e.target.value as OutgoingDoc['trangThai'])}
                        className={`text-xs font-semibold rounded-full px-3 py-1.5 border-none outline-none cursor-pointer appearance-none shadow-sm ${
                          (doc.trangThai === 'hoan-thanh' || doc.trangThai === 'da-ban-hanh') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
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
                      {doc.trangThai === 'cho-duyet' && (
                        <button className="p-1.5 rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition-colors" onClick={() => handleApprove(doc.id)} title="Ban hành">✅</button>
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">📝 Thêm Văn Bản Đi Mới</h3>
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
                  <input type="text" className="o-nhap py-2.5" placeholder="VD: 78/TB-VP" required value={formData.so} onChange={e => setFormData({...formData, so: e.target.value})} />
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
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nơi nhận</label>
                  <input type="text" className="o-nhap py-2.5" placeholder="Cơ quan / đơn vị nhận..." value={formData.noiNhan} onChange={e => setFormData({...formData, noiNhan: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Người ký *</label>
                  <select className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.nguoiKy} onChange={e => setFormData({...formData, nguoiKy: e.target.value})}>
                    <option value="">-- Chọn người ký --</option>
                    {signers.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.title})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ngày ban hành *</label>
                  <input type="date" className="o-nhap py-2.5" required value={formData.ngayBanHanh} onChange={e => setFormData({...formData, ngayBanHanh: e.target.value})} />
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

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                <textarea className="o-nhap py-2.5 resize-y" rows={2} placeholder="Ghi chú thêm..." value={formData.ghiChu} onChange={e => setFormData({...formData, ghiChu: e.target.value})}></textarea>
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
