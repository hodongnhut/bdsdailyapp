
import React, { useState } from 'react';
// Added Home to the lucide-react import list
import { Map as MapIcon, Layers, Search, Navigation, Info, Maximize, MousePointer2, ChevronRight, Settings2, Filter, Home } from 'lucide-react';

export const PlanningMap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('planning_2030');

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 animate-in fade-in duration-700 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
            <MapIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bản Đồ Quy Hoạch</h1>
            <p className="text-slate-500 font-medium text-sm">Tra cứu thông tin kế hoạch sử dụng đất TP. HCM đến năm 2030.</p>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden flex relative">
        {/* Sidebar Controls */}
        <aside className="w-80 border-r border-slate-100 p-8 hidden lg:flex flex-col gap-8 z-20 bg-white">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Lớp bản đồ
            </h3>
            <div className="space-y-2">
              {[
                { id: 'planning_2030', label: 'Quy hoạch 2030' },
                { id: 'current_usage', label: 'Hiện trạng sử dụng' },
                { id: 'transport', label: 'Hạ tầng giao thông' },
              ].map(layer => (
                <button 
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    activeLayer === layer.id 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold">{layer.label}</span>
                  {activeLayer === layer.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" /> Chú giải
            </h3>
            <div className="space-y-3 bg-slate-50 p-5 rounded-[2rem] border border-slate-100 shadow-inner">
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Đất ở đô thị</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Đất thương mại</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Công viên cây xanh</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Đất giáo dục</span>
               </div>
            </div>
          </div>

          <div className="mt-auto">
             <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                <Maximize className="w-4 h-4" /> Mở rộng toàn bản đồ
             </button>
          </div>
        </aside>

        {/* Main Map Viewport (Mock) */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.7,10.8,12,0/1200x800?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN282YWhpYjU2ZncifQ==')] bg-cover bg-center opacity-40"></div>
          
          {/* Map Overlay Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-20">
             {Array.from({length: 144}).map((_, i) => (
               <div key={i} className="border-[0.5px] border-slate-400"></div>
             ))}
          </div>

          {/* Floating Controls */}
          <div className="absolute top-8 left-8 right-8 z-30 flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input placeholder="Tìm kiếm địa chỉ, tọa độ, số tờ, số thửa..." className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200 outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10" />
             </div>
             <div className="flex gap-3">
                <button className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl hover:bg-indigo-50 text-indigo-600 transition-all"><Navigation className="w-5 h-5" /></button>
                <button className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xl hover:bg-indigo-50 text-indigo-600 transition-all lg:hidden"><Layers className="w-5 h-5" /></button>
                <button className="px-8 py-5 bg-slate-900 text-white rounded-3xl shadow-xl hover:bg-indigo-600 font-black text-[10px] uppercase transition-all flex items-center gap-2">
                   <Filter className="w-4 h-4" /> Lọc BĐS
                </button>
             </div>
          </div>

          {/* Map Marker (Mock) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20">
             <div className="relative">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce">
                   <Home className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 w-48 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-xs font-black text-slate-900 truncate">Nhà phố Quận 2</div>
                   <div className="text-[10px] text-indigo-600 font-bold mt-1">15.5 Tỷ - 85m²</div>
                   <button className="w-full mt-2 py-2 bg-slate-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase hover:bg-indigo-50">Chi tiết</button>
                </div>
             </div>
          </div>

          <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-30">
             <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center font-black text-lg hover:bg-indigo-50">+</button>
             <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center font-black text-lg hover:bg-indigo-50">-</button>
          </div>
        </div>
      </div>
    </div>
  );
};
