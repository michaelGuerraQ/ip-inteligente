/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Loader2, User, Fingerprint, MapPin, Calendar, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DNISearch = ({ t }) => {
  const [fullName, setFullName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [searchMode, setSearchMode] = useState('name'); // 'name' or 'number'
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [singleResult, setSingleResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearchByName = async () => {
    if (!fullName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    setSingleResult(null);

    try {
      const response = await fetch('/api/dni/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError(t.noDniFound);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByNumber = async () => {
    if (!documentNumber.trim() || documentNumber.length !== 8) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSingleResult(null);

    try {
      const response = await fetch('/api/dni/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber: documentNumber.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSingleResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-8 glow-indigo mb-12 md:mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Fingerprint className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] opacity-100">
            {searchMode === 'name' ? t.dniSearch : t.dniByNumber}
          </h2>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          <button
            onClick={() => setSearchMode('name')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
              searchMode === 'name' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            {t.dniNames}
          </button>
          <button
            onClick={() => setSearchMode('number')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
              searchMode === 'number' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'
            }`}
          >
            {t.dniNumber}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          {searchMode === 'name' ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchByName()}
              placeholder={t.dniPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-4 sm:px-6 pr-14 sm:pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-xs sm:text-sm tracking-widest uppercase"
            />
          ) : (
            <input
              type="text"
              maxLength={8}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchByNumber()}
              placeholder={t.dniNumberPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-4 sm:px-6 pr-14 sm:pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-xs sm:text-sm tracking-widest uppercase"
            />
          )}
          <button
            onClick={searchMode === 'name' ? handleSearchByName : handleSearchByNumber}
            disabled={isLoading || (searchMode === 'name' ? !fullName.trim() : documentNumber.length !== 8)}
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

        {singleResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Fingerprint className="w-32 h-32 text-indigo-500" />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                  <User className="w-12 h-12 text-indigo-500" />
                </div>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] mb-2">{t.dniNames}</p>
                    <h3 className="text-2xl font-bold uppercase tracking-tight">
                      {singleResult.full_name || `${singleResult.name || ''} ${singleResult.surname || ''}`.trim() || "---"}
                    </h3>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Fingerprint className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniNumber}</p>
                        <p className="font-mono font-bold text-emerald-500">{singleResult.number || "---"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <Calendar className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniBirth}</p>
                        <p className={`font-mono font-bold ${!singleResult.date_of_birth ? 'opacity-20 italic' : ''}`}>
                          {singleResult.date_of_birth || "No disponible"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <Home className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniAddress}</p>
                        <p className={`text-xs font-bold uppercase ${(!singleResult.address && !singleResult.address_complete) || singleResult.address === ' - - - -' ? 'opacity-20 italic' : ''}`}>
                          {singleResult.address === ' - - - -' ? "Dirección no registrada" : (singleResult.address_complete || singleResult.address || "Dirección no registrada")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:col-span-2">
                      <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        <MapPin className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono opacity-40 uppercase tracking-widest">{t.dniLocation}</p>
                        <p className={`text-xs font-bold uppercase ${!singleResult.department ? 'opacity-20 italic' : ''}`}>
                          {singleResult.department ? 
                            `${singleResult.department} / ${singleResult.province} / ${singleResult.district}` : 
                            "Ubicación no disponible"}
                        </p>
                        {singleResult.ubigeo && (
                          <p className="text-[8px] font-mono opacity-30 mt-1">UBIGEO: {singleResult.ubigeo}</p>
                        )}
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
                    <pre>{JSON.stringify(singleResult, null, 2)}</pre>
                  </div>
                </details>
              </div>
            </div>
          </motion.div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-[10px] font-mono opacity-60 uppercase tracking-widest mb-4">{t.dniResults}</h3>
            <div className="grid grid-cols-1 gap-4">
              {results.map((res, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <User className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-1">{t.dniNames}</p>
                      <p className="text-sm font-bold uppercase tracking-widest">{res.names} {res.surname.paternal} {res.surname.maternal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <Fingerprint className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest mb-1">{t.dniNumber}</p>
                      <p className="text-xl font-mono font-bold text-emerald-500 tracking-tighter">{res.dni}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DNISearch;
