
import React, { useState, useEffect } from 'react';
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
import { X, Menu, ShieldAlert, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [users, setUsers] = useState<AppUser[]>([
    { id: '1', name: 'Nguyễn Văn A', email: 'vana@bdsdaily.com', role: 'Admin', views: 1250, status: 'online' },
    { id: '2', name: 'Trần Thị B', email: 'thib@bdsdaily.com', role: 'Editor', views: 840, status: 'online' },
    { id: '3', name: 'Lê Văn C', email: 'vanc@bdsdaily.com', role: 'Viewer', views: 320, status: 'offline' },
    { id: '4', name: 'Phạm Minh D', email: 'minhd@bdsdaily.com', role: 'Admin', views: 2100, status: 'online' },
  ]);

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Cập nhật thị trường tháng 5/2024',
      content: 'Thị trường bất động sản ghi nhận nhiều biến động tích cực tại khu vực phía Đông TP.HCM với sự nóng lên của các dự án đất nền và căn hộ cao cấp.',
      category: 'Thị trường',
      date: '2024-05-22',
      imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '2',
      title: 'Quy hoạch mới tại khu vực Thủ Đức',
      content: 'Chính quyền thành phố vừa công bố lộ trình quy hoạch chi tiết các trục đường huyết mạch, hứa hẹn tạo cú hích cho giá trị bất động sản lân cận.',
      category: 'Quy hoạch',
      date: '2024-05-21',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    }
  ]);

  const [properties, setProperties] = useState<PropertyItem[]>([
    {
      id: 'P1',
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
      houseNumber: '12/5',
      street: 'Nguyễn Cơ Thạch',
      district: 'Quận 2',
      ward: 'An Lợi Đông',
      price: 15500000000,
      area: 85,
      width: 5,
      length: 17,
      info: 'Căn hộ view sông, nội thất cơ bản, pháp lý sổ hồng riêng.',
      status: 'new',
      fengShui: 'dong_tu_trach',
      isApproved: true,
      updatedAt: '2 giờ trước',
      lotNumber: '128',
      sheetNumber: '42'
    },
    {
      id: 'P2',
      thumbnail: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400',
      houseNumber: '458',
      street: 'Võ Văn Kiệt',
      district: 'Quận 1',
      ward: 'Cô Giang',
      price: 42000000000,
      area: 120,
      width: 6,
      length: 20,
      info: 'Mặt tiền kinh doanh sầm uất, đang cho thuê 80tr/tháng.',
      status: 'rental_contract',
      fengShui: 'tay_tu_trach',
      isApproved: true,
      updatedAt: 'Hôm qua',
      lotNumber: '56',
      sheetNumber: '15'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [userFormData, setUserFormData] = useState({ name: '', email: '', role: 'Viewer', views: 0 });

  // Kiểm tra token cũ khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Ở ứng dụng thực tế, ta nên gọi API verify token ở đây
      // Hiện tại ta chỉ giả sử session còn hiệu lực
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (loginData: any) => {
    setIsLoggedIn(true);
    setCurrentUser(loginData.user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
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
        status: 'offline'
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleAddProperty = (item: Omit<PropertyItem, 'id' | 'updatedAt'>) => {
    const newProp: PropertyItem = { id: 'P' + Date.now(), ...item, updatedAt: 'Vừa xong' };
    setProperties([newProp, ...properties]);
  };

  const handleUpdateProperty = (item: PropertyItem) => {
    setProperties(properties.map(p => p.id === item.id ? item : p));
  };

  const handleDeleteProperty = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tài sản này?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleAddNews = (item: Omit<NewsItem, 'id'>) => {
    const newNews: NewsItem = { id: 'N' + Date.now(), ...item };
    setNews([newNews, ...news]);
  };

  const handleUpdateNews = (item: NewsItem) => {
    setNews(news.map(n => n.id === item.id ? item : n));
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản tin này?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <span className="font-black text-lg text-slate-900">BDSDaily</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
        user={currentUser}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto p-4 md:p-8 lg:p-12 max-w-[1600px]">
          {currentView === 'dashboard' && (
            <Dashboard
              users={users}
              onAddUser={() => { setEditingUser(null); setUserFormData({ name: '', email: '', role: 'Viewer', views: 0 }); setIsModalOpen(true); }}
              onEditUser={(user) => { setEditingUser(user); setUserFormData({ name: user.name, email: user.email, role: user.role, views: user.views }); setIsModalOpen(true); }}
              onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))}
            />
          )}

          {currentView === 'news' && (
            <News
              news={news}
              onAdd={handleAddNews}
              onUpdate={handleUpdateNews}
              onDelete={handleDeleteNews}
            />
          )}

          {currentView === 'property_data' && (
            <PropertyData
              properties={properties}
              onAdd={handleAddProperty}
              onUpdate={handleUpdateProperty}
              onDelete={handleDeleteProperty}
            />
          )}

          {currentView === 'favorites' && (
            <Favorites
              properties={properties}
              onRemoveFavorite={(id) => console.log('Remove favorite:', id)}
            />
          )}

          {currentView === 'planning_map' && <PlanningMap />}

          {currentView === 'sales_directory' && (
            <SalesDirectory users={users} />
          )}

          {currentView === 'loan_check' && <LoanCheck />}
          {currentView === 'email_marketing' && <EmailMarketing />}
          {currentView === 'website_marketing' && <WebsiteMarketing />}
          {currentView === 'zalo_marketing' && <ZaloMarketing />}
        </div>
      </main>

      {/* Shared User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">{editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 md:p-8 space-y-5">
              <input type="text" placeholder="Họ tên nhân viên" required value={userFormData.name} onChange={e => setUserFormData({ ...userFormData, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-base" />
              <input type="email" placeholder="Email công ty" required value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-base" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-base">
                  <option value="Admin">Quản trị viên</option>
                  <option value="Editor">Biên tập viên</option>
                  <option value="Viewer">Nhân viên Sales</option>
                </select>
                <input type="number" placeholder="Lượt xem" value={userFormData.views} onChange={e => setUserFormData({ ...userFormData, views: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-base" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl mt-4 transition-all text-lg active:scale-95">
                {editingUser ? 'LƯU THAY ĐỔI' : 'TẠO NHÂN VIÊN'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
