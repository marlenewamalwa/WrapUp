/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'udpbzouyxgtiukfwjxxx.supabase.co',
      },
    ],
  },
};

export default nextConfig;