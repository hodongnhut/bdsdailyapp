
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Percent, 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Info, 
  ChevronRight,
  TrendingDown,
  PieChart as PieChartIcon,
  Download,
  Coins
} from 'lucide-react';

export const LoanCheck: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(2000000000);
  const [loanTerm, setLoanTerm] = useState<number>(120); // Months
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [disbursementDate, setDisbursementDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDetails, setShowDetails] = useState(false);

  // Helper function to convert number to Vietnamese readable format (e.g., 1 tỷ 500 triệu)
  const formatToVietnameseWords = (amount: number) => {
    if (amount <= 0) return "0 đồng";
    const bill = Math.floor(amount / 1000000000);
    const mill = Math.floor((amount % 1000000000) / 1000000);
    const rest = amount % 1000000;

    let result = "";
    if (bill > 0) result += `${bill} tỷ `;
    if (mill > 0) result += `${mill} triệu `;
    if (rest > 0 && bill === 0 && mill === 0) result += `${rest.toLocaleString()} `;
    
    return result.trim() + " VNĐ";
  };

  // Financial Calculations
  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  }, [loanAmount, loanTerm, interestRate]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
            <Calculator className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tính Toán Khoản Vay</h1>
            <p className="text-slate-500 font-medium">Công cụ hỗ trợ hoạch định tài chính và ước tính lãi suất ngân hàng.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-7">
            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <DollarSign className="w-3 h-3" /> Số tiền vay (VND)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-xl text-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                />
              </div>
              {/* Dynamic Currency Text */}
              <div className="flex items-center gap-2 px-2 animate-in fade-in slide-in-from-left-2">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-black text-amber-600 uppercase tracking-tight italic">
                  Bằng chữ: {formatToVietnameseWords(loanAmount)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Thời hạn vay
                </label>
                <select 
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm cursor-pointer hover:bg-white transition-all"
                >
                  <option value={6}>6 tháng</option>
                  <option value={12}>12 tháng</option>
                  <option value={24}>24 tháng (2 năm)</option>
                  <option value={60}>60 tháng (5 năm)</option>
                  <option value={120}>120 tháng (10 năm)</option>
                  <option value={180}>180 tháng (15 năm)</option>
                  <option value={240}>240 tháng (20 năm)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Percent className="w-3 h-3" /> Lãi suất (%/năm)
                </label>
                <input 
                  type="number" 
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm" 
                />
              </div>
            </div>

            {/* Date Disbursement */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Ngày giải ngân
              </label>
              <div className="relative group">
                <input 
                  type="date" 
                  value={disbursementDate}
                  onChange={(e) => setDisbursementDate(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer" 
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => setShowDetails(true)}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-sm tracking-widest uppercase flex items-center justify-center gap-3"
              >
                TÍNH TOÁN KHOẢN VAY <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                <Info className="w-5 h-5" />
             </div>
             <div>
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-tight mb-1">Lưu ý chuyên môn</h4>
                <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">Kết quả này mang tính chất tham khảo. Lãi suất thực tế có thể thay đổi tùy theo chính sách ưu đãi của từng ngân hàng tại thời điểm giải ngân.</p>
             </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <TrendingDown className="w-4 h-4 text-emerald-500" /> Kết quả dự tính
               </h3>
               <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                  <Download className="w-5 h-5" />
               </button>
            </div>

            <div className="space-y-8 flex-1">
               <div className="group">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Số tiền gốc và lãi phải trả</div>
                  <div className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tighter">
                    {formatCurrency(results.totalPayment)}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group/card hover:bg-white hover:shadow-xl transition-all duration-500">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Số tiền lãi phải trả</div>
                     <div className="text-2xl font-black text-rose-500">{formatCurrency(results.totalInterest)}</div>
                     <div className="mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-rose-500 h-full transition-all duration-1000" 
                          style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                        ></div>
                     </div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group/card hover:bg-white hover:shadow-xl transition-all duration-500">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Trả hàng tháng (EMI)</div>
                     <div className="text-2xl font-black text-indigo-600">{formatCurrency(results.monthlyPayment)}</div>
                     <p className="text-[10px] text-slate-400 font-bold mt-2 italic uppercase">Dựa trên dư nợ giảm dần</p>
                  </div>
               </div>

               {/* Breakdown visualization */}
               <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                           <PieChartIcon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase">Cơ cấu khoản trả</span>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                           <span className="text-[10px] font-black text-slate-500 uppercase">Vốn gốc</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">{((loanAmount / results.totalPayment) * 100).toFixed(1)}%</span>
                     </div>
                     <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                           <span className="text-[10px] font-black text-slate-500 uppercase">Tiền lãi</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">{((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-10">
               <button 
                 onClick={() => setShowDetails(!showDetails)}
                 className="w-full flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-lg transition-all group"
               >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Xem lịch trả nợ chi tiết</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all ${showDetails ? 'rotate-90' : ''}`} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Table (Shown on Toggle) */}
      {showDetails && (
        <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
           <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Kế hoạch trả nợ hàng tháng</h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiển thị {loanTerm} kỳ thanh toán</div>
           </div>
           <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-8 py-5">Kỳ</th>
                       <th className="px-6 py-5">Dư nợ đầu kỳ</th>
                       <th className="px-6 py-5">Tiền gốc</th>
                       <th className="px-6 py-5">Tiền lãi</th>
                       <th className="px-6 py-5 text-indigo-600">Tổng trả</th>
                       <th className="px-8 py-5 text-right">Dư nợ cuối kỳ</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {Array.from({ length: Math.min(loanTerm, 12) }).map((_, i) => {
                       const startBalance = loanAmount - (loanAmount / loanTerm) * i;
                       const principal = loanAmount / loanTerm;
                       const interest = startBalance * (interestRate / 100 / 12);
                       const endBalance = startBalance - principal;
                       return (
                          <tr key={i} className="hover:bg-slate-50 transition-colors group">
                             <td className="px-8 py-5 text-xs font-black text-slate-400 group-hover:text-indigo-600">{i + 1}</td>
                             <td className="px-6 py-5 text-sm font-bold text-slate-600">{formatCurrency(startBalance)}</td>
                             <td className="px-6 py-5 text-sm font-bold text-slate-900">{formatCurrency(principal)}</td>
                             <td className="px-6 py-5 text-sm font-bold text-rose-500">{formatCurrency(interest)}</td>
                             <td className="px-6 py-5 text-sm font-black text-indigo-600">{formatCurrency(principal + interest)}</td>
                             <td className="px-8 py-5 text-right text-sm font-bold text-slate-400">{formatCurrency(Math.max(0, endBalance))}</td>
                          </tr>
                       );
                    })}
                    {loanTerm > 12 && (
                       <tr>
                          <td colSpan={6} className="px-8 py-6 text-center text-slate-400 text-xs font-bold italic bg-slate-50/50">
                             ... và các kỳ thanh toán tiếp theo đến kỳ thứ {loanTerm}
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
           <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                 Tải xuống bảng tính đầy đủ (Excel) <Download className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
