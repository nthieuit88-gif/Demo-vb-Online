import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';
import { supabase } from '../lib/supabase';

interface OutgoingDoc {
  id: number;
  so: string;
  loai: string;
  trich_yeu: string;
  co_quan_gui?: string;
  han_xu_ly?: string;
  nguoi_tao?: string;
  trang_thai?: string;
  ngay_ban_hanh: string;
  muc_do?: string;
  ghi_chu?: string;
}

export function OutgoingDocs() {
  const [docs, setDocs] = useState<OutgoingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);

  useEffect(() => {
    fetchDocs();
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

  const [formData, setFormData] = useState({
    so: '',
    loai: '',
    trich_yeu: '',
    co_quan_gui: '',
    han_xu_ly: '',
    muc_do: 'thuong',
    ghi_chu: ''
  });

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"tenHienThi":"Quản trị viên", "vaiTro": "Admin"}');

  const isAuthorized = user.vaiTro === 'Admin' || user.vaiTro === 'Văn thư';

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('outgoing_docs')
      .update({ trang_thai: newStatus })
      .eq('id', id);
    
    if (error) {
      setFlash({ message: 'Lỗi khi cập nhật trạng thái!', type: 'canh-bao' });
    } else {
      setDocs(docs.map(d => d.id === id ? { ...d, trang_thai: newStatus } : d));
      setFlash({ message: 'Đã cập nhật trạng thái!', type: 'thanh-cong' });
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.so.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.trich_yeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.co_quan_gui && doc.co_quan_gui.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      setFlash({ message: `📋 ${doc.so}: ${doc.trich_yeu}`, type: 'thong-tin' });
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userName = user.tenHienThi || 'Người dùng';
    
    const newDocData = {
      so: formData.so,
      loai: formData.loai,
      trich_yeu: formData.trich_yeu,
      co_quan_gui: formData.co_quan_gui,
      han_xu_ly: formData.han_xu_ly || null,
      nguoi_tao: userName,
      trang_thai: 'Đang xử lý',
      ngay_ban_hanh: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await supabase
      .from('outgoing_docs')
      .insert([newDocData])
      .select();

    if (error) {
      console.error('Error adding doc:', error);
      setFlash({ message: `Lỗi khi lưu văn bản: ${error.message}`, type: 'canh-bao' });
    } else {
      if (data) setDocs([data[0], ...docs]);
      setIsModalOpen(false);
      setFormData({ so: '', loai: '', trich_yeu: '', co_quan_gui: '', han_xu_ly: '', muc_do: 'thuong', ghi_chu: '' });
      setFlash({ message: 'Thêm văn bản đi thành công! 🎉', type: 'thanh-cong' });
      banPhaoHoa();
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
                  <td className="p-4 font-bold text-blue-800 dark:text-blue-400 whitespace-nowrap">{doc.so}</td>
                  <td className="p-4 whitespace-nowrap">{doc.loai}</td>
                  <td className="p-4 min-w-[200px] max-w-[300px] truncate" title={doc.trich_yeu}>{doc.trich_yeu}</td>
                  <td className="p-4 whitespace-nowrap">{doc.co_quan_gui || '—'}</td>
                  <td className="p-4 whitespace-nowrap">{formatDate(doc.han_xu_ly)}</td>
                  <td className="p-4 whitespace-nowrap">{doc.nguoi_tao || '—'}</td>
                  <td className="p-4 whitespace-nowrap">
                    {isAuthorized ? (
                      <select 
                        className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          doc.trang_thai === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                          doc.trang_thai === 'Đang xử lý' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                        value={doc.trang_thai}
                        onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                      >
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        doc.trang_thai === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                        doc.trang_thai === 'Đang xử lý' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.trang_thai || 'Chờ xử lý'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors" onClick={() => handleView(doc.id)} title="Xem chi tiết">👁️</button>
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
                <textarea className="o-nhap py-2.5 resize-y" rows={3} placeholder="Nhập trích yếu nội dung văn bản..." required value={formData.trich_yeu} onChange={e => setFormData({...formData, trich_yeu: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Cơ quan gửi</label>
                  <input type="text" className="o-nhap py-2.5" placeholder="VD: UBND tỉnh" value={formData.co_quan_gui} onChange={e => setFormData({...formData, co_quan_gui: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hạn xử lý</label>
                  <input type="date" className="o-nhap py-2.5" value={formData.han_xu_ly} onChange={e => setFormData({...formData, han_xu_ly: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mức độ ưu tiên</label>
                  <select className="o-nhap py-2.5 cursor-pointer appearance-none" value={formData.muc_do} onChange={e => setFormData({...formData, muc_do: e.target.value})}>
                    <option value="thuong">Thường</option>
                    <option value="khan">Khẩn</option>
                    <option value="thuong-khan">Thượng khẩn</option>
                    <option value="hoa-toc">Hỏa tốc</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                <textarea className="o-nhap py-2.5 resize-y" rows={2} placeholder="Ghi chú thêm..." value={formData.ghi_chu} onChange={e => setFormData({...formData, ghi_chu: e.target.value})}></textarea>
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
