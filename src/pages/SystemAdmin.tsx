import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Văn thư' | 'Người dùng';
  status: 'Hoạt động' | 'Khóa';
}

const initialUsers: User[] = [
  { id: 1, name: 'Quản trị viên', email: 'admin@sovanban.vn', role: 'Admin', status: 'Hoạt động' },
  { id: 2, name: 'Nguyễn Văn Thư', email: 'vanthu@sovanban.vn', role: 'Văn thư', status: 'Hoạt động' },
  { id: 3, name: 'Trần Nhân Viên', email: 'nhanvien@sovanban.vn', role: 'Người dùng', status: 'Hoạt động' },
];

export function SystemAdmin() {
  const [activeTab, setActiveTab] = useState<'general' | 'users'>('general');
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  
  // General Settings State
  const [settings, setSettings] = useState({
    systemName: 'Sổ Văn Bản Online',
    organizationName: 'UBND Thành phố',
    contactEmail: 'contact@sovanban.vn',
    contactPhone: '0243.123.4567',
    maintenanceMode: false
  });

  // Users State
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'Người dùng',
    status: 'Hoạt động'
  });

  const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"vaiTro":"Người dùng"}');
  const userRole = user.vaiTro || 'Người dùng';

  if (userRole !== 'Admin') {
    return (
      <Layout title="⚙️ Quản trị hệ thống">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-slate-500 dark:text-slate-400">Chỉ tài khoản Admin mới có quyền truy cập trang Quản trị hệ thống.</p>
        </div>
      </Layout>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setFlash({ message: 'Đã lưu cài đặt hệ thống thành công!', type: 'thanh-cong' });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } as User : u));
      setFlash({ message: 'Cập nhật người dùng thành công!', type: 'thanh-cong' });
    } else {
      const newUser: User = {
        id: Date.now(),
        name: userFormData.name || '',
        email: userFormData.email || '',
        role: userFormData.role as User['role'] || 'Người dùng',
        status: userFormData.status as User['status'] || 'Hoạt động'
      };
      setUsers([...users, newUser]);
      setFlash({ message: 'Thêm người dùng mới thành công!', type: 'thanh-cong' });
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: 'Người dùng', status: 'Hoạt động' });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id));
      setFlash({ message: 'Đã xóa người dùng!', type: 'canh-bao' });
    }
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserFormData(user);
    setIsUserModalOpen(true);
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: 'Người dùng', status: 'Hoạt động' });
    setIsUserModalOpen(true);
  };

  return (
    <Layout title="⚙️ Quản trị hệ thống">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] overflow-hidden hieu-ung-xuat-hien">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button 
            className={`px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            onClick={() => setActiveTab('general')}
          >
            Cài đặt chung
          </button>
          <button 
            className={`px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            onClick={() => setActiveTab('users')}
          >
            Quản lý người dùng
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Thông tin hệ thống</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tên hệ thống</label>
                  <input 
                    type="text" 
                    className="o-nhap" 
                    value={settings.systemName}
                    onChange={(e) => setSettings({...settings, systemName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tên cơ quan/tổ chức</label>
                  <input 
                    type="text" 
                    className="o-nhap" 
                    value={settings.organizationName}
                    onChange={(e) => setSettings({...settings, organizationName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email liên hệ</label>
                  <input 
                    type="email" 
                    className="o-nhap" 
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Số điện thoại hỗ trợ</label>
                  <input 
                    type="text" 
                    className="o-nhap" 
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 border-t border-slate-200 dark:border-slate-700 pt-6">Cấu hình nâng cao</h3>
              
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-200">Chế độ bảo trì</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Tạm thời khóa hệ thống đối với người dùng thông thường</div>
                  </div>
                </label>
              </div>

              <button type="submit" className="nut nut-chinh">
                Lưu cài đặt
              </button>
            </form>
          )}

          {/* Users Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Danh sách người dùng</h3>
                <button className="nut nut-chinh nut-nho" onClick={openAddUserModal}>
                  + Thêm người dùng
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">Họ và tên</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Vai trò</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-semibold text-slate-900 dark:text-slate-200">{u.name}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                            u.role === 'Văn thư' ? 'bg-blue-100 text-blue-800' : 
                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                            u.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.status === 'Hoạt động' ? '✅ Hoạt động' : '🔒 Khóa'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                              onClick={() => openEditUserModal(u)}
                              title="Sửa"
                            >
                              ✏️
                            </button>
                            <button 
                              className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                              onClick={() => handleDeleteUser(u.id)}
                              title="Xóa"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.3)] animate-[troXuatHienLen_0.3s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button 
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setIsUserModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="o-nhap" 
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  className="o-nhap" 
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Vai trò <span className="text-red-500">*</span></label>
                <select 
                  className="o-nhap cursor-pointer appearance-none"
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({...userFormData, role: e.target.value as User['role']})}
                  required
                >
                  <option value="Admin">Quản trị viên (Admin)</option>
                  <option value="Văn thư">Văn thư</option>
                  <option value="Người dùng">Người dùng</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
                <select 
                  className="o-nhap cursor-pointer appearance-none"
                  value={userFormData.status}
                  onChange={(e) => setUserFormData({...userFormData, status: e.target.value as User['status']})}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Khóa">Khóa</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" className="nut nut-vien" onClick={() => setIsUserModalOpen(false)}>Hủy bỏ</button>
                <button type="submit" className="nut nut-chinh">Lưu thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
