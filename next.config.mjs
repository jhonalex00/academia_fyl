/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración para permitir que el servidor personalizado maneje la API
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  // Configuración webpack para manejar módulos de Node.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No intentar cargar módulos de Node.js en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
        util: false,
        assert: false,
        buffer: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        child_process: false,
        dns: false,
        dgram: false,
        module: false,
        constants: false,
      };
    }
    return config;
  },
};

export default nextConfig;
