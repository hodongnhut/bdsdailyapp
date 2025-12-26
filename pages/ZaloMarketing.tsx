
import React, { useState } from 'react';
import { MessageCircle, Send, Users, ShieldCheck, Zap, History, LayoutPanelLeft, Plus, MoreHorizontal, Smile, Paperclip } from 'lucide-react';

export const ZaloMarketing: React.FC = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-[#0068ff] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 transform -rotate-3">
            <MessageCircle className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Zalo Business</h1>
            <p className="text-slate-500 font-medium text-sm">Hệ thống quản trị Zalo OA và chăm sóc khách hàng tập trung.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-green-50 text-green-600 px-5 py-2.5 rounded-2xl text-[10px] font-black flex items-center gap-2 border border-green-100 shadow-sm shadow-green-50">
            <ShieldCheck className="w-4 h-4" /> OFFICIAL ACCOUNT VERIFIED
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Broadcast Composer */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#0068ff]" /> Gửi tin nhắn Broadcast
                </h2>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn mức hôm nay:</span>
                   <span className="text-xs font-black text-indigo-600">4,250 / 5,000</span>
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhóm khách hàng</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm">
                        <option>Khách hàng quan tâm (12,8K)</option>
                        <option>Đã từng giao dịch (1.2K)</option>
                        <option>Khu vực Quận 2 (840)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại tin nhắn</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm">
                        <option>Tin nhắn thông thường</option>
                        <option>Tin nhắn dạng Card (Hình ảnh + Nút)</option>
                        <option>Tin nhắn File / Tài liệu</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-2 relative">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nội dung chiến dịch</label>
                   <div className="relative">
                      <textarea 
                        rows={5} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Chào mừng bạn đến với BDSDaily, chúng tôi có quỹ căn mới tại..." 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none pb-14" 
                      />
                      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Smile className="w-5 h-5" /></button>
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Paperclip className="w-5 h-5" /></button>
                         </div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{message.length} / 2000</div>
                      </div>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                   <div className="flex items-center gap-3">
                      <input type="checkbox" id="schedule" className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <label htmlFor="schedule" className="text-sm font-bold text-slate-600 cursor-pointer">Lên lịch gửi tự động</label>
                   </div>
                   <button className="bg-[#0068ff] hover:bg-blue-600 text-white font-black py-4 px-12 rounded-[1.5rem] shadow-xl shadow-blue-100 transition-all flex items-center gap-3 active:scale-95">
                     <Send className="w-5 h-5" /> GỬI NGAY
                   </button>
                </div>
             </div>
          </div>

          {/* Interaction Feed */}
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" /> Tương tác khách hàng mới nhất
                </h3>
                <button className="p-2 hover:bg-white rounded-xl transition-all"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>
             </div>
             <div className="divide-y divide-slate-50">
                {[
                  { name: 'Nguyễn Minh Quân', msg: 'Dự án này còn suất nội bộ không ạ?', time: '2 phút trước', avatar: 'N' },
                  { name: 'Trần Thị Thu Thảo', msg: 'Cho mình xin bảng giá chi tiết trục đường chính', time: '15 phút trước', avatar: 'T' },
                  { name: 'Lê Hoàng Long', msg: 'Gửi mình vị trí ghim để mình qua xem nhé', time: '1 giờ trước', avatar: 'L' },
                  { name: 'Phạm Hồng Anh', msg: 'Cảm ơn bạn đã hỗ trợ nhiệt tình', time: '3 giờ trước', avatar: 'P' },
                ].map((chat, i) => (
                  <div key={i} className="p-6 hover:bg-blue-50/30 transition-all flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {chat.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{chat.name}</div>
                        <div className="text-xs text-slate-500 font-medium italic mt-0.5 line-clamp-1">"{chat.msg}"</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{chat.time}</div>
                       <button className="text-[9px] font-black text-[#0068ff] uppercase tracking-widest hover:underline mt-1">Trả lời ngay</button>
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Mở Zalo OA Chat Manager (Full)</button>
             </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 self-start">Tăng trưởng OA</h3>
              <div className="space-y-8 w-full">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users className="w-5 h-5" /></div>
                       <span className="text-sm font-bold text-slate-700">Followers</span>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-black text-slate-900">12,840</div>
                       <div className="text-[9px] font-bold text-green-500">+12%</div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><LayoutPanelLeft className="w-5 h-5" /></div>
                       <span className="text-sm font-bold text-slate-700">Lượt Click Menu</span>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-black text-slate-900">2,410</div>
                       <div className="text-[9px] font-bold text-green-500">+8.4%</div>
                    </div>
                 </div>
              </div>
              <div className="mt-10 w-full pt-8 border-t border-slate-100">
                 <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-[#0068ff] hover:border-[#0068ff] hover:bg-blue-50 transition-all group">
                   <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Liên kết thêm OA</span>
                 </button>
              </div>
           </div>
           
           <div className="bg-gradient-to-br from-[#0068ff] to-[#004dc0] p-8 rounded-[3rem] text-white shadow-xl shadow-blue-100 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-1">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Zalo Ads Budget</h4>
                 <div className="text-3xl font-black">2.500.000 ₫</div>
                 <p className="text-[10px] font-medium opacity-60">Số dư hiện tại cho chiến dịch Quảng cáo</p>
              </div>
              <button className="w-full py-3.5 bg-white text-[#0068ff] font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95">NẠP TIỀN NGAY</button>
           </div>
        </div>
      </div>
    </div>
  );
};
