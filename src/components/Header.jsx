/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Sun, Moon, Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Header = ({ lang, setLang, theme, setTheme, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dni-section', label: t.dniSearch, icon: Search },
    { id: 'ruc-section', label: t.rucSearch, icon: ShieldCheck },
    { id: 'sales-section', label: t.salesSearch, icon: ShoppingCart },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <div className="flex items-center sm:items-start gap-4 sm:gap-5">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-indigo-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass p-3 sm:p-4 rounded-xl border border-white/10 shadow-2xl">
              <ShieldCheck className="text-indigo-500 w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5px]" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.title}<span className="text-indigo-500">.</span>IP
              </h1>
              <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] sm:text-[10px] font-mono opacity-80 uppercase tracking-widest">
                v2.7
              </span>
            </div>
            <p className="opacity-80 text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-[0.2em]">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      <div className="hidden lg:flex flex-wrap items-center gap-3 sm:gap-4 md:gap-8">
        {/* Language Toggle */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setLang('en')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-80 hover:opacity-100'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('es')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-bold transition-all ${lang === 'es' ? 'bg-indigo-600 text-white shadow-lg' : 'opacity-80 hover:opacity-100'}`}
          >
            ES
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] sm:text-[10px] font-mono opacity-60 uppercase tracking-widest mb-1">{t.uptime}</span>
          <span className="text-xs sm:text-sm font-mono text-emerald-500/80">99.998%</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/5 text-emerald-500 rounded-lg border border-emerald-500/20">
          <div className="w-1.5 h-1.5 sm:w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.15em]">{t.systemOnline}</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#050505] border-l border-white/10 p-8 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-indigo-500 w-6 h-6" />
                  <span className="font-extrabold tracking-tight text-xl">MENU</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-indigo-600/20 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group text-left"
                  >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">Theme</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest">Language</span>
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => setLang('en')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold ${lang === 'en' ? 'bg-indigo-600 text-white' : 'opacity-60'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('es')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold ${lang === 'es' ? 'bg-indigo-600 text-white' : 'opacity-60'}`}
                    >
                      ES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
