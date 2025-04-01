/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Mặc định là true
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
