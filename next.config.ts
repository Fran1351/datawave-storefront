/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes para permitir dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite cualquier dominio HTTPS en desarrollo
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;