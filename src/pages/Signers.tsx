import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { supabase } from '../lib/supabase';

export interface Signer {
  id: number;
  name: string;
  title: string;
  status: 'Hoạt động' | 'Khóa';
}

export function Signers() {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSigner, setEditingSigner] = useState<Signer | null>(null);
  const [formData, setFormData] = useState<Partial<Signer>>({
    name: '',
    title: '',
    status: 'Hoạt động'
  });

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"vaiTro":"Người dùng"}');
  const userRole = user.vaiTro || 'Người dùng';
  const canManageSigners = userRole === 'Admin' || userRole === 'Văn thư';

  useEffect(() => {
    fetchSigners();
  }, []);

  const fetchSigners = async () => {
    const { data, error } = await supabase.from('signers').select('*');
    if (error) {
      console.error('Error fetching signers:', error);
      setFlash({ message: 'Lỗi khi tải dữ liệu người ký!', type: 'canh-bao' });
    } else {
      setSigners(data || []);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageSigners) {
      setFlash({ message: 'Bạn không có quyền thực hiện thao tác này!', type: 'canh-bao' });
      return;
    }
    if (editingSigner) {
      const { error } = await supabase
        .from('signers')
        .update({ name: formData.name, title: formData.title, status: formData.status })
        .eq('id', editingSigner.id);
      
      if (error) {
        setFlash({ message: 'Lỗi khi cập nhật người ký!', type: 'canh-bao' });
      } else {
        setFlash({ message: 'Cập nhật người ký thành công!', type: 'thanh-cong' });
        fetchSigners();
      }
    } else {
      const { error } = await supabase
        .from('signers')
        .insert([{ name: formData.name, title: formData.title, status: formData.status }]);
      
      if (error) {
        setFlash({ message: 'Lỗi khi thêm người ký!', type: 'canh-bao' });
      } else {
        setFlash({ message: 'Thêm người ký mới thành công!', type: 'thanh-cong' });
        fetchSigners();
      }
    }
    setIsModalOpen(false);
    setEditingSigner(null);
    setFormData({ name: '', title: '', status: 'Hoạt động' });
  };

  const handleDelete = async (id: number) => {
    if (!canManageSigners) {
      setFlash({ message: 'Bạn không có quyền thực hiện thao tác này!', type: 'canh-bao' });
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa người ký này?')) {
      const { error } = await supabase.from('signers').delete().eq('id', id);
      if (error) {
        setFlash({ message: 'Lỗi khi xóa người ký!', type: 'canh-bao' });
      } else {
        setFlash({ message: 'Đã xóa người ký!', type: 'canh-bao' });
        fetchSigners();
      }
    }
  };

  const openEditModal = (signer: Signer) => {
    setEditingSigner(signer);
    setFormData(signer);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSigner(null);
    setFormData({ name: '', title: '', status: 'Hoạt động' });
    setIsModalOpen(true);
  };

  return (
    <Layout title="✍️ Quản lý người ký">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden hieu-ung-xuat-hien p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Danh sách người ký</h3>
          {canManageSigners && (
            <button className="nut nut-chinh nut-nho" onClick={openAddModal}>
              + Thêm người ký
            </button>
          )}
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Họ và tên</th>
                <th className="p-4">Chức vụ</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {signers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-200">{s.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{s.title}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      s.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {s.status === 'Hoạt động' ? '✅ Hoạt động' : '🔒 Khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {canManageSigners && (
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                          onClick={() => openEditModal(s)}
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button 
                          className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                          onClick={() => handleDelete(s.id)}
                          title="Xóa"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {signers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Chưa có dữ liệu người ký</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-[troXuatHienLen_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingSigner ? 'Sửa người ký' : 'Thêm người ký mới'}
              </h3>
              <button 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="o-nhap" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Chức vụ <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="o-nhap" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
                <select 
                  className="o-nhap cursor-pointer appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Signer['status']})}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" className="nut nut-vien" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="nut nut-chinh">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
