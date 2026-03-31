/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

const ExportTools = ({ data, history, t }) => {
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(data || history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip_intelligence_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvData = (data ? [data] : history).map(item => ({
      IP: item.ip,
      Country: item.location?.country,
      City: item.location?.city,
      ISP: typeof item.isp === 'object' ? item.isp.isp : item.isp,
      RiskScore: item.risk?.risk_score,
      IsVPN: item.risk?.is_vpn,
      IsProxy: item.risk?.is_proxy,
      IsTor: item.risk?.is_tor,
      Date: new Date().toISOString()
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip_intelligence_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-16">
      <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Download className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="pr-4">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">{t.exportData}</h3>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-100">Intelligence Report</p>
        </div>
      </div>

      <button
        onClick={handleDownloadJSON}
        className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95 group"
      >
        <FileJson className="w-4 h-4 opacity-60 group-hover:text-indigo-400 transition-colors" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{t.downloadJson}</span>
      </button>

      <button
        onClick={handleDownloadCSV}
        className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-95 group"
      >
        <FileSpreadsheet className="w-4 h-4 opacity-60 group-hover:text-emerald-400 transition-colors" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{t.downloadCsv}</span>
      </button>
    </div>
  );
};

export default ExportTools;
