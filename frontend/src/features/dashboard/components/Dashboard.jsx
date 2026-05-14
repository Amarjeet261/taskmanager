import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, ListTodo, TrendingUp, Sparkles, ArrowUpRight, Users } from 'lucide-react';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useTeam } from '@/features/team/hooks/useTeam';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';

const mockChartData = [
  { name: 'Mon', completed: 4, added: 6 },
  { name: 'Tue', completed: 7, added: 3 },
  { name: 'Wed', completed: 5, added: 5 },
  { name: 'Thu', completed: 10, added: 2 },
  { name: 'Fri', completed: 8, added: 4 },
  { name: 'Sat', completed: 2, added: 1 },
  { name: 'Sun', completed: 3, added: 2 },
];

const StatCard = ({ title, value, icon: Icon, description, delay, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -5 }}
  >
    <Card className="glass-card overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-12 w-12 text-primary" />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {trend && (
            <div className="flex items-center text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-0.5" />
              {trend}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2 font-medium">{description}</p>
      </CardContent>
      <div className="h-1 w-full bg-gradient-purple opacity-30" />
    </Card>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-5 w-72 rounded-lg" />
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[140px] rounded-3xl" />)}
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      <Skeleton className="col-span-4 h-[420px] rounded-3xl" />
      <Skeleton className="col-span-3 h-[420px] rounded-3xl" />
    </div>
  </div>
);


const Dashboard = () => {
  const { user } = useAuthStore();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: team, isLoading: teamLoading } = useTeam();

  if (tasksLoading || teamLoading) return <DashboardSkeleton />;

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'done').length || 0;
  const inProgressTasks = tasks?.filter(t => t.status === 'in-progress').length || 0;
  const teamCount = team?.length || 0;

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-primary mb-3"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Welcome Back, {user?.name?.split(' ')[0]}</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Focus <span className="text-gradient">Forward</span>.
          </h1>
          <p className="text-muted-foreground mt-4 text-xl font-medium leading-relaxed">
            You currently have <span className="text-primary font-black underline underline-offset-4 decoration-primary/30">{inProgressTasks}</span> active tasks in your workspace.
          </p>
        </div>
        <div className="flex gap-4 w-full xl:w-auto">
          <Button className="flex-1 xl:flex-none h-14 rounded-[1.5rem] bg-gradient-purple hover:purple-glow shadow-2xl shadow-purple-500/30 px-10 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95">
            Quick Action
          </Button>
          <Button variant="outline" className="flex-1 xl:flex-none h-14 rounded-[1.5rem] border-white/10 bg-white/5 backdrop-blur-md px-8 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white/10">
             Open Portal
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Total Backlog" value={totalTasks} icon={ListTodo} description="Across ecosystem" trend="+12%" delay={0.1} />
        <StatCard title="Resolved" value={completedTasks} icon={CheckCircle2} description="Velocity up" trend="+5%" delay={0.2} />
        <StatCard title="Active Now" value={inProgressTasks} icon={Clock} description="In progress" trend="-2%" delay={0.3} />
        <StatCard title="Collaborators" value={teamCount} icon={Users} description="Active members" trend="+1" delay={0.4} />
        <StatCard title="Efficiency" value="92%" icon={TrendingUp} description="Productivity score" trend="+4%" delay={0.5} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4 glass-card border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Weekly Performance
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full ml-auto">Live</span>
            </CardTitle>
            <CardDescription className="font-medium">Completion velocity vs task intake.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2FF7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B2FF7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9D4EDD" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9D4EDD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(13, 13, 13, 0.8)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(8px)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#7B2FF7" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="added" 
                  stroke="#9D4EDD" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorAdded)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 glass-card border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            <CardDescription className="font-medium">Stay updated with your latest changes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tasks?.slice(0, 4).map((task, idx) => (
                <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                    task.status === 'done' ? "bg-green-500/10 text-green-500" : "bg-purple-500/10 text-purple-500"
                  )}>
                    {task.status === 'done' ? <CheckCircle2 className="h-6 w-6" /> : <ListTodo className="h-6 w-6" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">{task.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      task.priority === 'high' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {task.priority}
                    </div>
                  </div>
                </motion.div>
              ))}
              {(!tasks || tasks.length === 0) && (
                <div className="h-full flex flex-col items-center justify-center py-10 opacity-50">
                  <Sparkles className="h-12 w-12 mb-4" />
                  <p className="font-bold">No activity yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 border-t border-white/5">
            <Button variant="ghost" className="w-full rounded-xl font-bold text-xs hover:bg-white/5 uppercase tracking-widest">
              View All Activity
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
