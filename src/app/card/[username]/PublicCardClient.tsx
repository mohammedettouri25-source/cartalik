"use client";

  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Star,
  Download,
  ExternalLink,
  Smartphone,
  CheckCircle,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import LeadCaptureForm from "./LeadCaptureForm";

interface PublicCardClientProps {
  profile: any;
  links: any[];
  products?: any[];
}

export default function PublicCardClient({ profile, links, products = [] }: PublicCardClientProps) {
  const { t } = useLocale();
  const isBusiness = profile.card_type === "business";
  const initials = profile.name ? profile.name.substring(0, 2).toUpperCase() : "US";
  const fontColor = profile.font_color || '#ffffff';
  const bgColor = profile.bg_color || '#000000';

  const vcardData = `BEGIN:VCARD
VERSION:3.0
N:;${profile.name};;;
FN:${profile.name}
ORG:${profile.company || ''}
TITLE:${profile.title || ''}
TEL;type=CELL:${profile.phone || ''}
EMAIL:${profile.email || ''}
NOTE:${profile.bio || ''}
END:VCARD`;

  const vcardUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`;

  if (!profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <Smartphone className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('publicCard.inactive')}</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed font-medium">
            {t('publicCard.inactiveDesc')}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-2xl shadow-emerald-500/20 hover:scale-[1.05] transition-transform"
          >
            {t('publicCard.renewBtn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-start justify-center py-16 px-4 pt-24 lg:pt-32 relative overflow-hidden font-sans transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      {/* Apple-style Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-blue-600/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
      </div>

      <div className="w-full max-w-[430px] relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Apple Glass Container */}
        <div className="rounded-[4rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.8)] border border-white/20 overflow-hidden relative backdrop-blur-[60px] bg-white/[0.08]">
          <div className="px-9 pt-14 pb-14">
            
            {/* Avatar Signature */}
            <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative z-10 p-1 rounded-full bg-gradient-to-tr from-emerald-400/40 via-white/20 to-transparent">
                    {profile.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="w-36 h-36 rounded-full object-cover border-4 border-black/40" />
                    ) : (
                      <div className="w-36 h-36 rounded-full bg-white/10 flex items-center justify-center text-5xl font-light tracking-tighter" style={{ color: fontColor }}>
                        {initials}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold tracking-tight leading-tight" style={{ color: fontColor }}>
                  {profile.name}
                </h1>
                {isBusiness && <CheckCircle className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />}
              </div>
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-[0.3em] leading-none">
                {profile.title}
              </p>
              {profile.company && (
                <div className="flex items-center justify-center gap-2 pt-1">
                   <div className="w-1 h-3 rounded-full bg-white/20" />
                   <p className="text-xs font-semibold tracking-[0.1em] uppercase opacity-70" style={{ color: fontColor }}>
                     {profile.company}
                   </p>
                </div>
              )}
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="mt-12 px-2">
                  <p className="text-center font-medium leading-[1.8] text-sm tracking-wide text-balance opacity-80" style={{ color: fontColor }}>
                    {profile.bio}
                  </p>
              </div>
            )}

            {/* Command Center Action Grid */}
            <div className="grid grid-cols-3 gap-5 mt-14">
              {[
                { icon: MessageCircle, label: 'WhatsApp', href: profile.whatsapp ? `https://wa.me/${profile.whatsapp}` : null },
                { icon: Phone, label: t('userDashboard.phone'), href: profile.phone ? `tel:${profile.phone}` : null },
                { icon: Mail, label: t('userDashboard.email'), href: profile.email ? `mailto:${profile.email}` : null },
              ].filter(a => a.href).map((action) => (
                <a
                  key={action.label}
                  href={action.href!}
                  className="flex flex-col items-center gap-4 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
                >
                  <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" style={{ color: fontColor }} />
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors opacity-50 group-hover:opacity-100" style={{ color: fontColor }}>
                    {action.label}
                  </span>
                </a>
              ))}
              
              {!isBusiness && profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 py-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 group"
                >
                  <Download className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {t('publicCard.downloadCV')}
                  </span>
                </a>
              )}
            </div>

            {/* Business Features */}
            {isBusiness && (profile.location_url || profile.google_reviews_url) && (
              <div className="mt-5 grid grid-cols-2 gap-5">
                 {profile.location_url && (
                    <a href={profile.location_url} className="flex items-center justify-center gap-3 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group">
                       <MapPin className="w-5 h-5 text-emerald-400" />
                       <span className="text-[11px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100" style={{ color: fontColor }}>{t('publicCard.location')}</span>
                    </a>
                 )}
                 {profile.google_reviews_url && (
                    <a href={profile.google_reviews_url} className="flex items-center justify-center gap-3 py-6 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500 group">
                       <Star className="w-5 h-5 text-indigo-400 fill-indigo-400/10" />
                       <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">{t('publicCard.reviews')}</span>
                    </a>
                 )}
              </div>
            )}

            {/* Connectivity Nodes (Links) */}
            {links && links.length > 0 && (
              <div className="mt-14 space-y-4">
                <div className="flex items-center gap-4 mb-4 px-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-50" style={{ color: fontColor }}>{t('publicCard.connectivityHub')}</span>
                   <div className="flex-1 h-[1px] bg-white/10" />
                </div>
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 px-6 py-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-emerald-400/20 transition-all duration-700 group relative"
                  >
                    <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-700 border border-white/5">
                      <Globe className="w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:text-inherit transition-all" style={{ color: fontColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold tracking-tight" style={{ color: fontColor }}>
                        {link.platform}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: fontColor }}>{t('publicCard.externalNode')}</p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                        <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-emerald-400 transition-all" style={{ color: fontColor }} />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Showcase Section */}
            {isBusiness && (products.length > 0 || profile.catalogue_url) && (
              <div className="mt-16 space-y-6">
                <div className="flex items-center justify-between mb-8 px-2">
                   <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-50" style={{ color: fontColor }}>{t('publicCard.businessShowcase')}</span>
                   </div>
                   {profile.catalogue_url && (
                     <a 
                       href={profile.catalogue_url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/[0.15] transition-all"
                     >
                       <Download className="w-4 h-4" />
                       {t('publicCard.viewCatalogue')}
                     </a>
                   )}
                </div>
                
                <div className="grid grid-cols-1 gap-5">
                  {products.map((product) => (
                    <div key={product.id} className="p-6 rounded-[3rem] bg-white/[0.02] border border-white/5 flex gap-6 hover:bg-white/[0.05] transition-all duration-700 group/prod">
                       <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden group-hover/prod:scale-[1.02] transition-transform duration-700">
                         {product.image_url ? (
                           <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <Package className="w-10 h-10 text-slate-600 opacity-20" />
                         )}
                       </div>
                       <div className="flex-1 min-w-0 py-2">
                         <div className="flex items-start justify-between">
                           <p className="text-base font-bold tracking-tight leading-none" style={{ color: fontColor }}>{product.name}</p>
                           {product.external_link && (
                             <a href={product.external_link} target="_blank" rel="noopener noreferrer">
                               <ExternalLink className="w-4 h-4 opacity-20 hover:text-emerald-400 transition-colors" style={{ color: fontColor }} />
                             </a>
                           )}
                         </div>
                         <p className="text-xs font-black text-emerald-400 tracking-wider mt-1.5 uppercase opacity-80">{product.price || t('userDashboard.priceOnRequest')}</p>
                         <p className="text-xs line-clamp-2 mt-3 leading-relaxed font-medium opacity-50" style={{ color: fontColor }}>{product.description}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apple Card Capture Form */}
            <div className="mt-14 p-0.5 rounded-[3.5rem] bg-gradient-to-tr from-white/10 via-transparent to-white/5">
                <div className="bg-black/20 rounded-[3.3rem] overflow-hidden">
                    <LeadCaptureForm userId={profile.id} />
                </div>
            </div>

            {/* Primary Action Sheet */}
            <a 
              href={vcardUrl} 
              download={`${profile.name}.vcf`}
              className="mt-16 w-full flex items-center justify-center gap-5 py-7 rounded-[3rem] bg-emerald-500 text-white font-black uppercase tracking-[0.4em] text-xs shadow-[0_25px_50px_-12px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-700 relative overflow-hidden group/save"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/save:translate-x-[150%] transition-transform duration-[1.2s] ease-in-out" />
               <Download className="w-6 h-6" />
               {t('publicCard.completeConnect')}
            </a>
          </div>
        </div>

        {/* Global Footer */}
        <div className="text-center mt-14 mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.6em] transition-all hover:text-white"
            style={{ color: fontColor }}
          >
            <span className="w-10 h-[1px] bg-white/10" />
            CARTALIK <span className="text-emerald-400 opacity-60 font-medium tracking-[0.2em]">{t('publicCard.poweredBy')}</span>
            <span className="w-10 h-[1px] bg-white/10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
