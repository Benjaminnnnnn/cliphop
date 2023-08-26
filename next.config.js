/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.google.com",
      "lh3.googleusercontent.com",
      "images.ctfassets.net",
      "cdn3.iconfinder.com",
      "avatarfiles.alphacoders.com",
    ],
  },
};

module.exports = nextConfig;
