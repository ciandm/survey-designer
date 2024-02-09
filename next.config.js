/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/editor/:id',
        destination: '/editor/:id/build',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
