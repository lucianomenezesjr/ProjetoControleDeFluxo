import type { NextConfig } from 'next';

// next.config.ts
const nextConfig = {
  experimental: {
    // @ts-ignore (ignora erro de tipo temporariamente)
    allowedDevOrigins: [
      "localhost",
      "100.76.55.103",
      "10.109.3.116", // ⬅️ Substitua pelo IP DO SEU CELULAR
      "10.109.3.*",  // Permite qualquer IP na faixa 192.168.15.x
      "127.0.0.1",
    ],
  },
};

export default nextConfig;