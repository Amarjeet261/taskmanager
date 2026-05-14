import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  PanelLeftClose, 
  PanelLeft,
  Zap
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Users, label: 'Team', path: '/team' },
];

import useAuthStore from '@/store/authStore';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { logout } = useAuthStore();

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 256 : 80,
        x: (typeof window !== 'undefined' && window.innerWidth < 768) ? (isOpen ? 0 : -256) : 0,
      }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out",
        "bg-[#0A0A0A] border-r border-white/5 dark:bg-[#0D0D0D]",
        "light:bg-white light:border-slate-200",
        !isOpen && "md:w-20"
      )}
      aria-label="Main Navigation"
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg tracking-tight text-white dark:text-white light:text-slate-900"
              >
                Task<span className="text-[#9D4EDD]">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white/50 hover:text-white hover:bg-white/10 hidden md:flex"
        >
          {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={`Navigate to ${item.label}`}
            onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200",
                isActive
                  ? "bg-gradient-purple text-white shadow-lg shadow-purple-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110")} />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {!isOpen && (
               <div className="absolute left-14 hidden group-hover:block z-50 px-2 py-1 bg-black text-white text-xs rounded-md border border-white/10 whitespace-nowrap">
                 {item.label}
               </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 flex flex-col gap-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
              isActive
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0 group-hover:rotate-45 transition-transform" />
          {isOpen && <span>Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span>Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
