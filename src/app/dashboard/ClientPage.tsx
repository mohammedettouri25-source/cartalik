"use client";

import { useState, useEffect } from "react";
import {
  User,
  Link2,
  BarChart3,
  QrCode,
  CreditCard,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wand2,
  Lightbulb,
  ChevronRight,
  Eye,
  Smartphone,
  Globe,
  Calendar,
  X,
  TrendingUp,
  Loader2,
  Palette,
  GripVertical,
  Zap,
  Users,
  ShoppingBag,
  Phone,
  Mail,
  MessageSquare,
  Package,
  PlusCircle,
  Pencil
} from "lucide-react";

import { useRef } from "react";
import { 
  updateProfile, 
  addLink, 
  deleteLink, 
  uploadPhoto,
  reorderLinks,
  deleteLead,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadPDF
} from "./actions";
import StatCard from "@/components/StatCard";
import { useLocale } from "@/context/LocaleContext";
import ImageCropper from "@/components/dashboard/ImageCropper";

/* ─── Section Wrapper ─── */
function Section({
  id,
  title,
  desc,
  children,
  icon: Icon,
  badge,
}: {
  id?: string;
  title: string;
  desc: string;
  children: React.ReactNode;
  icon?: any;
  badge?: string;
}) {
  return (
    <div id={id} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
       <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />
       
      <div className="relative z-10 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
             <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">{badge || "Module"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-sm font-medium">{desc}</p>
        </div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* ─── Profile Section ─── */
function ProfileSection({ profile }: { profile: any }) {
  const { t } = useLocale();
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCvUploading, setIsCvUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  
  // Cropper State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await updateProfile(formData);
      alert(t('userDashboard.successUpdate'));
    } catch (error) {
      alert(t('userDashboard.failedUpdate'));
    } finally {
      setIsPending(false);
    }
  }

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);
    setIsUploading(true);
    
    const file = new File([croppedBlob], "profile_photo.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadPhoto(formData);
    } catch (error: any) {
      alert(error.message || t('userDashboard.failedPhoto'));
    } finally {
      setIsUploading(false);
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('userDashboard.fileTooLarge') || "File is too large (max 5MB).");
      return;
    }

    setIsCvUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadPDF(formData, "cv_url");
      alert(t('userDashboard.uploadSuccess') || "CV uploaded successfully!");
    } catch (error: any) {
      alert(error.message || t('userDashboard.uploadError') || "Error uploading CV.");
    } finally {
      setIsCvUploading(false);
      if (cvInputRef.current) cvInputRef.current.value = "";
    }
  }

  const initials = profile?.name ? profile.name.substring(0, 2).toUpperCase() : "US";

  return (
    <Section 
      id="profile" 
      title={t('userDashboard.identityControl')} 
      desc={t('userDashboard.identityDesc')}
      icon={User}
      badge={t('registry.personal')}
    >
      <form action={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-lg group-hover:border-accent transition-all relative">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-accent flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              title={t('userDashboard.updateImage')}
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onPhotoChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-bold text-slate-900 hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              {isUploading ? t('userDashboard.uploading') : t('userDashboard.updateImage')}
            </button>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">{t('userDashboard.opticsModule')}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { id: "name", label: t('userDashboard.fullName'), value: profile?.name || "", type: "text" },
            { id: "title", label: t('userDashboard.jobTitle'), value: profile?.title || "", type: "text" },
            { id: "company", label: t('userDashboard.company'), value: profile?.company || "", type: "text" },
            { id: "email", label: t('userDashboard.email'), value: profile?.email || "", type: "email" },
            { id: "phone", label: t('userDashboard.phone'), value: profile?.phone || "", type: "tel" },
            { id: "whatsapp", label: t('userDashboard.whatsapp'), value: profile?.whatsapp || "", type: "tel" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-primary mb-1.5">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                defaultValue={field.value}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          ))}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1.5">
            {t('userDashboard.bio')}
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile?.bio || ""}
            className="w-full px-4 py-2.5 rounded-xl bg-neutral border border-border text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button disabled={isPending} type="submit" className="px-6 py-2.5 rounded-xl gradient-accent text-white text-sm font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50">
            {isPending ? t('userDashboard.saving') : t('userDashboard.saveChanges')}
          </button>
          
          {profile?.card_type !== 'business' && (
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={cvInputRef} 
                onChange={handleCvUpload} 
                accept=".pdf" 
                className="hidden" 
              />
              <button 
                type="button"
                disabled={isCvUploading}
                onClick={() => cvInputRef.current?.click()}
                className={`px-6 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 text-sm font-bold ${
                  profile?.cv_url 
                  ? 'border-green-100 bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isCvUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {profile?.cv_url ? t('userDashboard.cvManaged') : t('userDashboard.uploadCV')}
              </button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('userDashboard.pdfMetadata')}</p>
            </div>
          )}
        </div>
      </form>

      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          t={{
            cropImage: t('userDashboard.cropImage'),
            positionScale: t('userDashboard.positionScale'),
            cancel: t('userDashboard.cancel'),
            saveImage: t('userDashboard.saveImage')
          }}
        />
      )}
    </Section>
  );
}

/* ─── Links Section ─── */
function LinksSection({ links }: { links: any[] }) {
  const { t } = useLocale();
  const [isAdding, setIsAdding] = useState(false);
  const [orderedLinks, setOrderedLinks] = useState(links || []);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Keep in sync if links change from server
  useEffect(() => {
    setOrderedLinks(links || []);
  }, [links]);

  async function handleAdd(formData: FormData) {
    await addLink(formData);
    setIsAdding(false);
  }

  function handleDragStart(idx: number) {
    setDraggedIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIdx(idx);
  }

  function handleDragLeave() {
    setDragOverIdx(null);
  }

  async function handleDrop(idx: number) {
    if (draggedIdx === null || draggedIdx === idx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const newLinks = [...orderedLinks];
    const [moved] = newLinks.splice(draggedIdx, 1);
    newLinks.splice(idx, 0, moved);
    setOrderedLinks(newLinks);
    setDraggedIdx(null);
    setDragOverIdx(null);

    // Persist new order
    const ids = newLinks.map(l => l.id);
    try {
      await reorderLinks(ids);
    } catch (err) {
      console.error('Failed to reorder links:', err);
    }
  }

  function handleDragEnd() {
    setDraggedIdx(null);
    setDragOverIdx(null);
  }

  return (
    <Section
      id="links"
      title={t('userDashboard.networkNodes')}
      desc={t('userDashboard.networkNodesDesc')}
      icon={Link2}
      badge={t('userDashboard.activeLinks')}
    >
      <div className="space-y-3">
        {orderedLinks?.map((link, idx) => (
          <div
            key={link.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(idx)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 p-3 rounded-xl bg-neutral border transition-all cursor-grab active:cursor-grabbing ${
              dragOverIdx === idx
                ? 'border-accent bg-accent/5 scale-[1.02]'
                : 'border-border'
            } ${
              draggedIdx === idx ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="text-slate-300 hover:text-slate-500 transition-colors cursor-grab">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Globe className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">
                {link.platform}
              </p>
              <p className="text-xs text-text-muted truncate">{link.url}</p>
            </div>
            <button onClick={() => deleteLink(link.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {isAdding && (
          <form action={handleAdd} className="flex gap-2 items-center p-3 rounded-xl bg-neutral border border-border">
            <input required name="platform" placeholder={t('userDashboard.platformPlaceholder')} className="flex-1 px-3 py-2 rounded-lg bg-white text-sm border-border" />
            <input required name="url" placeholder={t('userDashboard.urlPlaceholder')} className="flex-1 px-3 py-2 rounded-lg bg-white text-sm border-border" />
            <button type="submit" className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium">{t('registry.active')}</button>
            <button type="button" onClick={() => setIsAdding(false)} className="p-2 text-text-muted">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm font-medium text-text-muted hover:border-accent hover:text-accent transition-colors">
            <Plus className="w-4 h-4" />
            {t('userDashboard.addLink')}
          </button>
        )}
      </div>
    </Section>
  );
}

/* ─── Analytics Section ─── */
function AnalyticsSection({ events }: { events: any[] }) {
  const { t } = useLocale();
  const totalTaps = events?.filter(e => e.event_type === 'view' || e.event_type === 'tap').length || 0;
  const profileViews = events?.filter(e => e.event_type === 'view').length || 0;
  const totalEvents = (events?.length) || 0;
  
  // Calculate weekly data from actual events
  const now = new Date();
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeklyData = [0, 0, 0, 0, 0, 0, 0];
  
  if (events && events.length > 0) {
    events.forEach(event => {
      const eventDate = new Date(event.created_at);
      const diffTime = now.getTime() - eventDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        weeklyData[6 - diffDays] += 1;
      }
    });
  }
  
  const max = Math.max(...weeklyData, 1);

  return (
    <Section
      id="analytics"
      title={t('userDashboard.performanceMatrix')}
      desc={t('userDashboard.performanceDesc')}
      icon={BarChart3}
      badge={t('userDashboard.performanceMatrix')}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title={t('userDashboard.totalTaps')} value={totalTaps} icon={Smartphone} trend={{ value: '14%', isUp: true }} color="accent" />
        <StatCard title={t('userDashboard.profileViews')} value={profileViews} icon={Eye} color="blue" />
        <StatCard title={t('userDashboard.engagement')} value={totalEvents > 0 ? t('userDashboard.high') : '—'} icon={TrendingUp} color="amber" />
        <StatCard title={t('userDashboard.retention')} value={totalEvents > 0 ? '92%' : '—'} icon={Shield} color="neutral" />
      </div>

      <div className="p-4 rounded-xl bg-neutral border border-border">
        <h4 className="text-sm font-semibold text-primary mb-4">
          {t('userDashboard.weeklyActivity')}
        </h4>
        {totalEvents === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <BarChart3 className="w-8 h-8 text-slate-200 mb-2" />
            <p className="text-sm text-text-muted font-medium">
              {t('userDashboard.performanceDesc')}
            </p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-lg gradient-accent transition-all duration-500"
                  style={{ height: `${Math.max((val / max) * 100, val > 0 ? 8 : 0)}%` }}
                />
                <span className="text-[10px] text-text-muted">
                  {dayLabels[i]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}


/* ─── QR Code Section ─── */
function QRSection({ profile }: { profile: any }) {
  const { t } = useLocale();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/card/${profile?.username}`);
  }, [profile?.username]);

  return (
    <Section
      id="qr"
      title={t('userDashboard.beaconDistribution')}
      desc={t('userDashboard.beaconDesc')}
      icon={QrCode}
      badge={t('userDashboard.beaconDistribution')}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-48 h-48 rounded-2xl bg-neutral border-2 border-dashed border-border flex items-center justify-center mb-4">
          <div className="text-center">
            {/* Real implementation would use qrcode.react here */}
            <QrCode className="w-16 h-16 text-accent mx-auto mb-2" />
            <p className="text-xs text-text-muted break-all max-w-[150px]">{url}</p>
          </div>
        </div>
        <p className="text-sm text-text-muted mb-4 max-w-xs">
          {t('userDashboard.qrShareDesc')}
        </p>
      </div>
    </Section>
  );
}



/* ─── AI Tools Section ─── */
function AIToolsSection({ profile }: { profile: any }) {
  const { t } = useLocale();
  const [bio, setBio] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateBio() {
    setIsGenerating(true);
    try {
      // Mock AI generation for now as requested
      await new Promise(r => setTimeout(r, 1500));
      const generated = `${profile?.title || 'Professional'} based in Morocco, helping clients achieve exceptional results through dedicated service and expertise at ${profile?.company || 'their company'}.`;
      setBio(generated);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Section
      id="ai"
      title={t('userDashboard.neuralAugmentation')}
      desc={t('userDashboard.neuralDesc')}
      icon={Sparkles}
      badge="Intelligence"
    >
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-neutral border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-5 h-5 text-accent" />
            <h4 className="text-sm font-bold text-primary">
              {t('userDashboard.aiBioGenerator')}
            </h4>
          </div>
          <p className="text-xs text-text-muted mb-4">
            {t('userDashboard.neuralDesc')}
          </p>
          <button 
            type="button"
            onClick={generateBio}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-accent text-white text-sm font-semibold shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? t('userDashboard.generating') : t('userDashboard.generateBio')}
          </button>
          
          {bio && (
            <div className="mt-4 p-3 rounded-lg bg-white border border-accent/20">
              <p className="text-sm text-text-muted italic">&quot;{bio}&quot;</p>
              <form action={async () => {
                const formData = new FormData();
                formData.append('bio', bio);
                if (profile?.name) formData.append('name', profile.name);
                if (profile?.title) formData.append('title', profile.title);
                if (profile?.company) formData.append('company', profile.company);
                await updateProfile(formData);
                setBio("");
                alert(t('userDashboard.bioDeployed'));
              }}>
                  <button type="submit" className="mt-2 text-xs text-accent font-medium hover:text-accent-dark transition-colors">
                  {t('userDashboard.saveBio')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─── Color Style Section ─── */
function ColorStyleSection({ profile }: { profile: any }) {
  const { t } = useLocale();
  const [isPending, setIsPending] = useState(false);
  const [fontColor, setFontColor] = useState(profile?.font_color || '#1e293b');
  const [bgColor, setBgColor] = useState(profile?.bg_color || '#f8fafc');

  async function handleSave() {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.append('name', profile?.name || '');
      formData.append('title', profile?.title || '');
      formData.append('company', profile?.company || '');
      formData.append('email', profile?.email || '');
      formData.append('phone', profile?.phone || '');
      formData.append('whatsapp', profile?.whatsapp || '');
      formData.append('bio', profile?.bio || '');
      formData.append('font_color', fontColor);
      formData.append('bg_color', bgColor);
      await updateProfile(formData);
      alert(t('userDashboard.successUpdate'));
    } catch (error) {
      alert(t('userDashboard.failedUpdate'));
    } finally {
      setIsPending(false);
    }
  }

  const presets = [
    { font: '#1e293b', bg: '#f8fafc', label: 'Light' },
    { font: '#f1f5f9', bg: '#0f172a', label: 'Dark' },
    { font: '#ffffff', bg: '#1a1a2e', label: 'Midnight' },
    { font: '#1e293b', bg: '#fef3c7', label: 'Warm' },
    { font: '#064e3b', bg: '#ecfdf5', label: 'Mint' },
    { font: '#1e1b4b', bg: '#eef2ff', label: 'Indigo' },
  ];

  return (
    <Section
      id="style"
      title={t('userDashboard.profileStyle')}
      desc={t('userDashboard.profileStyleDesc')}
      icon={Palette}
      badge={t('userDashboard.profileStyle')}
    >
      <div className="space-y-6">
        {/* Presets */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => { setFontColor(preset.font); setBgColor(preset.bg); }}
              className={`p-3 rounded-2xl border-2 transition-all text-center hover:scale-105 ${
                fontColor === preset.font && bgColor === preset.bg
                  ? 'border-accent shadow-lg shadow-accent/20'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
              style={{ backgroundColor: preset.bg }}
            >
              <span className="text-xs font-bold" style={{ color: preset.font }}>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Colors */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('userDashboard.fontColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer appearance-none bg-transparent p-0"
              />
              <input
                type="text"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral border border-border text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('userDashboard.bgColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer appearance-none bg-transparent p-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral border border-border text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            {t('userDashboard.colorPreview')}
          </label>
          <div
            className="p-6 rounded-2xl border border-slate-200 shadow-sm transition-all"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {profile?.name ? profile.name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: fontColor }}>
                  {profile?.name || 'Your Name'}
                </p>
                <p className="text-sm font-medium opacity-70" style={{ color: fontColor }}>
                  {profile?.title || 'Your Title'}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-60" style={{ color: fontColor }}>
              {profile?.bio || 'Your bio will appear here with the selected colors.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl gradient-accent text-white text-sm font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
        >
          {isPending ? t('userDashboard.saving') : t('userDashboard.saveChanges')}
        </button>
      </div>
    </Section>
  );
}

/* ─── Leads Section (Business Only) ─── */
function LeadsSection({ leads }: { leads: any[] }) {
  const { t } = useLocale();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm(t('common.confirmDelete') || 'Delete this lead?')) return;
    setIsDeleting(id);
    try {
      await deleteLead(id);
    } catch (error) {
       alert(t('common.error') || 'Failed to delete lead');
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <Section
      id="leads"
      title={t('userDashboard.leadsTitle') || "Lead Management"}
      desc={t('userDashboard.leadsDesc') || "Track and manage inquiries received through your card."}
      icon={Users}
      badge={t('userDashboard.businessOnly') || "Business Only"}
    >
      <div className="overflow-x-auto -mx-8 px-8">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('common.date') || 'Date'}</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('leadCapture.contact') || 'Contact'}</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('userDashboard.company') || 'Company'}</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('leadCapture.messageLabel') || 'Message'}</th>
              <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('leadCapture.actions') || 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400 text-sm italic font-medium">
                  {t('userDashboard.noLeads') || 'No leads received yet. Share your card to start capturing inquiries!'}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="group/row hover:bg-slate-50 transition-colors">
                  <td className="py-4">
                    <div className="text-xs font-bold text-slate-600">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-none mb-1">{lead.name}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-slate-600">{lead.company || '-'}</span>
                  </td>
                  <td className="py-4">
                    <div className="max-w-[200px] truncate text-xs text-slate-500 italic">
                      &quot;{lead.message || 'No message'}&quot;
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={isDeleting === lead.id}
                      className="p-2 text-slate-200 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {isDeleting === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ─── Products Section (Business Only) ─── */
function ProductsSection({ products, profile }: { products: any[], profile: any }) {
  const { t } = useLocale();
  const [isPending, setIsPending] = useState(false);
  const [isCatUploading, setIsCatUploading] = useState(false);
  const catInputRef = useRef<HTMLInputElement>(null);

  async function handleCatUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('userDashboard.fileTooLarge') || "File is too large (max 5MB).");
      return;
    }

    setIsCatUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadPDF(formData, "catalogue_url");
      alert(t('userDashboard.uploadSuccess') || "Catalogue uploaded successfully!");
    } catch (error: any) {
      alert(error.message || t('userDashboard.uploadError') || "Error uploading catalogue.");
    } finally {
      setIsCatUploading(false);
      if (catInputRef.current) catInputRef.current.value = "";
    }
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addProduct(formData);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert(t('common.error') || 'Failed to add product');
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('common.confirmDelete') || 'Delete this product?')) return;
    try {
      await deleteProduct(id);
    } catch (error) {
       alert(t('common.error') || 'Failed to delete product');
    }
  }

  return (
    <Section
      id="products"
      title={t('userDashboard.productsTitle') || "Product Showcase"}
      desc={t('userDashboard.productsDesc') || "Display your best products or services on your card."}
      icon={ShoppingBag}
      badge={t('userDashboard.businessOnly') || "Business Only"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 border-r border-slate-100 pr-8">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('userDashboard.productName') || 'Product Name'}</label>
              <input name="name" required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="e.g. Premium Coffee Mask" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('userDashboard.price') || 'Price'}</label>
                <input name="price" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="e.g. 150 DH" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('userDashboard.link') || 'Link'}</label>
                <input name="external_link" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('userDashboard.bio') || 'Description'}</label>
              <textarea name="description" rows={3} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20" placeholder="..." />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              {t('userDashboard.addProduct') || 'Add Product'}
            </button>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex flex-col gap-3">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{t('userDashboard.uploadCatalogue')}</label>
                  <input 
                    type="file" 
                    ref={catInputRef} 
                    onChange={handleCatUpload} 
                    accept=".pdf" 
                    className="hidden" 
                  />
                  <button 
                    type="button"
                    disabled={isCatUploading}
                    onClick={() => catInputRef.current?.click()}
                    className={`w-full py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest ${
                      profile?.catalogue_url 
                      ? 'border-green-100 bg-green-50 text-green-600 hover:bg-green-100' 
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isCatUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    {profile?.catalogue_url ? t('userDashboard.catalogueManaged') : t('userDashboard.uploadCatalogue')}
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{t('userDashboard.pdfMetadata')}</p>
               </div>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.length === 0 ? (
              <div className="col-span-2 py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                <Package className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">{t('userDashboard.noProducts') || 'No products added yet.'}</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-4 group/prod relative">
                   <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                     <Package className="w-6 h-6" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{product.name}</p>
                     <p className="text-[10px] font-bold text-accent mb-1">{product.price || t('userDashboard.priceOnRequest') || 'Price on request'}</p>
                     <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                   </div>
                   <button
                    onClick={() => handleDelete(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-400 rounded-lg opacity-0 group-hover/prod:opacity-100 transition-all"
                   >
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Main Client Page Export ─── */
export default function DashboardClientPage({ 
  profile, 
  links, 
  subscription, 
  analytics,
  leads = [],
  products = [] 
}: any) {
  const { t } = useLocale();
  const totalTaps = analytics?.filter((e: any) => e.event_type === 'view' || e.event_type === 'tap').length || 0;
  const isCardActive = profile?.is_active;
  const isBusiness = profile?.card_type === 'business';

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-accent rounded-full" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em]">{t('userDashboard.operationalOversight')}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{t('userDashboard.consoleOverview')}</h1>
          <p className="text-slate-500 font-medium text-base">{t('userDashboard.summaryDesc')}</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('userDashboard.systemHealth')}</p>
                <p className="text-lg font-bold text-green-500 leading-tight">OPTIONAL</p>
              </div>
              <div className="w-px h-6 bg-slate-100" />
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('userDashboard.accountType')}</p>
                <p className="text-lg font-bold text-slate-900 leading-tight uppercase">{(profile?.card_type === 'business' ? t('registry.business') : t('registry.personal'))}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('userDashboard.cardTaps')} value={totalTaps} icon={Smartphone} trend={{ value: '12%', isUp: true }} color="accent" />
        <StatCard title={t('userDashboard.profileStatus')} value={isCardActive ? t('userDashboard.active') : t('registry.locked')} icon={Shield} color={isCardActive ? "accent" : "amber"} />
        <StatCard title={t('userDashboard.activeLinks')} value={links?.length || 0} icon={Link2} color="blue" />
        <StatCard title={t('userDashboard.cardTier')} value={(profile?.card_type === 'business' ? t('registry.business') : t('registry.personal')) || "N/A"} icon={CreditCard} color="neutral" />
      </div>

      <div className="space-y-10">
        <ProfileSection profile={profile} />
        <ColorStyleSection profile={profile} />
        <LinksSection links={links} />
        {isBusiness && <LeadsSection leads={leads} />}
        {isBusiness && <ProductsSection products={products} profile={profile} />}
        <AnalyticsSection events={analytics} />
        <QRSection profile={profile} />
        <AIToolsSection profile={profile} />
      </div>
    </div>
  );
}
