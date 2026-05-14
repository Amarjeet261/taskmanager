import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Plus,
  LayoutList,
  LayoutGrid,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import KanbanBoard from './KanbanBoard';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TasksPageSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-5 w-80 rounded-lg" />
      </div>
      <Skeleton className="h-12 w-40 rounded-2xl" />
    </div>

    <div className="flex justify-between items-center bg-muted/20 p-2 rounded-2xl">
      <Skeleton className="h-10 w-72 rounded-xl" />
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[600px] rounded-3xl" />
      ))}
    </div>
  </div>
);

const TasksPage = () => {
  const [view, setView] = useState('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasks = [], isLoading } = useTasks();

  if (isLoading) return <TasksPageSkeleton />;

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();

    return (
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            <span className="text-gradient">Task</span> Management
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm sm:text-base">
            Organize, track, and complete your projects.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl h-11 px-5 bg-gradient-purple hover:purple-glow shadow-xl shadow-purple-500/20 gap-2 font-bold transition-all text-sm"
          >
            <Plus className="h-4 w-4" />
            Create New Task
          </Button>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-stretch sm:items-center gap-3 bg-card/30 backdrop-blur-md p-2 rounded-2xl border border-white/5 flex-shrink-0 min-w-0">
        <div className="relative flex-1 min-w-0 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-10 bg-muted/30 border-none rounded-xl focus-visible:ring-primary/50 transition-all font-medium w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-white/5">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className={cn(
                'rounded-lg h-8 px-3 gap-1.5 font-bold transition-all text-xs',
                view === 'list'
                  ? 'bg-white dark:bg-white/10 shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              <span>List</span>
            </Button>

            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
              className={cn(
                'rounded-lg h-8 px-3 gap-1.5 font-bold transition-all text-xs',
                view === 'kanban'
                  ? 'bg-white dark:bg-white/10 shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Board</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-10 w-10 border-white/5 bg-muted/30 flex-shrink-0"
          >
            <Filter className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-10 w-10 border-white/5 bg-muted/30 flex-shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content — flex-1 + min-h-0 is critical so this div shrinks properly */}
      <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="h-full min-w-0 overflow-hidden"
          >
            {view === 'list' ? (
              <TaskList tasks={filteredTasks} />
            ) : (
              <KanbanBoard tasks={filteredTasks} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TasksPage;