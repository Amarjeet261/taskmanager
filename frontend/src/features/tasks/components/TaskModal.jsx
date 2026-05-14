import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CalendarIcon, AlignLeft, Flag, Tag, CheckSquare, Paperclip, MessageSquare, X, ChevronRight, User, Sparkles, Trash2 } from 'lucide-react';
import { useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import { useTeam } from '@/features/team/hooks/useTeam';

const TaskModal = ({ isOpen, onClose, task = null }) => {
  const isEditing = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');

  const { data: team } = useTeam();
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(task.id, {
        onSuccess: () => onClose()
      });
    }
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority || 'medium');
      setAssigneeId(task.assigneeId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setAssigneeId('');
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { title, description, status, priority, assigneeId };
    if (isEditing) {
      updateMutation.mutate({ id: task.id, ...payload }, {
        onSuccess: () => onClose()
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const selectedAssignee = team?.find(m => m.id === assigneeId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden border-white/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="px-8 py-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">{isEditing ? 'UPDATE ENTRY' : 'NEW ENTRY'}</span>
            </div>
            {isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogTitle>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title..."
              className="text-4xl font-black border-none px-0 focus-visible:ring-0 shadow-none h-auto bg-transparent placeholder:text-muted-foreground/30"
            />
          </DialogTitle>
          <DialogDescription className="sr-only">Create or edit a task</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground font-black uppercase tracking-[0.2em] text-xs">
                <AlignLeft className="h-4 w-4 text-primary" />
                <h3>Description</h3>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                className="w-full min-h-[200px] p-4 rounded-3xl border border-white/5 bg-muted/20 focus:bg-muted/30 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 resize-none text-base font-medium leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground font-black uppercase tracking-[0.2em] text-xs">
                <CheckSquare className="h-4 w-4 text-primary" />
                <h3>Checklist</h3>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
                    <div className="h-5 w-5 rounded-lg border-2 border-primary/30 group-hover:border-primary transition-all flex items-center justify-center">
                      <div className="h-2 w-2 rounded-sm bg-primary opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">Complete preliminary design research</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="text-primary mt-2 font-black uppercase tracking-widest text-[10px] hover:bg-primary/10">
                  + Add Checkpoint
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 bg-white/[0.02] border-l border-white/5 p-8 space-y-8 overflow-y-auto">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Assignee</h4>
              <div className="relative group">
                <select 
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full h-12 bg-muted/20 rounded-2xl border border-white/5 pl-10 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/50 outline-none appearance-none"
                >
                  <option value="">Unassigned</option>
                  {team?.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              </div>
              {selectedAssignee && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 p-2 bg-primary/5 rounded-xl border border-primary/10">
                  <img src={selectedAssignee.avatar} className="h-6 w-6 rounded-lg" alt="" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{selectedAssignee.name}</span>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Workflow Status</h4>
              <div className="grid grid-cols-1 gap-2">
                {['todo', 'in-progress', 'review', 'done'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all",
                      status === s 
                        ? "bg-primary/20 border-primary/50 text-primary shadow-lg shadow-primary/10" 
                        : "bg-muted/20 border-white/5 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    <div className={cn("h-2 w-2 rounded-full", status === s ? "bg-primary animate-pulse" : "bg-muted-foreground/30")} />
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Urgency Level</h4>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      priority === p 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-muted/20 border-white/5 text-muted-foreground hover:bg-muted/30"
                    )}
                  >
                    <Flag className={cn("h-4 w-4", priority === p ? "text-white" : "text-muted-foreground/50")} />
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Schedule</h4>
              <Button variant="outline" className="w-full justify-start h-11 rounded-2xl border-white/5 bg-muted/10 font-bold hover:bg-primary/10 transition-all">
                <CalendarIcon className="mr-3 h-4 w-4 text-primary" />
                Set Due Date
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 border-t border-white/5 bg-white/[0.01]">
          <div className="flex justify-end gap-4 w-full">
            <Button variant="ghost" onClick={onClose} className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
              Discard
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-2xl h-12 px-10 bg-gradient-purple hover:purple-glow shadow-xl shadow-purple-500/20 font-black uppercase tracking-widest text-xs transition-all"
            >
              {isEditing ? 'Commit Changes' : 'Initialize Task'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
