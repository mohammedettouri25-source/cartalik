'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Smartphone, 
  Mail, 
  Phone, 
  Calendar, 
  UserPlus, 
  ChevronDown, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  MoreVertical,
  AlertTriangle,
  Shield,
  Ban,
  Zap,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { markOrderProcessed, deleteOrder, createAccountFromOrder, deactivateProfile, renewSubscriptionAdmin } from './actions';
import ManualUserForm from './ManualUserForm';
import StatCard from '../../components/StatCard';

interface DashboardContentProps {
  orders: any[];
  totalUsers: number;
  expiredProfiles?: any[];
  acquisitionStats?: {
    growthPercent: number;
    chartData: number[];
    chartLabels: string[];
  };
}

export default function DashboardContent({ 
  orders, 
  totalUsers, 
  expiredProfiles = [],
  acquisitionStats = { growthPercent: 0, chartData: [], chartLabels: [] }
}: DashboardContentProps) {
  const { t } = useLocale();

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const processedOrders = orders.filter((o) => o.status === 'processed');

  return (
    <div className="max-w-7xl auto space-y-10 pb-20">
      

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('dashboard.totalCommerce')} 
          value={orders.length} 
          icon={CreditCard} 
          trend={{ value: '12%', isUp: true }}
          color="neutral"
        />
        <StatCard 
          title={t('dashboard.activeMembers')} 
          value={totalUsers} 
          icon={Users} 
          trend={{ value: '8%', isUp: true }}
          color="accent"
        />
        <StatCard 
          title={t('dashboard.queueStatus')} 
          value={pendingOrders.length} 
          icon={Clock} 
          trend={{ value: '3', isUp: false }}
          color="amber"
        />
        <StatCard 
          title={t('dashboard.efficiency')} 
          value={`${orders.length ? Math.round((processedOrders.length / orders.length) * 100) : 0}%`} 
          icon={TrendingUp} 
          color="blue"
        />
      </div>

      {/* Expired Cards Alert */}
      {expiredProfiles.length > 0 && (
        <div className="bg-white border border-red-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-red-100 flex justify-between items-center bg-red-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{t('dashboard.expiredCards')}</h2>
                <p className="text-red-400 font-bold text-[10px] uppercase tracking-widest mt-2">
                  {expiredProfiles.length} {t('dashboard.cardsNeedAttention')}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-red-50 px-6">
            {expiredProfiles.map((profile: any) => {
              const sub = profile.subscriptions?.[0];
              const endDate = sub?.current_period_end ? new Date(sub.current_period_end) : null;
              const daysExpired = endDate ? Math.ceil((Date.now() - endDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

              return (
                <div key={profile.id} className="py-6 px-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-red-50/30 rounded-2xl transition-all my-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                      {profile.name ? profile.name.substring(0, 2).toUpperCase() : '??'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{profile.name || profile.username}</h4>
                      <p className="text-xs text-slate-400">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="px-3 py-1 rounded-lg bg-red-100 text-red-600 text-xs font-bold w-fit">
                        {daysExpired > 0 ? `${t('userDashboard.expired')} ${daysExpired}d` : t('userDashboard.expired')}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">
                        Active: {String(profile.is_active)} | Sub: {sub?.status || 'none'}
                      </span>
                    </div>
                    <AdminActionButtons 
                      profileId={profile.id} 
                      isActive={profile.is_active && sub?.status === 'active'} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Performance Visualization */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{t('dashboard.ecosystemGrowth')}</h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.acquisition30Days')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-sm font-bold ${acquisitionStats.growthPercent >= 0 ? 'text-accent' : 'text-red-400'}`}>
                {acquisitionStats.growthPercent >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {acquisitionStats.growthPercent >= 0 ? '+' : ''}{acquisitionStats.growthPercent}%
              </span>
            </div>
          </div>

          <div className="h-48 relative z-10 flex items-end gap-1 px-2">
            {acquisitionStats.chartData.length > 0 ? (
              acquisitionStats.chartData.map((val, i) => {
                const maxVal = Math.max(...acquisitionStats.chartData, 1);
                const h = (val / maxVal) * 100;
                return (
                  <div key={i} className="flex-1 group/bar relative">
                    <div 
                      className="w-full bg-gradient-to-t from-accent to-accent/40 rounded-t-lg transition-all duration-500 ease-out group-hover/bar:brightness-125"
                      style={{ height: `${Math.max(h, 5)}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                );
              })
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs italic">
                    No data for period
                </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4 px-2">
            {acquisitionStats.chartLabels.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Task Queue - Orders List */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{t('dashboard.operationalQueue')}</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">
              {t('dashboard.pendingFulfillment').replace('{count}', pendingOrders.length.toString())}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
               {t('dashboard.filterHub')}
               <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {orders && orders.length > 0 ? (
          <div className="divide-y divide-slate-100 px-4 md:px-6">
            {orders.map((order) => (
              <div key={order.id} className="py-8 px-4 hover:bg-slate-50 transition-all rounded-[2rem] flex flex-col xl:flex-row xl:items-center justify-between gap-8 group/row my-2 border border-transparent hover:border-slate-100">
                
                {/* Order Identity */}
                <div className="flex items-start gap-6 flex-1">
                  <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform group-hover/row:scale-105 ${order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                    {order.card_type === 'personal' ? <Smartphone className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{order.full_name}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg flex items-center gap-1.5 uppercase tracking-wider ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status === 'pending' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          {order.status}
                        </span>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-slate-100 text-slate-600 uppercase tracking-wider">
                          {order.card_type}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-2 group/meta cursor-pointer hover:text-accent transition-colors">
                        <Mail className="w-4 h-4 text-slate-300" />
                        {order.email}
                      </div>
                      {order.phone && (
                        <div className="flex items-center gap-2 group/meta cursor-pointer hover:text-blue-500 transition-colors">
                          <Phone className="w-4 h-4 text-slate-300" />
                          {order.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tactical Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 min-w-[340px]">
                  {order.status === 'pending' && (
                    <>
                      <details className="group/details w-full relative">
                        <summary className="flex items-center justify-between w-full px-6 py-3.5 bg-accent text-white rounded-2xl cursor-pointer font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all list-none shadow-xl shadow-accent/20">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            {t('dashboard.provisionAccount')}
                          </div>
                          <ChevronDown className="w-4 h-4 transition-transform group-open/details:rotate-180" />
                        </summary>
                        
                        <div className="absolute top-full left-0 right-0 mt-2 p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl z-30 animate-in fade-in slide-in-from-top-2 duration-300">
                          <form action={createAccountFromOrder} className="space-y-5">
                            <input type="hidden" name="order_id" value={order.id} />
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{t('dashboard.provisioningIdentity')}</label>
                              <input
                                type="email"
                                name="email"
                                defaultValue={order.email}
                                required
                                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{t('dashboard.deploymentSecret')}</label>
                              <input
                                type="text"
                                name="password"
                                defaultValue="Cartalik2026!"
                                required
                                minLength={6}
                                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none font-bold"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-accent" />
                              {t('dashboard.executeFulfillment')}
                            </button>
                          </form>
                        </div>
                      </details>
                      
                      <form action={markOrderProcessed.bind(null, order.id)} className="w-full">
                        <button
                          type="submit"
                          className="w-full px-6 py-3.5 bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all whitespace-nowrap border-b-2 active:border-b-0 active:translate-y-[2px]"
                        >
                          {t('dashboard.softFulfill')}
                        </button>
                      </form>
                    </>
                  )}

                  <div className="flex gap-2 ml-auto shrink-0">
                    <form action={deleteOrder.bind(null, order.id)}>
                      <button
                        type="submit"
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title={t('dashboard.purgeOrder')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                     <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Activity className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard.emptyQueue')}</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">{t('dashboard.emptyQueueDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminActionButtons({ profileId, isActive }: { profileId: string, isActive: boolean }) {
  const { t } = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDeactivate = () => {
    startTransition(async () => {
      try {
        await deactivateProfile(profileId);
        router.refresh();
      } catch (error) {
        console.error('Failed to deactivate profile:', error);
        alert('Failed to deactivate profile. Check console for details.');
      }
    });
  };

  const handleRenew = () => {
    startTransition(async () => {
      try {
        const result = await renewSubscriptionAdmin(profileId);
        if (result && !result.success) {
          alert('Failed to renew: ' + result.error);
        } else {
          alert('✅ Card Renewed! Status updated to Active.');
          router.refresh();
        }
      } catch (error: any) {
        console.error('Failed to renew profile:', error);
        alert('Failed to renew profile: ' + error.message);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {isActive ? (
        <button
          onClick={handleDeactivate}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
        >
          <Ban className="w-3.5 h-3.5" />
          {isPending ? '...' : t('dashboard.deactivate')}
        </button>
      ) : (
        <button
          onClick={handleRenew}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 border-2 border-white"
        >
          <Zap className="w-4 h-4 fill-current" />
          {isPending ? '...' : 'RENOUVELER'}
        </button>
      )}
    </div>
  );
}


