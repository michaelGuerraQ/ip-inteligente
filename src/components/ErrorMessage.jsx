/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

/**
 * Componente para mostrar mensajes de error amigables.
 * @param {Object} props
 * @param {string} props.message - El mensaje de error a mostrar.
 * @param {Function} props.onRetry - Función opcional para reintentar la acción.
 */
const ErrorMessage = ({ message, onRetry, t }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl shadow-2xl mb-12 backdrop-blur-md">
      <div className="flex items-start gap-6">
        <div className="bg-rose-500/10 p-3 rounded-2xl border border-rose-500/20">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-rose-500 font-mono font-black text-sm uppercase tracking-[0.3em]">{t.errorTitle}</h3>
          <p className="opacity-80 font-medium text-lg leading-relaxed">{message}</p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-6 flex items-center gap-3 px-6 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-bold hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
              <RefreshCcw className="w-4 h-4" />
              {t.reInitialize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
