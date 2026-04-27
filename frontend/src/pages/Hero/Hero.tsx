
import{  CheckCircle2,
  MessageSquare,
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-background text-on-surface min-h-screen font-['Inter']">
      {/* TopNavBar */}
      <main className="relative pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[80px] opacity-15 -z-10 -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary rounded-full blur-[80px] opacity-15 -z-10 -ml-32 -mb-32" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/20 border border-primary/10">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Trusted & Verified Platform</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-on-surface leading-[1.1]">
              Store, Send, and Secure <span className="text-primary">Your Data</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-lg font-body leading-relaxed">
              Empower your business with a reliable platform for data storage, email, and SMS delivery. Ensure authenticity, compliance, and instant communication—trusted by industry leaders for secure, real-time operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-lg font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                  Try the Demo
                </button>
              </Link>
              <a href="#contact" className="px-8 py-4 rounded-lg font-semibold border border-primary text-primary hover:bg-primary/10 transition-all">
                Contact Sales
              </a>
            </div>
            {/* Trust Signals / Stats */}
            <div className="pt-8 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">ISO 27001</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Certified Security</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">2M+</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Messages Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-on-surface tracking-tighter">99.99%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Uptime Guarantee</div>
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
                <h3 className="text-lg font-semibold text-on-surface">Automated Messaging</h3>
                <p className="text-sm text-on-surface-variant">Send emails and SMS instantly to your clients, with full delivery tracking.</p>
              </div>
              {/* Feature Card 2 */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_20px_50px_-12px_rgba(18,28,42,0.08)] space-y-4 translate-y-8">
                <div className="w-12 h-12 rounded-lg bg-secondary-fixed/30 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-on-surface">End-to-End Encryption</h3>
                <p className="text-sm text-on-surface-variant">Your data is protected with industry-leading security and compliance standards.</p>
              </div>
              {/* Feature Card 3 (Span) */}
              <div className="col-span-2 bg-primary text-on-primary p-8 rounded-xl relative overflow-hidden mt-4">
                <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Real-Time Reliability</div>
                  <h3 className="text-2xl font-bold">Instant Data Sync & Alerts</h3>
                  <p className="text-sm opacity-90 max-w-xs">Seamless, real-time updates and notifications for all your business-critical data and communications.</p>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-right hidden md:block">
                  <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Why Choose Us?</div>
                  <div className="text-xl font-bold leading-tight">Authentic, Audited<br/>Service Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
