
import React from 'react';
import { User, Eye, Edit2, Trash2, Plus, TrendingUp } from 'lucide-react';
import { AppUser } from '../types';

interface DashboardProps {
  users: AppUser[];
  onAddUser: () => void;
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {
  const chartData = [
    { day: 'T2', views: 450 },
    { day: 'T3', views: 620 },
    { day: 'T4', views: 580 },
    { day: 'T5', views: 890 },
    { day: 'T6', views: 720 },
    { day: 'T7', views: 950 },
    { day: 'CN', views: 1100 },
  ];
  const maxViews = Math.max(...chartData.map(d => d.views));

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Hệ thống Thống kê</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Chào mừng trở lại, Administrator.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hôm nay</span>
            <span className="text-sm font-bold text-slate-900">22 Tháng 5, 2024</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Lượt xem tin</h2>
              <p className="text-xs md:text-sm text-slate-500">Hoạt động trong 7 ngày qua</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Dữ liệu thực</span>
            </div>
          </div>
          <div className="h-48 md:h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full">
                <div className="w-full relative flex items-end justify-center h-full">
                  <div 
                    className="w-full max-w-[40px] bg-indigo-500 rounded-t-xl transition-all duration-700 hover:bg-indigo-600 shadow-lg"
                    style={{ height: `${(data.views / maxViews) * 100}%` }}
                  >
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                       {data.views}
                     </div>
                  </div>
                </div>
                <span className="mt-3 text-[10px] font-bold text-slate-400 uppercase">{data.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-indigo-600 rounded-[2rem] shadow-xl p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[220px]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
           <div>
              <h3 className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-4">Hiệu suất tháng</h3>
              <div className="text-4xl font-black mb-1">125,4K</div>
              <p className="text-indigo-200 text-xs font-medium">Tương tác người dùng</p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase">
                <span className="opacity-60">Mục tiêu quý</span>
                <span className="flex items-center gap-1 text-green-300"><TrendingUp className="w-3 h-3" /> +12%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[65%] rounded-full"></div>
              </div>
           </div>
        </section>
      </div>

      <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quản lý nhân viên</h2>
            <p className="text-sm text-slate-500">Phân quyền và theo dõi hoạt động</p>
          </div>
          <button onClick={onAddUser} className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> THÊM MỚI
          </button>
        </div>
        
        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Họ tên & Liên hệ</th>
                <th className="px-6 py-5">Vai trò</th>
                <th className="px-6 py-5">Hiệu suất</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">{user.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">{user.role}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-700">{user.views.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Lượt xem</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEditUser(user)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDeleteUser(user.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
