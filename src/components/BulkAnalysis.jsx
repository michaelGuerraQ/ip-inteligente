/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Loader2, Table } from 'lucide-react';
import { fetchIPData } from '../services/ipService.js';

const BulkAnalysis = ({ onResults, onSelect, t }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleBulkScan = async () => {
    const ips = input.split(/[\n, ]+/).map(ip => ip.trim()).filter(ip => ip !== '');
    if (ips.length === 0) return;

    setIsLoading(true);
    const newResults = [];
    
    for (const ip of ips) {
      try {
        const data = await fetchIPData(ip);
        newResults.push(data);
      } catch (error) {
        newResults.push({ ip, error: true, risk: { risk_score: 0 } });
      }
    }

    setResults(newResults);
    setIsLoading(false);
    if (onResults) onResults(newResults);
  };

  return (
    <div className="glass rounded-3xl p-8 glow-indigo mb-16">
      <div className="flex items-center gap-4 mb-8">
        <Table className="w-5 h-5 text-indigo-500" />
        <h2 className="text-sm font-mono font-bold uppercase tracking-[0.3em] opacity-100">
          {t.bulkAnalysis}
        </h2>
        {results.length > 0 && (
          <button 
            onClick={() => setResults([])}
            className="ml-auto text-[10px] font-mono font-bold text-rose-500/60 hover:text-rose-500 transition-colors uppercase tracking-widest"
          >
            {t.purgeCache}
          </button>
        )}
      </div>

      <div className="space-y-6 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.bulkPlaceholder}
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm tracking-widest uppercase"
        />
        {input && (
          <button 
            onClick={() => setInput('')}
            className="absolute right-4 top-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors opacity-40 hover:opacity-100"
          >
            <Table className="w-3 h-3 rotate-45" />
          </button>
        )}
        
        <button
          onClick={handleBulkScan}
          disabled={isLoading || !input.trim()}
          className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 disabled:opacity-30 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] uppercase text-xs tracking-widest"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {t.startBulk}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-12 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-1">Total</p>
              <p className="text-xl font-mono font-bold">{results.length}</p>
            </div>
            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
              <p className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest mb-1">{t.safe}</p>
              <p className="text-xl font-mono font-bold text-emerald-500">
                {results.filter(r => r.risk?.risk_score < 30).length}
              </p>
            </div>
            <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
              <p className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest mb-1">{t.suspicious}</p>
              <p className="text-xl font-mono font-bold text-amber-500">
                {results.filter(r => r.risk?.risk_score >= 30 && r.risk?.risk_score < 70).length}
              </p>
            </div>
            <div className="bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
              <p className="text-[10px] font-mono text-rose-500/60 uppercase tracking-widest mb-1">{t.dangerous}</p>
              <p className="text-xl font-mono font-bold text-rose-500">
                {results.filter(r => r.risk?.risk_score >= 70).length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.bulkTableIp}</th>
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.countryRegion}</th>
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.provider}</th>
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.bulkTableRisk}</th>
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest">{t.bulkTableStatus}</th>
                <th className="pb-4 text-[10px] font-mono opacity-60 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.map((res, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 font-mono text-sm">{res.ip}</td>
                  <td className="py-4 text-xs opacity-60">{res.location?.country || '---'}</td>
                  <td className="py-4 text-xs opacity-60 truncate max-w-[150px]">{res.asn?.name || '---'}</td>
                  <td className="py-4">
                    <span className={`font-mono text-sm ${res.risk?.risk_score < 30 ? 'text-emerald-500' : res.risk?.risk_score < 70 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {res.risk?.risk_score}%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${
                      res.risk?.risk_score < 30 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      res.risk?.risk_score < 70 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {res.risk?.risk_score < 30 ? t.safe : res.risk?.risk_score < 70 ? t.suspicious : t.dangerous}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onSelect && onSelect(res.ip)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title={t.analyze}
                    >
                      <Play className="w-3 h-3 text-indigo-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default BulkAnalysis;
