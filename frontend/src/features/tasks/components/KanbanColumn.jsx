import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const KanbanColumn = ({ column, tasks, onTaskClick }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div className="flex flex-col h-full min-w-0 group">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-2 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "h-2 w-2 rounded-full flex-shrink-0",
            column.id === 'todo' ? "bg-slate-400" : 
            column.id === 'in-progress' ? "bg-primary shadow-[0_0_8px_rgba(123,47,247,0.8)]" : 
            column.id === 'review' ? "bg-orange-500" :
            "bg-green-500"
          )} />
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-foreground/70 truncate">{column.title}</h3>
          <span className="bg-white/5 text-muted-foreground text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/5 flex-shrink-0">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-white/5">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-white/5">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Droppable area — flex-1 + min-h-0 so it takes remaining height and scrolls */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2.5 rounded-[2rem] bg-muted/10 border border-white/5 transition-all hover:bg-muted/20 custom-scrollbar"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex-1 min-h-[120px] border-2 border-dashed border-white/5 rounded-[1.5rem] flex flex-col items-center justify-center text-muted-foreground/10 gap-2">
            <Plus className="h-8 w-8 opacity-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;