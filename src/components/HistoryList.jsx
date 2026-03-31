/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Search, Trash2 } from 'lucide-react';

/**
 * Componente que muestra el historial de búsquedas recientes.
 * @param {Object} props
 * @param {string[]} props.history - Lista de IPs buscadas.
 * @param {Function} props.onSelect - Función que se ejecuta al seleccionar una IP del historial.
 * @param {Function} props.onClear - Función que limpia el historial.
 */
const HistoryList = ({ history, onSelect, onClear, t }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!history || history.length === 0) return null;

  const filteredHistory = history.filter(item => 
    item.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass rounded-3xl overflow-hidden border border-white/5 mb-16">
      <div className="bg-white/[0.03] px-8 py-5 flex flex-wrap items-center justify-between border-b border-white/5 gap-4">
        <div className="flex items-center gap-6">
          <h2 className="opacity-80 font-mono font-bold text-[10px] flex items-center gap-3 uppercase tracking-[0.4em]">
            <History className="w-3 h-3 text-indigo-500/50" />
            {t.recentLogs}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 opacity-40" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.historySearch}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 w-48"
            />
          </div>
        </div>
        <button 
          onClick={onClear}
          className="text-[9px] font-mono font-bold text-rose-500/80 hover:text-rose-500 flex items-center gap-2 transition-colors uppercase tracking-[0.2em] px-3 py-1.5 bg-rose-500/5 rounded-md border border-rose-500/10 hover:border-rose-500/30"
        >
          <Trash2 className="w-3 h-3" />
          {t.purgeCache}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-4 text-[9px] font-mono opacity-60 uppercase tracking-widest">{t.bulkTableIp}</th>
              <th className="px-8 py-4 text-[9px] font-mono opacity-60 uppercase tracking-widest">{t.date}</th>
              <th className="px-8 py-4 text-[9px] font-mono opacity-60 uppercase tracking-widest">{t.result}</th>
              <th className="px-8 py-4 text-[9px] font-mono opacity-20 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.map((item, index) => (
              <tr key={`${item.ip}-${index}`} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold">{item.ip}</span>
                    <span className="text-[10px] opacity-60">{item.location?.country}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="font-mono text-[10px] opacity-60">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : '---'}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${
                    item.risk?.risk_score < 30 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    item.risk?.risk_score < 70 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {item.risk?.risk_score < 30 ? t.safe : item.risk?.risk_score < 70 ? t.suspicious : t.dangerous}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button 
                    onClick={() => onSelect(item.ip)}
                    className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-500/40 hover:text-indigo-500 transition-all"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
