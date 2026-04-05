
import {  NavLink } from 'react-router-dom';
import { X, Briefcase, List, User, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';


interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient?: () => void;
}

export function SidebarMenu({ isOpen, onClose, onAddClient }: SidebarMenuProps) {
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Briefcase className="w-5 h-5" /> },
    { to: '/clients', label: 'Clients', icon: <User className="w-5 h-5" /> },
    { to: '/entries', label: 'History', icon: <List className="w-5 h-5" /> },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface-lowest shadow-2xl transition-transform duration-300 lg:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b ghost-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold">
              AS
            </div>
            <span className="font-bold text-xl text-on-surface tracking-tight">AutoSMS</span>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) => cn(
                "px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface hover:bg-surface-container"
              )}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          <div className="mt-4 pt-4 border-t ghost-border">
            <button
              onClick={() => {
                if (onAddClient) onAddClient();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#009262] hover:bg-[#007b53] shadow-md transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
