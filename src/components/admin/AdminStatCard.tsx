import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: 'accent' | 'blue' | 'amber' | 'neutral';
}

export default function AdminStatCard({ title, value, icon: Icon, trend, color = 'neutral' }: AdminStatCardProps) {
  const colorClasses = {
    accent: 'text-accent bg-accent/10 shadow-accent/5',
    blue: 'text-blue-500 bg-blue-50 shadow-blue-500/5',
    amber: 'text-amber-500 bg-amber-50 shadow-amber-500/5',
    neutral: 'text-slate-600 bg-slate-100 shadow-slate-200/20',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
          
          {trend && (
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trend.isUp ? '+' : '-'}{trend.value}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${colorClasses[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${colorClasses[color].split(' ')[1]}`} />
    </div>
  );
}
