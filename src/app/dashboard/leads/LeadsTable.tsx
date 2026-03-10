"use client";

import { useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { Download, MessageCircle, Mail, User, Clock, Search } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message?: string;
  source: string;
  created_at: string;
}

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const { t } = useLocale();
  const [search, setSearch] = useState("");

  const filteredLeads = initialLeads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.phone.includes(search) ||
    lead.email?.toLowerCase().includes(search.toLowerCase()) ||
    lead.company?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["Name", "Phone", "Email", "Company", "Message", "Source", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => {
        return [
          `"${lead.name}"`,
          `"${lead.phone}"`,
          `"${lead.email || ''}"`,
          `"${lead.company || ''}"`,
          `"${lead.message?.replace(/"/g, '""') || ''}"`,
          `"${lead.source}"`,
          `"${new Date(lead.created_at).toLocaleString()}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cartalik_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-4" />
          <input
            type="text"
            placeholder={t('dashboard.searchLeads') || "Search leads..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2.5 bg-neutral border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          {t('dashboard.exportCsv') || "Export CSV"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('leadCapture.nameLabel') || "Name"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('leadCapture.contact') || "Contact"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('leadCapture.companyLabel') || "Company"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('leadCapture.sourceDate') || "Source & Date"}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest ltr:text-right rtl:text-left">{t('leadCapture.actions') || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {lead.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                        {lead.message && (
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-xs" title={lead.message}>&quot;{lead.message}&quot;</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 font-medium">{lead.phone}</p>
                    <p className="text-xs text-slate-500">{lead.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {lead.company || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        {lead.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 ltr:text-right rtl:text-left">
                    <div className="flex items-center justify-end gap-2 rtl:justify-start">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <User className="w-12 h-12 text-slate-200 mb-4" />
                    <p className="text-base font-medium text-slate-600 mb-1">{t('dashboard.noLeads') || "No leads found"}</p>
                    <p className="text-sm text-slate-400">{t('dashboard.noLeadsDesc') || "Share your card to start collecting contacts."}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
