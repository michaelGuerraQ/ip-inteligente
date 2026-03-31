/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Loader2, Building2, Fingerprint, MapPin, Calendar, Home, Activity, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RUCSearch = ({ t }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!documentNumber.trim() || documentNumber.length !== 11) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ruc/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber: documentNumber.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderValue = (value, fallback = 'No disponible') => {
    if (!value || value === '-' || value === ' - - - -' || value.trim() === '') {
      return <span className="opacity-30 italic">{fallback}</span>;
    }
    return value;
  };

  const renderLocation = () => {
    const parts = [result.department, result.province, result.district].filter(p => p && p !== '-');
    if (parts.length === 0) return <span className="opacity-30 italic">Ubicación no disponible</span>;
    return parts.join(' / ');
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-8 glow-indigo mb-12 md:mb-16">
      <div className="flex items-center gap-4 mb-8">
        <Building2 className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] opacity-100">
          {t.rucSearch}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            maxLength={11}
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t.rucPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-4 sm:px-6 pr-14 sm:pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-xs sm:text-sm tracking-widest uppercase"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || documentNumber.length !== 11}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-30 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-rose-500 text-xs font-mono uppercase tracking-widest text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 className="w-32 h-32 text-indigo-500" />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                  <Building2 className="w-12 h-12 text-indigo-500" />
                </div>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] mb-2">RAZÓN SOCIAL</p>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">
                      {renderValue(result.name, 'Nombre no disponible')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Fingerprint className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">NÚMERO RUC</p>
                        <p className="font-mono font-bold text-emerald-500">{result.number}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Activity className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.rucStatus}</p>
                        <p className={`font-mono font-bold ${result.status === 'ACTIVO' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {renderValue(result.status)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Activity className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.rucCondition}</p>
                        <p className={`font-mono font-bold ${result.domicile_conditions === 'HABIDO' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {renderValue(result.domicile_conditions)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.rucType}</p>
                        <p className="text-[11px] font-bold uppercase">{renderValue(result.person_type)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Calendar className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.rucCreationDate}</p>
                        <p className="font-mono font-bold">{renderValue(result.date_creation)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <Briefcase className="w-4 h-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.rucBusinessLine}</p>
                        <p className="text-[11px] font-bold uppercase">{renderValue(result.business_line, 'No especificada')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Home className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniAddress}</p>
                        <p className="text-xs font-bold uppercase">{renderValue(result.address, 'Dirección no registrada')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        <MapPin className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniLocation}</p>
                        <p className="text-xs font-bold uppercase">
                          {renderLocation()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <details className="group">
                  <summary className="text-[10px] font-mono opacity-40 hover:opacity-100 cursor-pointer uppercase tracking-[0.2em] transition-opacity flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Depuración: Ver Respuesta de API (JSON)
                  </summary>
                  <div className="mt-4 p-6 bg-black/60 rounded-2xl border border-white/5 text-[10px] font-mono text-indigo-300/80 overflow-x-auto shadow-2xl">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </details>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RUCSearch;
