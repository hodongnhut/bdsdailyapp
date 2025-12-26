
import React, { useState } from 'react';
import { Mail, Send, Users, BarChart3, Plus, Search, Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const EmailMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'draft'>('all');

  const campaigns = [
    { id: 1, name: 'Dự án Căn hộ Quận 2 - Mở bán T6', status: 'sent', reach: '1,200', click: '15%', open: '42%', date: '2024-05-15' },
    { id: 2, name: 'Bản tin BĐS hàng tuần - Số 22', status: 'draft', reach: '5,000', click: '-', open: '-', date: '2024-05-25' },
    { id: 3, name: 'Khách hàng tiềm năng Villa Thủ Đức', status: 'sent', reach: '450', click: '22%', open: '58%', date: '2024-05-10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Email Marketing</h1>
          <p className="text-slate-500 font-medium text-sm">Xây dựng và tối ưu hóa các chiến dịch tiếp thị qua Email tự động.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          TẠO CHIẾN DỊCH
        </button>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Send className="w-5 h-5" />, label: 'Email đã gửi', value: '24.5K', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: <Users className="w-5 h-5" />, label: 'Subscriber', value: '8.2K', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: <BarChart3 className="w-5 h-5" />, label: 'CTR trung bình', value: '12.4%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: 'Tỷ lệ vào Inbox', value: '98.2%', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Management */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {(['all', 'sent', 'draft'] as const).map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab === 'all' ? 'Tất cả' : tab === 'sent' ? 'Đã gửi' : 'Nháp'}
                  </button>
                ))}
             </div>
          </div>
          <div className="relative group lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input placeholder="Tìm kiếm chiến dịch..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Tên chiến dịch</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5">Hiệu suất</th>
                <th className="px-6 py-5">Lịch trình</th>
                <th className="px-8 py-5 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {campaigns.filter(c => activeTab === 'all' || c.status === activeTab).map(c => (
                <tr key={c.id} className="hover:bg-indigo-50/20 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">ID: CMD-{c.id}00X</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {c.status === 'sent' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Gửi thành công
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase">
                        <Clock className="w-3.5 h-3.5" /> Đang chuẩn bị
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                       <div>
                          <div className="text-xs font-black text-slate-900">{c.open}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Mở</div>
                       </div>
                       <div className="w-px h-6 bg-slate-100"></div>
                       <div>
                          <div className="text-xs font-black text-slate-900">{c.click}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Click</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {c.date}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 text-center border-t border-slate-100">
           <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Xem tất cả lịch sử gửi email</button>
        </div>
      </div>
    </div>
  );
};
