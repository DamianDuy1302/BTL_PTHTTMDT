/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: ".next", // Đảm bảo Next.js sử dụng thư mục đúng
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
  swcMinify: true,
};

module.exports = nextConfig;
