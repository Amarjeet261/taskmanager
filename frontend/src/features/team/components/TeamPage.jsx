import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UserPlus, Settings, Users, Sparkles, ShieldCheck, Mail } from 'lucide-react';
import MemberCard from './MemberCard';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { useTeam } from '../hooks/useTeam';
import { Skeleton } from '@/components/ui/Skeleton';

const TeamPageSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <Skeleton className="h-12 w-64 rounded-xl" />
      <Skeleton className="h-12 w-48 rounded-xl" />
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-[2rem]" />)}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-[2rem] glass-card border-none flex flex-col items-center justify-center text-center group transition-all hover:bg-white/[0.05]"
  >
    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
      <Icon className="h-7 w-7" />
    </div>
    <h3 className="text-3xl font-black tracking-tight">{value}</h3>
    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">{title}</p>
  </motion.div>
);

const TeamPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: team, isLoading } = useTeam();

  if (isLoading) return <TeamPageSkeleton />;

  const filteredTeam = team?.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-10 flex flex-col h-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-primary mb-2"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Workspace Synergy</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Our <span className="text-gradient">Team</span>.
          </h1>
          <p className="text-muted-foreground mt-3 text-lg font-medium">Coordinate with your collaborators effortlessly.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/10 bg-muted/20 font-bold hover:bg-primary/10 transition-all gap-2">
            <Settings className="h-4 w-4" />
            Workspace Settings
          </Button>
          <Button className="h-12 px-6 rounded-2xl bg-gradient-purple hover:purple-glow shadow-lg shadow-purple-500/20 font-bold gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Member
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Active Members" value={team?.length || 0} icon={Users} color="bg-primary/10 text-primary" delay={0.1} />
        <StatCard title="Online Status" value={team?.filter(m => m.status === 'online').length || 0} icon={Sparkles} color="bg-green-500/10 text-green-500" delay={0.2} />
        <StatCard title="Pending Invites" value="1" icon={Mail} color="bg-blue-500/10 text-blue-500" delay={0.3} />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card/30 backdrop-blur-md p-2 rounded-2xl border border-white/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search members by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-primary/50 transition-all font-medium" 
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto pr-2">
            <select className="h-11 rounded-xl border-white/5 bg-muted/30 px-4 text-sm font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/50 outline-none">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
          {filteredTeam.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-50">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <p className="text-xl font-bold">No members found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
