
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Tag,
  X,
  Image as ImageIcon,
  Newspaper,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  Share2,
  Printer,
  ChevronRight,
  // Added AlertCircle to fix missing import error on line 327
  AlertCircle
} from 'lucide-react';
import { NewsItem } from '../types';
import { ApiService } from '../services/api';

interface NewsProps {
  onAdd: (item: Omit<NewsItem, 'id'>) => void;
  onUpdate: (item: NewsItem) => void;
  onDelete: (id: string) => void;
}

export const News: React.FC<NewsProps> = ({ onAdd, onUpdate, onDelete }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Tin tức',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { label: 'Thông báo', id: 1, type: 'DOC' },
    { label: 'Tin tức', id: 2, type: 'NEWS' },
    { label: 'Sự kiện', id: 3, type: 'EVENT' },
    { label: 'Tài Liệu', id: 4, type: 'DOC' },
    { label: 'Quy hoạch', id: 5, type: 'NEWS' },
    { label: 'Đào tạo', id: 6, type: 'EVENT' }
  ];

  const fetchNewsData = async () => {
    setLoading(true);
    const res = await ApiService.getNews();
    if (res.success && res.data) {
      const mappedNews: NewsItem[] = res.data.map((item: any) => ({
        id: item.post_id.toString(),
        title: item.post_title,
        content: item.post_content,
        category: item.category?.category_name || item.post_type_label,
        date: item.post_date,
        imageUrl: item.attachments && item.attachments.length > 0
          ? item.attachments[0].file_url
          : ''
      }));
      setNews(mappedNews);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNewsData();
  }, []);

  const handleViewNews = async (id: string) => {
    setDetailLoading(true);
    setIsDetailOpen(true);
    const res = await ApiService.getNewsDetail(id);
    if (res.success && res.data) {
      setSelectedNews(res.data);
    }
    setDetailLoading(false);
  };

  const filteredNews = useMemo(() => {
    return news.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      category: 'Tin tức',
      imageUrl: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      imageUrl: item.imageUrl || '',
      date: item.date
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setActionLoading(true);
      const res = await ApiService.deleteNews(id);
      if (res.success) {
        setNews(prev => prev.filter(n => n.id !== id));
        onDelete(id);
      } else {
        alert(res.message || "Không thể xóa bài viết");
      }
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const categoryObj = categories.find(c => c.label === formData.category) || categories[1];

    if (editingItem) {
      const payload = {
        post_title: formData.title,
        post_content: formData.content,
        is_active: 1
      };
      const res = await ApiService.updateNews(editingItem.id, payload);
      if (res.success) {
        setNews(prev => prev.map(n => n.id === editingItem.id ? {
          ...n,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          date: formData.date,
          imageUrl: formData.imageUrl
        } : n));
        onUpdate({ ...editingItem, ...formData });
        setIsModalOpen(false);
      } else {
        alert(res.message || "Cập nhật bài viết thất bại");
      }
    } else {
      const payload = {
        category_id: categoryObj.id,
        post_title: formData.title,
        post_content: formData.content,
        post_type: categoryObj.type,
        post_date: formData.date,
        is_active: 1
      };
      const res = await ApiService.createNews(payload);
      if (res.success) {
        await fetchNewsData(); // Refresh list to get real data
        onAdd(formData);
        setIsModalOpen(false);
      } else {
        alert(res.message || "Tạo bài viết thất bại");
      }
    }
    setActionLoading(false);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải bản tin...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bản tin nội bộ</h1>
          <p className="text-slate-500 font-medium">Cập nhật tin tức và thông báo mới nhất cho nhân viên.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchNewsData}
            className="p-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
            title="Làm mới"
            disabled={actionLoading}
          >
            <RefreshCcw className={`w-5 h-5 ${actionLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            Tạo bản tin mới
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative group max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề hoặc danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNews.length > 0 ? filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => handleViewNews(item.id)}
            className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col cursor-pointer active:scale-[0.99]"
          >
            <div className="h-48 overflow-hidden relative bg-slate-100">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              <div className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.content }}>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleOpenEdit(e, item)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    disabled={actionLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 group/btn">
                  Đọc tiếp <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </article>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100">
            <Newspaper className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Không tìm thấy bản tin nào phù hợp.</p>
          </div>
        )}
      </div>

      {/* Modal Detail News */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsDetailOpen(false)}></div>
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

            {/* Detail Header / Toolbar */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> <span className="hidden md:inline">Quay lại</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {detailLoading ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                  <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Đang lấy nội dung bài viết...</p>
                </div>
              ) : selectedNews ? (
                <div className="animate-in fade-in duration-500">
                  {/* Hero Image */}
                  {(selectedNews.attachments && selectedNews.attachments.length > 0) && (
                    <div className="w-full h-64 md:h-96 overflow-hidden">
                      <img
                        src={selectedNews.attachments[0].file_url}
                        className="w-full h-full object-cover"
                        alt={selectedNews.post_title}
                      />
                    </div>
                  )}

                  <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                          {selectedNews.category?.name || selectedNews.post_type_label}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> {selectedNews.post_date}
                        </span>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        {selectedNews.post_title}
                      </h1>
                    </div>

                    <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed font-medium">
                      <div dangerouslySetInnerHTML={{ __html: selectedNews.post_content }} />
                    </div>

                    <div className="pt-12 border-t border-slate-100">
                      <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                          <Newspaper className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">Ban Biên Tập BDSDaily</div>
                          <div className="text-xs text-slate-400 font-medium">Cập nhật lúc: {selectedNews.updated_at}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">Không thể tải nội dung bài viết này.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal CRUD News (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingItem ? 'Chỉnh sửa bản tin' : 'Tạo bản tin mới'}</h3>
                <p className="text-slate-500 text-sm font-medium">Điền thông tin chi tiết vào các trường bên dưới.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Tiêu đề bản tin</label>
                <input
                  type="text" required
                  placeholder="VD: Cập nhật thị trường tháng 6/2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Ngày đăng</label>
                  <input
                    type="date" required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">URL Hình ảnh</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Nhập nội dung bản tin tại đây..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingItem ? 'Lưu thay đổi' : 'Đăng bản tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
