'use client';

import { useState } from 'react';
import { X, Shield, Loader2, Save } from 'lucide-react';
import { updateProfileAdmin } from '../actions';
import { useLocale } from '@/context/LocaleContext';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  card_type: string;
}

interface EditUserModalProps {
  user: UserProfile;
  onClose: () => void;
}

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const { t } = useLocale();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const updates = {
        name: formData.get('name'),
        username: formData.get('username'),
        card_type: formData.get('card_type'),
      };
      await updateProfileAdmin(user.id, updates);
      onClose();
    } catch (error: any) {
      alert(error?.message || t('editUserModal.failedToUpdate'));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-zoom-in">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-accent">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{t('editUserModal.title')}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('editUserModal.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editUserModal.nameLabel')}</label>
              <input 
                name="name" 
                defaultValue={user.name} 
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editUserModal.usernameLabel')}</label>
              <input 
                name="username" 
                defaultValue={user.username} 
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('editUserModal.hardwareTier')}</label>
              <select 
                name="card_type" 
                defaultValue={user.card_type}
                className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none appearance-none"
              >
                <option value="personal">{t('registry.personal').toUpperCase()} NEURAL LINK</option>
                <option value="business">{t('registry.business').toUpperCase()} ENTERPRISE HUB</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-accent" />}
            {t('editUserModal.commitChanges')}
          </button>
        </form>
      </div>
    </div>
  );
}
