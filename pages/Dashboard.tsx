
import React, { useState, useMemo } from 'react';
import { User, Edit2, Trash2, CheckCircle2, DollarSign, Plus, TrendingUp, Building2, Briefcase, Hash, MapPin, X, Navigation, Battery, SignalHigh } from 'lucide-react';
import { AppUser } from '../types';

interface DashboardProps {
  users: AppUser[];
  currentUser: any;
  onAddUser: () => void;
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ users, currentUser, onAddUser, onEditUser, onDeleteUser }) => {
  const [viewingUserLocation, setViewingUserLocation] = useState<AppUser | null>(null);

  const stats = useMemo(() => ({
    total: 200000,
    approved: 200,
    new: 10,
    totalValue: 10000000000000000000
  }));

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

  // Kiểm tra quyền quản trị
  const canManageUsers = currentUser?.role_code === 'super_admin' || currentUser?.role_code === 'manager';

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Quản trị Hệ thống</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Chào mừng trở lại, {currentUser?.full_name || 'Administrator'}.</p>
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

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tổng tài sản', value: stats.total, icon: <Building2 />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Đã duyệt tin', value: stats.approved, icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Sản phẩm mới', value: stats.new, icon: <TrendingUp />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Tổng giá trị (Tỷ)', value: (stats.totalValue / 1000000000).toFixed(1), icon: <DollarSign />, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
              {/* Fix: casting to React.ReactElement<any> to avoid type mismatch when cloning icon with className */}
              {React.cloneElement(stat.icon as React.ReactElement<any>, { className: "w-7 h-7" })}
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

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

      {canManageUsers && (
        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Quản lý nhân sự</h2>
              <p className="text-sm text-slate-500">Danh sách nhân viên định danh toàn hệ thống</p>
            </div>
            <button onClick={onAddUser} className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white text-[11px] font-black py-4 px-8 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest">
              <Plus className="w-4 h-4" /> THÊM MỚI
            </button>
          </div>

          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Định danh NV</th>
                  <th className="px-6 py-5">Họ tên & Liên hệ</th>
                  <th className="px-6 py-5">Phòng ban</th>
                  <th className="px-6 py-5">Chức vụ</th>
                  <th className="px-6 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{user.staffId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">{user.name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-500">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-300" /> {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingUserLocation(user)}
                          title="Xem vị trí"
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
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
      )}

      {/* User Location Modal */}
      {viewingUserLocation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setViewingUserLocation(null)}></div>
          <div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <Navigation className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Vị trí Nhân viên: {viewingUserLocation.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">Đang theo dõi trực tiếp từ thiết bị định danh</p>
                </div>
              </div>
              <button onClick={() => setViewingUserLocation(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Map Area */}
              <div className="flex-1 h-[450px] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/106.66,10.76,13,0/800x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN282YWhpYjU2ZncifQ==')] bg-cover bg-center"></div>

                {/* Target Pulse Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 w-12 h-12 bg-indigo-500 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-2 border-indigo-600">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                        {viewingUserLocation.name.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl">
                      Tọa độ: {viewingUserLocation.lat?.toFixed(4)}, {viewingUserLocation.lng?.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 z-10 flex gap-2">
                  <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-white/20 shadow-lg flex items-center gap-2">
                    <Battery className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-700">84%</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-xl border border-white/20 shadow-lg flex items-center gap-2">
                    <SignalHigh className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-700">4G LTE</span>
                  </div>
                </div>
              </div>

              {/* Info Area */}
              <div className="w-full lg:w-80 bg-slate-50 border-l border-slate-100 p-8 space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Thông tin hành trình</label>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Vị trí hiện tại</div>
                        <div className="text-[10px] text-slate-500 font-medium">Gần khu vực {viewingUserLocation.department === 'Phòng Kinh doanh' ? 'Quận 12, TP. HCM' : 'Quận 10, TP. HCM'}</div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Trạng thái</div>
                        <div className="text-[10px] text-emerald-600 font-bold uppercase">Đang di chuyển (8km/h)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200">
                  <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100">
                    <div className="text-[10px] font-black uppercase opacity-60 mb-1">Cập nhật lần cuối</div>
                    <div className="text-sm font-bold">14:22:15 - Hôm nay</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" /> Gửi yêu cầu check-in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
