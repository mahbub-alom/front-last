const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com","i.ibb.co.com","iili.io","www.bigbustours.com"],
  },
};

module.exports = withNextIntl(nextConfig);
