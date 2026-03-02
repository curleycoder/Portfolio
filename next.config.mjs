/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://wuxvgozyycvqzhqowmmg.supabase.co",
      },
    ],
  },
};

export default nextConfig;