/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Search, Loader2, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SalesSearch = ({ t }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!documentNumber.trim()) return;
    setIsLoading(true);
    setResult(null);

    // Mocking a sales search for now
    setTimeout(() => {
      setResult({
        invoice: documentNumber,
        date: new Date().toLocaleDateString(),
        customer: "CLIENTE DEMO S.A.C.",
        amount: "S/ " + (Math.random() * 1000).toFixed(2),
        status: "VALIDADO",
        items: [
          { desc: "SERVICIO DE CONSULTA API", qty: 1, price: "S/ 150.00" },
          { desc: "MANTENIMIENTO TERMINAL", qty: 1, price: "S/ 50.00" }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="glass rounded-3xl p-4 sm:p-8 glow-indigo mb-12 md:mb-16">
      <div className="flex items-center gap-4 mb-8">
        <ShoppingCart className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.3em] opacity-100">
          {t.salesSearch}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t.salesPlaceholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-4 sm:px-6 pr-14 sm:pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-xs sm:text-sm tracking-widest uppercase"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !documentNumber.trim()}
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
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <FileText className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{t.salesPlaceholder.split('...')[0]}</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{result.invoice}</div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{t.salesDate}</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{result.date}</div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <User className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{t.salesCustomer}</span>
                  </div>
                  <div className="text-sm font-mono font-bold">{result.customer}</div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-3 mb-2 opacity-60">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{t.salesAmount}</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-emerald-400">{result.amount}</div>
                </div>
              </div>

              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Detalle de Venta</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono font-bold uppercase tracking-widest">
                    {result.status}
                  </span>
                </div>
                <div className="space-y-3">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
                      <span className="opacity-80">{item.desc}</span>
                      <span className="font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SalesSearch;
