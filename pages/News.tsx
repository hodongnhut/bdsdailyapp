
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
  RefreshCcw
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Thị trường',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ['Tin tức', 'Thông báo', 'Sự kiện', 'Tài Liệu', 'Quy hoạch', 'Đào tạo'];

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

  const handleOpenEdit = (item: NewsItem) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdate({ ...editingItem, ...formData });
      // Tạm thời cập nhật UI local
      setNews(prev => prev.map(n => n.id === editingItem.id ? { ...n, ...formData } : n));
    } else {
      onAdd(formData);
      // Giả lập ID để hiện local
      const newItem: NewsItem = { id: Math.random().toString(), ...formData };
      setNews(prev => [newItem, ...prev]);
    }
    setIsModalOpen(false);
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
          >
            <RefreshCcw className="w-5 h-5" />
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
          <article key={item.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
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
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                        onDelete(item.id);
                        setNews(prev => prev.filter(n => n.id !== item.id));
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 group/btn">
                  Đọc tiếp <Tag className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
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

      {/* Modal CRUD News */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
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
                      <option key={cat} value={cat}>{cat}</option>
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
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                >
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
