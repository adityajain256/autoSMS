import { useEffect, useState } from 'react';
import { ArrowLeft, Search, ChevronDown, MessageSquare, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from '../../components/common/Avatar';
import { api } from '../../utils/api';

export function CreateEntry() {
  const [taxAmount, setTaxAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [data, setData] = useState({
    userId: {
      username: "",
      gstNumber: "",
      totalAmount: "",
    },
    taxAmount: "",
    remark: "",
  });
  const [formData, setFormData] = useState({
    amount: "",
    quantity: "",
    isPaid: false,
    message: "",
  });
  const location = useLocation();
  const clientId = location.state.client;

  const fethcEntry = async () => {
    try {
      const res = await api.get(`/entries/client/${clientId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(res.data)
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const createEntry = async () => {
    try {
      const res = await api.post(`/entries/${clientId}`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(res.data)
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fethcEntry();
  }, []);

  return (
    <div className="flex flex-col max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Heading */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/clients" className="w-10 h-10 rounded-full bg-[#eafaf1] text-[#006c49] flex items-center justify-center hover:bg-[#d1ebd9] transition-colors shadow-sm">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Entry</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-6 mb-10 pl-2">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#006c49] text-white flex items-center justify-center font-bold text-sm shadow-md">
            1
          </div>
          <span className="text-sm font-bold text-gray-900">Select Client</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 max-w-[200px]"></div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#62deb3] text-[#006c49] flex items-center justify-center font-bold text-sm shadow-sm">
            2
          </div>
          <span className="text-sm font-semibold text-gray-500">Entry Details</span>
        </div>
      </div>

      {/* Step 1: Select Client */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-gray-50 p-6 sm:p-10 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-[#006c49] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 1: Select Client</h2>
        </div>

        <div className="w-full bg-[#f4f7fa] hover:bg-[#eef2f6] rounded-[2rem] p-4 flex items-center justify-between cursor-pointer transition-all border border-transparent focus-within:border-primary/30 active:scale-[0.99]">
          <div className="flex items-center gap-4 pl-2">
            <Search className="w-5 h-5 text-gray-400" />
            <Avatar fallback="AM" size="md" className="shadow-sm" />
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">{data[0]?.userId?.username}</h3>
              <p className="text-[11px] font-bold text-gray-500 tracking-wider">{data[0]?.userId?.gstNumber || data[0]?.userId?.vehicle}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-200/50 transition-colors">
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div className="mt-6 bg-[#f4f7fa] rounded-[2rem] py-10 px-6 flex flex-col items-center justify-center text-center">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">{((data[0]?.userId?.totalAmount - data[0]?.amount) > 0) ? "Current Total Paid" : "Total due"}</p>
          <p className={((data[0]?.userId?.totalAmount - data[0]?.amount) > 0) ? "text-4xl font-extrabold text-[#009262] tracking-tight" : "text-4xl font-extrabold text-[#f50c0c] tracking-tight"}>{data[0]?.userId?.totalAmount - data[0]?.amount || "0"}</p>
        </div>
      </div>

      {/* Step 2: Entry Details */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-gray-50 p-6 sm:p-10 mb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-[#006c49] rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 2: Entry Details</h2>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.15em] ml-2">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 font-bold text-gray-500 text-xl">₹</span>
              <input
                type="text"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full h-[72px] pl-12 pr-6 bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white rounded-[2rem] text-2xl font-bold text-gray-900 border border-transparent focus:border-primary/30 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.15em] ml-2">Quantity</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 font-bold text-gray-500 text-xl">₹</span>
              <input
                type="text"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full h-[72px] pl-12 pr-6 bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white rounded-[2rem] text-2xl font-bold text-gray-900 border border-transparent focus:border-primary/30 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>
          </div>


          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.15em] ml-2">Remark / Note</label>
            <div className="relative">
              <textarea
                placeholder="Add details about this tax entry..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                maxLength={150}
                className="w-full min-h-[140px] p-6 bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white rounded-[2rem] text-[15px] font-medium text-gray-800 border border-transparent focus:border-primary/30 outline-none transition-all resize-none shadow-inner bg-opacity-50 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
              <span className="absolute bottom-6 right-8 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                {150 - remark.length} Remaining
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-[0.15em] ml-2">Paid / Due</label>
            <div className="relative flex items-start justify-between">
              <span className="left-6 font-bold text-black pl-3 text-xl">Paid </span>
              <input
                type="checkbox"
                value={formData.isPaid}
                onChange={(e) => setFormData({ ...formData, isPaid: e.target.value })}
                className="w-6 h-6 pl-12 mr-20 bg-[#f4f7fa] hover:bg-[#eef2f6]  focus:bg-white rounded-[2rem] text-2xl font-bold text-gray-900 border border-transparent focus:border-primary/30 outline-none transition-all focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview SMS Message */}
      {/* <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] border border-gray-50 p-6 sm:p-10 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded bg-[#eafaf1] flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[#006c49] fill-current" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Preview SMS Message</h2>
        </div>

        <div className="bg-[#f0f7ff] border border-[#d6e8ff] rounded-[2rem] p-8 sm:p-10 relative">
          <div className="absolute top-0 left-10 -translate-y-1/2">
            <span className="inline-block bg-[#e0f0ff] text-[#0066ff] text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-[#cce4ff]">
              Client Notification
            </span>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-700 leading-relaxed italic mt-2">
            "Your entry has been completed for Rs. <span className="text-[#0066ff] underline decoration-2 underline-offset-4 font-bold">{taxAmount ? taxAmount : '45,000'}</span> on <span className="text-[#0066ff] font-bold">24 Oct 2024</span>. Your total tax filled is Rs. <span className="text-[#0066ff] font-bold">5,27,900</span>. Remark: <span className="text-[#0066ff] font-bold">{remark ? remark : 'Q3 Advance Tax'}</span>"
          </p>
        </div>
      </div> */}

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-16">
        <Link to="/clients" className="w-full sm:w-[240px] h-[64px] bg-white border-2 border-gray-100 text-gray-700 font-bold text-lg rounded-[2rem] hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center shadow-sm">
          Cancel
        </Link>
        <button onClick={createEntry} className="w-full flex-1 h-[64px] bg-[#006c49] text-white font-bold text-lg rounded-[2rem] shadow-[0_12px_24px_-8px_rgba(0,108,73,0.5)] flex items-center justify-center gap-3 hover:bg-[#005a3c] transition-all active:scale-[0.98] hover:shadow-[0_16px_32px_-8px_rgba(0,108,73,0.6)]">
          <Send className="w-5 h-5 fill-current" />
          Create Entry
        </button>
      </div>

    </div>
  );
}
