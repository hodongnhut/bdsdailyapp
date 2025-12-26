
import React, { useState } from 'react';
import { RefreshCcw, User, Lock, ArrowRight, ArrowLeft, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [form, setForm] = useState({ identifier: '', password: '', resetEmail: '' });
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = '/auth/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: form.identifier,
          password: form.password,
        }),
      });

      const result = await response.json();

      if (result.status === true) {
        localStorage.setItem('access_token', result.data.access_token);
        onLogin(result.data);
      } else {
        setError(result.msg || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Lỗi kết nối hệ thống. Vui lòng kiểm tra lại đường truyền hoặc Proxy.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-bold animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.identifier}
                    onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                    placeholder="admin"
                    className="block w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setResetSent(false); setError(null); }}
                    className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                        onChange={(e) => setForm({ ...form, resetEmail: e.target.value })}
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
          © 2024 BDSDaily. Bản quyền thuộc về StoneNetwork.
        </p>
      </div>
    </div>
  );
};
