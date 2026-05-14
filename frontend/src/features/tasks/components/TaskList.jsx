import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { MoreHorizontal, Calendar as CalendarIcon, ListTodo, Sparkles, User, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TaskModal from './TaskModal';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusMap = {
  'todo': { label: 'To Do', icon: ListTodo, color: 'bg-slate-500/10 text-slate-500' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
  'done': { label: 'Done', icon: CheckCircle2, color: 'bg-green-500/10 text-green-500' },
};

const priorityMap = {
  'high': { label: 'High', color: 'bg-red-500/10 text-red-500' },
  'medium': { label: 'Medium', color: 'bg-blue-500/10 text-blue-500' },
  'low': { label: 'Low', color: 'bg-slate-500/10 text-slate-500' },
};

const TaskList = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 border border-dashed border-white/10 rounded-[2rem] bg-card/10">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-black tracking-tight">No tasks matched</h3>
        <p className="text-muted-foreground mt-2 max-w-xs font-medium">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card 
              onClick={() => setSelectedTask(task)}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-card border-none hover:purple-glow hover:bg-white/[0.05] transition-all duration-300 cursor-pointer rounded-2xl group"
            >
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                  task.status === 'done' ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                )}>
                  {task.status === 'done' ? <CheckCircle2 className="h-6 w-6" /> : <ListTodo className="h-6 w-6" />}
                </div>
                <div className="flex-1 space-y-1 truncate">
                  <p className={cn(
                    "text-base font-bold leading-none transition-colors group-hover:text-primary",
                    task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'
                  )}>
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1 font-medium">{task.description}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto pl-16 md:pl-0">
                <div className="flex items-center gap-2">
                  <div className={cn("text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest", statusMap[task.status]?.color)}>
                    {statusMap[task.status]?.label}
                  </div>
                  <div className={cn("text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest", priorityMap[task.priority]?.color)}>
                    {priorityMap[task.priority]?.label}
                  </div>
                </div>

                <div className="hidden lg:flex items-center -space-x-2">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                {task.dueDate && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-lg">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {format(new Date(task.dueDate), 'MMM d')}
                  </div>
                )}
                
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/10 ml-auto md:ml-0">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <TaskModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        task={selectedTask} 
      />
    </>
  );
};

export default TaskList;
