/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.ipquery.io/';
const DOH_URL = 'https://cloudflare-dns.com/query';

/**
 * Resuelve un dominio a una dirección IP usando DNS-over-HTTPS.
 * @param {string} domain - El dominio a resolver.
 * @returns {Promise<string>} - La dirección IP resuelta.
 */
export const resolveDomain = async (domain) => {
  try {
    const response = await axios.get(DOH_URL, {
      params: { name: domain, type: 'A' },
      headers: { 'Accept': 'application/dns-json' }
    });
    
    const answer = response.data.Answer?.find(a => a.type === 1);
    if (!answer) throw new Error('No se pudo resolver el dominio.');
    return answer.data;
  } catch (error) {
    console.error('Error resolviendo dominio:', error.message || error);
    if (axios.isAxiosError(error) && !error.response) {
      throw new Error('Error de red al resolver el dominio. Verifica tu conexión.');
    }
    throw new Error('No se pudo resolver el dominio. Asegúrate de que sea válido (ej: google.com).');
  }
};

/**
 * Obtiene la información de una dirección IP específica o de la IP actual.
 * @param {string} input - La dirección IP o dominio a buscar.
 * @returns {Promise<Object>} - Los datos de la IP.
 */
export const fetchIPData = async (input = '') => {
  try {
    let targetIP = input.trim().toLowerCase();
    
    // Eliminar protocolos si existen (http://, https://)
    targetIP = targetIP.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Si es un dominio (no parece una IP), intentamos resolverlo
    const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(targetIP) || targetIP.includes(':');
    let resolvedFrom = null;

    if (targetIP && !isIP) {
      resolvedFrom = targetIP;
      try {
        targetIP = await resolveDomain(targetIP);
      } catch (e) {
        // Si falla Cloudflare, intentamos por nuestro propio servidor
        const res = await axios.post('/api/dns/resolve', { domain: targetIP });
        targetIP = res.data.ip;
      }
    }

    // Si no hay IP, primero obtenemos la IP del cliente
    if (!targetIP) {
      const ipRes = await axios.get(API_BASE_URL, { timeout: 5000 });
      targetIP = typeof ipRes.data === 'object' ? ipRes.data.ip : ipRes.data.trim();
    }

    const url = `${API_BASE_URL}${targetIP}`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.data || !response.data.ip) {
      return { 
        ip: targetIP, 
        resolvedFrom,
        location: { country: 'Unknown', city: 'Unknown' }, 
        isp: { isp: 'Unknown' }, 
        risk: { risk_score: 0 } 
      };
    }
    
    return { ...response.data, resolvedFrom };
  } catch (error) {
    console.error('Error en fetchIPData:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) throw new Error('Rate limit exceeded. Please wait.');
      if (error.response?.status === 400) throw new Error('Invalid IP address or domain.');
    }
    throw new Error(error.message || 'Error analyzing target.');
  }
};
