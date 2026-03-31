/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import IPInfoCard from './components/IPInfoCard.jsx';
import RiskSection from './components/RiskSection.jsx';
import HistoryList from './components/HistoryList.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import IPMap from './components/IPMap.jsx';
import RiskCharts from './components/RiskCharts.jsx';
import BulkAnalysis from './components/BulkAnalysis.jsx';
import DNISearch from './components/DNISearch.jsx';
import RUCSearch from './components/RUCSearch.jsx';
import SalesSearch from './components/SalesSearch.jsx';
import ExportTools from './components/ExportTools.jsx';
import { fetchIPData } from './services/ipService.js';
import { saveToHistory, getHistory, clearHistory } from './utils/storage.js';
import { Loader2 } from 'lucide-react';
import { translations } from './translations.js';

function App() {
  const [ipData, setIpData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [lang, setLang] = useState('es');
  const [theme, setTheme] = useState('dark');

  const t = translations[lang];

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light' : '';
  }, [theme]);

  const handleSearch = useCallback(async (ip = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchIPData(ip);
      
      if (data && data.ip) {
        setIpData(data);
        saveToHistory(data);
        setHistory(getHistory());
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setHistory(getHistory());
    const timer = setTimeout(() => {
      handleSearch();
    }, 100);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-500 overflow-x-hidden">
      <div className="scanline" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 md:mb-12"
        >
          <Header 
            lang={lang} 
            setLang={setLang} 
            theme={theme} 
            setTheme={setTheme} 
            t={t}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16"
        >
          <SearchBar 
            onSearch={handleSearch} 
            onMyIP={() => handleSearch('')} 
            isLoading={isLoading} 
            t={t}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error-msg"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="mb-6 md:mb-8"
            >
              <ErrorMessage 
                message={error} 
                onRetry={() => handleSearch()} 
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && !ipData && (
            <motion.div 
              key="main-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 md:py-32 gap-6"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 md:w-20 md:h-20 text-indigo-500 animate-spin stroke-[1.5px]" />
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
              </div>
              <div className="text-center space-y-2 px-4">
                <p className="text-indigo-400 font-mono text-xs md:text-sm uppercase tracking-[0.3em] animate-pulse">
                  {t.initializing}
                </p>
                <p className="opacity-80 text-[10px] font-mono uppercase tracking-widest">
                  {t.querying}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {ipData && (
            <motion.main 
              key={ipData.ip}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={isLoading ? "opacity-30 pointer-events-none blur-sm transition-all duration-500" : "transition-all duration-500"}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start mb-12">
                <div className="lg:col-span-7 space-y-6 md:space-y-8">
                  <IPInfoCard data={ipData} t={t} />
                  <IPMap 
                    lat={ipData.location?.latitude} 
                    lon={ipData.location?.longitude} 
                    city={ipData.location?.city} 
                    country={ipData.location?.country}
                    t={t}
                  />
                </div>
                <div className="lg:col-span-5">
                  <RiskSection riskData={ipData.risk} t={t} />
                </div>
              </div>

              <div className="space-y-12 md:space-y-16">
                <ExportTools data={ipData} history={history} t={t} />
                
                <RiskCharts history={history} t={t} />

                <BulkAnalysis 
                  onResults={(results) => {
                    results.forEach(res => saveToHistory(res));
                    setHistory(getHistory());
                  }} 
                  onSelect={handleSearch}
                  t={t} 
                />

                <div id="dni-section">
                  <DNISearch t={t} />
                </div>
                <div id="ruc-section">
                  <RUCSearch t={t} />
                </div>
                <div id="sales-section">
                  <SalesSearch t={t} />
                </div>
              </div>
            </motion.main>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 md:mt-20"
        >
          <HistoryList 
            history={history} 
            onSelect={handleSearch} 
            onClear={handleClearHistory} 
            t={t}
          />
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 md:mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="opacity-80 text-[10px] md:text-xs font-mono uppercase tracking-widest">
              {t.statusOperational}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="opacity-80 text-[10px] md:text-xs font-mono uppercase tracking-widest">
              {t.poweredBy} <a href="https://ipquery.io" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors"> Developed by Michael</a>
            </p>
            <p className="opacity-60 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em]">
              © 2026 IP Intelligence Terminal v2.7
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
