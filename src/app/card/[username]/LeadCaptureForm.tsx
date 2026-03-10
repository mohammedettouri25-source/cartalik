"use client";

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle, X } from "lucide-react";
import { submitLead } from "./actions";
import { useLocale } from "@/context/LocaleContext";

interface LeadCaptureFormProps {
  userId: string;
}

export default function LeadCaptureForm({ userId }: LeadCaptureFormProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setErrorMsg("");
    try {
      await submitLead(formData, userId, 'NFC'); // Pass NFC or QR based on URL param if available
      setIsSuccess(true);
      setTimeout(() => setIsOpen(false), 3000);
    } catch (error: any) {
      setErrorMsg(error.message || t('leadCapture.failedToSubmit') || "Failed to submit. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:scale-[1.03] active:scale-95 transition-all duration-500 group"
      >
        <UserPlus className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
        {t('leadCapture.shareButton') || "Share Your Contact"}
      </button>
    );
  }

  return (
    <div className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-[40px] shadow-2xl rounded-[3rem] p-8 relative overflow-hidden animate-fade-in duration-700">
      {isSuccess ? (
        <div className="text-center py-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
            {t('leadCapture.successTitle') || "Contact Shared!"}
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            {t('leadCapture.successDesc') || "Your information was successfully shared."}
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-full transition-all duration-500"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-0">
            <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-emerald-400" />
              {t('leadCapture.formTitle') || "Exchange Contact"}
            </h3>
            <p className="text-[10px] text-emerald-400/60 mt-2 font-black uppercase tracking-widest pl-9">
              {t('leadCapture.formDesc') || "Leave your contact so we can stay in touch."}
            </p>
          </div>

          <form action={handleSubmit} className="mt-8 space-y-5">
            {[
              { label: t('leadCapture.nameLabel') || "Full Name", name: "name", type: "text", required: true },
              { label: t('leadCapture.phoneLabel') || "Phone Number", name: "phone", type: "tel", required: true },
              { label: t('leadCapture.emailLabel') || "Email Address", name: "email", type: "email", required: false },
              { label: t('leadCapture.companyLabel') || "Company (Optional)", name: "company", type: "text", required: false },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  className="w-full px-5 py-4 rounded-[1.5rem] bg-white/[0.05] border border-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-500 placeholder:text-white/20"
                />
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">
                {t('leadCapture.messageLabel') || "Message (Optional)"}
              </label>
              <textarea
                name="message"
                rows={2}
                className="w-full px-5 py-4 rounded-[1.5rem] bg-white/[0.05] border border-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-500 placeholder:text-white/20 resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-bold text-center tracking-tight animate-shake">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-4 flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-emerald-500 text-white font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-700 disabled:opacity-50 group/sub"
            >
              {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
              {isPending ? (t('leadCapture.submitting') || "Saving...") : (t('leadCapture.submitButton') || "Share Contact")}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
