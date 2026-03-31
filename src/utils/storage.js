/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilidades para manejar el almacenamiento local (localStorage)
 */
const STORAGE_KEY = 'ip_search_history_v2';
const MAX_HISTORY = 20;

/**
 * Guarda los datos de una IP en el historial del localStorage.
 * @param {Object} data - Los datos completos de la IP.
 */
export const saveToHistory = (data) => {
  if (!data || !data.ip) return;

  const currentHistory = getHistory();
  
  // Filtrar si ya existe para moverla al principio
  const filteredHistory = currentHistory.filter(item => item.ip !== data.ip);
  
  // Añadir con timestamp
  const newEntry = {
    ...data,
    timestamp: new Date().toISOString()
  };

  const newHistory = [newEntry, ...filteredHistory].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

/**
 * Obtiene el historial completo desde localStorage.
 * @returns {Object[]} - Array de objetos de datos de IP.
 */
export const getHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error al leer el historial:', error);
    return [];
  }
};

/**
 * Limpia todo el historial.
 */
export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
