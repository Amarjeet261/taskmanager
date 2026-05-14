import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MoreHorizontal, Mail, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useDeleteMember } from '../hooks/useTeam';
import { motion } from 'framer-motion';

const MemberCard = ({ member }) => {
  const deleteMutation = useDeleteMember();
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="p-6 h-full flex flex-col glass-card border-none hover:bg-white/[0.03] transition-all group rounded-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl group-hover:scale-105 transition-transform">
              <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
            </div>
            <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0D0D0D] ${member.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-500/10 hover:text-red-500" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="font-black text-xl tracking-tight leading-none">{member.name}</h4>
          <div className="flex items-center text-xs font-medium text-muted-foreground gap-2">
            <Mail className="h-3 w-3 text-primary" />
            <span className="truncate">{member.email}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/5">
          <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'} className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">
            {member.role}
          </Badge>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Active Now</span>
        </div>
      </Card>
    </motion.div>
  );
};

export default MemberCard;
