
import{  CheckCircle2,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-background text-on-surface min-h-screen font-['Inter']">
      {/* TopNavBar */}
      <main className="relative  pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[80px] opacity-15 -z-10 -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary rounded-full blur-[80px] opacity-15 -z-10 -ml-32 -mb-32" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/20 border border-primary/10">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Certified Compliance Engine</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.1]">
              Precision <span className="text-primary">Data</span> Management
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg font-body leading-relaxed">
              The architectural trust framework for modern petrol pump operations. Handle data management and sms handling via secure SMS notifications and automated real-time audit logs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                Get Started
              </button>
              </Link>
            </div>
            {/* Trusted By / Stats */}
            <div className="pt-8 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">99.9%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">1.2M+</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">SMS Handled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">Instant</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Tax Sync</div>
              </div>
            </div>
          </div>
          {/* Bento Visual Component */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Feature Card 1 */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_-12px_rgba(18,28,42,0.08)] space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary-fixed/30 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Automated SMS Alerts</h3>
                <p className="text-sm text-on-surface-variant">Instant notifications for every fuel entry and tax liability update.</p>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_-12px_rgba(18,28,42,0.08)] space-y-4 translate-y-8">
                <div className="w-12 h-12 rounded-lg bg-secondary-fixed/30 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">Secure Transaction Logs</h3>
                <p className="text-sm text-on-surface-variant">Military-grade encryption for all financial and operational data.</p>
              </div>
              {/* Feature Card 3 (Span) */}
              <div className="col-span-2 bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden mt-4">
                <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Real-Time Processing</div>
                  <h3 className="text-2xl font-bold">Real-time Tax Calculation</h3>
                  <p className="text-sm opacity-90 max-w-xs">Automated algorithmic processing of state and federal fuel taxes as they happen.</p>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right hidden md:block">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Capability</div>
                  <div className="text-xl font-bold leading-tight">Enterprise-grade<br/>SMS Automation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full border-t border-slate-200/20 dark:border-slate-800/20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-bold text-slate-900 dark:text-white">AUTOSMS</div>
          <div className="flex gap-6">
            <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Privacy Policy</a>
            <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Terms of Service</a>
            <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Contact Support</a>
            <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">© 2024 AUTOSMS Management Systems. All rights reserved.</a>
          </div>
          <div className="font-inter text-xs text-slate-500 dark:text-slate-400">© 2024 AUTOSMS Management Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
