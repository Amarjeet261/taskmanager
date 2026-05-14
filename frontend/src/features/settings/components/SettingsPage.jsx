import React from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import useAuthStore from '@/store/authStore';

const SettingsPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">System <span className="text-gradient">Settings</span></h1>
        <p className="text-muted-foreground font-medium">Configure your workspace and profile preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'language', label: 'Language', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all hover:bg-white/5 text-muted-foreground hover:text-primary group"
            >
              <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-none overflow-hidden">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black">Profile Information</CardTitle>
                <CardDescription className="font-medium">Update your public identity on the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                  <div className="h-20 w-20 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=7B2FF7&color=fff`} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-10 border-white/10 bg-white/5 font-bold">Change Avatar</Button>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">JPG, PNG or GIF. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <Input defaultValue={user?.name} className="h-12 bg-muted/20 border-white/5 rounded-2xl px-4 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                    <Input defaultValue={user?.email} className="h-12 bg-muted/20 border-white/5 rounded-2xl px-4 font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bio / Role Description</Label>
                  <textarea 
                    defaultValue={user?.bio || "Productivity enthusiast & developer."}
                    className="w-full min-h-[100px] p-4 bg-muted/20 border border-white/5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button className="rounded-2xl h-12 px-8 bg-gradient-purple hover:purple-glow font-black uppercase tracking-widest text-xs gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
