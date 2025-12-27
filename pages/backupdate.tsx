
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    X,
    Edit2,
    Trash2,
    Image as ImageIcon,
    MapPin,
    Layers,
    DollarSign,
    Maximize2,
    Clock,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Navigation,
    Hash,
    Phone,
    LayoutGrid,
    Target,
    ArrowRight,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Building2,
    ChevronLeft,
    ChevronRight,
    ChevronLast,
    ChevronFirst
} from 'lucide-react';
import { PropertyItem } from '../types';

interface PropertyDataProps {
    properties: PropertyItem[];
    onAdd: (item: Omit<PropertyItem, 'id' | 'updatedAt'>) => void;
    onUpdate: (item: PropertyItem) => void;
    onDelete: (id: string) => void;
}

export const PropertyData: React.FC<PropertyDataProps> = ({ properties, onAdd, onUpdate, onDelete }) => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    // Quick Stats Calculation
    const stats = useMemo(() => ({
        total: properties.length,
        approved: properties.filter(p => p.isApproved).length,
        new: properties.filter(p => p.status === 'new').length,
        totalValue: properties.reduce((acc, p) => acc + p.price, 0)
    }), [properties]);

    // Advanced Filter State
    const [filters, setFilters] = useState({
        generalSearch: '',
        phoneSearch: '',
        houseNumber: '',
        streetSearch: '',
        transactionType: '',
        productType: '',
        city: 'Hồ Chí Minh',
        district: '',
        ward: '',
        street: '',
        lotNumber: '',
        sheetNumber: '',
        widthMin: '', widthMax: '',
        lengthMin: '', lengthMax: '',
        priceMin: '', priceMax: '',
        areaMin: '', areaMax: '',
        status: '',
        fengShui: '',
        viewedToday: false
    });

    const [formData, setFormData] = useState<Omit<PropertyItem, 'id' | 'updatedAt'>>({
        houseNumber: '', street: '', district: 'Quận 1', ward: '', price: 0, area: 0,
        width: 0, length: 0, info: '', status: 'new', fengShui: 'dong_tu_trach',
        isApproved: false, lotNumber: '', sheetNumber: '', thumbnail: ''
    });

    const filteredProperties = useMemo(() => {
        return properties.filter(p => {
            const matchGeneral = !filters.generalSearch ||
                `${p.houseNumber} ${p.street} ${p.district}`.toLowerCase().includes(filters.generalSearch.toLowerCase());

            const matchLot = !filters.lotNumber || p.lotNumber.includes(filters.lotNumber);
            const matchSheet = !filters.sheetNumber || p.sheetNumber.includes(filters.sheetNumber);
            const matchDistrict = !filters.district || p.district === filters.district;
            const matchStatus = !filters.status || p.status === filters.status;
            const matchFengShui = !filters.fengShui || p.fengShui === filters.fengShui;

            const matchPrice = (!filters.priceMin || p.price >= Number(filters.priceMin) * 1000000000) &&
                (!filters.priceMax || p.price <= Number(filters.priceMax) * 1000000000);
            const matchArea = (!filters.areaMin || p.area >= Number(filters.areaMin)) &&
                (!filters.areaMax || p.area <= Number(filters.areaMax));

            return matchGeneral && matchLot && matchSheet && matchDistrict && matchStatus && matchFengShui && matchPrice && matchArea;
        });
    }, [properties, filters]);

    // Handle pagination logic
    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredProperties.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredProperties, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(filteredProperties.length / rowsPerPage);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, rowsPerPage, properties]);

    const handleResetFilters = () => {
        setFilters({
            generalSearch: '', phoneSearch: '', houseNumber: '', streetSearch: '',
            transactionType: '', productType: '', city: 'Hồ Chí Minh', district: '',
            ward: '', street: '', lotNumber: '', sheetNumber: '',
            widthMin: '', widthMax: '', lengthMin: '', lengthMax: '',
            priceMin: '', priceMax: '', areaMin: '', areaMax: '',
            status: '', fengShui: '', viewedToday: false
        });
    };

    const handleOpenAdd = () => {
        setEditingProperty(null);
        setFormData({
            houseNumber: '', street: '', district: 'Quận 1', ward: '', price: 0, area: 0,
            width: 0, length: 0, info: '', status: 'new', fengShui: 'dong_tu_trach',
            isApproved: false, lotNumber: '', sheetNumber: '', thumbnail: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProperty) onUpdate({ ...editingProperty, ...formData, updatedAt: 'Vừa xong' });
        else onAdd(formData);
        setIsModalOpen(false);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'new': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'transacted': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'deposited': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'rental_contract': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'auction': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-sans pb-20">

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                        <LayoutGrid className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dữ Liệu Nhà Đất</h1>
                        <p className="text-slate-500 font-medium text-sm">Quản lý danh mục đầu tư và giao dịch bất động sản chuyên sâu.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black transition-all border shadow-sm ${isFilterVisible ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">{isFilterVisible ? 'ẨN BỘ LỌC' : 'HIỆN BỘ LỌC'}</span>
                        <span className="sm:hidden">LỌC</span>
                        {isFilterVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button onClick={handleOpenAdd} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white text-[11px] font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                        <Plus className="w-5 h-5" /> THÊM TÀI SẢN
                    </button>
                </div>
            </header>

            {/* FILTER SYSTEM */}
            {isFilterVisible && (
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-200/40 animate-in slide-in-from-top-6 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 hidden md:block">
                        <Building2 className="w-32 h-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-10">

                        {/* Column 1: Tìm kiếm cơ bản */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 px-1 border-b-2 border-indigo-500 w-fit pb-2">
                                <Search className="w-4 h-4 text-indigo-500" /> 1. Tìm kiếm cơ bản
                            </h3>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input placeholder="Điện Thoại Chủ Nhà" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={filters.phoneSearch} onChange={e => setFilters({ ...filters, phoneSearch: e.target.value })} />
                                </div>
                                <div className="relative group">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input placeholder="Số Nhà / Tên Căn" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={filters.houseNumber} onChange={e => setFilters({ ...filters, houseNumber: e.target.value })} />
                                </div>
                                <div className="relative group">
                                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input placeholder="Tên Đường Phố" className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" value={filters.streetSearch} onChange={e => setFilters({ ...filters, streetSearch: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Vị trí hành chính */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 px-1 border-b-2 border-indigo-500 w-fit pb-2">
                                <MapPin className="w-4 h-4 text-indigo-500" /> 2. Vị trí hành chính
                            </h3>
                            <div className="space-y-4">
                                <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1.5 gap-1.5 shadow-inner">
                                    <div className="px-4 py-3 text-[10px] font-black text-indigo-600 bg-white rounded-xl shadow-sm border border-slate-100">TP. HCM</div>
                                    <select value={filters.district} onChange={e => setFilters({ ...filters, district: e.target.value })} className="flex-1 bg-transparent border-none font-bold text-xs outline-none px-2 cursor-pointer">
                                        <option value="">Chọn Quận Huyện...</option>
                                        <option value="Quận 1">Quận 1</option><option value="Quận 2">Quận 2</option><option value="Thủ Đức">Thủ Đức</option><option value="Quận 7">Quận 7</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Số Tờ</label>
                                        <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none shadow-inner" value={filters.sheetNumber} onChange={e => setFilters({ ...filters, sheetNumber: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Số Thửa</label>
                                        <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none shadow-inner" value={filters.lotNumber} onChange={e => setFilters({ ...filters, lotNumber: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Thông số & Giá trị */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 px-1 border-b-2 border-indigo-500 w-fit pb-2">
                                <Maximize2 className="w-4 h-4 text-indigo-500" /> 3. Thông số & Giá trị
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Khoảng Giá (Tỷ)</label>
                                        <span className="text-[10px] font-bold text-indigo-500">Min - Max</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input placeholder="Min" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-center" value={filters.priceMin} onChange={e => setFilters({ ...filters, priceMin: e.target.value })} />
                                        <div className="w-4 h-px bg-slate-300"></div>
                                        <input placeholder="Max" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-center" value={filters.priceMax} onChange={e => setFilters({ ...filters, priceMax: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Diện tích (m²)</label>
                                        <span className="text-[10px] font-bold text-indigo-500">Min - Max</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input placeholder="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-center" value={filters.areaMin} onChange={e => setFilters({ ...filters, areaMin: e.target.value })} />
                                        <div className="w-4 h-px bg-slate-300"></div>
                                        <input placeholder="Max" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-center" value={filters.areaMax} onChange={e => setFilters({ ...filters, areaMax: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Filter Row */}
                    <div className="mt-8 md:mt-12 pt-6 md:pt-10 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 mr-4 bg-slate-50 px-4 py-2 rounded-xl">
                                <Target className="w-4 h-4 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['new', 'deposited', 'transacted', 'auction'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilters({ ...filters, status: filters.status === status ? '' : status })}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${filters.status === status ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                                    >
                                        {status === 'new' ? 'Mới đăng' : status === 'deposited' ? 'Đã cọc' : status === 'transacted' ? 'Đã bán' : 'Đấu giá'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only peer" checked={filters.viewedToday} onChange={e => setFilters({ ...filters, viewedToday: e.target.checked })} />
                                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-tighter transition-colors">Đã Xem Hôm Nay</span>
                            </label>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={handleResetFilters} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"><RotateCcw className="w-5 h-5" /></button>
                                <button className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[12px] font-black uppercase hover:bg-indigo-600 shadow-2xl shadow-slate-300 transition-all active:scale-95 group">
                                    <Search className="w-4 h-4 group-hover:scale-125 transition-transform" /> TÌM KIẾM
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROPERTY LISTING */}
            <div className="space-y-4">
                {/* DESKTOP TABLE VIEW */}
                <div className="hidden md:block bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left min-w-[1600px]">
                            <thead>
                                <tr className="bg-slate-50/80 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-8 py-7 text-center w-16">#</th>
                                    <th className="px-6 py-7 w-32">Hình ảnh</th>
                                    <th className="px-6 py-7">Vị trí & Địa chỉ</th>
                                    <th className="px-6 py-7">Giá trị niêm yết</th>
                                    <th className="px-6 py-7">Thông số (m²)</th>
                                    <th className="px-8 py-7">Ghi chú nghiệp vụ</th>
                                    <th className="px-6 py-7">Pháp lý / Tờ Thửa</th>
                                    <th className="px-6 py-7">Trạng thái</th>
                                    <th className="px-8 py-7 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {paginatedProperties.length > 0 ? paginatedProperties.map((p, idx) => (
                                    <tr key={p.id} className="hover:bg-indigo-50/10 transition-all group">
                                        <td className="px-8 py-7 text-center text-xs font-black text-slate-300 group-hover:text-indigo-600">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                        <td className="px-6 py-7">
                                            <div className="w-24 h-16 rounded-[1.2rem] bg-slate-100 overflow-hidden border border-slate-200 relative group/thumb">
                                                {p.thumbnail ? (
                                                    <img src={p.thumbnail} className="w-full h-full object-cover transition-transform group-hover/thumb:scale-125 duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-6 h-6" /></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-7">
                                            <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{p.houseNumber} {p.street}</div>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{p.district}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7">
                                            <div className="text-base font-black text-indigo-600">{(p.price / 1000000000).toFixed(2)} tỷ</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{(p.price / p.area / 1000000).toFixed(1)} tr/m²</div>
                                        </td>
                                        <td className="px-6 py-7">
                                            <div className="text-sm font-black text-slate-800">{p.area} m²</div>
                                            <div className="text-[10px] text-slate-400 font-bold italic mt-0.5 uppercase tracking-tighter">{p.width}m × {p.length}m</div>
                                        </td>
                                        <td className="px-8 py-7 max-w-sm">
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">{p.info}</p>
                                        </td>
                                        <td className="px-6 py-7">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="text-[10px] font-black text-slate-600 uppercase bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl inline-flex items-center gap-2 w-fit">
                                                    <Layers className="w-3.5 h-3.5 text-slate-400" /> T{p.sheetNumber}-S{p.lotNumber}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {p.updatedAt}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-7">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(p.status)}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button className={`p-2.5 rounded-2xl transition-all shadow-sm ${p.isApproved ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 border-emerald-100' : 'text-slate-200 bg-slate-50 hover:bg-slate-100 border-slate-100'} border`}>
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => { setEditingProperty(p); setFormData(p); setIsModalOpen(true); }} className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-lg"><Edit2 className="w-4.5 h-4.5" /></button>
                                                    <button onClick={() => onDelete(p.id)} className="p-3 text-slate-500 hover:text-rose-600 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-lg"><Trash2 className="w-4.5 h-4.5" /></button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden space-y-4 px-2">
                    {paginatedProperties.length > 0 ? paginatedProperties.map((p, idx) => (
                        <div key={p.id} className="bg-white rounded-[2rem] border border-slate-200 p-5 shadow-sm space-y-4 animate-in fade-in duration-300">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0">
                                    {p.thumbnail ? (
                                        <img src={p.thumbnail} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${getStatusStyle(p.status)}`}>
                                            {p.status}
                                        </span>
                                        <div className="text-[10px] text-slate-400 font-bold">#{(currentPage - 1) * rowsPerPage + idx + 1}</div>
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 truncate leading-tight">{p.houseNumber} {p.street}</h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase">{p.district}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="text-sm font-black text-indigo-600">{(p.price / 1000000000).toFixed(2)} Tỷ</div>
                                        <div className="text-[10px] text-slate-400 font-bold">{p.area} m²</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
                                <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase">T{p.sheetNumber}-S{p.lotNumber}</span>
                                </div>
                                <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase">{p.fengShui === 'dong_tu_trach' ? 'Đông Tứ' : 'Tây Tứ'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Cập nhật: {p.updatedAt}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => { setEditingProperty(p); setFormData(p); setIsModalOpen(true); }} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl transition-all border border-indigo-100"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(p.id)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl transition-all border border-rose-100"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    )) : null}
                </div>

                {/* EMPTY STATE */}
                {filteredProperties.length === 0 && (
                    <div className="py-20 md:py-40 text-center bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 mx-2">
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                                <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-slate-900 font-black text-xl md:text-2xl tracking-tight">Không tìm thấy dữ liệu</p>
                                <p className="text-slate-400 text-sm font-medium">Hệ thống không tìm thấy tài sản nào phù hợp.</p>
                            </div>
                            <button onClick={handleResetFilters} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">XÓA BỘ LỌC</button>
                        </div>
                    </div>
                )}

                {/* PAGINATION CONTROL BAR */}
                {filteredProperties.length > 0 && (
                    <div className="bg-white rounded-[2.5rem] md:rounded-[2rem] border border-slate-200 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mx-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị:</span>
                                <select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10"
                                >
                                    <option value={20}>20 dòng</option>
                                    <option value={50}>50 dòng</option>
                                    <option value={100}>100 dòng</option>
                                </select>
                            </div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
                                Tổng cộng: <span className="text-indigo-600">{filteredProperties.length}</span> tài sản
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-2.5 bg-slate-50 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <ChevronFirst className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2.5 bg-slate-50 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <span className="text-xs font-black text-indigo-600">{currentPage}</span>
                                <span className="text-xs font-bold text-slate-400 mx-2">/</span>
                                <span className="text-xs font-black text-slate-400">{totalPages}</span>
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2.5 bg-slate-50 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-2.5 bg-slate-50 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                <ChevronLast className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* REFINED CRUD MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white max-h-[90vh] flex flex-col">
                        <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    {editingProperty ? <Edit2 className="w-6 h-6 md:w-7 md:h-7" /> : <Plus className="w-6 h-6 md:w-7 md:h-7" />}
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{editingProperty ? 'Cập nhật tài sản' : 'Đăng tài sản mới'}</h3>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Vui lòng kiểm tra kỹ tọa độ & pháp lý trước khi lưu.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 md:p-4 hover:bg-white rounded-2xl transition-all text-slate-400"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-7 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số nhà / Căn số</label>
                                    <input required value={formData.houseNumber} onChange={e => setFormData({ ...formData, houseNumber: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đường phố</label>
                                    <input required value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="space-y-1.5 col-span-2 lg:col-span-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quận/Huyện</label>
                                    <select value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm">
                                        <option>Quận 1</option><option>Quận 2</option><option>Thủ Đức</option><option>Quận 7</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tờ bản đồ</label>
                                    <input required value={formData.sheetNumber} onChange={e => setFormData({ ...formData, sheetNumber: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số thửa</label>
                                    <input required value={formData.lotNumber} onChange={e => setFormData({ ...formData, lotNumber: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giá bán (₫)</label>
                                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl outline-none font-black text-indigo-700" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rộng (m)</label>
                                    <input type="number" step="0.1" value={formData.width} onChange={e => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dài (m)</label>
                                    <input type="number" step="0.1" value={formData.length} onChange={e => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tổng D.Tích</label>
                                    <input type="number" value={formData.area} onChange={e => setFormData({ ...formData, area: parseInt(e.target.value) || 0 })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hướng nhà</label>
                                    <select value={formData.fengShui} onChange={e => setFormData({ ...formData, fengShui: e.target.value as any })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm">
                                        <option value="dong_tu_trach">Đông Tứ Trạch</option>
                                        <option value="tay_tu_trach">Tây Tứ Trạch</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL Hình ảnh (Thumbnail)</label>
                                <input value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-xs" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ghi chú & Đặc điểm</label>
                                <textarea rows={3} placeholder="Ví dụ: View sông, hẻm xe hơi..." value={formData.info} onChange={e => setFormData({ ...formData, info: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium text-sm resize-none" />
                            </div>

                            <div className="pt-6">
                                <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-lg">
                                    {editingProperty ? 'CẬP NHẬT TÀI SẢN' : 'ĐĂNG TÀI SẢN NGAY'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
