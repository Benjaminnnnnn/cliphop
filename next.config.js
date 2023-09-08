/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: true,
  images: {
    domains: [
      "www.google.com",
      "lh3.googleusercontent.com",
      "images.ctfassets.net",
      "cdn3.iconfinder.com",
      "avatarfiles.alphacoders.com",
      "i.pinimg.com",
    ],
  },
};

module.exports = nextConfig;
