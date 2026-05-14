import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  startOfWeek, 
  endOfWeek, 
  parseISO, 
  isSameDay,
  addDays,
  subDays,
  startOfDay,
  endOfDay
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  LayoutGrid, 
  List,
  Clock,
  Layers,
  Search,
  Settings2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' | 'week' | 'day'
  const { data: tasks, isLoading } = useTasks();

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handlePrev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const days = useMemo(() => {
    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      return eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    } else {
      return [startOfDay(currentDate)];
    }
  }, [currentDate, view]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[500px]">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 border-[6px] border-primary border-t-transparent rounded-[2rem] purple-glow"
      />
      <p className="mt-6 font-black text-primary uppercase tracking-[0.4em] animate-pulse">Syncing Space-Time...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6 md:gap-10">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-primary mb-3"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Scheduler v4.0</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
            Digital <span className="text-gradient">Timeline</span>.
          </h1>
          <p className="text-muted-foreground mt-4 text-xl font-medium max-w-xl">Synchronize your projects with the cosmic flow of productivity.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-card/40 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white/10 shadow-2xl w-full sm:w-auto">
            {['month', 'week', 'day'].map((v) => (
              <Button
                key={v}
                variant="ghost"
                size="sm"
                onClick={() => setView(v)}
                className={cn(
                  "flex-1 sm:flex-none rounded-2xl h-10 px-5 text-[10px] font-black uppercase tracking-widest transition-all",
                  view === v ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"
                )}
              >
                {v}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-card/40 backdrop-blur-xl rounded-[2rem] p-1.5 border border-white/10 shadow-2xl flex-1 sm:flex-none">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 transition-all" onClick={handlePrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="font-black text-[11px] px-6 min-w-[160px] text-center uppercase tracking-[0.2em] text-primary">
                {view === 'day' ? format(currentDate, 'MMMM d, yyyy') : format(currentDate, 'MMMM yyyy')}
              </span>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 transition-all" onClick={handleNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              className="h-12 w-12 sm:w-auto sm:px-8 rounded-2xl bg-gradient-purple hover:purple-glow shadow-xl shadow-purple-500/20 font-black uppercase tracking-widest text-[10px] gap-2 shrink-0"
              onClick={() => toast.info('Event scheduler opening...')}
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">New Event</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content Area */}
      <div className="flex-1 min-h-[600px] lg:min-h-[800px] bg-card/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col relative">
        {/* Floating Controls */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10">
              <Maximize2 className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10">
              <Settings2 className="h-4 w-4" />
           </Button>
        </div>

        {/* Calendar Body Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${currentDate}`}
            initial={{ opacity: 0, scale: 0.99, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.01, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="flex-1 flex flex-col"
          >
            {view === 'month' && (
              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.02]">
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="p-6 text-center text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-60">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {days.map((day, i) => {
                    const dayTasks = tasks?.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day)) || [];
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <div
                        key={day.toString()}
                        className={cn(
                          "min-h-[160px] p-4 border-r border-b border-white/10 relative group transition-all duration-500",
                          !isCurrentMonth ? 'opacity-10 grayscale pointer-events-none' : 'hover:bg-primary/[0.02]',
                          isTodayDate && 'bg-primary/[0.04]'
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className={cn(
                            "text-xs font-black h-9 w-9 flex items-center justify-center rounded-2xl transition-all",
                            isTodayDate ? 'bg-gradient-purple text-white shadow-xl shadow-purple-500/40 ring-4 ring-purple-500/10 scale-110' : 'text-foreground/40 group-hover:text-foreground/80'
                          )}>
                            {format(day, 'd')}
                          </span>
                          <button className="p-2.5 bg-primary/10 text-primary rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-primary hover:text-white">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2 max-h-[120px] overflow-y-auto no-scrollbar pr-1">
                          {dayTasks.map((task, idx) => (
                            <motion.div 
                              key={task.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={cn(
                                "text-[9px] px-3 py-2 rounded-xl font-black uppercase tracking-[0.1em] truncate cursor-pointer transition-all border border-transparent",
                                task.status === 'done' 
                                  ? 'bg-slate-500/5 text-slate-500/40' 
                                  : task.priority === 'high' 
                                    ? 'bg-red-500/10 text-red-500 border-red-500/10 hover:bg-red-500/20 shadow-lg shadow-red-500/10' 
                                    : 'bg-primary/10 text-primary border-primary/10 hover:bg-primary/20 shadow-lg shadow-purple-500/10'
                              )}
                            >
                              {task.title}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(view === 'week' || view === 'day') && (
              <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto">
                <div className="grid gap-10">
                  {days.map((day) => {
                    const dayTasks = tasks?.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day)) || [];
                    const isTodayDate = isToday(day);
                    
                    return (
                      <div key={day.toString()} className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-48 sticky top-0">
                           <div className={cn(
                             "p-6 rounded-[2.5rem] border transition-all text-center md:text-left",
                             isTodayDate ? "bg-gradient-purple border-transparent text-white shadow-2xl shadow-purple-500/30" : "bg-white/[0.03] border-white/10"
                           )}>
                              <h4 className="text-3xl font-black tracking-tighter mb-1">{format(day, 'd')}</h4>
                              <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isTodayDate ? "text-white/80" : "text-primary")}>{format(day, 'EEEE')}</p>
                           </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                           {dayTasks.map((task) => (
                              <motion.div
                                key={task.id}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="p-6 rounded-[2.5rem] bg-card border border-white/5 glass-card group cursor-pointer relative overflow-hidden"
                              >
                                 <div className={cn(
                                   "absolute top-0 left-0 w-2 h-full",
                                   task.priority === 'high' ? "bg-red-500" : "bg-primary"
                                 )} />
                                 <div className="flex justify-between items-start mb-4">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/5 text-muted-foreground">{task.status}</span>
                                    <Clock className="h-4 w-4 text-primary/40" />
                                 </div>
                                 <h5 className="font-black text-lg tracking-tight mb-2 group-hover:text-primary transition-colors">{task.title}</h5>
                                 <p className="text-xs text-muted-foreground font-medium line-clamp-2 mb-6">{task.description}</p>
                                 <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                       <Sparkles className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Auto-Synced</span>
                                 </div>
                              </motion.div>
                           ))}
                           {dayTasks.length === 0 && (
                             <div className="col-span-full h-32 rounded-[2.5rem] border-2 border-dashed border-white/5 flex items-center justify-center opacity-30">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Void - No Events</span>
                             </div>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarPage;
