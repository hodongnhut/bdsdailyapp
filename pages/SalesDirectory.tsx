
import React, { useState } from 'react';
import { Contact, Search, Star, Phone, MessageCircle, Mail, MapPin, Award, ChevronRight, UserCheck } from 'lucide-react';
import { AppUser } from '../types';

interface SalesDirectoryProps {
  users: AppUser[];
}

export const SalesDirectory: React.FC<SalesDirectoryProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-100">
            <Contact className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Danh Bạ Sales</h1>
            <p className="text-slate-500 font-medium">Kết nối với đội ngũ chuyên viên môi giới hàng đầu tại từng khu vực.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-emerald-100 shadow-sm">
             <UserCheck className="w-4 h-4" /> 100% VERIFIED AGENTS
           </div>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 md:p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative group">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
           <input 
             placeholder="Tìm kiếm theo tên nhân viên hoặc email..." 
             className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Khu vực:</span>
           <div className="flex flex-wrap gap-2">
              {['Tất cả', 'Quận 1', 'Quận 2', 'Quận 7', 'Thủ Đức'].map(d => (
                <button 
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                    selectedDistrict === d ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Sales Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user, i) => (
          <div key={user.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 group relative overflow-hidden">
            {/* Top Badge */}
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <Award className="w-10 h-10 text-amber-400" />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-3xl shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  {user.name.charAt(0)}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{user.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{user.role} • 5 năm kinh nghiệm</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-sm font-black text-slate-900">{user.views}</div>
                    <div className="text-[8px] font-black text-slate-400 uppercase">Giao dịch</div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-500">
                      4.9 <Star className="w-3 h-3 fill-current" />
                    </div>
                    <div className="text-[8px] font-black text-slate-400 uppercase">Đánh giá</div>
                 </div>
              </div>

              <div className="w-full space-y-3">
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-500 justify-center">
                    <MapPin className="w-4 h-4 text-emerald-500" /> Chuyên trách {i % 2 === 0 ? 'Quận 2' : 'Quận 7'}
                 </div>
                 <div className="flex items-center gap-2 pt-6">
                    <button title="Gọi điện" className="flex-1 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg active:scale-95 group/btn">
                       <Phone className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    </button>
                    <button title="Zalo" className="flex-1 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                       <MessageCircle className="w-5 h-5" />
                    </button>
                    <button title="Email" className="flex-1 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all shadow-sm">
                       <Mail className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Xem hồ sơ năng lực</span>
               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
