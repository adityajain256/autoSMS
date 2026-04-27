

const Footer = () => {
  return (
    <footer className="w-full border-t  border-slate-200/20 dark:border-slate-800/20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold text-slate-900 dark:text-white">LIGHTLEAF</div>
        <div className="flex gap-6">
          <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Privacy Policy</a>
          <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Terms of Service</a>
          <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">Contact Support</a>
          <a className="font-inter text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors hover:underline" href="#">© 2026 LIGHTLEAF Management Systems. All rights reserved.</a>
        </div>
        <div className="font-inter text-xs text-slate-500 dark:text-slate-400">© 2026 LIGHTLEAF Management Systems. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
