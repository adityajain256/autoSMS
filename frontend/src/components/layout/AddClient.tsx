import { X, Mail, Phone, CheckCircle2, Bell, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AddClientProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddClient({ isOpen, onClose }: AddClientProps) {
  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[110] w-full max-w-[500px] bg-white shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-3xl flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 sm:p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Client</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Enter client details below to create a new profile.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Section Divider */}
          <div className="flex items-center gap-4">
            <span className="bg-[#eafaf1] text-[#006c49] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Client Information
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-xs font-bold text-gray-800">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp or Rajesh Kumar"
                className="w-full h-12 px-4 rounded-xl bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-xs font-bold text-gray-800">Email Address</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="contact@client.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-xs font-bold text-gray-800">Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-700 font-bold text-sm flex items-center gap-1.5 border-r border-gray-300 pr-3 z-10">
                  <Phone className="w-4 h-4 text-gray-500" />
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className="w-full h-12 pl-20 pr-4 rounded-xl bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none relative"
                />
              </div>
            </div>

            {/* GST Number (Verified state shown as demo) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">GST Number</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  defaultValue="27AAAAA0000A1Z5"
                  className="w-full h-12 pl-4 pr-11 rounded-xl bg-[#ebfcf3] text-[#006c49] text-sm font-bold border border-transparent focus:border-primary/30 transition-all outline-none"
                />
                <div className="absolute right-4 text-[#00a86b]">
                  <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                </div>
              </div>
              <p className="text-[10px] font-medium text-gray-400">Format: 27AAAAA0000A1Z5</p>
            </div>

            {/* Office Address */}
            <div className="space-y-1.5 focus-within:text-primary">
              <label className="text-xs font-bold text-gray-800">Office Address</label>
              <textarea
                placeholder="Enter physical address..."
                className="w-full min-h-[100px] p-4 rounded-xl bg-[#f4f7fa] hover:bg-[#eef2f6] focus:bg-white text-sm font-medium text-gray-800 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <span className="bg-[#eef2f6] text-[#6b7280] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Optional Preferences
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="bg-[#f8faff] rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#006c49]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">SMS Notifications</h4>
                <p className="text-xs font-medium text-gray-500">Auto-send updates to this client</p>
              </div>
            </div>
            {/* Toggle Switch Simple Mock */}
            <div className="w-11 h-6 bg-[#006c49] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="w-full h-12 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button className="w-full h-12 rounded-xl bg-[#009262] hover:bg-[#007b53] text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(0,146,98,0.25)]">
            <UserPlus className="w-5 h-5" strokeWidth={2.5} />
            Save Client
          </button>
        </div>
      </div>
    </>
  );
}
