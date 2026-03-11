import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';

interface DocumentBook {
  id: number;
  tenSo: string;
  loaiSo: 'van-ban-den' | 'van-ban-di';
  nam: number;
  trangThai: 'dang-su-dung' | 'da-khoa';
  nguoiTao: string;
}

const initialBooks: DocumentBook[] = [
  { id: 1, tenSo: 'Sổ văn bản đến năm 2024', loaiSo: 'van-ban-den', nam: 2024, trangThai: 'dang-su-dung', nguoiTao: 'Nguyễn Văn Thư' },
  { id: 2, tenSo: 'Sổ văn bản đi năm 2024', loaiSo: 'van-ban-di', nam: 2024, trangThai: 'dang-su-dung', nguoiTao: 'Nguyễn Văn Thư' },
  { id: 3, tenSo: 'Sổ văn bản đến năm 2023', loaiSo: 'van-ban-den', nam: 2023, trangThai: 'da-khoa', nguoiTao: 'Nguyễn Văn Thư' },
];

export function DocumentBooks() {
  const [books, setBooks] = useState<DocumentBook[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);

  const [formData, setFormData] = useState({
    tenSo: '',
    loaiSo: 'van-ban-den',
    nam: new Date().getFullYear(),
  });

  const filteredBooks = books.filter(book => 
    book.tenSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.nam.toString().includes(searchTerm)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"tenHienThi":"Văn thư"}');
    const userName = user.tenHienThi || user.email?.split('@')[0] || 'Văn thư';
    
    const newBook: DocumentBook = {
      id: Date.now(),
      tenSo: formData.tenSo,
      loaiSo: formData.loaiSo as 'van-ban-den' | 'van-ban-di',
      nam: formData.nam,
      trangThai: 'dang-su-dung',
      nguoiTao: userName
    };
    setBooks([newBook, ...books]);
    setIsModalOpen(false);
    setFormData({ ...formData, tenSo: '' });
    setFlash({ message: 'Thêm sổ văn bản thành công!', type: 'thanh-cong' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa sổ văn bản này không?')) {
      setBooks(books.filter(b => b.id !== id));
      setFlash({ message: 'Đã xóa sổ văn bản!', type: 'canh-bao' });
    }
  };

  const handleToggleStatus = (id: number) => {
    setBooks(books.map(b => {
      if (b.id === id) {
        const newStatus = b.trangThai === 'dang-su-dung' ? 'da-khoa' : 'dang-su-dung';
        setFlash({ message: `Đã ${newStatus === 'da-khoa' ? 'khóa' : 'mở'} sổ văn bản!`, type: 'thanh-cong' });
        return { ...b, trangThai: newStatus };
      }
      return b;
    }));
  };

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"vaiTro":"Người dùng"}');
  const userRole = user.vaiTro || 'Người dùng';

  if (userRole !== 'Văn thư') {
    return (
      <Layout title="📚 Quản lý Sổ văn bản">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-slate-500 dark:text-slate-400">Chỉ tài khoản Văn thư mới có quyền quản trị sổ văn bản.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="📚 Quản lý Sổ văn bản">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="search" 
            className="o-nhap w-full sm:w-[280px] py-2.5 text-sm" 
            placeholder="🔍 Tìm kiếm tên sổ, năm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="nut nut-chinh nut-nho w-full sm:w-auto justify-center" onClick={() => setIsModalOpen(true)}>
          + Thêm sổ mới
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-6 hieu-ung-xuat-hien">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">📋 Danh sách sổ văn bản</h3>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-700 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b-2 border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Tên sổ</th>
                <th className="p-4">Loại sổ</th>
                <th className="p-4">Năm</th>
                <th className="p-4">Người tạo</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredBooks.length > 0 ? filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-blue-800 dark:text-blue-400 whitespace-nowrap">{book.tenSo}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${book.loaiSo === 'van-ban-den' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {book.loaiSo === 'van-ban-den' ? '📥 Văn bản đến' : '📤 Văn bản đi'}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap font-medium">{book.nam}</td>
                  <td className="p-4 whitespace-nowrap text-slate-500 text-xs font-medium">{book.nguoiTao}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${book.trangThai === 'dang-su-dung' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                      {book.trangThai === 'dang-su-dung' ? '✅ Đang sử dụng' : '🔒 Đã khóa'}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        className={`p-1.5 rounded-md text-white transition-colors ${book.trangThai === 'dang-su-dung' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'}`} 
                        onClick={() => handleToggleStatus(book.id)} 
                        title={book.trangThai === 'dang-su-dung' ? 'Khóa sổ' : 'Mở khóa sổ'}
                      >
                        {book.trangThai === 'dang-su-dung' ? '🔒' : '🔓'}
                      </button>
                      <button className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors" onClick={() => handleDelete(book.id)} title="Xóa">🗑️</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Không tìm thấy sổ văn bản nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-[troXuatHienLen_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">📚 Thêm Sổ Mới</h3>
              <button 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tên sổ <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="o-nhap" 
                  placeholder="VD: Sổ văn bản đến năm 2024"
                  value={formData.tenSo}
                  onChange={(e) => setFormData({...formData, tenSo: e.target.value})}
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Loại sổ <span className="text-red-500">*</span></label>
                <select 
                  className="o-nhap cursor-pointer appearance-none"
                  value={formData.loaiSo}
                  onChange={(e) => setFormData({...formData, loaiSo: e.target.value})}
                  required
                >
                  <option value="van-ban-den">📥 Sổ văn bản đến</option>
                  <option value="van-ban-di">📤 Sổ văn bản đi</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Năm <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  className="o-nhap" 
                  value={formData.nam}
                  onChange={(e) => setFormData({...formData, nam: parseInt(e.target.value)})}
                  required 
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" className="nut nut-vien" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="nut nut-chinh">Lưu sổ mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
