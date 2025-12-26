
import React, { useState } from 'react';
import { Heart, MapPin, Maximize2, DollarSign, Trash2, ArrowRight, Home, LayoutGrid } from 'lucide-react';
import { PropertyItem } from '../types';

interface FavoritesProps {
  properties: PropertyItem[];
  onRemoveFavorite: (id: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ properties, onRemoveFavorite }) => {
  const favoriteProperties = properties.slice(0, 3); // Giả lập lấy danh sách yêu thích

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-rose-100">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">BĐS Yêu Thích</h1>
            <p className="text-slate-500 font-medium">Danh sách các tài sản tiềm năng bạn đã lưu trữ để theo dõi.</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900">{favoriteProperties.length}</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài sản đã lưu</div>
        </div>
      </header>

      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {favoriteProperties.map((p) => (
            <div key={p.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={p.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest shadow-lg">
                    HOT DEAL
                  </span>
                </div>
                <button 
                  onClick={() => onRemoveFavorite(p.id)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur text-rose-500 rounded-2xl flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-3.5 h-3.5" /> {p.district}
                  </div>
                  <div className="text-xs font-black text-indigo-600">{(p.price / 1000000000).toFixed(2)} Tỷ</div>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-1">{p.houseNumber} {p.street}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 font-medium mb-6 leading-relaxed">
                  {p.info}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 mb-8">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">{p.area} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600">{p.width}x{p.length}m</span>
                  </div>
                </div>
                
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                  XEM CHI TIẾT <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center bg-white rounded-[4rem] border border-slate-100 shadow-sm">
           <Heart className="w-20 h-20 text-slate-100 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-slate-900 mb-2">Chưa có tài sản yêu thích</h3>
           <p className="text-slate-400 font-medium">Hãy dạo quanh "Dữ liệu nhà đất" và lưu lại những căn nhà ưng ý nhé.</p>
        </div>
      )}
    </div>
  );
};
