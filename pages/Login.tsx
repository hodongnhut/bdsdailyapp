
import React, { useState } from 'react';
import { RefreshCcw, User, Lock, ArrowRight, ArrowLeft, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [form, setForm] = useState({ identifier: '', password: '', resetEmail: '' });
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập xử lý đăng nhập
    setTimeout(() => {
      onLogin(form.identifier);
      setLoading(false);
    }, 800);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gửi email phục hồi
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 font-sans">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 mb-6 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <RefreshCcw className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">BDSDaily</h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Hệ thống quản lý dữ liệu BĐS 4.0</p>
        </div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          {view === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email / Mã nhân viên</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={form.identifier} 
                    onChange={(e) => setForm({...form, identifier: e.target.value})} 
                    placeholder="nhanvien@bdsdaily.com" 
                    className="block w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-base" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                  <button 
                    type="button" 
                    onClick={() => { setView('forgot'); setResetSent(false); }}
                    className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                  >
                    Quên?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    required 
                    value={form.password} 
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    placeholder="••••••••" 
                    className="block w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-base" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <RefreshCcw className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>VÀO HỆ THỐNG</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-2">Quên mật khẩu?</h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Nhập email của bạn để nhận hướng dẫn phục hồi tài khoản.</p>

              {!resetSent ? (
                <form onSubmit={handleReset} className="space-y-7">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email đăng ký</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        required 
                        value={form.resetEmail}
                        onChange={(e) => setForm({...form, resetEmail: e.target.value})}
                        placeholder="email@example.com" 
                        className="block w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-base" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? (
                      <RefreshCcw className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span>GỬI YÊU CẦU</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl text-center animate-in zoom-in duration-300">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-100">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2 text-lg">Đã gửi email!</h3>
                  <p className="text-xs text-indigo-700 font-medium">Chúng tôi đã gửi link đặt lại mật khẩu đến <span className="font-bold">{form.resetEmail}</span>. Vui lòng kiểm tra hộp thư.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-center mt-10 text-slate-400 text-sm font-medium">
          © 2024 BDSDaily Ecosystem. Bản quyền thuộc về Team Dev.
        </p>
      </div>
    </div>
  );
};
