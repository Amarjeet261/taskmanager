import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ProfileModal from '../profile/ProfileModal';
import { useSidebarStore } from '@/store/sidebarStore';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const AppLayout = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const { theme } = useTheme();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className={cn(
      "flex min-h-screen w-full transition-colors duration-500",
      "bg-[#F8FAFC] dark:bg-[#0D0D0D]",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>
      {/* Subtle Background Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => useSidebarStore.getState().toggleSidebar()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Sidebar />
      
      <div
        className={cn(
          "flex flex-col flex-1 min-h-screen overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "md:pl-64" : "md:pl-20"
        )}
      >
        <Topbar onProfileClick={() => setIsProfileOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-hidden relative flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;
