import React from 'react';
import { Menu, Search, Bell, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';

const Topbar = ({ onProfileClick }) => {
  const { user } = useAuthStore();
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 glass border-b border-white/5 dark:border-white/5 light:border-slate-200">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-foreground">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="w-64 lg:w-96 pl-10 bg-muted/30 border-white/5 focus-visible:ring-primary/50 focus-visible:bg-muted/50 transition-all rounded-xl"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </motion.div>
        
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        </Button>

        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-2 cursor-pointer group"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-black text-foreground leading-none tracking-tight">{user?.name}</span>
            <span className="text-[10px] text-primary uppercase tracking-widest font-black mt-1">{user?.role || 'Pro Member'}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-purple p-[1.5px] group-hover:purple-glow transition-all duration-300">
            <div className="h-full w-full rounded-[9px] bg-background flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              ) : (
                <UserIcon className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
