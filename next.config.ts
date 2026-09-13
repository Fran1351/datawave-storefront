/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes para optimización y dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permitir cualquier dominio HTTPS en desarrollo/pruebas
      },
      // Para mayor seguridad en producción, especifica tus dominios explícitos:
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      // },
    ],
  },
  // Optimización de compilación y salida limpia
  reactStrictMode: true,
};

export default nextConfig;