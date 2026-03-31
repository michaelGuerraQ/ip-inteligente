/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import dns from "dns";
import { promisify } from "util";

const lookup = promisify(dns.lookup);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función sleep para reintentos
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API para buscar DNI por nombres
  app.post("/api/dni/search", async (req, res) => {
    const { fullName } = req.body;
    if (!fullName) {
      return res.status(400).json({ error: "Full name is required" });
    }

    let n_ = fullName.trim().split(" ");
    if (n_.length < 3) {
      return res.status(400).json({ error: "Please provide at least names and two surnames" });
    }

    const name_ = n_.slice(0, n_.length - 2).join(" ");
    const fsurname_ = n_[n_.length - 2];
    const msurname_ = n_[n_.length - 1];

    let count = 0;
    const goDNI = async (): Promise<any> => {
      try {
        await sleep(100);
        const headers = {
          "accept": "*/*",
          "accept-language": "es,es-ES;q=0.9,en;q=0.8",
          "origin": "https://dniperu.com",
          "referer": "https://dniperu.com/buscar-dni-por-nombres-y-apellidos/",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest"
        };

        const frm = new FormData();
        frm.append("nombres", name_);
        frm.append("apellido_paterno", fsurname_);
        frm.append("apellido_materno", msurname_);

        const response = await axios.post("https://dniperu.com/getElementById", frm, {
          headers: {
            ...frm.getHeaders(),
            ...headers
          },
          timeout: 10000 // 10 segundos de timeout
        });

        if (response.status !== 200) {
          throw new Error(`External service returned status ${response.status}`);
        }

        const data = response.data;
        if (data.mensaje?.toString().toLowerCase().includes('no se encontró ningún registro')) {
          return { results: [] };
        } else if (data.resultados && data.resultados.length > 0) {
          return {
            results: data.resultados.map((e: any) => ({
              dni: e.numero,
              names: e.nombres,
              surname: {
                maternal: e.apellido_materno,
                paternal: e.apellido_paterno
              }
            }))
          };
        } else {
          return { results: [] };
        }
      } catch (error: any) {
        if (count > 3) {
          throw error;
        } else {
          count++;
          await sleep(500); // Esperar un poco más entre reintentos
          return goDNI();
        }
      }
    };

    try {
      const result = await goDNI();
      res.json(result);
    } catch (error: any) {
      console.error("DNI Search error:", error.message);
      const status = error.response?.status || 500;
      const message = error.response?.data?.mensaje || "Error al conectar con el servicio de DNI. Es posible que el servicio esté saturado o bloqueado.";
      res.status(status).json({ error: message });
    }
  });

  // API para buscar DNI por número usando Consultas Perú
  app.post("/api/dni/query", async (req, res) => {
    const { documentNumber } = req.body;
    const token = process.env.DNI_API_TOKEN || "393b8c4623f8525fc14326cabd0aed46da56ac983910ae99e4f05c34afaee0f5";

    if (!documentNumber || documentNumber.length !== 8) {
      return res.status(400).json({ error: "Document number must be 8 digits" });
    }

    try {
      const response = await axios.post("https://api.consultasperu.com/api/v1/query", {
        token,
        type_document: "dni",
        document_number: documentNumber
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        res.json(response.data.data);
      } else {
        res.status(404).json({ error: response.data.message || "Not found" });
      }
    } catch (error: any) {
      console.error("Consultas Peru API error:", error.message);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Error al conectar con la API de Consultas Perú.";
      res.status(status).json({ error: message });
    }
  });

  // API para resolver dominios a IP
  app.post("/api/dns/resolve", async (req, res) => {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "Domain is required" });

    try {
      const { address } = await lookup(domain);
      res.json({ ip: address });
    } catch (error: any) {
      console.error("DNS Resolve error:", error.message);
      res.status(500).json({ error: "Could not resolve domain" });
    }
  });

  // API para buscar RUC usando Consultas Perú
  app.post("/api/ruc/query", async (req, res) => {
    const { documentNumber } = req.body;
    const token = process.env.DNI_API_TOKEN || "393b8c4623f8525fc14326cabd0aed46da56ac983910ae99e4f05c34afaee0f5";

    if (!documentNumber || documentNumber.length !== 11) {
      return res.status(400).json({ error: "RUC number must be 11 digits" });
    }

    try {
      const response = await axios.post("https://api.consultasperu.com/api/v1/query", {
        token,
        type_document: "ruc",
        document_number: documentNumber
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.success) {
        res.json(response.data.data);
      } else {
        res.status(404).json({ error: response.data.message || "Not found" });
      }
    } catch (error: any) {
      console.error("Consultas Peru RUC API error:", error.message);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || "Error al conectar con la API de Consultas Perú.";
      res.status(status).json({ error: message });
    }
  });

  // Vite middleware para desarrollo
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
