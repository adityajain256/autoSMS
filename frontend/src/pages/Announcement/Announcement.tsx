import React from "react";
import {

  CheckCircle,
  Filter,
  Fuel,
  Verified,
  MessageSquare,
} from "lucide-react";

const leaderboard = [
  {
    rank: 4,
    initials: "AV",
    name: "Amit Verma",
    company: "Verma Coal Carriers",
    purchase: "₹9,82,400",
    dues: "₹12,500",
    duesColor: "text-error",
  },
  {
    rank: 5,
    initials: "PK",
    name: "Priya Kapadia",
    company: "Kapadia Exports",
    purchase: "₹8,55,200",
    dues: "₹0",
    duesColor: "text-primary",
  },
  {
    rank: 6,
    initials: "SG",
    name: "Suresh Gopinath",
    company: "South Roadways",
    purchase: "₹7,10,000",
    dues: "₹4,200",
    duesColor: "text-error",
  },
  {
    rank: 7,
    initials: "ER",
    name: "Elena Rodriguez",
    company: "International Agro",
    purchase: "₹6,45,000",
    dues: "₹0",
    duesColor: "text-primary",
  },
];

const Podium = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-24 px-4">
    {/* Rank 2 */}
    <div className="order-2 md:order-1 flex flex-col items-center group">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-surface-variant to-secondary-container shadow-lg transition-transform group-hover:scale-105">
          <div className="w-full h-full flex items-center justify-center rounded-full border-4 border-surface bg-emerald-100 text-emerald-800 text-3xl font-black">
            AM
          </div>
        </div>
        <div className="absolute -bottom-2 right-0 bg-secondary text-on-secondary px-3 py-1 rounded-full text-sm font-bold shadow-md">#2</div>
      </div>
      <div className="text-center bg-surface-container-low/50 backdrop-blur px-8 py-6 rounded-lg w-full">
        <h3 className="text-xl font-bold mb-1">Arjun Mehra</h3>
        <p className="text-on-surface-variant text-sm mb-4">Mehra Logistics</p>
        <div className="space-y-1 mb-4">
          <p className="text-lg font-black text-on-surface">18,400 L</p>
          <p className="text-xs font-bold text-primary tracking-wider uppercase">₹16.5L Volume</p>
        </div>
        <span className="inline-flex items-center gap-1 bg-primary-container/30 text-on-primary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
          <Verified className="w-3.5 h-3.5 fill-primary" /> No Dues
        </span>
      </div>
    </div>
    {/* Rank 1 */}
    <div className="order-1 md:order-2 flex flex-col items-center group">
      <div className="relative mb-8 -mt-12">
        <div className="w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-primary to-primary-container shadow-2xl transition-transform group-hover:scale-105">
          <div className="w-full h-full flex items-center justify-center rounded-full border-8 border-surface bg-emerald-100 text-emerald-800 text-5xl font-black">
            SD
          </div>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-2 rounded-full text-xl font-black shadow-xl border-4 border-surface ring-4 ring-primary-container/20">#1</div>
      </div>
      <div className="text-center bg-surface-container-highest/30 backdrop-blur-md px-10 py-10 rounded-lg w-full shadow-xl">
        <h3 className="text-2xl font-black mb-1">Sarah D'Souza</h3>
        <p className="text-on-surface-variant text-sm mb-6">Greenfleet Transports</p>
        <div className="space-y-1 mb-6">
          <p className="text-3xl font-black text-on-surface">24,150 L</p>
          <p className="text-xs font-bold text-primary tracking-wider uppercase">₹21.7L Volume</p>
        </div>
        <span className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2 rounded-full text-xs font-black uppercase tracking-tight shadow-sm">
          <Verified className="w-4 h-4 fill-primary" /> No Dues Clear
        </span>
      </div>
    </div>
    {/* Rank 3 */}
    <div className="order-3 md:order-3 flex flex-col items-center group">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-surface-variant to-tertiary-fixed shadow-lg transition-transform group-hover:scale-105">
          <div className="w-full h-full flex items-center justify-center rounded-full border-4 border-surface bg-emerald-100 text-emerald-800 text-3xl font-black">
            RK
          </div>
        </div>
        <div className="absolute -bottom-2 left-0 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-sm font-bold shadow-md">#3</div>
      </div>
      <div className="text-center bg-surface-container-low/50 backdrop-blur px-8 py-6 rounded-lg w-full">
        <h3 className="text-xl font-bold mb-1">Rajiv Kapoor</h3>
        <p className="text-on-surface-variant text-sm mb-4">Kapoor & Sons Ltd</p>
        <div className="space-y-1 mb-4">
          <p className="text-lg font-black text-on-surface">15,920 L</p>
          <p className="text-xs font-bold text-primary tracking-wider uppercase">₹14.2L Volume</p>
        </div>
        <span className="inline-flex items-center gap-1 bg-primary-container/30 text-on-primary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
          <Verified className="w-3.5 h-3.5 fill-primary" /> No Dues
        </span>
      </div>
    </div>
  </div>
);

const LeaderboardList = () => (
  <div className="space-y-4">
    <div className="flex items-center px-10 py-2 text-label-md uppercase font-bold text-on-surface-variant tracking-widest text-[11px]">
      <div className="w-12">Rank</div>
      <div className="flex-1">Customer Name</div>
      <div className="w-48">Total Purchase (₹)</div>
      <div className="w-48">Dues (₹)</div>
      <div className="w-48 text-right">Actions</div>
    </div>
    {leaderboard.map((item) => (
      <div
        key={item.rank}
        className="group flex items-center bg-surface-container-lowest hover:bg-surface-bright transition-all p-4 px-10 rounded-lg shadow-[0_32px_32px_-4px_rgba(45,52,50,0.06)]"
      >
        <div className="w-12 font-black text-on-surface-variant">{item.rank}</div>
        <div className="flex-1 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-800 text-sm font-bold">
              {item.initials}
            </div>
          </div>
          <div>
            <div className="font-bold text-on-surface">{item.name}</div>
            <div className="text-xs text-on-surface-variant">{item.company}</div>
          </div>
        </div>
        <div className="w-48 font-bold text-on-surface">{item.purchase}</div>
        <div className={`w-48 font-bold ${item.duesColor}`}>{item.dues}</div>
        <div className="w-48 flex justify-end">
          <button className="bg-surface-container-highest/50 hover:bg-primary hover:text-on-primary px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Send Thank You
          </button>
        </div>
      </div>
    ))}
    <div className="flex justify-center pt-12">
      <button className="text-primary font-bold text-sm bg-primary-container/20 hover:bg-primary-container px-12 py-4 rounded-full transition-all">
        Load More Customers
      </button>
    </div>
  </div>
);

const Announcement: React.FC = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-black headline-tight text-on-surface mb-2">Customer Leaderboard</h1>
            <p className="text-on-surface-variant max-w-md">Recognizing our highest volume partners and consistent fuel consumers for this period.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-low px-8 py-4 rounded-lg flex flex-col items-center justify-center min-w-[160px]">
              <span className="text-label-md uppercase font-bold tracking-widest text-on-surface-variant text-[10px] mb-1">Total Fuel Sold</span>
              <span className="text-2xl font-bold text-primary">1.2M Liters</span>
            </div>
            <div className="bg-surface-container-low px-8 py-4 rounded-lg flex flex-col items-center justify-center min-w-[160px]">
              <span className="text-label-md uppercase font-bold tracking-widest text-on-surface-variant text-[10px] mb-1">Avg. Top Dues</span>
              <span className="text-2xl font-bold text-secondary">₹42,500</span>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-16">
          <div className="flex bg-surface-container rounded-full p-1.5 shadow-inner">
            <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-semibold text-sm transition-all">Month</button>
            <button className="text-on-surface-variant px-6 py-2 rounded-full font-semibold text-sm hover:text-on-surface transition-all">Week</button>
            <button className="text-on-surface-variant px-6 py-2 rounded-full font-semibold text-sm hover:text-on-surface transition-all">All-Time</button>
          </div>
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-6 py-3 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">
            <Fuel className="w-4 h-4" />
            &gt; 10,000L
          </button>
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-6 py-3 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors">
            <CheckCircle className="w-4 h-4" />
            No Dues
          </button>
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 px-6 py-3 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors ml-auto">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
        {/* Podium Section */}
        <Podium />
        {/* List View */}
        <LeaderboardList />
      </main>
      <footer className="mt-24 pb-12 text-center text-on-surface-variant opacity-60">
        <div className="max-w-7xl mx-auto px-6 border-t border-surface-container pt-8 flex justify-between items-center">
          <span className="text-xs font-medium">© 2024 Sage Ledger | Petrol Pump Management System</span>
          <div className="flex gap-6">
            <a className="text-xs hover:text-primary transition-colors" href="#">Data Privacy</a>
            <a className="text-xs hover:text-primary transition-colors" href="#">Support</a>
            <a className="text-xs hover:text-primary transition-colors" href="#">Audit Trail</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Announcement;
