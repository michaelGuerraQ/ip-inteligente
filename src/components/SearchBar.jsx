/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, User } from 'lucide-react';

/**
 * Componente de barra de búsqueda.
 * Permite al usuario ingresar una IP manualmente o ver su propia IP.
 * @param {Object} props
 * @param {Function} props.onSearch - Función que se ejecuta al buscar una IP.
 * @param {Function} props.onMyIP - Función que se ejecuta al pulsar "Ver mi IP".
 * @param {boolean} props.isLoading - Indica si hay una búsqueda en curso.
 */
const SearchBar = ({ onSearch, onMyIP, isLoading, t }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:h-5 opacity-60 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.placeholder}
          className="block w-full pl-12 sm:pl-14 pr-28 sm:pr-32 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm sm:text-lg font-mono tracking-widest uppercase"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 sm:px-8 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] uppercase text-[10px] sm:text-xs tracking-widest"
        >
          {isLoading ? t.scanning : t.analyze}
        </button>
      </form>

      <button
        onClick={onMyIP}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-white/5 opacity-100 font-bold rounded-2xl border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase text-[10px] sm:text-xs tracking-widest"
      >
        <User className="w-4 h-4" />
        <span>{t.locateSelf}</span>
      </button>
    </div>
  );
};

export default SearchBar;
