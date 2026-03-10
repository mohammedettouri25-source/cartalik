'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteUserAdmin, updateProfileAdmin, renewSubscriptionAdmin } from '../actions';
import { 
  Trash2, 
  User, 
  Search, 
  ExternalLink, 
  Shield, 
  Activity, 
  UserPlus, 
  Edit3,
  ChevronDown,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import ManualUserForm from '../ManualUserForm';
import EditUserModal from './EditUserModal';
import { useLocale } from '@/context/LocaleContext';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  photo_url: string;
  is_active: boolean;
  card_type: string;
}

export default function UsersClientTable({ initialProfiles }: { initialProfiles: UserProfile[] }) {
  const { t } = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState(initialProfiles);
  const [filter, setFilter] = useState('All Members');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filters = [
    { id: 'All Members', label: t('registry.allMembers') },
    { id: 'Active', label: t('registry.active') },
    { id: 'Disabled', label: t('registry.disabled') },
    { id: 'Business', label: t('registry.business') },
    { id: 'Personal', label: t('registry.personal') },
  ];

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'Active') return matchesSearch && p.is_active;
    if (filter === 'Disabled') return matchesSearch && !p.is_active;
    if (filter === 'Business') return matchesSearch && p.card_type === 'business';
    if (filter === 'Personal') return matchesSearch && p.card_type === 'personal';
    return matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative group w-full lg:w-96">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder={t('registry.search')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-11 pe-4 py-4 rounded-3xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-sm font-bold shadow-sm placeholder:text-slate-300" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {filters.map((f) => (
            <button 
              key={f.id} 
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                filter === f.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="w-px h-8 bg-slate-200 mx-2 hidden lg:block" />
          <button 
             onClick={() => setIsAdding(!isAdding)}
             className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
               isAdding 
                 ? 'bg-red-50 text-red-600 border border-red-100' 
                 : 'bg-accent text-white shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-95'
             }`}
          >
            {isAdding ? t('registry.closeProtocol') : t('registry.deployIdentity')}
            {isAdding ? <ChevronDown className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Deployment Module (ManualUserForm) */}
      {isAdding && (
        <div className="animate-fade-in animate-slide-up">
           <ManualUserForm />
        </div>
      )}

      {/* Registry Table */}
      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('registry.operationalIdentity')}</th>
                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('registry.tierProtocol')}</th>
                <th className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('registry.liveStatus')}</th>
                <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-end">{t('registry.nodeControl')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProfiles.map((profile: UserProfile) => (
                <tr key={profile.id} className="hover:bg-slate-50/80 transition-all group/user">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        {profile.photo_url ? (
                          <img src={profile.photo_url} alt={profile.name || "User"} className="w-16 h-16 rounded-[1.5rem] object-cover ring-4 ring-white shadow-xl group-hover/user:scale-105 transition-transform" />
                        ) : (
                          <div className="w-16 h-16 rounded-[1.5rem] gradient-accent flex items-center justify-center text-white font-black text-xl shadow-lg group-hover/user:rotate-3 transition-transform">
                            {profile.name?.substring(0, 1) || profile.email?.substring(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div className={`absolute -bottom-1 -end-1 w-5 h-5 rounded-full border-4 border-white shadow-lg ${profile.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1 group-hover/user:text-accent transition-colors uppercase italic">{profile.name || t('registry.anonNode')}</p>
                        <p className="text-xs font-bold text-slate-400 truncate tracking-widest uppercase">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider w-fit ${
                        profile.card_type === 'business' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {profile.card_type === 'business' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {profile.card_type === 'business' ? t('registry.business') : t('registry.personal')}
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] pl-1 uppercase opacity-30">{t('registry.v1Protocol')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-medium">
                    <StatusToggleButton profile={profile} />
                  </td>
                  <td className="px-10 py-6 text-end">
                    <div className="flex items-center justify-end gap-3">
                       <Link 
                        href={`/card/${profile.username}`}
                        target="_blank"
                        className="p-3.5 bg-slate-50 text-slate-400 hover:text-accent hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100 group/link"
                        title={t('registry.viewNode')}
                      >
                        <ExternalLink className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                      </Link>
                      
                       <button 
                         onClick={() => setEditingUser(profile)}
                         className="p-3.5 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-blue-100 group/edit"
                         title={t('registry.modifyIdentity')}
                       >
                        <Edit3 className="w-5 h-5 group-hover/edit:scale-110 transition-transform" />
                      </button>

                      <form action={deleteUserAdmin.bind(null, profile.id)} onSubmit={(e) => {
                        if(!confirm(t('dashboard.purgeConfirm'))) e.preventDefault();
                      }}>
                        <button 
                          className="p-3.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-red-100 group/purge"
                          title={t('registry.purgeNode')}
                        >
                          <Trash2 className="w-5 h-5 group-hover/purge:scale-110 transition-transform" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProfiles.length === 0 && (
          <div className="py-24 text-center space-y-6">
             <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mx-auto text-slate-100">
                <Activity className="w-12 h-12" />
              </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('registry.zeroHits')}</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">{t('registry.zeroHitsDesc')}</p>
          </div>
        )}
      </div>

      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
        />
      )}
    </div>
  );
}

function StatusToggleButton({ profile }: { profile: any }) {
  const { t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const sub = profile.subscriptions?.[0];
  const isSubActive = sub?.status === 'active';

  const handleToggleLock = () => {
    startTransition(async () => {
      try {
        await updateProfileAdmin(profile.id, { is_active: !profile.is_active });
        alert(profile.is_active ? '🔒 Member Locked' : '✅ Member Activated');
        router.refresh();
      } catch (error: any) {
        console.error('Failed to toggle status:', error);
        alert('Error: ' + error.message);
      }
    });
  };

  const handleRenew = () => {
    startTransition(async () => {
      try {
        const result = await renewSubscriptionAdmin(profile.id);
        if (result && !result.success) {
          alert('Failed to renew: ' + result.error);
        } else {
          alert('✅ Subscription Renewed!');
          router.refresh();
        }
      } catch (error: any) {
        console.error('Failed to renew:', error);
        alert('Error: ' + error.message);
      }
    });
  };

  // If subscription is NOT active, show RENEW button
  if (!isSubActive) {
    return (
      <button 
        onClick={handleRenew}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 border-2 border-white"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
        {isPending ? '...' : 'RENOUVELER'}
      </button>
    );
  }

  // If subscription IS active, show the standard Manual Lock/Unlock toggle
  return (
    <button 
      onClick={handleToggleLock}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
        profile.is_active 
          ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
          : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
      } disabled:opacity-50`}
    >
      <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-green-500 animate-pulse' : 'bg-red-500'} ${isPending ? 'opacity-30' : ''}`} />
      {isPending ? '...' : (profile.is_active ? t('registry.active') : t('registry.locked'))}
    </button>
  );
}
