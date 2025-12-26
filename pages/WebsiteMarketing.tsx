
import React from 'react';
import { Globe, TrendingUp, Search, Link as LinkIcon, Settings, ExternalLink, MousePointer2, ChevronRight, Zap, Target, ArrowUpRight } from 'lucide-react';

export const WebsiteMarketing: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Website Marketing</h1>
          <p className="text-slate-500 font-medium text-sm">Quản trị SEO, tối ưu tỷ lệ chuyển đổi và phân tích lưu lượng truy cập.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">U{i}</div>
              ))}
           </div>
           <span className="text-xs font-bold text-slate-400 ml-2">3 Quản trị viên</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <Globe className="w-64 h-64" />
             </div>
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Traffic Tổng thể</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">30 ngày gần nhất</p>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-3xl font-black text-slate-900">25,410</div>
                   <div className="text-xs font-black text-green-500 flex items-center justify-end gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời gian xem</div>
                   <div className="text-xl font-black text-slate-900">04:22s</div>
                   <p className="text-[10px] text-slate-400 font-medium mt-1">Ổn định vs tuần trước</p>
                </div>
                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ thoát</div>
                   <div className="text-xl font-black text-slate-900">32.8%</div>
                   <p className="text-[10px] text-green-500 font-medium mt-1">-5% Giảm đáng kể</p>
                </div>
                <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leads mới</div>
                   <div className="text-xl font-black text-slate-900">148</div>
                   <p className="text-[10px] text-indigo-500 font-medium mt-1">Hầu hết từ Mobile</p>
                </div>
             </div>
          </div>

          {/* SEO Performance */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-500" /> SEO Ranking & Keywords
                </h3>
                <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Quản lý từ khóa</button>
             </div>
             <div className="space-y-6">
                {[
                  { keyword: 'căn hộ quận 2 giá rẻ', rank: 3, change: '+2', volume: '12K' },
                  { keyword: 'đất nền thủ đức', rank: 1, change: '0', volume: '8.4K' },
                  { keyword: 'biệt thự thảo điền', rank: 8, change: '-1', volume: '3.2K' },
                  { keyword: 'ký gửi nhà đất hcm', rank: 5, change: '+5', volume: '15.5K' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-400">{i+1}</div>
                       <div className="text-sm font-bold text-slate-700">{item.keyword}</div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-center">
                          <div className="text-xs font-black text-indigo-600">Top {item.rank}</div>
                          <div className={`text-[9px] font-bold ${item.change.includes('+') ? 'text-green-500' : item.change === '0' ? 'text-slate-400' : 'text-red-500'}`}>{item.change}</div>
                       </div>
                       <div className="text-right w-16">
                          <div className="text-xs font-black text-slate-900">{item.volume}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">Search</div>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           {/* SEO Health Circle */}
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl shadow-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 text-slate-400">Website Health Score</h3>
              <div className="flex flex-col items-center justify-center py-6">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                      <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="440" strokeDashoffset="44" className="text-indigo-500 transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black">92</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excellent</span>
                    </div>
                 </div>
              </div>
              <div className="space-y-4 mt-8">
                 <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Mobile Speed</span>
                    <span className="text-green-400">98/100</span>
                 </div>
                 <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Security (SSL)</span>
                    <span className="text-green-400">Active</span>
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Công cụ nhanh</h4>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-slate-700">Audit Website</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">Conversion Goal</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-all" />
              </button>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                 Xem Website <ExternalLink className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
