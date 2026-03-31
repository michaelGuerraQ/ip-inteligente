/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, XCircle, Smartphone, Globe2, Server, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

/**
 * Componente que muestra el análisis de riesgo y seguridad de la IP.
 * @param {Object} props
 * @param {Object} props.riskData - Objeto 'risk' devuelto por la API.
 */
const RiskSection = ({ riskData, t }) => {
  if (!riskData) return null;

  const { is_vpn, is_proxy, is_tor, is_mobile, is_datacenter, risk_score } = riskData;

  const getRiskColor = (score) => {
    if (score < 30) return 'text-emerald-500';
    if (score < 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getRiskBg = (score) => {
    if (score < 30) return 'bg-emerald-500';
    if (score < 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getRiskText = (score) => {
    if (score < 30) return t.secure;
    if (score < 70) return t.caution;
    return t.critical;
  };

  const SecurityBadge = ({ label, isActive, icon: Icon }) => (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-500",
      isActive 
        ? "bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
        : "bg-white/[0.02] border-white/5 opacity-70"
    )}>
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", isActive ? "text-rose-500" : "opacity-60")} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      {isActive ? (
        <XCircle className="w-4 h-4 animate-pulse" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-500/40" />
      )}
    </div>
  );

  return (
    <div className="glass rounded-3xl overflow-hidden glow-indigo h-full flex flex-col">
      <div className="bg-white/[0.03] px-8 py-6 border-b border-white/10 flex items-center justify-between">
        <h2 className="opacity-100 font-mono font-bold text-sm flex items-center gap-3 uppercase tracking-[0.3em]">
          <ShieldAlert className="w-4 h-4 text-indigo-500" />
          {t.threatAnalysis}
        </h2>
        <div className={cn(
          "px-3 py-1 rounded-md text-[10px] font-mono font-black uppercase tracking-[0.2em] border",
          risk_score < 30 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
          risk_score < 70 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
          "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {getRiskText(risk_score)}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-10 flex-1">
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-mono opacity-60 uppercase tracking-[0.3em]">{t.riskProbability}</span>
              <p className="text-xs opacity-60 font-medium">{t.behaviorDetection}</p>
            </div>
            <span className={cn("text-5xl font-mono font-bold tracking-tighter", getRiskColor(risk_score))}>
              {risk_score}<span className="text-xl opacity-60 ml-1">%</span>
            </span>
          </div>
          
          <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${risk_score}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={cn("h-full rounded-full relative", getRiskBg(risk_score))}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-2 gap-3">
            <SecurityBadge label={t.vpn} isActive={is_vpn} icon={Server} />
            <SecurityBadge label={t.proxy} isActive={is_proxy} icon={Globe2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SecurityBadge label={t.tor} isActive={is_tor} icon={ShieldAlert} />
            <SecurityBadge label={t.datacenter} isActive={is_datacenter} icon={Server} />
          </div>
          <SecurityBadge label={t.mobile} isActive={is_mobile} icon={Smartphone} />
        </div>

        {/* Security Simulation Insights */}
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 space-y-4">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
            <Activity className="w-3 h-3 text-indigo-500" />
            {t.securitySimulation}
          </h3>
          <div className="space-y-3">
            {is_vpn && <div className="flex items-center gap-3 text-xs text-rose-500/80 font-medium"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> {t.vpnInsight}</div>}
            {is_tor && <div className="flex items-center gap-3 text-xs text-rose-500/80 font-medium"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> {t.torInsight}</div>}
            {is_proxy && <div className="flex items-center gap-3 text-xs text-amber-500/80 font-medium"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {t.proxyInsight}</div>}
            {is_datacenter && <div className="flex items-center gap-3 text-xs text-indigo-400/80 font-medium"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {t.datacenterInsight}</div>}
            {!is_vpn && !is_tor && !is_proxy && !is_datacenter && <div className="flex items-center gap-3 text-xs text-emerald-500/80 font-medium"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> {t.safeInsight}</div>}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <p className="text-[10px] opacity-60 font-mono leading-relaxed uppercase tracking-widest text-center">
            {t.riskNote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskSection;
