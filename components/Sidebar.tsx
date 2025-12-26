
// Fix: Added missing React and useState imports to resolve errors on lines 39, 41, 119, and 158.
import React, { useState } from 'react';
import {
  RefreshCcw,
  LayoutDashboard,
  Newspaper,
  Home,
  Heart,
  Map as MapIcon,
  Contact,
  CreditCard,
  LogOut,
  Mail,
  Globe,
  MessageCircle,
  X,
  Pin,
  PinOff
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: any; // Thông tin user từ API
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  onLogout,
  isOpen,
  setIsOpen,
  user
}) => {
  // Trạng thái hover tạm thời (Chỉ dành cho Desktop)
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);
  // Trạng thái ghim cố định (Chỉ dành cho Desktop)
  const [isPinned, setIsPinned] = useState(false);

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; category?: string }[] = [
    { id: 'dashboard', label: 'Màn hình chính', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'news', label: 'Bản tin nội bộ', icon: <Newspaper className="w-5 h-5" /> },
    { id: 'property_data', label: 'Dữ Liệu Nhà Đất', icon: <Home className="w-5 h-5" /> },
    { id: 'favorites', label: 'BĐS Yêu Thích', icon: <Heart className="w-5 h-5" /> },
    { id: 'planning_map', label: 'Bản Đồ Quy Hoạch', icon: <MapIcon className="w-5 h-5" /> },
    { id: 'sales_directory', label: 'Danh Bạ Sales', icon: <Contact className="w-5 h-5" /> },
    { id: 'loan_check', label: 'Check Khoản Vay', icon: <CreditCard className="w-5 h-5" /> },
    { category: 'Marketing', id: 'email_marketing', label: 'Email Marketing', icon: <Mail className="w-5 h-5" /> },
    { id: 'website_marketing', label: 'Website Marketing', icon: <Globe className="w-5 h-5" /> },
    { id: 'zalo_marketing', label: 'Zalo Marketing', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  // Logic hiển thị: 
  // - Trên Mobile: Luôn coi là "expanded" để hiện chữ khi drawer mở.
  // - Trên Desktop: Chỉ "expanded" khi được PIN hoặc đang được HOVER.
  const isExpandedDesktop = isPinned || isDesktopHovered;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => setIsDesktopHovered(false)}
        className={`fixed top-0 left-0 bottom-0 z-[80] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:sticky
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-[280px] ${isExpandedDesktop ? 'lg:w-[280px]' : 'lg:w-20'}
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
              <RefreshCcw className="w-5 h-5" />
            </div>
            {/* Chữ BDSDaily: Luôn hiện trên Mobile, Trên Desktop hiện khi Expanded */}
            <span className={`font-black text-xl text-slate-900 tracking-tight whitespace-nowrap transition-all duration-300 
              ${isExpandedDesktop ? 'lg:opacity-100 lg:translate-x-0' : 'lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none'}
              opacity-100 translate-x-0
            `}>
              BDSDaily
            </span>
          </div>

          {/* Desktop Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPinned(!isPinned);
            }}
            className={`hidden lg:flex p-1.5 rounded-lg transition-all duration-300 ${isExpandedDesktop ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'} ${isPinned ? 'bg-indigo-50 text-indigo-600' : 'text-slate-300 hover:bg-slate-100'}`}
            title={isPinned ? "Bỏ ghim" : "Ghim Sidebar"}
          >
            {isPinned ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {/* Category label: Ẩn trên Desktop nếu không Expanded, Luôn hiện trên Mobile */}
              {item.category && (
                <div className={`px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4 animate-in fade-in slide-in-from-left-2 duration-300
                  ${isExpandedDesktop ? 'lg:block' : 'lg:hidden'}
                  block
                `}>
                  {item.category}
                </div>
              )}
              <button
                onClick={() => {
                  setCurrentView(item.id);
                  setIsOpen(false); // Đóng sidebar mobile sau khi chọn
                }}
                className={`w-full flex items-center gap-4 p-4 lg:p-3.5 rounded-2xl text-sm font-bold transition-all group relative ${currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
              >
                <div className={`flex-shrink-0 transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'
                  }`}>
                  {item.icon}
                </div>

                {/* Item label: Logic tương tự Header */}
                <span className={`whitespace-nowrap transition-all duration-300 
                  ${isExpandedDesktop ? 'lg:opacity-100 lg:translate-x-0' : 'lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none'}
                  opacity-100 translate-x-0
                `}>
                  {item.label}
                </span>

                {currentView === item.id && (
                  <div className={`ml-auto w-1.5 h-1.5 bg-white rounded-full ${isExpandedDesktop ? 'lg:block' : 'lg:hidden'} block`}></div>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Footer */}
        <div className={`p-4 mt-auto transition-all duration-300 ${isExpandedDesktop ? 'lg:bg-slate-900' : 'lg:bg-white lg:border-t lg:border-slate-100'} bg-slate-900 lg:static`}>
          {/* Footer content logic */}
          <div className={`${isExpandedDesktop ? 'lg:block' : 'lg:hidden'} block`}>
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">Active</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300 transition-colors text-[10px] font-black uppercase"
                >
                  Logout
                </button>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-white font-black">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-white text-xs truncate">{user?.full_name || 'Administrator'}</div>
                    <div className="text-white/40 text-[10px] truncate">{user?.email || 'admin@bdsdaily.com'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Icon Logout khi thu gọn (Chỉ Desktop) */}
          {!isExpandedDesktop && (
            <button
              onClick={onLogout}
              className="hidden lg:flex w-full items-center justify-center p-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
