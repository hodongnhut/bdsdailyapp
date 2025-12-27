
import React, { useState, useEffect, useCallback } from 'react';
import { AppUser, ViewType, NewsItem, PropertyItem } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { LoanCheck } from './pages/LoanCheck';
import { News } from './pages/News';
import { PropertyData } from './pages/PropertyData';
import { Favorites } from './pages/Favorites';
import { PlanningMap } from './pages/PlanningMap';
import { SalesDirectory } from './pages/SalesDirectory';
import { Login } from './pages/Login';
import { EmailMarketing } from './pages/EmailMarketing';
import { WebsiteMarketing } from './pages/WebsiteMarketing';
import { ZaloMarketing } from './pages/ZaloMarketing';
import { ApiService, LocationPayload } from './services/api';
import { X, Menu, RefreshCcw, UserPlus, Fingerprint, Mail, User as UserIcon, Phone, Lock, Briefcase, Building2, MapPin, MapPinOff, ShieldAlert, Settings, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationAcquired, setIsLocationAcquired] = useState<boolean>(false);

  const [users, setUsers] = useState<AppUser[]>([]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);


  const initialFormState = {
    staffId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Nhân viên',
    department: 'Phòng Kinh doanh',
    views: 0
  };

  const [userFormData, setUserFormData] = useState(initialFormState);

  // --- FETCH USERS LOGIC ---
  const fetchUsers = useCallback(() => {
    ApiService.getUsers().then(res => {
      if (res.success && res.data) {
        // Map data từ API sang structure của AppUser
        const mappedUsers: AppUser[] = res.data.map((u: any) => ({
          id: u.id.toString(),
          staffId: u.username,
          name: u.full_name,
          email: u.email,
          phone: u.phone,
          role: u.username === 'admin' ? 'Quản lý' : 'Nhân viên',
          department: u.username === 'admin' ? 'Ban Giám đốc' : 'Phòng Kinh doanh',
          views: Math.floor(Math.random() * 500) + 100, // Giả lập lượt xem
          status: u.status === 10 ? 'online' : 'offline',
          lat: 10.762622 + (Math.random() - 0.5) * 0.01, // Giả lập vị trí gần đó
          lng: 106.660172 + (Math.random() - 0.5) * 0.01
        }));
        setUsers(mappedUsers);
      }
    });
  }, []);

  // --- LOCATION TRACKING UTIL ---
  const syncLocationToServer = useCallback((latitude: number, longitude: number) => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (/android/i.test(ua)) os = "Android 13";
    else if (/iPad|iPhone|iPod/.test(ua)) os = "iOS";
    else if (/Win/i.test(ua)) os = "Windows 11";

    let browser = "Chrome";
    if (/firefox|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";

    const payload: LocationPayload = {
      latitude,
      longitude,
      device_type: window.innerWidth < 1024 ? "mobile" : "desktop",
      os,
      browser,
      session_id: localStorage.getItem('access_token')?.substring(0, 10) || "abc-123"
    };

    ApiService.saveLocation(payload).then(res => {
      if (res.success) console.debug("Sync vị trí thành công");
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Tải danh sách người dùng ngay khi login
    fetchUsers();

    let watchId: number | null = null;
    const startTracking = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setIsLocationAcquired(true);
            setLocationError(null);
            syncLocationToServer(position.coords.latitude, position.coords.longitude);
          },
          (error) => { console.error("Initial location error", error); },
          { enableHighAccuracy: true, timeout: 5000 }
        );

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setIsLocationAcquired(true);
            setLocationError(null);
            syncLocationToServer(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            let msg = "Vui lòng bật định vị để sử dụng hệ thống.";
            if (error.code === error.PERMISSION_DENIED) {
              msg = "Bạn đã chặn quyền truy cập vị trí. Hệ thống yêu cầu định vị để đảm bảo tính minh bạch và an toàn dữ liệu.";
              setIsLocationAcquired(false);
            }
            setLocationError(msg);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      } else {
        setLocationError("Trình duyệt không hỗ trợ định vị.");
        setIsLocationAcquired(false);
      }
    };

    startTracking();
    return () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); };
  }, [isLoggedIn, syncLocationToServer, fetchUsers]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = (loginData: any) => {
    setIsLoggedIn(true);
    setCurrentUser(loginData.user);
    localStorage.setItem('access_token', loginData.access_token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setIsLocationAcquired(false);
    setLocationError(null);
    localStorage.removeItem('access_token');
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } : u));
    } else {
      const newUser: AppUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userFormData,
        status: 'offline',
        lat: 10.7769,
        lng: 106.7009
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const LocationGuard = () => (
    <div className="fixed inset-0 z-[999] bg-slate-900 flex items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
      <div className="relative max-w-lg w-full space-y-8 animate-in zoom-in-95 duration-500">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500 rounded-[2.5rem] blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-rose-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-rose-900/50">
            <MapPinOff className="w-12 h-12" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white tracking-tight">YÊU CẦU ĐỊNH VỊ</h2>
          <p className="text-slate-400 font-medium leading-relaxed">Hệ thống <span className="text-indigo-400 font-black">BDSDaily</span> yêu cầu bạn phải chia sẻ vị trí thực tế để truy cập dữ liệu nội bộ.</p>
          {locationError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <p className="text-rose-400 text-xs font-bold uppercase tracking-wider">{locationError}</p>
            </div>
          )}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 text-left">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5"><Settings className="w-4 h-4" /></div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">Vào <span className="text-white font-bold">Cài đặt trình duyệt</span> → <span className="text-white font-bold">Quyền riêng tư</span> → <span className="text-white font-bold">Vị trí</span> và chọn <span className="text-indigo-400">Cho phép</span>.</p>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">Đảm bảo nút <span className="text-white font-bold">Vị trí/GPS</span> trong bảng điều khiển nhanh đã được bật.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.location.reload()} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all active:scale-95 text-sm tracking-widest uppercase flex items-center justify-center gap-3"><RefreshCcw className="w-5 h-5" /> KIỂM TRA LẠI</button>
          <button onClick={handleLogout} className="w-full bg-transparent hover:bg-white/5 text-slate-500 font-black py-4 rounded-2xl transition-all text-[10px] tracking-widest uppercase">ĐĂNG XUẤT</button>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;
  if (!isLocationAcquired) return <LocationGuard />;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      <div className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><RefreshCcw className="w-5 h-5" /></div>
          <span className="font-black text-lg text-slate-900">BDSDaily</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"><Menu className="w-6 h-6" /></button>
      </div>

      <Sidebar currentView={currentView} setCurrentView={(view) => { setCurrentView(view); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={handleLogout} user={currentUser} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-4 md:p-8 lg:p-12 max-w-[1600px]">
          {currentView === 'dashboard' && <Dashboard users={users} currentUser={currentUser} onAddUser={() => { setEditingUser(null); setUserFormData(initialFormState); setIsModalOpen(true); }} onEditUser={(user) => { setEditingUser(user); setUserFormData({ ...user, password: '' }); setIsModalOpen(true); }} onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))} />}
          {currentView === 'property_data' && <PropertyData properties={properties} onAdd={() => { }} onUpdate={() => { }} onDelete={() => { }} />}
          {currentView === 'news' && <News news={news} onAdd={() => { }} onUpdate={() => { }} onDelete={() => { }} />}
          {currentView === 'favorites' && <Favorites properties={properties} onRemoveFavorite={() => { }} />}
          {currentView === 'planning_map' && <PlanningMap />}
          {currentView === 'sales_directory' && <SalesDirectory users={users} />}
          {currentView === 'loan_check' && <LoanCheck />}
          {currentView === 'email_marketing' && <EmailMarketing />}
          {currentView === 'website_marketing' && <WebsiteMarketing />}
          {currentView === 'zalo_marketing' && <ZaloMarketing />}
        </div>
      </main>

      {/* Shared User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100"><UserPlus className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
                  <p className="text-xs text-slate-500 font-medium">Quản lý hồ sơ định danh và phân quyền hệ thống</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Mã Nhân Viên</label>
                  <input type="text" placeholder="admin" required value={userFormData.staffId} onChange={e => setUserFormData({ ...userFormData, staffId: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</label>
                  <input type="email" placeholder="email@bdsdaily.com" required value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><UserIcon className="w-3 h-3" /> Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" required value={userFormData.name} onChange={e => setUserFormData({ ...userFormData, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Phone className="w-3 h-3" /> Số điện thoại</label>
                  <input type="tel" placeholder="0901234567" value={userFormData.phone} onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Lock className="w-3 h-3" /> Mật khẩu</label>
                  <input type="password" placeholder="••••••••••••••" value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> Chức vụ</label>
                  <select value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold appearance-none">
                    <option value="Quản lý">Quản lý</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Cộng tác viên">Cộng tác viên</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5"><Building2 className="w-3 h-3" /> Phòng ban</label>
                  <select value={userFormData.department} onChange={e => setUserFormData({ ...userFormData, department: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-bold appearance-none">
                    <option value="Phòng Kế toán">Phòng Kế toán</option>
                    <option value="Phòng Kinh doanh">Phòng Kinh doanh</option>
                    <option value="Phòng Nhân sự">Phòng Nhân sự</option>
                    <option value="Phòng Điều hành">Phòng Điều hành</option>
                    <option value="Ban Giám đốc">Ban Giám đốc</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">Hủy</button>
                <button type="submit" className="flex-[2] bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all text-xs uppercase tracking-widest active:scale-95">{editingUser ? 'LƯU THAY ĐỔI' : 'TẠO NHÂN VIÊN'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
