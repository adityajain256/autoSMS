
import { Link, NavLink } from 'react-router-dom';
import { Menu, Briefcase, List, User, Plus, Send } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { cn } from '../../utils/cn';
import { Button } from '../common/Button';

interface TopNavbarProps {
  onMenuClick: () => void;
  onAddClient?: () => void;
}

export function TopNavbar({ onMenuClick, onAddClient }: TopNavbarProps) {
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/clients', label: 'Clients', icon: <User className="w-4 h-4" /> },
    { to: '/entries', label: 'History', icon: <List className="w-4 h-4" /> },
    { to: '/SMS', label: 'Send SMS', icon: <Send className='w-4 h-4' /> },
  ];


  return (
    <header className="sticky top-0 z-40 w-full h-20 bg-surface-lowest/80 backdrop-blur-md border-b ghost-border">
      <div className="flex h-full items-center justify-between  px-6 lg:px-8">

        {/* Left: Branding & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-md"
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">
              AS
            </div>

            <span className="font-bold text-xl text-on-surface hidden sm:block tracking-tight">AutoSMS</span>
          </div>
        </div>

        {/* Center: Navigation Pills (Desktop) */}
        <nav className="hidden lg:flex items-center gap-2 bg-background p-1.5 rounded-full border ghost-border">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                isActive
                  ? "bg-primary text-on-primary shadow-md"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
              )}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAddClient}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#009262] hover:bg-[#007b53] text-white rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
            Add Client
          </button>
          <div className="w-px h-2 bg-outline-variant/30 mx-1 sm:flex" />
          {
            (localStorage.getItem("token") != null || undefined) ? (
              <Link to="/profile">
                <Avatar fallback="PR" />
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="lg"
                  className="sm:flex items-center gap-2 px-4 py-0 bg-[#009262] hover:bg-[#007b53] text-white rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  Login / Sign-Up
                </Button>
              </Link>
            )
          }
        </div>
      </div>
    </header>
  );
}
