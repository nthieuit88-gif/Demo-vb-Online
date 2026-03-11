import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { FlashMessage, FlashType } from '../components/FlashMessage';
import { banPhaoHoa } from '../utils/confetti';
import { Signer } from './Signers';
import { supabase } from '../lib/supabase';

export function Request() {
  const [step, setStep] = useState(1);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState({ so: '', ma: '', time: '' });
  const [signers, setSigners] = useState<Signer[]>([]);

  useEffect(() => {
    fetchSigners();
  }, []);

  const fetchSigners = async () => {
    const { data, error } = await supabase.from('signers').select('*').eq('status', 'Hoạt động');
    if (error) {
      console.error('Error fetching signers:', error);
    } else {
      setSigners(data || []);
    }
  };

  const [formData, setFormData] = useState({
    loai: '',
    doKhan: 'thuong',
    trichYeu: '',
    phongBan: '',
    nguoiKy: '',
    chucDanh: '',
    ngayKy: new Date().toISOString().split('T')[0],
    noiNhan: '',
    ghiChu: '',
    xacNhan: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [id]: type === 'checkbox' ? checked : value
      };
      
      // Tự động cập nhật chức danh khi chọn người ký
      if (id === 'nguoiKy') {
        const selectedSigner = signers.find(s => s.name === value);
        newData.chucDanh = selectedSigner ? selectedSigner.title : '';
      }
      
      return newData;
    });
  };

  const validateStep1 = () => {
    if (!formData.loai) { setFlash({ message: 'Vui lòng chọn loại văn bản!', type: 'canh-bao' }); return false; }
    if (!formData.trichYeu.trim()) { setFlash({ message: 'Vui lòng nhập trích yếu nội dung!', type: 'canh-bao' }); return false; }
    if (!formData.phongBan) { setFlash({ message: 'Vui lòng chọn phòng ban gửi!', type: 'canh-bao' }); return false; }
    if (!formData.nguoiKy.trim()) { setFlash({ message: 'Vui lòng chọn người ký!', type: 'canh-bao' }); return false; }
    return true;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!formData.xacNhan) {
        setFlash({ message: 'Vui lòng xác nhận thông tin trước khi gửi!', type: 'canh-bao' });
        return;
      }
      
      setIsSubmitting(true);
      
      const nam = new Date().getFullYear();
      const soThuTu = String(Math.floor(Math.random() * 999) + 100).padStart(4, '0');
      const loaiAbbr = formData.loai.substring(0, 2).toUpperCase();
      const soVanBan = `${loaiAbbr}-${soThuTu}/${nam}`;
      
      // Lưu vào Supabase
      const user = JSON.parse(localStorage.getItem('nguoiDungHienTai') || '{"tenHienThi":"Người dùng"}');
      const { error } = await supabase
        .from('outgoing_docs')
        .insert([{
          so: soVanBan,
          loai: formData.loai,
          trich_yeu: formData.trichYeu,
          noiNhan: formData.noiNhan,
          nguoiKy: formData.nguoiKy,
          ngayBanHanh: formData.ngayKy,
          trangThai: 'cho-duyet',
          nguoiTao: user.tenHienThi || 'Người dùng'
        }]);

      if (error) {
        console.error('Error saving request:', error);
        setFlash({ message: `Lỗi khi lưu yêu cầu lên hệ thống: ${error.message}`, type: 'canh-bao' });
        setIsSubmitting(false);
        return;
      }

      setResult({
        so: soVanBan,
        ma: `YC-${nam}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        time: new Date().toLocaleString('vi-VN')
      });
      
      setIsSubmitting(false);
      setStep(4);
      banPhaoHoa();
      setTimeout(banPhaoHoa, 1000);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      loai: '', doKhan: 'thuong', trichYeu: '', phongBan: '', nguoiKy: '',
      chucDanh: '', ngayKy: new Date().toISOString().split('T')[0], noiNhan: '', ghiChu: '', xacNhan: false
    });
    setFiles([]);
    setStep(1);
  };

  const getUrgencyLabel = (val: string) => {
    const map: Record<string, string> = { 'thuong': 'Thường', 'khan': 'Khẩn', 'thuong-khan': 'Thượng khẩn', 'hoa-toc': 'Hỏa tốc' };
    return map[val] || '—';
  };

  return (
    <Layout title="🔢 Xin Số Điện Tử">
      {flash && (
        <FlashMessage 
          message={flash.message} 
          type={flash.type} 
          onClose={() => setFlash(null)} 
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Progress Tracker */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:px-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-0 hieu-ung-xuat-hien">
          {[
            { num: 1, label: 'Thông tin\nvăn bản' },
            { num: 2, label: 'Đính kèm\ntài liệu' },
            { num: 3, label: 'Xác nhận\n& Gửi' },
            { num: '✓', label: 'Nhận số\n& Hoàn tất' }
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                  step > i + 1 ? 'bg-green-600 text-white' : 
                  step === i + 1 ? 'bg-blue-800 text-white shadow-[0_0_0_4px_rgba(30,64,175,0.2)]' : 
                  'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {s.num}
                </div>
                <span className={`text-sm font-semibold whitespace-pre-line ${
                  step > i + 1 ? 'text-green-600' : 
                  step === i + 1 ? 'text-blue-800 dark:text-blue-400' : 
                  'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`hidden md:block w-10 h-0.5 mx-2 transition-colors duration-300 ${step > i + 1 ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] mb-6 hieu-ung-xuat-hien" style={{ animationDelay: '0.1s' }}>
          
          {/* Step 1 */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-6 pb-3 border-b-2 border-blue-50 dark:border-slate-700 flex items-center gap-2">
              📄 Thông tin văn bản cần xin số
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="loai">Loại văn bản *</label>
                <select id="loai" className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.loai} onChange={handleChange}>
                  <option value="">-- Chọn loại --</option>
                  <option>Công văn</option>
                  <option>Tờ trình</option>
                  <option>Quyết định</option>
                  <option>Thông báo</option>
                  <option>Báo cáo</option>
                  <option>Biên bản</option>
                  <option>Hợp đồng</option>
                  <option>Hướng dẫn</option>
                  <option>Kế hoạch</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="doKhan">Độ khẩn *</label>
                <select id="doKhan" className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.doKhan} onChange={handleChange}>
                  <option value="thuong">Thường</option>
                  <option value="khan">Khẩn</option>
                  <option value="thuong-khan">Thượng khẩn</option>
                  <option value="hoa-toc">Hỏa tốc</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="trichYeu">Trích yếu nội dung *</label>
                <textarea id="trichYeu" className="o-nhap py-2.5 resize-y" rows={3} placeholder="Nhập trích yếu nội dung đầy đủ của văn bản..." required value={formData.trichYeu} onChange={handleChange}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="phongBan">Phòng ban gửi *</label>
                <select id="phongBan" className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.phongBan} onChange={handleChange}>
                  <option value="">-- Chọn phòng ban --</option>
                  <option>Văn phòng</option>
                  <option>Phòng KTHT</option>
                  <option>Phòng Nội vụ</option>
                  <option>Phòng TC-KT</option>
                  <option>Phòng Pháp chế</option>
                  <option>Phòng Kế hoạch</option>
                  <option>Ban lãnh đạo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="nguoiKy">Người ký *</label>
                <select id="nguoiKy" className="o-nhap py-2.5 cursor-pointer appearance-none" required value={formData.nguoiKy} onChange={handleChange}>
                  <option value="">-- Chọn người ký --</option>
                  {signers.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.title})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="chucDanh">Chức danh người ký</label>
                <input type="text" id="chucDanh" className="o-nhap py-2.5" placeholder="VD: Trưởng phòng Văn phòng" value={formData.chucDanh} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="ngayKy">Ngày ký *</label>
                <input type="date" id="ngayKy" className="o-nhap py-2.5" required value={formData.ngayKy} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="noiNhan">Nơi nhận</label>
                <input type="text" id="noiNhan" className="o-nhap py-2.5" placeholder="Cơ quan / đơn vị nhận" value={formData.noiNhan} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="ghiChu">Ghi chú thêm</label>
                <textarea id="ghiChu" className="o-nhap py-2.5 resize-y" rows={2} placeholder="Thông tin bổ sung nếu có..." value={formData.ghiChu} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-6 pb-3 border-b-2 border-blue-50 dark:border-slate-700 flex items-center gap-2">
              📎 Đính kèm tài liệu
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-blue-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <div className="text-4xl mb-2">📁</div>
              <h4 className="text-base font-semibold mb-1 text-slate-800 dark:text-slate-200">Kéo thả file vào đây hoặc nhấp để chọn</h4>
              <p className="text-sm text-slate-500">Hỗ trợ: PDF, Word (.docx), Excel (.xlsx) – Tối đa 10MB / file</p>
              <input type="file" id="fileInput" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileChange} />
            </div>

            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-lg text-sm">
                    <span className="text-xl">{f.type.includes('pdf') ? '📄' : f.type.includes('word') ? '📝' : '📊'}</span>
                    <span className="flex-1 text-slate-800 dark:text-slate-200">{f.name} <span className="text-slate-400">({(f.size / 1024).toFixed(0)} KB)</span></span>
                    <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700 font-bold text-lg">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mt-5 text-sm text-amber-800 dark:text-amber-400">
              ⚠️ <strong>Lưu ý:</strong> Vui lòng đính kèm bản scan hoặc file gốc của văn bản. Văn bản cần có đầy đủ nội dung và chữ ký của người có thẩm quyền trước khi nộp.
            </div>
          </div>

          {/* Step 3 */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-6 pb-3 border-b-2 border-blue-50 dark:border-slate-700 flex items-center gap-2">
              ✅ Xác nhận thông tin yêu cầu
            </h2>

            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-6">
              {[
                { label: 'Loại văn bản', val: formData.loai },
                { label: 'Trích yếu', val: formData.trichYeu },
                { label: 'Phòng ban gửi', val: formData.phongBan },
                { label: 'Người ký', val: formData.nguoiKy },
                { label: 'Chức danh', val: formData.chucDanh },
                { label: 'Ngày ký', val: formData.ngayKy },
                { label: 'Độ khẩn', val: getUrgencyLabel(formData.doKhan) },
                { label: 'Nơi nhận', val: formData.noiNhan },
              ].map((item, i) => (
                <div key={i} className={`flex justify-between py-2.5 text-sm ${i !== 7 ? 'border-b border-blue-200/50 dark:border-blue-800/30' : ''}`}>
                  <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 text-right max-w-[60%]">{item.val || '—'}</span>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 mt-6 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
              <input type="checkbox" id="xacNhan" className="w-4 h-4 mt-0.5 accent-blue-600 shrink-0" checked={formData.xacNhan} onChange={handleChange} />
              <span>Tôi xác nhận các thông tin trên là chính xác và chịu trách nhiệm về nội dung văn bản xin số. Tôi đồng ý với quy định cấp số văn bản của hệ thống.</span>
            </label>
          </div>

          {/* Step 4 */}
          <div className={step === 4 ? 'block' : 'hidden'}>
            <div className="bg-gradient-to-br from-blue-800 to-blue-500 rounded-3xl p-12 text-center text-white hieu-ung-xuat-hien">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-extrabold mb-2">Gửi yêu cầu thành công!</h2>
              <p className="opacity-85 text-sm">Số văn bản được cấp tạm thời:</p>
              <div className="text-5xl font-extrabold my-4">{result.so}</div>
              <p className="opacity-85 text-sm">Yêu cầu của bạn đang được xem xét và sẽ được xác nhận chính thức trong vòng <strong>1 ngày làm việc</strong>.</p>

              <div className="bg-white/10 rounded-2xl p-5 my-6 text-left max-w-md mx-auto">
                <div className="flex justify-between mb-2.5 text-sm border-b border-white/10 pb-2.5">
                  <span className="opacity-75">Mã yêu cầu:</span>
                  <strong className="font-mono tracking-wider">{result.ma}</strong>
                </div>
                <div className="flex justify-between mb-2.5 text-sm border-b border-white/10 pb-2.5">
                  <span className="opacity-75">Thời gian gửi:</span>
                  <strong>{result.time}</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-75">Trạng thái:</span>
                  <strong>⏳ Chờ phê duyệt</strong>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap mt-8">
                <button className="nut nut-trang" onClick={() => window.location.href = '/dashboard'}>🏠 Về Dashboard</button>
                <button className="nut nut-vien border-white/40 text-white hover:bg-white/10" onClick={() => window.print()}>🖨️ In yêu cầu</button>
                <button className="nut nut-vien border-white/40 text-white hover:bg-white/10" onClick={resetForm}>+ Gửi yêu cầu mới</button>
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        {step < 4 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:px-8 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] flex justify-between items-center sticky bottom-4 z-40">
            {step > 1 ? (
              <button className="nut nut-vien nut-nho" onClick={handlePrev}>← Quay lại</button>
            ) : <div></div>}
            
            <button 
              className={`nut nut-chinh nut-nho ${step === 3 ? 'bg-gradient-to-br from-green-600 to-green-500 shadow-green-500/40' : ''}`} 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Đang xử lý...' : step === 3 ? '🚀 Gửi yêu cầu' : 'Tiếp theo →'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
