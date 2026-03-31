/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, MapPin, Building2, Clock, Hash, Copy, Check } from 'lucide-react';

/**
 * Componente que muestra la información básica de la IP.
 */
const IPInfoCard = ({ data, t }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const { ip, location, isp: ispData, resolvedFrom } = data;
  const { country, city, state: region, timezone, latitude, longitude } = location || {};

  const displayISP = typeof ispData === 'object' 
    ? (ispData.isp || ispData.org || t.unknown) 
    : (ispData || t.unknown);

  const handleCopy = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DataField = ({ icon: Icon, label, value, mono = false }) => (
    <div className="group flex flex-col p-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 opacity-40 group-hover:text-indigo-400 transition-colors" />
        <span className="text-[10px] font-mono opacity-60 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <span className={`text-lg font-medium opacity-90 ${mono ? 'font-mono tracking-tight' : ''}`}>
        {value || '---'}
      </span>
    </div>
  );

  return (
    <div className="glass rounded-3xl overflow-hidden glow-indigo">
      <div className="px-8 py-6 border-b border-white/10 flex flex-wrap items-center justify-between bg-white/[0.02] gap-4">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <div>
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.3em] opacity-100">
              {t.nodeIdentity}
            </h2>
            {resolvedFrom && (
              <p className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest mt-1">
                {t.domainResolved}: <span className="text-indigo-400">{resolvedFrom}</span>
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 opacity-60 hover:opacity-100 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg border border-white/10 transition-all active:scale-95"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          {copied ? t.copied : t.copyIp}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-r border-white/5">
          <DataField icon={Hash} label={t.ipv4} value={ip} mono />
          <DataField icon={Globe} label={t.countryRegion} value={country} />
          <DataField icon={MapPin} label={t.geoCity} value={city} />
        </div>
        <div>
          <DataField icon={Building2} label={t.provider} value={displayISP} />
          <DataField icon={Clock} label={t.timezone} value={timezone} mono />
          <div className="group flex flex-col p-5 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3.5 h-3.5 opacity-40 group-hover:text-indigo-400 transition-colors" />
              <span className="text-[10px] font-mono opacity-60 uppercase tracking-[0.2em]">{t.coordinates}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm text-indigo-500/80">
              <span>LAT: {latitude || '0.0'}</span>
              <span className="opacity-10">|</span>
              <span>LON: {longitude || '0.0'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 bg-indigo-500/5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[9px] font-mono opacity-60 uppercase tracking-widest">{t.integrity}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-1 h-1 bg-indigo-500/30 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IPInfoCard;
