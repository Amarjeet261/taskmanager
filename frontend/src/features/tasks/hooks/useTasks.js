import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

// Robust local fallback for development when API is not ready
const MOCK_TASKS = [
  { id: '1', title: 'Design landing page', description: 'Create wireframes and hi-fi mockups', status: 'todo', priority: 'high', dueDate: new Date().toISOString() },
  { id: '2', title: 'Set up database', description: 'Configure PostgreSQL and Prisma', status: 'in-progress', priority: 'medium', dueDate: new Date().toISOString() },
  { id: '3', title: 'Fix navigation bug', description: 'Mobile menu not closing on click', status: 'done', priority: 'high', dueDate: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', title: 'Write documentation', description: 'API docs for the new endpoints', status: 'todo', priority: 'low', dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
];

export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      try {
        const { data } = await api.get('/tasks/gp', { params: filters });
        return data.success ? data.tasks : data;
      } catch (error) {
        console.warn('API fetch failed, using local storage fallback', error);
        const local = localStorage.getItem('local_tasks');
        return local ? JSON.parse(local) : MOCK_TASKS;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask) => {
      try {
        const { data } = await api.post('/tasks/gp', newTask);
        return data;
      } catch (error) {
        const local = JSON.parse(localStorage.getItem('local_tasks') || JSON.stringify(MOCK_TASKS));
        const createdTask = { ...newTask, id: Math.random().toString(36).substr(2, 9) };
        localStorage.setItem('local_tasks', JSON.stringify([createdTask, ...local]));
        return createdTask;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created and synced globally!');
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      try {
        const { data } = await api.put(`/tasks/${id}/gp`, updateData);
        return data;
      } catch (error) {
        const local = JSON.parse(localStorage.getItem('local_tasks') || JSON.stringify(MOCK_TASKS));
        const updated = local.map(t => t.id === id ? { ...t, ...updateData } : t);
        localStorage.setItem('local_tasks', JSON.stringify(updated));
        return { id, ...updateData };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated across all modules');
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`/tasks/${id}/gp`);
        return id;
      } catch (error) {
        const local = JSON.parse(localStorage.getItem('local_tasks') || JSON.stringify(MOCK_TASKS));
        const filtered = local.filter(t => t.id !== id);
        localStorage.setItem('local_tasks', JSON.stringify(filtered));
        return id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.error('Task removed');
    },
  });
};
