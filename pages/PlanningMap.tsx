// src/components/PlanningMap.tsx
import React, { useState } from 'react';
import {
  Layers,
  Search,
  LocateFixed,
  Filter,
  X,
  Plus,
  Minus,
  Maximize,
  ArrowUpRight,
  Eye,
  Building2,
  Home,
} from 'lucide-react';
import maplibregl from 'maplibre-gl';
import MapComponent from '../components/MapComponent';
import DistrictSearch from '../components/DistrictSearch';
import '../styles/map.css';

export const PlanningMap: React.FC = () => {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isMobileLayerOpen, setIsMobileLayerOpen] = useState(false);

  const layers = [
    { id: 'planning_2030', label: 'Quy hoạch 2030', desc: 'Sử dụng đất chi tiết' },
    { id: 'current_usage', label: 'Hiện trạng vệ tinh', desc: 'Hình ảnh thực tế' },
    { id: 'transport', label: 'Giao thông', desc: 'Metro & Vành đai' },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      {/* Optional: Add header here later */}
      {/* <header className="bg-white shadow-md ...">...</header> */}

      <div className="flex-1 relative overflow-hidden">
        {/* Real MapLibre Map */}
        <MapComponent onMapReady={setMap} />

        {/* District & Ward Search Dropdown + Coordinate Search */}
        {map && <DistrictSearch map={map} />}

        {/* Zoom Controls */}
        <div className="GroupButtonZoom absolute bottom-6 right-6 z-50">
          <div
            className="ButtonZone Zoom jZoomIn bg-white/90 backdrop-blur-xl rounded-t-2xl shadow-xl border border-white p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => map?.zoomIn()}
          >
            <Plus className="w-6 h-6 text-indigo-600" />
          </div>
          <div
            className="ButtonZone Zoom jZoomOut bg-white/90 backdrop-blur-xl rounded-b-2xl shadow-xl border border-white p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => map?.zoomOut()}
          >
            <Minus className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Top Floating Search UI (Optional - can keep or replace with DistrictSearch) */}
        <div className="absolute top-4 right-4 z-40 pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            <button className="hidden sm:flex px-10 py-6 bg-slate-900 text-white rounded-3xl shadow-2xl hover:bg-indigo-600 font-black text-xs uppercase tracking-widest transition-all items-center gap-2">
              <Filter className="w-5 h-5" /> Lọc BĐS
            </button>
            <button
              onClick={() => setIsMobileLayerOpen(!isMobileLayerOpen)}
              className="lg:hidden p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"
            >
              <Layers className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Layer Switcher (if you want to keep layer toggle UI) */}
        {isMobileLayerOpen && (
          <div className="absolute inset-0 z-60 bg-slate-900/40 backdrop-blur-sm lg:hidden flex items-end">
            <div className="w-full bg-white rounded-t-[2.5rem] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Chọn chế độ bản đồ
                </h3>
                <button
                  onClick={() => setIsMobileLayerOpen(false)}
                  className="p-2 bg-slate-100 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {layers.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setIsMobileLayerOpen(false)}
                    className="w-full p-5 rounded-2xl border text-left bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 transition"
                  >
                    <div className="text-xs font-black uppercase">{l.label}</div>
                    <div className="text-[9px] text-slate-400">{l.desc}</div>
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase">
                  Bản đồ quy hoạch chính thức TP.HCM
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optional: Logo overlay in center top */}
        {/* <div className="logo-overlay">
          <img src="/logo.png" alt="Logo" />
        </div> */}
      </div>
    </div>
  );
};

export default PlanningMap;