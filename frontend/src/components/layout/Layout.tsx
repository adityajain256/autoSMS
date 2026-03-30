import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { SidebarMenu } from './SidebarMenu';
import { AddClient } from './AddClient';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNavbar 
        onMenuClick={() => setIsMobileMenuOpen(true)} 
        onAddClient={() => setIsAddClientOpen(true)}
      />
      <SidebarMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onAddClient={() => {
          setIsMobileMenuOpen(false);
          setIsAddClientOpen(true);
        }}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <AddClient 
        isOpen={isAddClientOpen} 
        onClose={() => setIsAddClientOpen(false)} 
      />
    </div>
  );
}
