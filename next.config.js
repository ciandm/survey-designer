/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/editor/:id',
        destination: '/editor/:id/designer',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
