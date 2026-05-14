import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Camera, 
  Trash2, 
  LogOut, 
  Shield, 
  Bell, 
  Palette,
  Check,
  Loader2,
  FileText,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user, isOpen]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile(formData);
      setLoading(false);
      toast.success('Profile updated instantly!');
    }, 800);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result });
        toast.success('Avatar updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    toast.error('Account deleted.');
    logout();
    setShowDeleteConfirm(false);
    onClose();
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-card border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl glass-card flex flex-col md:flex-row h-[600px]"
      >
        {/* Sidebar Tabs */}
        <div className="w-full md:w-56 border-r border-white/5 bg-white/[0.02] p-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-8 px-2 text-primary">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-black tracking-tight">Settings</h2>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
          <div className="mt-auto pt-6 border-t border-white/5">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-transparent to-primary/5">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-3xl font-black tracking-tight capitalize mb-1">{activeTab}</h3>
              <p className="text-sm text-muted-foreground font-medium">Customize your digital workspace experience.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-white/5">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-purple p-[3px] purple-glow transition-transform group-hover:scale-105">
                      <div className="h-full w-full rounded-[2.3rem] bg-background flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-primary" />
                        )}
                      </div>
                    </div>
                    <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-all cursor-pointer border-4 border-background hover:purple-glow">
                      <Camera className="h-5 w-5" />
                      <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div className="text-center">
                    <h4 className="font-black text-2xl tracking-tight">{user?.name}</h4>
                    <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">{user?.role || 'User'}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] ml-1">Display Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/50 font-medium" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                        <Input 
                          id="email" 
                          type="email"
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/50 font-medium" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-xs font-black uppercase tracking-[0.2em] ml-1">Personal Bio</Label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 h-4 w-4 text-primary/50" />
                      <textarea 
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="w-full min-h-[100px] pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-1 focus:ring-primary/50 outline-none font-medium text-sm transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="rounded-2xl h-12 px-6 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                    <Button type="submit" className="rounded-2xl h-12 px-10 bg-gradient-purple hover:purple-glow shadow-xl shadow-purple-500/20 font-black uppercase tracking-widest text-[10px]" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sync Profile'}
                    </Button>
                  </div>
                </form>

                <div className="pt-8 border-t border-white/5">
                  <div className="bg-red-500/5 rounded-3xl p-6 border border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <h5 className="text-sm font-black text-red-500 uppercase tracking-widest mb-1">Danger Zone</h5>
                      <p className="text-xs text-muted-foreground font-medium">Permanently delete your account and all data.</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border-none h-11 px-6 font-black uppercase tracking-widest text-[10px]"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-card border border-red-500/20 p-10 rounded-[3rem] shadow-2xl text-center"
            >
              <div className="h-20 w-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner shadow-red-500/20">
                <Trash2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Final Confirmation</h3>
              <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed">
                You are about to delete your entire workspace history. This action is <span className="text-red-500 font-bold">permanent</span> and cannot be reversed.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]">
                  Go Back
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount} className="flex-1 rounded-2xl h-12 bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">
                  Confirm Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileModal;
