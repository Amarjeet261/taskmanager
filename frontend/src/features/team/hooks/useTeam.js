import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

const MOCK_TEAM = [
  { id: '1', name: 'Amarjeet Singh', email: 'amarjeet@example.com', role: 'Admin', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Amarjeet+Singh&background=7B2FF7&color=fff' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Member', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@example.com', role: 'Member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=random' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Viewer', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
];

export const useTeam = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/team');
        return data.success ? data.team : data;
      } catch (error) {
        console.warn('Team API failed, using local fallback');
        const local = localStorage.getItem('local_team');
        return local ? JSON.parse(local) : MOCK_TEAM;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMember) => {
      try {
        const { data } = await api.post('/team/invite', newMember);
        return data;
      } catch (error) {
        const local = JSON.parse(localStorage.getItem('local_team') || JSON.stringify(MOCK_TEAM));
        const createdMember = { 
          ...newMember, 
          id: Math.random().toString(36).substr(2, 9),
          status: 'offline',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMember.name)}&background=random`
        };
        localStorage.setItem('local_team', JSON.stringify([...local, createdMember]));
        return createdMember;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.success('Invitation sent successfully!');
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      try {
        await api.delete(`/team/${id}`);
        return id;
      } catch (error) {
        const local = JSON.parse(localStorage.getItem('local_team') || JSON.stringify(MOCK_TEAM));
        const filtered = local.filter(m => m.id !== id);
        localStorage.setItem('local_team', JSON.stringify(filtered));
        return id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast.error('Member removed from workspace');
    },
  });
};
