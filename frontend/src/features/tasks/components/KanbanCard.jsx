import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { CalendarIcon, MessageSquare, Paperclip, MoreHorizontal, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const priorityMap = {
  'high': { label: 'High', color: 'bg-red-500/10 text-red-500' },
  'medium': { label: 'Medium', color: 'bg-yellow-500/10 text-yellow-500' },
  'low': { label: 'Low', color: 'bg-blue-500/10 text-blue-500' },
};

const KanbanCard = ({ task, onClick }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 min-h-[140px] rounded-3xl border-2 border-primary border-dashed bg-primary/5"
      />
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(task)}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="p-6 cursor-grab active:cursor-grabbing glass-card border border-white/5 hover:border-primary/30 hover:purple-glow transition-all duration-500 rounded-[2rem] bg-[#121212]/50">
        <div className="flex justify-between items-start mb-5">
          <div className={cn(
            "text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-[0.2em] shadow-sm",
            priorityMap[task.priority]?.color || 'bg-secondary text-secondary-foreground'
          )}>
            {priorityMap[task.priority]?.label || task.priority}
          </div>
          <button className="text-muted-foreground/50 hover:text-foreground transition-colors p-1.5 rounded-xl hover:bg-white/5">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-2 mb-6">
          <h4 className="text-lg font-black leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2">{task.title}</h4>
          <p className="text-xs text-muted-foreground/70 line-clamp-2 font-medium leading-relaxed tracking-wide">{task.description}</p>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex items-center -space-x-3">
            {[1, 2].map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-xl border-2 border-[#121212] bg-muted/20 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all">
                <User className="h-4 w-4 text-muted-foreground/50" />
              </div>
            ))}
            <div className="h-8 w-8 rounded-xl border-2 border-[#121212] bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary shadow-lg shadow-primary/20">
              +1
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground/40 font-black">
            {task.dueDate && (
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] hover:text-primary transition-colors cursor-pointer">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="mt-0.5">3</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default KanbanCard;
